import React, { useState, useEffect } from 'react';
import { employeeAPI, authAPI } from '../services/api';
import '../styles/Permissions.css';

const SetPermissions = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const [userStatus, setUserStatus] = useState(null);

  useEffect(() => {
    checkUserStatus();
    fetchEmployees();
  }, []);

  const checkUserStatus = async () => {
    try {
      const response = await authAPI.debugUserStatus();
      console.log('👤 User Status:', response.data);
      setUserStatus(response.data);
    } catch (error) {
      console.error('Failed to get user status:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('📋 Starting to fetch employees...');

      // First check if user is authenticated
      const userResponse = await authAPI.getCurrentUser();
      console.log('Current user:', userResponse.data);

      if (!userResponse.data.is_admin) {
        setError('Access denied: Admin privileges required');
        return;
      }

      // Then fetch employees
      const response = await employeeAPI.getAll();
      console.log('Employees response:', response.data);

      setEmployees(response.data);

    } catch (error) {
      console.error('❌ Failed to fetch employees:', error);

      let errorMessage = 'Failed to load employees. ';

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        switch (status) {
          case 401:
            errorMessage += 'Please log in again.';
            break;
          case 403:
            errorMessage += 'Access denied. Admin privileges required.';
            break;
          case 404:
            errorMessage += 'API endpoint not found.';
            break;
          case 500:
            errorMessage += 'Server error. Check Django logs.';
            break;
          default:
            errorMessage += data.error || `HTTP ${status} error.`;
        }
      } else if (error.request) {
        errorMessage += 'Network error. Check if Django server is running.';
      } else {
        errorMessage += error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = async (employeeId, currentStatus) => {
    if (updatingIds.has(employeeId)) return;

    try {
      setUpdatingIds(prev => new Set([...prev, employeeId]));

      await employeeAPI.updatePermissions(employeeId, {
        is_active_permission: !currentStatus
      });

      setEmployees(prev => prev.map(emp =>
        emp.id === employeeId
          ? { ...emp, is_active_permission: !currentStatus }
          : emp
      ));
    } catch (error) {
      console.error('Failed to update permissions:', error);
      alert('Failed to update permissions. Please try again.');
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(employeeId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="permissions-container">
        <div className="loading">Loading employees...</div>
        {userStatus && (
          <div className="debug-info">
            <h4>Debug Info:</h4>
            <pre>{JSON.stringify(userStatus, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="permissions-container">
        <div className="error">{error}</div>
        <button onClick={fetchEmployees} className="retry-btn">Retry</button>
        <button onClick={checkUserStatus} className="debug-btn">Check User Status</button>

        {userStatus && (
          <div className="debug-info">
            <h4>Debug Info:</h4>
            <pre>{JSON.stringify(userStatus, null, 2)}</pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="permissions-container">
      <div className="permissions-header">
        <h2>Set Permissions</h2>
        <div>
          <button onClick={checkUserStatus} className="debug-btn">Debug</button>
          <button onClick={fetchEmployees} className="refresh-btn">Refresh</button>
        </div>
      </div>

      {userStatus && (
        <div className="debug-info">
          <strong>User Status:</strong> {userStatus.is_admin ? 'Admin' : 'Regular User'} |
          <strong> Auth:</strong> {userStatus.user_authenticated ? 'Yes' : 'No'}
        </div>
      )}

      {employees.length === 0 ? (
        <div className="no-employees">
          <p>No employees registered yet.</p>
        </div>
      ) : (
        <div className="employees-table-container">
          <table className="employees-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee.id}>
                  <td>
                    {employee.profile_photo_url ? (
                      <img
                        src={employee.profile_photo_url}
                        alt={employee.name}
                        className="employee-photo"
                      />
                    ) : (
                      <div className="employee-photo-placeholder">
                        {employee.name ? employee.name.charAt(0) : employee.username.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td>{employee.name || '-'}</td>
                  <td>{employee.username}</td>
                  <td>{employee.email}</td>
                  <td>{employee.mobile_number || '-'}</td>
                  <td>{employee.gender || '-'}</td>
                  <td>
                    <span className={`status ${employee.is_active_permission ? 'active' : 'inactive'}`}>
                      {employee.is_active_permission ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="permission-controls">
                      <label className="permission-toggle">
                        <input
                          type="radio"
                          name={`permission-${employee.id}`}
                          checked={employee.is_active_permission}
                          onChange={() => togglePermission(employee.id, employee.is_active_permission)}
                          disabled={updatingIds.has(employee.id)}
                        />
                        Active
                      </label>
                      <label className="permission-toggle">
                        <input
                          type="radio"
                          name={`permission-${employee.id}`}
                          checked={!employee.is_active_permission}
                          onChange={() => togglePermission(employee.id, employee.is_active_permission)}
                          disabled={updatingIds.has(employee.id)}
                        />
                        Inactive
                      </label>
                    </div>
                    {updatingIds.has(employee.id) && (
                      <span className="updating">Updating...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SetPermissions;