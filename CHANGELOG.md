
# Leaflet-providers changelog

## master version

## 1.1.7 (2015-12-16)
 - Removed Acetate tile layers #198

## 1.1.6 (2015-11-03)
 - Removed most of the NLS layers per NLS request #193, fixes #178
 - Adde new variants to the HERE provider #183 by [@andreaswc](https://github.com/andreaswc)
 - Added some tests to make sure all the placeholders in the url template are replaced #188

## 1.1.5 (2015-10-01)
 - Improvements for the NLS layers #182 by [@tomhughes](https://github.com/tomhughes)
 - Check for valid bounds before fitting the preview map to undefined (fixes #185)
 - Add bounds for FreeMapSK (fixes #184)
 - Fix Stamen layers with `.jpg` extension (#187, fixes #184)

## 1.1.4 (2015-09-27)
 - Only include the interesting files in the npm package #180
 - Add GSGS_Ireland to NLS provider with `tms:true` to invert y-axis #181

## 1.1.3 (2015-09-26)
 - Add various historical layers of the Natioanal library of Scotland (NLS) #179
 - Add a page to visually check bounds #179

## 1.1.2 (2015-09-05)
 - Add CartoDB labels-only styles #170 by [@almccon](https://github.com/almccon)
 - Implement commonjs module #172
 - Added retina URL option #177, [@routexl](https://github.com/routexl)

## 1.1.1 (2015-06-22)
 - Update Mapbox API to v4 #167 by [@gutenye](https://github.com/gutenye)
 - Started maintaining a changelog in CHANGELOG.md.
