# /new-concept

Crée une nouvelle fiche concept dans le KMS.

## Instructions

1. Si un titre est passé en argument, utilise-le. Sinon demande : titre du concept.

2. Demande les informations suivantes (une par une si non fournies) :
   - **Cluster** : liste les clusters disponibles depuis `_graph.json` → champ `clusters`. Propose la liste numérotée.
   - **Résumé** : 1 phrase qui définit le concept (sera utilisée comme summary dans le graphe).
   - **Sources** : auteur(s) et référence(s) principales (optionnel).

3. Génère le slug : `title` en kebab-case minuscules, sans accents.
   Ex : "Ego Depletion" → `ego-depletion`

4. Crée `notes/concepts/[slug].md` avec le frontmatter canonique pré-rempli :

```yaml
---
title: "[Titre]"
type: concept
cluster: "[Cluster choisi]"
related: []
citedBy: []
aliases:
  fr: []
  en: []
tags: []
status: draft
dateCreated: "[YYYY-MM-DD]"
sources: []
---
```

Puis le body avec les sections :

```markdown
# [Titre]

> **Auteur** : 
> **Source** : 

## Définition

[Résumé fourni]

## Mécanisme

## Applications

## Liens avec d'autres concepts

## Sources
```

5. Lance `python3 scripts/backlinks_updater.py --scan` pour détecter des liens potentiels.
   Affiche les suggestions une par une, confirmation avant d'ajouter chaque lien.

6. Affiche la fiche créée et propose d'ouvrir dans l'éditeur.
