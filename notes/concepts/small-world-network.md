---
title: "Small World Network"
type: concept
cluster: Systèmes
related:
  - concept:permissionless-leverage
  - concept:specific-knowledge
  - concept:shelling-point
citedBy: []
aliases:
  fr: ["réseau petit monde"]
  en: ["small world network"]
tags: []
status: draft
dateCreated: "2026-01-01"
sources:
  - "Watts, D. J. & Strogatz, S. H. (1998). Collective dynamics of 'small-world' networks. Nature, 393, 440–442."
  - "Milgram, S. (1967). The Small World Problem. Psychology Today, 1(1), 61–67."
  - "Barabási, A.-L. & Albert, R. (1999). Emergence of Scaling in Random Networks. Science, 286(5439), 509–512."
---

# Small World Network — Le réseau petit monde

> **Auteur** : Duncan Watts & Steven Strogatz (1998)
> **Source** : "Collective dynamics of 'small-world' networks", *Nature*, 393, 440–442 (1998)
> **Origine historique** : Stanley Milgram (1967) — expérience des "Six Degrés de Séparation"
> **Catégorie** : Théorie des graphes / Réseaux complexes

## Définition

Un Small World Network est un graphe dans lequel **n'importe quel nœud est accessible depuis n'importe quel autre nœud en un petit nombre de sauts**, malgré un nombre de connexions locales faible. La propriété clé : des nœuds très connectés ("hubs") créent des raccourcis qui effondrent les distances dans le réseau.

> Watts & Strogatz : un réseau est "small world" si son **diamètre** (distance maximale entre deux nœuds) croît logarithmiquement avec la taille du réseau, pas linéairement.

## L'expérience de Milgram (1967)

Stanley Milgram a envoyé des lettres à des inconnus dans le Nebraska avec instruction de les faire parvenir à une cible à Boston — mais uniquement via des connaissances directes. Résultat moyen : **6 intermédiaires**. D'où "Six Degrees of Separation".

La surprise : pas 60, pas 600 — **6**. Dans un réseau de 300 millions de personnes, 6 liens suffisent.

## Pourquoi ça marche : les "weak ties" et les hubs

**Liens faibles (weak ties)** — Granovetter (1973) avait déjà montré que les liens les plus utiles pour l'information ne sont pas les amis proches (liens forts) mais les **connaissances lointaines** (liens faibles) — elles connectent des clusters différents.

**Hubs** — Barabási & Albert (1999, Scale-Free Networks) : dans la plupart des réseaux réels, quelques nœuds sont hyperconnectés. Ces hubs réduisent drastiquement la distance moyenne entre tous les autres nœuds.

## Application au graphe de concepts personnels

Dans un graphe de 200 concepts bien connectés, tout concept devrait être accessible depuis tout autre concept en ≤5 liens. Les **hubs conceptuels** sont les concepts fondationnels qui apparaissent dans beaucoup de fiches différentes.

Règle empirique :
- **Minimum** : ~log(N) liens par nœud
- **Maximum recommandé** : 10-15 liens
- **Seuil "hub"** : si un concept a >20 liens, c'est un hub fondationnel

## Sources

- Watts, D. J. & Strogatz, S. H. (1998). "Collective dynamics of 'small-world' networks." *Nature*, 393, 440–442.
- Milgram, S. (1967). "The Small World Problem." *Psychology Today*, 1(1), 61–67.
- Barabási, A.-L. & Albert, R. (1999). "Emergence of Scaling in Random Networks." *Science*, 286(5439), 509–512.
- Granovetter, M. (1973). "The Strength of Weak Ties." *American Journal of Sociology*, 78(6), 1360–1380.
