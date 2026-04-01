import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useHR } from '@/context/HRContext';
import { HRBottomNav } from '@/components/HRBottomNav';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Header from '@/components/layout/Header';

import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const EmployeeProfile = () => {
  const { id } = useLocalSearchParams();
  const { employees } = useHR();

  const employee = employees.find(e => e.id === id) || employees[0];

  const renderSectionHeader = (title: string, icon: string) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={icon as any} size={18} color="#1f2937" />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderInfoRow = (label: string, value: string, icon?: string) => (
    <View style={styles.infoRow}>
      {icon && <View style={styles.infoIconBg}><Ionicons name={icon as any} size={16} color="#5a55d2" /></View>}
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Employee Profile"
        showBack={true}
        rightElement={
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push(`/(hr)/edit-employee/${employee.id}` as any)}
          >
            <Ionicons name="create-outline" size={20} color="#1f2937" />
          </TouchableOpacity>
        }
      />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        {/* Main Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.profileCard}>
          <Image source={{ uri: employee.avatar }} style={styles.profileAvatar} />
          <Text style={styles.profileName}>{employee.name}</Text>
          <Text style={styles.profileId}>{employee.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: employee.status === 'Active' ? '#f0fdf4' : '#fef2f2' }]}>
            <Text style={[styles.statusBadgeText, { color: employee.status === 'Active' ? '#22c55e' : '#ef4444' }]}>
              {employee.status} Employee
            </Text>
          </View>

          <View style={styles.quickStats}>
            <View style={styles.qrStatItem}>
              <Text style={styles.qrStatValue}>21</Text>
              <Text style={styles.qrStatLabel}>Present</Text>
            </View>
            <View style={styles.qrStatItem}>
              <Text style={styles.qrStatValue}>02</Text>
              <Text style={styles.qrStatLabel}>Absent</Text>
            </View>
            <View style={styles.qrStatItem}>
              <Text style={styles.qrStatValue}>01</Text>
              <Text style={styles.qrStatLabel}>Leave</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Personal Info */}
          <View style={styles.section}>
            {renderSectionHeader('Personal Info', 'person-outline')}
            {renderInfoRow('EMAIL ADDRESS', employee.email, 'mail-outline')}
            {renderInfoRow('PHONE NUMBER', employee.phone, 'call-outline')}
          </View>

          <View style={styles.divider} />

          {/* Job Details */}
          <View style={styles.section}>
            {renderSectionHeader('Job Details', 'briefcase-outline')}
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.infoLabel}>DEPARTMENT</Text>
                <Text style={styles.infoValue}>{employee.department}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.infoLabel}>ROLE</Text>
                <Text style={styles.infoValue}>{employee.role}</Text>
              </View>
            </View>
            <View style={styles.grid}>
              <View style={styles.gridItem}>
                <Text style={styles.infoLabel}>MANAGER</Text>
                <Text style={styles.infoValue}>{employee.manager}</Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.infoLabel}>JOIN DATE</Text>
                <Text style={styles.infoValue}>{employee.joiningDate}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Payroll & Salary */}
          <View style={styles.section}>
            {renderSectionHeader('Payroll & Salary', 'cash-outline')}
            <View style={styles.salaryRow}>
              <View>
                <Text style={styles.infoLabel}>CURRENT SALARY (MONTHLY)</Text>
                <Text style={styles.salaryValue}>$ {employee.salary}</Text>
              </View>
              <TouchableOpacity style={styles.viewIcon}>
                <Ionicons name="eye-outline" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.securityItem}>
            <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" />
            <Text style={styles.securityText}>Security & Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace('/')}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Logout Session</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
      <HRBottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff6ff',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  editButton: {
    padding: 4,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#f3f4f6',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  profileId: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  quickStats: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: 24,
    backgroundColor: '#f8f9fe',
    paddingVertical: 16,
    borderRadius: 16,
  },
  qrStatItem: {
    alignItems: 'center',
  },
  qrStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  qrStatLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    width: '100%',
    marginVertical: 24,
  },
  section: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  infoIconBg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f5f4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '600',
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    flex: 1,
  },
  salaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salaryValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
  },
  viewIcon: {
    padding: 4,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    gap: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 16,
    marginTop: 12,
    gap: 12,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ef4444',
  },
});

export default EmployeeProfile;
