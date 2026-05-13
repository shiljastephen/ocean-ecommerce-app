import { useEffect, useState } from "react";
import API from "../services/api";
import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await API.get("cart/");
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Toggle selection
  const toggleSelect = async (id, currentValue) => {
    try {
      const res = await API.patch(`cart/select/${id}/`, {
        is_selected: !currentValue,
      });

      setCart((prev) =>
        prev.map((item) => (item.id === id ? res.data : item))
      );
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // ✅ Update quantity
  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;

    try {
      const res = await API.patch(`cart/update/${id}/`, {
        quantity,
      });

      setCart((prev) =>
        prev.map((item) => (item.id === id ? res.data : item))
      );
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // ✅ Calculate total of selected items
  const total = cart
    .filter((item) => item.is_selected)
    .reduce(
      (sum, item) => sum + item.product_price * item.quantity,
      0
    );
  
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const placeOrder = async () => {
    if (!address) {
      alert("Please enter delivery address");
      return;
    }

    try {
      await API.post("orders/place/order/", {
        address,
        payment_method: paymentMethod,
      });

      alert("Order placed successfully!");

      fetchCart();
    } catch (err) {
      alert(err.response?.data?.error || "Order failed");
    }
  };

  const selectedCount = cart.filter((i) => i.is_selected).length;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <input
                type="checkbox"
                checked={item.is_selected}
                onChange={() =>
                  toggleSelect(item.id, item.is_selected)
                }
                className="cart-check"
              />

              <img
                src={item.product_image}
                alt={item.product_name}
                className="cart-img"
              />

              <div className="cart-info cart-info-content">
                <h4>{item.product_name}</h4>
                <p>Price: ₹{item.product_price}</p>
                <p>{item.product_description}</p>
                <p>Quantity:{item.quantity}</p>

                <div className="qty-control">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="cart-summary">
            <h3>Total (Selected): ₹{total}</h3>

            {/* Address Section */}
            <div className="checkout-section">
              <h4>Delivery Address</h4>

              <textarea
                placeholder="Enter delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="address-input"
              />
            </div>

             {/* Payment Section */}
             <div className="checkout-section">
              <h4>Payment Method</h4>

              <label>
                <input
                  type="radio"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash on Delivery
              </label>

              <label>
                <input
                  type="radio"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Online Payment
              </label>
            </div>

            {/* Place Order */}
            <button
              className="place-order-btn"
              onClick={placeOrder}
              disabled={selectedCount === 0}
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
