const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const librarianAPI = {
    getBooks: async (search = '') => {
        try {
            const url = search
                ? `${API_BASE_URL}/books?search=${encodeURIComponent(search)}`
                : `${API_BASE_URL}/books`;

            const response = await fetch(url, {
                headers: getAuthHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('getBooks error:', error);
            return { success: false, message: 'Network error' };
        }
    },

    addBook: async (bookData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/books`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(bookData)
            });
            return await response.json();
        } catch (error) {
            console.error('addBook error:', error);
            return { success: false, message: 'Network error' };
        }
    },

    getTransactions: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/transactions`, {
                headers: getAuthHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('getTransactions error:', error);
            return { success: false, message: 'Network error' };
        }
    },

    issueBook: async (transactionData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/transactions/issue`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(transactionData)
            });
            return await response.json();
        } catch (error) {
            console.error('issueBook error:', error);
            return { success: false, message: 'Network error' };
        }
    },

    returnBook: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/transactions/${id}/return`, {
                method: 'PUT',
                headers: getAuthHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('returnBook error:', error);
            return { success: false, message: 'Network error' };
        }
    },

    getAnalytics: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/librarian/analytics`, {
                headers: getAuthHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('getAnalytics error:', error);
            return { success: false, message: 'Network error' };
        }
    },

    sendMessage: async (messageData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(messageData)
            });
            return await response.json();
        } catch (error) {
            console.error('sendMessage error:', error);
            return { success: false, message: 'Network error' };
        }
    },

    getMessages: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/messages`, {
                headers: getAuthHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('getMessages error:', error);
            return { success: false, message: 'Network error' };
        }
    },

    getRequests: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/librarian/requests`, {
                headers: getAuthHeaders()
            });
            return await response.json();
        } catch (error) {
            console.error('getRequests error:', error);
            return { success: false, message: 'Network error' };
        }
    },

    updateRequestStatus: async (id, status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/librarian/requests/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status })
            });
            return await response.json();
        } catch (error) {
            console.error('updateRequestStatus error:', error);
            return { success: false, message: 'Network error' };
        }
    }
};
