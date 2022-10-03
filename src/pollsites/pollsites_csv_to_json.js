const { readFileSync, writeFileSync } = require("fs");
const { parse } = require("csv-parse");
const { Client } = require("@googlemaps/google-maps-services-js");

const client = new Client();
const csv = readFileSync("./data/pollsites.csv", { encoding: "utf-8" });
parse(
  csv,
  { columns: ["county", "name", "address", "city", "zip"] },
  async (err, data) => {
    err && console.error(err);
    try {
      data = await Promise.all(
        data.map(async (data) => {
          try {
            const geocode = await client.geocode({
              params: {
                key: process.env.GOOGLE_MAPS_API_KEY,
                address: `${data.address} ${data.city}, NY ${data.zip}`,
              },
            });
            data.geocode = geocode.data.results[0].geometry.location;
          } catch (e) {
            console.error(`Failed to geocode ${data.name}`, e);
          }
          return data;
        })
      );
      writeFileSync(
        "./data/pollsites.json",
        JSON.stringify(data, undefined, "  ")
      );
    } catch (e) {
      console.error("failed to geocode all poll sites", e);
    }
  }
);
