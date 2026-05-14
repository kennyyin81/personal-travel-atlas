import type { TravelItem } from "@/data/travel";

export type ProjectedTravelItem = TravelItem & {
  x: number;
  y: number;
};
