import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  Alert,
  Animated as RNAnimated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn, ZoomIn } from 'react-native-reanimated';
import { AdminBottomNav } from '../../components/AdminBottomNav';
import Header from '../../components/layout/Header';

const { width } = Dimensions.get('window');

const EMPLOYEES = [
  { id: '1', name: 'Alex Rivera', role: 'Sr. Engineer', department: 'Engineering', salary: 95000, status: 'Paid', avatar: 'AR' },
  { id: '2', name: 'Sarah Chen', role: 'Marketing Lead', department: 'Marketing', salary: 82000, status: 'Paid', avatar: 'SC' },
  { id: '3', name: 'James Wilson', role: 'HR Manager', department: 'Human Resources', salary: 78000, status: 'Pending', avatar: 'JW' },
  { id: '4', name: 'Priya Sharma', role: 'Finance Head', department: 'Finance', salary: 88000, status: 'Pending', avatar: 'PS' },
  { id: '5', name: 'Marcus Lee', role: 'Design Lead', department: 'Product Design', salary: 85000, status: 'Paid', avatar: 'ML' },
  { id: '6', name: 'Olivia Martinez', role: 'Sales Director', department: 'Sales & BD', salary: 92000, status: 'Paid', avatar: 'OM' },
];

const AnimatedCounter = ({ target, prefix = '' }: { target: number; prefix?: string }) => {
  const animValue = useRef(new RNAnimated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    animValue.addListener(({ value }) => setDisplay(Math.round(value)));
    RNAnimated.timing(animValue, { toValue: target, duration: 1200, useNativeDriver: false }).start();
    return () => animValue.removeAllListeners();
  }, [target]);

  return <Text style={styles.bigStatValue}>{prefix}{display.toLocaleString()}</Text>;
};

export default function AdminPayroll() {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const totalPayroll = EMPLOYEES.reduce((sum, e) => sum + e.salary, 0);
  const pendingCount = EMPLOYEES.filter((e) => e.status === 'Pending').length;
  const paidCount = EMPLOYEES.filter((e) => e.status === 'Paid').length;
  const pendingAmount = EMPLOYEES.filter((e) => e.status === 'Pending').reduce((s, e) => s + e.salary, 0);

  const filteredEmployees = filter === 'all'
    ? EMPLOYEES
    : EMPLOYEES.filter((e) => e.status.toLowerCase() === filter);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header 
        title="Payroll Dashboard"
        showBack={true}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Big Stats */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.bigStatCard}>
          <View style={styles.bigStatHeader}>
            <View style={styles.bigStatIconBox}>
              <Ionicons name="wallet-outline" size={24} color="#4f46e5" />
            </View>
            <View style={styles.bigStatBadge}>
              <Text style={styles.bigStatBadgeText}>MONTHLY</Text>
            </View>
          </View>
          <Text style={styles.bigStatLabel}>Total Monthly Payroll</Text>
          <AnimatedCounter target={totalPayroll} prefix="$" />
          <View style={styles.bigStatDivider} />
          <View style={styles.bigStatRow}>
            <View style={styles.miniStat}>
              <View style={[styles.miniDot, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.miniLabel}>{paidCount} Paid</Text>
            </View>
            <View style={styles.miniStat}>
              <View style={[styles.miniDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.miniLabel}>{pendingCount} Pending</Text>
            </View>
            <View style={styles.miniStat}>
              <Text style={styles.miniAmount}>${pendingAmount.toLocaleString()}</Text>
              <Text style={styles.miniLabel}>Outstanding</Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.actionsRow}>
          <TouchableOpacity 
            style={[styles.actionBtn, { backgroundColor: '#4f46e5' }]} 
            activeOpacity={0.8}
            onPress={() => {
              Alert.alert(
                "Run Payroll",
                "Are you sure you want to process payroll for all employees?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Run Now", onPress: () => router.push('/(admin)/payslip-generation') }
                ]
              );
            }}
          >
            <Ionicons name="play-circle-outline" size={20} color="#fff" />
            <Text style={styles.actionBtnText}>Run Payroll</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#0ea5e9' }]} activeOpacity={0.8}
            onPress={() => router.push('/(admin)/payslip-generation' as any)}>
            <Ionicons name="document-text-outline" size={20} color="#fff" />
            <Text style={styles.actionBtnText}>Payslips</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#10b981' }]} activeOpacity={0.8}
            onPress={() => router.push('/(admin)/salary-structure' as any)}>
            <Ionicons name="stats-chart-outline" size={20} color="#fff" />
            <Text style={styles.actionBtnText}>Reports</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Filter Tabs */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.filterRow}>
          {(['all', 'paid', 'pending'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Employee Salary List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Employee Salary List</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{filteredEmployees.length}</Text>
          </View>
        </View>

        {filteredEmployees.map((emp, index) => (
          <Animated.View key={emp.id} entering={FadeInDown.delay(400 + index * 80).springify()} style={styles.empCard}>
            <View style={styles.empLeft}>
              <View style={styles.empAvatar}>
                <Text style={styles.empAvatarText}>{emp.avatar}</Text>
              </View>
              <View style={styles.empInfo}>
                <Text style={styles.empName}>{emp.name}</Text>
                <Text style={styles.empRole}>{emp.role}</Text>
                <Text style={styles.empDept}>{emp.department}</Text>
              </View>
            </View>
            <View style={styles.empRight}>
              <Text style={styles.empSalary}>${(emp.salary / 12).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/mo</Text>
              <View style={[styles.statusBadge, emp.status === 'Paid' ? styles.paidBadge : styles.pendingBadge]}>
                <View style={[styles.statusDot, { backgroundColor: emp.status === 'Paid' ? '#22c55e' : '#f59e0b' }]} />
                <Text style={[styles.statusText, { color: emp.status === 'Paid' ? '#22c55e' : '#f59e0b' }]}>{emp.status}</Text>
              </View>
            </View>
          </Animated.View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
      <AdminBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  scrollContent: { padding: 20 },

  // Big Stat
  bigStatCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, marginBottom: 20, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  bigStatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  bigStatIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center' },
  bigStatBadge: { backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  bigStatBadgeText: { fontSize: 10, fontWeight: '800', color: '#22c55e', letterSpacing: 0.5 },
  bigStatLabel: { fontSize: 14, fontWeight: '600', color: '#64748b', marginBottom: 4 },
  bigStatValue: { fontSize: 32, fontWeight: '900', color: '#1e293b' },
  bigStatDivider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 16 },
  bigStatRow: { flexDirection: 'row', justifyContent: 'space-between' },
  miniStat: { alignItems: 'center', gap: 4 },
  miniDot: { width: 8, height: 8, borderRadius: 4 },
  miniLabel: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  miniAmount: { fontSize: 14, fontWeight: '800', color: '#f59e0b' },

  // Actions
  actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 14, gap: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 4 },
  actionBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  // Filters
  filterRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  filterTab: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 10, backgroundColor: '#f1f5f9' },
  filterTabActive: { backgroundColor: '#4f46e5' },
  filterTabText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  filterTabTextActive: { color: '#fff' },

  // Section
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  countBadge: { backgroundColor: '#4f46e5', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  countText: { color: '#fff', fontSize: 12, fontWeight: '800' },

  // Employee Card
  empCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#f1f5f9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  empLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 },
  empAvatar: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0e7ff' },
  empAvatarText: { fontSize: 14, fontWeight: '800', color: '#4f46e5' },
  empInfo: { flex: 1 },
  empName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  empRole: { fontSize: 12, fontWeight: '500', color: '#64748b', marginTop: 1 },
  empDept: { fontSize: 11, fontWeight: '600', color: '#94a3b8', marginTop: 1 },
  empRight: { alignItems: 'flex-end', gap: 6 },
  empSalary: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, gap: 4 },
  paidBadge: { backgroundColor: '#f0fdf4' },
  pendingBadge: { backgroundColor: '#fefce8' },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '800' },
});
