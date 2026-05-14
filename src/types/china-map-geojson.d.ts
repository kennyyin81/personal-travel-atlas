declare module "china-map-geojson" {
  export const ChinaData: unknown;
  export const ProvinceData: unknown;
}

declare module "china-map-geojson/lib/china" {
  const ChinaData: unknown;
  export default ChinaData;
}

declare module "china-map-geojson/lib/province" {
  const ProvinceData: unknown;
  export default ProvinceData;
}
