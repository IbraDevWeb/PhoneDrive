import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("Connexion en cours...");
    
    const success = await login(email, password);
    
    if (success) {
      navigate('/admin');
    } else {
      setMsg("❌ Erreur : Vérifiez email/mot de passe.");
      setLoading(false);
    }
  };

  // Fonction de SECOURS pour recréer le compte Admin
  const handleRescue = async () => {
    if(!email || !password) return alert("Mettez un email et un mot de passe !");
    setLoading(true);
    try {
        const res = await fetch('https://phonedrive-api.onrender.com/api/auth/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password, name: 'Admin', phone: '0600000000', address: 'Paris' })
        });
        if(res.ok) setMsg("✅ Compte créé ! Cliquez sur 'Se connecter'.");
        else setMsg("⚠️ Ce compte existe déjà. Essayez de vous connecter.");
    } catch(e) { setMsg("Erreur serveur."); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-2">Admin MKRR</h2>
        <p className="text-center text-slate-500 mb-8">Accès réservé</p>

        {msg && <div className="bg-blue-50 text-blue-800 p-3 rounded mb-4 text-sm text-center">{msg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email" required placeholder="Email"
            className="w-full p-3 border rounded-lg"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password" required placeholder="Mot de passe"
            className="w-full p-3 border rounded-lg"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white p-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50">
            {loading ? "Chargement..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 text-center pt-6 border-t">
            <button onClick={handleRescue} className="text-xs text-blue-500 underline">
                Compte perdu ? Recréer l'Admin
            </button>
        </div>
      </div>
    </div>
  );
};

export default Login;