import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BottomNav } from '../../components/BottomNav';

export default function LeaveManagement() {
  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave Management</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="notifications-outline" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Leave Balance Row */}
        <View style={styles.balanceRow}>
          <View style={[styles.balanceCard, { backgroundColor: '#f0f0ff', borderColor: '#dadaff' }]}>
            <Text style={[styles.balanceType, { color: '#6366f1' }]}>PRIVILEGE</Text>
            <Text style={styles.balanceValue}>12</Text>
            <Text style={styles.balanceSub}>Days left</Text>
          </View>
          <View style={[styles.balanceCard, { backgroundColor: '#f0f9ff' }]}>
            <Text style={[styles.balanceType, { color: '#3b82f6' }]}>CASUAL</Text>
            <Text style={styles.balanceValue}>05</Text>
            <Text style={styles.balanceSub}>Days left</Text>
          </View>
          <View style={[styles.balanceCard, { backgroundColor: '#f8fafc' }]}>
            <Text style={[styles.balanceType, { color: '#64748b' }]}>SICK</Text>
            <Text style={styles.balanceValue}>08</Text>
            <Text style={styles.balanceSub}>Days left</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.requestButton} 
          activeOpacity={0.8}
          onPress={() => router.push('/(employee)/apply-leave')}
        >
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={styles.requestButtonText}>Request New Leave</Text>
        </TouchableOpacity>

        {/* Upcoming Leaves */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Upcoming Leaves</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.upcomingItem}>
          <View style={[styles.dateBlock, { backgroundColor: '#e0f2f1' }]}>
            <Text style={[styles.dateMonth, { color: '#00897b' }]}>OCT</Text>
            <Text style={[styles.dateDay, { color: '#00897b' }]}>24</Text>
          </View>
          <View style={styles.upcomingInfo}>
            <Text style={styles.upcomingTitle}>Privilege Leave</Text>
            <Text style={styles.upcomingSub}>2 Days • Family Event</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: '#dcfce7' }]}>
            <Text style={[styles.statusText, { color: '#22c55e' }]}>APPROVED</Text>
          </View>
        </View>

        <View style={styles.upcomingItem}>
          <View style={[styles.dateBlock, { backgroundColor: '#fff7ed' }]}>
            <Text style={[styles.dateMonth, { color: '#ea580c' }]}>NOV</Text>
            <Text style={[styles.dateDay, { color: '#ea580c' }]}>02</Text>
          </View>
          <View style={styles.upcomingInfo}>
            <Text style={styles.upcomingTitle}>Casual Leave</Text>
            <Text style={styles.upcomingSub}>1 Day • Personal Work</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: '#fef3c7' }]}>
            <Text style={[styles.statusText, { color: '#d97706' }]}>PENDING</Text>
          </View>
        </View>

        {/* Leave History */}
        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 16 }]}>Leave History</Text>
        
        <View style={styles.historyItem}>
          <View style={styles.historyIconWrap}>
            <Ionicons name="medical-outline" size={20} color="#64748b" />
          </View>
          <View style={styles.historyBody}>
            <Text style={styles.historyTitle}>Sick Leave</Text>
            <Text style={styles.historySub}>Sep 12 - Sep 13 • 2 Days</Text>
          </View>
          <Text style={styles.historyStatus}>Completed</Text>
        </View>

        <View style={styles.historyItem}>
          <View style={styles.historyIconWrap}>
            <Ionicons name="airplane-outline" size={20} color="#64748b" />
          </View>
          <View style={styles.historyBody}>
            <Text style={styles.historyTitle}>Privilege Leave</Text>
            <Text style={styles.historySub}>Aug 20 - Aug 25 • 5 Days</Text>
          </View>
          <Text style={styles.historyStatus}>Completed</Text>
        </View>

        <View style={styles.historyItem}>
          <View style={styles.historyIconWrap}>
              <View style={styles.rejectedIconBg}>
                <Ionicons name="calendar-outline" size={18} color="#ef4444" />
                <View style={styles.rejectedX}>
                    <Ionicons name="close" size={10} color="#fff" />
                </View>
              </View>
          </View>
          <View style={styles.historyBody}>
            <Text style={styles.historyTitle}>Casual Leave</Text>
            <Text style={styles.historySub}>Jul 05 • 1 Day</Text>
          </View>
          <Text style={[styles.historyStatus, { color: '#ef4444' }]}>Rejected</Text>
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  scrollContent: {
    padding: 16,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  balanceCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'flex-start',
  },
  balanceType: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
  },
  balanceSub: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  requestButton: {
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  viewAllText: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '600',
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  dateBlock: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateMonth: {
    fontSize: 10,
    fontWeight: '700',
  },
  dateDay: {
    fontSize: 18,
    fontWeight: '800',
  },
  upcomingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  upcomingSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  historyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyBody: {
    flex: 1,
    marginLeft: 12,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  historySub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  historyStatus: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '500',
  },
  rejectedIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  rejectedX: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  }
});
