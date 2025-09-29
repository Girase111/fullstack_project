import React, { useState } from "react";
import ProfilePage from "./ProfilePage";
import ShowData from "./ShowData";
import MoreData from "./MoreData";
import "../styles/Dashboard.css";

const UserDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>User Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user.name || user.username}</span>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>
      <nav className="dashboard-nav">
        <button
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => setActiveTab("profile")}
        >
          Profile Page
        </button>
        <button
          className={activeTab === "showdata" ? "active" : ""}
          onClick={() => setActiveTab("showdata")}
        >
          Show Data
        </button>
        <button
          className={activeTab === "moredata" ? "active" : ""}
          onClick={() => setActiveTab("moredata")}
        >
          More Data
        </button>
      </nav>
      <main className="dashboard-content">
        {activeTab === "profile" && <ProfilePage user={user} />}
        {activeTab === "showdata" && <ShowData user={user} />}
        {activeTab === "moredata" && <MoreData user={user} />}
      </main>
    </div>
  );
};

export default UserDashboard;
