import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useFinance } from './_layout';
import { HRBottomNav } from '@/components/HRBottomNav';

export default function Payslips() {
  const { payslips, payroll, generatePayslip } = useFinance();

  const handleGenerate = (empId: string) => {
    generatePayslip(empId);
    Alert.alert('✅ Success', 'Payslip generated successfully!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#111827" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Payslip Management</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Generate for all */}
        <TouchableOpacity style={styles.genAllBtn} onPress={() => { payroll.forEach(p => generatePayslip(p.id)); Alert.alert('✅ Done', 'All payslips generated!'); }}>
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.genAllText}>Generate All Payslips</Text>
        </TouchableOpacity>

        {/* Quick Generate */}
        <Text style={styles.sectionTitle}>Quick Generate</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {payroll.map(emp => (
            <TouchableOpacity key={emp.id} style={styles.quickCard} onPress={() => handleGenerate(emp.id)}>
              <Ionicons name="person-circle-outline" size={24} color="#4f46e5" />
              <Text style={styles.quickName}>{emp.name.split(' ')[0]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Existing Payslips */}
        <Text style={styles.sectionTitle}>Recent Payslips</Text>
        {payslips.map((slip, idx) => {
          const emp = payroll.find(p => p.id === slip.employeeId);
          return (
            <Animated.View key={slip.id} entering={FadeInUp.delay(idx * 80).duration(400)} style={styles.slipCard}>
              <View style={styles.slipIcon}><Ionicons name="document-text" size={20} color="#4f46e5" /></View>
              <View style={styles.slipInfo}>
                <Text style={styles.slipName}>{emp ? emp.name : 'Employee'}</Text>
                <Text style={styles.slipMeta}>{slip.month} {slip.year} • ₹{slip.netPay.toLocaleString()}</Text>
              </View>
              <View style={styles.slipActions}>
                <View style={[styles.statusBadge, slip.status === 'Sent' ? { backgroundColor: '#ecfdf5' } : { backgroundColor: '#eef2ff' }]}>
                  <Text style={[styles.statusText, slip.status === 'Sent' ? { color: '#10b981' } : { color: '#4f46e5' }]}>{slip.status}</Text>
                </View>
                <TouchableOpacity style={styles.dlBtn}><Ionicons name="download-outline" size={16} color="#4f46e5" /></TouchableOpacity>
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
  genAllBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#4f46e5', height: 52, borderRadius: 14, marginBottom: 24 },
  genAllText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 12 },
  quickCard: { alignItems: 'center', marginRight: 16, backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#f3f4f6' },
  quickName: { fontSize: 11, fontWeight: '600', color: '#4b5563', marginTop: 4 },
  slipCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 12 },
  slipIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  slipInfo: { flex: 1 },
  slipName: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  slipMeta: { fontSize: 12, color: '#6b7280' },
  slipActions: { alignItems: 'flex-end', gap: 6 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '700' },
  dlBtn: { padding: 4 },
});
