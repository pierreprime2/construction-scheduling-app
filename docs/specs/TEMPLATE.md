# [Feature Name]

**Status:** Draft | In Progress | Implemented | Deprecated
**Created:** YYYY-MM-DD
**Last Updated:** YYYY-MM-DD
**Author:** Pierre

## Context
Pourquoi cette feature ? Quel problème résout-elle ?

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2

## Technical Approach
Comment on implémente (haut niveau)

## Implementation Notes
Décisions techniques, alternatives considérées

## Validation Criteria
Comment valider que c'est terminé ?

## Changes Log
- YYYY-MM-DD: Création initiale
- YYYY-MM-DD: [Description du changement]
```

## Étape 3 : Prompt pour Claude Code

Voici le prompt à utiliser dans Claude Code :
```
Je veux implémenter une nouvelle feature en suivant OpenSpec.

1. Lis le template dans docs/specs/TEMPLATE.md
2. Crée une spec pour ma feature : [décris ta feature]
3. Sauvegarde la spec dans docs/specs/features/[nom-feature].md
4. Une fois la spec validée par moi, implémente le code
5. Mets à jour la spec avec les décisions d'implémentation
6. Ajoute une entrée dans le Changes Log de la spec

À chaque modification de la spec, explique-moi le diff avant de l'appliquer.
```

## Étape 4 : Workflow itératif

Pour les modifications futures :
```
Consulte docs/specs/features/[nom-feature].md
Je veux modifier : [ta demande]

1. Propose un diff de la spec en markdown
2. Attends ma validation
3. Applique les changements code + spec
4. Update le Changes Log avec la date et description
```

## Bonus : Traçabilité Git

Ajoute un `.gitattributes` pour mieux tracker les specs :
```
docs/specs/**/*.md diff=markdown