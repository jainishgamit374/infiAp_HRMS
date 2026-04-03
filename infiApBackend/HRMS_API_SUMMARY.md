# HRMS API Summary

**Base URL**: `/api/v1/hr`

| Feature | Endpoints |
|---|---|
| **Welcome** | `GET /dashboard/summary` |
| **Employee** | `GET /employees`, `POST /employees`, `PUT /employees/:id`, `GET /employees/:id/profile` |
| **Attendance** | `GET /attendance/daily-overview`, `GET /attendance/records`, `POST /attendance/correction/submit`, `GET /attendance/correction/requests`, `PUT /attendance/correction/review`, `GET /attendance/notifications`, `GET /attendance/reports`, `POST /attendance/generate-report` |
| **Leaves** | `GET /leaves/requests`, `PUT /leaves/approve`, `GET /leaves/history` |
| **Recruitment** | `GET /recruitment/dashboard`, `GET /recruitment/candidates`, `GET /recruitment/applications` |
| **Performance** | `GET /performance/dashboard`, `POST /performance/feedback` |
| **Finance** | `GET /finance/payroll`, `POST /finance/salary/process`, `GET /finance/payslip/:id` |
| **Resignation** | `POST /resignation`, `GET /resignation/register`, `PUT /resignation/exit-process` |
| **Analytics** | `GET /analytics/report`, `GET /analytics/attendance`, `GET /analytics/performance` |
