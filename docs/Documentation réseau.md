Livrable 3.2 — Documentation réseau
1. Schéma des flux réseau
                    Internet / Navigateur
                             │
                             ▼
                    ┌──────────────────┐
                    │   Traefik (80/443)│
                    │ Reverse Proxy TLS │
                    └──────────────────┘
                             │
     ┌───────────────────────┼────────────────────────┐
     │                       │                        │
     ▼                       ▼                        ▼
Frontend (Nginx)        Backend API              Adminer / MailHog
app.localhost           api.localhost           db/mail.localhost
     │                       │
     │                       ▼
     │               Réseau backend Docker
     │            ┌──────────────────────────┐
     │            │ PostgreSQL + Redis       │
     │            └──────────────────────────┘
     │
     ▼
Réseau frontend Docker (Traefik uniquement exposé)

2. Fonctionnement de Traefik

Traefik est utilisé comme reverse proxy intelligent.

Il agit comme point d’entrée unique pour toute l’infrastructure.

2.1 Providers

Le provider Docker permet à Traefik de :

détecter automatiquement les conteneurs actifs
lire les labels Docker
créer dynamiquement les routes HTTP/HTTPS

Exemple :

traefik.enable=true
traefik.http.routers.api.rule=Host(`api.localhost`)

Dès qu’un conteneur démarre, Traefik le prend en charge automatiquement.

2.2 Routers

Les routers définissent :

les règles d’accès (Host, Path)
le protocole (HTTP / HTTPS)
les entrypoints

Exemple :

traefik.http.routers.api.rule=Host(`api.localhost`)
traefik.http.routers.api.entrypoints=websecure
traefik.http.routers.api.tls=true

Ici :

api.localhost est redirigé vers le backend
via HTTPS uniquement

2.3 Services

Les services représentent les conteneurs réels.

Exemple :

traefik.http.services.api.loadbalancer.server.port=3000

Traefik sait que :

le backend écoute sur le port 3000
et il lui transmet les requêtes

2.4 Middlewares

Les middlewares permettent d’ajouter des couches de sécurité et de traitement.

Dans le projet :

Compression
réduit la taille des réponses HTTP
compress=true
Rate limiting
protège contre surcharge / attaque brute force
average=100
burst=50
Headers de sécurité
empêche clickjacking
protège MIME sniffing
active HSTS
frameDeny=true
contentTypeNosniff=true
stsSeconds=31536000
Basic Auth
protège Adminer et dashboard Traefik

3. Justification des choix de sécurité
3.1 Aucun port exposé directement

✔ Tous les services internes (backend, DB, Redis) sont isolés
✔ Seul Traefik expose les ports 80/443

Avantage :

surface d’attaque réduite
contrôle centralisé du trafic

3.2 HTTPS obligatoire

✔ TLS activé via Traefik
✔ accès uniquement en https://*.localhost

Avantage :

chiffrement des communications
protection des données sensibles

3.3 Isolation réseau Docker

Deux réseaux séparés :

frontend → services exposés + Traefik
backend → base de données + cache

Avantage :

impossible d’accéder directement à PostgreSQL depuis Internet
segmentation type production réelle

3.4 Middlewares de sécurité

✔ Rate limiting
✔ Headers sécurisés
✔ Compression contrôlée
✔ Authentification Basic

Avantage :

protection contre abus API
réduction attaques XSS / clickjacking
contrôle accès interfaces sensibles

3.5 Variables d’environnement

✔ secrets dans .env
✔ .env ignoré par Git

Avantage :

aucun mot de passe dans le code
conformité bonnes pratiques DevOps

4. Conclusion

Cette architecture reproduit un environnement de production simplifié :

Reverse proxy intelligent (Traefik)
Isolation réseau stricte
Sécurité HTTP appliquée
Routage dynamique
Infrastructure scalable

Elle permet d’ajouter facilement :

replicas backend
monitoring (Prometheus/Grafana)
CI/CD GitHub Actions