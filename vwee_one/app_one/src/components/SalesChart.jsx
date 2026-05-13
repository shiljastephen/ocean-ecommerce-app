import { useEffect, useState } from "react";
import API from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./SalesChart.css";

function SalesChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await API.get("orders/vendor/dashboard/sales-chart/");
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Sales (Last 7 Days)</h3>

      {data.length === 0 ? (
        <div className="chart-empty">
          📊 No sales yet — start selling!
        </div>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default SalesChart;