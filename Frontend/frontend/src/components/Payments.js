import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./payment.css";

function Payments() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="payments-wrapper">

        <h2 className="payments-title">💳 Payments Menu</h2>

        <div className="payments-grid">

          <div className="pay-card" onClick={() => navigate("/pay-bill")}>
            <div className="icon">💳</div>
            <h3>Pay Bill</h3>
            <p>Pay vehicle parking bill instantly</p>
          </div>

          <div className="pay-card" onClick={() => navigate("/unpaid")}>
            <div className="icon">📋</div>
            <h3>Unpaid Bills</h3>
            <p>View all pending payments</p>
          </div>

          <div className="pay-card" onClick={() => navigate("/active")}>
            <div className="icon">🚗</div>
            <h3>Active Vehicles</h3>
            <p>Vehicles currently inside parking</p>
          </div>

          <div className="pay-card" onClick={() => navigate("/income")}>
            <div className="icon">💰</div>
            <h3>Daily Income</h3>
            <p>Check today’s revenue</p>
          </div>

        </div>

      </div>
    </Layout>
  );
}

export default Payments;