import { Pollsite, PovertyTract } from "./pollsites/pollsites";
import { Status as StatusEnum } from "@googlemaps/react-wrapper";
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";

export function Status(status: StatusEnum) {
  return <h2>{status}</h2>;
}

function tractColor(percent: number): string {
  if (percent > 0.517) return "rgb(8, 81, 156)";
  if (percent > 0.327) return "rgb(49, 130, 189)";
  if (percent > 0.188) return "rgb(107, 174, 214)";
  if (percent > 0.084) return "rgb(189, 215, 231)";
  return "rgb(239, 243, 255)";
}

export function SitesMap({
  sites,
  tracts,
  center,
  zoom,
}: {
  sites: Pollsite[];
  tracts: PovertyTract[];
  center: { lat: number; lng: number };
  zoom: number;
}) {
  return (
    <>
      <Map
        center={center}
        zoom={zoom}
        style={{ flexGrow: "1", height: "100%" }}
      >
        {sites.map(({ geocode, name }) => (
          <Marker key={name} position={geocode} />
        ))}
        {tracts.map(({ geography, name, percent }) => (
          <Shape key={name} polygon={geography} color={tractColor(percent)} />
        ))}
      </Map>
    </>
  );
}

interface MapProps extends google.maps.MapOptions {
  children?: React.ReactNode;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  style?: Record<string, unknown>;
}

const Map = ({ children, onClick, onIdle, style, ...options }: MapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  return (
    <>
      <div ref={ref} style={style} />
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          // set the map prop on the child component
          // @ts-ignore
          return cloneElement(child, { map });
        }
      })}
    </>
  );
};

const Marker = (options: google.maps.MarkerOptions) => {
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};

const Shape = ({
  polygon,
  color = "#FF0000",
  ...options
}: {
  polygon: google.maps.LatLngLiteral[];
  color?: string;
} & google.maps.PolygonOptions) => {
  const [shape, setShape] = useState<google.maps.Polygon>();

  useEffect(() => {
    if (!shape) {
      setShape(
        new google.maps.Polygon({
          paths: polygon,
          strokeColor: "#333333",
          strokeOpacity: 0.8,
          strokeWeight: 1,
          fillColor: color,
          fillOpacity: 0.7,
        })
      );
    }

    // remove marker from map on unmount
    return () => {
      if (shape) {
        shape.setMap(null);
      }
    };
  }, [shape, polygon, color]);

  useEffect(() => {
    if (shape) {
      shape.setOptions(options);
    }
  }, [shape, options]);

  return null;
};
