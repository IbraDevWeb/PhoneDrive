import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // URL du Backend (stockée ici pour éviter les erreurs)
  const API_URL = 'https://phonedrive-api.onrender.com/api';

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    const token = localStorage.getItem('clientToken');
    if (token) {
      try {
        const res = await fetch(`${API_URL}/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            const userData = await res.json();
            
            // --- 🛡️ SÉCURITÉ ANTI-CACHE ---
            // On force le rôle admin sur le Frontend si c'est toi
            if (userData.email === "nishimiya.ichida@gmail.com") {
                userData.role = 'admin';
            }
            // -----------------------------

            setUser(userData);
        } else {
            // Si le token est invalide (ex: expiré), on nettoie
            localStorage.removeItem('clientToken');
            setUser(null);
        }
      } catch (error) {
        console.error("Erreur auth:", error);
        localStorage.removeItem('clientToken');
        setUser(null);
      }
    }
    // Quoi qu'il arrive, on dit que le chargement est FINI
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            localStorage.setItem('clientToken', data.token);
            
            // Force Admin immédiat à la connexion
            if (data.user.email === "nishimiya.ichida@gmail.com") {
                data.user.role = 'admin';
            }

            setUser(data.user);
            showToast(`Ravi de vous revoir, ${data.user.name || 'Admin'} ! 👋`);
            return true;
        } else {
            showToast(data.error || "Erreur de connexion", "error");
            return false;
        }
    } catch (error) {
        showToast("Erreur serveur", "error");
        return false;
    }
  };

  const register = async (userData) => {
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
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
    } catch (error) {
        showToast("Erreur serveur", "error");
        return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('clientToken');
    setUser(null);
    showToast("À bientôt ! 👋");
    // Redirection forcée vers l'accueil
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}