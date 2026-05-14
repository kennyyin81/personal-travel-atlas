"use client";

import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts/core";
import { EffectScatterChart, LinesChart, MapChart, ScatterChart } from "echarts/charts";
import { GeoComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import ChinaData from "china-map-geojson/lib/china";
import ProvinceData from "china-map-geojson/lib/province";
import { motion } from "framer-motion";
import type { TravelItem } from "@/data/travel";
import { fadeUp } from "./motion-presets";

echarts.use([CanvasRenderer, EffectScatterChart, GeoComponent, LinesChart, MapChart, ScatterChart, TooltipComponent]);

type TravelMapProps = {
  items: TravelItem[];
};

type EChartsInstance = echarts.ECharts;

type GeoFeature = {
  type: "Feature";
  properties?: {
    name?: string;
    cp?: [number, number];
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

const directAdminRegions = new Set(["北京", "上海", "天津", "重庆", "香港", "澳门", "台湾"]);
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

  const visited = useMemo(
    () => items.filter((item) => item.visited).sort((a, b) => a.date.localeCompare(b.date)),
    [items]
  );

  const visitedByCityName = useMemo(() => {
    const map = new Map<string, TravelItem>();
    visited.forEach((item) => map.set(normalizeCityName(item.city), item));
    return map;
  }, [visited]);

  const cityAreaData = useMemo(
    () =>
      chinaCityGeoJson.features.map((feature) => {
        const featureName = feature.properties?.name ?? "";
        const travelItem = visitedByCityName.get(normalizeCityName(featureName));

        return {
          name: featureName,
          value: travelItem ? 1 : 0,
          item: travelItem,
          itemStyle: travelItem
            ? {
                areaColor: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [
                    { offset: 0, color: "rgba(81, 255, 246, 0.96)" },
                    { offset: 0.48, color: "rgba(20, 196, 204, 0.76)" },
                    { offset: 1, color: "rgba(82, 168, 255, 0.66)" }
                  ]
                },
                borderColor: "rgba(196, 255, 255, 0.96)",
                borderWidth: 1.25,
                shadowBlur: 28,
                shadowColor: "rgba(55, 245, 255, 0.64)"
              }
            : undefined
        };
      }),
    [visitedByCityName]
  );

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
              shadowBlur: 34,
              shadowColor: "rgba(80, 255, 244, 0.72)"
            }
          };
        })
        .filter(Boolean),
    [visitedByCityName]
  );

  const dormantCityData = useMemo(
    () => {
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
    [visitedByCityName]
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

    chart.dispatchAction({
      type: "geoRoam",
      componentType: "geo",
      zoom: factor,
      originX: chart.getWidth() / 2,
      originY: chart.getHeight() / 2
    });
  };

  const resetView = () => {
    const chart = chartInstanceRef.current;
    if (!chart) {
      return;
    }

    chart.setOption({
      geo: {
        zoom: 1,
        layoutCenter: ["50%", "52%"],
        layoutSize: "100%"
      }
    });
  };

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    echarts.registerMap("china-city-travel", chinaCityGeoJson as never);

    const chart = echarts.init(chartRef.current, "dark", { renderer: "canvas" });
    chartInstanceRef.current = chart;

    chart.setOption({
      backgroundColor: "transparent",
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
        map: "china-city-travel",
        roam: true,
        zoom: 1,
        scaleLimit: {
          min: 0.82,
          max: 8
        },
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
          shadowBlur: 12,
          shadowColor: "rgba(0, 0, 0, 0.28)"
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
          name: "中国城市",
          type: "map",
          map: "china-city-travel",
          geoIndex: 0,
          data: cityAreaData,
          selectedMode: false,
          label: {
            show: false
          },
          emphasis: {
            itemStyle: {
              areaColor: "rgba(57, 226, 226, 0.82)",
              borderColor: "rgba(255, 255, 255, 0.78)",
              borderWidth: 1.1,
              shadowBlur: 22,
              shadowColor: "rgba(57, 226, 226, 0.44)"
            },
            label: {
              show: false
            }
          },
          itemStyle: {
            areaColor: "rgba(20, 58, 70, 0.76)",
            borderColor: "rgba(188, 218, 232, 0.26)",
            borderWidth: 0.55
          }
        },
        {
          name: "省级边界",
          type: "lines",
          coordinateSystem: "geo",
          zlevel: 4,
          polyline: true,
          data: provinceBoundaryData,
          silent: true,
          lineStyle: {
            color: "rgba(240, 249, 255, 0.72)",
            width: 1.35,
            opacity: 0.95,
            shadowBlur: 12,
            shadowColor: "rgba(125, 230, 255, 0.28)"
          }
        },
        {
          name: "未点亮城市",
          type: "scatter",
          coordinateSystem: "geo",
          zlevel: 5,
          data: dormantCityData,
          symbolSize: 2.6,
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
          zlevel: 7,
          data: cityPointData,
          symbolSize: 9,
          rippleEffect: {
            brushType: "stroke",
            scale: 4.8,
            period: 4.2
          },
          showEffectOn: "render",
          itemStyle: {
            color: "#72fff4",
            borderColor: "#ffffff",
            borderWidth: 1.25,
            shadowBlur: 28,
            shadowColor: "rgba(87, 255, 244, 0.96)"
          },
          label: {
            show: true,
            formatter: "{b}",
            position: "right",
            color: "#ffffff",
            fontSize: 12,
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

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, [cityAreaData, cityPointData, dormantCityData, visitedAreaRegions]);

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

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#030a14]/92 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="map-silk pointer-events-none absolute inset-0 opacity-80" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,213,221,0.08)_0,transparent_44%,rgba(3,8,18,0.76)_100%)]" />

        <div className="relative h-[520px] sm:h-[640px] lg:h-[760px]">
          <div ref={chartRef} className="h-full w-full" />
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
