import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useFinance } from './_layout';
import { HRBottomNav } from '@/components/HRBottomNav';

export default function PayrollOverview() {
  const { payroll } = useFinance();

  const totalPayroll = useMemo(() => payroll.reduce((s, p) => s + p.netPay, 0), [payroll]);
  const processed = useMemo(() => payroll.filter(p => p.status === 'Processed').length, [payroll]);
  const pending = useMemo(() => payroll.filter(p => p.status === 'Pending').length, [payroll]);

  const getStatusColor = (status: string) => {
    if (status === 'Processed') return { bg: '#ecfdf5', text: '#10b981' };
    if (status === 'Pending') return { bg: '#fffbeb', text: '#f59e0b' };
    return { bg: '#fef2f2', text: '#ef4444' };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#111827" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Payroll Overview</Text>
        <TouchableOpacity><Ionicons name="options-outline" size={22} color="#111827" /></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.grid}>
          <View style={[styles.card, { backgroundColor: '#4f46e5' }]}>
            <Text style={[styles.cardLabel, { color: '#e0e7ff' }]}>TOTAL PAYROLL</Text>
            <Text style={[styles.cardValue, { color: '#fff' }]}>₹{(totalPayroll / 1000).toFixed(0)}K</Text>
            <Text style={[styles.cardSub, { color: '#c7d2fe' }]}>This month</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>PROCESSED</Text>
            <Text style={[styles.cardValue, { color: '#10b981' }]}>{processed}</Text>
            <Text style={styles.cardSub}>Completed</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>PENDING</Text>
            <Text style={[styles.cardValue, { color: '#f59e0b' }]}>{pending}</Text>
            <Text style={styles.cardSub}>Awaiting</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>ON HOLD</Text>
            <Text style={[styles.cardValue, { color: '#ef4444' }]}>{payroll.filter(p => p.status === 'On Hold').length}</Text>
            <Text style={styles.cardSub}>Flagged</Text>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(hr)/finance/salary-processing')}>
            <Ionicons name="cash-outline" size={20} color="#4f46e5" />
            <Text style={styles.actionBtnText}>Process Salary</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(hr)/finance/payslips')}>
            <Ionicons name="document-text-outline" size={20} color="#4f46e5" />
            <Text style={styles.actionBtnText}>Payslips</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Employee Payroll List */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Employee Payroll</Text>
        </View>
        {payroll.map((emp, idx) => {
          const sc = getStatusColor(emp.status);
          return (
            <Animated.View key={emp.id} entering={FadeInUp.delay(200 + idx * 80).duration(400)} style={styles.empCard}>
              <Image source={{ uri: emp.avatarUrl }} style={styles.empAvatar} />
              <View style={styles.empInfo}>
                <Text style={styles.empName}>{emp.name}</Text>
                <Text style={styles.empRole}>{emp.role}</Text>
                <Text style={styles.empDept}>{emp.department} • {emp.payDate}</Text>
              </View>
              <View style={styles.empRight}>
                <Text style={styles.empPay}>₹{(emp.netPay / 1000).toFixed(0)}K</Text>
                <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                  <Text style={[styles.statusText, { color: sc.text }]}>{emp.status}</Text>
                </View>
              </View>
            </Animated.View>
          );
        })}
      </ScrollView>
      <HRBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfd' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 16, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  content: { padding: 20, paddingBottom: 100 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6' },
  cardLabel: { fontSize: 10, fontWeight: '800', color: '#9ca3af', letterSpacing: 0.5, marginBottom: 6 },
  cardValue: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 4 },
  cardSub: { fontSize: 11, fontWeight: '500', color: '#6b7280' },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#eef2ff', height: 48, borderRadius: 12 },
  actionBtnText: { fontSize: 14, fontWeight: '600', color: '#4f46e5' },
  listHeader: { marginBottom: 16 },
  listTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  empCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 12 },
  empAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  empInfo: { flex: 1 },
  empName: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 2 },
  empRole: { fontSize: 12, color: '#4b5563', fontWeight: '500', marginBottom: 2 },
  empDept: { fontSize: 11, color: '#9ca3af' },
  empRight: { alignItems: 'flex-end' },
  empPay: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '700' },
});
