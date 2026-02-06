import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Calcul du total
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // Formulaire
  const [formData, setFormData] = useState({
    customer: '',
    email: '',
    address: '' // On garde l'adresse pour la facture ou contact, même si c'est du retrait
  });

  useEffect(() => {
    if (user) {
        setFormData({
            customer: user.name || '',
            email: user.email || '',
            address: user.address || ''
        });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://phonedrive-api.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          total: total,
          items: cart,
          userId: user ? user.id : null
        })
      });

      if (response.ok) {
        clearCart();
        navigate('/success');
      } else {
        showToast("Erreur lors de la commande", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Impossible de contacter le serveur", "error");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
        <div className="min-h-screen pt-32 text-center bg-slate-50">
            <h2 className="text-2xl font-bold text-slate-900">Votre panier est vide.</h2>
            <button onClick={() => navigate('/boutique')} className="mt-4 text-blue-600 hover:underline">
                Retourner à la boutique
            </button>
        </div>
    );
  }

  return (
    <div className="pt-24 pb-12 min-h-screen bg-slate-50 px-4">
      <div className="max-w-5xl mx-auto">
        
        <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Finaliser la commande</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* COLONNE GAUCHE : FORMULAIRE */}
            <div className="bg-white p-8 rounded-3xl shadow-xl h-fit">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Vos Coordonnées
                </h2>
                
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nom & Prénom</label>
                        <input 
                            type="text" 
                            required 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                            placeholder="Jean Dupont"
                            value={formData.customer} 
                            onChange={e => setFormData({...formData, customer: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email (pour confirmation)</label>
                        <input 
                            type="email" 
                            required 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                            placeholder="jean@exemple.com"
                            value={formData.email} 
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Adresse (Facultatif)</label>
                        <textarea 
                            rows="2"
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" 
                            placeholder="Pour la facture..."
                            value={formData.address} 
                            onChange={e => setFormData({...formData, address: e.target.value})}
                        ></textarea>
                    </div>
                </form>
            </div>

            {/* COLONNE DROITE : RÉSUMÉ & VALIDATION */}
            <div className="bg-white p-8 rounded-3xl shadow-xl h-fit border border-blue-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <h2 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Récapitulatif
                </h2>

                <div className="space-y-4 mb-8 relative z-10">
                    {cart.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm text-slate-600 border-b border-slate-50 pb-2">
                            <div>
                                <p className="font-bold text-slate-800">{item.model}</p>
                                <p className="text-xs text-slate-400">{item.storage} - {item.color}</p>
                            </div>
                            <span className="font-bold">{item.price}€</span>
                        </div>
                    ))}
                    
                    <div className="pt-4 flex justify-between items-center text-xl font-bold text-slate-900">
                        <span>Total à payer</span>
                        <span>{total}€</span>
                    </div>
                </div>

                {/* NOTE PAIEMENT */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 flex gap-3 relative z-10">
                    <i className="fa-solid fa-store text-blue-600 mt-1"></i>
                    <div>
                        <p className="text-sm font-bold text-blue-800">Paiement au Retrait</p>
                        <p className="text-xs text-blue-700 mt-1">
                            Réservez maintenant. Payez en boutique (Espèces/Carte) lors de la remise en main propre.
                        </p>
                    </div>
                </div>

                <button 
                    form="checkout-form"
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition shadow-xl hover:shadow-2xl hover:-translate-y-1 duration-300 flex justify-center items-center gap-3 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <i className="fa-solid fa-circle-notch animate-spin"></i> Validation...
                        </>
                    ) : (
                        <>
                            Valider la réservation <i className="fa-solid fa-check"></i>
                        </>
                    )}
                </button>

                <p className="text-center text-xs text-slate-400 mt-4 relative z-10">
                    <i className="fa-solid fa-shield-halved mr-1"></i> Engagement de réservation
                </p>
            </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;