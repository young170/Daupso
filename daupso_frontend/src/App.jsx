import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import SearchResults from "./pages/SearchResults";
import Cart from "./pages/Cart";

import Header from "./components/Header";

function App() {
  const [cartItems, setCartItems] = useState([]);

  // Add product to cart
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(p => p._id === product._id);

      if (existing) {
        return prev.map(p =>
          p._id === product._id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Remove item
  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(p => p._id !== id));
  };

  // Adjust quantity
  const updateQuantity = (id, amount) => {
    setCartItems(prev =>
      prev.map(p =>
        p._id === id
          ? { ...p, quantity: Math.max(1, p.quantity + amount) }
          : p
      )
    );
  };

  return (
    <>
      <Header cartItems={cartItems} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />

        <Route
          path="/search"
          element={<SearchResults addToCart={addToCart} />}
        />

        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;
