import React, { useState } from "react";
import EmployeeRegistration from "./EmployeeRegistration";
import SetPermissions from "./SetPermissions";
import "../styles/Dashboard.css";

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("register");

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.name || user.username}</span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>
      <nav className="dashboard-nav">
        <button
          className={activeTab === "register" ? "active" : ""}
          onClick={() => setActiveTab("register")}
        >
          Employee Registration
        </button>
        <button
          className={activeTab === "permissions" ? "active" : ""}
          onClick={() => setActiveTab("permissions")}
        >
          Set Permissions
        </button>
      </nav>
      <main className="dashboard-content">
        {activeTab === "register" && <EmployeeRegistration />}
        {activeTab === "permissions" && <SetPermissions />}
      </main>
    </div>
  );
};

export default AdminDashboard;
