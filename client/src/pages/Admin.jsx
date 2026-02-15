import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient'; // Assure-toi que ce fichier existe bien

function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'appointments'
  
  // Formulaire nouveau produit COMPLET
  const [newProduct, setNewProduct] = useState({ 
    model: '', 
    price: '', 
    description: '', 
    image: '', 
    storage: '', 
    color: '' 
  });
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
        const headers = { 'Authorization': 'Bearer ' + token };
        
        const [resProd, resOrders, resAppoint] = await Promise.all([
            fetch('https://phonedrive-api.onrender.com/api/products'),
            fetch('https://phonedrive-api.onrender.com/api/orders', { headers }),
            fetch('https://phonedrive-api.onrender.com/api/appointments', { headers })
        ]);

        setProducts(await resProd.json());
        setOrders(resOrders.ok ? await resOrders.json() : []);
        setAppointments(resAppoint.ok ? await resAppoint.json() : []);
        setLoading(false);
    } catch (error) {
        console.error("Erreur chargement", error);
        setLoading(false);
    }
  };

  // --- UPLOAD IMAGE SUPABASE ---
  const handleImageUpload = async (e) => {
    try {
        setUploading(true);
        const file = e.target.files[0];
        if (!file) return;

        // Nom de fichier unique
        const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
        
        // 1. Upload vers Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('products') // Assure-toi que le bucket s'appelle bien 'products' sur Supabase
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // 2. Récupérer l'URL publique
        const { data } = supabase.storage
            .from('products')
            .getPublicUrl(fileName);
            
        setNewProduct({ ...newProduct, image: data.publicUrl });
        alert("Image uploadée avec succès ! ✅");

    } catch (error) {
        console.error(error);
        alert("Erreur upload image : Vérifiez votre connexion Supabase.");
    } finally {
        setUploading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if(!token) return;

    const res = await fetch('https://phonedrive-api.onrender.com/api/products', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(newProduct)
    });

    if (res.ok) {
        alert("iPhone ajouté au stock ! 📱");
        setShowForm(false);
        setNewProduct({ model: '', price: '', description: '', image: '', storage: '', color: '' });
        fetchData(); 
    } else {
        alert("Erreur lors de l'ajout");
    }
  };

  const handleDelete = async (id) => {
      if(!confirm("Supprimer définitivement cet iPhone ?")) return;
      await fetch(`https://phonedrive-api.onrender.com/api/products/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + token }
      });
      fetchData();
  };

  if (loading) return <div className="p-10 text-center pt-24">Chargement du Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 pt-24 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard 🛡️</h1>
        <button onClick={logout} className="bg-red-50 text-red-600 px-6 py-2 rounded-full font-bold hover:bg-red-100 transition">
            <i className="fa-solid fa-power-off mr-2"></i> Déconnexion
        </button>
      </div>

      {/* --- MENU ONGLET --- */}
      <div className="flex gap-4 mb-8 border-b border-slate-200 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-bold rounded-lg transition whitespace-nowrap ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            Commandes ({orders.length})
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-bold rounded-lg transition whitespace-nowrap ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            Stock Produits ({products.length})
          </button>
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 font-bold rounded-lg transition whitespace-nowrap ${activeTab === 'appointments' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            Agenda Réparation ({appointments.length})
          </button>
      </div>

      {/* --- CONTENU --- */}
      
      {/* 1. ONGLET COMMANDES */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {orders.length === 0 ? (
                <div className="p-8 text-center text-slate-400">Aucune commande pour le moment.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase">
                            <tr><th className="p-4">Date</th><th className="p-4">Client</th><th className="p-4">Total</th><th className="p-4">Statut</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map(o => (
                                <tr key={o.id}>
                                    <td className="p-4 text-slate-500 text-sm">{new Date(o.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold text-slate-800">{o.customer}<br/><span className="text-xs text-slate-400 font-normal">{o.email}</span></td>
                                    <td className="p-4 font-bold">{o.total} €</td>
                                    <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{o.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      )}

      {/* 2. ONGLET PRODUITS */}
      {activeTab === 'products' && (
        <div className="space-y-6">
            {/* Bouton Ajouter */}
            {!showForm && (
                <button onClick={() => setShowForm(true)} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg flex items-center gap-2">
                    <i className="fa-solid fa-plus"></i> Ajouter un iPhone
                </button>
            )}

            {/* Formulaire d'Ajout (COMPLET) */}
            {showForm && (
                <form onSubmit={handleAddProduct} className="bg-white p-6 rounded-2xl border border-blue-100 shadow-xl animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="md:col-span-2 text-xl font-bold mb-2">Nouveau Produit</h3>
                    
                    <input placeholder="Modèle (ex: iPhone 13 Pro)" className="p-3 border rounded-xl" value={newProduct.model} onChange={e => setNewProduct({...newProduct, model: e.target.value})} required />
                    <input type="number" placeholder="Prix (€)" className="p-3 border rounded-xl" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                    
                    <input placeholder="Stockage (ex: 128 Go)" className="p-3 border rounded-xl" value={newProduct.storage} onChange={e => setNewProduct({...newProduct, storage: e.target.value})} required />
                    <input placeholder="Couleur (ex: Bleu Alpin)" className="p-3 border rounded-xl" value={newProduct.color} onChange={e => setNewProduct({...newProduct, color: e.target.value})} required />
                    
                    <textarea placeholder="Description / État (ex: Comme neuf, batterie 100%...)" className="p-3 border rounded-xl md:col-span-2" rows="2" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                    
                    {/* Zone Upload Image */}
                    <div className="md:col-span-2 border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition">
                        <p className="text-sm font-bold text-slate-500 mb-2">Photo du produit</p>
                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                        {uploading && <p className="text-blue-600 text-sm mt-2 animate-pulse">Upload en cours...</p>}
                        {newProduct.image && <img src={newProduct.image} alt="Aperçu" className="mt-4 h-24 mx-auto object-contain rounded-lg border"/>}
                    </div>

                    <div className="md:col-span-2 flex gap-4 mt-2">
                        <button type="submit" disabled={uploading} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex-1 hover:bg-green-700 transition">Valider l'ajout</button>
                        <button type="button" onClick={() => setShowForm(false)} className="bg-slate-100 text-slate-600 px-6 py-2 rounded-lg font-bold hover:bg-slate-200 transition">Annuler</button>
                    </div>
                </form>
            )}

            {/* Liste des Produits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => (
                    <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-20 h-24 bg-slate-50 rounded-xl flex items-center justify-center p-2">
                                <img src={p.image || "https://placehold.co/100"} className="max-w-full max-h-full object-contain" alt={p.model}/>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">{p.model}</h3>
                                <p className="text-sm text-slate-500">{p.storage} • {p.color}</p>
                                <p className="text-blue-600 font-bold mt-1">{p.price} €</p>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(p.id)} className="w-full py-2 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 font-bold text-sm transition">
                            <i className="fa-solid fa-trash mr-2"></i> Supprimer
                        </button>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* 3. ONGLET RENDEZ-VOUS (Qui manquait !) */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {appointments.length === 0 ? (
                <div className="p-8 text-center text-slate-400">Aucun rendez-vous prévu.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase">
                            <tr><th className="p-4">Date & Heure</th><th className="p-4">Client</th><th className="p-4">Appareil</th><th className="p-4">Problème</th><th className="p-4">Contact</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {appointments.map(rdv => (
                                <tr key={rdv.id}>
                                    <td className="p-4 font-bold text-slate-800">
                                        {new Date(rdv.date).toLocaleDateString()} <br/>
                                        <span className="text-blue-600">{new Date(rdv.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </td>
                                    <td className="p-4 font-medium">{rdv.client}</td>
                                    <td className="p-4 text-slate-600">{rdv.device}</td>
                                    <td className="p-4"><span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">{rdv.issue}</span></td>
                                    <td className="p-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-2"><i className="fa-solid fa-phone"></i> {rdv.phone}</div>
                                        <div className="flex items-center gap-2 mt-1"><i className="fa-solid fa-envelope"></i> {rdv.email}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      )}

    </div>
  );
}

export default Admin;