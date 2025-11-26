import { useEffect, useState } from 'react';
import axios from 'axios';
import '../page_css/form.css';

function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: ""
  });
  const [recentData, setRecentData] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (userData) {
      setFormData({ ...formData, ...userData });
      setRecentData({ ...formData, ...userData });
    }
  }, []);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  const handleEdit = async (e) => {
    e.preventDefault();
    const res = await axios.patch('http://127.0.0.1:5000/update_customer', formData);
    alert(res.data.message);
    localStorage.setItem("user", JSON.stringify(formData));
    setRecentData(formData);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setFormData(recentData);
  };

  return (
    <div className="form-container d-flex align-items-center justify-content-center py-5">
      <div className="card form-card shadow-lg">
        <div className="card-body">

          <h2 className="text-center mb-4">Update Profile</h2>
          <form>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              className="form-control" placeholder="Your Name" required />
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className="form-control" placeholder="Your Email ID" required />
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
              className="form-control" placeholder="Your Phone Number" required />

            <div className="profile-btn d-flex gap-2 mt-2">
              <button onClick={handleEdit} className="btn btn-submit ">Save</button>
              <button onClick={handleCancel} className="btn btn-cancel w-100">Cancel</button>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
}

export default Profile;
