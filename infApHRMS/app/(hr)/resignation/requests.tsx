import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useResignation } from './_layout';
import { HRBottomNav } from '@/components/HRBottomNav';

export default function ResignationRequests() {
  const { requests, approveResignation, rejectResignation } = useResignation();

  const getStatusStyle = (s: string) => {
    if (s === 'Approved') return { bg: '#ecfdf5', text: '#10b981' };
    if (s === 'Rejected') return { bg: '#fef2f2', text: '#ef4444' };
    return { bg: '#fffbeb', text: '#f59e0b' };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#111827" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Resignation Requests</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {requests.map((req, idx) => {
          const sc = getStatusStyle(req.status);
          return (
            <Animated.View key={req.id} entering={FadeInUp.delay(idx * 80).duration(400)} style={styles.card}>
              <View style={styles.cardTop}>
                <Image source={{ uri: req.avatarUrl }} style={styles.avatar} />
                <View style={styles.info}>
                  <Text style={styles.name}>{req.employeeName}</Text>
                  <Text style={styles.role}>{req.employeeRole} • {req.department}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: sc.bg }]}>
                  <Text style={[styles.badgeText, { color: sc.text }]}>{req.status}</Text>
                </View>
              </View>
              <Text style={styles.reason}>"{req.reason}"</Text>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>Submitted: {req.submittedDate}</Text>
                <Text style={styles.meta}>Last Day: {req.lastWorkingDate}</Text>
              </View>

              {req.status === 'Pending' && (
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.approveBtn} onPress={() => { approveResignation(req.id); Alert.alert('Approved', `${req.employeeName}'s resignation approved.`); }}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={styles.approveTxt}>Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectBtn} onPress={() => { rejectResignation(req.id); Alert.alert('Rejected', `${req.employeeName}'s resignation rejected.`); }}>
                    <Ionicons name="close" size={16} color="#ef4444" />
                    <Text style={styles.rejectTxt}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
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
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 2 },
  role: { fontSize: 12, color: '#6b7280' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  reason: { fontSize: 13, color: '#4b5563', fontStyle: 'italic', lineHeight: 20, marginBottom: 12 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  meta: { fontSize: 11, color: '#9ca3af', fontWeight: '500' },
  actions: { flexDirection: 'row', gap: 12 },
  approveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#10b981', height: 44, borderRadius: 12 },
  approveTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
  rejectBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: '#fecaca', height: 44, borderRadius: 12 },
  rejectTxt: { color: '#ef4444', fontSize: 14, fontWeight: '700' },
});
