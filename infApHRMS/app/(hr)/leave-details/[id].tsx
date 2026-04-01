import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useHR } from '@/context/HRContext';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Header from '@/components/layout/Header';

export default function LeaveDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { leaves, approveLeave, rejectLeave } = useHR();
  const leave = leaves.find(l => l.id === id);

  if (!leave) return <View style={styles.container}><Text>Leave not found</Text></View>;

  const handleApprove = () => {
    approveLeave(leave.id);
    router.push('/(hr)/leave-success');
  };

  const handleReject = () => {
    rejectLeave(leave.id);
    router.push('/(hr)/leave-success');
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Leave Details"
        showBack={true}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.profileCard}>
          <Image source={{ uri: leave.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{leave.employeeName}</Text>
          <Text style={styles.department}>{leave.department || 'General'} Department</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Leave Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Type</Text>
            <Text style={styles.value}>{leave.type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Dates</Text>
            <Text style={styles.value}>{leave.startDate} - {leave.endDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Status</Text>
            <Text style={[styles.value, { color: leave.status === 'Pending' ? '#d97706' : leave.status === 'Approved' ? '#16a34a' : '#ef4444' }]}>{leave.status.toUpperCase()}</Text>
          </View>

          <View style={styles.divider} />
          
          <Text style={styles.reasonLabel}>Reason for leave</Text>
          <Text style={styles.reasonText}>{leave.reason || 'No specific reason provided.'}</Text>
        </Animated.View>
      </ScrollView>

      {leave.status === 'Pending' && (
        <Animated.View entering={FadeIn.delay(300)} style={styles.bottomBar}>
          <TouchableOpacity style={styles.rejectBtn} onPress={handleReject}>
            <Text style={styles.rejectText}>Reject Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.approveBtn} onPress={handleApprove}>
            <Text style={styles.approveText}>Approve Leave</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfd' },
  content: { padding: 20 },
  profileCard: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 24, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: '800', color: '#111827' },
  department: { fontSize: 14, color: '#6b7280', fontWeight: '500', marginTop: 4 },
  detailsCard: { backgroundColor: '#fff', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#374151', marginBottom: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  label: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  value: { fontSize: 14, fontWeight: '700', color: '#111827' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 20 },
  reasonLabel: { fontSize: 12, fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  reasonText: { fontSize: 15, color: '#374151', lineHeight: 24 },
  bottomBar: { padding: 20, paddingBottom: Platform.OS === 'ios' ? 34 : 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6', flexDirection: 'row', gap: 12 },
  rejectBtn: { flex: 1, height: 56, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' },
  rejectText: { color: '#374151', fontWeight: '700', fontSize: 16 },
  approveBtn: { flex: 2, height: 56, borderRadius: 16, backgroundColor: '#5a55d2', justifyContent: 'center', alignItems: 'center', shadowColor: '#5a55d2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  approveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
