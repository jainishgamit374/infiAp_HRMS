# HR Dashboard API Documentation

**Base URL**: `/api/v1/hr`  
**Auth**: All routes require `Authorization: Bearer <token>` header.

---

## 1. Welcome Page Greeting

### `GET /dashboard/summary`
Returns total employees, present count for today, and holiday info.

**Response:**
```json
{
    "success": true,
    "data": {
        "totalEmployees": 150,
        "presentCount": 120,
        "isHoliday": false,
        "holidayDetails": null,
        "greeting": "Welcome to HR Dashboard"
    }
}
```

---

## 2. HR Operations — Employee

### `GET /employees`
List all employees with pagination, search & filters.

**Query Params:**
| Param | Type | Description |
|---|---|---|
| `department` | string | Filter by department |
| `role` | string | Filter by designation |
| `search` | string | Search by name, email, or employeeId |
| `page` | number | Page number (default: 1) |
| `limit` | number | Per page (default: 20) |

---

### `POST /employees` 🔒 HR/Admin only
Add a new employee.

**Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "9876543210",
  "employeeId": "EMP012",
  "department": "Engineering",
  "designation": "Frontend Developer",
  "reportingManager": "<manager_user_id>",
  "annualSalary": 800000,
  "employmentType": "full-time"
}
```
> Default password is `Password@123`.

---

### `PUT /employees/:id` 🔒 HR/Admin only
Edit an employee (name, department, role, reporting manager, salary).

**Body:** Any fields to update (password changes are blocked).

---

### `GET /employees/:id/profile`
Full employee profile with attendance, performance & payroll.

**Response:**
```json
{
  "success": true,
  "data": {
    "profileInfo": { "profileImage": "...", "name": "Jane", "employeeId": "EMP012" },
    "attendanceSummary": { "present": 18, "absent": 2, "leave": 1 },
    "personalInfo": { "email": "jane@example.com", "phone": "9876543210" },
    "jobDetails": {
      "department": "Engineering",
      "role": "Frontend Developer",
      "manager": { "name": "John", "employeeId": "EMP001" },
      "joiningDate": "2023-01-15",
      "employeeType": "full-time"
    },
    "performance": { "efficiencyScore": 85, "qualityScore": 90, "reliabilityScore": 88 },
    "payrollAndSalary": { "currentSalary": 66667, "lastPayslip": { ... } }
  }
}
```

---

## 3. HR Operations — Attendance

### `GET /attendance/daily-overview`
Daily metrics (Total, Present, Absent, Late, WFH).
**Query Params:** `date` (YYYY-MM-DD, default: today).

---

### `GET /attendance/records`
Employee-wise in/out times and status.
**Query Params:** `date`, `department`, `page`, `limit`.

---

### `POST /attendance/correction/submit`
Submit a correction request (Employee).
**Body:** `{ "correctionDate": "...", "correctionTime": "...", "reason": "...", "duration": "..." }`

---

### `GET /attendance/correction/requests`
List correction requests with status filters.
**Query Params:** `status` (Pending/Approved/Rejected), `page`, `limit`.

---

### `PUT /attendance/correction/review` 🔒 HR/Admin only
Approve or Reject a correction request.
**Body:** `{ "correctionId": "...", "status": "Approved/Rejected", "reviewRemarks": "..." }`

---

### `GET /attendance/notifications`
Alerts for Late check-ins today and Pending corrections.

---

### `GET /attendance/reports`
Aggregated attendance report (Daily/Weekly/Monthly).
**Query Params:** `filter` (daily/weekly/monthly), `department`, `date`.

---

### `POST /attendance/generate-report` 🔒 HR/Admin only
Generate a detailed report for a date range (Export logic).
**Body:** `{ "startDate": "...", "endDate": "...", "department": "..." }`

---

## 4. HR Operations — Leaves

### `GET /leaves/requests`
List all pending leave requests ("Awaiting Approve" status).

### `PUT /leaves/approve` 🔒 HR/Admin/Manager only
Approve or reject a leave request.

**Body:**
```json
{ "leaveId": "<leave_id>", "status": "Approved" }
```
> `status` can be `"Approved"` or `"Rejected"`.

### `GET /leaves/history`
Leave history with optional filters.

**Query Params:**
| Param | Type | Description |
|---|---|---|
| `employeeId` | string | Filter by employee ObjectId |
| `status` | string | Filter by ApprovalStatus |

---

## 5. HR Operations — Recruitment

### `GET /recruitment/dashboard`
Summary: total candidates, hired count.

### `GET /recruitment/candidates`
List all candidates.

### `GET /recruitment/applications`
List candidates with "Applied" status only.

---

## 6. HR Operations — Performance

### `GET /performance/dashboard`
All performance records with employee details.

### `POST /performance/feedback` 🔒 HR/Admin/Manager only
Add performance feedback/scores.

**Body:**
```json
{
  "userId": "<user_id>",
  "month": "2023-10",
  "year": 2023,
  "efficiencyScore": 90,
  "qualityScore": 85,
  "reliabilityScore": 88,
  "feedback": "Great work this month"
}
```

---

## 7. HR Operations — Finance

### `GET /finance/payroll` 🔒 HR/Admin only
List all payroll records.

### `POST /finance/salary/process` 🔒 HR/Admin only
Process salary for an employee.

**Body:**
```json
{
  "userId": "<user_id>",
  "month": "October",
  "year": 2023,
  "basicSalary": 50000,
  "allowances": 10000,
  "deductions": 2000
}
```

### `GET /finance/payslip/:id`
Get a specific payslip by payroll ID.

---

## 8. HR Operations — Resignation

### `POST /resignation`
Submit a resignation.

**Body:**
```json
{ "userId": "<user_id>", "reason": "Better opportunity", "noticePeriodDays": 30 }
```

### `GET /resignation/register`
List all resignations.

### `PUT /resignation/exit-process` 🔒 HR/Admin only
Process exit (approve/reject resignation).

**Body:**
```json
{ "resignationId": "<id>", "status": "Approved", "managerRemarks": "Good luck!" }
```
> Status options: `Submitted`, `Under Review`, `Approved`, `Rejected`, `Withdrawn`

---

## 9. Analytics

### `GET /analytics/report`
Department-wise employee count + average performance scores.

### `GET /analytics/attendance`
Attendance breakdown by department with daily present counts.

**Query Params:**
| Param | Type | Description |
|---|---|---|
| `department` | string | Filter by department |
| `startDate` | date | Start date (default: 1st of current month) |
| `endDate` | date | End date (default: today) |

### `GET /analytics/performance`
Performance scores aggregated by department.

**Query Params:**
| Param | Type | Description |
|---|---|---|
| `department` | string | Filter by department |
| `month` | string | e.g. "2023-10" |
| `year` | number | e.g. 2023 |

---

## Files Created / Modified

### New Models
| File | Purpose |
|---|---|
| `models/holiday.model.js` | Holiday dates |
| `models/candidate.model.js` | Recruitment candidates |
| `models/performance.model.js` | Monthly performance scores |
| `models/payroll.model.js` | Payroll / salary records |
| `models/resignation.model.js` | Resignation tracking |
| `models/attendanceCorrection.model.js` | Correction requests |

### Modified Models
| File | Fields Added |
|---|---|
| `models/user.model.js` | `employeeId`, `department`, `designation`, `reportingManager`, `annualSalary`, `employmentType` |

### New Controller & Routes
| File | Purpose |
|---|---|
| `controllers/hr.controller.js` | All 22 HR dashboard API handlers |
| `routes/hr.routes.js` | Route definitions with auth + role middleware |

### Modified
| File | Change |
|---|---|
| `app.js` | Registered `hrRouter` at `/api/v1/hr` |
