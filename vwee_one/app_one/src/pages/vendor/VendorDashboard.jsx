import { useEffect, useState } from "react";
import { getVendorDashboard } from "../../services/vendorApi";
import VendorTopBar from "../../components/VendorTopBar";

const VendorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getVendorDashboard();
        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <>
      {/* ✅ Vendor Sub Navbar */}
      <VendorTopBar />

      {/* ✅ Dashboard Content */}
      <div style={{ padding: "30px" }}>
        <h2>Vendor Dashboard</h2>

        {loading && <p>Loading dashboard...</p>}

        {error && <p style={{ color: "red" }}>{error}</p>}

        {data && (
          <div
            style={{
              marginTop: "20px",
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              maxWidth: "500px",
            }}
          >
            <p>
              <strong>Shop Name:</strong>{" "}
              {data.shop_name ? data.shop_name : "No Shop Created"}
            </p>

            <p>
              <strong>Total Products:</strong> {data.total_products}
            </p>

            <p>
              <strong>Shop Status:</strong>{" "}
              {data.shop_active ? "Active ✅" : "Inactive ❌"}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default VendorDashboard;
