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
        { vendor_status: status, }
      );
      fetchOrders(); // refresh
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
  <div className="vendor-orders-page">
    <h2>Vendor Orders</h2>

    <div className="vendor-orders">
      {items.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="vendor-card">
            <h4>{item.product_name}</h4>

            <p>Order #{item.order_id}</p>
            <p>Qty: {item.quantity}</p>

            <p>
              Status:
              <span className={`status-badge status-${item.vendor_status}`}>
                {item.vendor_status}
              </span>
            </p>

            <select
              value={item.vendor_status}
              onChange={(e) =>
                updateStatus(item.id, e.target.value)
              }
            >
              <option value="pending">Pending</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        ))
      )}
    </div>
  </div>
 );
}

export default VendorOrders;
