"""Label normalization for source unit lookup."""

from __future__ import annotations

import re
import unicodedata


def normalize_label(value: str) -> str:
    folded = unicodedata.normalize("NFKD", value)
    ascii_label = "".join(char for char in folded if not unicodedata.combining(char))
    return re.sub(r"[^a-z0-9]+", "", ascii_label.lower())