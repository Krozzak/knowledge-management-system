# /new-author

Crée une fiche auteur dans le KMS.

## Instructions

1. Si un nom est passé en argument, utilise-le. Sinon demande : nom complet de l'auteur.

2. Demande :
   - **Domaine** : philosophie, économie, psychologie, tech, etc.
   - **Livres connus** : titres des livres présents dans `notes/books/` ou à ajouter
   - **Concepts associés** : concepts clés associés à cet auteur dans le graphe
   - **Dates** (optionnel) : années de naissance/mort ou de carrière

3. Génère le slug : `[prénom-nom]` en kebab-case minuscules.
   Ex : "Naval Ravikant" → `naval-ravikant`

4. Crée `notes/authors/[slug].md` :

```yaml
---
title: "[Prénom Nom]"
type: author
cluster: "[Cluster principal]"
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

Body :
```markdown
# [Prénom Nom]

> **Domaine** : [domaine]
> **Période** : [dates ou décennie d'activité]

## Idées centrales

## Livres principaux

## Concepts associés

## Ce que j'en retiens
```

5. Lie automatiquement aux livres déjà présents dans `notes/books/` dont l'auteur correspond.
   Pour chaque match : ajoute `author:[slug]` dans le `related` du livre (avec confirmation).
