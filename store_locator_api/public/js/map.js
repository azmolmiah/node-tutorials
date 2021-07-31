mapboxgl.accessToken =
  "pk.eyJ1IjoiYXptb2xtaWFoIiwiYSI6ImNrNHhiNWJsMTAyeGwza214bzd3NnVuNmYifQ.dKGvUdb76DxKROsDjtkucw";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 9,
  center: [-2.12703, 53.5496]
});

// Fetch stores from api
const getStores = async () => {
  const res = await fetch("/api/v1/stores");
  const data = await res.json();

  const stores = data.data.map(store => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          store.location.coordinates[0],
          store.location.coordinates[1]
        ]
      },
      properties: {
        storeId: store.storeId,
        icon: "shop"
      }
    };
  });

  loadMap(stores);
};

// load map with stores
const loadMap = stores => {
  map.on("load", () => {
    map.addLayer({
      id: "points",
      type: "symbol",
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: stores
        }
      },
      layout: {
        "icon-image": "{icon}-15",
        "icon-size": 1.5,
        "text-field": "{storeId}",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 0.9],
        "text-anchor": "top"
      }
    });
  });
};

getStores();
