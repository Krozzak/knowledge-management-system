# Contribuer au KMS

Merci de vouloir contribuer au graphe public. Voici comment ça fonctionne.

---

## Principe

Le graphe public est une **agrégation de contributions volontaires**. Tu travailles dans ton vault local, et si tu veux partager une fiche, tu ouvres une PR.

Le CI vérifie automatiquement la qualité de ta contribution, mais ne bloque jamais — c'est une alerte pour le maintainer.

---

## Ajouter une fiche

### 1. Crée ta branche

```bash
git checkout -b contribution/[slug-de-ta-fiche]
```

### 2. Crée ta fiche

Place-la dans le bon dossier selon le type :

```
notes/concepts/[slug].md
notes/books/[slug].md
notes/authors/[slug].md
notes/projects/[slug].md
notes/articles/[slug].md
```

Utilise les templates (`TEMPLATE_CONCEPT.md`, `TEMPLATE_BOOK.md`, etc.) comme point de départ.

### 3. Frontmatter obligatoire

```yaml
---
title: "Titre exact"
cluster: Systèmes          # voir liste dans README
related: []                # liens vers d'autres fiches (concept:slug, book:slug, ...)
status: draft              # draft | ready | published
dateCreated: "YYYY-MM-DD"
---
```

Champs obligatoires : `title`, `cluster`, `related`, `status`, `dateCreated`.

### 4. Format du champ related

```yaml
related:
  - concept:small-world-network
  - book:naval-almanack
  - author:naval-ravikant
```

Les slugs doivent exister dans le repo ou dans ta PR.

### 5. Synchronise et commit

```bash
npm run sync        # recalcule backlinks + _graph.json
git add notes/
git commit -m "feat(concept): add [slug]"
git push origin contribution/[slug]
```

### 6. Ouvre la PR

Via `gh pr create` ou l'interface GitHub.

---

## Ce que le CI vérifie

- **Frontmatter** : champs obligatoires présents, format correct
- **Liens** : chaque slug dans `related` existe dans le repo ou dans la PR
- **Doublons** : similarité titre > 0.6 → alerte (pas un blocage)

Le bot commentera automatiquement avec un résumé.

---

## Règles éditoriales

- **Une fiche = un concept précis** — pas de fourre-tout
- **Sources vérifiables** — citer l'auteur et l'œuvre originale
- **Pas de génération LLM non supervisée** — le contenu doit être relu par un humain
- **Neutre et factuel** — l'interprétation personnelle va dans "Ce que j'en retiens", pas dans "Définition"

---

## Doublons

Si le CI détecte un doublon probable :
- **Fusionner** : si ta fiche est une version plus complète → propose une PR de mise à jour sur la fiche existante
- **Garder les deux** : si les angles sont vraiment différents → explique pourquoi dans la description de PR
- **Agréger** : si tu as des sources supplémentaires → ajoute-les à la fiche existante

---

## Questions

Ouvre une Issue avec le template approprié (`new-concept.md` ou `broken-link.md`).
