import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ClientLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // On tente la connexion via le contexte
    const success = await login(email, password);
    
    if (success) {
        navigate('/mon-compte'); // Direction le tableau de bord
    }
    setLoading(false);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-blue-200">
                <i className="fa-solid fa-user"></i>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Bon retour parmi nous</h1>
            <p className="text-slate-500 mt-2">Connectez-vous pour suivre vos commandes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input 
                    type="email" required 
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="exemple@email.com"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mot de passe</label>
                <input 
                    type="password" required 
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="••••••••"
                />
            </div>

            <button 
                type="submit" disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {loading ? "Connexion..." : "Se connecter"}
            </button>
        </form>

        <div className="text-center mt-6 text-sm text-slate-500">
            Pas encore de compte ? <Link to="/inscription" className="text-blue-600 font-bold hover:underline">Créer un compte</Link>
        </div>

      </div>
    </div>
  );
}

export default ClientLogin;