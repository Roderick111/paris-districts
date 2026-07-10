import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from city_compiler.outputs import write_json_atomic


class OutputWriteTests(unittest.TestCase):
    def test_write_json_atomic_writes_valid_json(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "nested" / "output.json"
            payload = {"type": "FeatureCollection", "features": []}
            write_json_atomic(path, payload, compact=True)
            self.assertTrue(path.exists())
            loaded = json.loads(path.read_text(encoding="utf-8"))
            self.assertEqual(loaded, payload)
            self.assertFalse(path.with_suffix(path.suffix + ".tmp").exists())

    def test_write_json_atomic_cleans_temp_on_failure(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "output.json"

            with self.assertRaises(TypeError):
                write_json_atomic(path, {"bad": {1, 2, 3}}, compact=True)

            self.assertFalse(path.exists())
            self.assertFalse(path.with_suffix(path.suffix + ".tmp").exists())


if __name__ == "__main__":
    unittest.main()