import React, { createContext, useContext, useState, ReactNode } from 'react';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'DRAFT';

export interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  days: number;
  status: LeaveStatus;
  appliedDate: string;
  rejectionReason?: string;
  employeeName?: string;
}

interface LeaveContextType {
  leaves: LeaveRequest[];
  balances: {
    privilege: number;
    casual: number;
    sick: number;
  };
  applyLeave: (leave: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate' | 'days'>, status?: LeaveStatus) => void;
  updateLeave: (id: string, leave: Partial<Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>>) => void;
  cancelLeave: (id: string) => void;
  mockReviewLeave: (id: string, status: 'APPROVED' | 'REJECTED', reason?: string) => void;
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

export const LeaveProvider = ({ children }: { children: ReactNode }) => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([
    {
      id: '1',
      employeeName: 'Sarah Jenkins',
      type: 'Privilege Leave',
      startDate: '2026-10-24',
      endDate: '2026-10-25',
      days: 2,
      reason: 'Family Event',
      status: 'APPROVED',
      appliedDate: '2026-10-15',
    },
    {
      id: '2',
      employeeName: 'John Doe',
      type: 'Casual Leave',
      startDate: '2026-11-02',
      endDate: '2026-11-02',
      days: 1,
      reason: 'Personal Work',
      status: 'PENDING',
      appliedDate: '2026-10-20',
    },
    {
      id: '3',
      employeeName: 'Michael Chen',
      type: 'Sick Leave',
      startDate: '2026-09-10',
      endDate: '2026-09-12',
      days: 3,
      reason: 'Viral Fever',
      status: 'REJECTED',
      appliedDate: '2026-09-08',
      rejectionReason: 'Not enough sick leave balance. Please convert to casual leave.',
    },
    {
      id: '4',
      employeeName: 'Emma Watson',
      type: 'Maternity Leave',
      startDate: '2026-12-01',
      endDate: '2026-12-31',
      days: 31,
      reason: 'Maternity checkup and rest',
      status: 'APPROVED',
      appliedDate: '2026-11-15',
    },
  ]);

  const [balances, setBalances] = useState({
    privilege: 12,
    casual: 5,
    sick: 8,
  });

  const applyLeave = (leave: Omit<LeaveRequest, 'id' | 'status' | 'appliedDate' | 'days'>, status: LeaveStatus = 'PENDING') => {
    // Calculate days (simple difference for mock)
    const start = new Date(leave.startDate);
    const end = new Date(leave.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newLeave: LeaveRequest = {
      ...leave,
      id: Math.random().toString(36).substr(2, 9),
      employeeName: 'Jainish Gamit',
      status: status,
      appliedDate: new Date().toISOString().split('T')[0],
      days: diffDays || 0,
    };

    setLeaves((prev) => [newLeave, ...prev]);
  };

  const updateLeave = (id: string, updatedFields: Partial<Omit<LeaveRequest, 'id' | 'status' | 'appliedDate'>>) => {
    setLeaves((prev) => 
      prev.map((l) => {
        if (l.id === id) {
          let newDays = l.days;
          if (updatedFields.startDate || updatedFields.endDate) {
            const start = new Date(updatedFields.startDate || l.startDate);
            const end = new Date(updatedFields.endDate || l.endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            newDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          }
          return { ...l, ...updatedFields, days: newDays };
        }
        return l;
      })
    );
  };

  const cancelLeave = (id: string) => {
    setLeaves((prev) => 
      prev.map((l) => l.id === id ? { ...l, status: 'CANCELLED' } : l)
    );
  };

  const mockReviewLeave = (id: string, status: 'APPROVED' | 'REJECTED', reason?: string) => {
    setLeaves((prev) => 
      prev.map((l) => {
        if (l.id === id) {
          // If approved, deduct from balance (mock logic)
          if (status === 'APPROVED') {
             const typeKey = l.type.toLowerCase().split(' ')[0] as keyof typeof balances;
             if (balances[typeKey] !== undefined) {
               setBalances(prevBal => ({
                 ...prevBal,
                 [typeKey]: Math.max(0, prevBal[typeKey] - l.days)
               }));
             }
          }
          return { ...l, status, ...(status === 'REJECTED' && reason ? { rejectionReason: reason } : {}) };
        }
        return l;
      })
    );
  };

  return (
    <LeaveContext.Provider value={{ leaves, balances, applyLeave, updateLeave, cancelLeave, mockReviewLeave }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (context === undefined) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
};
