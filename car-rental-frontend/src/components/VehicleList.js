import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './page_css/VehicleList.css';
import WelcomeBanner from "./WelcomeBanner";


function VehicleList() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();
  console.log(user)
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/vehicles")
      .then(res => setVehicles(res.data))
      .catch(err => console.error("Failed to fetch vehicles:", err));
  }, []);

  function handleLease(v) {
    navigate('/lease', { state: { vehicle: v } });
  }

  return (
    <div className="vehicle-list container py-5">
      {user && <WelcomeBanner user={user} />}
      {!user && <h2 className="text-center mb-4 custom-vehicle-heading">Available Vehicles</h2>}
      <div className="row justify-content-center g-4">
        {vehicles.map((v) => (
          <div key={v.vehicleID} className="col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center">
            <div className="card vehicle-card h-100 shadow-sm">
              <img
                src={`data:image/jpeg;base64,${v.image}`}
                alt={`${v.make} ${v.model}`}
                className="card-img-top vehicle-img"
              />
              <div className="card-body">
                <h5 className="card-title text-capitalize">{v.make} {v.model}</h5>
                <p className="card-text mb-1"><strong>Year:</strong> {v.releaseYear}</p>
                <p className="card-text mb-1"><strong>Rate:</strong> ₹{v.dailyRate}/day</p>
                <p className="card-text mb-1"><strong>Status:</strong> {v.vehicleStatus}</p>
                <p className="card-text mb-1"><strong>Capacity:</strong> {v.passengerCapacity} passengers</p>
                <p className="card-text"><strong>Engine:</strong> {v.engineCapacity} Turbo</p>
              </div>
              <div className="card-footer bg-transparent text-center">
                <div className="actions">
                  {v.vehicleStatus === 'available' ? (
                    <button className="lease-btn action-button" onClick={() => handleLease(v)}>
                      Lease Now
                    </button>
                  ) : (
                    <button className="sold-btn action-button" disabled>
                      Sold Out
                    </button>
                  )}
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VehicleList;
