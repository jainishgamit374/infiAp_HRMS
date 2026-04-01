import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useResignation, ResignationRequest } from './_layout';
import { HRBottomNav } from '@/components/HRBottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/layout/Header';

export default function SubmitResignation() {
  const { requests, submitResignation } = useResignation();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [reason, setReason] = useState('');
  const [lastDate, setLastDate] = useState('');

  const pending = requests.filter(r => r.status === 'Pending').length;
  const approved = requests.filter(r => r.status === 'Approved').length;

  const handleSubmit = () => {
    if (!name || !reason) { Alert.alert('Error', 'Please fill name and reason.'); return; }
    const newReq: ResignationRequest = {
      id: Math.random().toString(36).substring(7),
      employeeName: name, employeeRole: role || 'Employee', department: department || 'General',
      avatarUrl: `https://i.pravatar.cc/150?u=${name.replace(/\s/g, '')}`,
      reason, submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastWorkingDate: lastDate || 'TBD', status: 'Pending',
      exitSteps: [{ title: 'Knowledge Transfer', completed: false }, { title: 'Asset Return', completed: false }, { title: 'Exit Interview', completed: false }, { title: 'Final Settlement', completed: false }]
    };
    submitResignation(newReq);
    Alert.alert('✅ Submitted', 'Resignation request submitted successfully.', [{ text: 'OK', onPress: () => { setName(''); setRole(''); setDepartment(''); setReason(''); setLastDate(''); } }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Unified Header */}
      <Header 
        title="Resignation" 
        subtitle="Manage Exit Process"
        showBack={true} 
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: '#fffbeb' }]}><Text style={styles.summaryLabel}>Pending</Text><Text style={[styles.summaryVal, { color: '#f59e0b' }]}>{pending}</Text></View>
          <View style={[styles.summaryCard, { backgroundColor: '#ecfdf5' }]}><Text style={styles.summaryLabel}>Approved</Text><Text style={[styles.summaryVal, { color: '#10b981' }]}>{approved}</Text></View>
          <View style={[styles.summaryCard, { backgroundColor: '#fef2f2' }]}><Text style={styles.summaryLabel}>Total</Text><Text style={[styles.summaryVal, { color: '#ef4444' }]}>{requests.length}</Text></View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.quickRow}>
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(hr)/resignation/requests')}>
            <Ionicons name="list" size={18} color="#4f46e5" /><Text style={styles.quickBtnText}>View Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(hr)/resignation/exit-process')}>
            <Ionicons name="exit-outline" size={18} color="#4f46e5" /><Text style={styles.quickBtnText}>Exit Process</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Submit Form */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={styles.formTitle}>Submit New Resignation</Text>
          <Text style={styles.label}>Employee Name *</Text>
          <TextInput style={styles.input} placeholder="Full name" value={name} onChangeText={setName} />
          <Text style={styles.label}>Role</Text>
          <TextInput style={styles.input} placeholder="e.g. Software Engineer" value={role} onChangeText={setRole} />
          <Text style={styles.label}>Department</Text>
          <TextInput style={styles.input} placeholder="e.g. Engineering" value={department} onChangeText={setDepartment} />
          <Text style={styles.label}>Reason *</Text>
          <TextInput style={[styles.input, { height: 100 }]} placeholder="Reason for resignation..." multiline textAlignVertical="top" value={reason} onChangeText={setReason} />
          <Text style={styles.label}>Last Working Date</Text>
          <TextInput style={styles.input} placeholder="e.g. Apr 30, 2026" value={lastDate} onChangeText={setLastDate} />
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit Resignation</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
      <HRBottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfd' },
  content: { padding: 20, paddingBottom: 100 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  summaryCard: { flex: 1, borderRadius: 16, padding: 16, alignItems: 'center' },
  summaryLabel: { fontSize: 10, fontWeight: '700', color: '#6b7280', letterSpacing: 0.5, marginBottom: 4 },
  summaryVal: { fontSize: 24, fontWeight: '800' },
  quickRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  quickBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#eef2ff', height: 48, borderRadius: 12 },
  quickBtnText: { fontSize: 13, fontWeight: '600', color: '#4f46e5' },
  formTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, height: 50, fontSize: 15, color: '#111827', marginBottom: 16 },
  submitBtn: { backgroundColor: '#ef4444', height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
