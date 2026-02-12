import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "./OrderTracking.css";

function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await API.get(`orders/track/${id}/`);
      setOrder(res.data);
    } catch (err) {
      console.log(err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading order...</p>;
  if (!order) return <p>Order not found</p>;

  return (
    <div className="order-tracking">
      <h2>Order #{order.id}</h2>

      <p>
        Status:
        <span className={`status-badge status-${item.status}`}>
          {item.status}
        </span>
      </p>
      <p><strong>Total:</strong> ₹{order.total_price}</p>

      <h3>Items</h3>

      {order.items.map(item => (
        <div key={item.id} className="track-item">
          <img src={item.product_image} alt={item.product_name} />
          <div>
            <p>{item.product_name}</p>
            <p>Qty: {item.quantity}</p>
            <p>Status: <strong>{item.status}</strong></p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderTracking;
