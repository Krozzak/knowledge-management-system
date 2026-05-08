#!/usr/bin/env python3
"""
check_duplicates.py — KMS

Détecte les doublons potentiels entre les fiches d'une PR et le repo existant.
Utilisé par GitHub Actions validate-pr.yml.

Usage :
  python3 scripts/check_duplicates.py <fichier1.md> [fichier2.md ...]

Retourne exit code 0 toujours (la PR n'est pas bloquée — alerte seulement).
Écrit le résultat en JSON sur stdout pour que le workflow GitHub l'exploite.
"""

import sys
import json
import re
import unicodedata
from pathlib import Path

import yaml

NOTES_DIR = Path(__file__).parent.parent / "notes"

STOPWORDS = {
    "le", "la", "les", "de", "du", "des", "et", "the", "of", "a", "an",
    "en", "un", "une", "par", "sur", "dans",
}


def normalize(text: str) -> set[str]:
    text = text.lower()
    text = "".join(
        c for c in unicodedata.normalize("NFD", text)
        if unicodedata.category(c) != "Mn"
    )
    tokens = re.findall(r"\w+", text)
    return {t for t in tokens if t not in STOPWORDS and len(t) > 1}


def jaccard(a: set, b: set) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def load_frontmatter(path: Path) -> dict:
    content = path.read_text(encoding="utf-8")
    if not content.startswith("---"):
        return {}
    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}
    return yaml.safe_load(parts[1]) or {}


def collect_existing() -> list[tuple[Path, dict]]:
    existing = []
    if not NOTES_DIR.exists():
        return existing
    for md in NOTES_DIR.rglob("*.md"):
        fm = load_frontmatter(md)
        if fm:
            existing.append((md, fm))
    return existing


def find_duplicates(new_files: list[Path], existing: list[tuple[Path, dict]]) -> list[dict]:
    results = []

    for new_path in new_files:
        new_fm = load_frontmatter(new_path)
        if not new_fm:
            continue
        new_title = new_fm.get("title", new_path.stem)
        new_aliases = []
        if isinstance(new_fm.get("aliases"), dict):
            for v in new_fm["aliases"].values():
                if isinstance(v, list):
                    new_aliases.extend(v)
        new_tokens = normalize(new_title)
        for alias in new_aliases:
            new_tokens |= normalize(alias)

        for exist_path, exist_fm in existing:
            if exist_path.resolve() == new_path.resolve():
                continue
            exist_title = exist_fm.get("title", exist_path.stem)
            exist_aliases = []
            if isinstance(exist_fm.get("aliases"), dict):
                for v in exist_fm["aliases"].values():
                    if isinstance(v, list):
                        exist_aliases.extend(v)
            exist_tokens = normalize(exist_title)
            for alias in exist_aliases:
                exist_tokens |= normalize(alias)

            score = jaccard(new_tokens, exist_tokens)
            if score >= 0.6:
                results.append({
                    "new_file": new_path.name,
                    "existing_file": exist_path.name,
                    "new_title": new_title,
                    "existing_title": exist_title,
                    "score": round(score, 2),
                })

    return results


if __name__ == "__main__":
    new_files = [Path(f) for f in sys.argv[1:] if f.endswith(".md")]
    if not new_files:
        print(json.dumps({"duplicates": []}))
        sys.exit(0)

    existing = collect_existing()
    duplicates = find_duplicates(new_files, existing)
    print(json.dumps({"duplicates": duplicates}, ensure_ascii=False, indent=2))
    sys.exit(0)
