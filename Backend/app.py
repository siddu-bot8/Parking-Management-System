import mysql.connector
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ✅ FIXED DB CONFIG
DB_CONFIG = {
    "host": "hopper.proxy.rlwy.net",
    "user": "root",
    "password": "NCEDYtQEakNjndYTWquRYeRoYwygvuZX",
    "database": "railway",
    "port": 49676
}

def get_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        print("DB Connected ✅")
        return conn
    except Exception as e:
        print("DB Error:", e)
        return None

@app.route("/")
def home():
    return "Backend Running 🚀"

# ===============================
# LOGIN
# ===============================
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if email == "bps123@gmail.com" and password == "bps12345":
            return jsonify({"status": "success"})
        else:
            return jsonify({"status": "fail", "message": "Invalid credentials"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# ===============================
# ENTRY
# ===============================
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

        return jsonify({"status": "success", "message": "Entry Successful"})
    except Exception as e:
        print("ENTRY ERROR:", e)
        return jsonify({"status": "error", "message": str(e)})

# ===============================
# EXIT
# ===============================
@app.route('/exit', methods=['POST'])
def exit_vehicle():
    try:
        vehicle = request.json.get("vehicle")

        conn = get_connection()
        cursor = conn.cursor()

        cursor.callproc("ExitVehicle2", (vehicle,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"status": "success", "message": "Exit Done"})
    except Exception as e:
        print("EXIT ERROR:", e)
        return jsonify({"status": "error", "message": str(e)})

# ===============================
# PAY
# ===============================
@app.route('/pay', methods=['POST'])
def pay():
    try:
        record_id = request.json.get("record_id")

        conn = get_connection()
        cursor = conn.cursor()

        cursor.callproc("ProcessPayment", (record_id,))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"status": "success", "message": "Payment Successful"})
    except Exception as e:
        print("PAY ERROR:", e)
        return jsonify({"status": "error", "message": str(e)})

# ===============================
# GET UNPAID
# ===============================
@app.route('/get-unpaid', methods=['POST'])
def get_unpaid():
    try:
        vehicle = request.json.get("vehicle")

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
        SELECT vehicle_no, owner_name,
               (parking_fee + late_fee) AS total_due
        FROM parking_records
        WHERE payment_status = 'Pending'
        AND exit_time IS NOT NULL
        AND vehicle_no = %s
        """, (vehicle,))

        data = cursor.fetchone()

        cursor.close()
        conn.close()

        if not data:
            return jsonify({"status": "fail", "message": "No unpaid record"})

        return jsonify({"status": "success", "data": data})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# ===============================
# ALL UNPAID
# ===============================
@app.route('/all_unpaid', methods=['GET'])
def all_unpaid():
    try:
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

        return jsonify({"status": "success", "data": data})
    except Exception as e:
        return jsonify({"status": "error"})

# ===============================
# ACTIVE VEHICLES
# ===============================
@app.route('/active', methods=['GET'])
def active():
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM active_vehicles")

        data = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({"status": "success", "data": data})
    except Exception as e:
        return jsonify({"status": "error"})

# ===============================
# GET BILL
# ===============================
@app.route("/get-bill", methods=["POST"])
def get_bill():
    try:
        vehicle = request.json.get("vehicle")

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
            return jsonify({"status": "fail", "message": "No unpaid bill"})

        return jsonify({"status": "success", "data": row})
    except Exception as e:
        return jsonify({"status": "error"})

# ===============================
# REPORT
# ===============================
@app.route('/report', methods=['GET'])
def get_report():
    try:
        date = request.args.get('date')

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
        SELECT vehicle_no, owner_name, entry_time, exit_time,
               parking_fee, late_fee,
               (parking_fee + late_fee) AS total,
               payment_status
        FROM parking_records
        WHERE DATE(entry_time) = %s
        """, (date,))

        data = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify({"status": "success", "data": data})
    except Exception as e:
        print("REPORT ERROR:", e)
        return jsonify({"status": "error"})

# ===============================
# INCOME
# ===============================
@app.route('/income', methods=['GET'])
def income():
    try:
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

        return jsonify({"status": "success", "data": data})
    except Exception as e:
        return jsonify({"status": "error"})

if __name__ == "__main__":
    print("Starting app 🚀")
    app.run(host="0.0.0.0", port=10000)