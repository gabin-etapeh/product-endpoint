# Store Project

Ce dépôt contient une application de gestion de produits avec :
- un backend Node.js/Express
- une base PostgreSQL
- un frontend React + Vite

## Structure du projet
- [store-project/backend](store-project/backend) : API CRUD
- [store-project/frontend](store-project/frontend) : interface utilisateur
- [store-project/backend/create_table.sql](store-project/backend/create_table.sql) : script SQL pour créer la table `product`

## Prérequis
- Node.js 16+
- npm
- PostgreSQL installé et démarré localement

## 1) Installer les dépendances

### Backend
```bash
cd store-project/backend
npm install
```

### Frontend
```bash
cd ../frontend
npm install
```

## 2) Configurer PostgreSQL
Ouvrez le fichier :
- [store-project/backend/.env](store-project/backend/.env)

Vérifiez que ces variables correspondent à votre instance PostgreSQL :

```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_db
```

## 3) Créer la base et la table
```bash
createdb -U postgres store_db
psql -U postgres -d store_db -f store-project/backend/create_table.sql
```

## 4) Démarrer l'application
### Backend
```bash
cd store-project/backend
npm start
```

ou en mode dev :
```bash
npm run dev
```

### Frontend
```bash
cd store-project/frontend
npm run dev
```

Le frontend sera accessible sur : http://localhost:5173
Le backend sur : http://localhost:5000

## 5) API disponible
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

## Dépannage
Si les CRUD ne marchent pas, vérifiez dans l'ordre :
1. La base PostgreSQL est bien lancée
2. Les identifiants `.env` sont corrects
3. La table `product` existe
4. Le backend est bien démarré sur le port 5000
