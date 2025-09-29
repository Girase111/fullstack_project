import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Get CSRF token from cookies
const getCSRFToken = () => {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        // Add CSRF token to headers
        const csrfToken = getCSRFToken();
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }

        console.log('🚀 API Request:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            withCredentials: config.withCredentials
        });
        return config;
    },
    (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('✅ API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('❌ API Response Error:', {
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
        return Promise.reject(error);
    }
);

export const authAPI = {
    adminLogin: (credentials) => api.post('/admin/login/', credentials),
    userLogin: (credentials) => api.post('/user/login/', credentials),
    logout: () => api.post('/logout/'),
    getCurrentUser: () => api.get('/current-user/'),
    debugUserStatus: () => api.get('/debug-user/'),
};

export const employeeAPI = {
    register: (employeeData) => {
        const formData = new FormData();
        Object.keys(employeeData).forEach(key => {
            if (employeeData[key] !== null && employeeData[key] !== undefined && employeeData[key] !== '') {
                formData.append(key, employeeData[key]);
            }
        });

        return api.post('/register-employee/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    getAll: () => api.get('/employees/'),
    updatePermissions: (userId, permissions) => api.put(`/employees/${userId}/permissions/`, permissions),
    updateProfile: (profileData) => api.put('/update-profile/', profileData),
};

export default api;