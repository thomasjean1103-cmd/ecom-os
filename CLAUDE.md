@AGENTS.md

# Claude Code — Système Pinterest Ads FR/EU

## Rôle de Claude Code

Claude Code gère uniquement :
- Création et modification de fichiers Markdown
- Organisation des dossiers et de la structure du repo
- Automatisation locale (scripts, renommage, déplacement de fichiers)
- Lecture et synthèse de fichiers existants

Claude Code ne fait PAS :
- Recherches web (→ utiliser Cowork)
- Validation de données marché (→ utiliser Cowork)
- Analyse de tendances Pinterest (→ utiliser Cowork)
- Invention de chiffres, niches, ou personas

## Règle absolue : Ne jamais inventer de données

Tout contenu factuel doit être tagué avec l'un de ces statuts :

| Tag | Signification |
|-----|--------------|
| `[VÉRIFIÉ]` | Source primaire confirmée (screenshot, API, lien direct) |
| `[ESTIMÉ]` | Calcul ou projection basé sur données vérifiées |
| `[HYPOTHÈSE]` | Raisonnement logique sans source directe |
| `[NON VÉRIFIÉ]` | À confirmer avant toute décision |

Si une donnée n'a pas de tag → elle ne doit pas exister dans le système.

## Pipeline de référence

Ce repo suit le **Pipeline Pinterest Ads FINAL v4.5**.
Les prompts dans `/01_PROMPTS/` sont les points d'entrée de chaque étape.
Ne jamais modifier le contenu d'un prompt sans instruction explicite.

## Réponses courtes

- Répondre en bullet points quand c'est possible
- Pas de blocs introductifs inutiles
- Pas de reformulation de la question
- Maximum 3 phrases de contexte avant d'agir

## Structure du repo Pinterest Ads

```
/00_CONTEXT      → Mémoire, règles de session, résumés
/01_PROMPTS      → Prompts pipeline v4.5 (un fichier par étape)
/02_OUTPUTS      → Outputs générés par les prompts
/03_RESEARCH_RAW → Données brutes issues de Cowork (non traitées)
/04_DECISIONS    → Décisions actées avec justification et statut
/05_PERSONA      → Profils persona validés
/06_OFFER        → Offre, pricing, bundles
/07_CREATIVES    → Briefs créatifs, angles, hooks
/08_ADS          → Copies publicitaires finales
/09_REPORTING    → Rapports de performance
```

## Workflow type

1. **Cowork** → recherche web réelle → colle le résultat brut dans `/03_RESEARCH_RAW/`
2. **Claude Code** → lit le raw → structure dans le bon dossier avec tags de statut
3. **Cowork** → exécute le prompt depuis `/01_PROMPTS/` → colle l'output dans `/02_OUTPUTS/`
4. **Claude Code** → organise, versionne, met à jour `/00_CONTEXT/SESSION_SUMMARY.md`

## Conventions de nommage

- Fichiers : `SNAKE_UPPER_CASE.md`
- Versions : suffixe `_v1`, `_v2`, etc.
- Dates : format `YYYYMMDD` en préfixe si nécessaire
