import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserProfile {
  name: string;
  role: string;
  avatar: any;
  employeeId: string;
  email: string;
  department: string;
  joiningDate: string;
  settings: {
    darkMode: boolean;
    language: string;
    pushNotifications: boolean;
    emailReports: boolean;
    twoFactorEnabled: boolean;
  };
}

interface UserContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  updateSettings: (updates: Partial<UserProfile['settings']>) => void;
}

const defaultUser: UserProfile = {
  name: 'Sneha Desai',
  role: 'Senior Product Designer',
  avatar: require('../assets/images/sneha.png'),
  employeeId: 'INF-9402',
  email: 'sneha.d@infiap.com',
  department: 'Product Design',
  joiningDate: 'Jan 12, 2021',
  settings: {
    darkMode: false,
    language: 'English (US)',
    pushNotifications: true,
    emailReports: false,
    twoFactorEnabled: true,
  },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(defaultUser);

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const updateSettings = (updates: Partial<UserProfile['settings']>) => {
    setUser((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
  };

  return (
    <UserContext.Provider value={{ user, updateUser, updateSettings }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
