const { readFileSync, writeFileSync } = require("fs");
const { parse } = require("csv-parse");

const poverty = readFileSync("./data/poverty.csv", { encoding: "utf-8" });
const tracts = require("./data/tracts.json");
parse(
  poverty,
  { columns: ["geography", "name", "county", "total", "percent"] },
  async (err, data) => {
    err && console.error(err);
    data = data.slice(1).map((data) => {
      data.geography = tracts[data.geography]?.geometry ?? [];
      data.percent = Number(data.percent) / 100;
      data.total = Number(data.total);
      return data;
    });
    writeFileSync(
      "./data/poverty_tracts.json",
      JSON.stringify(data, undefined, "  ")
    );
  }
);
