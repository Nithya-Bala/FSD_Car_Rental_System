import React, { useEffect, useState } from "react";
import axios from "axios";
import "../page_css/LeaseHistory.css";

const LeaseCard = ({ lease, type, downloadInvoice }) => {
  const colorMap = {
    picked: "text-danger",
    upcoming: "text-secondary",
    returned: "text-success",
  };

  return (
    <div className="p-3 bg-white rounded-4 shadow-sm border w-100" style={{ maxWidth: "900px" }}>
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap">
        <div>
          <h6 className={`fw-bold mb-1 ${colorMap[type]}`}>
            <i className="bi bi-car-front-fill me-2"></i>Lease ID #{lease.leaseID}
          </h6>
          <small className="text-muted">
            Start: {lease.startdate} | End: {lease.enddate}
          </small>
        </div>
        <button className="btn btn-outline-primary btn-sm rounded-pill mt-2 mt-md-0" onClick={() => downloadInvoice(lease.leaseID)}>
          <i className="bi bi-download me-1"></i>Download Invoice
        </button>
      </div>

      <hr className="my-2" />

      <div className="row g-3 align-items-center">
        <div className="col-md-2 col-4">
          <img
            src={lease.vehicleImage ? `data:image/jpeg;base64,${lease.vehicleImage}` : "https://via.placeholder.com/150"}
            alt="Vehicle"
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-3 col-8">
          <p className="mb-0 fw-medium text-muted">Vehicle</p>
          <p className="fw-semibold">{lease.make} {lease.model}</p>
        </div>
        <div className="col-md-2 col-6">
          <p className="mb-0 fw-medium text-muted">Type</p>
          <p className="fw-semibold">{lease.leaseType}</p>
        </div>
        <div className="col-md-2 col-6">
          <p className="mb-0 fw-medium text-muted">Duration</p>
          <p className="fw-semibold">{lease.duration} days</p>
        </div>
        <div className="col-md-2 col-6">
          <p className="mb-0 fw-medium text-muted">Total</p>
          <p className="fw-semibold">₹{lease.totalAmount}</p>
        </div>
      </div>
    </div>
  );
};

const LeaseHistory = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const customerId = user.id;
  const [pickedLeases, setPickedLeases] = useState([]);
  const [returnedLeases, setReturnedLeases] = useState([]);
  const [upcomingLeases, setUpcomingLeases] = useState([]);
  const [activeTab, setActiveTab] = useState("picked");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    axios.get(`http://localhost:5000/api/lease/history/${customerId}`)
      .then((res) => {
        const today = new Date().toISOString().split("T")[0];
        const picked = res.data.picked.filter((lease) => lease.startdate <= today);
        const upcoming = res.data.picked.filter((lease) => lease.startdate > today);
        setPickedLeases(picked);
        setUpcomingLeases(upcoming);
        setReturnedLeases(res.data.returned);
      })
      .catch((err) => console.error("Error fetching leases:", err));
  }, [customerId]);

  const downloadInvoice = async (leaseId) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/download-invoice",
        { lease_id: leaseId },
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${leaseId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Invoice download failed:", error);
    }
  };

  const Pagination = ({ totalItems }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
      <div className="d-flex justify-content-center mt-4 gap-3">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          &laquo; Previous
        </button>
        <span className="align-self-center text-muted">Page {currentPage} of {totalPages}</span>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next &raquo;
        </button>
      </div>
    );
  };

  const renderCards = (leases, type) => {
    if (leases.length === 0) {
      return <p className="text-center text-muted">No {type} leases found.</p>;
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLeases = leases.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <>
        <div className="d-flex flex-column align-items-center gap-3 w-100">
          {currentLeases.map((lease, index) => (
            <LeaseCard
              key={index}
              lease={lease}
              type={type}
              downloadInvoice={downloadInvoice}
            />
          ))}
        </div>
        <Pagination totalItems={leases.length} />
      </>
    );
  };

  return (
    <div className="container my-5">
      <h3 className="text-center text-dark mb-4 fw-bold">Your Lease Summary</h3>
      <ul className="nav nav-tabs justify-content-center mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "picked" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("picked");
              setCurrentPage(1);
            }}
          >
            Picked
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("upcoming");
              setCurrentPage(1);
            }}
          >
            Upcoming
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "returned" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("returned");
              setCurrentPage(1);
            }}
          >
            Returned
          </button>
        </li>
      </ul>

      <div className="d-flex justify-content-center">
        <div className="lease-box-wrapper w-100" style={{ maxWidth: "1100px" }}>
          {activeTab === "picked" && renderCards(pickedLeases, "picked")}
          {activeTab === "upcoming" && renderCards(upcomingLeases, "upcoming")}
          {activeTab === "returned" && renderCards(returnedLeases, "returned")}
        </div>
      </div>
    </div>
  );
};

export default LeaseHistory;
