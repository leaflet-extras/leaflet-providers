import Provider, { OpenStreetMap } from "../index";

const layer = new Provider(OpenStreetMap, "DE", { maxZoom: 42 });
