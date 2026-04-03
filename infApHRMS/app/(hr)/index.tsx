import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useHR } from '@/context/HRContext';
import { HRBottomNav } from '@/components/HRBottomNav';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';
import Header from '@/components/layout/Header';
import { useSidebar } from '@/context/SidebarContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ModuleCard = ({
  title,
  icon,
  iconColor,
  options,
  index
}: {
  title: string,
  icon: string,
  iconColor: string,
  options: { label: string, route: string }[],
  index: number
}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(600)}
      style={styles.moduleCard}
    >
      <View style={styles.moduleHeader}>
        <View style={[styles.moduleIconContainer, { backgroundColor: `${iconColor}15` }]}>
          <Ionicons name={icon as any} size={20} color={iconColor} />
        </View>
        <Text style={styles.moduleTitle}>{title}</Text>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((opt, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.optionButton}
            onPress={() => router.push(opt.route as any)}
          >
            <Text style={styles.optionText}>{opt.label}</Text>
            <Ionicons name="chevron-forward" size={12} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

const HRDashboard = () => {
  const { employees, pendingLeaves, activities, approveLeave, rejectLeave, stats } = useHR();
  const [searchQuery, setSearchQuery] = useState('');

  const HR_MODULES = [
    {
      title: 'Employees',
      icon: 'people',
      iconColor: '#5a55d2',
      options: [
        { label: 'Add Employee', route: '/(hr)/add-employee' },
        { label: 'Edit Employee', route: '/(hr)/employee-management' },
        { label: 'View Profiles', route: '/(hr)/employee-management' },
      ]
    },
    {
      title: 'Attendance',
      icon: 'time',
      iconColor: '#10b981',
      options: [
        { label: 'Check-in Records', route: '/(hr)/attendance' },
        { label: 'Corrections', route: '/(hr)/attendance/corrections' },
        { label: 'Reports', route: '/(hr)/attendance/reports' },
      ]
    },
    {
      title: 'Leaves',
      icon: 'calendar',
      iconColor: '#f59e0b',
      options: [
        { label: 'Leave Requests', route: '/(hr)/leave' },
        { label: 'Leave Approval', route: '/(hr)/leave' },
        { label: 'Leave History', route: '/(hr)/leave-history' },
      ]
    },
    {
      title: 'Recruitment',
      icon: 'rocket',
      iconColor: '#ec4899',
      options: [
        { label: 'Dashboard', route: '/(hr)/recruitment' },
        { label: 'Candidates', route: '/(hr)/recruitment/candidate-tracking' },
        { label: 'Applications', route: '/(hr)/recruitment/review-applications' },
      ]
    },
    {
      title: 'Performance',
      icon: 'speedometer',
      iconColor: '#8b5cf6',
      options: [
        { label: 'Dashboard', route: '/(hr)/performance' },
        { label: 'Feedback', route: '/(hr)/performance/feedbacks' },
        { label: 'Reports', route: '/(hr)/performance/reports' },
      ]
    },
    {
      title: 'Finance',
      icon: 'cash',
      iconColor: '#06b6d4',
      options: [
        { label: 'Payroll', route: '/(hr)/finance' },
        { label: 'Salary Processing', route: '/(hr)/finance/salary-processing' },
        { label: 'Payslips', route: '/(hr)/finance/payslips' },
      ]
    },
    {
      title: 'Resignation',
      icon: 'exit',
      iconColor: '#ef4444',
      options: [
        { label: 'Submit', route: '/(hr)/resignation' },
        { label: 'Requests', route: '/(hr)/resignation/requests' },
        { label: 'Exit Process', route: '/(hr)/resignation/exit-process' },
      ]
    },
    {
      title: 'Analytics',
      icon: 'analytics',
      iconColor: '#5a55d2',
      options: [
        { label: 'Reports', route: '/(hr)/analytics' },
        { label: 'Attendance', route: '/(hr)/analytics/attendance-analytics' },
        { label: 'Performance', route: '/(hr)/analytics/performance-insights' },
      ]
    }
  ];

  const filteredModules = useMemo(() => {
    if (!searchQuery) return HR_MODULES;
    return HR_MODULES.filter(m => 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.options.some(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    return employees.filter(e => 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, employees]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fcfcfd' }}>
      {/* Top Bar */}
      <Header 
        title="HR Dashboard"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

        {/* Search Bar */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search modules, employees..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </Animated.View>

        {/* Welcome Card */}
        <LinearGradient
          colors={['#5a55d2', '#7c3aed']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.welcomeCard}
        >
          <Text style={styles.welcomeMain}>Welcome Back, HR Manager</Text>
          <Text style={styles.welcomeSub}>Here is today's HR overview</Text>

          <View style={styles.statsSplit}>
            <View style={styles.statGroup}>
              <Text style={styles.statLabel}>TOTAL</Text>
              <Text style={styles.statValue}>{stats.total}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statGroup}>
              <Text style={styles.statLabel}>PRESENT</Text>
              <Text style={styles.statValue}>{stats.present}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statGroup}>
              <Text style={styles.statLabel}>PENDING</Text>
              <Text style={styles.statValue}>{stats.pending.toString().padStart(2, '0')}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Search Results for Employees */}
        {searchQuery.length > 0 && filteredEmployees.length > 0 && (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.sectionTitle}>Employee Results</Text>
            {filteredEmployees.map((emp) => (
              <TouchableOpacity 
                key={emp.id} 
                style={styles.employeeResultCard}
                onPress={() => router.push({ pathname: '/(hr)/employee-management', params: { search: emp.name } } as any)}
              >
                <Image source={{ uri: emp.avatar }} style={styles.resultAvatar} />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{emp.name}</Text>
                  <Text style={styles.resultMeta}>{emp.role} • {emp.department}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Structured Module Grid */}
        <Text style={styles.sectionTitle}>
          {searchQuery ? 'Matching Modules' : 'HR Operations'}
        </Text>
        <View style={styles.moduleGrid}>
          {filteredModules.map((module, index) => (
            <ModuleCard
              key={index}
              index={index}
              {...module}
            />
          ))}
          {filteredModules.length === 0 && (
            <View style={styles.noResults}>
              <Ionicons name="search-outline" size={48} color="#e5e7eb" />
              <Text style={styles.noResultsText}>No modules found matching "{searchQuery}"</Text>
            </View>
          )}
        </View>

        {/* Quick Insights Row (Mini Charts) */}
        <View style={styles.gridRow}>
          <View style={styles.gridCard}>
            <View style={styles.gridHeader}>
              <Text style={styles.gridTitle}>Attendance</Text>
              <Ionicons name="calendar-outline" size={18} color="#5a55d2" />
            </View>
            <Text style={styles.gridLabel}>TODAY'S RATE</Text>
            <Text style={styles.gridValue}>{stats.attendanceRate}</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: stats.attendanceRate as any }]} />
            </View>
          </View>

          <View style={styles.gridCard}>
            <View style={styles.gridHeader}>
              <Text style={styles.gridTitle}>Performance</Text>
              <Ionicons name="star-outline" size={18} color="#f59e0b" />
            </View>
            <Text style={styles.gridLabel}>AVG SCORE</Text>
            <Text style={styles.gridValue}>{stats.performanceScore}</Text>
            <Text style={styles.scoreGrowth}>{stats.performanceGrowth}</Text>
          </View>
        </View>

        {/* Pending Leaves */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pending Leaves</Text>
          <Text style={styles.newBadge}>{pendingLeaves.length} New</Text>
        </View>

        {pendingLeaves.slice(0, 1).map((leave) => (
          <View key={leave.id} style={styles.leaveReqCard}>
            <View style={styles.leaveHeader}>
              <Image source={{ uri: leave.avatar }} style={styles.leaveAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.leaveName}>{leave.employeeName}</Text>
                <Text style={styles.leaveMeta}>{leave.type} • 3 Days ({leave.startDate}-{leave.endDate})</Text>
              </View>
              <Text style={styles.leaveTime}>2h ago</Text>
            </View>
            <View style={styles.leaveActionsRow}>
              <TouchableOpacity style={styles.approveBtn} onPress={() => { approveLeave(leave.id); router.push('/(hr)/leave-success'); }}>
                <Text style={styles.approveText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => { rejectLeave(leave.id); router.push('/(hr)/leave-success'); }}>
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Recent Activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityFeed}>
          {activities.slice(0, 2).map((activity, index) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityTimeline}>
                <View style={[styles.activityDot, { backgroundColor: activity.status === 'success' ? '#10b981' : '#5a55d2' }]} />
                {index === 0 && <View style={styles.activityLine} />}
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>{activity.type}</Text>
                <Text style={styles.activitySub}>{activity.description}</Text>
                <Text style={styles.activityDate}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <HRBottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 120,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  notifBtn: {
    position: 'relative',
    backgroundColor: '#f8f9ff',
    padding: 8,
    borderRadius: 12,
  },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ef4444',
    borderWidth: 1,
    borderColor: '#fff',
  },
  topAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 11,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginTop: 2,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  welcomeCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  welcomeMain: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  welcomeSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 6,
    marginBottom: 24,
  },
  searchResultsContainer: {
    marginBottom: 24,
  },
  employeeResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  resultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  resultMeta: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  noResults: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '600',
  },
  statsSplit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statGroup: {
    flex: 1,
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  moduleCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  moduleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1f2937',
  },
  optionsContainer: {
    gap: 4,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f9fafb',
  },
  optionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#374151',
  },
  gridLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 0.5,
  },
  gridValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
    marginBottom: 10,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 2,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  scoreGrowth: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10b981',
    marginTop: 2,
  },
  newBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ef4444',
  },
  leaveReqCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 32,
  },
  leaveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  leaveAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
  },
  leaveName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#374151',
  },
  leaveMeta: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  leaveTime: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '600',
  },
  leaveActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  approveBtn: {
    flex: 1,
    backgroundColor: '#5a55d2',
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
  },
  activityFeed: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 30,
  },
  activityItem: {
    flexDirection: 'row',
    height: 80,
  },
  activityTimeline: {
    alignItems: 'center',
    marginRight: 15,
    width: 12,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 2,
  },
  activityLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#f3f4f6',
    marginTop: -2,
    marginBottom: -2,
  },
  activityInfo: {
    flex: 1,
    paddingTop: -2,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
  },
  activitySub: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 2,
  },
  activityDate: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
    marginTop: 6,
  },
});

export default HRDashboard;
