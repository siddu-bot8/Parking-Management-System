import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./entry.css";

function Entry() {
  const [vehicle, setVehicle] = useState("");
  const [owner, setOwner] = useState("");
  const [type, setType] = useState("Car");
  const [showReceipt, setShowReceipt] = useState(false);
  const [entryTime, setEntryTime] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
  try {
    const res = await fetch("https://parking-management-system-2.onrender.com/entry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ vehicle, owner, type })
    });

    console.log("Status:", res.status);

    if (!res.ok) {
      throw new Error("Server responded with error");
    }

    const data = await res.json();
    console.log("Response:", data);

    if (data.status === "success") {
      setEntryTime(new Date().toLocaleString());
      setShowReceipt(true);
    } else {
      alert(data.message || "Entry failed ❌");
    }

  } catch (err) {
    console.error("ERROR:", err);
    alert("Server Error ❌");
  }
};

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <div className="form-card">

        {/* 🔹 FORM */}
        {!showReceipt && (
          <>
            <h2>Vehicle Entry</h2>

            <input
              placeholder="Vehicle Number"
              onChange={(e) => setVehicle(e.target.value)}
            />

            <input
              placeholder="Owner Name"
              onChange={(e) => setOwner(e.target.value)}
            />

            <select onChange={(e) => setType(e.target.value)}>
              <option>Car</option>
              <option>Bike</option>
            </select>

            <button onClick={handleSubmit}>
              Submit
            </button>
          </>
        )}

        {/* 🔹 RECEIPT (NO EXIT TIME) */}
        {showReceipt && (
          <>
            <div id="receipt">

              <h3 style={{ textAlign: "center" }}>
                🚗 Parking System
              </h3>

              <p style={{ textAlign: "center" }}>
                Parking Receipt
              </p>

              <hr />

              <div className="receipt-row">
                <span>Vehicle</span>
                <span>{vehicle}</span>
              </div>

              <div className="receipt-row">
                <span>Owner</span>
                <span>{owner}</span>
              </div>

              <div className="receipt-row">
                <span>Type</span>
                <span>{type}</span>
              </div>

              <div className="receipt-row">
                <span>Entry Time</span>
                <span>{entryTime}</span>
              </div>

              <hr />

              <p className="status">ACTIVE ✅</p>

              <hr />

              <p style={{ textAlign: "center" }}>
                Thank You 🙏
              </p>

            </div>

            {/* BUTTONS */}
            <button onClick={handlePrint}>
              Download Receipt
            </button>

            <button onClick={() => navigate("/home")}>
              ⬅ Back
            </button>
          </>
        )}

      </div>
    </Layout>
  );
}

export default Entry;