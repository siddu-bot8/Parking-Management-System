import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./Exit.css"

function Exit() {
  const [vehicle, setVehicle] = useState("");
  const [bill, setBill] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paid, setPaid] = useState(false);

  const navigate = useNavigate();

  // 🔹 Generate Bill
  const handleExit = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/exit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ vehicle_no: vehicle })
      });

      const data = await res.json();
      console.log("Exit response:", data);

      if (data && data.total !== undefined) {
        setBill(data);
      } else {
        alert("No bill generated ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error ❌");
    }
  };

  // 💳 PAY
  const handlePay = async () => {
    if (!bill?.record_id) {
      alert("Invalid bill ❌");
      return;
    }

    try {
      const res = await fetch("https://parking-management-system-2.onrender.com/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ record_id: bill.record_id })
      });

      const data = await res.json();
      console.log("Pay response:", data);

      setPaid(true);
      setShowReceipt(true);
    } catch (err) {
      console.error(err);
      alert("Payment Failed ❌");

      setShowReceipt(true);
    }
  };

  // ❌ NO
  const handleNo = () => {
    setPaid(false);
    setShowReceipt(true);
  };

  // 🕒 Format Time (SAFE)
  const formatTime = (hours) => {
    const safeHours = hours || 0;

    const totalMinutes = Math.round(safeHours * 60);
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    return `${hrs} hr ${mins} min`;
  };

  // 🖨 Print
  const handlePrint = () => {
  window.print();
};
  // 💰 GST (SAFE)
  const gst = bill?.total ? bill.total * 0.18 : 0;
  const grandTotal = bill?.total ? bill.total + gst : 0;

 return (
  <Layout>
    <div className="exit-container">

      <div className="form-card">

        {/* TITLE */}
        <h2 className="title">🚗 Vehicle Exit</h2>

        {/* STEP 1 */}
        {!bill && !showReceipt && (
          <div className="section">
            <input
              className="input-field"
              placeholder="Enter Vehicle Number"
              onChange={(e) => setVehicle(e.target.value)}
            />

            <button className="btn primary" onClick={handleExit}>
              Generate Bill
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {bill && !showReceipt && (
          <div className="section">

            <p className="success-text">✔ Exit Processed Successfully</p>

            <div className="bill-box">
              <p><strong>Vehicle:</strong> {vehicle}</p>
              <p><strong>Time:</strong> {formatTime(bill?.hours || 0)}</p>
              <p><strong>Total:</strong> ₹{bill?.total || 0}</p>
            </div>

            <p className="question">Do you want to pay now?</p>

            <div className="btn-group">
              <button className="btn success" onClick={handlePay}>
                Pay Now 💳
              </button>

              <button className="btn danger" onClick={handleNo}>
                Pay Later
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
{showReceipt && (
  <div className="section">

    {/* PRINT AREA */}
    <div id="receipt" className="receipt-box">

      <p className="center small">Parking Receipt</p>

      <hr />
<div className="row">
  <span className="label">Vehicle</span>
  <span className="value">{vehicle || "N/A"}</span>
</div>

<div className="row">
  <span className="label">Time</span>
  <span className="value">{formatTime(bill?.hours || 0)}</span>
</div>

<div className="row">
  <span className="label">Amount</span>
  <span className="value">₹{bill?.total || 0}</span>
</div>

<div className="row">
  <span className="label">GST (18%)</span>
  <span className="value">
    ₹{bill?.total ? (bill.total * 0.18).toFixed(2) : "0.00"}
  </span>
</div>

<hr />

<div className="row total">
  <span className="label">Total</span>
  <span className="value">
    ₹{grandTotal ? grandTotal.toFixed(2) : "0.00"}
  </span>
</div>

      <p className={`status ${paid ? "paid" : "unpaid"}`}>
        {paid ? "✔ PAID" : "✖ UNPAID"}
      </p>

      <hr />

      <p className="center">Thank You 🙏</p>

    </div>

    {/* BUTTONS */}
    <div className="btn-group">
      <button
        className="btn secondary"
        onClick={() => navigate("/home")}
      >
        ⬅ Home
      </button>

      <button
        className="btn primary"
        onClick={handlePrint}
      >
        Download
      </button>
    </div>

  </div>
)}

      </div>

    </div>
  </Layout>
)};

export default Exit;