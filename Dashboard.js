import React from "react";
import Navbar from "../components/Navbar";
import { FiTruck, FiUsers, FiFileText, FiPlusCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-header">
        <h1>
          <span className="globe">🌍</span> Global Vehicle Export Management Dashboard
        </h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <FiTruck size={40} />
          <h3>Total Vehicles</h3>
          <p className="count">128</p>
        </div>

        <div className="stat-card yellow">
          <FiFileText size={40} />
          <h3>Pending Shipments</h3>
          <p className="count">12</p>
        </div>

        <div className="stat-card green">
          <FiTruck size={40} />
          <h3>Completed Exports</h3>
          <p className="count">98</p>
        </div>

        <div className="stat-card purple">
          <FiUsers size={40} />
          <h3>Registered Users</h3>
          <p className="count">14</p>
        </div>
      </div>

      <h2 className="quick-title">🚀 Quick Actions</h2>

      <div className="quick-actions">

        {/* Vehicle Records */}
        <div
          className="action-card"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/vehicles")}
        >
          <FiFileText size={30} className="icon" />
          <h3>Vehicle Records</h3>
          <p>View and manage exported vehicle details.</p>
        </div>

        {/* Manage Shipments */}
        <div
          className="action-card"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/shipments")}
        >
          <FiTruck size={30} className="icon" />
          <h3>Manage Shipments</h3>
          <p>Update shipping status and verify orders.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
