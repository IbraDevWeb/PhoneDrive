import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // <--- On importe le cerveau Auth

function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth(); // <--- On récupère l'user et la fonction logout

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-110 duration-300">
              P
            </div>
            <span className="text-2xl font-bold text-slate-900 tracking-tight">PhoneDrive</span>
          </Link>

          {/* MENU CENTRAL (Caché sur mobile) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 font-medium hover:text-blue-600 transition">Accueil</Link>
            <Link to="/boutique" className="text-slate-600 font-medium hover:text-blue-600 transition">Acheter un iPhone</Link>
            <Link to="/reparation" className="text-slate-600 font-medium hover:text-blue-600 transition">Réparation</Link>
          </div>

          {/* ACTIONS DROITE */}
          <div className="flex items-center gap-4">
            
            {/* Si connecté : Affiche le prénom + Menu Compte */}
            {user ? (
                <div className="flex items-center gap-4">
                    <Link to="/mon-compte" className="hidden md:flex items-center gap-2 text-slate-700 font-bold hover:text-blue-600 transition bg-slate-100 px-4 py-2 rounded-full">
                        <i className="fa-solid fa-user-check"></i>
                        <span>{user.name.split(' ')[0]}</span> {/* Affiche juste le prénom */}
                    </Link>
                    {/* Bouton Logout (visible sur mobile aussi via le compte, mais ici pour l'exemple desktop) */}
                    <button onClick={logout} className="text-slate-400 hover:text-red-500 transition text-sm hidden md:block" title="Déconnexion">
                        <i className="fa-solid fa-power-off"></i>
                    </button>
                </div>
            ) : (
                /* Si PAS connecté : Affiche le bouton Connexion */
                <Link to="/connexion" className="text-slate-600 font-bold hover:text-blue-600 transition flex items-center gap-2">
                    <i className="fa-regular fa-user"></i>
                    <span className="hidden md:inline">Connexion</span>
                </Link>
            )}

            {/* PANIER */}
            <Link to="/panier" className="relative group">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-900 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30">
                <i className="fa-solid fa-cart-shopping"></i>
              </div>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-bounce-subtle">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;