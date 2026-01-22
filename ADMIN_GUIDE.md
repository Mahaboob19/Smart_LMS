# Administrator Guide - Authentication Code Management

## Overview
This guide explains how administrators manage authentication codes for HOD, Principal, Librarian, and Administrator roles in the Smart Library Management System.

## Accessing Admin Management

1. **Login** as an Administrator or Principal
2. Navigate to your **Dashboard** (`/`)
3. Click on **"Admin Management"** in the Quick Actions section
4. Or directly visit: `http://localhost:3000/admin/management`

## Generating Authentication Codes

### Step-by-Step Process:

1. **Select Role Type:**
   - **Administrator**: Full system access
   - **Librarian**: Library management access
   - **Head of Department (HOD)**: Department-specific access
   - **Principal**: Highest level administrative access

2. **For HOD Role:**
   - Select the specific **Department** from the dropdown
   - This ensures the HOD can only manage their assigned department

3. **Generate Code:**
   - Click "Generate Code"
   - A unique authentication code will be created
   - **Copy the code** and share it securely with the intended user

### Code Format:
```
VVIT_[ROLE]_[TIMESTAMP]_[RANDOM]
Example: VVIT_HOD_ABC123_XYZ789
```

## Code Properties

- **Expiration**: Codes expire after 90 days for security
- **Uniqueness**: Each code is unique and can only be used once
- **Department Binding**: HOD codes are tied to specific departments
- **Activity Status**: Codes can be active or inactive

## Security Best Practices

1. **Share Securely**: 
   - Send codes via secure channels (encrypted email, secure messaging)
   - Never share codes publicly
   - Verify recipient identity before sharing

2. **Code Usage**:
   - Each code should be used by only one person
   - Codes are single-use during signup
   - After signup, users authenticate with email/password

3. **Regular Audits**:
   - Review generated codes regularly
   - Deactivate unused or compromised codes
   - Monitor code usage in the management dashboard

## Managing Existing Codes

### View All Codes:
- The Admin Management page shows all generated codes
- View code details: role, department, status, creation date, expiration

### Code Information Displayed:
- **Code**: The actual authentication code
- **Role**: Administrator, Librarian, HOD, or Principal
- **Department**: Department name (for HOD codes)
- **Status**: Active or Inactive
- **Created**: Date when code was generated
- **Expires**: Expiration date (90 days from creation)

## Department-Based Organization

### How It Works:

1. **Student/Staff Signup:**
   - Must select a department from dropdown
   - Data is organized by department in the database
   - Users can be filtered by department

2. **HOD Signup:**
   - Must select department during code generation
   - HOD can only access their assigned department's data
   - Department is required and cannot be changed after signup

3. **Database Organization:**
   - Users are indexed by department for efficient queries
   - Department-based filtering ensures data isolation
   - HOD can view/manage only their department's users

## API Endpoints for Administrators

### Generate Code:
```
POST /api/admin/generate-code
Headers: Authorization: Bearer [token]
Body: {
  "role": "hod",
  "department": "Computer Science and Engineering (CSE)"
}
```

### View All Codes:
```
GET /api/admin/auth-codes
Headers: Authorization: Bearer [token]
```

### Get Users by Department:
```
GET /api/users/department/:department
Headers: Authorization: Bearer [token]
```

## Default Authentication Code

For initial setup, there's a default admin code:
- **Code**: `VVIT_ADMIN_2024`
- **Location**: Set in `backend/.env` as `ADMIN_AUTH_CODE`
- **Change**: Update `.env` file for production

## Troubleshooting

### Code Not Working:
1. Verify code hasn't expired (90 days)
2. Check code is active in management dashboard
3. Ensure correct role and department (for HOD)
4. Verify code was copied correctly (no extra spaces)

### Cannot Access Admin Management:
1. Ensure you're logged in as Administrator or Principal
2. Check your user type in dashboard
3. Verify JWT token is valid

### Department Not Showing:
1. Check if department exists in the departments list
2. Verify department name matches exactly
3. Contact system administrator to add new departments

## Adding New Departments

To add new departments:

1. **Frontend**: Edit `smart-library-lms/src/utils/departments.js`
2. **Backend**: Update departments list in `/api/departments` endpoint
3. **Restart**: Restart both frontend and backend servers

## Contact

For issues or questions:
- Email: lms.cs@vvitu.ac.in
- Phone: +91 994-941-7887
- Location: VVIT University, CS Department
