# DriveMate – Car Rental Management System


A modern full-stack vehicle rental application developed using Flask (Python), MySQL, and React.js, designed to simplify renting and managing vehicles for both customers and administrators.


## Features

### Customer Features

* Register & secure login
* Browse available vehicles
* Select daily or weekly leasing
* Auto-calculated pricing based on duration
* View active and returned lease history
* Download PDF invoice for every lease
* Profile editing (name & phone number)

###  Admin Features

* Upload & manage vehicles (CRUD)
* Update vehicle status automatically when leased/returned
* View all active and returned leases of customers
* Edit vehicle information
* Delete vehicles from inventory



##  Tech Stack

###  Frontend

* React.js — Component-based UI
* Bootstrap + Custom CSS — Responsive and elegant UI
* Axios — API communication
* React Router — Navigation

### Backend

* Flask (Python) — REST API
* MySQL — Relational Database
* Flask-Bcrypt — Password hashing
* Flask-CORS — Cross-origin access handling
* FPDF — Auto-generated invoices (PDF)
* Base64 — Image encoding for frontend delivery



##  Project Structure


FSD/
├── car-rental-backend/
│   ├── app.py
│   ├── config.py
│   ├── invoices/
│   ├── venv/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── page_css/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md


```
mern-ecommerce-2024/
├── server/
│   ├── controllers/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── common/
│   │   └── shop/
│   ├── models/
│   ├── routes/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── common/
│   │   └── shop/
│   ├── helpers/
│   ├── .env
│   ├── server.js
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin-view/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── shopping-view/
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   ├── admin-view/
│   │   │   ├── auth/
│   │   │   └── shopping-view/
│   │   ├── store/
│   │   │   ├── admin/
│   │   │   ├── auth-slice/
│   │   │   ├── common-slice/
│   │   │   └── shop/
│   │   ├── config/
│   │   └── lib/
│   ├── package.json
│   └── vite.config.js
└── README.md
```


##  Installation & Setup

### Prerequisites

* Python 3.10+
* Node.js 16+
* MySQL Server



###  Backend Setup (Flask + MySQL)

1. Navigate to backend folder

    cd car-rental-backend
    

2. Install dependencies

pip install -r requirements.txt


3️. Configure database in `config.py`


Host = "localhost"
User = "root"
Password = "your_password"
DataBase = "CarRentalManagement"


4️. Create necessary tables in MySQL (Customer / Vehicles / Lease)

5️.Run backend server

python app.py


Backend runs at:
 [http://127.0.0.1:5000](http://127.0.0.1:5000)


### Frontend Setup (React)

1️. Navigate to frontend folder


cd frontend


2️. Install dependencies

npm install


3️. Start React app

npm start


Frontend runs at:
 [http://localhost:3000](http://localhost:3000)



##  REST API Endpoints Overview

###  Authentication

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | `/register`        | Register a new customer |
| POST   | `/login`           | Customer/Admin login    |
| PATCH  | `/update_customer` | Update profile          |

###  Vehicle Management

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| POST   | `/vehicle`       | Add a new vehicle  |
| PUT    | `/vehicle/<id>`  | Edit vehicle       |
| DELETE | `/vehicles/<id>` | Delete vehicle     |
| GET    | `/vehicles`      | Fetch all vehicles |

###  Leasing

| Method | Endpoint                  | Description                |
| ------ | ------------------------- | -------------------------- |
| POST   | `/api/lease`              | Create lease               |
| POST   | `/lease/return/<id>`      | Return vehicle             |
| GET    | `/admin/leases/history`   | Lease records for admin    |
| GET    | `/api/lease/history/<id>` | Lease history for customer |

###  Invoice

| Method | Endpoint            | Description          |
| ------ | ------------------- | -------------------- |
| POST   | `/download-invoice` | Download PDF invoice |



##  Deployment

### Backend Deployment

1. Configure MySQL database on production
2. Install required Python dependencies
3. Run Flask using production WSGI server:

   * Railway / Render / PythonAnywhere / AWS / DigitalOcean
4. Update CORS origin to deployed frontend URL

### Frontend Deployment

1. Build React project:


npm run build


2. Deploy `/build` folder to:

   * Vercel
   * Netlify
   * GitHub Pages
   * AWS S3 hosting

3. Update API base URL from `localhost` → production backend URL



##  Contributing

1. Fork the repository
2. Create your feature branch

    git checkout -b feature/new-feature


3. Develop & test changes
4. Submit a pull request 


