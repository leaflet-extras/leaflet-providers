import { ProviderDefinition } from ".";

export const attribution = "Tiles &copy; Esri";

export default {
  url: "https://server.arcgisonline.com/ArcGIS/rest/services/{variant}/MapServer/tile/{z}/{y}/{x}",
  options: {
    variant: "World_Street_Map",
    attribution,
  },
  variants: {
    WorldStreetMap: {
      options: {
        attribution:
          "{attribution.Esri} &mdash; " +
          "Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012",
      },
    },
    DeLorme: {
      options: {
        variant: "Specialty/DeLorme_World_Base_Map",
        minZoom: 1,
        maxZoom: 11,
        attribution: "{attribution.Esri} &mdash; Copyright: &copy;2012 DeLorme",
      },
    },
    WorldTopoMap: {
      options: {
        variant: "World_Topo_Map",
        attribution:
          "{attribution.Esri} &mdash; " +
          "Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
      },
    },
    WorldImagery: {
      options: {
        variant: "World_Imagery",
        attribution:
          "{attribution.Esri} &mdash; " +
          "Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      },
    },
    WorldTerrain: {
      options: {
        variant: "World_Terrain_Base",
        maxZoom: 13,
        attribution:
          "{attribution.Esri} &mdash; " +
          "Source: USGS, Esri, TANA, DeLorme, and NPS",
      },
    },
    WorldShadedRelief: {
      options: {
        variant: "World_Shaded_Relief",
        maxZoom: 13,
        attribution: "{attribution.Esri} &mdash; Source: Esri",
      },
    },
    WorldPhysical: {
      options: {
        variant: "World_Physical_Map",
        maxZoom: 8,
        attribution:
          "{attribution.Esri} &mdash; Source: US National Park Service",
      },
    },
    OceanBasemap: {
      options: {
        variant: "Ocean_Basemap",
        maxZoom: 13,
        attribution:
          "{attribution.Esri} &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri",
      },
    },
    NatGeoWorldMap: {
      options: {
        variant: "NatGeo_World_Map",
        maxZoom: 16,
        attribution:
          "{attribution.Esri} &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC",
      },
    },
    WorldGrayCanvas: {
      options: {
        variant: "Canvas/World_Light_Gray_Base",
        maxZoom: 16,
        attribution: "{attribution.Esri} &mdash; Esri, DeLorme, NAVTEQ",
      },
    },
  },
} as ProviderDefinition;
