import { Region } from "../types/types";

export const REGION_ITEMS: { key: Region; label: string }[] = [
  { key: "back", label: "Back" },
  { key: "thorax", label: "Thorax" },
  { key: "abdomen", label: "Abdomen" },
  { key: "pelvis", label: "Pelvis" },
  { key: "perineum", label: "Perineum" },
  { key: "upperlimb", label: "Upper Limb" },
  { key: "lowerlimb", label: "Lower Limb" },
  { key: "neck", label: "Neck" },
  { key: "head", label: "Head" },
];

export const ALL_REGIONS: Region[] = REGION_ITEMS.map((item) => item.key);

export const regionImages: Record<Region, any> = {
  back: require("../region_images/back.png"),
  thorax: require("../region_images/thorax.png"),
  abdomen: require("../region_images/abdomen.png"),
  pelvis: require("../region_images/pelvis.png"),
  perineum: require("../region_images/perineum.png"),
  upperlimb: require("../region_images/upper_limb.png"),
  lowerlimb: require("../region_images/lower_limb.png"),
  neck: require("../region_images/neck.png"),
  head: require("../region_images/head.png"),
};
