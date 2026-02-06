import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ClientAccount() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Si pas connecté, on renvoie vers le login
  useEffect(() => {
    if (!loading && !user) {
        navigate('/connexion');
    }
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="pt-32 text-center">Chargement du profil...</div>;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* En-tête Profil */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-6 mb-4 md:mb-0">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-3xl text-slate-400">
                {user.name ? user.name.charAt(0).toUpperCase() : <i className="fa-solid fa-user"></i>}
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Bonjour, {user.name} 👋</h1>
                <p className="text-slate-500">{user.email}</p>
            </div>
        </div>
        <button onClick={() => { logout(); navigate('/'); }} className="text-red-600 font-bold hover:bg-red-50 px-6 py-3 rounded-xl transition border border-red-100">
            <i className="fa-solid fa-right-from-bracket mr-2"></i> Déconnexion
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Colonne Gauche : Mes Infos */}
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h2 className="font-bold text-xl mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-address-card text-blue-600"></i> Mes Coordonnées
                </h2>
                <div className="space-y-3 text-slate-600">
                    <p><span className="font-bold text-slate-900 block text-xs uppercase text-slate-400">Nom</span> {user.name}</p>
                    <p><span className="font-bold text-slate-900 block text-xs uppercase text-slate-400">Email</span> {user.email}</p>
                    <p><span className="font-bold text-slate-900 block text-xs uppercase text-slate-400">Téléphone</span> {user.phone || "Non renseigné"}</p>
                    <p><span className="font-bold text-slate-900 block text-xs uppercase text-slate-400">Adresse</span> {user.address || "Non renseignée"}</p>
                </div>
            </div>
        </div>

        {/* Colonne Droite : Historique Commandes */}
        <div className="lg:col-span-2">
            <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
                <i className="fa-solid fa-box-open text-blue-600"></i> Mes Commandes
            </h2>

            {!user.orders || user.orders.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
                    <p className="text-slate-400 text-lg mb-4">Vous n'avez pas encore passé de commande.</p>
                    <button onClick={() => navigate('/boutique')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                        Découvrir la boutique
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {user.orders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4 border-b border-slate-50 pb-4">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold">Commande #{order.id}</p>
                                    <p className="text-slate-500 text-sm">{new Date(order.createdAt).toLocaleDateString()} à {new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    order.status === 'livré' ? 'bg-green-100 text-green-700' : 
                                    order.status === 'expédié' ? 'bg-blue-100 text-blue-700' : 
                                    'bg-orange-100 text-orange-700'
                                }`}>
                                    {order.status.toUpperCase()}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <div>
                                    {/* On affiche un résumé des articles (JSON) */}
                                    <p className="text-sm text-slate-600">
                                        {Array.isArray(order.items) ? order.items.length : JSON.parse(order.items).length} article(s)
                                    </p>
                                </div>
                                <p className="font-bold text-xl text-slate-900">{order.total} €</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}

export default ClientAccount;