import json
import sys
import tempfile
import unittest
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from city_compiler.outputs import write_json_atomic, write_text_atomic


class OutputWriteTests(unittest.TestCase):
    def test_write_json_atomic_writes_valid_json(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "nested" / "output.json"
            payload = {"type": "FeatureCollection", "features": []}
            write_json_atomic(path, payload, compact=True)
            self.assertTrue(path.exists())
            loaded = json.loads(path.read_text(encoding="utf-8"))
            self.assertEqual(loaded, payload)
            self.assertEqual(path.stat().st_mode & 0o777, 0o644)
            self.assertEqual(list(path.parent.glob(f".{path.name}.*.tmp")), [])

    def test_write_text_atomic_writes_readable_file(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "output.txt"
            write_text_atomic(path, "ok")

            self.assertEqual(path.read_text(encoding="utf-8"), "ok")
            self.assertEqual(path.stat().st_mode & 0o777, 0o644)

    def test_write_json_atomic_cleans_temp_on_failure(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "output.json"

            with self.assertRaises(TypeError):
                write_json_atomic(path, {"bad": {1, 2, 3}}, compact=True)

            self.assertFalse(path.exists())
            self.assertEqual(list(path.parent.glob(f".{path.name}.*.tmp")), [])

    def test_concurrent_writes_leave_valid_json(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "output.json"
            with ThreadPoolExecutor(max_workers=4) as pool:
                list(pool.map(lambda value: write_json_atomic(path, {"value": value}), range(8)))

            self.assertIn(json.loads(path.read_text(encoding="utf-8"))["value"], range(8))
            self.assertEqual(list(path.parent.glob(f".{path.name}.*.tmp")), [])


if __name__ == "__main__":
    unittest.main()
