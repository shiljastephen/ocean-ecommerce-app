import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import "./ProductDetail.css";


function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    API.get(`products/${id}/`).then((res) => setProduct(res.data));
  }, [id]);

  const addToCart = async () => {
    console.log("PRODUCT OBJECT:", product); 
  try {
    await API.post("cart/add/", {
      product_id: product.id,
      quantity: 1,
    });

    alert("Added to cart successfully!");
  } catch (error) {
    console.error(error);
    alert("Please login first");
  }
};


  const orderNow = async () => {
  try {
    await API.post("orders/buy-now/", {
      product_id: product.id,
      quantity: 1,
    });

    alert("Order placed successfully!");
  } catch (error) {
    console.error(error);
    alert("Please login first");
  }
};

  if (!product) return <p>Loading...</p>;

 return (
  <div className="product-detail">
    <div className="product-image">
      <img src={product.image} alt={product.name} />
    </div>

    <div className="product-info">
      <h2>{product.name}</h2>
      <p>{product.description}</p>

      <div className="price">₹{product.price}</div>
      <div className="discount">{product.discount}% OFF</div>

      <div className="action-buttons">
        <button className="btn btn-cart" onClick={addToCart}>
          Add to Cart
        </button>
        <button className="btn btn-order" onClick={orderNow}>
          Order Now
        </button>
      </div>
    </div>
  </div>
 );
} 


export default ProductDetail;
