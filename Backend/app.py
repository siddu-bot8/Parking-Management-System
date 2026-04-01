import os
from flask import Flask, request, jsonify
from flask_cors import CORS


import mysql.connector





app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})





DB_CONFIG = {
    "host": "hopper.proxy.rlwy.net",
    "user": "root ",
    "password": "NCEDYtQEakNjndYTWquRYeRoYwygvuZX",
    "database":"railway",
    "port":"49676",
    }

print("DEPLOY TEST")




def get_connection():
    try:
        print("Trying to connect DB...")
        conn = mysql.connector.connect(**DB_CONFIG)
        print("DB Connected ✅")
        return conn
    except Exception as e:
        print("DB Error:", e)

print("Conncting DB on startup ..")
get_connection()

@app.route("/")
def home():
    return "Backend Running Successfully 🚀"


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

   
    if email == "bps123@gmail.com" and password == "bps12345":
        return jsonify({"status": "success"})
    
    return jsonify({"status": "fail"})

@app.route('/entry', methods=['POST'])
def entry():
    try:
        data = request.json

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
        INSERT INTO parking_records (vehicle_no, owner_name, vehicle_type, entry_time, payment_status)
        VALUES (%s, %s, %s, NOW(), 'Pending')
        """, (data['vehicle'], data['owner'], data['type']))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({
            "status": "success",
            "message": "Entry Successful"
        })

    except Exception as e:
        print("ENTRY ERROR:", e)
        return jsonify({
            "status": "error",
            "message": str(e)
        })

@app.route('/exit', methods=['POST'])
def exit_vehicle():
    data = request.json
    vehicle_no = data.get("vehicle_no")


    hours = 2.5
    total = hours * 20

    return jsonify({
        "record_id": 1,
        "hours": hours,
        "total": total
    })
# ===============================
# PAY BILL
# ===============================
@app.route('/pay', methods=['POST'])
def pay():
    data = request.json
    record_id = request.json['record_id']

    conn = get_connection()
    cursor = conn.cursor()

    cursor.callproc("MakePayment", (record_id,))
    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Payment Successful"})

# ===============================
# GET BILL BY VEHICLE
# ===============================
@app.route('/get-unpaid', methods=['POST'])
def get_unpaid():
    vehicle = request.json['vehicle']

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
    SELECT vehicle_no, owner_name,
           (parking_fee + late_fee) AS total_due
    FROM parking_records
    WHERE payment_status = 'Pending'
    AND exit_time IS NOT NULL
""")

    data = cursor.fetchone()

    cursor.close()
    conn.close()

    if not data:
        return jsonify({"error": "No unpaid record"}), 404

    return jsonify(data)

# ===============================
# ALL UNPAID
# ===============================
@app.route('/all_unpaid', methods=['GET'])
def all_unpaid():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
    SELECT record_id, vehicle_no, owner_name, vehicle_type,
           (parking_fee + late_fee) AS total_due
    FROM parking_records
    WHERE payment_status = 'Pending'
    AND exit_time IS NOT NULL
""")
    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(data)

# ===============================
# ACTIVE VEHICLES
# ===============================
@app.route('/active', methods=['GET'])
def active():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
    SELECT vehicle_no, owner_name, entry_time, exit_time
    FROM parking_records
    WHERE exit_time IS NULL
""")

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(data)

@app.route("/get-bill", methods=["POST"])
def get_bill():
    data = request.json
    vehicle = data.get("vehicle_no")

    if not vehicle:
        return jsonify({"error": "vehicle_no missing"}), 400

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
    SELECT record_id, vehicle_no, owner_name,
           (COALESCE(parking_fee,0) + COALESCE(late_fee,0)) AS total_due
    FROM parking_records
    WHERE vehicle_no = %s
    AND payment_status = 'Pending'
    AND exit_time IS NOT NULL
    LIMIT 1
""", (vehicle,))
    


    row = cursor.fetchone()

    cursor.close()
    conn.close()

    if not row:
        return jsonify({"error": "No unpaid bill found"})

    return jsonify({
        "record_id": row["record_id"],
        "vehicle_no": row["vehicle_no"],
        "owner_name": row["owner_name"],
        "total_due": row["total_due"]
    })

@app.route('/report', methods=['GET'])
def get_report():
    try:
        date = request.args.get('date')

        if not date:
            return jsonify({"error": "Date required"}), 400

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT 
            vehicle_no,
            owner_name,
            entry_time,
            exit_time,
            parking_fee,
            late_fee,
            (parking_fee + late_fee) AS total,
            payment_status
        FROM parking_records
        WHERE DATE(entry_time) = %s
        """

        cursor.execute(query, (date,))
        data = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(data)

    except Exception as e:
        print("ERROR:", e)   # 👈 SEE ERROR IN TERMINAL
        return jsonify({"error": str(e)})

# ===============================
# DAILY INCOME
# ===============================
@app.route('/income', methods=['GET'])
def income():
    date = request.args.get('date')

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT SUM(parking_fee + late_fee) AS total_income
        FROM parking_records
        WHERE DATE(entry_time) = %s
        AND payment_status = 'Paid'
    """, (date,))

    data = cursor.fetchone()

    cursor.close()
    conn.close()

    return jsonify(data)

if __name__ == "__main__":
    print("Starting app...")
    get_connection()
    app.run(host="0.0.0.0", port=10000)


print("FINAL VERSION DEPLOY 🚀")






