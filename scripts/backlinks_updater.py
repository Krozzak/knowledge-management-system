#!/usr/bin/env python3
"""
backlinks_updater.py — KMS

Recalcule les champs citedBy[] dans toutes les fiches,
et propose des liens non encore déclarés (--scan).
Peut migrer l'ancien schéma séparé vers le schéma related unifié (--migrate).

Usage :
  python3 scripts/backlinks_updater.py           # recalcule citedBy
  python3 scripts/backlinks_updater.py --scan    # propose des liens manquants
  python3 scripts/backlinks_updater.py --migrate # fusionne anciens champs séparés
"""

import os
import sys
import re
from pathlib import Path

import yaml

NOTES_DIR = Path(__file__).parent.parent / "notes"

TYPE_MAP = {
    "concepts": "concept",
    "books": "book",
    "authors": "author",
    "projects": "project",
    "articles": "article",
}

VALID_PREFIXES = set(TYPE_MAP.values())


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slug_from_path(path: Path) -> str:
    return path.stem.lower().replace("_", "-")


def type_from_path(path: Path) -> str:
    folder = path.parent.name
    return TYPE_MAP.get(folder, folder.rstrip("s"))


def ref_from_path(path: Path) -> str:
    return f"{type_from_path(path)}:{slug_from_path(path)}"


def load_note(path: Path) -> tuple[dict, str]:
    """Returns (frontmatter_dict, body_text)."""
    content = path.read_text(encoding="utf-8")
    if not content.startswith("---"):
        return {}, content
    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}, content
    fm = yaml.safe_load(parts[1]) or {}
    body = parts[2]
    return fm, body


def save_note(path: Path, fm: dict, body: str) -> None:
    dumped = yaml.dump(fm, allow_unicode=True, default_flow_style=False, sort_keys=False)
    path.write_text(f"---\n{dumped}---\n{body}", encoding="utf-8")


def all_notes() -> list[Path]:
    paths = []
    for folder in TYPE_MAP:
        d = NOTES_DIR / folder
        if d.exists():
            paths.extend(sorted(d.glob("*.md")))
    return paths


# ---------------------------------------------------------------------------
# Core: recalculate citedBy
# ---------------------------------------------------------------------------

def recalculate_cited_by() -> None:
    notes = all_notes()

    # Build: for each ref, which refs point to it
    cited_by: dict[str, list[str]] = {}
    for path in notes:
        ref = ref_from_path(path)
        cited_by.setdefault(ref, [])

    for path in notes:
        source_ref = ref_from_path(path)
        fm, body = load_note(path)
        related = fm.get("related") or []
        for target_ref in related:
            if ":" not in target_ref:
                continue
            cited_by.setdefault(target_ref, [])
            if source_ref not in cited_by[target_ref]:
                cited_by[target_ref].append(source_ref)

    # Write back
    updated = 0
    for path in notes:
        ref = ref_from_path(path)
        fm, body = load_note(path)
        new_cited = sorted(cited_by.get(ref, []))
        if fm.get("citedBy") != new_cited:
            fm["citedBy"] = new_cited
            save_note(path, fm, body)
            updated += 1

    print(f"citedBy recalculé — {updated} fiche(s) mise(s) à jour.")


# ---------------------------------------------------------------------------
# Scan: propose missing links
# ---------------------------------------------------------------------------

def scan_missing_links() -> None:
    notes = all_notes()

    # Build slug → ref index
    slug_to_ref: dict[str, str] = {}
    for path in notes:
        slug_to_ref[slug_from_path(path)] = ref_from_path(path)

    proposals: list[tuple[Path, str, str]] = []

    for path in notes:
        fm, body = load_note(path)
        source_ref = ref_from_path(path)
        existing_related = set(fm.get("related") or [])

        for slug, target_ref in slug_to_ref.items():
            if target_ref == source_ref:
                continue
            if target_ref in existing_related:
                continue
            # Simple mention check: slug appears in body (case-insensitive)
            pattern = re.compile(re.escape(slug.replace("-", "[- ]")), re.IGNORECASE)
            if pattern.search(body):
                proposals.append((path, source_ref, target_ref))

    if not proposals:
        print("Aucun lien manquant détecté.")
        return

    print(f"\n{len(proposals)} lien(s) potentiel(s) trouvé(s).\n")

    for path, source_ref, target_ref in proposals:
        answer = input(f"  Lier {source_ref} → {target_ref} ? [o/N] ").strip().lower()
        if answer == "o":
            fm, body = load_note(path)
            related = list(fm.get("related") or [])
            if target_ref not in related:
                related.append(target_ref)
                fm["related"] = sorted(related)
                save_note(path, fm, body)
                print(f"    ✓ Lien ajouté.")

    print("\nScan terminé.")


# ---------------------------------------------------------------------------
# Migrate: old separate fields → unified related
# ---------------------------------------------------------------------------

LEGACY_FIELD_MAP = {
    "relatedConcepts": "concept",
    "relatedProjects": "project",
    "relatedArticles": "article",
    "relatedBooks": "book",
    "relatedAuthors": "author",
}


def migrate_schema() -> None:
    notes = all_notes()
    migrated = 0

    for path in notes:
        fm, body = load_note(path)
        related = list(fm.get("related") or [])
        changed = False

        for old_field, prefix in LEGACY_FIELD_MAP.items():
            old_values = fm.pop(old_field, None)
            if not old_values:
                continue
            for slug in old_values:
                ref = f"{prefix}:{slug}"
                if ref not in related:
                    related.append(ref)
                    changed = True

        if changed:
            fm["related"] = sorted(related)
            save_note(path, fm, body)
            migrated += 1
            print(f"  Migré : {path.name}")

    print(f"\nMigration terminée — {migrated} fiche(s) mise(s) à jour.")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    args = sys.argv[1:]
    if "--migrate" in args:
        migrate_schema()
    elif "--scan" in args:
        scan_missing_links()
    else:
        recalculate_cited_by()
