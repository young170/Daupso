import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import SearchResults from "./pages/SearchResults";
import Header from "./components/Header";
import { useState } from "react";

function App() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <>
      <Header cartCount={cartCount} />

      <Routes>
        <Route path="/" element={<Home setCartCount={setCartCount} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route
          path="/search"
          element={<SearchResults setCartCount={setCartCount} />}
        />
      </Routes>
    </>
  );
}

export default App;
