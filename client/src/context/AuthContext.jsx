import { createContext, useContext, useState, useEffect } from 'react';
// On enlève useToast ici pour éviter les erreurs si le fichier n'existe pas encore parfaitement
// Si tu as ToastContext, tu peux le remettre, mais on va faire simple et robuste.

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL du Backend
  const API_URL = 'https://phonedrive-api.onrender.com/api';

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    const token = localStorage.getItem('token'); // On utilise 'token' tout court
    if (token) {
      try {
        const res = await fetch(`${API_URL}/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            const userData = await res.json();
            // Force Admin si c'est toi
            if (userData.email === "nishimiya.ichida@gmail.com") {
                userData.role = 'admin';
            }
            setUser(userData);
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      }
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
            
            // Force Admin immédiat
            if (data.user.email === "nishimiya.ichida@gmail.com") {
                data.user.role = 'admin';
            }

            setUser(data.user);
            return true;
        } else {
            alert(data.error || "Erreur de connexion");
            return false;
        }
    } catch (error) {
        console.error(error);
        alert("Erreur serveur");
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