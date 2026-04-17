import { NavLink } from "react-router-dom";
import "./VendorTopBar.css";

function VendorTopBar() {
  return (
    <div className="vendor-topbar">
      <NavLink to="/vendor/dashboard">Dashboard</NavLink>
      <NavLink to="/vendor/products">View Products</NavLink>
      <NavLink to="/vendor/products/add">Add Product</NavLink>
      <NavLink to="/VendorOrders">Orders</NavLink>
    </div>
  );
}

export default VendorTopBar;
