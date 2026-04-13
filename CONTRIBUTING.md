
# CONTRIBUTING.md

## Contribution Guide

Ce projet suit une organisation Git inspirée de GitFlow afin de garantir un historique clair et une intégration progressive des fonctionnalités.

---

## Branching Strategy

### Main branches

* `main` : version stable et prête pour la production
* `develop` : branche d’intégration principale

### Feature branches

Chaque nouvelle fonctionnalité doit être développée dans une branche dédiée :

```bash
git checkout develop
git checkout -b feature/backend-health-route
```

Convention :

```bash
feature/<nom-feature>
```

Exemples :

* feature/frontend-dashboard
* feature/traefik-config
* feature/docker-optimization

---

## Commit Convention

Les commits suivent le standard Conventional Commits.

### Prefixes autorisés

* `feat:` nouvelle fonctionnalité
* `fix:` correction
* `docs:` documentation
* `chore:` maintenance

### Exemples

```bash
feat: add backend health endpoint
fix: correct redis connection
docs: update docker usage instructions
chore: optimize dockerfile layers
```

---

## Atomic Commits Rule

Un commit = une modification logique unique.

Exemple :

❌ Mauvais :

```bash
feat: backend + frontend + docker changes
```

✅ Bon :

```bash
feat: add backend /health route
feat: connect frontend to backend API
chore: add backend healthcheck in compose
```

---

## Merge Policy

Les branches feature sont fusionnées dans `develop` après validation.

Commande :

```bash
git checkout develop
git merge feature/backend-health-route
```

---

## Conflict Resolution

En cas de conflit :

```bash
git status
```

Résoudre manuellement les fichiers puis :

```bash
git add .
git commit
```

Documenter le conflit résolu dans l’historique Git.

---

## Self Review Checklist

Avant merge :

* [ ] code testé localement
* [ ] docker build fonctionne
* [ ] pas de secret versionné
* [ ] variables d’environnement utilisées
* [ ] documentation mise à jour
* [ ] logs vérifiés

---

## Protected Branches

Les branches suivantes ne doivent pas être modifiées directement :

* main
* develop

Tout changement passe par feature branch.
