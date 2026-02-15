import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // Pour afficher les messages d'erreur/succès

  // Fonction de CONNEXION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("Connexion au serveur... (Cela peut prendre 1 min si le serveur dort 😴)");
    
    const success = await login(email, password);
    
    if (success) {
      navigate('/admin');
    } else {
      setMessage("❌ Échec : Email inconnu ou mauvais mot de passe.");
      setLoading(false);
    }
  };

  // Fonction de CRÉATION DE COMPTE (Secours)
  const handleRegister = async () => {
    if(!email || !password) {
        alert("Remplissez l'email et le mot de passe d'abord !");
        return;
    }
    setLoading(true);
    setMessage("Tentative de création du compte...");

    try {
        const res = await fetch('https://phonedrive-api.onrender.com/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email, 
                password, 
                name: "Admin", 
                phone: "0000000000", 
                address: "Siege" 
            })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            setMessage("✅ Compte créé ! Vous pouvez maintenant cliquer sur 'Se connecter'.");
        } else {
            setMessage("ℹ️ Info serveur : " + (data.error || "Erreur inconnue"));
        }
    } catch (err) {
        setMessage("❌ Erreur de communication avec le serveur.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4">
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Espace Admin</h2>
          <p className="mt-2 text-sm text-slate-500">Connexion sécurisée par Email</p>
        </div>
        
        {/* Zone de message pour comprendre ce qui se passe */}
        {message && (
            <div className={`p-3 rounded-lg text-sm text-center font-bold ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                {message}
            </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="nishimiya.ichida@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800 transition disabled:opacity-50"
          >
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Se connecter"}
          </button>
        </form>
        
        {/* BOUTON DE SECOURS */}
        <div className="text-center mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-2">Compte introuvable ?</p>
            <button 
                onClick={handleRegister} 
                type="button"
                className="text-sm font-bold text-blue-600 hover:text-blue-800 underline"
            >
                Forcer la création du compte Admin
            </button>
        </div>

        <div className="text-center mt-2">
            <button onClick={() => navigate('/')} className="text-sm text-slate-400 hover:text-slate-600">
                Retour au site
            </button>
        </div>
      </div>
    </div>
  );
};

export default Login;