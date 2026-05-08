# /review-pr

Review d'une PR de contribution KMS depuis Claude Code. Pour le maintainer.

## Arguments

`/review-pr [numéro]`

- Sans numéro : liste les PRs ouvertes
- Avec numéro : review complète de la PR

## Instructions

### Sans numéro — liste des PRs

Lance `gh pr list --repo Krozzak/knowledge-management-system`.
Affiche pour chaque PR : numéro, titre, auteur, statut CI (validate-pr).

### Avec numéro — review complète

1. Lance `gh pr view [numéro] --repo Krozzak/knowledge-management-system`.
   Récupère les fichiers modifiés.

2. Lis chaque fiche `.md` ajoutée ou modifiée dans la PR.

3. Pour chaque fiche, affiche :
   ```
   ## [titre] ([type]:[slug])
   Cluster : [cluster]
   Liens déclarés : [N]
   Status : [draft/ready/published]

   Résumé : [1ère phrase du body]
   ```

4. Affiche les résultats CI :
   - Frontmatter valide ?
   - Liens cassés ?
   - Doublons détectés (avec scores) ?

5. Recommandation :
   - ✅ **Merger** — si tout est propre
   - ⚠️ **Demander modifications** — si liens cassés ou frontmatter invalide
   - 🔄 **Fusionner avec existant** — si doublon fort (score > 0.75)
   - ❌ **Rejeter** — si hors scope ou qualité insuffisante

6. Propose des commentaires de review à poster sur GitHub.
   Affiche le texte prêt à copier-coller, ou demande confirmation pour poster via `gh`.

## Règle absolue

Ne jamais merger automatiquement. Toujours confirmation explicite avant `gh pr merge`.
