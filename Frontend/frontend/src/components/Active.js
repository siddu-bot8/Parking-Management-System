import React, { useState,useEffect } from "react";
import Layout from "./Layout";
import "./Active.css";
q

function Active() {
  const [data, setData] = useState([]);

  const load = async () => {
    try {
      const res = await fetch("https://parking-management-system-6.onrender.com/active");
      const result = await res.json();

      if (result.status === "success") {
        setData(result.data);
      } else {
        alert("No data found ❌");
      }

    } catch (err) {
      console.error(err);
      alert("Error loading active vehicles ❌");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout>
      <div className="active-container">

        <h2>🚗 Active Vehicles</h2>

        <button className="load-btn" onClick={load}>
          Show Active
        </button>

        <table className="active-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Owner</th>
              <th>Entry Time</th>
              <th>Exit Time</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((d, i) => (
                <tr key={i}>
                  <td>{d.vehicle_no}</td>
                  <td>{d.owner_name}</td>
                  <td>{new Date(d.entry_time).toLocaleString()}</td>
                  <td className="active-status">Still Parked</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">
                  No Active Vehicles
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </Layout>
  );
}

export default Active;