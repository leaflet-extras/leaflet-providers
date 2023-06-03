import * as L from "leaflet";

export type ProviderDefinition = {
  url: string;
  options: L.TileLayerOptions;
  variants?: Record<string, string | Partial<ProviderDefinition>>;
};

export { default as Esri, attribution as esriAttribution } from "./Esri";

export {
  default as OpenStreetMap,
  attribution as osmAttribution,
} from "./OpenStreetMap";
