import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "./CustomerTracking.css";

function CustomerTracking() {

  const { id } = useParams();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {

    try {

      const res = await API.get(
        `orders/track/${id}/`
      );

      setOrder(res.data);

    } catch (err) {

      console.log(
        err.response?.data || err.message
      );

    } finally {

      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading order...</p>;
  }

  if (!order) {
    return <p>Order not found</p>;
  }

  return (
    <div className="customer-tracking">

      <h2>Track Order #{order.id}</h2>

      {/* ORDER DETAILS */}
      <div className="tracking-summary">

        <p>
          <strong>Order Status:</strong>

          <span className={`status ${order.status}`}>
            {order.status}
          </span>
        </p>

        <p>
          <strong>Total:</strong>
          ₹{order.total_price}
        </p>

        <p>
          <strong>Payment:</strong>
          {order.payment_method}
        </p>

        <p>
          <strong>Date:</strong>

          {new Date(
            order.created_at
          ).toLocaleString()}
        </p>

      </div>

      {/* ITEMS */}
      <h3>Products</h3>

      <div className="tracking-items">

        {order.items?.map((item) => (

          <div
            key={item.id}
            className="tracking-item"
          >

            <img
              src={
                item.product_image ||
                "/no-image.png"
              }
              alt={item.product_name}
            />

            <div className="tracking-info">

              <h4>{item.product_name}</h4>

              <p>
                Quantity: {item.quantity}
              </p>

              <p>
                Vendor Status:

                <strong>
                  {" "}
                  {item.vendor_status}
                </strong>
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default CustomerTracking;