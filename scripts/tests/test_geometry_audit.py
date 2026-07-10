import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from city_compiler.geometry import round_geometry_coords
from geometry_audit import audit_geometry_quality, geometry_bbox, geometry_hash


SAMPLE_POLYGON = {
    "type": "Polygon",
    "coordinates": [
        [
            [2.3, 48.8],
            [2.4, 48.8],
            [2.4, 48.9],
            [2.3, 48.9],
            [2.3, 48.8],
        ]
    ],
}


class GeometryAuditTests(unittest.TestCase):
    def test_geometry_bbox_caches_result(self) -> None:
        geometry = json.loads(json.dumps(SAMPLE_POLYGON))
        first = geometry_bbox(geometry)
        second = geometry_bbox(geometry)
        self.assertEqual(first, second)
        self.assertEqual(geometry["_bbox"], list(first))

    def test_geometry_hash_ignores_private_bbox_cache(self) -> None:
        geometry = json.loads(json.dumps(SAMPLE_POLYGON))
        before = geometry_hash(geometry)
        geometry_bbox(geometry)
        after = geometry_hash(geometry)
        self.assertEqual(before, after)

    def test_empty_geometry_raises_value_error(self) -> None:
        with self.assertRaises(ValueError):
            geometry_bbox({"type": "Polygon", "coordinates": []})

    def test_round_geometry_coords_handles_empty_coordinates(self) -> None:
        rounded = round_geometry_coords({"type": "Polygon", "coordinates": []})
        self.assertEqual(rounded, {"type": "Polygon", "coordinates": []})

    def test_audit_geometry_quality_reports_city_code_context(self) -> None:
        with self.assertRaises(SystemExit) as ctx:
            audit_geometry_quality(
                [
                    {
                        "type": "Feature",
                        "properties": {"code": "test-zone"},
                        "geometry": {"type": "Polygon", "coordinates": []},
                    }
                ]
            )

        self.assertIn("test-zone", str(ctx.exception))


if __name__ == "__main__":
    unittest.main()