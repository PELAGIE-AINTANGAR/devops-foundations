# DevOps Foundations – Infrastructure Docker

## Présentation

Projet académique de type **cloud-native / DevOps** visant à simuler une infrastructure proche production.

### Objectifs

* Déployer une architecture microservices
* Utiliser Docker & Docker Compose
* Mettre en place un reverse proxy sécurisé (Traefik)
* Appliquer les bonnes pratiques DevOps
* Implémenter un workflow Git professionnel + CI/CD

### Contraintes respectées

* Aucun port applicatif exposé directement
* Accès uniquement via Traefik
* Variables sensibles dans `.env`
* HTTPS obligatoire

---

## Architecture globale

```
Utilisateur
    ↓
Traefik (Reverse Proxy HTTPS)
    ↓
------------------------------------------------
| Frontend | Backend | Adminer | MailHog | Whoami |
------------------------------------------------
                ↓
        Réseau backend isolé
        PostgreSQL + Redis
```

---

## Traefik – Reverse Proxy

### Rôle

* Routage HTTP/HTTPS
* Terminaison TLS
* Load balancing
* Middleware de sécurité

### EntryPoints

* web : :80 → redirection HTTPS
* websecure : :443

Mapping local :

* 8088 → 80
* 8443 → 443

---

### Routage (DNS local)

| URL               | Service   |
| ----------------- | --------- |
| app.localhost     | Frontend  |
| api.localhost     | Backend   |
| db.localhost      | Adminer   |
| mail.localhost    | MailHog   |
| traefik.localhost | Dashboard |

---

### Middlewares

* Compression gzip
* Headers de sécurité (HSTS, XSS, etc.)
* Rate limiting API
* Basic Auth (dashboard + Adminer)

---

## Services

### Backend (Node.js API)

Endpoints :

* GET /health → statut
* GET / → info service
* GET /db → test PostgreSQL
* GET /cache → test Redis
* POST /contact → email MailHog

Test :

```bash
curl -k -H "Host: api.localhost" https://localhost:8443/health
```

---

### Frontend (Nginx)

Fonctionnalités :

* Dashboard état services
* Compteur Redis
* Formulaire contact

Accès :

```
https://app.localhost:8443
```

---

### Services infrastructure

| Service    | Rôle             |
| ---------- | ---------------- |
| PostgreSQL | Base de données  |
| Redis      | Cache / compteur |
| MailHog    | SMTP de test     |
| Adminer    | Interface DB     |
| Whoami     | Test réseau      |

---

## Docker & Conteneurisation

### Dockerfiles

* Multi-stage build
* Image Alpine optimisée
* User non-root
* Healthcheck intégré

### Docker Compose

* `docker-compose.yml` base
* `override` dev
* `prod` production

### Réseaux

* frontend network → Traefik + UI services
* backend network → DB + Redis (isolé)

---

## Sécurité

* HTTPS obligatoire
* Aucun port backend exposé
* Isolation réseau stricte
* Headers HTTP sécurisés
* Authentification (Basic Auth)
* Variables via `.env`

---

## Workflow Git (GitFlow)

### Branches

* main → production
* develop → intégration
* feature/* → développement

### Conventional commits

* feat: nouvelle fonctionnalité
* fix: correction
* docs: documentation
* chore: maintenance

### Process

* PR obligatoires
* Minimum 5 commits par feature
* Merge avec review

---

## CI/CD (GitHub Actions)

Pipeline automatisé :

* Build images Docker
* Validation configuration
* Installation dépendances
* Simulation build backend/frontend



---

## Tests

### Frontend

```bash
curl -k -H "Host: app.localhost" https://localhost:8443
```

### Backend

```bash
curl -k -H "Host: api.localhost" https://localhost:8443/health
```

### Réseau interne

```bash
docker exec -it frontend sh
wget -qO- http://backend:3000/health
```

---

## Commandes utiles

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f
docker compose down
```

---

## Installation

### Prérequis

* Docker
* Docker Compose
* mkcert

### Initialisation

```bash
mkcert -install
```

### Hosts locaux

Ajouter dans /etc/hosts :

127.0.0.1 app.localhost api.localhost db.localhost mail.localhost traefik.localhost

### Installation du projet
1. Cloner le repo
git clone <repo-url>
cd devops-foundations

2. Variables d’environnement
cp .env.example .env

3. Générer certificats TLS
mkcert app.localhost api.localhost db.localhost mail.localhost traefik.localhost

### Lancer le projet

```bash
docker compose up -d --build
```

### Vérifier le statut
```bash
docker compose ps
```

---

## Tests de validation

✔ Frontend accessible via Traefik
✔ Backend API fonctionnel
✔ Communication inter-services OK
✔ PostgreSQL + Redis opérationnels
✔ MailHog capturant les emails
✔ HTTPS actif

---

## Résumé architecture technique

```
Frontend → Traefik → Backend → PostgreSQL / Redis
                 ↓
              Adminer
                 ↓
              MailHog
```

---

## Résultat final

✔ Architecture microservices
✔ Reverse proxy sécurisé (Traefik)
✔ HTTPS local
✔ Isolation réseau
✔ Observabilité basique
✔ CI/CD prêt
✔ Workflow Git professionnel

---

## Conclusion

Ce projet démontre une **infrastructure DevOps complète et réaliste**, respectant les standards modernes :

* Sécurité
* Scalabilité
* Automatisation
* Maintenabilité

Base solide pour évoluer vers Kubernetes et production cloud.
