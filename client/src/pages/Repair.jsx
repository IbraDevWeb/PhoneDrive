import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

function Repair() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  // --- ÉTATS ---
  const [loading, setLoading] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const [formData, setFormData] = useState({
    client: '',
    email: '',
    phone: '',
    device: 'iPhone 13',
    issue: 'screen',
    date: '',
    locationType: 'atelier', // 'atelier' ou 'deplacement'
    locationAddress: ''      // Adresse si déplacement
  });

  // --- 1. AUTO-REMPLISSAGE ---
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        client: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [user]);

  // --- 2. CALCUL DU PRIX EN TEMPS RÉEL ---
  useEffect(() => {
    calculatePrice(formData.device, formData.issue);
  }, [formData.device, formData.issue]);

  const calculatePrice = (model, issueType) => {
    let basePrice = 0;
    switch (issueType) {
        case 'screen': basePrice = 89; break;
        case 'battery': basePrice = 59; break;
        case 'back': basePrice = 99; break;
        case 'connector': basePrice = 69; break;
        case 'camera': basePrice = 79; break;
        default: basePrice = 49;
    }

    let multiplier = 1;
    if (model.includes("12")) multiplier = 1.1;
    if (model.includes("13")) multiplier = 1.2;
    if (model.includes("14")) multiplier = 1.4;
    if (model.includes("15")) multiplier = 1.6;

    setEstimatedPrice(Math.round(basePrice * multiplier));
  };

  // --- GESTIONNAIRES ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (type) => {
    setFormData({ ...formData, locationType: type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const issueSelect = document.querySelector('select[name="issue"]');
    const issueLabel = issueSelect.options[issueSelect.selectedIndex].text;

    const payload = {
        ...formData,
        issue: issueLabel 
    };

    try {
      const response = await fetch('https://phonedrive-api.onrender.com/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        showToast("Rendez-vous confirmé ! 🛠️");
        setTimeout(() => navigate('/'), 2500);
      } else {
        showToast("Erreur lors de la réservation", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Erreur de connexion serveur", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* --- COLONNE GAUCHE --- */}
        <div className="md:w-5/12 bg-slate-900 text-white p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1597576722026-6b2c246f432d?q=80&w=1974&auto=format&fit=crop" className="w-full h-full object-cover opacity-20" alt="Atelier" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-900/90"></div>
            </div>

            <div className="relative z-10">
                <div className="inline-block bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 shadow-lg shadow-blue-900/50">Atelier Certifié</div>
                <h2 className="text-4xl font-bold mb-6 tracking-tight">Redonnez vie à votre iPhone.</h2>
                
                {/* --- ADRESSE AJOUTÉE ICI --- */}
                <div className="mb-6 bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Notre Adresse :</p>
                    <p className="font-bold text-lg flex items-start gap-2">
                        <i className="fa-solid fa-location-dot mt-1 text-blue-400"></i>
                        {/* 👇 METS LA VRAIE ADRESSE ICI 👇 */}
                        Square Anjou, 95100 Argenteuil
                    </p>
                </div>

                <ul className="space-y-4 text-slate-300">
                    <li className="flex items-center gap-3"><i className="fa-solid fa-circle-check text-green-400"></i> Pièces Premium garanties</li>
                    <li className="flex items-center gap-3"><i className="fa-solid fa-clock text-blue-400"></i> Réparé en 30 minutes</li>
                    <li className="flex items-center gap-3"><i className="fa-solid fa-truck-fast text-yellow-400"></i> Atelier ou Déplacement</li>
                </ul>
            </div>

            <div className="relative z-10 mt-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl animate-fade-in">
                <p className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-1">Estimation du devis</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white transition-all duration-300">{estimatedPrice}€</span>
                    <span className="text-slate-400 font-medium">TTC</span>
                </div>
                <p className="text-xs text-slate-400 mt-3 border-t border-white/10 pt-3">
                    *Prix indicatif incluant pièces et main d'œuvre.
                </p>
            </div>
        </div>

        {/* --- COLONNE DROITE (FORMULAIRE) --- */}
        <div className="md:w-7/12 p-8 md:p-12 bg-white relative">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <span className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-900 text-lg shadow-sm">
                    <i className="fa-solid fa-calendar-days"></i>
                </span>
                Réserver un créneau
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. CHOIX DU LIEU */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1">Lieu de réparation</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div 
                            onClick={() => handleLocationChange('atelier')}
                            className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.locationType === 'atelier' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300'}`}
                        >
                            <i className="fa-solid fa-store text-2xl"></i>
                            <span className="font-bold text-sm">À l'Atelier</span>
                        </div>
                        <div 
                            onClick={() => handleLocationChange('deplacement')}
                            className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.locationType === 'deplacement' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 hover:border-blue-300'}`}
                        >
                            <i className="fa-solid fa-truck text-2xl"></i>
                            <span className="font-bold text-sm">En Déplacement</span>
                        </div>
                    </div>
                    {/* Champ Adresse si Déplacement */}
                    {formData.locationType === 'deplacement' && (
                        <div className="mt-4 animate-fade-in">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Adresse d'intervention</label>
                            <input 
                                type="text" 
                                name="locationAddress" 
                                value={formData.locationAddress} 
                                required={formData.locationType === 'deplacement'}
                                onChange={handleChange} 
                                placeholder="12 rue de la Paix, Paris..." 
                                className="w-full p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                        </div>
                    )}
                </div>

                {/* 2. SÉLECTEURS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Modèle</label>
                        <div className="relative">
                            <select name="device" value={formData.device} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none cursor-pointer hover:bg-slate-100">
                                <option value="iPhone 15 Pro Max">iPhone 15 Pro Max</option>
                                <option value="iPhone 15 Pro">iPhone 15 Pro</option>
                                <option value="iPhone 15">iPhone 15</option>
                                <option value="iPhone 14 Pro">iPhone 14 Pro</option>
                                <option value="iPhone 14">iPhone 14</option>
                                <option value="iPhone 13 Pro">iPhone 13 Pro</option>
                                <option value="iPhone 13">iPhone 13</option>
                                <option value="iPhone 12">iPhone 12</option>
                                <option value="iPhone 11">iPhone 11 / XR</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><i className="fa-solid fa-chevron-down"></i></div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Panne constatée</label>
                        <div className="relative">
                            <select name="issue" value={formData.issue} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition appearance-none cursor-pointer hover:bg-slate-100">
                                <option value="screen">Écran cassé / fissuré</option>
                                <option value="battery">Batterie (80% ou plus)</option>
                                <option value="back">Vitre arrière brisée</option>
                                <option value="connector">Ne charge plus</option>
                                <option value="camera">Appareil photo / FaceID</option>
                                <option value="other">Autre problème</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><i className="fa-solid fa-chevron-down"></i></div>
                        </div>
                    </div>
                </div>

                {/* 3. COORDONNÉES */}
                <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="client" value={formData.client} required placeholder="Votre Nom" onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                        <input type="tel" name="phone" value={formData.phone} required placeholder="Téléphone" onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <input type="email" name="email" value={formData.email} required placeholder="Email" onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>

                {/* 4. DATE */}
                <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Date et Heure souhaitées</label>
                    <input type="datetime-local" name="date" required onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-medium" />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-xl hover:bg-black transition shadow-xl hover:shadow-2xl hover:-translate-y-1 duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3 mt-4"
                >
                    {loading ? <><i className="fa-solid fa-circle-notch animate-spin"></i> Réservation...</> : <>Confirmer le rendez-vous <i className="fa-solid fa-arrow-right"></i></>}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}

export default Repair;