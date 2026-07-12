import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from city_compiler.errors import ConfigError
from city_compiler.places import load_place_meta, load_score_tuples

ROOT = Path(__file__).resolve().parents[2]


class PlacesBridgeTests(unittest.TestCase):
    def test_load_paris_places_via_json_bridge(self) -> None:
        meta = load_place_meta(ROOT / "src/data/places/paris.json")
        self.assertIn("75101", meta)
        self.assertEqual(meta["75101"]["name"], "1st - Louvre")

    def test_score_tuples_have_explicit_fields(self) -> None:
        tuples = load_score_tuples(ROOT / "src/data/places/paris.json")
        self.assertEqual(len(tuples["75101"]), 7)

    def test_missing_places_file_raises_config_error(self) -> None:
        with self.assertRaises(ConfigError):
            load_place_meta(ROOT / "src/data/places/does-not-exist.json")


if __name__ == "__main__":
    unittest.main()
