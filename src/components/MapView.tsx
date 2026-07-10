"use client";

import { useEffect, useRef } from "react";
import { GeoJsonLayer } from "@deck.gl/layers";
import { MapboxOverlay } from "@deck.gl/mapbox";
import maplibregl, { Map as MapLibreMap } from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import type { PlaceFeatureCollection } from "@/hooks/useCityGeojson";

const BASE_LINE_COLOR: [number, number, number, number] = [255, 255, 255, 230];
const SELECTION_LINE_COLOR: [number, number, number, number] = [15, 23, 42, 255];

export type MapViewProps = {
  center: [number, number];
  zoom: number;
  minZoom: number;
  maxZoom: number;
  geojson: PlaceFeatureCollection | null;
  displayOutlineGeojson: PlaceFeatureCollection | null;
  selectionOutline: FeatureCollection | null;
  getFillColor: (feature: { properties: { code: string } }) => [number, number, number, number];
  fillUpdateTriggers: unknown[];
  onHoverPlace: (info: { code: string; x: number; y: number } | null) => void;
  onSelectCode: (code: string) => void;
  canSelectCode: (code: string) => boolean;
  fitBounds?: [[number, number], [number, number]] | null;
};

function boundsFromGeojson(geojson: PlaceFeatureCollection): [[number, number], [number, number]] {
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;

  const walk = (coords: unknown): void => {
    if (!Array.isArray(coords) || coords.length === 0) {
      return;
    }

    if (typeof coords[0] === "number" && typeof coords[1] === "number") {
      const [lon, lat] = coords as [number, number];
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      return;
    }

    for (const part of coords) {
      walk(part);
    }
  };

  for (const feature of geojson.features) {
    const { geometry } = feature;
    if ("coordinates" in geometry) {
      walk(geometry.coordinates);
    }
  }

  return [[minLon, minLat], [maxLon, maxLat]];
}

export default function MapView({
  center,
  zoom,
  minZoom,
  maxZoom,
  geojson,
  displayOutlineGeojson,
  selectionOutline,
  getFillColor,
  fillUpdateTriggers,
  onHoverPlace,
  onSelectCode,
  canSelectCode,
  fitBounds
}: MapViewProps) {
  const mapNode = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const overlayRef = useRef<MapboxOverlay | null>(null);

  useEffect(() => {
    if (!mapNode.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapNode.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center,
      zoom,
      minZoom,
      maxZoom,
      attributionControl: { compact: true }
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "bottom-right");
    mapRef.current = map;

    return () => {
      overlayRef.current?.finalize();
      overlayRef.current = null;
      map.remove();
      mapRef.current = null;
    };
    // Map instance is created once; viewport updates happen in the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    map.setMinZoom(minZoom);
    map.setMaxZoom(maxZoom);

    if (fitBounds) {
      const [[minLon, minLat], [maxLon, maxLat]] = fitBounds;
      if (Number.isFinite(minLon) && Number.isFinite(minLat) && Number.isFinite(maxLon) && Number.isFinite(maxLat)) {
        map.fitBounds(
          [
            [minLon, minLat],
            [maxLon, maxLat]
          ],
          {
            padding: 48,
            duration: 700,
            maxZoom: zoom
          }
        );
        return;
      }
    }

    map.flyTo({ center, zoom, essential: true });
  }, [center, fitBounds, maxZoom, minZoom, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    if (!geojson) {
      overlayRef.current?.setProps({ layers: [] });
      return () => {
        overlayRef.current?.setProps({ layers: [] });
      };
    }

    const onHover = (info: { object?: { properties?: { code?: string } }; x?: number; y?: number }) => {
      const code = info.object?.properties?.code;
      if (code && typeof info.x === "number" && typeof info.y === "number" && canSelectCode(code)) {
        onHoverPlace({ code, x: info.x, y: info.y });
      } else {
        onHoverPlace(null);
      }

      if (map.getCanvas()) {
        map.getCanvas().style.cursor = code && canSelectCode(code) ? "pointer" : "";
      }
    };

    const onClick = (info: { object?: { properties?: { code?: string } } }) => {
      const code = info.object?.properties?.code;
      if (code && canSelectCode(code)) {
        onSelectCode(code);
      }
    };

    const outlineData = displayOutlineGeojson ?? geojson;

    const fillLayer = new GeoJsonLayer({
      id: "place-quality-fill",
      data: geojson,
      pickable: true,
      stroked: false,
      filled: true,
      getFillColor,
      updateTriggers: {
        getFillColor: fillUpdateTriggers
      },
      onHover,
      onClick
    });

    const outlineLayer = new GeoJsonLayer({
      id: "place-quality-outline",
      data: outlineData,
      pickable: false,
      stroked: true,
      filled: false,
      lineWidthMinPixels: 1,
      getLineColor: BASE_LINE_COLOR,
      getLineWidth: 1
    });

    const selectionLayer = selectionOutline
      ? new GeoJsonLayer({
          id: "place-quality-selection",
          data: selectionOutline,
          pickable: false,
          stroked: true,
          filled: false,
          lineWidthMinPixels: 3,
          getLineColor: SELECTION_LINE_COLOR,
          getLineWidth: 4,
          lineJointRounded: true,
          lineCapRounded: true,
          parameters: { depthTest: false }
        })
      : null;

    const layers = selectionLayer ? [fillLayer, outlineLayer, selectionLayer] : [fillLayer, outlineLayer];

    if (!overlayRef.current) {
      overlayRef.current = new MapboxOverlay({ interleaved: false, layers });
      map.addControl(overlayRef.current as unknown as maplibregl.IControl);
    } else {
      overlayRef.current.setProps({ layers });
    }

    return () => {
      overlayRef.current?.setProps({ layers: [] });
    };
  }, [
    canSelectCode,
    displayOutlineGeojson,
    fillUpdateTriggers,
    geojson,
    getFillColor,
    onHoverPlace,
    onSelectCode,
    selectionOutline
  ]);

  return <div ref={mapNode} className="map" />;
}

export { boundsFromGeojson };