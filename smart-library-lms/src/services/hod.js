// api/hod.js
// API client for HOD operations

const API_BASE_URL = import.meta.env.MODE === 'production' ? 'https://smart-lms-5zdm.onrender.com/api' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api');

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export const hodAPI = {
    // Get HOD Analytics
    getAnalytics: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/hod/analytics`, {
                method: 'GET',
                headers: getHeaders(),
            });
            return await response.json();
        } catch (error) {
            console.error('API Error (getAnalytics):', error);
            return { success: false, message: 'Network error occurred' };
        }
    },

    // Add Recommendation
    addRecommendation: async (recommendationData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/hod/recommendations`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(recommendationData),
            });
            return await response.json();
        } catch (error) {
            console.error('API Error (addRecommendation):', error);
            return { success: false, message: 'Network error occurred' };
        }
    },

    // Get Recommendations
    getRecommendations: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/hod/recommendations`, {
                method: 'GET',
                headers: getHeaders(),
            });
            return await response.json();
        } catch (error) {
            console.error('API Error (getRecommendations):', error);
            return { success: false, message: 'Network error occurred' };
        }
    },

    // Get Staff Book Requests
    getRequests: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/hod/requests`, {
                method: 'GET',
                headers: getHeaders(),
            });
            return await response.json();
        } catch (error) {
            console.error('API Error (getRequests):', error);
            return { success: false, message: 'Network error occurred' };
        }
    },

    // Update Request Status
    updateRequestStatus: async (requestId, status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/hod/requests/${requestId}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ status }),
            });
            return await response.json();
        } catch (error) {
            console.error('API Error (updateRequestStatus):', error);
            return { success: false, message: 'Network error occurred' };
        }
    }
};
