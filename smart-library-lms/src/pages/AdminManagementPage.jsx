// pages/AdminManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authAPI } from '../api/auth';
import { departments } from '../utils/departments';

const AdminManagementPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authCodes, setAuthCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newCode, setNewCode] = useState({
    role: 'admin',
    department: ''
  });
  const [generatedCode, setGeneratedCode] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!authAPI.isAuthenticated()) {
        navigate('/login');
        return;
      }

      const currentUser = authAPI.getCurrentUser();
      if (currentUser && (currentUser.userType === 'admin' || currentUser.userType === 'principal')) {
        setUser(currentUser);
        await fetchAuthCodes();
        setLoading(false);
      } else {
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchAuthCodes = async () => {
    try {
      const token = authAPI.getToken();
      const response = await fetch('http://localhost:5000/api/admin/auth-codes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setAuthCodes(data.codes);
      }
    } catch (error) {
      console.error('Error fetching auth codes:', error);
    }
  };

  const handleGenerateCode = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setGeneratedCode(null);

    try {
      const token = authAPI.getToken();
      const response = await fetch('http://localhost:5000/api/admin/generate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          role: newCode.role,
          department: newCode.role === 'hod' ? newCode.department : undefined
        })
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedCode(data.code);
        setNewCode({ role: 'admin', department: '' });
        await fetchAuthCodes();
      } else {
        alert(data.message || 'Failed to generate code');
      }
    } catch (error) {
      alert('Error generating code. Please try again.');
      console.error('Error:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Header />
      
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Management</h1>

          {/* Generate New Auth Code */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Authentication Code</h2>
            
            {generatedCode && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600 mb-2">Code generated successfully!</p>
                <div className="flex items-center justify-between">
                  <code className="text-lg font-mono font-bold text-green-700">{generatedCode}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedCode);
                      alert('Code copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-green-600 mt-2">Share this code securely with the intended user.</p>
              </div>
            )}

            <form onSubmit={handleGenerateCode} className="space-y-6">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  id="role"
                  value={newCode.role}
                  onChange={(e) => setNewCode({ ...newCode, role: e.target.value, department: '' })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                >
                  <option value="admin">Administrator</option>
                  <option value="librarian">Librarian</option>
                  <option value="hod">Head of Department (HOD)</option>
                  <option value="principal">Principal</option>
                </select>
              </div>

              {newCode.role === 'hod' && (
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Department * (Required for HOD)
                  </label>
                  <select
                    id="department"
                    value={newCode.department}
                    onChange={(e) => setNewCode({ ...newCode, department: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 outline-none"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={generating || (newCode.role === 'hod' && !newCode.department)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? 'Generating...' : 'Generate Code'}
              </button>
            </form>
          </div>

          {/* Generated Codes List */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Generated Authentication Codes</h2>
            
            {authCodes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No codes generated yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Code</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Expires</th>
                    </tr>
                  </thead>
                  <tbody>
                    {authCodes.map((code) => (
                      <tr key={code._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <code className="text-sm font-mono text-gray-900">{code.code}</code>
                        </td>
                        <td className="py-3 px-4 capitalize text-gray-700">{code.role}</td>
                        <td className="py-3 px-4 text-gray-600">{code.department || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            code.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {code.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(code.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {code.expiresAt ? new Date(code.expiresAt).toLocaleDateString() : 'Never'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Use Authentication Codes</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Generate a unique code for each admin user (HOD, Principal, Librarian, Administrator)</li>
              <li>• For HOD, select the specific department they will manage</li>
              <li>• Share the code securely with the intended user</li>
              <li>• Users will enter this code during signup to verify their admin access</li>
              <li>• Codes expire after 90 days for security purposes</li>
              <li>• Only Administrators and Principals can generate codes</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminManagementPage;
