import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext'; // <--- On n'oublie pas l'import !

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast(); // <--- On récupère la fonction

  useEffect(() => {
    fetch(`https://phonedrive-api.onrender.com/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (loading) return <div className="pt-32 text-center text-xl">Chargement du produit...</div>;
  if (!product || product.error) return <div className="pt-32 text-center text-xl">Produit introuvable 😕</div>;

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Fil d'Ariane */}
      <nav className="text-sm text-slate-500 mb-8">
        <Link to="/" className="hover:text-blue-600">Accueil</Link> 
        <span className="mx-2">/</span> 
        <Link to="/boutique" className="hover:text-blue-600">Boutique</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900 font-medium">{product.model}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* IMAGE */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 flex items-center justify-center shadow-sm">
            {product.image ? (
                <img src={product.image} alt={product.model} className="max-h-[500px] object-contain mix-blend-multiply hover:scale-105 transition duration-500" />
            ) : (
                <div className="text-9xl text-slate-200"><i className="fa-solid fa-mobile-screen"></i></div>
            )}
        </div>

        {/* INFOS */}
        <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{product.model}</h1>
            <div className="text-3xl font-bold text-blue-600 mb-6">{product.price} €</div>
            
            <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                {product.description || "Un iPhone reconditionné dans un état exceptionnel. Testé, vérifié et nettoyé par nos experts."}
            </p>

            {/* Caractéristiques */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Stockage</p>
                    <p className="font-bold text-slate-900">{product.storage || "128 Go"}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Couleur</p>
                    <p className="font-bold text-slate-900">{product.color || "Noir Minuit"}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">État</p>
                    <p className="font-bold text-green-600">Parfait état</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Garantie</p>
                    <p className="font-bold text-slate-900">12 Mois</p>
                </div>
            </div>

            {/* Bouton d'action (C'est ici que tu avais l'erreur) */}
            <div className="flex gap-4">
                <button 
                    onClick={() => {
                        addToCart(product);
                        showToast(`iPhone ${product.model} ajouté au panier ! 👜`);
                    }}
                    className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-95 transform duration-100"
                >
                    <i className="fa-solid fa-cart-plus"></i> Ajouter au panier
                </button>
            </div>

            {/* Réassurance */}
            <div className="mt-8 pt-8 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-3 text-slate-600">
                    <i className="fa-solid fa-truck-fast text-blue-500 w-6"></i>
                    <span>Livraison gratuite en 24/48h</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                    <i className="fa-solid fa-check-circle text-green-500 w-6"></i>
                    <span>30 points de contrôle vérifiés</span>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetails;