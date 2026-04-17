import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      const res = await API.get("wishlist/");
      setWishlist(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeItem = async (id) => {
    try {
      await API.delete(`wishlist/remove/${id}/`);
      fetchWishlist(); // refresh
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="wishlist-page">
      <h2>❤️ My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p>Your wishlist is empty</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((item) => (
            <div key={item.id} className="wishlist-card">
              
              <img
                src={item.product.image || "/no-image.png"}
                alt={item.product.name}
                onClick={() => navigate(`/product/${item.product.id}`)}
              />

              <h3>{item.product.name}</h3>

              <p>₹{item.product.price}</p>

              <button
                className="remove-btn"
                onClick={() => removeItem(item.id)}
              >
                ❌ Remove
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;