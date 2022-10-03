export interface Pollsite {
  county: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  geocode: google.maps.LatLngLiteral;
}

export interface PovertyTract {
  geography: google.maps.LatLngLiteral[];
  name: string;
  county: string;
  total: number;
  percent: number;
}

export const pollsites: Pollsite[] = require("./data/pollsites.json");
export const povertyTracts: PovertyTract[] = require("./data/poverty_tracts.json");
