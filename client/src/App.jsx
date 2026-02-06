import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // On importe le hook d'authentification

// Les Contextes
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

// Les Composants
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Les Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Repair from './pages/Repair';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Admin from './pages/Admin';
import Login from './pages/Login'; // Login Admin
import Legal from './pages/Legal';

// Nouvelles Pages Client
import ClientLogin from './pages/ClientLogin';
import ClientRegister from './pages/ClientRegister';
import ClientAccount from './pages/ClientAccount';

// --- 🛡️ LE VIGILE (Composant de Protection) ---
const AdminRoute = ({ children }) => {
  const { user } = useAuth(); // On récupère l'utilisateur connecté
  
  // Si pas connecté OU si le rôle n'est pas 'admin'
  if (!user || user.role !== 'admin') {
    // Hop, on le renvoie à l'accueil incognito
    return <Navigate to="/" replace />;
  }

  // Sinon, c'est le chef, on laisse passer
  return children;
};

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="font-sans text-slate-800 bg-slate-50 min-h-screen flex flex-col animate-fade-in">
              
              <Navbar />
              
              <div className="flex-1">
                <Routes>
                  {/* Routes Publiques */}
                  <Route path="/" element={<Home />} />
                  <Route path="/boutique" element={<Shop />} />
                  <Route path="/produit/:id" element={<ProductDetails />} />
                  <Route path="/reparation" element={<Repair />} />
                  <Route path="/panier" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/mentions-legales" element={<Legal />} />
                  
                  {/* Routes Client */}
                  <Route path="/connexion" element={<ClientLogin />} />
                  <Route path="/inscription" element={<ClientRegister />} />
                  <Route path="/mon-compte" element={<ClientAccount />} />

                  {/* Route Login Admin (Accessible pour se connecter) */}
                  <Route path="/login" element={<Login />} />

                  {/* 👇 ROUTE ADMIN PROTÉGÉE 👇 */}
                  <Route 
                    path="/admin" 
                    element={
                      <AdminRoute>
                        <Admin />
                      </AdminRoute>
                    } 
                  />

                </Routes>
              </div>

              <Footer />

            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;