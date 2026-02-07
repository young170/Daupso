import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import SearchResults from "./pages/SearchResults";
import Header from "./components/Header";


function App() {
  return (
    <>
      <Header /> {/* Always visible */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </>
  );
}

export default App;
