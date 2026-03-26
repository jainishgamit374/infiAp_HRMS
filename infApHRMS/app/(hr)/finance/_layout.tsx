import React, { createContext, useContext, useState } from 'react';
import { Stack } from 'expo-router';

export interface PayrollEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  avatarUrl: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netPay: number;
  status: 'Processed' | 'Pending' | 'On Hold';
  payDate: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  month: string;
  year: string;
  grossPay: number;
  tax: number;
  netPay: number;
  status: 'Generated' | 'Sent' | 'Downloaded';
}

interface FinanceContextType {
  payroll: PayrollEmployee[];
  payslips: Payslip[];
  processSalary: (id: string) => void;
  processAllPending: () => void;
  generatePayslip: (employeeId: string) => void;
}

const INITIAL_PAYROLL: PayrollEmployee[] = [
  { id: 'p1', name: 'Alex Johnson', role: 'Sr. Software Engineer', department: 'Engineering', avatarUrl: 'https://i.pravatar.cc/150?u=AlexJohnson', baseSalary: 95000, bonus: 5000, deductions: 12000, netPay: 88000, status: 'Processed', payDate: 'Mar 25, 2026' },
  { id: 'p2', name: 'Sarah Jenkins', role: 'Senior UI Designer', department: 'Design', avatarUrl: 'https://i.pravatar.cc/150?u=SarahJenkins', baseSalary: 85000, bonus: 3000, deductions: 10000, netPay: 78000, status: 'Pending', payDate: 'Mar 30, 2026' },
  { id: 'p3', name: 'Michael Chen', role: 'Product Designer', department: 'Product', avatarUrl: 'https://i.pravatar.cc/150?u=MichaelChen', baseSalary: 72000, bonus: 2000, deductions: 8500, netPay: 65500, status: 'Pending', payDate: 'Mar 30, 2026' },
  { id: 'p4', name: 'Emily Rodriguez', role: 'Sales Ops', department: 'Sales', avatarUrl: 'https://i.pravatar.cc/150?u=EmilyRodriguez', baseSalary: 68000, bonus: 8000, deductions: 9000, netPay: 67000, status: 'Processed', payDate: 'Mar 25, 2026' },
  { id: 'p5', name: 'David Lee', role: 'DevOps Engineer', department: 'Engineering', avatarUrl: 'https://i.pravatar.cc/150?u=DavidLee', baseSalary: 90000, bonus: 4000, deductions: 11000, netPay: 83000, status: 'On Hold', payDate: 'Mar 30, 2026' },
];

const INITIAL_PAYSLIPS: Payslip[] = [
  { id: 'ps1', employeeId: 'p1', month: 'March', year: '2026', grossPay: 100000, tax: 12000, netPay: 88000, status: 'Sent' },
  { id: 'ps2', employeeId: 'p4', month: 'March', year: '2026', grossPay: 76000, tax: 9000, netPay: 67000, status: 'Generated' },
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider');
  return ctx;
}

export default function FinanceLayout() {
  const [payroll, setPayroll] = useState<PayrollEmployee[]>(INITIAL_PAYROLL);
  const [payslips, setPayslips] = useState<Payslip[]>(INITIAL_PAYSLIPS);

  const processSalary = (id: string) => {
    setPayroll(prev => prev.map(p => p.id === id ? { ...p, status: 'Processed' as const } : p));
  };

  const processAllPending = () => {
    setPayroll(prev => prev.map(p => p.status === 'Pending' ? { ...p, status: 'Processed' as const } : p));
  };

  const generatePayslip = (employeeId: string) => {
    const emp = payroll.find(p => p.id === employeeId);
    if (!emp) return;
    const newSlip: Payslip = { id: Math.random().toString(36).substring(7), employeeId, month: 'March', year: '2026', grossPay: emp.baseSalary + emp.bonus, tax: emp.deductions, netPay: emp.netPay, status: 'Generated' };
    setPayslips(prev => [newSlip, ...prev]);
  };

  return (
    <FinanceContext.Provider value={{ payroll, payslips, processSalary, processAllPending, generatePayslip }}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="salary-processing" />
        <Stack.Screen name="payslips" />
      </Stack>
    </FinanceContext.Provider>
  );
}
