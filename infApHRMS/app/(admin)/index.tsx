import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AdminBottomNav } from '../../components/AdminBottomNav';

const { width } = Dimensions.get('window');

const STATS = [
  { label: 'Departments', value: '12', icon: 'business-outline', color: '#5a55d2' },
  { label: 'Employees', value: '248', icon: 'people-outline', color: '#0ea5e9' },
  { label: 'Active Jobs', value: '18', icon: 'briefcase-outline', color: '#10b981' },
];

const QUICK_ACTIONS = [
  { label: 'Add Employee', icon: 'person-add-outline', route: '/(admin)/staff', color: '#5a55d2' },
  { label: 'Create Department', icon: 'business-outline', route: '/(admin)/departments', color: '#0ea5e9' },
  { label: 'Post Job', icon: 'megaphone-outline', route: '/(admin)/recruitment', color: '#10b981' },
];

const DEPARTMENTS = [
  { name: 'Engineering', manager: 'Alex Rivera', staffCount: 42 },
  { name: 'Marketing', manager: 'Sarah Chen', staffCount: 28 },
  { name: 'Human Resources', manager: 'James Wilson', staffCount: 12 },
];

const LEAVE_REQUESTS = [
  { id: '1', name: 'John Doe', type: 'Sick Leave', duration: 'Mar 24 - Mar 26 (3 days)', avatar: 'JD' },
  { id: '2', name: 'Emily Blunt', type: 'Annual Leave', duration: 'Apr 01 - Apr 05 (5 days)', avatar: 'EB' },
];

const RECENT_ACTIVITY = [
  { id: '1', title: 'Payroll processed', time: '2 hours ago', icon: 'card-outline', color: '#5a55d2' },
  { id: '2', title: 'New hire: Marcus Johnson', time: '5 hours ago', icon: 'person-add-outline', color: '#10b981' },
  { id: '3', title: 'Announcements: Q1 Review', time: 'Yesterday', icon: 'notifications-outline', color: '#f59e0b' },
];

export default function AdminDashboard() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const staggerAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const animations = staggerAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 200 + index * 100,
        useNativeDriver: true,
      })
    );
    Animated.stagger(100, animations).start();
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

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View>
            <Text style={styles.greetingText}>Welcome Back,</Text>
            <Text style={styles.adminName}>Admin 👋</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileInitial}>AD</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Summary Stats */}
        <Animated.View style={[styles.statsContainer, { opacity: staggerAnims[0] }]}>
          {STATS.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: stat.color + '15' }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View style={[styles.section, { opacity: staggerAnims[1] }]}>
          {renderSectionHeader('Quick Actions')}
          <View style={styles.quickActionsGrid}>
            {QUICK_ACTIONS.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionItem}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.7}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color="#fff" />
                </View>
                <Text style={styles.quickActionText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Key Insights */}
        <Animated.View style={[styles.section, { opacity: staggerAnims[2] }]}>
          {renderSectionHeader('Key Insights')}
          <View style={styles.insightsRow}>
            <TouchableOpacity style={[styles.insightCard, { backgroundColor: '#f0f0ff' }]}>
              <View style={styles.insightIconContainer}>
                <Ionicons name="calendar-outline" size={24} color="#5a55d2" />
              </View>
              <View>
                <Text style={styles.insightValue}>12</Text>
                <Text style={styles.insightLabel}>Pending Leaves</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.insightCard, { backgroundColor: '#eefcf6' }]}>
              <View style={[styles.insightIconContainer, { backgroundColor: '#dcfce7' }]}>
                <Ionicons name="cash-outline" size={24} color="#10b981" />
              </View>
              <View>
                <Text style={styles.insightValue}>$42k</Text>
                <Text style={styles.insightLabel}>Monthly Payroll</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Departments */}
        <Animated.View style={[styles.section, { opacity: staggerAnims[3] }]}>
          {renderSectionHeader('Departments', 'View All', () => router.push('/(admin)/departments'))}
          {DEPARTMENTS.map((dept, index) => (
            <TouchableOpacity key={index} style={styles.departmentCard} activeOpacity={0.7}>
              <View style={styles.deptInfo}>
                <Text style={styles.deptName}>{dept.name}</Text>
                <Text style={styles.deptManager}>Manager: {dept.manager}</Text>
              </View>
              <View style={styles.staffCountBadge}>
                <Text style={styles.staffCountText}>{dept.staffCount} Staff</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Active Recruitment */}
        <Animated.View style={[styles.section, { opacity: staggerAnims[4] }]}>
          {renderSectionHeader('Active Recruitment')}
          <View style={styles.recruitmentCard}>
            <View style={styles.recruitmentHeader}>
              <View>
                <Text style={styles.jobRole}>Senior React Developer</Text>
                <Text style={styles.applicantCount}>24 Applicants</Text>
              </View>
              <TouchableOpacity style={styles.reviewButton}>
                <Text style={styles.reviewButtonText}>Review Candidates</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Leave Requests */}
        <Animated.View style={[styles.section, { opacity: staggerAnims[5] }]}>
          {renderSectionHeader('Leave Requests')}
          {LEAVE_REQUESTS.map((request) => (
            <View key={request.id} style={styles.leaveCard}>
              <View style={styles.leaveHeader}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{request.avatar}</Text>
                </View>
                <View style={styles.leaveInfo}>
                  <Text style={styles.employeeName}>{request.name}</Text>
                  <Text style={styles.leaveType}>{request.type}</Text>
                  <Text style={styles.leaveDuration}>{request.duration}</Text>
                </View>
              </View>
              <View style={styles.leaveActions}>
                <TouchableOpacity style={styles.rejectButton}>
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.approveButton}>
                  <Text style={styles.approveButtonText}>Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View style={[styles.section, { opacity: staggerAnims[6], marginBottom: 80 }]}>
          {renderSectionHeader('Recent Activity')}
          <View style={styles.activityList}>
            {RECENT_ACTIVITY.map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={[styles.activityIcon, { backgroundColor: activity.color + '15' }]}>
                  <Ionicons name={activity.icon as any} size={20} color={activity.color} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
      <AdminBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  adminName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: '#5a55d2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: (width - 60) / 3,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  viewAllText: {
    fontSize: 14,
    color: '#5a55d2',
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: (width - 60) / 3,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textAlign: 'center',
  },
  insightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  insightCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  insightIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  insightLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  departmentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  deptInfo: {
    flex: 1,
  },
  deptName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  deptManager: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  staffCountBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  staffCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  recruitmentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  recruitmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobRole: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  applicantCount: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 2,
  },
  reviewButton: {
    backgroundColor: '#5a55d2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  leaveCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  leaveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b82f6',
  },
  leaveInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  leaveType: {
    fontSize: 13,
    color: '#ef4444',
    fontWeight: '600',
  },
  leaveDuration: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  leaveActions: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  approveButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#5a55d2',
    alignItems: 'center',
  },
  approveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  activityTime: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
});
