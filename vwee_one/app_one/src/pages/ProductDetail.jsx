import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`vendor/products/${id}/`)
      .then((res) => setProduct(res.data))
      .catch(() => alert("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    try {
      await API.post("cart/add/", {
        product_id: product.id,
        quantity: 1,
      });

      alert("Added to cart successfully!");
    } catch (error) {
      alert("Please login first");
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!product) return <p className="loading">Product not found</p>;

  return (
    <div className="product-detail">
      <div className="product-card">
        <div className="product-image">
          <img
            src={product.image || "/no-image.png"}
            alt={product.name}
          />
        </div>

        <div className="product-info">
          <h2>{product.name}</h2>

          <p className="description">{product.description}</p>

          <div className="price-section">
            <span className="price">₹{product.price}</span>

            {product.discount > 0 && (
              <span className="discount">
                {product.discount}% OFF
              </span>
            )}
          </div>

          <button
            className="btn btn-cart"
            onClick={addToCart}
          >
            Add to Cart
          </button>

          <p className="note">
            Secure checkout available in Cart
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
