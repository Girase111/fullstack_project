import React, { useState } from "react";
import { employeeAPI } from "../services/api";
import "../styles/Forms.css";

const ShowData = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    address: user.address || "",
    email: user.email || "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInsert = () => {
    // In a real app, this might save to a different table or perform other operations
    setMessage("Data inserted successfully!");
  };

  const handleUpdate = async () => {
    try {
      await employeeAPI.updateProfile(formData);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Update failed. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Show Data</h2>
      {message && <div className="success">{message}</div>}
      <form className="data-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={handleInsert} className="insert-btn">
            Insert
          </button>
          <button type="button" onClick={handleUpdate} className="update-btn">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShowData;
