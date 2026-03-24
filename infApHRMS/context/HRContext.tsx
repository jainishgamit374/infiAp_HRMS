import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Employee {
  id: string;
  name: string;
  department: string;
  role: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  avatar: string;
  manager: string;
  salary: string;
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  avatar: string;
  department?: string;
  reason?: string;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  time: string;
  status: 'info' | 'success' | 'warning';
}

interface HRStats {
  total: number;
  present: number;
  pending: number;
  openJobs: number;
  resignations: number;
  monthlyBudget: string;
  attendanceRate: string;
  performanceScore: string;
  performanceGrowth: string;
}

interface HRContextType {
  employees: Employee[];
  leaves: LeaveRequest[];
  pendingLeaves: LeaveRequest[];
  activities: Activity[];
  stats: HRStats;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  approveLeave: (id: string) => void;
  rejectLeave: (id: string) => void;
  approveBulkLeaves: (ids: string[]) => void;
  rejectBulkLeaves: (ids: string[]) => void;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

const INITIAL_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Sarah Jenkins', department: 'Product', role: 'Senior UX Designer', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=sarahj', manager: 'Alex Thompson', salary: '95,000' },
  { id: '2', name: 'Michael Chen', department: 'Engineering', role: 'Full Stack Developer', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=michael', manager: 'Sarah Jenkins', salary: '88,000' },
  { id: '3', name: 'Emily Davis', department: 'Design', role: 'UI Lead', status: 'On Leave', avatar: 'https://i.pravatar.cc/150?u=emily', manager: 'Alex Thompson', salary: '92,000' },
];

const INITIAL_LEAVES: LeaveRequest[] = [
  { id: '1', employeeName: 'Michael Chen', type: 'Annual Leave', startDate: 'Oct 12', endDate: 'Oct 14', status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=michael', department: 'Engineering', reason: 'Family vacation' },
  { id: '2', employeeName: 'James Wilson', type: 'Sick Leave', startDate: 'Oct 15', endDate: 'Oct 15', status: 'Pending', avatar: 'https://i.pravatar.cc/150?u=james', department: 'Sales', reason: 'Not feeling well' },
  { id: '3', employeeName: 'Sarah Jenkins', type: 'Maternity Leave', startDate: 'Sep 01', endDate: 'Dec 01', status: 'Approved', avatar: 'https://i.pravatar.cc/150?u=sarahj', department: 'Product', reason: 'Maternity leave' },
  { id: '4', employeeName: 'Emily Davis', type: 'Casual Leave', startDate: 'Oct 05', endDate: 'Oct 06', status: 'Rejected', avatar: 'https://i.pravatar.cc/150?u=emily', department: 'Design', reason: 'Personal work' },
];

const INITIAL_ACTIVITIES: Activity[] = [
  { id: '1', type: 'Onboarding', description: 'Added "David Wilson" to Engineering', time: '10:45 AM', status: 'info' },
  { id: '2', type: 'Leave Approved', description: "Michael Chen's request for sick leave", time: '09:15 AM', status: 'success' },
];

export const HRProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(INITIAL_LEAVES);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  
  const pendingLeaves = leaves.filter(l => l.status === 'Pending');

  const [stats, setStats] = useState<HRStats>({
    total: 320,
    present: 280,
    pending: 2, // Init to match mock
    openJobs: 12,
    resignations: 2,
    monthlyBudget: '$85k',
    attendanceRate: '88%',
    performanceScore: '92%',
    performanceGrowth: '+4.5%'
  });

  const addEmployee = (emp: Omit<Employee, 'id'>) => {
    const newEmp = { ...emp, id: Math.random().toString(36).substr(2, 9) };
    setEmployees([...employees, newEmp]);
    setActivities([{
      id: Date.now().toString(),
      type: 'Employee Added',
      description: `New employee "${emp.name}" added to ${emp.department}`,
      time: 'Just now',
      status: 'info'
    }, ...activities]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(employees.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const approveLeave = (leaveId: string) => {
    setLeaves(currentLeaves => currentLeaves.map(l => l.id === leaveId ? { ...l, status: 'Approved' } : l));
    const leave = leaves.find(l => l.id === leaveId);
    if (leave) {
      setStats(s => ({ ...s, pending: Math.max(0, s.pending - 1) }));
      setActivities([{
          id: Date.now().toString(),
          type: 'Leave Approved',
          description: `Approved ${leave.type} for ${leave.employeeName}`,
          time: 'Just now',
          status: 'success'
      }, ...activities]);
    }
  };

  const rejectLeave = (leaveId: string) => {
    setLeaves(currentLeaves => currentLeaves.map(l => l.id === leaveId ? { ...l, status: 'Rejected' } : l));
    const leave = leaves.find(l => l.id === leaveId);
    if (leave) {
      setStats(s => ({ ...s, pending: Math.max(0, s.pending - 1) }));
      setActivities([{
          id: Date.now().toString(),
          type: 'Leave Rejected',
          description: `Rejected ${leave.type} for ${leave.employeeName}`,
          time: 'Just now',
          status: 'warning'
      }, ...activities]);
    }
  };

  const approveBulkLeaves = (ids: string[]) => {
    setLeaves(currentLeaves => currentLeaves.map(l => ids.includes(l.id) ? { ...l, status: 'Approved' } : l));
    setStats(s => ({ ...s, pending: Math.max(0, s.pending - ids.length) }));
    setActivities([{
      id: Date.now().toString(),
      type: 'Bulk Approval',
      description: `Approved ${ids.length} leave requests`,
      time: 'Just now',
      status: 'success'
    }, ...activities]);
  };

  const rejectBulkLeaves = (ids: string[]) => {
    setLeaves(currentLeaves => currentLeaves.map(l => ids.includes(l.id) ? { ...l, status: 'Rejected' } : l));
    setStats(s => ({ ...s, pending: Math.max(0, s.pending - ids.length) }));
    setActivities([{
      id: Date.now().toString(),
      type: 'Bulk Rejection',
      description: `Rejected ${ids.length} leave requests`,
      time: 'Just now',
      status: 'warning'
    }, ...activities]);
  };

  return (
    <HRContext.Provider value={{ 
      employees, 
      leaves,
      pendingLeaves, 
      activities, 
      stats,
      addEmployee, 
      updateEmployee, 
      approveLeave, 
      rejectLeave,
      approveBulkLeaves,
      rejectBulkLeaves
    }}>
      {children}
    </HRContext.Provider>
  );
};

export const useHR = () => {
  const context = useContext(HRContext);
  if (context === undefined) throw new Error('useHR must be used within an HRProvider');
  return context;
};
