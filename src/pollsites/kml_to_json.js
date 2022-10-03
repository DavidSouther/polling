const { writeFileSync } = require("fs");
const parseKML = require("parse-kml");

parseKML
  .toJson("./data/tracts.kml")
  .then(({ features }) => {
    const tracts = features.reduce(
      (tracts, { properties: { name }, geometry: { coordinates } }) => {
        tracts[name] = {
          geometry: (coordinates?.[0] ?? []).map(([lng, lat]) => ({
            lat,
            lng,
          })),
        };
        return tracts;
      },
      {}
    );
    writeFileSync(
      "./data/tracts.json",
      JSON.stringify(tracts, undefined, "  ")
    );
  })
  .catch(console.error);
// kml -> Document -> Folder -> PlaceMark*
