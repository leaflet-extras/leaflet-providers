import * as L from "leaflet";
import {
  ProviderDefinition,
  osmAttribution,
  esriAttribution,
} from "./providers";

interface ProviderLayer extends L.TileLayer {
  new (
    provider: ProviderDefinition,
    variantName: string,
    options?: L.TileLayerOptions
  ): ProviderLayer;
}

export const Provider: ProviderLayer = L.TileLayer.extend({
  initialize(
    provider: ProviderDefinition,
    variantName: string,
    options?: L.TileLayerOptions
  ) {
    if (typeof provider !== "object") {
      throw "No such provider!";
    }

    // overwrite values in provider from variant.
    if (variantName && typeof provider.variants === "object") {
      const variant = provider.variants[variantName];
      if (typeof variant !== "string" && typeof variant !== "object") {
        throw "No such variant (" + variantName + ")";
      }
      const variantOptions =
        typeof variant === "string" ? { variant } : variant.options;
      provider = {
        url: (typeof variant === "object" && variant.url) || provider.url,
        options: L.Util.extend({}, provider.options, variantOptions),
        variants: {},
      };
    }

    if (typeof provider.options.attribution === "string") {
      provider.options.attribution = provider.options.attribution
        .replace(/\{attribution.OpenStreetMap\}/, osmAttribution)
        .replace(/\{attribution.Esri\}/g, esriAttribution);
    }

    // Compute final options combining provider options with any user overrides
    const layerOpts = L.Util.extend({}, provider.options, options);
    (L.TileLayer.prototype as any).initialize.call(
      this,
      provider.url,
      layerOpts
    );
  },
}) as any;
