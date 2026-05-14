export const mapViewBox = {
  width: 760,
  height: 540
};

export const chinaMainlandPath =
  "M88 196C107 168 122 151 145 144C174 136 187 106 215 94C244 82 273 99 305 91C337 83 361 104 386 93C421 80 457 99 472 127C486 151 514 149 537 164C558 178 558 205 586 214C622 226 654 247 674 274C694 300 706 321 674 330C650 337 655 358 628 379C612 391 611 418 589 431C564 446 541 429 524 454C505 482 468 470 448 491C426 514 395 481 366 476C340 471 318 497 289 472C265 452 252 418 219 414C185 410 163 389 141 361C116 330 120 304 94 281C67 258 76 223 88 196Z";

export const surroundingLandPaths = [
  "M0 0H760V118C712 103 682 112 644 97C591 76 540 86 492 70C446 55 408 41 363 52C325 61 286 38 241 52C194 66 165 51 123 71C76 94 37 92 0 80Z",
  "M0 84C35 90 76 96 112 120C145 142 153 174 134 203C117 231 82 222 57 249C36 270 42 310 0 333Z",
  "M0 317C42 320 73 346 95 382C126 432 173 445 202 493C217 517 239 531 272 540H0Z",
  "M573 223C618 208 654 215 690 245C727 277 750 315 760 356V540H585C612 501 657 489 665 440C671 401 628 392 612 359C590 315 546 282 573 223Z",
  "M348 540C376 508 414 497 449 513C479 526 514 514 548 540Z"
];

export const mapBorderLines = [
  "M92 194C65 189 38 194 13 210",
  "M674 274C704 257 731 253 760 260",
  "M589 431C630 450 666 474 695 509",
  "M141 361C111 384 82 408 54 430",
  "M215 94C205 62 198 32 194 0"
];

export const chinaIslandPaths = [
  "M410 402C424 392 447 395 456 409C441 423 418 422 408 412Z",
  "M523 340C540 354 544 382 529 409C512 390 507 361 523 340Z",
  "M462 458C468 455 475 457 478 464C472 470 464 469 460 463Z",
  "M502 476C508 474 514 477 517 482C511 487 504 486 500 481Z",
  "M548 462C554 460 560 462 563 468C557 473 550 472 546 467Z"
];

export const chinaInnerLines = [
  "M145 144C177 185 223 206 280 204C327 203 360 225 386 260",
  "M215 94C232 145 259 184 309 221C347 253 365 292 360 339",
  "M386 93C411 143 449 172 493 193C532 211 564 242 589 287",
  "M141 361C189 325 244 321 300 340C352 357 404 352 455 324C506 295 558 295 612 321",
  "M289 472C314 395 356 386 397 397C435 407 475 426 524 454",
  "M219 414C245 374 279 350 318 342C356 334 397 319 439 289",
  "M472 127C467 177 484 219 523 253C554 280 586 315 628 379"
];

export const litRegionShapes = [
  {
    id: "beijing",
    path: "M474 205L488 198L501 206L501 221L488 228L474 220Z",
    labelDx: 8,
    labelDy: -8
  },
  {
    id: "qingdao",
    path: "M506 244L526 237L540 249L531 265L510 263L499 253Z",
    labelDx: 10,
    labelDy: -8
  },
  {
    id: "shanghai",
    path: "M520 285L538 281L552 294L546 310L528 312L516 301Z",
    labelDx: 10,
    labelDy: -8
  },
  {
    id: "hangzhou",
    path: "M503 294L520 289L535 303L530 322L508 323L495 309Z",
    labelDx: 10,
    labelDy: 22
  },
  {
    id: "xiamen",
    path: "M488 344L506 340L517 354L511 369L492 369L482 356Z",
    labelDx: 10,
    labelDy: 22
  },
  {
    id: "guangzhou",
    path: "M441 358L463 350L482 364L476 385L451 389L435 374Z",
    labelDx: 12,
    labelDy: 24
  },
  {
    id: "changsha",
    path: "M437 305L462 298L481 316L471 339L445 339L428 321Z",
    labelDx: 10,
    labelDy: -10
  },
  {
    id: "chengdu",
    path: "M348 296L379 287L403 306L395 334L360 340L337 319Z",
    labelDx: 12,
    labelDy: -10
  },
  {
    id: "xian",
    path: "M397 250L421 239L443 255L437 281L408 285L390 267Z",
    labelDx: 10,
    labelDy: -10
  },
  {
    id: "lijiang",
    path: "M314 320L337 307L359 322L352 350L324 354L304 337Z",
    labelDx: -52,
    labelDy: 24
  }
];

export const mapTextLabels = [
  { text: "俄罗斯", x: 315, y: 58, size: 16, opacity: 0.34 },
  { text: "蒙古", x: 356, y: 186, size: 17, opacity: 0.38 },
  { text: "韩国", x: 650, y: 286, size: 15, opacity: 0.38 },
  { text: "日本", x: 708, y: 354, size: 15, opacity: 0.32 },
  { text: "印度", x: 66, y: 445, size: 16, opacity: 0.28 },
  { text: "缅甸", x: 283, y: 439, size: 15, opacity: 0.3 },
  { text: "泰国", x: 339, y: 506, size: 15, opacity: 0.28 },
  { text: "南海", x: 563, y: 442, size: 15, opacity: 0.24 },
  { text: "黄海", x: 600, y: 285, size: 14, opacity: 0.28 },
  { text: "东海", x: 589, y: 338, size: 14, opacity: 0.26 }
];

export const dormantCityAnchors = [
  { id: "harbin", city: "哈尔滨", coordinates: [126.6424, 45.7569] as [number, number] },
  { id: "changchun", city: "长春", coordinates: [125.3235, 43.8171] as [number, number] },
  { id: "shenyang", city: "沈阳", coordinates: [123.4315, 41.8057] as [number, number] },
  { id: "dalian", city: "大连", coordinates: [121.6147, 38.914] as [number, number] },
  { id: "tianjin", city: "天津", coordinates: [117.2008, 39.0842] as [number, number] },
  { id: "shijiazhuang", city: "石家庄", coordinates: [114.5149, 38.0428] as [number, number] },
  { id: "taiyuan", city: "太原", coordinates: [112.5489, 37.8706] as [number, number] },
  { id: "hohhot", city: "呼和浩特", coordinates: [111.7492, 40.8426] as [number, number] },
  { id: "jinan", city: "济南", coordinates: [117.1201, 36.6512] as [number, number] },
  { id: "zhengzhou", city: "郑州", coordinates: [113.6254, 34.7466] as [number, number] },
  { id: "nanjing", city: "南京", coordinates: [118.7969, 32.0603] as [number, number] },
  { id: "hefei", city: "合肥", coordinates: [117.2272, 31.8206] as [number, number] },
  { id: "nanchang", city: "南昌", coordinates: [115.8582, 28.682] as [number, number] },
  { id: "fuzhou", city: "福州", coordinates: [119.2965, 26.0745] as [number, number] },
  { id: "wuhan", city: "武汉", coordinates: [114.3054, 30.5928] as [number, number] },
  { id: "chongqing", city: "重庆", coordinates: [106.5516, 29.563] as [number, number] },
  { id: "guiyang", city: "贵阳", coordinates: [106.6302, 26.647] as [number, number] },
  { id: "kunming", city: "昆明", coordinates: [102.8329, 24.8801] as [number, number] },
  { id: "nanning", city: "南宁", coordinates: [108.3669, 22.817] as [number, number] },
  { id: "lhasa", city: "拉萨", coordinates: [91.1322, 29.6604] as [number, number] },
  { id: "urumqi", city: "乌鲁木齐", coordinates: [87.6168, 43.8256] as [number, number] },
  { id: "lanzhou", city: "兰州", coordinates: [103.8343, 36.0611] as [number, number] },
  { id: "xining", city: "西宁", coordinates: [101.7782, 36.6171] as [number, number] },
  { id: "yinchuan", city: "银川", coordinates: [106.2309, 38.4872] as [number, number] },
  { id: "haikou", city: "海口", coordinates: [110.3312, 20.0311] as [number, number] },
  { id: "sanya", city: "三亚", coordinates: [109.5119, 18.2528] as [number, number] },
  { id: "hongkong", city: "香港", coordinates: [114.1694, 22.3193] as [number, number] },
  { id: "macau", city: "澳门", coordinates: [113.5439, 22.1987] as [number, number] },
  { id: "taipei", city: "台北", coordinates: [121.5654, 25.033] as [number, number] }
];

export const projectionBounds = {
  minLng: 73,
  maxLng: 135,
  minLat: 18,
  maxLat: 54,
  paddingX: 90,
  paddingY: 84,
  width: 560,
  height: 330
};

export const starDust = [
  { x: 122, y: 118, size: 1.4, opacity: 0.34 },
  { x: 202, y: 96, size: 1.1, opacity: 0.22 },
  { x: 282, y: 142, size: 1.8, opacity: 0.32 },
  { x: 412, y: 102, size: 1.2, opacity: 0.26 },
  { x: 548, y: 136, size: 1.6, opacity: 0.28 },
  { x: 636, y: 220, size: 1.2, opacity: 0.3 },
  { x: 596, y: 330, size: 1.7, opacity: 0.26 },
  { x: 470, y: 416, size: 1.2, opacity: 0.24 },
  { x: 328, y: 408, size: 1.5, opacity: 0.3 },
  { x: 188, y: 344, size: 1.1, opacity: 0.24 },
  { x: 126, y: 244, size: 1.8, opacity: 0.3 },
  { x: 702, y: 282, size: 1.3, opacity: 0.24 },
  { x: 82, y: 408, size: 1.1, opacity: 0.18 },
  { x: 686, y: 116, size: 1.1, opacity: 0.2 }
];

export function projectCoordinate([lng, lat]: [number, number]) {
  const x =
    ((lng - projectionBounds.minLng) /
      (projectionBounds.maxLng - projectionBounds.minLng)) *
      projectionBounds.width +
    projectionBounds.paddingX;

  const y =
    (1 -
      (lat - projectionBounds.minLat) /
        (projectionBounds.maxLat - projectionBounds.minLat)) *
      projectionBounds.height +
    projectionBounds.paddingY;

  return { x, y };
}
