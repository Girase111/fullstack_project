import React from "react";
import "../styles/Profile.css";

const ProfilePage = ({ user }) => {
  return (
    <div className="profile-container">
      <h2>Profile Page</h2>
      <div className="profile-card">
        <div className="profile-image">
          {user.profile_photo ? (
            <img src={user.profile_photo} alt="Profile" />
          ) : (
            <div className="profile-placeholder">
              <span>
                {user.name ? user.name.charAt(0) : user.username.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="profile-info">
          <h3>{user.name || user.username}</h3>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Gender:</strong> {user.gender}
          </p>
          <p>
            <strong>Mobile:</strong> {user.mobile_number}
          </p>
          <p>
            <strong>Address:</strong> {user.address}
          </p>
          <p>
            <strong>Status:</strong>
            <span className={user.is_active_permission ? "active" : "inactive"}>
              {user.is_active_permission ? "Active" : "Inactive"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
