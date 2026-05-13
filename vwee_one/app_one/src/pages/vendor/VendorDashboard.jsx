import { useEffect, useState } from "react";
import { getVendorDashboard } from "../../services/vendorApi";
import VendorTopBar from "../../components/VendorTopBar";
import SalesChart from "../../components/SalesChart";
import "./VendorDashboard.css";

const VendorDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getVendorDashboard();
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <>
      <VendorTopBar />

      <div className="dashboard">
        <h2>Vendor Dashboard</h2>

        {/* 🔹 Shop Info */}
        <div className="shop-card">
          <p><strong>Shop:</strong> {data.shop_name || "No Shop"}</p>
          <p>
            <strong>Status:</strong>{" "}
            {data.shop_active ? "Active ✅" : "Inactive ❌"}
          </p>
        </div>

        {/* 🔥 Stats Cards */}
        <div className="stats-grid">

          <div className="stat-card">
            <span className="icon">📦</span>
            <h4>Total Products</h4>
            <p>{data.total_products}</p>
          </div>

          <div className="stat-card">
            <span className="icon">🛒</span>
            <h4>Total Orders</h4>
            <p>{data.total_orders}</p>
          </div>

          <div className="stat-card">
            <span className="icon">⏳</span>
            <h4>Pending Orders</h4>
            <p>{data.pending_orders}</p>
          </div>

          <div className="stat-card">
            <span className="icon">✅</span>
            <h4>Delivered</h4>
            <p>{data.delivered_orders}</p>
          </div>

          <div className="stat-card revenue">
            <span className="icon">💰</span>
            <h4>Revenue</h4>
            <p>₹{data.revenue}</p>
          </div>

        </div>

        {/* 🔥 Insight */}
        <p className="insight">
          You have {data.pending_orders} pending orders 🚀
        </p>

        {/* 📊 FULL WIDTH CHART */}
        <div className="chart-full">
          <SalesChart />
        </div>
      </div>
    </>
  );
};

export default VendorDashboard;
