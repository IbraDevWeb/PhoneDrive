import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

function Login() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        // On envoie le mot de passe au serveur
        const response = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (response.ok) {
            // C'est gagné ! On reçoit le Token et on le stocke
            localStorage.setItem("adminToken", data.token);
            showToast("Connexion réussie ! 🔓");
            navigate('/admin');
        } else {
            // Echec
            showToast(data.error || "Mot de passe incorrect", "error");
        }
    } catch (error) {
        showToast("Erreur de connexion au serveur", "error");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                <i className="fa-solid fa-user-shield"></i>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Espace Administrateur</h1>
            <p className="text-slate-500 text-sm mt-2">Veuillez vous identifier pour gérer la boutique.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mot de passe</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="••••••••"
                    required
                />
            </div>
            
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {loading ? "Vérification..." : "Se connecter"}
                {!loading && <i className="fa-solid fa-arrow-right"></i>}
            </button>
        </form>
        
        <div className="text-center mt-6">
            <button onClick={() => navigate('/')} className="text-sm text-slate-400 hover:text-slate-600">
                Retour au site
            </button>
        </div>
      </div>
    </div>
  );
}

export default Login;