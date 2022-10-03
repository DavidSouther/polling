import { Wrapper } from "@googlemaps/react-wrapper";
import { useMemo, useState } from "react";
import "./App.css";
import { SitesMap, Status } from "./map";
import { pollsites, povertyTracts } from "./pollsites/pollsites";

const counties = Array.from(new Set(pollsites.map(({ county }) => county)));

function App() {
  const [zoom, setZoom] = useState(11);
  let [county, setCounty] = useState("Nassau");
  let sites = useMemo(
    () => pollsites.filter((site) => site.county === county),
    [county]
  );

  let center: google.maps.LatLngLiteral = useMemo(() => {
    let bounds = sites.reduce(
      (bounds, site) => {
        const bounds2 = {
          lat: {
            max: Math.max(bounds.lat.max, site.geocode.lat),
            min: Math.min(bounds.lat.min, site.geocode.lat),
          },
          lng: {
            max: Math.max(bounds.lng.max, site.geocode.lng),
            min: Math.min(bounds.lng.min, site.geocode.lng),
          },
        };
        return bounds2;
      },
      {
        lat: { max: -90, min: 90 },
        lng: { max: -180, min: 180 },
      }
    );

    return {
      lat: bounds.lat.max / 2 + bounds.lat.min / 2,
      lng: bounds.lng.max / 2 + bounds.lng.min / 2,
    };
  }, [sites]);
  const tracts = useMemo(
    () => povertyTracts.filter((tract) => tract.county === county),
    [county]
  );

  return (
    <>
      <header className="fluid">
        <nav>
          <ul>
            {counties.map((county) => (
              <button onClick={() => setCounty(county)} key={county}>
                {county}
              </button>
            ))}
          </ul>
        </nav>
      </header>
      <main
        className="fluid flex flex-1"
        style={{ height: "100%", width: "100%" }}
      >
        <Wrapper
          apiKey="AIzaSyAeUsNSBsSIQ4Xdcw8-QkhNflZkr1HBY6c"
          render={Status}
        >
          <SitesMap center={center} zoom={zoom} sites={sites} tracts={tracts} />
        </Wrapper>
      </main>
    </>
  );
}

export default App;
