// services/admin.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
import { authAPI } from './auth';

const getAuthHeaders = () => {
    const token = authAPI.getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const adminAPI = {
    getAllUsers: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users`, {
                headers: getAuthHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('getUsers error:', error);
            return { success: false, message: 'Network error' };
        }
    },

    updateUserRole: async (id, data) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('updateUserRole error:', error);
            return { success: false, message: 'Network error' };
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('deleteUser error:', error);
            return { success: false, message: 'Network error' };
        }
    }
};
