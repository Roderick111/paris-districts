import json
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
from urllib.error import URLError

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from city_compiler.errors import SourceError
from city_compiler import sources


class FakeResponse:
    def __init__(self, payload: bytes) -> None:
        self.payload = payload

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def read(self) -> bytes:
        return self.payload


class SourceCacheTests(unittest.TestCase):
    def test_json_source_cache_avoids_repeat_fetch(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            payload = json.dumps({"features": []}).encode()
            with patch.object(sources, "CACHE_DIR", Path(tmp)), patch(
                "urllib.request.urlopen", return_value=FakeResponse(payload)
            ) as fetch:
                self.assertEqual(sources.fetch_json("https://example.test/data"), {"features": []})
                self.assertEqual(sources.fetch_json("https://example.test/data"), {"features": []})

            fetch.assert_called_once()

    def test_remote_failure_is_source_error(self) -> None:
        with tempfile.TemporaryDirectory() as tmp, patch.object(sources, "CACHE_DIR", Path(tmp)), patch(
            "urllib.request.urlopen", side_effect=URLError("offline")
        ):
            with self.assertRaises(SourceError) as context:
                sources.fetch_json("https://example.test/data")

        self.assertIn("https://example.test/data", str(context.exception))


if __name__ == "__main__":
    unittest.main()
