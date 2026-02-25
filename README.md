# Dashboard Application — Projet de fin d'exercice

Description
-----------
Ce projet est une application d'administration (admin dashboard) Vue 3 destinée à gérer une boutique en ligne fictive : produits, utilisateurs, commandes et analytics. L'objectif principal est de démontrer la maîtrise des concepts appris durant le cours : Vue 3 (Composition API), Vue Router (routes protégées), Pinia (state management), consommation d'API, composants réutilisables et gestion des formulaires avec validation.

Statut
------
Fonctionnalités principales implémentées :
- Authentification (login, état persistant, routes protégées, logout)
- Page d'accueil du dashboard avec cartes de statistiques et liste d'actions rapides
- Gestion des produits : liste paginée, recherche/filtre, création, modification, suppression (confirmation)
- Gestion des utilisateurs : liste, recherche, détail des utilisateurs, rôle/permission affichés
- Analytics : graphiques de ventes (journées/semaines/mois), produits les plus vendus, statistiques de revenus
- Layout : barre latérale (sidebar), navbar, breadcrumbs, responsive design
- États de chargement et gestion des erreurs

Technologies
------------
- Vue 3 (Composition API)
- Vue Router
- Pinia
- Fetch API (services dans `src/services/api.js`)
- Vite (outil de build/dev)
- Chart.js (pour les graphiques) — si installé
- CSS simple / framework léger selon configuration du projet

Structure du projet (principaux fichiers)
----------------------------------------
src/
- main.js                      # point d'entrée
- App.vue                      # wrapper principal
- router/index.js              # configuration des routes + protections
- services/api.js              # fonctions fetch pour l'API (FakeStore / mocks)
- stores/                      # Pinia stores (auth, products, users, analytics)
- components/                  # composants réutilisables et spécifiques
  - common/                     # Button, Card, Pagination, etc.
  - layout/                     # Sidebar, Navbar, Layout
  - products/                   # ProductModal, DeleteConfirmModal
  - users/                      # UserModal, UserDeleteConfirmModal
- views/                       # LoginView, DashboardView, ProductsView, UsersView, AnalyticsView

Installation (local)
--------------------
Prérequis : Node.js (>= 16), npm

1. Installer les dépendances :

```bash
npm install
```

2. Lancer le serveur de développement :

```bash
npm run dev
```

3. Ouvrir l'application dans le navigateur (par défaut) :

http://localhost:5173

Scripts utiles
--------------
- `npm run dev` — démarre le serveur de développement (Vite)
- `npm run build` — génère la build de production
- `npm run preview` — prévisualise la build de production localement
- `npm test` — lance les tests unitaires (si configurés)

Authentification
----------------
- La page de connexion est disponible sur `/login`.
- Les routes protégées redirigent vers la page de connexion si l'utilisateur n'est pas authentifié.
- L'état d'authentification est sauvegardé (localStorage) pour persistance entre sessions.

API et données
---------------
Le projet peut consommer des APIs publiques (par exemple Fake Store API) ou des mocks locaux. Les appels réseau sont centralisés dans `src/services/api.js`. Si vous préférez utiliser des données locales, les stores peuvent être configurés pour charger des fixtures/mocks.

Déploiement
-----------
1. Générer la build :

```bash
npm run build
```