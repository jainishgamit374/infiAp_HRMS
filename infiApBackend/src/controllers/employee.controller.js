const Punch = require("../models/punch.model");
const User = require("../models/user.model");
const moment = require("moment"); // We can use moment or native Date

// 1. Employee Dashboard Home Data
exports.getDashboardHome = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null; // If using auth middleware
        
        // Mocking dashboard data for now based on UI requirements
        const dashboardData = {
            greeting: {
                message: "Welcome, Sneha Desai!",
                subMessage: "Sneha Desai joined the Engineering team on Jan 20, 2026. Let's give her a warm welcome!",
            },
            joiningToday: [
                {
                    name: "Sneha Desai",
                    role: "Engineering",
                    joinedAt: "Jan 20, 2026"
                }
            ],
            checkInInfo: {
                lastCheck: "09:02 AM",
                location: "Mumbai Office"
            },
            leaveBalance: {
                privilegeLeave: 6,
                casualLeave: 6,
                sickLeave: 6,
                totalBalance: 18,
                earlyOutRecord: 0,
                lateIn: "0/5",
                earlyOut: "0/5",
                halfDay: 0
            },
            attendanceSummary: {
                present: 22,
                leaves: 2,
                holiday: 1
            },
            missedPunches: [
                { date: "Mar 2, 2026", type: "Missing Out" },
                { date: "Mar 3, 2026", type: "Missing Out" }
            ],
            approvalsActivities: [
                { title: "Leave Requests", description: "2 Pending Approvals" },
                { title: "Upcoming WFH", description: "Approved for Mar 15-16" }
            ],
            birthdays: {
                countThisWeek: 3,
                message: "Wish your colleagues a very happy birthday!"
            }
        };

        res.status(200).json({ status: "Success", data: dashboardData });
    } catch (error) {
        res.status(500).json({ message: "Failed to load dashboard data", error: error.message });
    }
};

// 2. Employee Punch (IN / OUT)
exports.empPunch = async (req, res) => {
    try {
        const { PunchType, Latitude, Longitude, IsAway } = req.body;
        
        // Use the authenticated user's ID ideally: req.user._id
        // Since we may not have auth middleware attached in this precise test, we mock a userId if none
        const userId = req.user ? req.user._id : "656b23d91f4a9b2b2c3d4e5f"; 

        const punch = await Punch.create({
            userId,
            PunchType,
            Latitude,
            Longitude,
            IsAway
        });

        // Format: YYYY-MM-DD hh:mm:ss A
        const formatDoubleDigit = (n) => n < 10 ? `0${n}` : n;
        const d = punch.PunchTime || new Date();
        const year = d.getFullYear();
        const month = formatDoubleDigit(d.getMonth() + 1);
        const day = formatDoubleDigit(d.getDate());
        
        let hours = d.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const mins = formatDoubleDigit(d.getMinutes());
        const secs = formatDoubleDigit(d.getSeconds());

        const formattedPunchTime = `${year}-${month}-${day} ${formatDoubleDigit(hours)}:${mins}:${secs} ${ampm}`;

        let message = "Punch recorded successfully";
        if (PunchType === 1) message = "Check-In recorded successfully";
        if (PunchType === 2) message = "Check-Out recorded successfully";
        if (PunchType === 3) message = "Punch Reset successfully";

        res.status(200).json({
            status: "Success",
            message: message,
            PunchTime: formattedPunchTime
        });

    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to record punch", error: error.message });
    }
};

// 3. Get User recent Punch Status
exports.getPunchStatus = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : "656b23d91f4a9b2b2c3d4e5f"; // mock user fallback

        // Get the most recent punch
        const latestPunch = await Punch.findOne({ userId }).sort({ PunchTime: -1 });

        let punchType = 3; // Default: Not In / Not Out
        let punchTime = null;

        if (latestPunch) {
            punchType = latestPunch.PunchType;
            const formatDoubleDigit = (n) => n < 10 ? `0${n}` : n;
            const d = latestPunch.PunchTime;
            
            const year = d.getFullYear();
            const month = formatDoubleDigit(d.getMonth() + 1);
            const day = formatDoubleDigit(d.getDate());
            
            let hours = d.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; 
            const mins = formatDoubleDigit(d.getMinutes());
            const secs = formatDoubleDigit(d.getSeconds());

            // Format: DD-MM-YYYY hh:mm:ss A
            punchTime = `${day}-${month}-${year} ${formatDoubleDigit(hours)}:${mins}:${secs} ${ampm}`;
        }

        res.status(200).json({
            status: "Success",
            statusCode: 200,
            data: {
                PunchType: punchType,
                PunchDateTime: punchTime || "N/A"
            }
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to get punch status", error: error.message });
    }
};

// 4. Get Employee Leave Balance
exports.getEmployeeLeaveBalance = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : "656b23d91f4a9b2b2c3d4e5f"; // mock user fallback

        // Note: For now we'll mock the response to match the exact requirement,
        // but normally this would be fetched from: await LeaveBalance.findOne({ userId })
        const leaveBalanceData = [
            {
                "Leavename": "CL",
                "count": 15
            },
            {
                "Leavename": "PL",
                "count": 15
            },
            {
                "Leavename": "SL",
                "count": 13
            },
            {
                "Leavename": "WFH",
                "count": "7 day's"
            }
        ];

        res.status(200).json({
            status: "Success",
            statusCode: 200,
            message: "Leave balance retrieved successfully.",
            data: leaveBalanceData
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to get leave balance", error: error.message });
    }
};

// 5. Late Check-in Count
exports.getLateCheckinCount = async (req, res) => {
    try {
        // Query logic would be implemented here
        res.status(200).json({
            status: "Success",
            statusCode: 200,
            data: {
                late_checkin_count: 1
            }
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to get late checkin count", error: error.message });
    }
};

// 6. Early Check-out Count
exports.getEarlyCheckoutCount = async (req, res) => {
    try {
        // Query logic would be implemented here
        res.status(200).json({
            status: "Success",
            statusCode: 200,
            data: {
                early_checkout_count: 1
            }
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to get early checkout count", error: error.message });
    }
};

// 7. Half Day Count
exports.getHalfDayCount = async (req, res) => {
    try {
        // Query logic would be implemented here
        res.status(200).json({
            status: "Success",
            statusCode: 200,
            data: {
                Half_Day_count: 1
            }
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to get half day count", error: error.message });
    }
};

// 8. Attendance Summary
exports.getAttendanceSummary = async (req, res) => {
    try {
        // Here you would query punches for 'present' count, Leave models for 'leaves', and a Holiday model for 'holidays'.
        // Mocking the data based on the requirements for now.
        res.status(200).json({
            status: "Success",
            statusCode: 200,
            data: {
                present: 22,
                leaves: 2,
                holiday: 1
            }
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to get attendance summary", error: error.message });
    }
};

// 9. Missed Punches
exports.getMissedPunches = async (req, res) => {
    try {
        // Here you would query punches for missing out/missing in. 
        // For example, finding presence records with no check-in after 10 AM, or no check-out at the end of day.
        
        // Mocking the data based on UI req
        res.status(200).json({
            status: "Success",
            statusCode: 200,
            data: [
                { date: "Mar 2, 2026", type: "Missing In" },
                { date: "Mar 3, 2026", type: "Missing Out" }
            ]
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to get missed punches", error: error.message });
    }
};

// 10. Employee of the Month
exports.getEmployeeOfTheMonth = async (req, res) => {
    try {
        // Query logic to fetch the employee of the month
        // Mocking the data based on provided request requirements
        res.status(200).json({
            status: "Success",
            statusCode: 200,
            data: [
                {
                    "EmployeeOfTheMonthID": 1,
                    "EmployeeID": 1,
                    "Name": "Durgesh Jadav",
                    "MonthOfYear": "2026-01",
                    "CreatedDate": "2026-01-06 09:11:32",
                    "UpdatedDate": "2026-01-06 09:11:32"
                }
            ]
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to get employee of the month", error: error.message });
    }
};

// 11. DOB / Birthdays
exports.getDOB = async (req, res) => {
    try {
        // Query logic to fetch todays and current month birthdays
        res.status(200).json({
            status: "Success",
            data: {
                todays_birthdays: [
                    {
                        "name": "Jainish Gamit",
                        "dob": "06-01-2026"
                    }
                ],
                current_month_birthdays: []
            }
        });
    } catch (error) {
        res.status(500).json({ status: "Error", message: "Failed to get DOB data", error: error.message });
    }
};
