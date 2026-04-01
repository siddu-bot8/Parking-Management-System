import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import "./Reports.css";

function Report() {
  const [selectedDate, setSelectedDate] = useState("");
  const [report, setReport] = useState([]);

  // ===============================
  // FETCH REPORT DATA
  // ===============================
  useEffect(() => {
    if (!selectedDate) return;

    fetch(` https://parking-management-system-6.onrender.com/report?date=${selectedDate}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Server Error");
        }
        return res.json();
      })
      .then(data => {
        setReport(data);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        alert("Error fetching report ❌");
      });
  }, [selectedDate]);

  // ===============================
  // CALCULATE TOTAL REVENUE
  // ===============================
  const totalRevenue = report.reduce(
    (sum, item) => sum + (item.total || 0),
    0
  );

  return (
    <Layout>
      <div className="report-container">

        <h2>📊 Daily Parking Report</h2>

        {/* DATE INPUT */}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {/* TOTAL REVENUE */}
        <div className="revenue-box">
          Total Revenue: ₹{totalRevenue}
        </div>

        {/* TABLE */}
        <table className="report-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Owner</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
              <th>Parking Fee</th>
              <th>Late Fee</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {report.length > 0 ? (
              report.map((item, index) => (
                <tr key={index}>
                  <td>{item.vehicle_no}</td>
                  <td>{item.owner_name}</td>
                  <td>{item.entry_time}</td>
                  <td>{item.exit_time || "—"}</td>
                  <td>₹{item.parking_fee}</td>
                  <td>₹{item.late_fee}</td>
                  <td><b>₹{item.total}</b></td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={
                        item.payment_status === "Paid"
                          ? "paid"
                          : "pending"
                      }
                    >
                      {item.payment_status || "Pending"}
                    </span>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </Layout>
  );
}

export default Report;