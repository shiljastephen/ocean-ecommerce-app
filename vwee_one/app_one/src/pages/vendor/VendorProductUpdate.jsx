import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./VendorProductUpdate.css";

const VendorProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    discount: 0,
    stock: "",
    is_available: true,
  });

  const [image, setImage] = useState(null);

  /* =========================
     FETCH PRODUCT + CATEGORIES
  ========================= */
  useEffect(() => {
    // Fetch categories
    api.get("categories/")
      .then((res) => setCategories(res.data))
      .catch(() => setError("Failed to load categories"));

    // Fetch product details
    api.get(`vendor/products/${id}/`)
      .then((res) => {
        setForm({
          name: res.data.name,
          category: res.data.category,
          description: res.data.description,
          price: res.data.price,
          discount: res.data.discount,
          stock: res.data.stock,
          is_available: res.data.is_available,
        });
        setImagePreview(res.data.image);
      })
      .catch(() => setError("Failed to load product"));
  }, [id]);

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* =========================
     HANDLE SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("discount", form.discount);
    formData.append("stock", form.stock);
    formData.append("is_available", form.is_available);

    if (image) {
      formData.append("image", image);
    }

    try {
      await api.patch(`vendor/products/${id}/`, formData);
      navigate("/vendor/products");
    } catch (err) {
      console.log(err.response?.data);
      setError("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="vendor-update-container">
      <h2>Edit Product</h2>

      {error && <p className="vendor-error">{error}</p>}

      <form onSubmit={handleSubmit} className="vendor-update-form">

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <div className="vendor-grid">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="discount"
            placeholder="Discount (%)"
            value={form.discount}
            onChange={handleChange}
          />
        </div>

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="vendor-image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setImage(e.target.files[0]);
            setImagePreview(URL.createObjectURL(e.target.files[0]));
          }}
        />

        <label className="vendor-checkbox">
          <input
            type="checkbox"
            name="is_available"
            checked={form.is_available}
            onChange={handleChange}
          />
          Available
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default VendorProductUpdate;
