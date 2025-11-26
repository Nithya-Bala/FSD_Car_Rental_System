import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap icons
import './page_css/Navbar.css'; // Custom styles for hover and profile image

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("user");
    navigate('/');
  }

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{
        background: "linear-gradient(to right, #4b6cb7, #182848)",
        padding: "10px 20px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-3 text-warning" to="/">
          🚗 DriveMate Rentals
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">

            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link custom-hover" to="/">Home</Link>
                </li>
                {/* <li className="nav-item">
                  <Link className="nav-link custom-hover" to="/register">Register</Link>
                </li> */}
                <li className="nav-item">
                  <Link className="nav-link custom-hover" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link custom-hover" to="/contact">Contact Us</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link custom-hover" to="/about">About Us</Link>
                </li>
              </>
            )}

            {user?.role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link custom-hover" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link custom-hover" to="/admin/manage">Manage Vehicles</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link custom-hover" to="/admin/upload">Upload Vehicle</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link custom-hover" to="/admin/leases">Customer Leases</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-warning ms-2" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}

            {user?.role === "customer" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link custom-hover" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link custom-hover" to="/profile">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                      alt="Profile"
                      className="rounded-circle profile-icon"
                    />
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link custom-hover" to="/history">History</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link custom-hover" to="/contact">Contact Us</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link custom-hover" to="/about">About Us</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-warning ms-2" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
