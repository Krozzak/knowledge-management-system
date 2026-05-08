# KMS — Knowledge Management System

Système de knowledge management personnel avec graphe 3D interactif. Clone, lance 5 commandes, navigue dans ton graphe de concepts.

## Setup en 5 commandes

```bash
git clone https://github.com/Krozzak/knowledge-management-system
cd knowledge-management-system
pip install -r requirements.txt
npm install
bash scripts/install_hooks.sh
npm run dev    # → localhost:5173/graph
```

Le graphe s'ouvre sur `localhost:5173/graph`. Clique sur un nœud pour ouvrir la fiche dans un nouvel onglet.

---

## Vault personnel vs graphe public

**Ton vault est local. Tu décides ce que tu publies.**

Par défaut, tout reste sur ta machine. Le graphe que tu vois dans ton navigateur (`npm run dev`) est le tien — personnel, privé.

Si tu veux contribuer une fiche au graphe public :

1. Crée une branche : `git checkout -b contribution/[slug]`
2. Ajoute ta fiche dans `notes/[type]/[slug].md`
3. Synchronise : `npm run sync`
4. Push et ouvre une PR
5. Le CI vérifie automatiquement (liens, doublons, format)
6. Review humaine → merge → ta fiche rejoint le graphe public

---

## Structure des fiches

```
notes/
├── concepts/     → type: concept
├── books/        → type: book
├── authors/      → type: author
├── projects/     → type: project
└── articles/     → type: article
```

### Frontmatter canonique

```yaml
---
title: "Nom du concept"
type: concept
cluster: Systèmes
related:
  - concept:small-world-network
  - book:naval-almanack
  - author:naval-ravikant
citedBy: []            # calculé auto — ne pas éditer
aliases:
  fr: []
  en: []
tags: []
status: draft          # draft | ready | published
dateCreated: "2026-01-01"
sources: []
---
```

Les préfixes dans `related` (`concept:`, `book:`, `author:`, `project:`, `article:`) permettent de lier des fiches de types différents.

---

## Commandes

```bash
npm run dev        # lance le graphe en local
npm run sync       # recalcule backlinks + régénère _graph.json
npm run graph      # régénère _graph.json uniquement
npm run backlinks  # recalcule citedBy[] uniquement
```

Commandes Python :

```bash
python3 scripts/backlinks_updater.py           # recalcule citedBy
python3 scripts/backlinks_updater.py --scan    # propose des liens manquants
python3 scripts/backlinks_updater.py --migrate # migre ancien schéma séparé → related unifié
```

---

## Commandes Claude Code

Si tu utilises Claude Code (claude.ai/code), des commandes sont disponibles dans `.claude/commands/` :

| Commande | Usage |
|----------|-------|
| `/new-concept` | Crée une fiche concept guidée |
| `/new-book` | Crée une fiche livre + auteur |
| `/new-author` | Crée une fiche auteur |
| `/link-concepts` | Propose et ajoute des liens manquants |
| `/sync-graph` | Synchronise le graphe complet |
| `/brainstorm-km` | Extrait des fiches depuis une source |
| `/review-pr` | Review une PR de contribution |

---

## Clusters disponibles

| Cluster | Couleur |
|---------|---------|
| Productivité | Bleu |
| Cognition | Orange |
| Systèmes | Vert |
| IA & Outils | Violet |
| Philosophie | Rouge |
| Finance & Marchés | Jaune |
| Travail & IA | Vert sombre |
| Stratégie & Levier | Gris foncé |
| Psychologie Sociale | Orange sombre |

Tu peux créer de nouveaux clusters librement dans le frontmatter.

---

## Contribuer

Voir [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Licence

**Code** (`scripts/`, `src/`) : MIT

**Contenu** (`notes/`) : CC BY-SA 4.0 — les dérivés doivent rester open source et citer l'auteur.
