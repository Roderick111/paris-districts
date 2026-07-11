"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

export type PlaceFeatureCollection = FeatureCollection<
  Geometry,
  GeoJsonProperties & { code: string; name: string; kind: string }
>;

type GeojsonResult = {
  key: string;
  data: PlaceFeatureCollection | null;
  error: string | null;
};

const geojsonCache = new Map<string, PlaceFeatureCollection>();

export function useCityGeojson(url: string | undefined) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<GeojsonResult>({ key: "", data: null, error: null });
  const bypassCacheRef = useRef(false);
  const requestKey = url ? `${url}:${attempt}` : "";

  const retry = useCallback(() => {
    bypassCacheRef.current = true;
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!url) {
      return;
    }

    let cancelled = false;

    const bypassCache = bypassCacheRef.current;
    bypassCacheRef.current = false;
    if (!bypassCache) {
      const cached = geojsonCache.get(url);
      if (cached) {
        Promise.resolve(cached).then((data) => {
          if (!cancelled) {
            setResult({ key: requestKey, data, error: null });
          }
        });
        return () => {
          cancelled = true;
        };
      }
    }

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${url}: ${response.status}`);
        }
        return response.json() as Promise<PlaceFeatureCollection>;
      })
      .then((data) => {
        geojsonCache.set(url, data);
        if (!cancelled) {
          setResult({ key: requestKey, data, error: null });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : "Failed to load map data";
          setResult({ key: requestKey, data: null, error: message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey, url]);

  const settled = result.key === requestKey;

  return {
    data: settled ? result.data : null,
    loading: Boolean(url) && !settled,
    error: settled ? result.error : null,
    retry
  };
}
