import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./SearchResults.css";

function SearchResults({ setCartCount }) {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (!query) return;

    fetch(`http://localhost:3000/products/search?q=${query}`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, [query]);

  return (
    <div className="results-container">
      {products.length === 0 ? (
        <p className="no-results">No Products Found</p>
      ) : (
        products.map(product => (
          <div key={product._id} className="product-box">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <p>{product.category}</p>
            <p>{product.description}</p>
        
            <button
              className="add-cart-btn"
              onClick={() => setCartCount(prev => prev + 1)}
            >
              Add to Cart
            </button>
          </div>
        ))
      )}
    </div>
  );
  
}

export default SearchResults;
