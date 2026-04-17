import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);

  // ✅ Fetch product
  useEffect(() => {
    API.get(`vendor/products/${id}/`)
      .then((res) => setProduct(res.data))
      .catch(() => alert("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  // ✅ Fetch reviews
  const fetchReviews = async () => {
    try {
      const res = await API.get(`reviews/${id}/`);
      setReviews(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  // ✅ Add to cart
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

  // ✅ Submit review
  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await API.post("reviews/", {
        product: product.id,
        rating: rating,
        comment: comment,
      });

      alert("Review submitted!");
      setComment("");
      setRating(5);

      fetchReviews(); // 🔥 refresh reviews

    } catch (error) {
      alert("Error submitting review");
    }
  };
  
  const checkWishlist = async () => {
    try {
      const res = await API.get(`wishlist/check/${id}/`);
      setInWishlist(res.data.in_wishlist);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkWishlist();
  }, [id]);

  const toggleWishlist = async () => {
    try {
      const res = await API.post("wishlist/toggle/", {
        product: product.id,
      });

      setInWishlist(res.data.in_wishlist);
    } catch (error) {
      alert("Login required");
    }
  };
  
  const removeFromWishlist = async () => {
    try {
      await API.delete(`wishlist/remove/${wishlistId}/`);
      setInWishlist(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!product) return <p className="loading">Product not found</p>;

  return (
    <div className="product-detail">
      <div className="product-card">
        
        {/* Product Image */}
        <div className="product-image">
          <img
            src={product.image || "/no-image.png"}
            alt={product.name}
          />
        </div>

        {/* Product Info */}
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

          <button
            className={`btn wishlist-btn ${inWishlist ? "active" : ""}`}
            onClick={toggleWishlist}
          >
            <span className="heart">
              {inWishlist ? "❤️" : "🤍"}
            </span>
          </button>
        </div>
      </div>

      {/* ⭐ Review Section */}
      <div className="review-section">

        {/* Add Review */}
        <h3>Write a Review</h3>

        <form onSubmit={submitReview}>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= (hover || rating) ? "star filled" : "star"}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button type="submit" className="btn btn-review">
            Submit Review
          </button>
        </form>

        {/* Show Reviews */}
        <h3>Customer Reviews</h3>

        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="review-card">
              <p><strong>{rev.user}</strong></p>
              <p>{"⭐".repeat(rev.rating)}</p>
              <p>{rev.comment}</p>
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductDetail;