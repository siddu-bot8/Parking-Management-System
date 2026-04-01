import React, { useState } from "react";
import Layout from "./Layout";

function Income() {
  const [date, setDate] = useState("");
  const [income, setIncome] = useState(0);

  const load = async () => {
    const res = await fetch(`https://parking-management-system-6.onrender.com/income?date=${date}`);
    const data = await res.json();
    setIncome(data.total_income || 0);
  };

  return (
    <Layout>
      <div className="form-card">
        <h2>Daily Income</h2>

        <input type="date" onChange={(e) => setDate(e.target.value)} />
        <button onClick={load}>Get Income</button>

        <h3>₹{income}</h3>
      </div>
    </Layout>
  );
}

export default Income;