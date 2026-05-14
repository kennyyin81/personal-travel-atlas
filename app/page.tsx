import { Hero } from "@/components/hero";
import { SectionHeader } from "@/components/section-header";
import { Timeline } from "@/components/timeline";
import { TravelMap } from "@/components/travel-map";
import { travelItems } from "@/data/travel";

export default function Home() {
  const visited = travelItems.filter((item) => item.visited);
  const eastCity = visited.reduce((east, item) => (item.coordinates[0] > east.coordinates[0] ? item : east), visited[0]);
  const westCity = visited.reduce((west, item) => (item.coordinates[0] < west.coordinates[0] ? item : west), visited[0]);
  const southCity = visited.reduce((south, item) => (item.coordinates[1] < south.coordinates[1] ? item : south), visited[0]);
  const northCity = visited.reduce((north, item) => (item.coordinates[1] > north.coordinates[1] ? item : north), visited[0]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 soft-grid opacity-60" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.12),transparent_34rem),radial-gradient(circle_at_12%_72%,rgba(125,211,252,0.08),transparent_28rem),radial-gradient(circle_at_88%_64%,rgba(247,211,138,0.07),transparent_30rem)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(180deg,rgba(5,7,13,0)_0%,rgba(5,7,13,0.24)_48%,rgba(5,7,13,0.72)_100%)]" />

      <Hero
        cityCount={visited.length}
        directionalCities={{
          east: eastCity.city,
          west: westCity.city,
          south: southCity.city,
          north: northCity.city
        }}
      />

      <section id="travel-map" className="relative mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <SectionHeader
          eyebrow="China Travel Atlas"
          title="中国城市点亮地图"
          description="以中国地图为底，把去过的城市点亮成发光星点，未到达的城市安静留在暗处。"
        />
        <TravelMap items={travelItems} />
      </section>

      <section id="travel-timeline" className="relative mx-auto w-full max-w-7xl px-5 py-14 pb-24 sm:px-8 lg:py-20">
        <SectionHeader
          eyebrow="Travel Archive"
          title="旅行时间轴"
          description="按年份沉淀每一次出发，记录城市、季节、标签和当时最鲜明的片段。"
        />
        <Timeline items={travelItems} />
      </section>
    </main>
  );
}
