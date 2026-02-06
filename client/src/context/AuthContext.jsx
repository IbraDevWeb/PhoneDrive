import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Infos du client (nom, email...)
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Au chargement, on vérifie si le client est déjà connecté (Token dans le stockage)
  useEffect(() => {
    const token = localStorage.getItem('clientToken');
    if (token) {
        // On récupère le profil à jour depuis le serveur
        fetch('https://phonedrive-api.onrender.com/api/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error("Session expirée");
        })
        .then(userData => setUser(userData))
        .catch(() => {
            localStorage.removeItem('clientToken'); // Si token invalide, on nettoie
            setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, []);

  // Fonction de Connexion
  const login = async (email, password) => {
    const res = await fetch('https://phonedrive-api.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    
    if (res.ok) {
        localStorage.setItem('clientToken', data.token); // On stocke le badge
        setUser(data.user);
        showToast(`Ravi de vous revoir, ${data.user.name} ! 👋`);
        return true;
    } else {
        showToast(data.error || "Erreur de connexion", "error");
        return false;
    }
  };

  // Fonction d'Inscription
  const register = async (userData) => {
    const res = await fetch('https://phonedrive-api.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    const data = await res.json();

    if (res.ok) {
        showToast("Compte créé ! Connectez-vous maintenant. 🎉");
        return true;
    } else {
        showToast(data.error || "Erreur inscription", "error");
        return false;
    }
  };

  // Fonction de Déconnexion
  const logout = () => {
    localStorage.removeItem('clientToken');
    setUser(null);
    showToast("À bientôt ! 👋");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}