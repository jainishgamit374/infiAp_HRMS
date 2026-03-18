# Employee Dashboard API Documentation

This document lists all the API endpoints created for the Employee Dashboard functionality in the HRMS application.

## 1. Dashboard & Profile

### Get Home Dashboard Data
- **Endpoint:** `GET /api/v1/dashboard/home`
- **Description:** Fetches the main dashboard data, including the greeting message, new joiners for the day, and quick stats for the user's dashboard view.

### Get Employee of the Month
- **Endpoint:** `GET /api/v1/getemployeeofthemonth`
- **Description:** Retrieves the details of the current "Employee of the Month".

### Get Birthdays (DOB)
- **Endpoint:** `GET /api/v1/getDOB`
- **Description:** Fetches birthdays occurring today as well as those coming up within the current month.

---

## 2. Attendance & Punch Tracking

### Record Employee Punch
- **Endpoint:** `POST /api/v1/emp-punch`
- **Description:** Records an employee punch.
    - **Payload:** `PunchType` (`1` = Check-In, `2` = Check-Out, `3` = Reset). Required location parameters (`Latitude`, `Longitude`) and `IsAway` status.

### Get Punch Status
- **Endpoint:** `GET /api/v1/punch-status`
- **Description:** Retrieves the user's most recent punch status and the recorded time (e.g., whether they are currently checked in or checked out).

### Late Check-in Count
- **Endpoint:** `GET /api/v1/late-checkin-count`
- **Description:** Gets the count of late check-ins for the current month.

### Early Check-out Count
- **Endpoint:** `GET /api/v1/early-checkout-count`
- **Description:** Gets the count of early check-outs for the current month.

### Half Day Count
- **Endpoint:** `GET /api/v1/Half_Day-count`
- **Description:** Retrieves the number of half-day leaves taken in the current month.

### Attendance Summary
- **Endpoint:** `GET /api/v1/attendance-summary`
- **Description:** Summarizes attendance statistics, including the number of present days, leaves taken, and holidays in the current month.

### Missed Punches
- **Endpoint:** `GET /api/v1/missed-punches`
- **Description:** Retrieves a list of missed check-in and check-out punches, evaluating missing "In" after a certain start time or missing "Out" at the end of the day.

---

## 3. Leave Management

### Get Employee Leave Balance
- **Endpoint:** `GET /api/v1/getemployeeleavebalance`
- **Description:** Gets the user's available leave balances across different leave types (CL, PL, SL, WFH).

### Apply for Leave
- **Endpoint:** `POST /api/v1/leaveapplications`
- **Description:** Allows an employee to submit a new leave application.

### Get User Leave Applications
- **Endpoint:** `GET /api/v1/leaveapplications`
- **Description:** Fetches the user's recent leave application details and their statuses.

### Get Pending Leave Approvals
- **Endpoint:** `GET /api/v1/leaveapprovals`
- **Description:** Fetches a list of pending leave approvals (typically used by HR or managerial roles).

### Approve Leave
- **Endpoint:** `POST /api/v1/allapprove`
- **Description:** Updates the status of an active leave application to approved.
---

## Day-2: New & Optimized Endpoints

### 4. Directors & Organization

#### Get Directors List
- **Endpoint:** `GET /api/v1/directors`
- **Description:** Fetches a list of company directors with their profile, role, and contact information (email/slack).

---

### 5. Optimized Profile Management (Granular APIs)

These endpoints split the profile data for better frontend performance and reusability.

#### Get Profile Header
- **Endpoint:** `GET /api/v1/profile/header`
- **Description:** Basic user info: Name, Role, Dept, Employee ID, Profile Image, and Online Status.

#### Get Personal Information
- **Endpoint:** `GET /api/v1/profile/personal`
- **Description:** Detailed personal info: DOB, Phone, Email, Address, and Emergency Contact.

#### Get Professional Information
- **Endpoint:** `GET /api/v1/profile/professional`
- **Description:** Employment details: Dept, Role, Manager, Joining Date, Employment Type, and Work Location.

#### Get Account Information
- **Endpoint:** `GET /api/v1/profile/account`
- **Description:** Internal account details: Employee ID, Status, Username, and Work Email.

#### Get Profile Documents
- **Endpoint:** `GET /api/v1/profile/documents`
- **Description:** Links to employee documents like Contracts, ID Verification, and Salary Slips.

#### Get Profile Activity Feed
- **Endpoint:** `GET /api/v1/profile/activity`
- **Description:** A feed of recent profile updates (e.g., "Address details updated").

#### Get Notification Settings
- **Endpoint:** `GET /api/v1/profile/notifications`
- **Description:** User notification preferences (Email, HR announcements, Payroll alerts).

---

### 6. Profile Updates

#### Edit Personal Profile
- **Endpoint:** `POST /api/v1/profile/edit`
- **Description:** Updates the user's personal details.
- **Payload:**
  ```json
  {
      "name": "Full Name",
      "phone": "Phone Number",
      "address": "Home Address",
      "profileImage": "Image URL or Path"
  }
  ```
