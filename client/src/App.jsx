import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Les Contextes
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext'; // <--- NOUVEAU

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

// Nouvelles Pages Client (On va les créer juste après)
import ClientLogin from './pages/ClientLogin';
import ClientRegister from './pages/ClientRegister';
import ClientAccount from './pages/ClientAccount';

function App() {
  return (
    <ToastProvider>
      <AuthProvider> {/* <--- ON ENVELOPPE ICI */}
        <CartProvider>
          <Router>
            <div className="font-sans text-slate-800 bg-slate-50 min-h-screen flex flex-col animate-fade-in">
              
              <Navbar />
              
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/boutique" element={<Shop />} />
                  <Route path="/produit/:id" element={<ProductDetails />} />
                  <Route path="/reparation" element={<Repair />} />
                  <Route path="/panier" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/mentions-legales" element={<Legal />} />
                  
                  {/* Routes Admin */}
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/login" element={<Login />} />

                  {/* Routes Client (NOUVEAU) */}
                  <Route path="/connexion" element={<ClientLogin />} />
                  <Route path="/inscription" element={<ClientRegister />} />
                  <Route path="/mon-compte" element={<ClientAccount />} />

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