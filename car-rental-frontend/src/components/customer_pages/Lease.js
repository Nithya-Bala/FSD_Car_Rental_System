import React, { useState, useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import axios from "axios";
import '../page_css/form.css'

// const LeaseForm = () => {
//   const location = useLocation();
//   const vehicle = location.state?.vehicle;
//   const navigate=useNavigate()
//   console.log(vehicle) // vehicle object from previous page
//   const user = JSON.parse(localStorage.getItem("user")); // Or use context/auth

//   const [leaseType, setLeaseType] = useState("dailyLease");
//   const [durationOptions, setDurationOptions] = useState([]);
//   const [selectedDuration, setSelectedDuration] = useState(1);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [estimatedPrice, setEstimatedPrice] = useState(vehicle.dailyRate);

//   // Update duration options when leaseType changes
//   useEffect(() => {
//     if (leaseType === "dailyLease") {
//       setDurationOptions(Array.from({ length: 30 }, (_, i) => i + 1));
//       setSelectedDuration(1);
//     } else {
//       setDurationOptions([7, 14, 21, 28]);
//       setSelectedDuration(7);
//     }
//   }, [leaseType]);

//   // Auto-calculate end date and price when startDate or selectedDuration changes
//   useEffect(() => {
//     if (!startDate) return;
//     const start = new Date(startDate);
//     const durationDays = selectedDuration;
//     const end = new Date(start);
//     end.setDate(start.getDate() + durationDays);
//     setEndDate(end.toISOString().split("T")[0]);

//     if (vehicle) {
//       const pricePerDay =
//         leaseType === "dailyLease"
//           ? vehicle.dailyRate
//           : ((vehicle.dailyRate*7)-((vehicle.dailyRate* 7)*(10/100)))/7; // adjust weekly rate to daily rate
//       setEstimatedPrice(pricePerDay * durationDays);
//     }
//   }, [startDate, selectedDuration, leaseType, vehicle]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!vehicle || !user) {
//       alert("Missing vehicle or customer ID.");
//       return;
//     }

//     const leaseData = {
//       customerID: user.id,
//       vehicleID: vehicle.vehicleID,
//       startDate,
//       endDate,
//       leaseType,
//       selectedDuration,
//       estimatedPrice,
//     };

//     try {
//       const res = await axios.post("http://localhost:5000/api/lease", leaseData);
//       alert("Lease submitted successfully!");
//       console.log(res.data);
//       navigate('/history')
//     } catch (err) {
//     console.error(err.response?.data || err.message);
//     alert(err.response?.data?.message || "Lease failed");
//     }

//   };

//   return (
//     <div className="form-container d-flex align-items-center justify-content-center py-5">
//       <div className="card form-card upload-vehicle-card shadow-lg">
//         <div className="card-body" >
//             <h2 className="text-center mb-4 mt-3">Lease Vehicle- {vehicle?.make} {vehicle?.model}</h2>
        
//             <form onSubmit={handleSubmit}>
//               <div className="mb-3">
//                 <label>Lease Type</label>
//                 <select className='form-select' value={leaseType} onChange={(e) => setLeaseType(e.target.value)}>
//                   <option value="dailyLease">Daily</option>
//                   <option value="weeklyLease">Weekly(10% discount)</option>
//                 </select>
//               </div>

//               <div className="mb-3">
//                 <label>Duration ({leaseType === "dailyLease" ? "days" : "weeks"})</label>
//                 <select className='form-select'
//                   value={selectedDuration}
//                   onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
//                 >
//                   {durationOptions.map((d) => (
//                     <option key={d} value={d}>
//                       {leaseType === "weeklyLease" ? `${d / 7} week(s)` : `${d} day(s)`}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="mb-3">
//                <label>Start Date </label>
//                 <input className='form-control'
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   required
//                 />
//               </div>

//               <div className="mb-3">
//                <p><strong>End Date:</strong> {endDate || "N/A"}</p>
//               </div>
//               <div className="mb-3">
//                 <p><strong>Estimated Price:</strong> ₹{estimatedPrice}</p>
//               </div>
//               <button type="submit" className="btn btn-primary w-100">Confirm Lease</button>
//             </form>

//         </div>
//       </div>
//     </div>

    
//   );
// };

// export default LeaseForm;


// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import '../page_css/form.css'

const LeaseForm = () => {
  const location = useLocation();
  const vehicle = location.state?.vehicle;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [leaseType, setLeaseType] = useState("dailyLease");
  const [durationOptions, setDurationOptions] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState(vehicle.dailyRate);

  // ⬅️ Today's date in YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  // Update duration options when lease type changes
  useEffect(() => {
    if (leaseType === "dailyLease") {
      setDurationOptions(Array.from({ length: 30 }, (_, i) => i + 1));
      setSelectedDuration(1);
    } else {
      setDurationOptions([7, 14, 21, 28]);
      setSelectedDuration(7);
    }
  }, [leaseType]);

  // Auto-calc end date + price
  useEffect(() => {
    if (!startDate) return;

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + selectedDuration);

    setEndDate(end.toISOString().split("T")[0]);

    if (vehicle) {
      const pricePerDay =
        leaseType === "dailyLease"
          ? vehicle.dailyRate
          : ((vehicle.dailyRate * 7) - (vehicle.dailyRate * 7 * 0.10)) / 7;

      setEstimatedPrice(pricePerDay * selectedDuration);
    }
  }, [startDate, selectedDuration, leaseType, vehicle]);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const leaseData = {
      customerID: user.id,
      vehicleID: vehicle.vehicleID,
      startDate,
      endDate,
      leaseType,
      selectedDuration,
      estimatedPrice,
    };

    try {
      await axios.post("http://localhost:5000/api/lease", leaseData);
      alert("Lease submitted successfully!");
      navigate('/history');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Lease failed");
    }
  };

  return (
    <div className="form-container d-flex align-items-center justify-content-center py-5">
      <div className="card form-card upload-vehicle-card shadow-lg">
        <div className="card-body">
          <h2 className="text-center mb-4 mt-3">
            Lease Vehicle - {vehicle?.make} {vehicle?.model}
          </h2>

          <form onSubmit={handleSubmit}>

            {/* Lease Type */}
            <div className="mb-3">
              <label>Lease Type</label>
              <select className="form-select"
                value={leaseType}
                onChange={(e) => setLeaseType(e.target.value)}
              >
                <option value="dailyLease">Daily</option>
                <option value="weeklyLease">Weekly (10% discount)</option>
              </select>
            </div>

            {/* Duration */}
            <div className="mb-3">
              <label>Duration ({leaseType === "dailyLease" ? "days" : "weeks"})</label>
              <select className="form-select"
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
              >
                {durationOptions.map((d) => (
                  <option key={d} value={d}>
                    {leaseType === "weeklyLease" ? `${d / 7} week(s)` : `${d} day(s)`}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="mb-3">
              <label>Start Date</label>
              <input 
                type="date"
                className="form-control"
                value={startDate}
                min={today}  // ⬅️ IMPORTANT: prevents past dates
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            {/* End Date */}
            <div className="mb-3">
              <p><strong>End Date:</strong> {endDate || "N/A"}</p>
            </div>

            {/* Price */}
            <div className="mb-3">
              <p><strong>Estimated Price:</strong> ₹{estimatedPrice}</p>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Confirm Lease
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaseForm;
