import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/products';

export default function App() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '' });
  const [editingId, setEditingId] = useState(null);

  // États pour la recherche et la pagination (avec valeurs par défaut sécurisées)
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalItems: 0, currentPage: 1 });

  // Récupérer les produits avec filtres
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}?search=${encodeURIComponent(search)}&page=${page}&limit=5`);
      const responseData = await res.json();

      // Sécurité si l'API retourne un tableau direct au lieu d'un objet paginé
      if (Array.isArray(responseData)) {
        setProducts(responseData);
        setPagination({ totalPages: 1, totalItems: responseData.length, currentPage: 1 });
      } else {
        setProducts(responseData.data || []);
        setPagination(responseData.pagination || { totalPages: 1, totalItems: 0, currentPage: 1 });
      }
    } catch (err) {
      console.error("Erreur lors de la récupération:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, page]);

  // Soumettre un ajout ou une modification
  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: '', description: '', price: '', stock: '' });
        setEditingId(null);
        fetchProducts();
      } else {
        console.error("Erreur serveur:", await res.text());
      }
    } catch (err) {
      console.error("Erreur enregistrement:", err);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Supprimer ce produit ?")) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchProducts();
      } catch (err) {
        console.error("Erreur suppression:", err);
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Gestion des Produits</h1>

      {/* Formulaire d'ajout / modification */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Nom du produit"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Prix"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          required
        />
        <button type="submit">{editingId ? 'Mettre à jour' : 'Ajouter'}</button>
      </form>

      {/* Barre de recherche */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="🔍 Rechercher un produit..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ padding: '8px', width: '300px' }}
        />
      </div>

      {/* Tableau des produits */}
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>{p.price} FCFA</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Éditer</button>
                <button onClick={() => handleDelete(p.id)} style={{ marginLeft: '5px', color: 'red' }}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>Aucun produit trouvé</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Contrôles de pagination */}
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          ⬅️ Précédent
        </button>
        <span>
          Page {pagination?.currentPage || 1} sur {pagination?.totalPages || 1} ({pagination?.totalItems || 0} produits)
        </span>
        <button disabled={page >= (pagination?.totalPages || 1)} onClick={() => setPage(page + 1)}>
          Suivant ➡️
        </button>
      </div>
    </div>
  );
}