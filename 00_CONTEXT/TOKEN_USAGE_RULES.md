# TOKEN USAGE RULES — Gestion du contexte

## Principes

- Ne jamais recopier un fichier entier dans un prompt si un résumé suffit
- Toujours résumer les outputs longs avant de les passer à l'étape suivante
- Un fichier dans `/03_RESEARCH_RAW/` ne doit pas dépasser 2 000 mots bruts

## Règles par type de fichier

| Fichier | Action avant passage au prompt |
|---------|-------------------------------|
| Research brut | Résumer en 10 bullets max |
| Output prompt | Extraire uniquement les décisions |
| Persona | Garder fiche synthèse (1 page max) |
| Reviews/VOC | Top 5 verbatims par tension |

## Priorité de contexte en début de session

Charger dans cet ordre :
1. `SESSION_SUMMARY.md` — ce qui a été fait
2. `MEMORY.md` — état actuel du projet
3. Le prompt de l'étape en cours dans `/01_PROMPTS/`

Ne pas charger les fichiers `/02_OUTPUTS/` en entier sauf si nécessaire.

## Indicateur de charge

Estimer la charge token avant chaque session :
- Léger (< 5 fichiers courts) → OK
- Moyen (5–15 fichiers) → résumer avant de charger
- Lourd (> 15 fichiers) → ne charger que les essentiels
