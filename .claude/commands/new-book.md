# /new-book

Crée une fiche livre dans le KMS.

## Instructions

1. Si un titre est passé en argument, utilise-le. Sinon demande : titre du livre.

2. Demande :
   - **Auteur(s)** : nom(s) de l'auteur ou des auteurs
   - **Année de publication**
   - **Concepts extraits** : concepts clés que le livre développe (slugs si connus, sinon titres)
   - **Citation clé** : une citation représentative (optionnel)
   - **Résumé** : 1-2 phrases sur l'argument central du livre

3. Génère les slugs :
   - Livre : `[auteur-nom]-[titre-court]` en kebab-case
   - Ex : "The Almanack of Naval Ravikant" par Naval Ravikant → `naval-ravikant-almanack`

4. Crée `notes/books/[slug].md` :

```yaml
---
title: "[Titre complet]"
type: book
cluster: "[Cluster le plus proche]"
related: []
citedBy: []
aliases:
  fr: []
  en: []
tags: []
status: draft
dateCreated: "[YYYY-MM-DD]"
sources:
  - "[Auteur] ([Année]). [Titre]. [Éditeur]."
---
```

Body :
```markdown
# [Titre]

> **Auteur** : [Auteur]
> **Année** : [Année]
> **Catégorie** : [domaine]

## Argument central

[Résumé]

## Concepts clés

## Citation clé

> "[Citation]"

## Ce que j'en retiens
```

5. Pour chaque auteur listé :
   - Vérifie si `notes/authors/[auteur-slug].md` existe.
   - Si non : propose de créer la fiche auteur (confirmation requise).
   - Si oui : ajoute ce livre dans le champ `related` de la fiche auteur.

6. Pour les concepts mentionnés :
   - Ajoute les refs `concept:[slug]` dans `related` du livre.
   - Propose d'ajouter `book:[slug]` dans le `related` des fiches concept concernées.
