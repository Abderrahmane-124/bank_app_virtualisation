# Architecture Legacy - Application Bancaire

## 1. Vue d'ensemble
L'application bancaire est une application Spring Boot qui gère les opérations bancaires de base. Elle utilise une base de données H2 pour le stockage des données.

## 2. Composants Principaux

### 2.1 Application Spring Boot
- **Version** : Spring Boot 2.x
- **Port** : 8989
- **Profil** : docker
- **Fonctionnalités** :
  - Gestion des comptes
  - Opérations bancaires
  - API REST

### 2.2 Base de données
- **Type** : H2 Database
- **Stockage** : Volume persistant (/data/h2)
- **Mode** : Embedded

### 2.3 Infrastructure
- **Conteneurisation** : Docker
- **Orchestration** : Kubernetes
- **Monitoring** : Prometheus/Grafana
- **Logging** : ELK Stack

## 3. Dépendances

### 3.1 Dépendances Techniques
- Java 11+
- Docker
- Kubernetes
- H2 Database

### 3.2 Dépendances Opérationnelles
- Monitoring (Prometheus/Grafana)
- Logging (ELK Stack)
- Stockage persistant

## 4. Points d'Attention
- Migration des données H2
- Sécurité des données
- Performance de la base de données
- Disponibilité du service

## 5. Limitations Actuelles
- Base de données H2 en mode embedded
- Pas de haute disponibilité
- Pas de sauvegarde automatique
- Pas de scaling horizontal 