import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AdminBottomNav } from '../../components/AdminBottomNav';
import Header from '../../components/layout/Header';

const INITIAL_REQUESTS = [
  { id: '1', name: 'John Doe', type: 'Sick Leave', duration: 'Oct 24 - Oct 26', days: 3, avatar: 'JD', status: 'Pending' },
  { id: '2', name: 'Emily Blunt', type: 'Annual Leave', duration: 'Nov 01 - Nov 05', days: 5, avatar: 'EB', status: 'Pending' },
  { id: '3', name: 'Michael Bay', type: 'Sick Leave', duration: 'Oct 28 - Oct 29', days: 2, avatar: 'MB', status: 'Pending' },
];

export default function LeaveApprovals() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Unified Header */}
      <Header 
        title="Leave Approvals" 
        showBack={true} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{requests.length}</Text>
            <Text style={styles.statLab}>Pending</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#f0fdf4' }]}>
            <Text style={[styles.statVal, { color: '#10b981' }]}>12</Text>
            <Text style={styles.statLab}>Approved This Month</Text>
          </View>
        </View>

        {requests.map((req, idx) => (
          <Animated.View key={req.id} entering={FadeInDown.delay(idx * 100).springify()} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{req.avatar}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{req.name}</Text>
                <Text style={styles.type}>{req.type} • {req.days} days</Text>
                <Text style={styles.date}>{req.duration}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{req.status}</Text>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.rejectBtn} onPress={() => handleAction(req.id, 'Rejected')}>
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.approveBtn} onPress={() => handleAction(req.id, 'Approved')}>
                <Text style={styles.approveText}>Approve</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}

        {requests.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="checkmark-done-circle-outline" size={64} color="#e2e8f0" />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySub}>No pending leave requests to process.</Text>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
      <AdminBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 5 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  statVal: { fontSize: 24, fontWeight: '800', color: '#4f46e5' },
  statLab: { fontSize: 10, fontWeight: '700', color: '#64748b', marginTop: 4, textTransform: 'uppercase' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 48, height: 48, borderRadius: 15, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#3b82f6' },
  info: { flex: 1, marginLeft: 16 },
  name: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  type: { fontSize: 13, color: '#ef4444', fontWeight: '600', marginTop: 2 },
  date: { fontSize: 11, color: '#64748b', marginTop: 4 },
  statusBadge: { backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '800', color: '#d97706' },
  actions: { flexDirection: 'row', gap: 12 },
  rejectBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  rejectText: { fontSize: 14, fontWeight: '700', color: '#64748b' },
  approveBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#4f46e5', alignItems: 'center' },
  approveText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginTop: 16 },
  emptySub: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
});
