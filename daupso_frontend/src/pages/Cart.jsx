import "./Cart.css";

function Cart({ cartItems, removeFromCart, updateQuantity }) {
  return (
    <div className="cart-container">
      <h2>Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        cartItems.map(item => (
          <div key={item._id} className="cart-item">
            <div className="cart-info">
              <h3>{item.name}</h3>
              <p>${item.price}</p>
            </div>

            <div className="cart-controls">
              <button onClick={() => updateQuantity(item._id, -1)}>
                −
              </button>

              <span>{item.quantity}</span>

              <button onClick={() => updateQuantity(item._id, 1)}>
                +
              </button>

              <button
                className="delete-btn"
                onClick={() => removeFromCart(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart;
