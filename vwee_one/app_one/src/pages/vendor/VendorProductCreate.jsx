import { useEffect, useState } from "react";
import { createVendorProduct } from "../../services/vendorApi";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./VendorProductCreate.css";


const VendorProductCreate = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
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
     FETCH CATEGORIES
     ========================= */
  useEffect(() => {
    api.get("categories/")
    .then((res) => setCategories(res.data))
    .catch(() => setError("Failed to load categories"));
}, []);

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
      await createVendorProduct(formData); // ✅ correct
    navigate("/vendor/products");
  } catch (err) {
    console.log(err.response?.data);
    setError("Failed to create product");
  } finally {
    setLoading(false);
    }
  };

  /* =========================
     UI
     ========================= */
  return (
    <div className="vendor-product-container">
      <h2 className="vendor-product-title">Add New Product</h2>

      {error && <p className="vendor-error">{error}</p>}

      <form onSubmit={handleSubmit} className="vendor-form">
        {/* Product Name */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="vendor-input"
        />

        {/* Category */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="vendor-select"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Description */}
        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          required
          className="vendor-textarea"
        />

        {/* Price & Discount */}
        <div className="vendor-grid">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="discount"
            placeholder="Discount (%)"
            value={form.discount}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        {/* Stock */}
        <input
          type="number"
          name="stock"
          placeholder="Stock Quantity"
          value={form.stock}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />

        {/* Image */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full"
        />

        {/* Available */}
        <label className="vendor-checkbox">
          <input
            type="checkbox"
            name="is_available"
            checked={form.is_available}
            onChange={handleChange}
          />
          Available for sale
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="vendor-button"
        >
          {loading ? "Saving..." : "Create Product"}
        </button>
      </form>

      <p className="vendor-note">
        Product will be sent for admin approval before going live.
      </p>
    </div>
  );
};

export default VendorProductCreate;
