import React, { useState } from "react";
import Layout from "./Layout";


function PayBill() {
  const [vehicle, setVehicle] = useState("");
  const [bill, setBill] = useState(null);

  console.log(bill);

  // ✅ FETCH BILL
  const fetchBill = async () => {
    try {
      const res = await fetch("https://parking-management-system-6.onrender.com/get-bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ vehicle_no: vehicle })
      });

      if (!res.ok) {
        throw new Error("Server not responding");
      }

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        setBill(null);
      } else {
        setBill(data); // ✅ FIXED
      }

    } catch (err) {
      console.error("FETCH ERROR:", err);
      alert("Backend not connected ❌");
    }
  };

  // ✅ PAY NOW
  const payNow = async () => {
  if (!bill?.record_id) {
    alert("No bill found ❌");
    return;
  }

  if (!window.confirm("Confirm payment?")) return;

  try {
    const res = await fetch("http://localhost:5000/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        record_id: bill.record_id   // ✅ FIXED
      })
    });

    const data = await res.json();

    if (data.message) {
      alert("Payment Successful ✅");
      setBill(null);
    } else {
      alert("Payment Failed ❌");
    }

  } catch (err) {
    console.error(err);
    alert("Payment failed ❌");
  }
};

  return (
    <Layout>
      <div className="form-card">

        <h2>💳 Pay Bill</h2>

        <input
          placeholder="Enter Vehicle Number"
          onChange={(e) => setVehicle(e.target.value)}
        />

        <button onClick={fetchBill}>Get Bill</button>

        {bill && (
          <div className="bill-box">
            <p><b>Vehicle:</b> {bill.vehicle_no}</p>
            <p><b>Owner:</b> {bill.owner_name}</p>
            <p><b>Total Due:</b> ₹{bill?.total_due ?? 0}</p>
           

            <button onClick={payNow}>Pay Now</button>
          </div>
        )}

      </div>
    </Layout>
  );
}



export default PayBill;
