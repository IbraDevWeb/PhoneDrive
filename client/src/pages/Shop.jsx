import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductSkeleton from '../components/ProductSkeleton'; // Import du squelette

function Shop() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedModel, setSelectedModel] = useState("Tous");
  const [priceRange, setPriceRange] = useState(2000);
  const [searchTerm, setSearchTerm] = useState("");

  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    // Petit délai artificiel de 500ms pour voir l'effet skeleton (optionnel, mais sympa pour tester)
    // Dans la vraie vie, tu enlèverais le setTimeout
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = products;

    if (selectedModel !== "Tous") {
        result = result.filter(p => p.model.includes(selectedModel));
    }

    result = result.filter(p => p.price <= priceRange);

    if (searchTerm !== "") {
        result = result.filter(p => 
            p.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (p.color && p.color.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }

    setFilteredProducts(result);
  }, [selectedModel, priceRange, searchTerm, products]);

  const categories = ["Tous", "iPhone 11", "iPhone 12", "iPhone 13", "iPhone 14", "iPhone 15"];

  return (
    <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">Nos iPhone Reconditionnés</h1>
        <p className="text-slate-500 text-lg">Testés, vérifiés et garantis 12 mois.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* --- FILTRES --- */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold mb-4">Recherche</h3>
                <div className="relative">
                    <i className="fa-solid fa-magnifying-glass absolute left-3 top-3.5 text-slate-400"></i>
                    <input 
                        type="text" 
                        placeholder="Chercher un modèle..." 
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold mb-4">Modèles</h3>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedModel(cat)}
                            className={`block w-full text-left px-4 py-2 rounded-lg transition ${selectedModel === cat ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between mb-2">
                    <h3 className="font-bold">Budget Max</h3>
                    <span className="text-blue-600 font-bold">{priceRange} €</span>
                </div>
                <input 
                    type="range" min="100" max="2000" step="50"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
            </div>
        </div>

        {/* --- GRILLE PRODUITS --- */}
        <div className="flex-1">
            <div className="mb-6 text-slate-500 text-sm">
                {loading ? "Recherche en cours..." : `${filteredProducts.length} iPhone(s) trouvé(s)`}
            </div>

            {loading ? (
                // AFFICHAGE DES SQUELETTES PENDANT LE CHARGEMENT
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
                </div>
            ) : filteredProducts.length === 0 ? (
                // AFFICHAGE SI AUCUN RÉSULTAT
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                    <p className="text-xl text-slate-400">Aucun iPhone ne correspond à vos critères 🕵️‍♂️</p>
                    <button onClick={() => {setSelectedModel("Tous"); setPriceRange(2000); setSearchTerm("");}} className="mt-4 text-blue-600 font-bold hover:underline">
                        Réinitialiser les filtres
                    </button>
                </div>
            ) : (
                // AFFICHAGE DES PRODUITS
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-100 overflow-hidden group flex flex-col">
                        
                        <div className="relative h-64 bg-slate-50 flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-500">
                            <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${product.price > 800 ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                {product.price > 800 ? 'Premium' : 'Bon plan'}
                            </span>
                            
                            {product.image ? (
                                <img src={product.image} alt={product.model} className="h-full w-full object-contain mix-blend-multiply" />
                            ) : (
                                <div className="text-6xl text-slate-200"><i className="fa-solid fa-mobile-screen"></i></div>
                            )}
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{product.model}</h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    {product.storage || "Stockage standard"} • {product.color || "Couleur standard"}
                                </p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                                <span className="text-2xl font-bold text-slate-900">{product.price} €</span>
                                
                                <button 
                                    onClick={() => {
                                        addToCart(product);
                                        showToast(`iPhone ${product.model} ajouté au panier ! 👜`);
                                    }}
                                    className="w-12 h-12 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-900 transition flex items-center justify-center text-lg active:scale-90 transform duration-100"
                                    title="Ajouter au panier"
                                >
                                    <i className="fa-solid fa-plus"></i>
                                </button>
                            </div>
                            
                            <Link to={`/produit/${product.id}`} className="block mt-4 text-center text-sm font-medium text-blue-600 hover:text-blue-800">
                                Voir la fiche technique <i className="fa-solid fa-arrow-right ml-1"></i>
                            </Link>
                        </div>
                    </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Shop;