import React, { useState } from "react";
import Layout from "./Layout";
import "./Unpaid.css";

function Unpaid() {
  const [data, setData] = useState([]);

  const load = async () => {
    const res = await fetch("https://parking-management-system-2.onrender.com/all_unpaid");
    const result = await res.json();
    setData(result);
  };

  // 💳 PAYMENT FUNCTION
  const handlePay = async (record_id) => {
    if (!window.confirm("Confirm Payment?")) return;

    try {
      await fetch("https://parking-management-system-2.onrender.com/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ record_id })
      });

      alert("Payment Successful ✅");
      load(); // refresh table

    } catch (err) {
      console.error(err);
      alert("Payment Failed ❌");
    }
  };

  return (
    <Layout>
      <div className="unpaid-container">

        <h2>📋 Unpaid Bills</h2>

        <button className="load-btn" onClick={load}>
          Load Data
        </button>

        <table className="unpaid-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Owner</th>
              <th>Type</th>
              <th>Total Due</th>
              <th>Action</th> {/* NEW COLUMN */}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item, i) => (
                <tr key={i}>
                  <td>{item.vehicle_no}</td>
                  <td>{item.owner_name}</td>
                  <td>{item.vehicle_type}</td>
                  <td className="amount">₹{item.total_due}</td>

                  {/* 💳 PAYMENT BUTTON */}
                  <td>
                    <button
                      className="pay-btn"
                      onClick={() => handlePay(item.record_id)}
                    >
                      Pay
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No unpaid records</td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </Layout>
  );
}

export default Unpaid;