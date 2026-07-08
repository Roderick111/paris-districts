#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

echo "Applying Bordeaux natural-zone geometry fix..."

cp -f bordeauxPlaces.updated.ts src/data/bordeauxPlaces.ts
cp -f bordeaux.updated.geojson public/data/bordeaux.geojson
cp -f build_bordeaux_geojson.py scripts/build_bordeaux_micro_geojson.py

python3 scripts/build_bordeaux_micro_geojson.py
dupes="$(jq -r '.features[].properties.code' public/data/bordeaux.geojson | sort | uniq -d)"
if [[ -n "${dupes}" ]]; then
  echo "Duplicate feature codes found:"
  echo "${dupes}"
  exit 1
fi

echo "Feature count: $(jq '.features | length' public/data/bordeaux.geojson)"
~/.bun/bin/bun run build
echo "Done."