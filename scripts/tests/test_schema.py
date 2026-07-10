import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from city_compiler.errors import ConfigError
from city_compiler.schema import CityConfig, sanitize_city_id


class SchemaSecurityTests(unittest.TestCase):
    def test_sanitize_city_id_rejects_traversal(self) -> None:
        with self.assertRaises(ConfigError):
            sanitize_city_id("../secrets")

    def test_city_config_from_json_builds_config(self) -> None:
        raw = {
            "cityId": "paris",
            "placesFile": "src/data/parisPlaces.ts",
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
        self.assertTrue(str(config.places_file).endswith("src/data/parisPlaces.ts"))


if __name__ == "__main__":
    unittest.main()