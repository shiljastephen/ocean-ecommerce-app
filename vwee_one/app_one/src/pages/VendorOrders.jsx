import { useEffect, useState } from "react";
import API from "../services/api";
import "./VendorOrders.css";

function VendorOrders() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("orders/vendor/orders/");
      setItems(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(
        `orders/vendor/order-item/${id}/update/`,
        { status }
      );
      fetchOrders(); // refresh
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="vendor-orders">
      <h2>Vendor Orders</h2>

      {items.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        items.map(item => (
          <div key={item.id} className="vendor-card">
            <h4>{item.product_name}</h4>

            <p>Order #{item.order_id}</p>
            <p>Qty: {item.quantity}</p>
            <p>
              Status:
              <span className={`status-badge status-${item.status}`}>
               {item.status}
              </span>
            </p>


            <select
              value={item.status}
              onChange={(e) =>
                updateStatus(item.id, e.target.value)
              }
            >
              <option value="PENDING">Pending</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}

export default VendorOrders;
