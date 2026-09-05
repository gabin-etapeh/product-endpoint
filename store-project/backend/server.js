const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. OBTENIR TOUS LES PRODUITS (GET)
app.get('/api/products', async (req, res) => {
  try {
    const allProducts = await pool.query('SELECT * FROM product ORDER BY id ASC');
    res.json(allProducts.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. OBTENIR UN PRODUIT PAR SON ID (GET)
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await pool.query('SELECT * FROM product WHERE id = $1', [id]);
    
    if (product.rows.length === 0) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.json(product.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. AJOUTER UN PRODUIT (POST)
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const newProduct = await pool.query(
      'INSERT INTO product (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, stock]
    );
    res.status(201).json(newProduct.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. MODIFIER UN PRODUIT (PUT)
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    const updateProduct = await pool.query(
      'UPDATE product SET name = $1, description = $2, price = $3, stock = $4 WHERE id = $5 RETURNING *',
      [name, description, price, stock, id]
    );

    if (updateProduct.rows.length === 0) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.json(updateProduct.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. SUPPRIMER UN PRODUIT (DELETE)
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await pool.query('DELETE FROM product WHERE id = $1 RETURNING *', [id]);
    
    if (deleteProduct.rows.length === 0) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));