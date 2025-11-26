// import { useEffect,useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";

// function UploadVehicle(){
//   const location = useLocation();
//   const navigate = useNavigate();
//   const editVehicle = location.state?.vehicle;

//   const [vehicleData, setVehicleData] = useState({
//     make: "",
//     model: "",
//     releaseYear: "",
//     dailyRate: "",
//     vehicleStatus: "available", // default option
//     passengerCapacity: "",
//     engineCapacity: "",
//     image: null,
//   });

//   useEffect(() => {
//     if (editVehicle) {
//       setVehicleData({
//         ...editVehicle,
//         image: null, // Can't prefill the image
//       });
//     }
//   }, [editVehicle]);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setVehicleData((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   function handleClean(){
//     setVehicleData({
//     make: "",
//     model: "",
//     releaseYear: "",
//     dailyRate: "",
//     vehicleStatus: "available", 
//     passengerCapacity: "",
//     engineCapacity: "",
//     image: null,
//   })

//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const form = new FormData();
//     for (const key in vehicleData) {
//       form.append(key, vehicleData[key]);
//     }

//     try {
//       if (editVehicle) {
//         // Update mode
//         const res = await axios.put(`http://127.0.0.1:5000/vehicle/${editVehicle.vehicleID}`, form);
//         alert(res.data.message);
//       } else {
//         // Upload mode
//         const res = await axios.post("http://127.0.0.1:5000/vehicle", form);
//         alert(res.data.message);
//       }

//       handleClean();
//       navigate('/admin/manage');
//     } catch (error) {
//       console.error("Upload error:", error);
//       alert("Failed to upload/update vehicle");
//     }
//   };

//   function handleCancel(){
//     handleClean();
//     navigate('/admin/manage');
//   }

//   return (
//     <div className="form-container uploadvehicle-container d-flex align-items-center justify-content-center  py-5">
//       <div className="card form-card upload-vehicle-card   shadow-lg">
//         <div className="card-body">
//           <h2 className="text-center mb-4">{editVehicle? "Edit Vehicle" : "Upload Vehicle" }</h2>

//           <form onSubmit={handleSubmit} encType="multipart/form-data" >
//             <div className="mb-3">
//               <input type="text" name="make" value={vehicleData.make} placeholder="Make" onChange={handleChange} className="form-control" required />
//             </div>
//             <div className="mb-3">
//               <input type="text" name="model" value={vehicleData.model} placeholder="Model" onChange={handleChange} className="form-control"  required />
//             </div>
//             <div className="mb-3">
//              <input type="text" name="releaseYear" value={vehicleData.releaseYear} placeholder="Release Year" onChange={handleChange} className="form-control" required />
//             </div>
//             <div className="mb-3">
//              <input type="number" name="dailyRate" value={vehicleData.dailyRate} placeholder="Daily Rate" min={1500} step={100} onChange={handleChange} className="form-control" required />
//             </div>
//             <div className="mb-3">
//              <select name="vehicleStatus" onChange={handleChange} className="form-control" required>
//               <option value="available">Available</option>
//               <option value="notAvailable">Not Available</option>
//             </select>
//             </div>
//             <div className="mb-3">
//              <input type="number" name="passengerCapacity" value={vehicleData.passengerCapacity} min={1} max={8} placeholder="Passenger Capacity" onChange={handleChange} className="form-control" required />
//             </div>
//             <div className="mb-3">
//              <input type="text" name="engineCapacity" value={vehicleData.engineCapacity} placeholder="Engine Capacity" onChange={handleChange} className="form-control" required />
//             </div>
//             <div className="mb-3">
//                <input type="file" name="image" accept="image/*" onChange={handleChange} required />
//             </div>
            
//             {
//               editVehicle ?
//               <div className="profile-btn d-flex gap-3 mt-2">
//                 <button type="submit" className="btn btn-submit">Update</button>
//                 <button className="btn btn-cancel" onClick={handleCancel} >Cancel</button>
//               </div> :
//               <div>
//                 <button className="btn btn-primary" type="submit">Upload</button>
//               </div>
//             }
//           </form>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default UploadVehicle;


import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function UploadVehicle(){
  const location = useLocation();
  const navigate = useNavigate();
  const editVehicle = location.state?.vehicle;

  const [vehicleData, setVehicleData] = useState({
    make: "",
    model: "",
    releaseYear: "",
    dailyRate: "",
    vehicleStatus: "available",
    passengerCapacity: "",
    engineCapacity: "",
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editVehicle) {
      setVehicleData({
        make: editVehicle.make || "",
        model: editVehicle.model || "",
        releaseYear: editVehicle.releaseYear || "",
        dailyRate: editVehicle.dailyRate || "",
        vehicleStatus: editVehicle.vehicleStatus || "available",
        passengerCapacity: editVehicle.passengerCapacity || "",
        engineCapacity: editVehicle.engineCapacity || "",
        image: null, // Can't prefill the image
      });
      setErrors({});
    }
  }, [editVehicle]);

  // Validation helpers
  const validators = {
    make: (val) => {
      if (!val) return "Make is required";
      if (!/^[A-Za-z\s]+$/.test(val)) return "Make should contain only letters and spaces";
      return "";
    },
    model: (val) => {
      if (!val) return "Model is required";
      if (!/^[A-Za-z0-9\s-]+$/.test(val)) return "Model can contain letters, numbers, spaces and hyphens";
      return "";
    },
    releaseYear: (val) => {
      if (!val) return "Release Year is required";
      if (!/^\d{4}$/.test(val)) return "Enter a valid 4-digit year";
      const y = parseInt(val, 10);
      const current = new Date().getFullYear();
      if (y < 1900 || y > current) return `Year must be between 1900 and ${current}`;
      return "";
    },

    dailyRate: (val) => {
      if (val === "" || val === null) return "Daily rate is required";
      const n = Number(val);
      if (Number.isNaN(n)) return "Daily rate must be a number";
      if (n < 1500) return "Daily rate must be at least ₹1500";
      return "";
    },
    vehicleStatus: (val) => {
      if (!["available","notAvailable"].includes(val)) return "Invalid status";
      return "";
    },
    passengerCapacity: (val) => {
      if (val === "" || val === null) return "Passenger capacity is required";
      const n = parseInt(val, 10);
      if (Number.isNaN(n) || n < 1 || n > 8) return "Enter a capacity between 1 and 8";
      return "";
    },
    engineCapacity: (val) => {
      if (!val) return "Engine capacity is required";
      // Accept formats like "1.6L", "1600cc", "2.0", "2000"
      if (!/^[A-Za-z0-9.\s-]+$/.test(val)) return "Engine capacity contains invalid characters";
      return "";
    },
    image: (file) => {
      // when editing, image may be null (optional)
      if (!file) {
        if (editVehicle) return ""; // optional in edit mode
        return "Image is required";
      }
      const allowed = ["image/jpeg", "image/png"];
      if (!allowed.includes(file.type)) return "Only JPG/PNG images allowed";
      const maxBytes = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxBytes) return "Image must be under 5 MB";
      return "";
    },
  };

  const validateField = (name, value) => {
    const validator = validators[name];
    if (!validator) return "";
    return validator(value);
  };

  const validateAll = () => {
    const newErrors = {};
    for (const key of Object.keys(validators)) {
      const val = vehicleData[key];
      const err = validateField(key, val);
      if (err) newErrors[key] = err;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    const payload = files ? files[0] : value;
    setVehicleData((prev) => ({
      ...prev,
      [name]: payload,
    }));

    // immediate validation for the changed field
    const err = validateField(name, payload);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  function handleClean(){
    setVehicleData({
      make: "",
      model: "",
      releaseYear: "",
      dailyRate: "",
      vehicleStatus: "available",
      passengerCapacity: "",
      engineCapacity: "",
      image: null,
    });
    setErrors({});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    const form = new FormData();
    // Append only necessary keys
    form.append("make", vehicleData.make);
    form.append("model", vehicleData.model);
    form.append("releaseYear", vehicleData.releaseYear);
    form.append("dailyRate", vehicleData.dailyRate);
    form.append("vehicleStatus", vehicleData.vehicleStatus);
    form.append("passengerCapacity", vehicleData.passengerCapacity);
    form.append("engineCapacity", vehicleData.engineCapacity);
    if (vehicleData.image) form.append("image", vehicleData.image);

    try {
      if (editVehicle) {
        // Update mode
        const res = await axios.put(
          `http://127.0.0.1:5000/vehicle/${editVehicle.vehicleID}`,
          form,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert(res.data.message);
      } else {
        // Upload mode
        const res = await axios.post("http://127.0.0.1:5000/vehicle", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert(res.data.message);
      }

      handleClean();
      navigate('/admin/manage');
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.message || "Failed to upload/update vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  function handleCancel(e){
    e.preventDefault();
    handleClean();
    navigate('/admin/manage');
  }

  return (
    <div className="form-container uploadvehicle-container d-flex align-items-center justify-content-center py-5">
      <div className="card form-card upload-vehicle-card shadow-lg" style={{ width: "100%", maxWidth: 720 }}>
        <div className="card-body">
          <h2 className="text-center mb-4">{editVehicle ? "Edit Vehicle" : "Upload Vehicle" }</h2>

          <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
            <div className="mb-3">
              <label className="form-label">Make</label>
              <input
                type="text"
                name="make"
                value={vehicleData.make}
                placeholder="Make"
                onChange={handleChange}
                className={`form-control ${errors.make ? "is-invalid" : ""}`}
                required
              />
              {errors.make && <div className="invalid-feedback">{errors.make}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Model</label>
              <input
                type="text"
                name="model"
                value={vehicleData.model}
                placeholder="Model"
                onChange={handleChange}
                className={`form-control ${errors.model ? "is-invalid" : ""}`}
                required
              />
              {errors.model && <div className="invalid-feedback">{errors.model}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Release Year</label>
              <input
                type="text"                      // changed from number → text
                name="releaseYear"
                value={vehicleData.releaseYear}
                placeholder="e.g. 2022"
                onChange={(e) => {
                  const v = e.target.value;

                  // Allow ONLY digits (0–9)
                  if (/^\d*$/.test(v)) {
                    handleChange(e);             // existing logic
                  }
                }}
                className={`form-control ${errors.releaseYear ? "is-invalid" : ""}`}
                required
              />
              {errors.releaseYear && (
                <div className="invalid-feedback">{errors.releaseYear}</div>
              )}
            </div>


            <div className="mb-3">
              <label className="form-label">Daily Rate (₹)</label>
              <input
                type="number"
                name="dailyRate"
                value={vehicleData.dailyRate}
                placeholder="1500"
                min={1500}
                step={50}
                onChange={handleChange}
                className={`form-control ${errors.dailyRate ? "is-invalid" : ""}`}
                required
              />
              {errors.dailyRate && <div className="invalid-feedback">{errors.dailyRate}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                name="vehicleStatus"
                value={vehicleData.vehicleStatus}
                onChange={handleChange}
                className={`form-control ${errors.vehicleStatus ? "is-invalid" : ""}`}
                required
              >
                <option value="available">Available</option>
                <option value="notAvailable">Not Available</option>
              </select>
              {errors.vehicleStatus && <div className="invalid-feedback">{errors.vehicleStatus}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Passenger Capacity</label>
              <input
                type="number"
                name="passengerCapacity"
                value={vehicleData.passengerCapacity}
                placeholder="e.g. 5"
                min={1}
                max={8}
                onChange={handleChange}
                className={`form-control ${errors.passengerCapacity ? "is-invalid" : ""}`}
                required
              />
              {errors.passengerCapacity && <div className="invalid-feedback">{errors.passengerCapacity}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Engine Capacity</label>
              <input
                type="text"
                name="engineCapacity"
                value={vehicleData.engineCapacity}
                placeholder="e.g. 1.6L or 1600cc"
                onChange={handleChange}
                className={`form-control ${errors.engineCapacity ? "is-invalid" : ""}`}
                required
              />
              {errors.engineCapacity && <div className="invalid-feedback">{errors.engineCapacity}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Vehicle Image {editVehicle ? "(leave empty to keep existing)" : ""}</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className={`form-control ${errors.image ? "is-invalid" : ""}`}
                // required only when new upload and not in edit mode
                required={!editVehicle}
              />
              {errors.image && <div className="invalid-feedback">{errors.image}</div>}
            </div>

            {
              editVehicle ?
              <div className="profile-btn d-flex gap-3 mt-2">
                <button type="submit" className="btn btn-submit" disabled={submitting}>
                  {submitting ? "Updating..." : "Update"}
                </button>
                <button className="btn btn-cancel" onClick={handleCancel} disabled={submitting}>Cancel</button>
              </div> :
              <div>
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                  {submitting ? "Uploading..." : "Upload"}
                </button>
              </div>
            }
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadVehicle;
