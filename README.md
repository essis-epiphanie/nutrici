# 🌿 NutriCI

> **Projet Génie Logiciel** — L2 MIAGE  
> Boutique de compléments alimentaires en ligne

---

## 👥 Membres du groupe

| Nom | Rôle |
|-----|------|
| **Essis Esmelem** | Développeur Backend |
| **Kimou Elijah** | Développeur Backend |

---

## 🛠️ Stack technique

| Catégorie | Technologies |
|-----------|--------------|
| **Langage** | Java 17 |
| **Framework** | Spring Boot 4.1.0 |
| **Base de données** | MySQL (XAMPP) |
| **Gestion de projet** | Maven |
| **Tests API** | Postman |

---

## 🎯 Fonctionnalités

- ✅ Gestion du catalogue (produits / catégories)
- ✅ Gestion du panier et des commandes
- ✅ Paiement Mobile Money (simulé)
- ✅ Vérification automatique du stock
- ✅ Suivi des commandes (EN_ATTENTE → PAYEE → EXPEDIEE)
- ✅ Gestion administrateur des stocks

---

## 📋 User Stories implémentées

### 📦 Module Catalogue

| # | User Story |
|---|------------|
| **US1** | En tant que **Client**, je veux parcourir le catalogue par catégorie. |
| **US2** | En tant que **Client**, je veux consulter les détails d'un produit. |
| **US3** | En tant que **Client**, je veux ajouter des produits à mon panier. |

### 🛒 Module Panier & Commande

| # | User Story |
|---|------------|
| **US4** | En tant que **Client**, je veux payer ma commande par Mobile Money (simulé). |
| **US5** | En tant que **Client**, je veux suivre l'état de ma commande. |
| **US6** | En tant que **Client**, je veux que le stock soit vérifié automatiquement. |

### 🔧 Module Administration

| # | User Story |
|---|------------|
| **US7** | En tant qu'**Administrateur**, je veux ajouter un produit. |
| **US8** | En tant qu'**Administrateur**, je veux modifier le stock d'un produit. |
| **US9** | En tant qu'**Administrateur**, je veux consulter toutes les commandes. |
| **US10** | En tant qu'**Administrateur**, je veux expédier une commande. |

---

## 📡 Endpoints API

### 📦 Produits

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/api/produits` | Liste tous les produits |
| `GET` | `/api/produits/{id}` | Détails d'un produit |
| `POST` | `/api/produits` | Crée un produit |
| `PUT` | `/api/produits/{id}` | Modifie un produit |
| `DELETE` | `/api/produits/{id}` | Supprime un produit |

---

### 🏷️ Catégories

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/api/categories` | Liste toutes les catégories |
| `POST` | `/api/categories` | Crée une catégorie |

---

### 👤 Clients

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/api/clients` | Liste tous les clients |
| `POST` | `/api/clients` | Crée un client |

---

### 📦 Commandes

| Méthode | URL | Description |
|---------|-----|-------------|
| `GET` | `/api/commandes` | Liste toutes les commandes |
| `GET` | `/api/commandes/{id}` | Détails d'une commande |
| `POST` | `/api/commandes` | Crée une commande |
| `POST` | `/api/commandes/{id}/payer` | Paie une commande |
| `POST` | `/api/commandes/{id}/expedier` | Expédie une commande |
| `GET` | `/api/commandes/client/{id}` | Commandes d'un client |
| `DELETE` | `/api/commandes/{id}` | Supprime une commande |

---

### 🛒 Panier

| Méthode | URL | Description |
|---------|-----|-------------|
| `POST` | `/api/panier/commander` | Passe une commande depuis le panier |
| `GET` | `/api/panier/client/{id}` | Commandes d'un client |

---

## 🚀 Installation et lancement

### 1️⃣ Prérequis

- Java 17+
- XAMPP (MySQL)
- Maven
- IntelliJ IDEA (recommandé)

### 2️⃣ Base de données

```sql
CREATE DATABASE nutrici_db;