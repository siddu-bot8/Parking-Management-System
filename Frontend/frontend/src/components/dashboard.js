import React, { useState } from "react";
import Layout from "./Layout";
import "./Dashboard.css"


function Dashboard() {
  const [unpaid, setUnpaid] = useState([]);
  const [active, setActive] = useState([]);
  const [income, setIncome] = useState(0);
  const [date, setDate] = useState("");

  const getUnpaid = async () => {
    const res = await fetch("http://localhost:5000/all_unpaid");
    const data = await res.json();
    setUnpaid(data);
  };

  const getActive = async () => {
    const res = await fetch("http://localhost:5000/active");
    const data = await res.json();
    setActive(data);
  };

  const getIncome = async () => {
    const res = await fetch(`http://localhost:5000/income?date=${date}`);
    const data = await res.json();
    setIncome(data.total_income || 0);
  };

  return (
    <Layout>
      <div className="form-card">

        <h2>📊 Dashboard</h2>

        <button onClick={getUnpaid}>View Unpaid</button>
        <button onClick={getActive}>Active Vehicles</button>

        <input type="date" onChange={(e) => setDate(e.target.value)} />
        <button onClick={getIncome}>Get Income</button>

        <h3>💰 Income: ₹{income}</h3>

        <div>
          {unpaid.map((u, i) => (
            <p key={i}>{u.vehicle_no} - ₹{u.total_due}</p>
          ))}
        </div>

        <div>
          {active.map((a, i) => (
            <p key={i}>{a.vehicle_no} - {a.entry_time}</p>
          ))}
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;