import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  // On charge le panier depuis le localStorage au démarrage (pour ne pas le perdre si on actualise)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // À chaque fois que le panier change, on le sauvegarde
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  // --- C'EST CETTE FONCTION QUI MANQUAIT 👇 ---
  const clearCart = () => {
    setCart([]); // On remet le tableau à zéro
    localStorage.removeItem("cart"); // On nettoie la mémoire du navigateur
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}