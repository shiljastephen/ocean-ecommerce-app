import { useEffect, useState } from "react";
import { getVendorProducts, deleteVendorProduct } from "../../services/vendorApi";
import { useNavigate, Link} from "react-router-dom";
import api from "../../services/api";
import "./endorProductList.css";

const VendorProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     FETCH VENDOR PRODUCTS
     ========================= */
  useEffect(() => {
    api
      .get("vendor/products/")
      .then((res) => setProducts(res.data))
      .catch(() => setError("Failed to load products"))
      .finally(() => setLoading(false));
  }, []);

  /* =========================
     DELETE PRODUCT
     ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await api.delete(`vendor/products/${id}/`);
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      alert("Failed to delete product");
    }
  };

  /* =========================
     UI
     ========================= */
  return (
    <div className="vendor-product-list-container">
      <div className="vendor-product-list-header">
        <h2>My Products</h2>
        <Link to="/vendor/products/add" className="vendor-add-btn">
          + Add Product
        </Link>
      </div>

      {loading && <p className="vendor-info">Loading products...</p>}
      {error && <p className="vendor-error">{error}</p>}

      {!loading && products.length === 0 && (
        <p className="vendor-info">No products found.</p>
      )}

      {!loading && products.length > 0 && (
        <div className="vendor-table-wrapper">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="vendor-product-img"
                      />
                    ) : (
                      <span className="vendor-no-image">—</span>
                    )}
                  </td>

                  <td>{product.name}</td>

                  <td>₹{product.price}</td>

                  <td>{product.stock}</td>

                  <td>
                    <span
                      className={
                        product.is_available
                          ? "vendor-status active"
                          : "vendor-status inactive"
                      }
                    >
                      {product.is_available ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="vendor-actions">
                    <Link
                      to={`/vendor/products/${product.id}`}
                      className="vendor-edit-btn"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(product.id)}
                      className="vendor-delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorProductList;
