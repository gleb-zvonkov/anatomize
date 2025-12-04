import { Region } from "../types/types";

/**
 * REGION_ITEMS
 * A list of all anatomical regions shown in the app.
 * Each item provides:
 *   - `key`: the internal region identifier (must match the Region type)
 *   - `label`: the human-readable name shown in the UI
 */
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

/**
 * Extract just the region keys from REGION_ITEMS.
 */
export const ALL_REGIONS: Region[] = REGION_ITEMS.map((item) => item.key);

/**
 * regionImages
 * A mapping from each region to its corresponding image asset.
 * Used to display images for each anatomical region in the UI.
 */
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
