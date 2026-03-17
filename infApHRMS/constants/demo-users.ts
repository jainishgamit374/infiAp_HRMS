// Demo users for local development/testing
// Each user has predefined credentials and a role

export type UserRole = 'employee' | 'hr' | 'admin';

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar: string; // initials
  department: string;
  designation: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'emp-001',
    name: 'Sneha Desai',
    email: 'sneha@infiap.com',
    password: '123456',
    role: 'employee',
    avatar: 'SD',
    department: 'Engineering',
    designation: 'Senior Product Designer',
  },
  {
    id: 'hr-001',
    name: 'Priya Sharma',
    email: 'priya@infiap.com',
    password: '123456',
    role: 'hr',
    avatar: 'PS',
    department: 'Human Resources',
    designation: 'HR Manager',
  },
  {
    id: 'admin-001',
    name: 'Rajesh Kumar',
    email: 'rajesh@infiap.com',
    password: '123456',
    role: 'admin',
    avatar: 'RK',
    department: 'Administration',
    designation: 'System Administrator',
  },
];

/**
 * Authenticate a demo user by email, password, and role.
 * Returns the user if credentials match, otherwise null.
 */
export function authenticateDemoUser(
  email: string,
  password: string,
  role: UserRole
): DemoUser | null {
  const user = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role
  );
  return user || null;
}
