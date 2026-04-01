import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useFinance } from './_layout';
import { HRBottomNav } from '@/components/HRBottomNav';
import Header from '@/components/layout/Header';

export default function SalaryProcessing() {
  const { payroll, processSalary, processAllPending } = useFinance();

  const handleProcess = (id: string, name: string) => {
    processSalary(id);
    Alert.alert('✅ Salary Processed', `${name}'s salary has been processed successfully.`);
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Salary Processing"
        showBack={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.processAllBtn} onPress={() => { processAllPending(); Alert.alert('✅ Done', 'All pending salaries processed!'); }}>
          <Ionicons name="checkmark-done-circle" size={20} color="#fff" />
          <Text style={styles.processAllText}>Process All Pending</Text>
        </TouchableOpacity>

        {payroll.map((emp, idx) => (
          <Animated.View key={emp.id} entering={FadeInUp.delay(idx * 80).duration(400)} style={styles.card}>
            <View style={styles.cardHeader}>
              <Image source={{ uri: emp.avatarUrl }} style={styles.avatar} />
              <View style={styles.info}>
                <Text style={styles.name}>{emp.name}</Text>
                <Text style={styles.role}>{emp.role}</Text>
              </View>
            </View>

            <View style={styles.breakdown}>
              <View style={styles.breakdownRow}><Text style={styles.bLabel}>Base Salary</Text><Text style={styles.bValue}>₹{emp.baseSalary.toLocaleString()}</Text></View>
              <View style={styles.breakdownRow}><Text style={styles.bLabel}>Bonus</Text><Text style={[styles.bValue, { color: '#10b981' }]}>+₹{emp.bonus.toLocaleString()}</Text></View>
              <View style={styles.breakdownRow}><Text style={styles.bLabel}>Deductions</Text><Text style={[styles.bValue, { color: '#ef4444' }]}>-₹{emp.deductions.toLocaleString()}</Text></View>
              <View style={styles.divider} />
              <View style={styles.breakdownRow}><Text style={styles.netLabel}>Net Pay</Text><Text style={styles.netValue}>₹{emp.netPay.toLocaleString()}</Text></View>
            </View>

            {emp.status === 'Processed' ? (
              <View style={styles.processedBadge}><Ionicons name="checkmark-circle" size={16} color="#10b981" /><Text style={styles.processedText}>Processed</Text></View>
            ) : (
              <TouchableOpacity style={styles.processBtn} onPress={() => handleProcess(emp.id, emp.name)}>
                <Text style={styles.processBtnText}>Process Salary</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        ))}
      </ScrollView>
      <HRBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfd' },
  content: { padding: 20, paddingBottom: 100 },
  processAllBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#4f46e5', height: 52, borderRadius: 14, marginBottom: 24 },
  processAllText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 2 },
  role: { fontSize: 13, color: '#6b7280' },
  breakdown: { gap: 8, marginBottom: 16 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bLabel: { fontSize: 13, color: '#6b7280' },
  bValue: { fontSize: 13, fontWeight: '600', color: '#111827' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 4 },
  netLabel: { fontSize: 14, fontWeight: '700', color: '#111827' },
  netValue: { fontSize: 16, fontWeight: '800', color: '#4f46e5' },
  processedBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#ecfdf5', height: 44, borderRadius: 12 },
  processedText: { fontSize: 14, fontWeight: '600', color: '#10b981' },
  processBtn: { backgroundColor: '#4f46e5', height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  processBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
