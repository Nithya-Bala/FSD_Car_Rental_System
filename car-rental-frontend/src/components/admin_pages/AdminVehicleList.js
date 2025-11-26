import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../page_css/VehicleList.css'
import axios from "axios";

function AdminVehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  // Fetch all vehicles
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/vehicles")
      .then(res => setVehicles(res.data))
      .catch(err => console.error("Failed to fetch vehicles:", err));
  }, []);

  // Delete vehicle
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this vehicle?");
    if (!confirm) return;

    try {
      await axios.delete(`http://127.0.0.1:5000/vehicles/${id}`);
      setVehicles(prev => prev.filter(v => v.vehicleID !== id));
      alert("Vehicle deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Redirect to edit page
  const handleEdit = (vehicle) => {
    navigate("/admin/upload", { state: { vehicle } });  // vehicle passed as state
  };

  return (
    <div className="vehicle-list container py-5">
      <h2 className="text-center mb-4 custom-vehicle-heading">Manage Vehicles</h2>
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
                <h3 className="card-title text-capitalize">{v.make} {v.model}</h3>
                <p className="card-text mb-1">Year: {v.releaseYear}</p>
                <p className="card-text mb-1">Rate: ₹{v.dailyRate}/day</p>
                <p className="card-text mb-1">Status: {v.vehicleStatus}</p>
                <p className="card-text mb-1">Capacity: {v.passengerCapacity} passengers</p>
                <p className="card-text">Engine: {v.engineCapacity} Turbo</p>

              </div>
              
              <div className="card-footer bg-transparent text-center" >
                <div className="actions">
                <button onClick={() => handleEdit(v)} className="edit-btn admin-button">Edit</button>
                <button onClick={() => handleDelete(v.vehicleID)} className="delete-btn admin-button">Delete</button>
              </div>
              </div>
                

            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminVehicleList;
