import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useHR } from '@/context/HRContext';

export default function CorrectionRequest() {
  const { id } = useLocalSearchParams();
  const { correctionRequests, approveCorrection, rejectCorrection } = useHR();

  const request = correctionRequests.find(r => r.id === id);

  if (!request) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Correction Request</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#9ca3af' }}>Request not found.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Correction Request</Text>
        <TouchableOpacity style={styles.headerRightBtn}>
          <Ionicons name="ellipsis-vertical" size={22} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Employee Info Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.employeeCard}>
          <Image source={{ uri: request.avatar }} style={styles.avatar} />
          <View style={styles.employeeInfo}>
            <Text style={styles.employeeName}>{request.name}</Text>
            <Text style={styles.employeeRole}>{request.role}</Text>
            <Text style={styles.employeeId}>{request.empId}</Text>
          </View>
        </Animated.View>

        {/* Request Details Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>REQUEST DETAILS</Text>
          
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.iconBg}><Ionicons name="calendar-outline" size={20} color="#4f46e5" /></View>
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Date of Correction</Text>
                <Text style={styles.detailValue}>{request.date}</Text>
              </View>
            </View>
            <View style={[styles.detailRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
              <View style={[styles.iconBg, { backgroundColor: '#fffbeb' }]}><Ionicons name="chatbubble-ellipses-outline" size={20} color="#f59e0b" /></View>
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Reason</Text>
                <Text style={[styles.detailValue, { fontStyle: 'italic', fontWeight: '500', color: '#4b5563' }]}>{request.reason}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Time Comparison */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>TIME COMPARISON</Text>
          
          <View style={styles.comparisonContainer}>
            {/* Original Card */}
            <View style={styles.timeCard}>
              <Text style={styles.cardTitle}>ORIGINAL</Text>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>In</Text>
                <Text style={styles.timeValue}>{request.originalIn || '--:--'}</Text>
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Out</Text>
                <Text style={[styles.timeValue, { color: '#ef4444' }]}>{request.originalOut || '--:--'}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{request.originalTotal || '0h 00m'}</Text>
              </View>
            </View>

            {/* Requested Card */}
            <View style={[styles.timeCard, { backgroundColor: '#f5f4ff', borderColor: '#e0e7ff' }]}>
              <Text style={[styles.cardTitle, { color: '#4f46e5' }]}>REQUESTED</Text>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>In</Text>
                <Text style={styles.timeValue}>{request.requestedIn || '--:--'}</Text>
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Out</Text>
                <Text style={[styles.timeValue, { color: '#22c55e' }]}>{request.requestedOut || '--:--'}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={[styles.totalValue, { color: '#4f46e5' }]}>{request.requestedTotal || '0h 00m'}</Text>
              </View>
            </View>
          </View>

        </Animated.View>

        <Text style={styles.footerNote}>Transform your workforce through innovation with AI-powered enterprise technology.</Text>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action Footer */}
      {request.status === 'Pending' && (
        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.rejectBtn} onPress={() => { rejectCorrection(request.id); router.back(); }}>
            <Ionicons name="close-outline" size={20} color="#374151" />
            <Text style={styles.rejectBtnText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.approveBtn} onPress={() => { approveCorrection(request.id); router.push('/(hr)/attendance/correction-success'); }}>
            <Ionicons name="checkmark-outline" size={20} color="#ffffff" />
            <Text style={styles.approveBtnText}>Approve Request</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  headerRightBtn: { padding: 8 },
  content: { padding: 20 },
  
  employeeCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  avatar: { width: 64, height: 64, borderRadius: 32, marginRight: 16 },
  employeeInfo: { flex: 1 },
  employeeName: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 4 },
  employeeRole: { fontSize: 14, color: '#4b5563', marginBottom: 4 },
  employeeId: { fontSize: 11, fontWeight: '700', color: '#6b7280', letterSpacing: 0.5 },

  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#9ca3af', marginBottom: 16, letterSpacing: 0.5 },

  detailsCard: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', paddingBottom: 16, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  iconBg: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f5f4ff', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  detailTextContainer: { flex: 1 },
  detailLabel: { fontSize: 12, color: '#9ca3af', marginBottom: 4, fontWeight: '600' },
  detailValue: { fontSize: 15, fontWeight: '700', color: '#111827', lineHeight: 22 },

  comparisonContainer: { flexDirection: 'row', gap: 12 },
  timeCard: { flex: 1, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 20, padding: 16 },
  cardTitle: { fontSize: 11, fontWeight: '800', color: '#9ca3af', marginBottom: 16, letterSpacing: 0.5 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  timeLabel: { fontSize: 13, color: '#6b7280', fontWeight: '600' },
  timeValue: { fontSize: 14, fontWeight: '700', color: '#111827' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e5e7eb', marginTop: 4 },
  totalLabel: { fontSize: 13, fontWeight: '800', color: '#4b5563' },
  totalValue: { fontSize: 15, fontWeight: '800', color: '#111827' },

  footerNote: { fontSize: 11, color: '#9ca3af', textAlign: 'center', fontStyle: 'italic', paddingHorizontal: 20 },

  footerActions: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 20, paddingTop: 16, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  rejectBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#ffffff' },
  rejectBtnText: { fontSize: 15, fontWeight: '700', color: '#374151', marginLeft: 8 },
  approveBtn: { flex: 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderRadius: 16, backgroundColor: '#4f46e5', shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  approveBtnText: { fontSize: 15, fontWeight: '700', color: '#ffffff', marginLeft: 8 }
});
