# InfiAP HRMS Backend API Documentation

Base URL: `https://api.yourdomain.com/api/v1`

---

## 1️⃣ Authentication APIs (Used by all users)

### ➤ Register User
**POST** `/auth/signup`
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "employee"
}
```

### ➤ Login
**POST** `/auth/login`
**Body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```
**Response:**
```json
{
  "message": "OTP sent to your email for 2FA verification",
  "require2FA": true,
  "userId": "user_id_here"
}
```

### ➤ Verify Login 2FA OTP
**POST** `/auth/verify-2fa`
**Body:**
```json
{
  "userId": "user_id_here",
  "otp": "123456"
}
```
**Response:**
```json
{
  "message": "2FA verified successfully",
  "token": "JWT_TOKEN",
  "role": "employee",
  "user": { ... }
}
```

### ➤ Forgot Password
**POST** `/auth/forgot-password`
**Body:**
```json
{
  "email": "john@example.com"
}
```

### ➤ Reset Password
**POST** `/auth/reset-password`
**Body:**
```json
{
  "token": "RESET_TOKEN",
  "newPassword": "newpassword123"
}
```

---

## 2️⃣ Main Admin APIs (With Request Body)

### Company Setup

#### ➤ Create Company
**POST** `/main-admin/company`
**Body:**
```json
{
  "companyName": "InfiAP Pvt Ltd",
  "email": "info@infiap.com",
  "phone": "9876543210",
  "address": "Mumbai, India",
  "industry": "IT Services",
  "totalEmployees": 50
}
```

#### ➤ Update Company
**PUT** `/main-admin/company/:id`
**Body:**
```json
{
  "companyName": "InfiAP Technologies",
  "phone": "9999999999",
  "address": "Bangalore, India"
}
```

### Global User Management

#### ➤ Create Admin
**POST** `/main-admin/admin`
**Body:**
```json
{
  "name": "Admin User",
  "email": "admin@company.com",
  "password": "123456",
  "role": "admin",
  "companyId": "company_id"
}
```

#### ➤ Create HR
**POST** `/main-admin/hr`
**Body:**
```json
{
  "name": "HR Manager",
  "email": "hr@company.com",
  "password": "123456",
  "role": "hr",
  "companyId": "company_id"
}
```

#### ➤ Update User Permissions
**PUT** `/main-admin/user-permission/:id`
**Body:**
```json
{
  "permissions": [
    "manage_employees",
    "manage_payroll",
    "view_reports"
  ]
}
```

### Platform Configuration

#### ➤ Update Config
**PUT** `/main-admin/config`
**Body:**
```json
{
  "maintenanceMode": false,
  "maxUsersPerCompany": 500,
  "defaultLeaveDays": 20
}
```

### System Integrations

#### ➤ Cloud Integration
**POST** `/main-admin/integration/cloud`
**Body:**
```json
{
  "provider": "aws",
  "accessKey": "ACCESS_KEY",
  "secretKey": "SECRET_KEY",
  "region": "ap-south-1"
}
```

#### ➤ Email Integration
**POST** `/main-admin/integration/email`
**Body:**
```json
{
  "provider": "smtp",
  "host": "smtp.gmail.com",
  "port": 587,
  "email": "noreply@company.com",
  "password": "email_password"
}
```

#### ➤ Security Settings
**POST** `/main-admin/integration/security`
**Body:**
```json
{
  "enable2FA": true,
  "sessionTimeout": 30,
  "ipWhitelist": ["192.168.1.1"]
}
```

### OTP Approval System

#### ➤ Generate OTP
**POST** `/main-admin/security/generate-otp`
**Body:**
```json
{
  "action": "update_company_settings",
  "requestedBy": "admin_id"
}
```

#### ➤ Verify OTP
**POST** `/main-admin/security/verify-otp`
**Body:**
```json
{
  "otp": "123456",
  "requestId": "request_id"
}
```

#### ➤ Approve Change
**POST** `/main-admin/security/approve-change`
**Body:**
```json
{
  "requestId": "request_id",
  "approvedBy": "main_admin_id"
}
```

#### ➤ Reject Change
**POST** `/main-admin/security/reject-change`
**Body:**
```json
{
  "requestId": "request_id",
  "reason": "Invalid request"
}
```

---

## 3️⃣ Employee Dashboard APIs

### Dashboard Data

#### ➤ Get Home Dashboard
**GET** `/dashboard/home`
**Response:**
```json
{
  "status": "Success",
  "data": {
    "greeting": {
      "message": "Welcome, Sneha Desai!",
      "subMessage": "Sneha Desai joined the Engineering team on Jan 20, 2026. Let's give her a warm welcome!"
    },
    "joiningToday": [
      {
        "name": "Sneha Desai",
        "role": "Engineering",
        "joinedAt": "Jan 20, 2026"
      }
    ],
    "checkInInfo": {
      "lastCheck": "09:02 AM",
      "location": "Mumbai Office"
    },
    ...
  }
}
```

### Attendance / Punch

#### ➤ Employee Punch
**POST** `/emp-punch`
**Body:**
```json
{
  "PunchType": 1,
  "Latitude": 21.1702,
  "Longitude": 72.8311,
  "IsAway": false
}
```
*Note: PunchType -> 1 = in, 2 = out, 3 = reset*

**Response:**
```json
{
  "status": "Success",
  "message": "Punch recorded successfully",
  "PunchTime": "2025-12-24 11:49:46 AM"
}
```

#### ➤ Get Punch Status
**GET** `/punch-status`
*Note: PunchType -> 1 = IN, 2 = OUT, 3 = NOT IN / NOT OUT*

**Response:**
```json
{
  "status": "Success",
  "statusCode": 200,
  "data": {
    "PunchType": 1,
    "PunchDateTime": "25-12-2025 06:31:15 AM"
  }
}
```

