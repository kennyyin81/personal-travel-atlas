"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts/core";
import { EffectScatterChart, LinesChart, ScatterChart } from "echarts/charts";
import { GeoComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import ChinaData from "china-map-geojson/lib/china";
import ProvinceData from "china-map-geojson/lib/province";
import TaiwanCountyData from "@/data/taiwan-counties.geo.json";
import { motion } from "framer-motion";
import type { TravelItem } from "@/data/travel";
import { fadeUp } from "./motion-presets";

echarts.use([CanvasRenderer, EffectScatterChart, GeoComponent, LinesChart, ScatterChart, TooltipComponent]);

type TravelMapProps = {
  items: TravelItem[];
};

type EChartsInstance = echarts.ECharts;

type GeoFeature = {
  type: "Feature";
  properties?: {
    name?: string;
    cp?: [number, number];
    county?: string;
  };
  geometry?: unknown;
};

type GeoCollection = {
  type?: "FeatureCollection";
  features?: GeoFeature[];
};

type CityFeatureCollection = {
  type: "FeatureCollection";
  features: GeoFeature[];
};

const directAdminRegions = new Set(["北京", "上海", "天津", "重庆", "香港", "澳门"]);
const directProvinceKeys = new Set(["Beijing", "Shanghai", "Tianjin", "Chongqing", "Xianggang", "Aomen", "Taiwan"]);
const includeAllFeatureProvinceKeys = new Set(["Hainan"]);
const directAdminCenters: Record<string, [number, number]> = {
  北京: [116.4074, 39.9042],
  上海: [121.4737, 31.2304],
  天津: [117.2008, 39.0842],
  重庆: [106.5516, 29.563],
  香港: [114.1694, 22.3193],
  澳门: [113.5439, 22.1987],
  台湾: [121.0254, 23.5986]
};

const supplementalCityAnchors = [
  { name: "台北市", value: [121.5654, 25.033, 0], priority: true },
  { name: "新北市", value: [121.4628, 25.0169, 0] },
  { name: "桃园市", value: [121.3009, 24.9936, 0] },
  { name: "台中市", value: [120.6736, 24.1477, 0] },
  { name: "台南市", value: [120.227, 22.9999, 0] },
  { name: "高雄市", value: [120.3014, 22.6273, 0], priority: true },
  { name: "基隆市", value: [121.7392, 25.1276, 0] },
  { name: "新竹市", value: [120.9687, 24.8039, 0] },
  { name: "嘉义市", value: [120.4491, 23.4801, 0] },
  { name: "宜兰县", value: [121.753, 24.7597, 0] },
  { name: "花莲县", value: [121.6015, 23.9872, 0] },
  { name: "台东县", value: [121.1438, 22.7583, 0] },
  { name: "澎湖县", value: [119.5664, 23.5655, 0] },
  { name: "三沙市", value: [112.3387, 16.831, 0], priority: true }
];

const cityNameAliases: Record<string, string> = {
  黔西南布依族苗族自治州: "黔西南",
  大理白族自治州: "大理",
  陵水黎族自治县: "陵水"
};

function normalizeTaiwanCountyName(name: string) {
  const explicitNames: Record<string, string> = {
    臺北市: "台北市",
    新北市: "新北市",
    桃園縣: "桃园市",
    桃園市: "桃园市",
    臺中市: "台中市",
    臺南市: "台南市",
    高雄市: "高雄市",
    基隆市: "基隆市",
    新竹市: "新竹市",
    嘉義市: "嘉义市",
    新竹縣: "新竹县",
    苗栗縣: "苗栗县",
    彰化縣: "彰化县",
    南投縣: "南投县",
    雲林縣: "云林县",
    嘉義縣: "嘉义县",
    屏東縣: "屏东县",
    宜蘭縣: "宜兰县",
    花蓮縣: "花莲县",
    臺東縣: "台东县",
    澎湖縣: "澎湖县",
    金門縣: "金门县",
    連江縣: "连江县"
  };

  return explicitNames[name] ?? name.replace(/臺/g, "台").replace(/縣/g, "县").replace(/蘭/g, "兰");
}

function collectCoordinatePairs(input: unknown, pairs: [number, number][] = []) {
  if (!Array.isArray(input)) {
    return pairs;
  }

  if (
    input.length >= 2 &&
    typeof input[0] === "number" &&
    typeof input[1] === "number"
  ) {
    pairs.push([input[0], input[1]]);
    return pairs;
  }

  input.forEach((item) => collectCoordinatePairs(item, pairs));
  return pairs;
}

function getGeometryCenter(geometry: unknown): [number, number] | undefined {
  const pairs = collectCoordinatePairs((geometry as { coordinates?: unknown } | undefined)?.coordinates);

  if (!pairs.length) {
    return undefined;
  }

  const bounds = pairs.reduce(
    (acc, [lng, lat]) => ({
      minLng: Math.min(acc.minLng, lng),
      maxLng: Math.max(acc.maxLng, lng),
      minLat: Math.min(acc.minLat, lat),
      maxLat: Math.max(acc.maxLat, lat)
    }),
    {
      minLng: Infinity,
      maxLng: -Infinity,
      minLat: Infinity,
      maxLat: -Infinity
    }
  );

  return [(bounds.minLng + bounds.maxLng) / 2, (bounds.minLat + bounds.maxLat) / 2];
}

function normalizeCityName(name: string) {
  return (cityNameAliases[name] ?? name)
    .replace(/特别行政区$/, "")
    .replace(/自治州$/, "")
    .replace(/自治县$/, "")
    .replace(/地区$/, "")
    .replace(/盟$/, "")
    .replace(/市$/, "")
    .replace(/县$/, "");
}

function isCityLevelName(name: string) {
  return /(市|自治州|地区|盟|林区)$/.test(name);
}

function buildChinaCityGeoJson(): CityFeatureCollection {
  const features: GeoFeature[] = [];
  const provinceCollections = ProvinceData as Record<string, GeoCollection>;

  Object.entries(provinceCollections).forEach(([key, collection]) => {
    if (directProvinceKeys.has(key)) {
      return;
    }

    collection.features?.forEach((feature) => {
      const name = feature.properties?.name;

      if (!name || !feature.properties?.cp) {
        return;
      }

      if (!includeAllFeatureProvinceKeys.has(key) && !isCityLevelName(name)) {
        return;
      }

      features.push(feature);
    });
  });

  (ChinaData as GeoCollection).features?.forEach((feature) => {
    const name = feature.properties?.name;

    if (!name || !directAdminRegions.has(name)) {
      return;
    }

    features.push({
      ...feature,
      properties: {
        ...feature.properties,
        cp: feature.properties?.cp ?? directAdminCenters[name]
      }
    });
  });

  (TaiwanCountyData as GeoCollection).features?.forEach((feature) => {
    const countyName = feature.properties?.county;

    if (!countyName) {
      return;
    }

    features.push({
      ...feature,
      properties: {
        ...feature.properties,
        name: normalizeTaiwanCountyName(countyName),
        cp: feature.properties?.cp ?? getGeometryCenter(feature.geometry)
      }
    });
  });

  return {
    type: "FeatureCollection",
    features
  };
}

const chinaCityGeoJson = buildChinaCityGeoJson();

function extractBoundaryLines(collection: GeoCollection) {
  const lines: { coords: [number, number][] }[] = [];

  collection.features?.forEach((feature) => {
    const geometry = feature.geometry as
      | { type: "Polygon"; coordinates: [number, number][][] }
      | { type: "MultiPolygon"; coordinates: [number, number][][][] }
      | undefined;

    if (!geometry) {
      return;
    }

    if (geometry.type === "Polygon") {
      geometry.coordinates.forEach((ring) => lines.push({ coords: ring }));
      return;
    }

    if (geometry.type === "MultiPolygon") {
      geometry.coordinates.forEach((polygon) => {
        polygon.forEach((ring) => lines.push({ coords: ring }));
      });
    }
  });

  return lines;
}

const provinceBoundaryData = extractBoundaryLines(ChinaData as GeoCollection);
const mapZoomLimits = {
  min: 0.82,
  max: 8
};

function makeTooltip(item: TravelItem) {
  const tags = item.tags.map((tag) => `<span class="map-tooltip-tag">${tag}</span>`).join("");

  return `
    <div class="map-tooltip">
      <div class="map-tooltip-eyebrow">已点亮城市</div>
      <div class="map-tooltip-title">${item.city}</div>
      <div class="map-tooltip-meta">${item.province} · ${item.date}</div>
      <div class="map-tooltip-desc">${item.description}</div>
      <div class="map-tooltip-tags">${tags}</div>
    </div>
  `;
}

export function TravelMap({ items }: TravelMapProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<EChartsInstance | null>(null);
  const mapWrapperRef = useRef<HTMLDivElement | null>(null);
  const [shouldInitChart, setShouldInitChart] = useState(false);
  const [isCompactMap, setIsCompactMap] = useState(false);

  const visited = useMemo(
    () => items.filter((item) => item.visited).sort((a, b) => a.date.localeCompare(b.date)),
    [items]
  );

  const visitedByCityName = useMemo(() => {
    const map = new Map<string, TravelItem>();
    visited.forEach((item) => map.set(normalizeCityName(item.city), item));
    return map;
  }, [visited]);

  const visitedAreaRegions = useMemo(
    () =>
      chinaCityGeoJson.features
        .map((feature) => {
          const featureName = feature.properties?.name ?? "";
          const travelItem = visitedByCityName.get(normalizeCityName(featureName));

          if (!travelItem) {
            return null;
          }

          return {
            name: featureName,
            itemStyle: {
              areaColor: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 1,
                y2: 1,
                colorStops: [
                  { offset: 0, color: "rgba(125, 255, 244, 0.98)" },
                  { offset: 0.52, color: "rgba(33, 212, 220, 0.84)" },
                  { offset: 1, color: "rgba(78, 151, 255, 0.76)" }
                ]
              },
              borderColor: "rgba(232, 255, 255, 0.98)",
              borderWidth: 1.35,
              shadowBlur: isCompactMap ? 0 : 10,
              shadowColor: "rgba(80, 255, 244, 0.36)"
            }
          };
        })
        .filter(Boolean),
    [isCompactMap, visitedByCityName]
  );

  const dormantCityData = useMemo(
    () => {
      if (isCompactMap) {
        return supplementalCityAnchors
          .filter((item) => item.priority)
          .filter((item) => !visitedByCityName.has(normalizeCityName(item.name)))
          .map((item) => ({
            name: item.name,
            value: item.value as [number, number, number],
            label: { show: false }
          }));
      }

      const baseCities = chinaCityGeoJson.features
        .filter((feature) => {
          const featureName = feature.properties?.name ?? "";
          return !visitedByCityName.has(normalizeCityName(featureName));
        })
        .map((feature) => ({
          name: feature.properties?.name ?? "",
          value: [feature.properties?.cp?.[0] ?? 0, feature.properties?.cp?.[1] ?? 0, 0] as [number, number, number],
          label: undefined
        }));

      const existingNames = new Set(baseCities.map((item) => normalizeCityName(item.name)));
      const supplementalCities = supplementalCityAnchors
        .filter((item) => !visitedByCityName.has(normalizeCityName(item.name)))
        .filter((item) => !existingNames.has(normalizeCityName(item.name)) || item.priority)
        .map((item) => ({
          name: item.name,
          value: item.value as [number, number, number],
          label: item.priority ? { show: true, formatter: "{b}" } : undefined
        }));

      return [...baseCities, ...supplementalCities];
    },
    [isCompactMap, visitedByCityName]
  );

  const cityPointData = useMemo(
    () =>
      visited.map((item) => ({
        name: item.city,
        value: [item.coordinates[0], item.coordinates[1], 1],
        item
      })),
    [visited]
  );

  const applyZoom = (factor: number) => {
    const chart = chartInstanceRef.current;
    if (!chart) {
      return;
    }

    const originX = chart.getWidth() / 2;
    const originY = chart.getHeight() / 2;

    chart.getZr().trigger("mousewheel", {
      type: "mousewheel",
      offsetX: originX,
      offsetY: originY,
      zrX: originX,
      zrY: originY,
      wheelDelta: factor > 1 ? 2 : -2,
      event: {
        altKey: false,
        ctrlKey: false,
        shiftKey: false,
        preventDefault() {},
        stopPropagation() {}
      }
    });
  };

  const resetView = () => {
    const chart = chartInstanceRef.current;
    if (!chart) {
      return;
    }

    chart.setOption({
      geo: {
        id: "travel-china-geo",
        zoom: 1,
        layoutCenter: ["50%", "52%"],
        layoutSize: "100%"
      }
    });
  };

  useEffect(() => {
    const updateCompactMode = () => setIsCompactMap(window.matchMedia("(max-width: 640px)").matches);
    updateCompactMode();

    window.addEventListener("resize", updateCompactMode);

    return () => window.removeEventListener("resize", updateCompactMode);
  }, []);

  useEffect(() => {
    if (!mapWrapperRef.current || shouldInitChart) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldInitChart(true);
          observer.disconnect();
        }
      },
      { rootMargin: "220px 0px" }
    );

    observer.observe(mapWrapperRef.current);

    return () => observer.disconnect();
  }, [shouldInitChart]);

  useEffect(() => {
    if (!chartRef.current || !shouldInitChart) {
      return;
    }

    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispose();
      chartInstanceRef.current = null;
    }

    echarts.registerMap("china-city-travel", chinaCityGeoJson as never);

    const chart = echarts.init(chartRef.current, "dark", { renderer: "canvas", useDirtyRect: true });
    chartInstanceRef.current = chart;

    chart.setOption({
      backgroundColor: "transparent",
      animation: false,
      tooltip: {
        trigger: "item",
        confine: true,
        borderWidth: 0,
        padding: 0,
        backgroundColor: "transparent",
        extraCssText: "box-shadow:none;",
        formatter: (params: unknown) => {
          const data = (params as { data?: { item?: TravelItem; name?: string }; name?: string }).data;

          if (data?.item) {
            return makeTooltip(data.item);
          }

          const name = data?.name ?? (params as { name?: string }).name;
          if (name) {
            return `
              <div class="map-tooltip compact">
                <div class="map-tooltip-eyebrow">未点亮城市</div>
                <div class="map-tooltip-title">${name}</div>
                <div class="map-tooltip-meta">等待下一次出发</div>
              </div>
            `;
          }

          return "";
        }
      },
      geo: {
        id: "travel-china-geo",
        map: "china-city-travel",
        roam: true,
        zoom: 1,
        scaleLimit: mapZoomLimits,
        aspectScale: 0.9,
        layoutCenter: ["50%", "52%"],
        layoutSize: "100%",
        itemStyle: {
          areaColor: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(27, 68, 76, 0.9)" },
              { offset: 0.52, color: "rgba(16, 47, 61, 0.9)" },
              { offset: 1, color: "rgba(18, 39, 66, 0.92)" }
            ]
          },
          borderColor: "rgba(194, 220, 232, 0.26)",
          borderWidth: 0.58,
          shadowBlur: 0,
          shadowColor: "transparent"
        },
        regions: visitedAreaRegions,
        emphasis: {
          itemStyle: {
            areaColor: "rgba(28, 108, 112, 0.92)",
            borderColor: "rgba(255,255,255,0.58)",
            borderWidth: 0.9
          },
          label: {
            show: false
          }
        }
      },
      series: [
        {
          name: "省级边界",
          type: "lines",
          coordinateSystem: "geo",
          z: 4,
          polyline: true,
          data: provinceBoundaryData,
          silent: true,
          lineStyle: {
            color: "rgba(240, 249, 255, 0.72)",
            width: isCompactMap ? 0.9 : 1.15,
            opacity: 0.86
          }
        },
        {
          name: "未点亮城市",
          type: "scatter",
          coordinateSystem: "geo",
          z: 5,
          data: dormantCityData,
          symbolSize: isCompactMap ? 1.8 : 2.6,
          itemStyle: {
            color: "rgba(222, 241, 249, 0.24)",
            borderColor: "rgba(222, 241, 249, 0.28)",
            borderWidth: 0.45
          },
          label: {
            show: false
          },
          emphasis: {
            itemStyle: {
              color: "rgba(255,255,255,0.72)"
            },
            label: {
              show: true,
              formatter: "{b}",
              position: "right",
              color: "rgba(255,255,255,0.88)",
              fontSize: 11,
              fontWeight: 700,
              textBorderColor: "rgba(2, 8, 16, 0.95)",
              textBorderWidth: 3
            }
          }
        },
        {
          name: "已点亮城市",
          type: "effectScatter",
          coordinateSystem: "geo",
          z: 7,
          data: cityPointData,
          symbolSize: isCompactMap ? 7 : 9,
          rippleEffect: {
            brushType: "stroke",
            scale: isCompactMap ? 3.1 : 4.8,
            period: 4.2
          },
          showEffectOn: "emphasis",
          itemStyle: {
            color: "#72fff4",
            borderColor: "#ffffff",
            borderWidth: 1.25,
            shadowBlur: isCompactMap ? 8 : 16,
            shadowColor: "rgba(87, 255, 244, 0.96)"
          },
          label: {
            show: !isCompactMap,
            formatter: "{b}",
            position: "right",
            color: "#ffffff",
            fontSize: 11,
            fontWeight: 800,
            textBorderColor: "rgba(2, 8, 16, 0.96)",
            textBorderWidth: 3
          },
          emphasis: {
            scale: 1.35,
            label: {
              show: true,
              color: "#ffffff"
            }
          }
        }
      ]
    });

    let resizeFrame = 0;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => chart.resize());
    });
    resizeObserver.observe(chartRef.current);

    return () => {
      cancelAnimationFrame(resizeFrame);
      resizeObserver.disconnect();
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, [cityPointData, dormantCityData, isCompactMap, shouldInitChart, visitedAreaRegions]);

  return (
    <motion.div
      className="glass relative overflow-hidden rounded-[28px] p-4 shadow-glow sm:p-6 lg:p-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeUp}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_16%,rgba(66,255,238,0.16),transparent_23rem),radial-gradient(circle_at_76%_72%,rgba(91,130,255,0.12),transparent_28rem)]" />
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />

      <div ref={mapWrapperRef} className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#030a14]/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="map-silk pointer-events-none absolute inset-0 opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,213,221,0.08)_0,transparent_44%,rgba(3,8,18,0.76)_100%)]" />

        <div className="relative h-[520px] sm:h-[640px] lg:h-[760px]">
          <div ref={chartRef} className="h-full w-full" />
          {!shouldInitChart ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/60 backdrop-blur-xl">
                地图即将加载
              </div>
            </div>
          ) : null}
          <div className="absolute right-4 top-4 z-10 flex overflow-hidden rounded-2xl border border-white/10 bg-[#06131d]/74 shadow-[0_18px_60px_rgba(0,0,0,0.36)] backdrop-blur-xl">
            <button
              aria-label="放大地图"
              className="h-10 w-11 border-r border-white/10 text-lg font-semibold text-white/82 transition hover:bg-white/10"
              type="button"
              onClick={() => applyZoom(1.25)}
            >
              +
            </button>
            <button
              aria-label="缩小地图"
              className="h-10 w-11 border-r border-white/10 text-lg font-semibold text-white/82 transition hover:bg-white/10"
              type="button"
              onClick={() => applyZoom(0.8)}
            >
              -
            </button>
            <button
              aria-label="重置地图视图"
              className="h-10 px-3 text-xs font-semibold text-white/72 transition hover:bg-white/10"
              type="button"
              onClick={resetView}
            >
              复位
            </button>
          </div>
        </div>

        <div className="relative flex flex-col gap-3 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-cyan">China Travel Atlas</p>
            <p className="mt-2 text-sm leading-6 text-white/58">
              支持拖拽和滚轮缩放；已到达城市整块市域点亮，全国市级以上城市以暗点保留。
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/[0.055] px-4 py-2 text-sm text-white/70">
            已点亮：<span className="text-white">{visited.length} 座城市</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
