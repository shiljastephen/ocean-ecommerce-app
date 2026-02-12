import { useState } from "react";
import API from "../services/api";
import "./VendorApply.css";

function VendorApply() {

  const [form, setForm] = useState({
    shop_name: "",
    business_email: "",
    phone: "",
    address: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("vendor/apply/", form);

      alert("Application submitted 🎉 Wait for admin approval.");
      window.location.href = "/";

    } catch (err) {
      console.log(err.response?.data);
      alert("Application failed");
    }
  };

  return (
    <div className="vendor-apply-container">
      <form className="vendor-apply-form" onSubmit={handleSubmit}>
        <h2>Apply As Vendor</h2>

        <input
          name="shop_name"
          placeholder="Shop Name"
          value={form.shop_name}
          onChange={handleChange}
          required
        />

        <input
          name="business_email"
          placeholder="Business Email"
          value={form.business_email}
          onChange={handleChange}
          required
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <textarea
          name="address"
          placeholder="Business Address"
          value={form.address}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
}

export default VendorApply;
