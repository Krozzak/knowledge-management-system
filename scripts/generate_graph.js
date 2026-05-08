#!/usr/bin/env node
/**
 * generate_graph.js — KMS
 *
 * Lit tous les .md dans notes/ et produit _graph.json à la racine.
 * Format compatible avec ConceptMap.tsx (identique à ekenor.com).
 *
 * Usage : node scripts/generate_graph.js
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const NOTES_DIR = join(ROOT, "notes");
const OUTPUT = join(ROOT, "_graph.json");

const TYPE_MAP = {
  concepts: "concept",
  books: "book",
  authors: "author",
  projects: "project",
  articles: "article",
};

// ---------------------------------------------------------------------------
// Frontmatter parser (no external deps)
// ---------------------------------------------------------------------------

function parseFrontmatter(content) {
  if (!content.startsWith("---")) return { fm: {}, body: content };
  const parts = content.split("---");
  if (parts.length < 3) return { fm: {}, body: content };
  const raw = parts[1];
  const body = parts.slice(2).join("---").trim();
  const fm = {};

  let currentKey = null;
  let currentList = null;

  for (const line of raw.split("\n")) {
    const listMatch = line.match(/^  - (.+)$/);
    const keyMatch = line.match(/^(\w+):\s*(.*)$/);

    if (listMatch && currentList !== null) {
      currentList.push(listMatch[1].trim().replace(/^["']|["']$/g, ""));
      continue;
    }

    if (keyMatch) {
      currentKey = keyMatch[1];
      const val = keyMatch[2].trim();
      if (val === "" || val === "[]") {
        fm[currentKey] = [];
        currentList = fm[currentKey];
      } else if (val.startsWith('"') || val.startsWith("'")) {
        fm[currentKey] = val.replace(/^["']|["']$/g, "");
        currentList = null;
      } else {
        fm[currentKey] = val;
        currentList = null;
      }
    }
  }

  return { fm, body };
}

// ---------------------------------------------------------------------------
// Collect all notes
// ---------------------------------------------------------------------------

function collectNotes() {
  const notes = [];

  for (const folder of Object.keys(TYPE_MAP)) {
    const dir = join(NOTES_DIR, folder);
    let files;
    try {
      files = readdirSync(dir);
    } catch {
      continue;
    }

    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const path = join(dir, file);
      const content = readFileSync(path, "utf8");
      const { fm, body } = parseFrontmatter(content);
      const slug = basename(file, ".md").toLowerCase().replace(/_/g, "-");
      const type = TYPE_MAP[folder];

      // Summary = first non-empty, non-heading line of body
      const summary =
        body
          .split("\n")
          .map((l) => l.trim())
          .find((l) => l && !l.startsWith("#") && !l.startsWith(">") && !l.startsWith("---")) ?? "";

      notes.push({ slug, type, folder, fm, summary: summary.slice(0, 200) });
    }
  }

  return notes;
}

// ---------------------------------------------------------------------------
// Build _graph.json
// ---------------------------------------------------------------------------

const CLUSTER_COLORS = {
  "Productivité": { color: "#4a90d9", emoji: "⚡" },
  "Cognition": { color: "#e67e22", emoji: "🧠" },
  "Systèmes": { color: "#27ae60", emoji: "⚙️" },
  "IA & Outils": { color: "#8e44ad", emoji: "🤖" },
  "Philosophie": { color: "#c0392b", emoji: "📜" },
  "Finance & Marchés": { color: "#f39c12", emoji: "📈" },
  "Travail & IA": { color: "#16a085", emoji: "🏭" },
  "Stratégie & Levier": { color: "#2c3e50", emoji: "🎯" },
  "Psychologie Sociale": { color: "#d35400", emoji: "👥" },
};

function buildGraph(notes) {
  // Collect clusters actually used
  const usedClusters = new Set();
  const concepts = [];

  for (const note of notes) {
    // V1: graph contains all types (concept-only cluster coloring)
    const cluster = note.fm.cluster || "Sans cluster";
    usedClusters.add(cluster);

    // Resolve related slugs (strip type prefix)
    const related = (note.fm.related || [])
      .filter((r) => typeof r === "string" && r.includes(":"))
      .map((r) => r.split(":")[1]);

    concepts.push({
      slug: note.slug,
      title: note.fm.title || note.slug,
      summary: note.summary,
      cluster,
      type: note.type,
      relatedConcepts: related,
    });
  }

  // Build clusters config (only used clusters)
  const clusters = {};
  for (const name of usedClusters) {
    clusters[name] = CLUSTER_COLORS[name] ?? { color: "#888888", emoji: "◆" };
  }

  return { clusters, concepts };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const notes = collectNotes();
const graph = buildGraph(notes);

writeFileSync(OUTPUT, JSON.stringify(graph, null, 2), "utf8");

// Regenerate INDEX.md
const byType = {};
for (const n of notes) {
  byType[n.type] = byType[n.type] || [];
  byType[n.type].push(n);
}

let index = `# INDEX — KMS\n\n_Généré automatiquement — ${new Date().toISOString().split("T")[0]}_\n\n`;
index += `**Total : ${notes.length} fiches**\n\n`;

for (const [type, items] of Object.entries(byType).sort()) {
  index += `## ${type} (${items.length})\n\n`;
  for (const item of items.sort((a, b) => a.slug.localeCompare(b.slug))) {
    index += `- [${item.fm.title || item.slug}](notes/${item.folder}/${item.slug}.md)\n`;
  }
  index += "\n";
}

writeFileSync(join(ROOT, "INDEX.md"), index, "utf8");

const totalLinks = graph.concepts.reduce((s, c) => s + c.relatedConcepts.length, 0);
console.log(
  `_graph.json généré — ${notes.length} fiches, ${Object.keys(graph.clusters).length} clusters, ${totalLinks} liens.`
);
console.log(`INDEX.md régénéré.`);
