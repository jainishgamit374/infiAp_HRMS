import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BottomNav } from '../../components/BottomNav';
import { useUser } from '../../context/UserContext';

export default function AttendancePage() {
  const { user } = useUser();

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerBtn}
            onPress={() => router.push('/(employee)/attendance-history')}
          >
            <Ionicons name="calendar-outline" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Image source={user.avatar} style={styles.headerAvatar} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Toast */}
        <View style={styles.toast}>
          <View style={styles.toastIcon}>
            <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
          </View>
          <Text style={styles.toastText}>Check-in successful at 09:05 AM</Text>
        </View>

        {/* Today's Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsHeader}>
            <View>
              <Text style={styles.detailsSub}>Today's Details</Text>
              <Text style={styles.detailsDate}>March 25, 2026</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>PRESENT</Text>
            </View>
          </View>

          <View style={styles.checkRow}>
            <View style={styles.checkItem}>
              <Text style={styles.checkLabel}>CHECK-IN</Text>
              <Text style={styles.checkTime}>09:05 AM</Text>
              <Text style={styles.checkStatus}>On Time</Text>
            </View>
            <View style={styles.checkItem}>
              <Text style={styles.checkLabel}>CHECK-OUT</Text>
              <Text style={styles.checkTime}>06:02 PM</Text>
              <Text style={styles.checkStatusCompleted}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Work Hours Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>WORK HOURS SUMMARY</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryPercent, { color: '#4f46e5' }]}>85%</Text>
              <Text style={styles.summaryValue}>7h 30m</Text>
              <Text style={styles.summaryLabel}>WORKED</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryPercent, { color: '#6366f1' }]}>30m</Text>
              <Text style={styles.summaryValue}>30m</Text>
              <Text style={styles.summaryLabel}>BREAK</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryPercent, { color: '#ef4444' }]}>30m</Text>
              <Text style={styles.summaryValue}>30m</Text>
              <Text style={styles.summaryLabel}>REMAINING</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.actionBtn, styles.actionBtnActive]} 
            onPress={() => router.push('/(employee)/attendance-logging')}
          >
            <Ionicons name="log-in-outline" size={24} color="#fff" />
            <Text style={styles.actionBtnTextActive}>Check In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="log-out-outline" size={24} color="#4f46e5" />
            <Text style={styles.actionBtnText}>Check Out</Text>
          </TouchableOpacity>
        </View>

        {/* Shift & Schedule */}
        <View style={styles.shiftCard}>
          <View style={styles.shiftHeader}>
             <Ionicons name="time-outline" size={20} color="#4f46e5" />
             <Text style={styles.shiftTitle}>Shift & Schedule</Text>
          </View>
          <View style={styles.shiftBody}>
            <View style={styles.shiftInfo}>
              <Text style={styles.shiftLabel}>Standard Shift</Text>
              <Text style={styles.shiftTime}>09:00 AM - 06:00 PM</Text>
              <Text style={styles.shiftDays}>Mon-Fri</Text>
            </View>
            <View style={styles.shiftDivider} />
            <View style={styles.shiftInfo}>
              <Text style={styles.shiftLabel}>Break Time</Text>
              <Text style={styles.shiftTime}>01:00 PM - 02:00 PM</Text>
              <Text style={styles.shiftDays}>Fixed 60 mins</Text>
            </View>
          </View>
        </View>

        {/* Today's Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TODAY'S TIMELINE</Text>
          <View style={styles.timeline}>
             {[
               { title: 'Checked In', source: 'Web Dashboard', time: '09:05 AM', icon: 'person', color: '#4f46e5' },
               { title: 'Break Started', source: 'Lunch Break', time: '01:05 PM', icon: 'cafe', color: '#6366f1' },
               { title: 'Break Ended', source: 'Resumed Work', time: '01:35 PM', icon: 'play-circle', color: '#6366f1' },
               { title: 'Checked Out', source: 'Mobile App', time: '06:02 PM', icon: 'exit', color: '#94a3b8' },
             ].map((item, idx, arr) => (
               <View key={idx} style={styles.timelineItem}>
                 <View style={styles.timelineIndicator}>
                   <View style={[styles.timelineDot, { backgroundColor: item.color }]} />
                   {idx < arr.length - 1 && <View style={styles.timelineLine} />}
                 </View>
                 <View style={styles.timelineContent}>
                   <View>
                     <Text style={styles.timelineTitle}>{item.title}</Text>
                     <Text style={styles.timelineSource}>{item.source}</Text>
                   </View>
                   <Text style={styles.timelineTime}>{item.time}</Text>
                 </View>
               </View>
             ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          <TouchableOpacity style={styles.quickActionItem}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#eef2ff' }]}>
               <Ionicons name="clipboard-outline" size={20} color="#4f46e5" />
            </View>
            <Text style={styles.quickActionText}>View Attendance History</Text>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#fff7ed' }]}>
               <Ionicons name="create-outline" size={20} color="#f97316" />
            </View>
            <Text style={styles.quickActionText}>Attendance Correction</Text>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionItem}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#fef2f2' }]}>
               <Ionicons name="calendar-outline" size={20} color="#ef4444" />
            </View>
            <Text style={styles.quickActionText}>Apply Leave</Text>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    margin: 20,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dcfce7',
  },
  toastIcon: {
    marginRight: 8,
  },
  toastText: {
    fontSize: 14,
    color: '#166534',
    fontWeight: '600',
  },
  detailsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  detailsSub: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailsDate: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#16a34a',
  },
  checkRow: {
    flexDirection: 'row',
    gap: 12,
  },
  checkItem: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  checkLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  checkTime: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  checkStatus: {
    fontSize: 11,
    color: '#10b981',
    fontWeight: '600',
  },
  checkStatusCompleted: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryPercent: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
    gap: 8,
  },
  actionBtnActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4f46e5',
  },
  actionBtnTextActive: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  shiftCard: {
    backgroundColor: '#eff6ff',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  shiftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  shiftTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  shiftBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shiftInfo: {
    flex: 1,
  },
  shiftLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  shiftTime: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  shiftDays: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  shiftDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#dbeafe',
    marginHorizontal: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineIndicator: {
    alignItems: 'center',
    marginRight: 16,
    width: 16,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#fff',
  },
  timelineLine: {
    width: 2,
    position: 'absolute',
    top: 14,
    bottom: -16,
    backgroundColor: '#e2e8f0',
  },
  timelineContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  timelineSource: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  timelineTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
});
