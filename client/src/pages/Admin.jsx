import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { supabase } from '../supabaseClient';

function Admin() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    model: '', price: '', storage: '', color: '', description: '', image: ''
  });

  const navigate = useNavigate();
  const { showToast } = useToast();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    // Si pas de token, on renvoie au login
    if (!token) {
        navigate('/login');
        return;
    }

    // C'EST ICI QUE J'AI AJOUTÉ LES HEADERS D'AUTORISATION 👇
    Promise.all([
        fetch('http://localhost:5000/api/orders', {
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(res => res.json()),

        fetch('http://localhost:5000/api/products').then(res => res.json()), // Les produits sont publics

        fetch('http://localhost:5000/api/appointments', {
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(res => res.json())
    ]).then(([ordersData, productsData, appointmentsData]) => {
        // Sécurité supplémentaire : Si ce n'est pas un tableau (ex: erreur), on met un tableau vide pour éviter le crash
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
        setLoading(false);
    }).catch((err) => {
        console.error(err);
        showToast("Erreur de chargement des données", "error");
        setLoading(false);
    });
  }, [navigate, token, showToast]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    showToast("Déconnexion réussie 👋");
    navigate('/login');
  };

  // --- UPLOAD IMAGE ---
  const handleImageUpload = async (e) => {
    try {
        setUploading(true);
        const file = e.target.files[0];
        if (!file) return;

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        
        setNewProduct({ ...newProduct, image: data.publicUrl });
        showToast("Image téléchargée ! 📸");

    } catch (error) {
        console.error(error);
        showToast("Erreur lors de l'upload", "error");
    } finally {
        setUploading(false);
    }
  };

  // --- GESTION PRODUITS ---
  const handleDeleteProduct = async (id) => {
    if(!window.confirm("Es-tu sûr de vouloir supprimer cet iPhone ?")) return;
    
    const response = await fetch(`http://localhost:5000/api/products/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    });

    if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
        showToast("Produit supprimé !");
    } else {
        showToast("Erreur : Non autorisé", "error");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token 
        },
        body: JSON.stringify(newProduct)
    });
    
    if (response.ok) {
        const savedProduct = await response.json();
        setProducts([...products, savedProduct]);
        setShowForm(false);
        setNewProduct({ model: '', price: '', storage: '', color: '', description: '', image: '' });
        showToast("Produit ajouté avec succès !");
    } else {
        showToast("Erreur lors de l'ajout", "error");
    }
  };
  
  const handleInputChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="pt-32 text-center">Chargement...</div>;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <button onClick={handleLogout} className="text-red-600 font-bold hover:text-red-800 bg-red-50 px-4 py-2 rounded-lg transition">
            <i className="fa-solid fa-right-from-bracket mr-2"></i> Déconnexion
          </button>
      </div>

      {/* MENU ONGLETS */}
      <div className="flex gap-6 mb-8 border-b border-slate-200 overflow-x-auto">
          <button onClick={() => setActiveTab('orders')} className={`pb-4 px-2 font-medium whitespace-nowrap ${activeTab === 'orders' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>
            Commandes ({orders.length})
          </button>
          <button onClick={() => setActiveTab('products')} className={`pb-4 px-2 font-medium whitespace-nowrap ${activeTab === 'products' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>
            Stock Produits ({products.length})
          </button>
          <button onClick={() => setActiveTab('appointments')} className={`pb-4 px-2 font-medium whitespace-nowrap ${activeTab === 'appointments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'}`}>
            Agenda Réparation ({appointments.length})
          </button>
      </div>

      {/* --- ONGLET 1 : COMMANDES --- */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase">
                    <tr><th className="p-4">ID</th><th className="p-4">Client</th><th className="p-4">Total</th><th className="p-4">Statut</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td className="p-4 text-slate-400">#{order.id}</td>
                            <td className="p-4 font-bold">{order.customer}</td>
                            <td className="p-4">{order.total} €</td>
                            <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{order.status}</span></td>
                        </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr><td colSpan="4" className="p-8 text-center text-slate-400">Aucune commande pour le moment.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      )}

      {/* --- ONGLET 2 : PRODUITS --- */}
      {activeTab === 'products' && (
        <div className="space-y-6">
            {!showForm && (
                <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg flex items-center gap-2">
                    <i className="fa-solid fa-plus"></i> Ajouter un iPhone
                </button>
            )}

            {showForm && (
                <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-lg animate-fade-in">
                    <h3 className="font-bold text-xl mb-4">Nouveau Produit</h3>
                    <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="model" placeholder="Modèle" required className="border p-3 rounded-lg" onChange={handleInputChange} value={newProduct.model} />
                        <input name="price" type="number" placeholder="Prix" required className="border p-3 rounded-lg" onChange={handleInputChange} value={newProduct.price} />
                        <input name="storage" placeholder="Stockage" required className="border p-3 rounded-lg" onChange={handleInputChange} value={newProduct.storage} />
                        <input name="color" placeholder="Couleur" required className="border p-3 rounded-lg" onChange={handleInputChange} value={newProduct.color} />
                        <input name="description" placeholder="Description" className="border p-3 rounded-lg md:col-span-2" onChange={handleInputChange} value={newProduct.description} />
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Photo du produit</label>
                            <div className="flex items-center gap-4">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
                                />
                                {uploading && <span className="text-blue-600 font-bold animate-pulse">Envoi en cours...</span>}
                            </div>
                            {newProduct.image && (
                                <img src={newProduct.image} alt="Aperçu" className="mt-4 h-32 w-32 object-contain border rounded-lg bg-slate-50" />
                            )}
                        </div>
                        
                        <div className="md:col-span-2 flex gap-4 mt-4">
                            <button type="submit" disabled={uploading} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50">Valider</button>
                            <button type="button" onClick={() => setShowForm(false)} className="bg-slate-200 text-slate-700 px-6 py-2 rounded-lg font-bold">Annuler</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase">
                        <tr><th className="p-4">Image</th><th className="p-4">Modèle</th><th className="p-4">Prix</th><th className="p-4 text-right">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-slate-50">
                                <td className="p-4">{product.image ? <img src={product.image} className="w-10 h-10 object-contain"/> : "📷"}</td>
                                <td className="p-4"><p className="font-bold">{product.model}</p><p className="text-xs text-slate-500">{product.storage} • {product.color}</p></td>
                                <td className="p-4 font-bold text-blue-600">{product.price} €</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><i className="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {/* --- ONGLET 3 : AGENDA --- */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase">
                    <tr><th className="p-4">Date & Heure</th><th className="p-4">Client</th><th className="p-4">Appareil</th><th className="p-4">Problème</th><th className="p-4">Contact</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {appointments.map((rdv) => (
                        <tr key={rdv.id} className="hover:bg-slate-50">
                            <td className="p-4 font-bold text-slate-900">{new Date(rdv.date).toLocaleDateString()} {new Date(rdv.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                            <td className="p-4 font-medium">{rdv.client}</td>
                            <td className="p-4 text-slate-600">{rdv.device}</td>
                            <td className="p-4"><span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">{rdv.issue}</span></td>
                            <td className="p-4 text-sm">
                                <div className="text-slate-900"><i className="fa-solid fa-phone text-slate-400 mr-2"></i>{rdv.phone}</div>
                                <div className="text-slate-500"><i className="fa-solid fa-envelope text-slate-400 mr-2"></i>{rdv.email}</div>
                            </td>
                        </tr>
                    ))}
                    {appointments.length === 0 && (
                        <tr><td colSpan="5" className="p-8 text-center text-slate-400">Aucun rendez-vous prévu.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      )}

    </div>
  );
}

export default Admin;