import React, { useState } from 'react';
import { employeeAPI } from '../services/api';
import '../styles/Forms.css';

const EmployeeRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    profile_photo: null,
    email: '',
    gender: '',
    mobile_number: '',
    username: '',
    password: '',
    is_active_permission: true
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0] || null
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      profile_photo: null,
      email: '',
      gender: '',
      mobile_number: '',
      username: '',
      password: '',
      is_active_permission: true
    });
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      console.log('Submitting form data:', formData);
      const response = await employeeAPI.register(formData);
      console.log('Registration response:', response.data);

      setMessage('Employee registered successfully!');
      resetForm();
    } catch (error) {
      console.error('Registration error:', error);

      if (error.response?.data) {
        // Handle validation errors
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          const errorMessages = Object.entries(errorData)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          setError(errorMessages);
        } else {
          setError(errorData.error || 'Registration failed. Please try again.');
        }
      } else {
        setError('Registration failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Employee Registration</h2>
      {message && <div className="success">{message}</div>}
      {error && <div className="error" style={{ whiteSpace: 'pre-line' }}>{error}</div>}

      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label>Name: *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter full name"
          />
        </div>

        <div className="form-group">
          <label>Username: *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Enter username"
          />
        </div>

        <div className="form-group">
          <label>Email: *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter email address"
          />
        </div>

        <div className="form-group">
          <label>Password: *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            placeholder="Enter password (min 6 characters)"
          />
        </div>

        <div className="form-group">
          <label>Mobile Number:</label>
          <input
            type="tel"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
            placeholder="Enter mobile number"
          />
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Address:</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            rows="3"
          />
        </div>

        <div className="form-group full-width">
          <label>Profile Photo:</label>
          <input
            type="file"
            name="profile_photo"
            onChange={handleChange}
            accept="image/*"
          />
          {formData.profile_photo && (
            <small>Selected: {formData.profile_photo.name}</small>
          )}
        </div>

        <div className="form-group full-width">
          <label>
            <input
              type="checkbox"
              name="is_active_permission"
              checked={formData.is_active_permission}
              onChange={handleChange}
            />
            Active Permission
          </label>
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register Employee'}
        </button>
      </form>
    </div>
  );
};

export default EmployeeRegistration;