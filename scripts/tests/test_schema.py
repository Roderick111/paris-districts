import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from city_compiler.errors import ConfigError
from city_compiler.schema import CityConfig, list_city_ids, load_city_config, sanitize_city_id


class SchemaSecurityTests(unittest.TestCase):
    def test_sanitize_city_id_rejects_traversal(self) -> None:
        with self.assertRaises(ConfigError):
            sanitize_city_id("../secrets")

    def test_city_config_from_json_builds_config(self) -> None:
        raw = {
            "cityId": "paris",
            "placesFile": "src/data/places/paris.json",
            "geojsonOutput": "public/data/districts.geojson",
            "sources": [],
            "zones": [
                {
                    "code": "75101",
                    "sourceUnits": [{"source": "paris_arrondissements", "name": "75101"}],
                }
            ],
        }
        config = CityConfig.from_json("paris", raw)
        self.assertEqual(config.city_id, "paris")
        self.assertTrue(str(config.places_file).endswith("src/data/places/paris.json"))

    def test_all_city_configs_use_canonical_places_and_outlines(self) -> None:
        self.assertEqual(
            list_city_ids(),
            [
                "bordeaux",
                "grenoble",
                "lille",
                "lyon",
                "marseille",
                "montpellier",
                "nantes",
                "nice",
                "paris",
                "rennes",
                "strasbourg",
                "toulon",
                "toulouse",
            ],
        )
        for city_id in list_city_ids():
            config = load_city_config(city_id)
            self.assertTrue(str(config.places_file).endswith(f"src/data/places/{city_id}.json"))
            self.assertIsNotNone(config.outline_output)


if __name__ == "__main__":
    unittest.main()
