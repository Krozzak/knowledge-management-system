# /brainstorm-km

Extrait des fiches KMS depuis une source (URL, texte, transcript, podcast, livre).

## Arguments

`/brainstorm-km [source]`

- Source = URL, texte collé, transcript, résumé de livre
- Flag optionnel `--pr` : crée une branche et ouvre une PR au lieu de committer directement

## Instructions

1. Analyse la source fournie. Identifie :
   - **Concepts** mentionnés ou impliqués → fiches `notes/concepts/`
   - **Livres** cités → fiches `notes/books/`
   - **Auteurs** cités → fiches `notes/authors/`
   - **Projets** mentionnés → fiches `notes/projects/`

2. Pour chaque entité identifiée :
   - Vérifie si une fiche existe déjà dans `notes/`.
   - Si oui : propose d'enrichir la fiche existante avec de nouveaux éléments.
   - Si non : génère une fiche draft avec frontmatter pré-rempli + sections body à compléter.

3. Pour les liens entre nouvelles fiches et existantes :
   - Propose les liens (affiche source → cible + contexte).
   - Ne crée pas les liens automatiquement — confirmation une par une.

4. Si `--pr` :
   - Crée une branche `contribution/brainstorm-YYYY-MM-DD`.
   - Commit les nouvelles fiches.
   - Propose d'ouvrir une PR GitHub (`gh pr create`).

5. Résumé final :
   ```
   Brainstorm terminé

   Fiches créées : N (X concepts, Y livres, Z auteurs)
   Fiches enrichies : N
   Liens proposés : N
   ```

## Règle absolue

Ne jamais générer du contenu assertif sans supervision humaine.
Les sections body sont des **squelettes à remplir**, pas du contenu généré.
