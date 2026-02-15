import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL PROPRE DU BACKEND
  const API_URL = 'https://phonedrive-api.onrender.com/api';

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        setLoading(false);
        return;
    }

    try {
      const res = await fetch(`${API_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const userData = await res.json();
        // Si c'est toi, on force le rôle admin pour l'affichage
        if (userData.email === "nishimiya.ichida@gmail.com") {
             userData.role = 'admin';
        }
        setUser(userData);
      } else {
        // Token invalide
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('token');
      setUser(null);
    }
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
        localStorage.setItem('token', data.token);
        // Force le rôle admin localement pour l'accès immédiat
        if (data.user.email === "nishimiya.ichida@gmail.com") {
            data.user.role = 'admin';
        }
        setUser(data.user);
        return true;
      } else {
        alert(data.error || "Identifiants incorrects");
        return false;
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de connexion au serveur");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}