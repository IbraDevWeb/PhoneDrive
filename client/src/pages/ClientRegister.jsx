import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ClientRegister() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // On appelle la fonction du contexte
    const success = await register(formData);
    
    if (success) {
        navigate('/connexion'); // Si ça marche, on l'envoie se connecter
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg border border-slate-100">
        
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Créer un compte</h1>
            <p className="text-slate-500 mt-2">Rejoignez PhoneDrive pour suivre vos commandes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                    name="name" required placeholder="Nom complet" 
                    className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white transition outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleChange}
                />
                <input 
                    name="phone" required placeholder="Téléphone" 
                    className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white transition outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleChange}
                />
            </div>

            <input 
                name="email" type="email" required placeholder="Adresse Email" 
                className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white transition outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
            />
            
            <input 
                name="address" required placeholder="Adresse de livraison par défaut" 
                className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white transition outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
            />

            <input 
                name="password" type="password" required placeholder="Mot de passe sécurisé" 
                className="w-full p-4 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white transition outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
            />

            <button 
                type="submit" disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
            >
                {loading ? "Création..." : "S'inscrire"} <i className="fa-solid fa-arrow-right"></i>
            </button>
        </form>

        <div className="text-center mt-6 text-sm text-slate-500">
            Déjà client ? <Link to="/connexion" className="text-blue-600 font-bold hover:underline">Se connecter</Link>
        </div>

      </div>
    </div>
  );
}

export default ClientRegister;