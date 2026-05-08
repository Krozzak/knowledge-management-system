# /link-concepts

Propose et ajoute des liens manquants dans les fiches du KMS.

Wrapper interactif de `backlinks_updater.py --scan`.

## Instructions

1. Lance `python3 scripts/backlinks_updater.py --scan`.

2. Pour chaque lien proposé, affiche :
   ```
   Lier [source-ref] → [target-ref] ?
   Source : [titre de la fiche source]
   Cible  : [titre de la fiche cible]
   Contexte : [extrait de la phrase où la cible est mentionnée]
   [o/N]
   ```

3. À confirmation `o` : ajoute `[target-ref]` dans `related` de la fiche source.

4. À la fin : résumé — N liens ajoutés, M ignorés.

5. Propose de relancer `/sync-graph` pour régénérer le graphe.
