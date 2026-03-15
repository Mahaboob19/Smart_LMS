// api/student.js
// API client for Student operations

const API_BASE_URL = import.meta.env.MODE === 'production' ? 'https://smart-lms-5zdm.onrender.com/api' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api');

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export const studentAPI = {
    // Get Student Analytics
    getAnalytics: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/student/analytics`, {
                method: 'GET',
                headers: getHeaders(),
            });
            return await response.json();
        } catch (error) {
            console.error('API Error (getAnalytics):', error);
            return { success: false, message: 'Network error occurred' };
        }
    },

    // Get Books (with optional search)
    getBooks: async (searchQuery = '') => {
        try {
            const url = new URL(`${API_BASE_URL}/student/books`);
            if (searchQuery) url.searchParams.append('search', searchQuery);

            const response = await fetch(url, {
                method: 'GET',
                headers: getHeaders(),
            });
            return await response.json();
        } catch (error) {
            console.error('API Error (getBooks):', error);
            return { success: false, message: 'Network error occurred' };
        }
    },

    // Get Recommendations for Student
    getRecommendations: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/student/recommendations`, {
                method: 'GET',
                headers: getHeaders(),
            });
            return await response.json();
        } catch (error) {
            console.error('API Error (getRecommendations):', error);
            return { success: false, message: 'Network error occurred' };
        }
    },

    // Request a Book
    requestBook: async (bookId, reason) => {
        try {
            const response = await fetch(`${API_BASE_URL}/student/request-book`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ bookId, reason })
            });
            return await response.json();
        } catch (error) {
            console.error('API Error (requestBook):', error);
            return { success: false, message: 'Network error occurred' };
        }
    },

    // Get Student's Book Requests
    getRequests: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/student/requests`, {
                method: 'GET',
                headers: getHeaders(),
            });
            return await response.json();
        } catch (error) {
            console.error('API Error (getRequests):', error);
            return { success: false, message: 'Network error occurred' };
        }
    },

    // Add a Review
    addReview: async (bookId, payload) => {
        try {
            const response = await fetch(`${API_BASE_URL}/student/books/${bookId}/reviews`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error (addReview):', error);
            return { success: false, message: 'Network error occurred' };
        }
    },

    // Get Student Transactions
    getTransactions: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/student/transactions`, {
                method: 'GET',
                headers: getHeaders(),
            });
            return await response.json();
        } catch (error) {
            console.error('API Error (getTransactions):', error);
            return { success: false, message: 'Network error occurred' };
        }
    }
};
