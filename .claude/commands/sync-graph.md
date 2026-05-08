# /sync-graph

Synchronise le graphe : backlinks + _graph.json + INDEX.md.

## Instructions

1. Lance `python3 scripts/backlinks_updater.py` — recalcule tous les `citedBy[]`.

2. Lance `node scripts/generate_graph.js` — régénère `_graph.json` et `INDEX.md`.

3. Affiche le résumé :
   ```
   ✅ Graphe synchronisé

   Fiches    : N total (X concepts, Y livres, Z auteurs, ...)
   Clusters  : N
   Liens     : N
   INDEX.md  : régénéré
   ```

4. Si des `citedBy` ont été modifiés, liste les fiches mises à jour.
