import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import Login from "./components/Login";
import Home from "./components/Home";
import Entry from "./components/Entry";
import Exit from "./components/Exit";
import Payments from "./components/Payments";
import Reports from "./components/Reports";
import PayBill from "./components/payBill";
import Unpaid from "./components/Unpaid";
import Active from "./components/Active";
import Income from "./components/Income";
import Navbar from "./components/Navbar";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/entry" element={<Entry />} />
        <Route path="/exit" element={<Exit />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/dashboard" element={<dashboard />} />
        <Route path="/pay-bill" element={<PayBill />} />
        <Route path="/unpaid" element={<Unpaid />} />
        <Route path="/active" element={<Active />} />
        <Route path="/income" element={<Income />} />
        <Route path="/Navbar" element={<Navbar />} />
        
        




        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

