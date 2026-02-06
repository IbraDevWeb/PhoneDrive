import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // --- CAS : PANIER VIDE (Design soigné) ---
  if (cart.length === 0) {
    return (
        <div className="pt-32 pb-20 min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300 text-4xl animate-bounce-slow">
                <i className="fa-solid fa-basket-shopping"></i>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Votre panier est vide</h2>
            <p className="text-slate-500 mb-8 max-w-md">On dirait que vous n'avez pas encore craqué pour nos pépites reconditionnées.</p>
            <Link to="/boutique" className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition shadow-lg hover:shadow-blue-500/30">
                Découvrir le stock
            </Link>
        </div>
    );
  }

  // --- CAS : PANIER REMPLI ---
  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        Mon Panier <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{cart.length} articles</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl flex items-center gap-6 shadow-sm border border-slate-100 hover:border-blue-200 transition">
                    <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        {item.image ? <img src={item.image} className="h-16 w-16 object-contain mix-blend-multiply" alt={item.model}/> : "📱"}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900">{item.model}</h3>
                        <p className="text-slate-500 text-sm">{item.storage} • {item.color}</p>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-lg mb-1">{item.price} €</div>
                        <button onClick={() => removeFromCart(index)} className="text-red-500 text-sm font-medium hover:underline">
                            Retirer
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Résumé commande */}
        <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg sticky top-28">
                <h3 className="font-bold text-xl mb-6">Résumé</h3>
                
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-slate-600">
                        <span>Sous-total</span>
                        <span>{total} €</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                        <span>Livraison</span>
                        <span className="text-green-600 font-bold">Offerte</span>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-4 mb-8">
                    <div className="flex justify-between items-end">
                        <span className="font-bold text-lg">Total</span>
                        <span className="text-3xl font-bold text-blue-600">{total} €</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-right">TVA incluse</p>
                </div>

                <Link to="/checkout" className="block w-full bg-blue-600 text-white text-center py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                    Passer au paiement
                </Link>
                
                <div className="mt-6 flex items-center justify-center gap-4 text-slate-300 text-2xl">
                    <i className="fa-brands fa-cc-visa"></i>
                    <i className="fa-brands fa-cc-mastercard"></i>
                    <i className="fa-brands fa-cc-apple-pay"></i>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

export default Cart;