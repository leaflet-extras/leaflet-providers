import * as L from "leaflet";
import { ProviderDefinition } from "./providers";

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

    // FIXME
    // replace attribution placeholders with their values from toplevel provider attribution,
    // recursively
    // const attributionReplacer = function (attr: string) {
    //   if (attr.indexOf("{attribution.") === -1) {
    //     return attr;
    //   }
    //   return attr.replace(/\{attribution.(\w*)\}/g, (match, attributionName) =>
    //     attributionReplacer(providers[attributionName].options.attribution)
    //   );
    // };
    // provider.options.attribution = attributionReplacer(
    //   provider.options.attribution
    // );

    // Compute final options combining provider options with any user overrides
    const layerOpts = L.Util.extend({}, provider.options, options);
    (L.TileLayer.prototype as any).initialize.call(
      this,
      provider.url,
      layerOpts
    );
  },
}) as any;
