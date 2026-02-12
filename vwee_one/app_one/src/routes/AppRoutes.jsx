import { Routes, Route } from "react-router-dom";
import VendorProductList from "../pages/vendor/VendorProductList";
import VendorProductCreate from "../pages/vendor/VendorProductCreate";
import VendorProductUpdate from "../pages/vendor/VendorProductUpdate";
import VendorDashboard from "../pages/vendor/VendorDashboard";
import VendorOrders from "../pages/VendorOrders";

const AppRoutes = () => (
  <Routes>
    <Route path="/vendor/products" element={<VendorProductList />} />
    <Route path="/vendor/products/add" element={<VendorProductCreate />} />
    <Route path="/vendor/products/:id" element={<VendorProductUpdate />} />
    <Route path="/vendor/dashboard" element={<VendorDashboard />} />
    <Route path="/VendorOrders" element={<VendorOrders />} />
  </Routes>
);

export default AppRoutes;
