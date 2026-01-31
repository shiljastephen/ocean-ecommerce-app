import { useEffect, useState } from "react";
import API from "../services/api";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("orders/history/")
      .then(res => setOrders(res.data))
      .catch(err => console.log(err.response?.data));
  }, []);

  return (
    <div className="orders">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <h4>Order #{order.id}</h4>
              <span className={`status ${order.status.toLowerCase()}`}>
                     {order.status}
              </span>
            </div>
          
            <p><strong>Total:</strong> ₹{order.total_price}</p>
            <p><strong>Payment:</strong> {order.payment_method}</p>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="order-img"
                  />

                  <div>
                    <p>{item.product_name}</p>
                    <p>Qty: {item.quantity}</p>
                    <div >
                     <p>₹{item.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;

