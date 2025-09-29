import React from "react";
import "../styles/MoreData.css";

const MoreData = ({ user }) => {
  const additionalData = [
    { label: "User ID", value: user.id },
    { label: "Account Type", value: user.is_admin ? "Admin" : "Employee" },
    { label: "Registration Date", value: new Date().toLocaleDateString() },
    { label: "Last Login", value: new Date().toLocaleDateString() },
    {
      label: "Permission Status",
      value: user.is_active_permission ? "Granted" : "Revoked",
    },
    { label: "Profile Completion", value: "85%" },
  ];

  return (
    <div className="more-data-container">
      <h2>More Data</h2>
      <div className="data-grid">
        {additionalData.map((item, index) => (
          <div key={index} className="data-item">
            <div className="data-label">{item.label}:</div>
            <div className="data-value">{item.value}</div>
          </div>
        ))}
      </div>
      <div className="charts-section">
        <div className="chart-placeholder">
          <h3>Activity Chart</h3>
          <div className="chart-content">
            <div className="bar" style={{ height: "60%" }}></div>
            <div className="bar" style={{ height: "80%" }}></div>
            <div className="bar" style={{ height: "45%" }}></div>
            <div className="bar" style={{ height: "90%" }}></div>
            <div className="bar" style={{ height: "70%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoreData;
