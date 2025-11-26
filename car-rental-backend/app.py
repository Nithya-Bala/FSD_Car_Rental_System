from flask import Flask,jsonify,request
from flask_mysqldb import MySQL
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import base64
import config
from flask import Flask, request, send_file, jsonify
from fpdf import FPDF
import os

app=Flask(__name__)
CORS(app)

app.config['MYSQL_HOST']=config.Host
app.config['MYSQL_USER']=config.User
app.config['MYSQL_PASSWORD']=config.Password
app.config['MYSQL_DB']=config.DataBase

mysql=MySQL(app)
bcrypt=Bcrypt(app)

@app.route("/register",methods=["POST"])
def register():
    data=request.json
    name=data['name']
    email=data['email']
    phone=data['phoneNumber']
    password = bcrypt.generate_password_hash(data['password']).decode('utf-8')


    cur=mysql.connection.cursor()

    cur.execute("SELECT * FROM Customer WHERE email=%s", (email,))
    existing = cur.fetchone()
    if existing:
        return jsonify({'message': 'Email already registered',}), 400
    
    query="INSERT into Customer(name,email,phone,password) VALUES(%s,%s,%s,%s)"
    cur.execute(query,(name,email,phone,password))
    mysql.connection.commit()
    
    cur.execute("SELECT * FROM Customer WHERE email=%s", (email,))
    user = cur.fetchone()
    cur.close()

    return jsonify({'message': 'Register successful', 'user': {
            'id': user[0], 'name': user[1], 'email': user[2], 'phoneNumber': user[3],"role":"customer"
        }})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    if email=="admin@carrental.com" and password=="admin123":
        return jsonify({"message": "Admin login successful" ,"user": {"role":"admin"}})
    
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM Customer WHERE email=%s", (email,))
    user = cur.fetchone()
    cur.close()

    if user and bcrypt.check_password_hash(user[4], password):
        return jsonify({'message': 'Login successful', 'user': {
            'id': user[0], 'name': user[1], 'email': user[2], 'phoneNumber': user[3],"role":"customer"
        }})
    else:
        return jsonify({'message': 'Invalid credentials'}), 401
    
@app.route('/update_customer', methods=["PATCH"])
def update_customer():
    data = request.json
    name = data['name']
    email = data['email']  # used as identifier
    phone = data['phoneNumber']
    # password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    cur = mysql.connection.cursor()

    query = """
        UPDATE Customer
        SET name=%s, phone=%s
        WHERE email=%s
    """
    cur.execute(query, (name, phone, email))
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': f"{name}'s details updated successfully"})

@app.route('/vehicle',methods=['POST'])
def Add_vehicle():
    make = request.form['make']
    model = request.form['model']
    releaseyear = request.form['releaseYear']
    dailyrate = request.form['dailyRate']
    vehicleStatus = request.form['vehicleStatus']
    passengerCapacity = request.form['passengerCapacity']
    engineCapacity = request.form['engineCapacity']
    image = request.files['image'].read()

    cur=mysql.connection.cursor()

    query = """
        INSERT INTO VEHICLES (
            make, model, releaseyear, dailyRate,
            vehicleStatus, passengerCapacity,
            engineCapacity, image
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    values=(make, model, releaseyear, dailyrate,
        vehicleStatus, passengerCapacity,
        engineCapacity, image)
    
    cur.execute(query,values)
    mysql.connection.commit()
    cur.close()

    return jsonify({"message":"Vehicle Added Successfuly"})

@app.route('/vehicle/<int:vehicle_id>', methods=['PUT'])
def update_vehicle(vehicle_id):
    try:
        make = request.form['make']
        model = request.form['model']
        releaseYear = request.form['releaseYear']
        dailyRate = request.form['dailyRate']
        vehicleStatus = request.form['vehicleStatus']
        passengerCapacity = request.form['passengerCapacity']
        engineCapacity = request.form['engineCapacity']

        cur = mysql.connection.cursor()

        if 'image' in request.files and request.files['image']:
            image = request.files['image'].read()
            query = """UPDATE vehicles 
                       SET make=%s, model=%s, releaseYear=%s, dailyRate=%s, 
                           vehicleStatus=%s, passengerCapacity=%s, engineCapacity=%s, image=%s 
                       WHERE vehicleID=%s"""
            cur.execute(query, (make, model, releaseYear, dailyRate, vehicleStatus,
                                passengerCapacity, engineCapacity, image, vehicle_id))
        else:
            query = """UPDATE vehicles 
                       SET make=%s, model=%s, releaseYear=%s, dailyRate=%s, 
                           vehicleStatus=%s, passengerCapacity=%s, engineCapacity=%s 
                       WHERE vehicleID=%s"""
            cur.execute(query, (make, model, releaseYear, dailyRate, vehicleStatus,
                                passengerCapacity, engineCapacity, vehicle_id))

        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Vehicle updated successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/vehicles',methods=['GET'])
def get_vehicles():
    cur = mysql.connection.cursor()
    cur.execute("SELECT vehicleID, make, model, releaseyear, dailyRate, vehicleStatus, passengerCapacity, engineCapacity, image FROM vehicles")
    vehicles = cur.fetchall()
    cur.close()

    vehicle_list = []
    for v in vehicles:
        vehicle_dict = {
            "vehicleID": v[0],
            "make": v[1],
            "model": v[2],
            "releaseYear": v[3],
            "dailyRate": v[4],
            "vehicleStatus": v[5],
            "passengerCapacity": v[6],
            "engineCapacity": v[7],
            "image": base64.b64encode(v[8]).decode("utf-8")  # Convert binary to base64 string
        }
        vehicle_list.append(vehicle_dict)

    return jsonify(vehicle_list)

@app.route('/vehicles/<int:vehicleID>', methods=['DELETE'])
def delete_vehicle(vehicleID):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM vehicles WHERE vehicleID = %s", (vehicleID,))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Vehicle deleted successfully"})

@app.route('/lease/return/<int:lease_id>', methods=['POST'])
def return_vehicle(lease_id):
    print("hello")
    try:
        cursor = mysql.connection.cursor()
        print(f"Returning vehicle for lease ID: {lease_id}")
        # Get the vehicleID for the given leaseID
        cursor.execute("SELECT vehicleID FROM lease WHERE leaseID = %s", (lease_id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "Lease not found"}), 404

        vehicle_id = result[0]
        print("vehicle",vehicle_id)

        #update lease returned ==true
        cursor.execute("UPDATE lease SET returned = TRUE WHERE leaseID = %s", (lease_id,))

        
        # Update vehicle status to 'Available'
        cursor.execute("UPDATE vehicles SET vehicleStatus = 'available' WHERE vehicleID = %s", (vehicle_id,))

        mysql.connection.commit()
        cursor.close()

        return jsonify({"message": "Vehicle returned and status updated to Available"}), 200

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500

@app.route('/api/lease', methods=['POST'])
def create_lease():
    data = request.get_json()
    customerID = data.get("customerID")
    vehicleID = data.get("vehicleID")                        
    startDate = data.get("startDate")
    endDate = data.get("endDate") 
    leaseType = data.get("leaseType")  
    duration=data.get("selectedDuration")
    totalAmount= data.get("estimatedPrice")

    cur=mysql.connection.cursor()

    try:
        cur.execute("SELECT vehicleStatus from vehicles where vehicleID=  %s",(vehicleID,))
        result=cur.fetchone()

        if not result:
            return jsonify({"error":"Vehicle not found"}),404
        if result[0]!='available':
            return jsonify({"error": "Vehicle is not available for lease"}), 400
        #Insert lease
        query="""
            INSERT INTO LEASE (customerID, vehicleID, startdate, enddate, leaseType,duration,totalAmount)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        data=(customerID, vehicleID, startDate, endDate, leaseType,duration,totalAmount)
        cur.execute(query,data)
        
        #update vehicle status available to sold out
        cur.execute("UPDATE vehicles SET vehicleStatus= 'notAvailable' WHERE vehicleID=%s",(vehicleID,))
        mysql.connection.commit()
        cur.close()

        return jsonify({"message": "Lease successfully created."}), 201

    except Exception as e:
        mysql.connection.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cur.close()

@app.route('/admin/leases/history',methods=['GET']) 
def all_leases():
    cursor=mysql.connection.cursor()

    #Picked vehicles
    cursor.execute("select * from lease WHERE returned = FALSE") 
    picked = cursor.fetchall()
    picked_leases = []
    for lease in picked:
        picked_leases.append({
            'leaseID': lease[0],
            'customerID':lease[1],
            'vehicleID': lease[2],
            'startdate': lease[3].strftime('%Y-%m-%d'),
            'enddate': lease[4].strftime('%Y-%m-%d'),
            'leaseType': lease[5],
            'duration': lease[6],
            'totalAmount':lease[7]
        })
    #Returned leases
    cursor.execute("select * from lease WHERE returned = TRUE")
    returned=cursor.fetchall()

    returned_leases=[]
    for lease in returned:
        returned_leases.append({
            'leaseID': lease[0],
            'customerID' :lease[1],
            'vehicleID': lease[2],
            'startdate': lease[3].strftime('%Y-%m-%d'),
            'enddate': lease[4].strftime('%Y-%m-%d'),
            'leaseType': lease[5],
            'duration': lease[6],
            'totalAmount':lease[7]
        })
    return jsonify({
        "picked":picked_leases,
        'returned':returned_leases
    })

@app.route('/api/lease/history/<int:customer_id>', methods=['GET']) 
def lease_history(customer_id):
    cursor = mysql.connection.cursor()

    # Picked leases (not returned) with vehicle info
    cursor.execute("""
        SELECT l.leaseID, l.vehicleID, l.startdate, l.enddate, l.leaseType, l.duration, l.totalAmount,
               v.image, v.make, v.model
        FROM lease l
        JOIN vehicles v ON l.vehicleID = v.vehicleID
        WHERE l.customerID = %s AND l.returned = FALSE
    """, (customer_id,))
    picked = cursor.fetchall()

    # Returned leases with vehicle info
    cursor.execute("""
        SELECT l.leaseID, l.vehicleID, l.startdate, l.enddate, l.leaseType, l.duration, l.totalAmount,
               v.image, v.make, v.model
        FROM lease l
        JOIN vehicles v ON l.vehicleID = v.vehicleID
        WHERE l.customerID = %s AND l.returned = TRUE
    """, (customer_id,))
    returned = cursor.fetchall()

    picked_li = []
    for lease in picked:
        picked_li.append({
            'leaseID': lease[0],
            'vehicleID': lease[1],
            'startdate': lease[2].strftime('%Y-%m-%d'),
            'enddate': lease[3].strftime('%Y-%m-%d'),
            'leaseType': lease[4],
            'duration': lease[5],
            'totalAmount': lease[6],
            'vehicleImage': base64.b64encode(lease[7]).decode("utf-8"),
            'make': lease[8],
            'model': lease[9]
        })

    returned_li = []
    for lease in returned:
        returned_li.append({
            'leaseID': lease[0],
            'vehicleID': lease[1],
            'startdate': lease[2].strftime('%Y-%m-%d'),
            'enddate': lease[3].strftime('%Y-%m-%d'),
            'leaseType': lease[4],
            'duration': lease[5],
            'totalAmount': lease[6],
            'vehicleImage': base64.b64encode(lease[7]).decode("utf-8"),
            'make': lease[8],
            'model': lease[9]
        })

    return jsonify({
        "picked": picked_li,
        "returned": returned_li
    })

@app.route('/download-invoice', methods=['POST'])
def download_invoice():
    lease_id = request.json.get('lease_id')
    

    cursor = mysql.connection.cursor()

    # Fetch lease + customer + vehicle info
    query = """
        SELECT l.leaseID, l.startdate, l.enddate, l.returned,
               c.name AS customer_name, c.email,
                v.model, v.make
        FROM lease l
        JOIN customer c ON l.customerID = c.id
        JOIN vehicles v ON l.vehicleID = v.vehicleID
        WHERE l.leaseID = %s
    """
    cursor.execute(query, (lease_id,))
    result = cursor.fetchone()
    
    if not result:
        return jsonify({"error": "Lease not found"}), 404

    lease_id, lease_date, return_date, status, customer_name, email, model, brand = result
    status_text = "Returned" if status == 1 else "Not Returned"

    # Generate PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=14)
    pdf.cell(200, 10, txt="Vehicle Lease Invoice", ln=True, align='C')
    pdf.ln(10)

    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"Lease ID: {lease_id}", ln=True)
    pdf.cell(200, 10, txt=f"Customer: {customer_name} ({email})", ln=True)
    pdf.cell(200, 10, txt=f"Vehicle: {brand} {model} ", ln=True)
    pdf.cell(200, 10, txt=f"Lease Date: {lease_date}", ln=True)
    pdf.cell(200, 10, txt=f"Return Date: {return_date}", ln=True)
    pdf.cell(200, 10, txt=f"Status: {status_text}", ln=True)

    os.makedirs("invoices", exist_ok=True)
    filepath = f"invoices/invoice_{lease_id}.pdf"
    pdf.output(filepath)

    return send_file(filepath, as_attachment=True)

if __name__=="__main__":
    app.run(debug=True)