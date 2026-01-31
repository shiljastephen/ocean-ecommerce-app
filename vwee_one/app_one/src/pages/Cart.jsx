import { useEffect, useState } from "react";
import API from "../services/api";
import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    API.get("cart/").then(res => setCart(res.data));
  };

  // ✅ Toggle selection
  const toggleSelect = async (id, currentValue) => {
  try {
    const res = await API.patch(`cart/select/${id}/`, {
      is_selected: !currentValue,
    });

    setCart(cart.map(item =>
      item.id === id ? res.data : item
    ));
   } catch (err) {
    console.log(err.response?.data);
   }
  };

  // ✅ Total for selected items only
  const total = cart
    .filter(item => item.is_selected)
    .reduce((sum, item) => sum + item.product_price * item.quantity, 0);

  // ✅ Place order from selected cart items 
  const placeOrder = async () => {
    try {
      const res = await API.post("cart/place/cart/");
      alert("Order placed successfully!");
      fetchCart(); // cart clears after order
    } catch (err) {
      alert(err.response?.data?.error);
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        cart.map(item => (
          <div key={item.id} className="cart-item">
            <input
             type="checkbox"
             checked={item.is_selected}
             onChange={() => toggleSelect(item.id, item.is_selected)}
             className="cart-check"
           />

            <img
              src={item.product_image}
              alt={item.product_name}
              className="cart-img"
            />

            <div>
              <h4>{item.product_name}</h4>
              <p>Price: ₹{item.product_price}</p>
              <p>Qty: {item.quantity}</p>
              <h3>Total: ₹{total}</h3>
              <div className="place-order-btn">
                <button className="place-order-btn" onClick={placeOrder}>
                  Place Order (Selected Items)
                </button>
              </div>
            </div>
          </div>
        ))
      )}

    </div>
  );
}

export default Cart;

