import React, { useEffect, useState } from "react";
import axios from "axios";

const LeasesHistory = () => {
  const [pickedLeases, setPickedLeases] = useState([]);
  const [upcomingLeases, setUpcomingLeases] = useState([]);
  const [returnedLeases, setReturnedLeases] = useState([]);
  const [activeTab, setActiveTab] = useState("picked");

  const [filterVisible, setFilterVisible] = useState(false);
  const [customerFilter, setCustomerFilter] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [leaseTypeFilter, setLeaseTypeFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const itemsPerPage = 5;
  const [pickedCurrentPage, setPickedCurrentPage] = useState(1);
  const [returnedCurrentPage, setReturnedCurrentPage] = useState(1);
  const [upcomingCurrentPage, setUpcomingCurrentPage] = useState(1);

  useEffect(() => {
    axios.get("http://localhost:5000/admin/leases/history")
      .then((res) => {
        const today = new Date().toISOString().split("T")[0];
        const pickedToday = res.data.picked.filter(
          lease => lease.startdate <= today
        );
         const upcoming = res.data.picked.filter(
          lease => new Date(lease.startdate) > new Date(today)
        );
        setPickedLeases(pickedToday);
        setUpcomingLeases(upcoming);
        setReturnedLeases(res.data.returned);
      })
      .catch((err) => console.error("Error fetching leases:", err));
  }, []);

  const applyFilters = (lease) => {
    const customerMatch = String(lease.customerID).toLowerCase().includes(customerFilter.toLowerCase());
    const vehicleMatch = String(lease.vehicleID).toLowerCase().includes(vehicleFilter.toLowerCase());
    const leaseTypeMatch = !leaseTypeFilter || lease.leaseType === leaseTypeFilter;
    const startDateMatch = !startDateFilter || new Date(lease.startdate) >= new Date(startDateFilter);
    const endDateMatch = !endDateFilter || lease.enddate === endDateFilter;
    return customerMatch && vehicleMatch && leaseTypeMatch && startDateMatch && endDateMatch;
  };

  const filteredPicked = pickedLeases.filter(applyFilters);
  const filteredReturned = returnedLeases.filter(applyFilters);
  const filteredUpcoming = upcomingLeases.filter(applyFilters);

  const paginate = (data, page) =>
    data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const pickedPaginated = paginate(filteredPicked, pickedCurrentPage);
  const returnedPaginated = paginate(filteredReturned, returnedCurrentPage);
  const upcomingPaginated = paginate(filteredUpcoming, upcomingCurrentPage);

  const renderPagination = (totalItems, currentPage, setPageFn) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;
    return (
      <nav className="mt-3 d-flex justify-content-center">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPageFn(currentPage - 1)}>Previous</button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => setPageFn(i + 1)}>{i + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPageFn(currentPage + 1)}>Next</button>
          </li>
        </ul>
      </nav>
    );
  };

  const returnVehicle = (leaseId) => {
    axios
      .post(`http://localhost:5000/lease/return/${leaseId}`)
      .then(() => {
        alert("Vehicle returned successfully!");
        window.location.reload(); // Refresh data
      })
      .catch((err) => console.error("Return error:", err));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-dark mb-4 fw-bold">Lease History</h2>
      {/* Toggle Filter */}
      <div className="text-end mb-3">
        <button className="btn btn-outline-primary" onClick={() => setFilterVisible(!filterVisible)}>
          {filterVisible ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {filterVisible && (
        <div className="card card-body mb-4 shadow-sm">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Customer ID</label>
              <input type="text" className="form-control" value={customerFilter} onChange={(e) => setCustomerFilter(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Vehicle ID</label>
              <input type="text" className="form-control" value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Lease Type</label>
              <select className="form-select" value={leaseTypeFilter} onChange={(e) => setLeaseTypeFilter(e.target.value)}>
                <option value="">All</option>
                <option value="dailyLease">Daily</option>
                <option value="monthlyLease">Monthly</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Start Date ≥</label>
              <input type="date" className="form-control" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">End Date =</label>
              <input type="date" className="form-control" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} />
            </div>
          </div>
          <div className="text-end mt-3">
            <button className="btn btn-outline-secondary" onClick={() => {
              setCustomerFilter("");
              setVehicleFilter("");
              setLeaseTypeFilter("");
              setStartDateFilter("");
              setEndDateFilter("");
            }}>Clear Filters</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "picked" ? "active" : ""}`} onClick={() => setActiveTab("picked")}>
            Picked Vehicles
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "upcoming" ? "active" : ""}`} onClick={() => setActiveTab("upcoming")}>
            Upcoming Leases
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "returned" ? "active" : ""}`} onClick={() => setActiveTab("returned")}>
            Returned Vehicles
          </button>
        </li>
      </ul>

      {/* Picked Table */}
      {activeTab === "picked" && (
        <>
          {filteredPicked.length === 0 ? (
            <p className="text-center text-muted">No active leases found.</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-primary">
                    <tr>
                      <th>Lease ID</th>
                      <th>Customer ID</th>
                      <th>Vehicle ID</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Type</th>
                      <th>Duration</th>
                      <th>Total Amount (₹)</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                  {pickedPaginated.map((lease, index) => (
                    <tr key={index}>
                      <td>{lease.leaseID}</td>
                      <td>{lease.customerID}</td>
                      <td>{lease.vehicleID}</td>
                      <td>{lease.startdate}</td>
                      <td>{lease.enddate}</td>
                      <td>{lease.leaseType}</td>
                      <td>{lease.duration}</td>
                      <td>{lease.totalAmount}</td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => returnVehicle(lease.leaseID)}>
                          Return Vehicle
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

                </table>
              </div>
              {renderPagination(filteredPicked.length, pickedCurrentPage, setPickedCurrentPage)}
            </>
          )}
        </>
      )}

      {/* Upcoming Table */}
      {activeTab === "upcoming" && (
        <>
          {filteredUpcoming.length === 0 ? (
            <p className="text-center text-muted">No upcoming leases found.</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-secondary">
                    <tr>
                      <th>Lease ID</th>
                      <th>Customer ID</th>
                      <th>Vehicle ID</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Type</th>
                      <th>Duration</th>
                      <th>Total Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingPaginated.map((lease, index) => (
                      <tr key={index}>
                        <td>{lease.leaseID}</td>
                        <td>{lease.customerID}</td>
                        <td>{lease.vehicleID}</td>
                        <td>{lease.startdate}</td>
                        <td>{lease.enddate}</td>
                        <td>{lease.leaseType}</td>
                        <td>{lease.duration}</td>
                        <td>{lease.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination(filteredUpcoming.length, upcomingCurrentPage, setUpcomingCurrentPage)}
            </>
          )}
        </>
      )}

      {/* Returned Table */}
      {activeTab === "returned" && (
        <>
          {filteredReturned.length === 0 ? (
            <p className="text-center text-muted">No returned vehicles found.</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-success">
                    <tr>
                      <th>Lease ID</th>
                      <th>Customer ID</th>
                      <th>Vehicle ID</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Type</th>
                      <th>Duration</th>
                      <th>Total Amount (₹)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnedPaginated.map((lease, index) => (
                      <tr key={index}>
                        <td>{lease.leaseID}</td>
                        <td>{lease.customerID}</td>
                        <td>{lease.vehicleID}</td>
                        <td>{lease.startdate}</td>
                        <td>{lease.enddate}</td>
                        <td>{lease.leaseType}</td>
                        <td>{lease.duration}</td>
                        <td>{lease.totalAmount}</td>
                        <td><span className="badge bg-success">Returned</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {renderPagination(filteredReturned.length, returnedCurrentPage, setReturnedCurrentPage)}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default LeasesHistory;
