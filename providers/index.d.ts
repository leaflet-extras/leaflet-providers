import * as L from "leaflet";

export type ProviderDefinition = {
  url: string;
  options: L.TileLayerOptions;
  variants?: Record<string, string | Partial<ProviderDefinition>>;
};
