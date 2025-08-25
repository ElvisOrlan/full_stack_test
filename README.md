# gestionutilisateurgrm
Système de gestion utilisateurs
# Gestion des Utilisateurs

> Application web de gestion des utilisateurs avec authentification JWT, système de rôles et interface d'administration développée dans le cadre d'un test technique full-stack.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies](#-technologies-utilisées)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Structure du projet](#-structure-du-projet)
- [API Endpoints](#-endpoints-api)
- [Comptes de test](#-comptes-de-test)
- [Usage](#-usage)
- [Sécurité](#-sécurité)
- [Captures d'écran](#-captures-décran)
- [Architecture](#-architecture-technique)
- [Limitations](#-limitations-connues)

## 🚀 Fonctionnalités

### Backend
- ✅ **Authentification JWT** sécurisée
- ✅ **CRUD utilisateurs** complet (Créer, Lire, Mettre à jour, Supprimer)
- ✅ **Système de rôles** (Admin/User) avec permissions différenciées
- ✅ **Pagination et recherche** par nom/email
- ✅ **Suppression individuelle** d'utilisateurs
- ✅ **Suppression multiple** d'utilisateurs
- ✅ **API REST** sécurisée avec middleware d'authentification

### Frontend
- ✅ **Interface de connexion** avec formulaire email/mot de passe
- ✅ **Dashboard administratif** avec tableau des utilisateurs
- ✅ **Formulaires d'ajout/modification** d'utilisateurs
- ✅ **Gestion des rôles** et statuts (actif/inactif)
- ✅ **Affichage conditionnel** selon le rôle utilisateur
- ✅ **Système de notifications** (succès/erreur)
- ✅ **Déconnexion automatique** à l'expiration du token

## 🛠 Technologies utilisées

### Backend
- **Laravel 12** - Framework PHP
- **PHP 8.4** - Langage serveur
- **MySQL** - Base de données relationnelle
- **JWT Authentication** - php-open-source-saver/jwt-auth

### Frontend
- **JavaScript Vanilla** - Logique côté client
- **HTML5** - Structure des pages
- **CSS3** - Stylisation et mise en page
- **Fetch API** - Requêtes AJAX vers l'API

## 📋 Prérequis

- **PHP 8.1+**
- **Composer** - Gestionnaire de dépendances PHP
- **MySQL 5.7+**
- **Serveur web** (Apache/Nginx) ou PHP Built-in Server

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone https://github.com/ElvisOrlan/full_stack_test
cd full_stack_test
```

### 2. Installer les dépendances
```bash
composer install
```

### 3. Configuration de l'environnement
```bash
cp .env.example .env
```

Modifier le fichier `.env` avec vos paramètres :
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=user_management
DB_USERNAME=votre_username
DB_PASSWORD=votre_password
```

### 4. Générer les clés
```bash
php artisan key:generate
php artisan jwt:secret
```

### 5. Base de données
```sql
-- Créer la base de données
CREATE DATABASE user_management;
```

```bash
# Exécuter les migrations
php artisan migrate

# Exécuter le seed
php artisan db:seed --class=UtilisateursTableSeeder
```

### 6. Lancer le serveur
```bash
php artisan serve
```

L'application sera accessible à : **http://localhost:8000**

## 📁 Structure du projet

```
user-management/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php          # Authentification JWT
│   │   │   └── UtilisateurController.php    # CRUD utilisateurs
│   │   └── Middleware/
│   ├── Models/
│   │   ├── Utilisateur.php                 # Modèle utilisateur
│   │   └── Role.php                        # Modèle role
├── database/
│   ├── migrations/                         # Migrations de base de données
│   └── seeders/                           # Données de test
├── public/
│   ├── css/
│   │   ├── connexion.css                  # Styles page de connexion
│   │   └── dashboard.css                  # Styles dashboard
│   ├── js/
│   │   ├── login.js                       # Logique authentification
│   │   └── dashboard.js                   # Logique dashboard
│   └── screenshot                         # Captures d'écran 
│	     ├── login.png
│	     ├── Dashboard_admin_accès.png
│		 ├── Dashboard_admin_acces_selection_multiple_Suppression.png
│	     ├── Dashboard_acces_Admin_Formulaire_enregistrement_utilisateur.png
│		 ├── Dashboard_User_acces_readOnly.png
│	     └── Dashboard_user_accès_Visualisation_donnees_Utilisateur.png
│
├── resources/
│   └── views/
│       └── admin/
│           ├── connexion.blade.php        # Page de connexion
│           └── dashboard.blade.php        # Interface dashboard
├── routes/
│   ├── web.php                           # Routes web (vues)
│   └── api.php                           # Routes API REST
└── README.md
```

## 🔌Endpoints API

### Authentification
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/login` | Connexion utilisateur (retourne JWT) |
| `POST` | `/api/logout` | Déconnexion utilisateur |
| `GET` | `/api/me` | Informations utilisateur connecté |

### Gestion des utilisateurs (protégé par JWT)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/users` | Liste paginée avec recherche |
| `POST` | `/api/users` | Création d'un utilisateur |
| `PUT` | `/api/users/{id}` | Modification d'un utilisateur |
| `DELETE` | `/api/users/{id}` | Suppression d'un utilisateur |
| `POST` | `/api/users/suppression-groupe` | Suppression multiple |

### Utilitaires
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/roles` | Liste des rôles disponibles |

## 👥 Comptes de test

### Administrateur
- **Nom :** Admin Principal
- **Email :** `admin@example.com`
- **Mot de passe :** `password123`
- **Permissions :** Lecture, création, modification, suppression

### Utilisateur standard
- **Nom :** Utilisateur Test
- **Email :** `user@example.com`
- **Mot de passe :** `userpass123`
- **Permissions :** Lecture seule

## 📖 Usage

### Connexion
1. Accédez à `http://localhost:8000`
2. Connectez-vous avec un des comptes de test
3. Vous serez redirigé vers le dashboard selon vos permissions

### Dashboard Admin
- Visualiser tous les utilisateurs
- Créer/Modifier/Supprimer des utilisateurs
- Recherche et pagination
- Suppression multiple avec sélection

### Dashboard User
- Visualisation en lecture seule
- Recherche dans la liste des utilisateurs

## 🔒 Sécurité

- **Authentification JWT** avec expiration automatique
- **Middleware de protection** sur toutes les routes API sensibles
- **Validation des données** côté serveur
- **Hachage des mots de passe** avec bcrypt
- **Protection CSRF** intégrée à Laravel

## 📸 Captures d'écran
	Repertoire: public/screenshot
	
### Page de connexion
*Interface de connexion simple avec validation des erreurs*

### Dashboard Administrateur
*Vue complète avec toutes les fonctionnalités CRUD*

### Dashboard Utilisateur
*Vue en lecture seule avec recherche*

> **Note :** Les captures d'écran seront ajoutées dans le dossier `/public/screenshot/`

## 🏗 Architecture technique

### Modèle MVC
- **Models :** Gestion des données (Eloquent ORM)
- **Views :** Interface utilisateur (Blade templates)
- **Controllers :** Logique métier et API

### Communication Frontend/Backend
- **API REST** avec réponses JSON
- **Authentification Bearer Token** (JWT)
- **Requêtes asynchrones** avec Fetch API
- **Gestion d'erreurs** centralisée

### Données utilisateur
Chaque utilisateur dispose des informations suivantes :
- **Nom** - Nom complet de l'utilisateur
- **Email** - Adresse email unique (identifiant de connexion)
- **Rôle** - admin ou user
- **Actif** - Statut actif/inactif (boolean)
- **Date de création** - Timestamp de création automatique

## ⚠️ Limitations connues

- Interface desktop-first (responsive peut être amélioré)
- Pas de validation en temps réel côté client
- Upload de photo de profil non implémenté

## 📝 Notes de développement

### Choix techniques
- **JavaScript Vanilla** utilisé à la place de Vue.js/React
- **Architecture monolithique** Laravel pour simplifier le déploiement
- **Blade templates** pour le rendu côté serveur avec hydratation JavaScript

## 📄 License

Ce projet est développé dans le cadre d'un test technique.

---

**Développé par :** BENI Afotoukpé Mawuli  
**Version :** 1.0  
**Dernière mise à jour :** Août 2025
