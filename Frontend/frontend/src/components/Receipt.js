import React from "react";

function Receipt({ data, type, vehicle, paid }) {

  if (!data) return <p>No Data</p>;

  const gstRate = 0.18;
  const gstAmount = data.total * gstRate;
  const grandTotal = data.total + gstAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="receipt-wrapper">

      <div className="receipt-box">

        <h3 className="text-center">🚗 ParkManage</h3>
        <p className="text-center small">Parking Ticket</p>

        <hr />

        <div className="receipt-row">
          <span>Ticket ID</span>
          <span>{data.record_id}</span>
        </div>

        <div className="receipt-row">
          <span>Vehicle</span>
          <span>{vehicle}</span>
        </div>

        <div className="receipt-row">
          <span>Entry Time</span>
          <span>{new Date(data.entry_time).toLocaleString()}</span>
        </div>

        {type === "exit" && (
          <>
            <div className="receipt-row">
              <span>Exit Time</span>
              <span>{new Date(data.exit_time).toLocaleString()}</span>
            </div>

            <div className="receipt-row">
              <span>Hours</span>
              <span>{data.hours}</span>
            </div>

            <hr />

            <div className="receipt-row">
              <span>Parking Fee</span>
              <span>₹{data.parking_fee}</span>
            </div>

            <div className="receipt-row">
              <span>Late Fee</span>
              <span>₹{data.late_fee}</span>
            </div>

            <div className="receipt-row">
              <span>GST (18%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>

            <hr />

            <div className="receipt-row total">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            <div className="text-center mt-2">
              <strong style={{ color: paid ? "green" : "red" }}>
                {paid ? "PAID ✅" : "UNPAID ❌"}
              </strong>
            </div>
          </>
        )}

        <hr />

        <p className="text-center small">Thank You 🙏</p>

        <button className="btn btn-dark w-100 mt-3" onClick={handlePrint}>
          Download / Print 🧾
        </button>

      </div>
    </div>
  );
}

export default Receipt;