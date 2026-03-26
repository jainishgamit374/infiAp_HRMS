import React, { createContext, useContext, useState } from 'react';
import { Stack } from 'expo-router';

export type CandidateStatus = 'Applied' | 'Shortlisted' | 'Interview' | 'Selected' | 'Rejected' | 'Hire' | 'Hold';

export interface Candidate {
  id: string;
  name: string;
  role: string;
  department: string;
  status: CandidateStatus;
  experience: string;
  location: string;
  email: string;
  phone: string;
  portfolio: string;
  summary: string;
  skills: string[];
  pastRoles: string[];
  appliedDate: string;
  avatarUrl: string;
  salary?: string;
  time?: string;
}

export interface Feedback {
  candidateId: string;
  technical: number;
  communication: number;
  problemSolving: number;
  cultural: number;
  strengths: string;
  improvements: string;
  recommendation: 'Strong Hire' | 'Hire' | 'Hold' | 'Reject';
}

interface RecruitmentContextType {
  candidates: Candidate[];
  updateStatus: (id: string, newStatus: CandidateStatus) => void;
  addFeedback: (feedback: Feedback) => void;
  addCandidate: (c: Candidate) => void;
  feedbacks: Feedback[];
}

const RecruitmentContext = createContext<RecruitmentContextType | null>(null);

export const useRecruitment = () => {
  const context = useContext(RecruitmentContext);
  if (!context) throw new Error('useRecruitment must be used within Provider');
  return context;
};

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Mark Wilson',
    role: 'Senior UI/UX Designer',
    department: 'Design Team',
    status: 'Applied',
    experience: '8+ Years',
    location: 'Remote (San Francisco, CA)',
    email: 'mark.wilson@example.com',
    phone: '+1 (555) 012-3456',
    portfolio: 'wilson-designs.com',
    summary: 'Senior UI/UX Designer with over 8 years of experience in creating user-centric digital products. Expert in building scalable design systems and leading cross-functional teams for high-growth SaaS companies.',
    skills: ['Figma', 'Design Systems', 'React', 'UX Research', 'Leadership', 'Agile'],
    pastRoles: [
      'Senior UI Designer, TechFlow Systems • 2020 – Present',
      'Product Designer, Brightly Creative • 2017 – 2020'
    ],
    appliedDate: 'Oct 12, 2023',
    avatarUrl: 'https://i.pravatar.cc/150?u=mark',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'Lead Frontend Developer',
    department: 'Engineering',
    status: 'Shortlisted',
    experience: '6 Years',
    location: 'London, UK',
    email: 'sarah.c@example.com',
    phone: '+44 7700 900077',
    portfolio: 'github.com/sarahcodes',
    summary: 'Passionate frontend leader building fast and accessible web apps. Expertise in React and performance optimization.',
    skills: ['React', 'TypeScript', 'Next.js', 'Redux'],
    pastRoles: ['Frontend Eng at WebCorp'],
    appliedDate: 'Oct 20, 2023',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah',
    time: '5 days ago'
  },
  {
    id: '3',
    name: 'James Aris',
    role: 'Product Manager',
    department: 'Growth Team',
    status: 'Selected',
    experience: '4 Years',
    location: 'New York, NY',
    email: 'james.a@example.com',
    phone: '+1 (555) 987-6543',
    portfolio: 'linkedin.com/in/jamesaris',
    summary: 'Data-driven Product Manager with a track record of launching successful mobile applications.',
    skills: ['Product Strategy', 'Agile', 'Jira', 'Data Analytics'],
    pastRoles: ['Associate PM at StartupInc'],
    appliedDate: 'Oct 15, 2023',
    avatarUrl: 'https://i.pravatar.cc/150?u=james',
    time: '1 week ago'
  },
  {
    id: '4',
    name: 'Helena Vance',
    role: 'Data Analyst',
    department: 'Analytics',
    status: 'Rejected',
    experience: '3 Years',
    location: 'Chicago, IL',
    email: 'helena.v@example.com',
    phone: '+1 (555) 567-8901',
    portfolio: 'github.com/helenav',
    summary: 'Detail-oriented Data Analyst proficient in SQL, Python, and Tableau.',
    skills: ['SQL', 'Python', 'Tableau', 'Excel'],
    pastRoles: ['Data Assistant at InfoSys'],
    appliedDate: 'Oct 21, 2023',
    avatarUrl: 'https://i.pravatar.cc/150?u=helena',
    time: '3 days ago'
  },
  {
    id: '5',
    name: 'Alex Rivera',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    status: 'Applied',
    experience: '7 Years',
    location: 'Remote (San Francisco, CA)',
    email: 'alex.r@example.com',
    phone: '+1 (555) 444-3333',
    portfolio: 'github.com/arivera',
    summary: 'Backend engineer specializing in highly scalable node.js microservices.',
    skills: ['Node.js', 'AWS', 'Docker', 'Kubernetes'],
    pastRoles: ['Backend Dev at TechSolutions'],
    appliedDate: 'Oct 24, 2023',
    avatarUrl: 'https://i.pravatar.cc/150?u=alex',
  },
  {
    id: '6',
    name: 'Marcus Thompson',
    role: 'Account Executive',
    department: 'Sales',
    status: 'Applied',
    experience: '5 Years',
    location: 'New York, NY',
    email: 'marcus.t@example.com',
    phone: '+1 (555) 222-1111',
    portfolio: 'linkedin.com/in/marcus-t',
    summary: 'Top-performing SaaS account executive.',
    skills: ['B2B Sales', 'Salesforce', 'Negotiation'],
    pastRoles: ['Sales Rep at SalesForce'],
    appliedDate: 'Oct 22, 2023',
    avatarUrl: 'https://i.pravatar.cc/150?u=marcus',
  },
  {
    id: '7',
    name: 'Sarah Connor',
    role: 'Senior UI/UX Designer',
    department: 'Design',
    status: 'Applied',
    experience: '6+ Years Exp',
    location: 'Remote (UK)',
    email: 's.connor@example.com',
    phone: '+44 7000 111111',
    portfolio: 'behance.net/sarahc',
    summary: 'Creative UI designer.',
    skills: ['Figma', 'UI', 'UX'],
    pastRoles: ['UI Designer'],
    appliedDate: 'Oct 25, 2023',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarahc',
  },
  {
    id: '8',
    name: 'Elena Gilbert',
    role: 'Product Manager',
    department: 'Product',
    status: 'Interview',
    experience: '8+ Years Exp',
    location: 'Austin, TX',
    email: 'elena.g@example.com',
    phone: '+1 555 123 9999',
    portfolio: 'elena-product.com',
    summary: 'Experienced PM driving product vision.',
    skills: ['Product Management'],
    pastRoles: ['PM at Startup'],
    appliedDate: 'Oct 20, 2023',
    avatarUrl: 'https://i.pravatar.cc/150?u=elena',
    time: 'Today 2:30 PM'
  },
  {
    id: '9',
    name: 'Kyle Reese',
    role: 'Frontend Engineer (React)',
    department: 'Engineering',
    status: 'Applied',
    experience: '2 Years Exp',
    location: 'English, French',
    email: 'kyle.r@example.com',
    phone: '+1 555 555 5555',
    portfolio: 'github.com/kyler',
    summary: 'React developer.',
    skills: ['React'],
    pastRoles: ['Jr Dev'],
    appliedDate: 'Oct 24, 2023',
    avatarUrl: 'https://i.pravatar.cc/150?u=kyle',
  }
];

export default function RecruitmentLayout() {
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  const updateStatus = (id: string, newStatus: CandidateStatus) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const addFeedback = (feedback: Feedback) => {
    setFeedbacks((prev) => [...prev, feedback]);
    let newStatus: string = feedback.recommendation;
    if (newStatus === 'Strong Hire') newStatus = 'Hire';
    if (newStatus === 'Reject') newStatus = 'Rejected';
    updateStatus(feedback.candidateId, newStatus as CandidateStatus);
  };

  const addCandidate = (c: Candidate) => {
    setCandidates((prev) => [c, ...prev]);
  };

  return (
    <RecruitmentContext.Provider
      value={{ candidates, updateStatus, addFeedback, addCandidate, feedbacks }}
    >
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="add-candidate" options={{ presentation: 'modal' }} />
        <Stack.Screen name="candidate-tracking" />
        <Stack.Screen name="review-applications" />
        <Stack.Screen name="candidate/[id]" />
        <Stack.Screen name="feedback/[id]" />
        <Stack.Screen name="feedback-status" />
      </Stack>
    </RecruitmentContext.Provider>
  );
}
