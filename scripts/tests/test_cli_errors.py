import io
import sys
import unittest
from contextlib import redirect_stderr
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from city_compiler.cli import _run_for_targets
from city_compiler.errors import ValidationError


class CliAggregationTests(unittest.TestCase):
    def test_aggregates_failures_and_returns_non_zero(self) -> None:
        def fake_validate(_config):
            raise ValidationError("audit failed")

        stderr = io.StringIO()
        with patch("city_compiler.cli.load_city_config", return_value=object()), patch(
            "city_compiler.cli.validate_city", side_effect=fake_validate
        ), redirect_stderr(stderr):
            code = _run_for_targets("validate", ["paris", "lyon"])

        self.assertEqual(code, 1)
        self.assertIn("paris: audit failed", stderr.getvalue())
        self.assertIn("lyon: audit failed", stderr.getvalue())


if __name__ == "__main__":
    unittest.main()