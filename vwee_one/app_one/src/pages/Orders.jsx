import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ FIXED

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("orders/my-orders/");
      setOrders(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  
  // ✅ Cancel Order Properly (No Navigation)
  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await API.post(`orders/cancel/${id}/`);
      alert("Order cancelled successfully");
      fetchOrders(); // refresh
    } catch (err) {
      alert(err.response?.data?.error || "Cancel failed");
    }
  };

  if (loading) {
    return <p className="loading">Loading orders...</p>;
  }

  return (
    <div className="orders">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="order-card">
            
            {/* Header */}
            <div className="order-header">
              <h4>Order #{order.id}</h4>
              <span
                className={`status ${
                  (order.status || "pending").toLowerCase()
                }`}
              >
                {order.status || "PENDING"}
              </span>
            </div>

            {/* Summary */}
            <div className="order-summary">
              <p><strong>Total:</strong> ₹{order.total_price}</p>
              <p><strong>Payment:</strong> {order.payment_method?.toUpperCase()}</p>
              <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            </div>

            {/* Items */}
            <div className="order-items">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img
                      src={item.product_image || "/no-image.png"}
                      alt={item.product_name}
                      className="order-img"
                    />
                    <div className="item-info">
                      <p className="product-name">{item.product_name}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>₹{item.price}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-items">No items found</p>
              )}
            </div>

            {/* Actions */}
            <div className="order-actions">
              <button
                onClick={() => navigate(`/orders/track/${order.id}`)}
                className="track-btn"
              >
                Track Order
              </button>

              {order.status?.toLowerCase() === "pending" && (
                <button
                  onClick={() => cancelOrder(order.id)}
                  className="cancel-btn"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
