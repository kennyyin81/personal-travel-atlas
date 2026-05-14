# 我走过的地方

一个深色高级风格的个人旅行主页，用来记录真实旅行足迹、点亮中国城市地图，并按时间轴沉淀每一次出发。

## 预览内容

- 首页首屏：展示已点亮城市数量，以及最东、最西、最南、最北抵达城市
- 中国城市点亮地图：基于 ECharts 中国地图，去过的城市区域高亮，支持缩放、拖拽和 hover 悬浮信息
- 旅行时间轴：按年份展示城市、时间、标签和描述
- 本地旅行数据：当前已内置 30 条真实城市记录

## 技术栈

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- ECharts
- china-map-geojson
- 本地 TypeScript 数据配置

## 本地运行

```bash
npm install
npm run dev
```

打开：

```text
http://localhost:3000
```

生产构建：

```bash
npm run build
npm run start
```

## 项目结构

```text
app/
  globals.css          全局样式、深色背景、玻璃拟态和地图 tooltip
  layout.tsx           页面元信息
  page.tsx             首页模块组合
src/
  components/
    hero.tsx           首屏与统计信息
    travel-map.tsx     ECharts 中国城市点亮地图
    timeline.tsx       年份旅行时间轴
    section-header.tsx 模块标题
    motion-presets.ts  动画预设
  data/
    travel.ts          本地旅行数据
  types/
    china-map-geojson.d.ts
public/
  images/travel/       旅行封面占位图
```

## 修改旅行数据

编辑 `src/data/travel.ts` 即可替换城市、描述、日期、标签、封面图和坐标。

```ts
{
  id: "changsha",
  city: "长沙",
  province: "湖南",
  date: "2019-06",
  year: 2019,
  tags: ["美食", "城市漫游"],
  description: "第一次认真感受长沙的夜生活和烟火气，把夏天留在了湘江边。",
  cover: "/images/travel/changsha.svg",
  visited: true,
  coordinates: [112.9388, 28.2282],
  note: "夜色、湘菜和橘子洲的风。"
}
```

坐标使用 `[经度, 纬度]`。地图会根据城市名称匹配行政区域，并用坐标显示发光点。

## GitHub 上传说明

项目已配置 `.gitignore`，不会上传 `node_modules/`、`.next/`、环境变量、日志和本地编辑器配置。

首次推送到 GitHub：

```bash
git add .
git commit -m "Initial travel atlas"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```
