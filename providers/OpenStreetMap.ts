import { ProviderDefinition } from ".";

export const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export default {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  options: {
    maxZoom: 19,
    attribution,
  },
  variants: {
    Mapnik: {},
    DE: {
      url: "https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png",
      options: {
        maxZoom: 18,
      },
    },
    CH: {
      url: "https://tile.osm.ch/switzerland/{z}/{x}/{y}.png",
      options: {
        maxZoom: 18,
        bounds: [
          [45, 5],
          [48, 11],
        ],
      },
    },
    France: {
      url: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
      options: {
        maxZoom: 20,
        attribution:
          "&copy; OpenStreetMap France | {attribution.OpenStreetMap}",
      },
    },
    HOT: {
      url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      options: {
        attribution:
          "{attribution.OpenStreetMap}, " +
          'Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> ' +
          'hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
      },
    },
    BZH: {
      url: "https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png",
      options: {
        attribution:
          '{attribution.OpenStreetMap}, Tiles courtesy of <a href="http://www.openstreetmap.bzh/" target="_blank">Breton OpenStreetMap Team</a>',
        bounds: [
          [46.2, -5.5],
          [50, 0.7],
        ],
      },
    },
  },
} as ProviderDefinition;
