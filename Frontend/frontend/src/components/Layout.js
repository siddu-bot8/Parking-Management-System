import React from "react";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="layout">

      {/* NAVBAR */}
      <div className="navbar">
        🚗 BPS PARKING
      </div>

      {/* PAGE CONTENT */}
      <div className="content">
        {children}
      </div>

      {/* FOOTER */}
      <div className="footer">
        © 2026 BPSParking | Contact: info@parkmanage.com
      </div>

    </div>
  );
}

export default Layout;