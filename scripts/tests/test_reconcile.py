import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


class ReconcileScriptTests(unittest.TestCase):
    def test_geo_reconcile_passes_for_current_tree(self) -> None:
        result = subprocess.run(
            [str(Path.home() / ".bun/bin/bun"), "scripts/check_city_data.ts"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            check=False,
        )
        self.assertEqual(
            result.returncode,
            0,
            msg=result.stdout + result.stderr,
        )


if __name__ == "__main__":
    unittest.main()