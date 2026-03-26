import React, { createContext, useContext, useState } from 'react';
import { Stack } from 'expo-router';

export type ResignationStatus = 'Pending' | 'Approved' | 'Rejected' | 'In Progress';

export interface ResignationRequest {
  id: string;
  employeeName: string;
  employeeRole: string;
  department: string;
  avatarUrl: string;
  reason: string;
  submittedDate: string;
  lastWorkingDate: string;
  status: ResignationStatus;
  exitSteps: { title: string; completed: boolean }[];
}

interface ResignationContextType {
  requests: ResignationRequest[];
  submitResignation: (r: ResignationRequest) => void;
  approveResignation: (id: string) => void;
  rejectResignation: (id: string) => void;
  completeExitStep: (reqId: string, stepIdx: number) => void;
}

const INITIAL_REQUESTS: ResignationRequest[] = [
  { id: 'r1', employeeName: 'John Parker', employeeRole: 'Backend Developer', department: 'Engineering', avatarUrl: 'https://i.pravatar.cc/150?u=JohnParker', reason: 'Pursuing higher education abroad.', submittedDate: 'Mar 15, 2026', lastWorkingDate: 'Apr 15, 2026', status: 'Pending', exitSteps: [{ title: 'Knowledge Transfer', completed: false }, { title: 'Asset Return', completed: false }, { title: 'Exit Interview', completed: false }, { title: 'Final Settlement', completed: false }] },
  { id: 'r2', employeeName: 'Lisa Wang', employeeRole: 'QA Lead', department: 'Quality', avatarUrl: 'https://i.pravatar.cc/150?u=LisaWang', reason: 'Better opportunity at another firm.', submittedDate: 'Mar 10, 2026', lastWorkingDate: 'Apr 10, 2026', status: 'Approved', exitSteps: [{ title: 'Knowledge Transfer', completed: true }, { title: 'Asset Return', completed: true }, { title: 'Exit Interview', completed: false }, { title: 'Final Settlement', completed: false }] },
  { id: 'r3', employeeName: 'Tom Harris', employeeRole: 'Marketing Manager', department: 'Marketing', avatarUrl: 'https://i.pravatar.cc/150?u=TomHarris', reason: 'Personal reasons.', submittedDate: 'Mar 20, 2026', lastWorkingDate: 'Apr 20, 2026', status: 'Pending', exitSteps: [{ title: 'Knowledge Transfer', completed: false }, { title: 'Asset Return', completed: false }, { title: 'Exit Interview', completed: false }, { title: 'Final Settlement', completed: false }] },
];

const ResignationContext = createContext<ResignationContextType | undefined>(undefined);
export function useResignation() {
  const ctx = useContext(ResignationContext);
  if (!ctx) throw new Error('useResignation must be within provider');
  return ctx;
}

export default function ResignationLayout() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const submitResignation = (r: ResignationRequest) => setRequests(prev => [r, ...prev]);
  const approveResignation = (id: string) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' as const } : r));
  const rejectResignation = (id: string) => setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' as const } : r));
  const completeExitStep = (reqId: string, stepIdx: number) => {
    setRequests(prev => prev.map(r => {
      if (r.id !== reqId) return r;
      const steps = [...r.exitSteps];
      steps[stepIdx] = { ...steps[stepIdx], completed: true };
      return { ...r, exitSteps: steps };
    }));
  };

  return (
    <ResignationContext.Provider value={{ requests, submitResignation, approveResignation, rejectResignation, completeExitStep }}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="requests" />
        <Stack.Screen name="exit-process" />
      </Stack>
    </ResignationContext.Provider>
  );
}
