import React, { createContext, useContext, useState } from 'react';
import { Stack } from 'expo-router';

export type PerformanceStatus = 'Top Performer' | 'On Target' | 'Below Target' | 'Watch';

export interface PerformanceEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  location: string;
  avatarUrl: string;
  score: number;
  scoreChange: number; // positive or negative
  status: PerformanceStatus;
  kpi: {
    tasks: number;
    attendance: number;
    collab: number;
  };
  monthlyProgress: number[];
  goals: {
    title: string;
    progress: number;
    status: 'On Track' | 'In Progress' | 'At Risk';
  }[];
  improvementNotes: string[];
}

export interface ReviewFeedback {
  id: string;
  employeeId: string;
  reviewerName: string;
  reviewerRole: string;
  reviewerAvatar: string;
  comment: string;
  rating: number; // 1-5
  status: 'Excellent' | 'Good' | 'Pending';
  timeAgo: string;
}

export interface PerformanceReport {
  id: string;
  name: string;
  date: string;
  size: string;
  status: 'READY' | 'VIEW';
}

interface PerformanceContextType {
  employees: PerformanceEmployee[];
  feedbacks: ReviewFeedback[];
  reports: PerformanceReport[];
  addFeedback: (fb: ReviewFeedback) => void;
  generateReport: () => void;
}

const INITIAL_EMPLOYEES: PerformanceEmployee[] = [
  {
    id: 'emp1',
    name: 'Alex Johnson',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    avatarUrl: 'https://i.pravatar.cc/150?u=AlexJohnson',
    score: 90,
    scoreChange: 5,
    status: 'Top Performer',
    kpi: { tasks: 98, attendance: 100, collab: 84 },
    monthlyProgress: [80, 85, 82, 88, 90],
    goals: [
      { title: 'Complete Project Alpha', progress: 75, status: 'On Track' },
      { title: 'Improve response time', progress: 40, status: 'In Progress' }
    ],
    improvementNotes: [
      'Focus on mentoring junior developers during code reviews to share system knowledge.',
      'Aim to reduce technical debt in the legacy payment module by end of Q3.'
    ]
  },
  {
    id: 'emp2',
    name: 'Sarah Jenkins',
    role: 'Senior UI Designer',
    department: 'Design',
    location: 'New York, NY',
    avatarUrl: 'https://i.pravatar.cc/150?u=SarahJenkins',
    score: 88,
    scoreChange: 2,
    status: 'On Target',
    kpi: { tasks: 90, attendance: 95, collab: 92 },
    monthlyProgress: [82, 84, 85, 87, 88],
    goals: [
      { title: 'Design System V2 Update', progress: 60, status: 'In Progress' }
    ],
    improvementNotes: [
      'Excellent design work. Focus more on cross-team communication.'
    ]
  },
  {
    id: 'emp3',
    name: 'Michael Chen',
    role: 'Product Designer',
    department: 'Product',
    location: 'Austin, TX',
    avatarUrl: 'https://i.pravatar.cc/150?u=MichaelChen',
    score: 76,
    scoreChange: -2,
    status: 'Watch',
    kpi: { tasks: 75, attendance: 98, collab: 80 },
    monthlyProgress: [80, 78, 77, 75, 76],
    goals: [
      { title: 'User Research Q4', progress: 20, status: 'At Risk' }
    ],
    improvementNotes: [
      'Needs to complete user research interviews sooner.'
    ]
  },
  {
    id: 'emp4',
    name: 'Emily Rodriguez',
    role: 'Sales Ops',
    department: 'Sales',
    location: 'Chicago, IL',
    avatarUrl: 'https://i.pravatar.cc/150?u=EmilyRodriguez',
    score: 91,
    scoreChange: 4,
    status: 'Top Performer',
    kpi: { tasks: 100, attendance: 100, collab: 95 },
    monthlyProgress: [85, 87, 88, 90, 91],
    goals: [
      { title: 'Q3 Sales Quota', progress: 100, status: 'On Track' }
    ],
    improvementNotes: [
      'Outstanding sales performance. Consider mentoring new hires.'
    ]
  }
];

const INITIAL_FEEDBACKS: ReviewFeedback[] = [
  {
    id: 'fb1',
    employeeId: 'emp1',
    reviewerName: 'Sarah Chen',
    reviewerRole: 'Senior UX Designer',
    reviewerAvatar: 'https://i.pravatar.cc/150?u=SarahChen',
    comment: 'Sarah consistently exceeds expectations in her design system contributions. Her collaborative approach has significantly improved team velocity.',
    rating: 5,
    status: 'Excellent',
    timeAgo: '1 day ago'
  },
  {
    id: 'fb2',
    employeeId: 'emp1',
    reviewerName: 'Marcus Yahl',
    reviewerRole: 'Frontend Dev',
    reviewerAvatar: 'https://i.pravatar.cc/150?u=Marcus',
    comment: 'Great progress on the React migration. Looking for more proactive communication regarding blocks.',
    rating: 4,
    status: 'Good',
    timeAgo: '3 days ago'
  },
  {
    id: 'fb3',
    employeeId: 'emp2',
    reviewerName: 'Jordan Doe',
    reviewerRole: 'Junior Analyst',
    reviewerAvatar: 'https://i.pravatar.cc/150?u=Jordan',
    comment: 'Draft: Showing promising growth in data visualization skills...',
    rating: 0,
    status: 'Pending',
    timeAgo: 'Draft saved 2h ago'
  }
];

const INITIAL_REPORTS: PerformanceReport[] = [
  {
    id: 'rep1',
    name: 'Q4 Performance Audit',
    date: 'Generated Today, 10:45 AM',
    size: '1.2 MB',
    status: 'READY'
  },
  {
    id: 'rep2',
    name: 'November Department Summary',
    date: 'Oct 01, 2023',
    size: '3.2 MB',
    status: 'VIEW'
  }
];

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) throw new Error('usePerformance must be used within PerformanceProvider');
  return context;
}

export default function PerformanceLayout() {
  const [employees] = useState<PerformanceEmployee[]>(INITIAL_EMPLOYEES);
  const [feedbacks, setFeedbacks] = useState<ReviewFeedback[]>(INITIAL_FEEDBACKS);
  const [reports, setReports] = useState<PerformanceReport[]>(INITIAL_REPORTS);

  const addFeedback = (fb: ReviewFeedback) => {
    setFeedbacks([fb, ...feedbacks]);
  };

  const generateReport = () => {
    const newReport: PerformanceReport = {
      id: Math.random().toString(),
      name: `Ad-Hoc Report ${new Date().toLocaleDateString()}`,
      date: `Generated Just Now`,
      size: '0.8 MB',
      status: 'READY'
    };
    setReports([newReport, ...reports]);
  };

  return (
    <PerformanceContext.Provider value={{ employees, feedbacks, reports, addFeedback, generateReport }}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="employee/[id]" />
        <Stack.Screen name="feedbacks" />
        <Stack.Screen name="reports" />
        <Stack.Screen name="add-feedback" options={{ presentation: 'modal' }} />
      </Stack>
    </PerformanceContext.Provider>
  );
}
