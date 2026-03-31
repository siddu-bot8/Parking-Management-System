import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="parking">
        <h1 className="main-title">
        Welcome to BPS Parking System
      </h1>

      </div>

      

      <div className="cards">

        <div className="card" onClick={() => navigate("/entry")}>
          🚗 Entry
        </div>

        <div className="card" onClick={() => navigate("/exit")}>
          🚪 Exit
        </div>

        <div className="card" onClick={() => navigate("/payments")}>
          💳 Payment
        </div>

        <div className="card" onClick={() => navigate("/reports")}>
          📊 Reports
        </div>

      </div>
    </Layout>
  );
}

export default Home;