import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AdminBottomNav } from '../../components/AdminBottomNav';

const { width } = Dimensions.get('window');

// --- ANIMATED COUNTER COMPONENT ---
const AnimatedCounter = ({ target, duration = 1200 }: { target: number; duration?: number }) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    animValue.addListener(({ value }) => setDisplayValue(Math.round(value)));
    Animated.timing(animValue, {
      toValue: target,
      duration,
      useNativeDriver: false,
    }).start();
    return () => animValue.removeAllListeners();
  }, [target]);

  return <Text style={styles.statValue}>{displayValue.toLocaleString()}</Text>;
};

// --- STATS ---
const STATS = [
  { label: 'Departments', value: 12, icon: 'business-outline', color: '#5a55d2' },
  { label: 'Employees', value: 248, icon: 'people-outline', color: '#0ea5e9' },
  { label: 'Active Jobs', value: 18, icon: 'briefcase-outline', color: '#10b981' },
];

// --- QUICK ACTIONS MODULES ---
const QUICK_ACTION_SECTIONS = [
  {
    title: '🏢 Department Management',
    actions: [
      { label: 'Add Employee', sub: 'New staff member', icon: 'person-add-outline', route: '/(admin)/add-employee', color: '#4f46e5' },
      { label: 'Create Department', sub: 'Add new dept', icon: 'business-outline', route: '/(admin)/departments', color: '#5a55d2' },
      { label: 'Manage Teams', sub: 'View all teams', icon: 'people-circle-outline', route: '/(admin)/manage-teams', color: '#6366f1' },
    ],
  },
  {
    title: '💰 Payroll Management',
    actions: [
      { label: 'Salary Structure', sub: 'Pay breakdown', icon: 'wallet-outline', route: '/(admin)/salary-structure', color: '#0ea5e9' },
      { label: 'Payslip Generation', sub: 'Generate slips', icon: 'document-text-outline', route: '/(admin)/payslip-generation', color: '#06b6d4' },
      { label: 'Payroll Dashboard', sub: 'Overview & stats', icon: 'stats-chart-outline', route: '/(admin)/payroll', color: '#0284c7' },
    ],
  },
  {
    title: '📢 Recruitment Control',
    actions: [
      { label: 'Job Posting', sub: 'Post new jobs', icon: 'megaphone-outline', route: '/(admin)/job-posting', color: '#10b981' },
      { label: 'Candidate Tracking', sub: 'Track applicants', icon: 'git-branch-outline', route: '/(admin)/candidate-tracking', color: '#059669' },
      { label: 'Interview Mgmt', sub: 'Schedule interviews', icon: 'videocam-outline', route: '/(admin)/interview-management', color: '#047857' },
    ],
  },
  {
    title: '📄 Other Modules',
    actions: [
      { label: 'Company Policies', sub: 'View all policies', icon: 'document-outline', route: '/(admin)/policies', color: '#f59e0b' },
      { label: 'Security Docs', sub: 'Confidential files', icon: 'shield-outline', route: '/(admin)/security-docs', color: '#d97706' },
      { label: 'System Settings', sub: 'App configuration', icon: 'settings-outline', route: '/(admin)/settings', color: '#92400e' },
    ],
  },
];

// --- LEAVE REQUESTS & RECENT ACTIVITY ---
const LEAVE_REQUESTS = [
  { id: '1', name: 'John Doe', type: 'Sick Leave', duration: 'Mar 24 - Mar 26 (3 days)', avatar: 'JD' },
  { id: '2', name: 'Emily Blunt', type: 'Annual Leave', duration: 'Apr 01 - Apr 05 (5 days)', avatar: 'EB' },
];

const RECENT_ACTIVITY = [
  { id: '1', title: 'Payroll processed for March', time: '2 hours ago', icon: 'card-outline', color: '#5a55d2' },
  { id: '2', title: 'New hire: Marcus Johnson', time: '5 hours ago', icon: 'person-add-outline', color: '#10b981' },
  { id: '3', title: 'Q1 Review Announcement', time: 'Yesterday', icon: 'notifications-outline', color: '#f59e0b' },
];

const KEY_INSIGHTS = [
  { label: 'Pending Leaves', value: 12, icon: 'calendar-outline', color: '#5a55d2', bg: '#f0f0ff' },
  { label: 'Monthly Payroll', value: '$42k', icon: 'cash-outline', color: '#10b981', bg: '#eefcf6' },
  { label: 'Open Positions', value: 18, icon: 'briefcase-outline', color: '#f59e0b', bg: '#fefce8' },
  { label: 'New Hires (Q1)', value: 15, icon: 'person-add-outline', color: '#0ea5e9', bg: '#eff6ff' },
];

export default function AdminDashboard() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const staggerAnims = useRef(
    Array.from({ length: 10 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    const animations = staggerAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 200 + index * 80,
        useNativeDriver: true,
      })
    );
    Animated.stagger(80, animations).start();
  }, []);

  const renderSectionHeader = (title: string, actionLabel?: string, onAction?: () => void) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.viewAllText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const [leaveRequests, setLeaveRequests] = useState(LEAVE_REQUESTS);

  const handleLeaveAction = (id: string, action: 'approve' | 'reject') => {
    // In a real app, this would be an API call
    setLeaveRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View>
            <Text style={styles.greetingText}>Welcome Back,</Text>
            <Text style={styles.adminName}>Admin 👋</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/(admin)/profile')}
          >
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileInitial}>AD</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Summary Stats with Animated Counters */}
        <Animated.View style={[styles.statsContainer, { opacity: staggerAnims[0] }]}>
          {STATS.map((stat, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.statCard}
              onPress={() => {
                if(stat.label === 'Employees') router.push('/(admin)/staff');
                if(stat.label === 'Active Jobs') router.push('/(admin)/job-posting');
                if(stat.label === 'Departments') router.push('/(admin)/departments');
              }}
            >
              <View style={[styles.statIconContainer, { backgroundColor: stat.color + '15' }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <AnimatedCounter target={stat.value} />
              <Text style={styles.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Key Insights 2x2 Grid */}
        <Animated.View style={[styles.section, { opacity: staggerAnims[1] }]}>
          {renderSectionHeader('Key Insights')}
          <View style={styles.insightsGrid}>
            {KEY_INSIGHTS.map((item, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={[styles.insightCard, { backgroundColor: item.bg }]} 
                activeOpacity={0.7}
                onPress={() => {
                  if(item.label === 'Pending Leaves') router.push('/(admin)/leave-approvals');
                  if(item.label === 'Monthly Payroll') router.push('/(admin)/payroll');
                  if(item.label === 'Open Positions') router.push('/(admin)/job-posting');
                  if(item.label === 'New Hires (Q1)') router.push('/(admin)/staff');
                }}
              >
                <View style={styles.insightTop}>
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
                </View>
                <Text style={styles.insightValue}>{typeof item.value === 'number' ? item.value : item.value}</Text>
                <Text style={styles.insightLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Quick Actions Modules */}
        {QUICK_ACTION_SECTIONS.map((section, sIdx) => (
          <Animated.View key={sIdx} style={[styles.section, { opacity: staggerAnims[2 + sIdx] }]}>
            <Text style={styles.moduleTitle}>{section.title}</Text>
            <View style={styles.quickActionsGrid}>
              {section.actions.map((action, aIdx) => (
                <TouchableOpacity
                  key={aIdx}
                  style={styles.quickActionCard}
                  onPress={() => router.push(action.route as any)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                    <Ionicons name={action.icon as any} size={22} color="#fff" />
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                  <Text style={styles.quickActionSub}>{action.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Leave Requests */}
        {leaveRequests.length > 0 && (
          <Animated.View style={[styles.section, { opacity: staggerAnims[6] }]}>
            {renderSectionHeader('Leave Requests', 'View All', () => router.push('/(admin)/leave-approvals'))}
            {leaveRequests.map((req) => (
              <View key={req.id} style={styles.leaveCard}>
                <View style={styles.leaveHeader}>
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{req.avatar}</Text>
                  </View>
                  <View style={styles.leaveInfo}>
                    <Text style={styles.employeeName}>{req.name}</Text>
                    <Text style={styles.leaveType}>{req.type}</Text>
                    <Text style={styles.leaveDuration}>{req.duration}</Text>
                  </View>
                </View>
                <View style={styles.leaveActions}>
                  <TouchableOpacity 
                    style={styles.rejectButton} 
                    onPress={() => handleLeaveAction(req.id, 'reject')}
                  >
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.approveButton}
                    onPress={() => handleLeaveAction(req.id, 'approve')}
                  >
                    <Text style={styles.approveButtonText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Recent Activity */}
        <Animated.View style={[styles.section, { opacity: staggerAnims[7], marginBottom: 80 }]}>
          {renderSectionHeader('Recent Activity')}
          <View style={styles.activityList}>
            {RECENT_ACTIVITY.map((activity) => (
              <TouchableOpacity 
                key={activity.id} 
                style={styles.activityItem}
                onPress={() => {
                  if(activity.title.includes('Payroll')) router.push('/(admin)/payroll');
                  if(activity.title.includes('hire')) router.push('/(admin)/staff');
                  if(activity.title.includes('Announcement')) router.push('/(admin)/notifications');
                }}
              >
                <View style={[styles.activityIcon, { backgroundColor: activity.color + '15' }]}>
                  <Ionicons name={activity.icon as any} size={20} color={activity.color} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
      <AdminBottomNav />
    </View>
  );
}

const CARD_WIDTH = (width - 60) / 2;

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greetingText: { fontSize: 16, color: '#64748b', fontWeight: '500' },
  adminName: { fontSize: 24, fontWeight: '700', color: '#1e293b' },
  profileButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  profileImagePlaceholder: { width: '100%', height: '100%', borderRadius: 24, backgroundColor: '#5a55d2', justifyContent: 'center', alignItems: 'center' },
  profileInitial: { color: '#fff', fontSize: 18, fontWeight: '700' },

  // Stats
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: { width: (width - 60) / 3, backgroundColor: '#fff', borderRadius: 16, padding: 12, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  statIconContainer: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  statLabel: { fontSize: 11, color: '#64748b', fontWeight: '500', marginTop: 2 },

  // Section
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  viewAllText: { fontSize: 14, color: '#5a55d2', fontWeight: '600' },

  // Key Insights
  insightsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  insightCard: { width: CARD_WIDTH, borderRadius: 18, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  insightTop: { marginBottom: 12 },
  insightValue: { fontSize: 22, fontWeight: '800', color: '#1e293b', marginBottom: 2 },
  insightLabel: { fontSize: 12, fontWeight: '600', color: '#64748b' },

  // Module Quick Actions
  moduleTitle: { fontSize: 15, fontWeight: '800', color: '#475569', marginBottom: 12, letterSpacing: 0.3 },
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  quickActionCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  quickActionIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 4 },
  quickActionLabel: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 2 },
  quickActionSub: { fontSize: 11, fontWeight: '500', color: '#94a3b8' },

  // Leave Cards
  leaveCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  leaveHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatarPlaceholder: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 16, fontWeight: '700', color: '#3b82f6' },
  leaveInfo: { flex: 1 },
  employeeName: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  leaveType: { fontSize: 13, color: '#ef4444', fontWeight: '600' },
  leaveDuration: { fontSize: 12, color: '#64748b', marginTop: 2 },
  leaveActions: { flexDirection: 'row', gap: 12 },
  rejectButton: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  rejectButtonText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  approveButton: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#5a55d2', alignItems: 'center' },
  approveButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },

  // Activity
  activityList: { gap: 16 },
  activityItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  activityIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  activityTime: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
});
