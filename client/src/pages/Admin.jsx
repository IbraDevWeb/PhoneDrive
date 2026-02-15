import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // On utilise le contexte pour logout

function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Formulaire nouveau produit
  const [newProduct, setNewProduct] = useState({ model: '', price: '', description: '', image: '', storage: '128Go', color: 'Noir' });
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth(); // Récupère la fonction logout propre
  
  // LE FIX EST ICI : On récupère le bon nom de token
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
        const headers = { 'Authorization': 'Bearer ' + token };
        
        // On récupère tout en parallèle
        const [resProd, resOrders] = await Promise.all([
            fetch('https://phonedrive-api.onrender.com/api/products'),
            fetch('https://phonedrive-api.onrender.com/api/orders', { headers })
        ]);

        const dataProd = await resProd.json();
        // Si orders échoue (403), on met un tableau vide pour ne pas crasher
        const dataOrders = resOrders.ok ? await resOrders.json() : [];

        setProducts(Array.isArray(dataProd) ? dataProd : []);
        setOrders(Array.isArray(dataOrders) ? dataOrders : []);
        setLoading(false);
    } catch (error) {
        console.error("Erreur chargement", error);
        setLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if(!token) return;

    // Valeurs par défaut si image vide
    const productToSend = {
        ...newProduct,
        image: newProduct.image || "https://placehold.co/400"
    };

    const res = await fetch('https://phonedrive-api.onrender.com/api/products', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(productToSend)
    });

    if (res.ok) {
        alert("Produit ajouté !");
        setShowForm(false);
        setNewProduct({ model: '', price: '', description: '', image: '', storage: '', color: '' });
        fetchData(); // Rafraîchir la liste
    } else {
        alert("Erreur lors de l'ajout");
    }
  };

  const handleDelete = async (id) => {
      if(!confirm("Supprimer ?")) return;
      await fetch(`https://phonedrive-api.onrender.com/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + token }
      });
      fetchData();
  };

  if (loading) return <div className="p-10 text-center">Chargement Admin...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard 🛡️</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600">
            Déconnexion
        </button>
      </div>

      {/* SECTION COMMANDES RAPIDE */}
      <div className="mb-10">
        <h2 className="text-xl font-bold mb-4">Dernières Commandes</h2>
        <div className="bg-white rounded-xl shadow border overflow-hidden">
            {orders.length === 0 ? (
                <p className="p-4 text-slate-500">Aucune commande ou accès restreint.</p>
            ) : (
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr><th className="p-3">Client</th><th className="p-3">Total</th><th className="p-3">Statut</th></tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id} className="border-b last:border-0">
                                <td className="p-3">{o.customer}</td>
                                <td className="p-3 font-bold">{o.total}€</td>
                                <td className="p-3 text-green-600">{o.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>

      {/* SECTION PRODUITS */}
      <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Mes Produits</h2>
            <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded font-bold">
                {showForm ? 'Fermer' : '+ Ajouter un iPhone'}
            </button>
        </div>

        {/* Formulaire Ajout */}
        {showForm && (
            <form onSubmit={handleAddProduct} className="bg-slate-50 p-6 rounded-xl mb-6 border grid gap-4">
                <input placeholder="Modèle (ex: iPhone 12)" className="p-2 border rounded" value={newProduct.model} onChange={e => setNewProduct({...newProduct, model: e.target.value})} required />
                <input type="number" placeholder="Prix" className="p-2 border rounded" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                <input placeholder="Image URL (http...)" className="p-2 border rounded" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
                <button type="submit" className="bg-green-600 text-white p-2 rounded font-bold">Valider l'ajout</button>
            </form>
        )}

        {/* Liste Produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-xl shadow border flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src={p.image} className="w-12 h-12 object-contain" />
                        <div>
                            <p className="font-bold">{p.model}</p>
                            <p className="text-blue-600">{p.price}€</p>
                        </div>
                    </div>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;