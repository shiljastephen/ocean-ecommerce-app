import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import OrderTracking from "./pages/OrderTracking";
import VendorOrders from "./pages/VendorOrders";
import VendorApply from "./pages/VendorApply";
import CustomerTracking from "./pages/CustomerTracking";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const isVendor = () => localStorage.getItem("role") === "vendor";

  return (
    <BrowserRouter>
      {/* <Navbar/> */}
      <Routes>
        {/* CUSTOMER ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderTracking />} />

        {/* VENDOR APPLY */}
        <Route path="/vendor/apply" element={<VendorApply />} />

        {/* VENDOR ORDERS (PROTECTED) */}
        <Route
          path="/vendor/orders"
          element={isVendor() ? <VendorOrders /> : <Navigate to="/" />}
        />
        <Route
          path="/orders/track/:id"
          element={<CustomerTracking />}
        />
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
