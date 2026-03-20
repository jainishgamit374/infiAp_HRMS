import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLeave } from '../../context/LeaveContext';

export default function LeaveDetails() {
  const { id } = useLocalSearchParams();
  const { leaves } = useLeave();
  
  const leave = leaves.find(l => l.id === id);

  if (!leave) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Leave Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={48} color="#cbd5e1" />
          <Text style={styles.emptyText}>Leave not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return { text: '#22c55e', bg: '#dcfce7' };
      case 'PENDING': return { text: '#ea580c', bg: '#ffedd5' };
      case 'REJECTED': return { text: '#ef4444', bg: '#fee2e2' };
      default: return { text: '#64748b', bg: '#f1f5f9' };
    }
  };

  const statusColors = getStatusColor(leave.status);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  const getIconForType = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('sick')) return 'medkit-outline';
    if (lowerType.includes('personal') || lowerType.includes('casual')) return 'briefcase-outline';
    if (lowerType.includes('wfh')) return 'home-outline';
    return 'calendar-outline';
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave Details</Text>
        {leave.status === 'PENDING' ? (
          <TouchableOpacity 
            style={styles.headerBtn} 
            onPress={() => router.push({ pathname: '/(employee)/edit-leave', params: { id: leave.id } })}
          >
            <Ionicons name="pencil" size={20} color="#4f39f6" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card 1: Overview and Status */}
        <Animated.View entering={FadeInDown.delay(100).springify().damping(15)} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <Ionicons name={getIconForType(leave.type)} size={28} color="#4f39f6" />
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.leaveType}>{leave.type}</Text>
              <Text style={styles.appliedDate}>Applied on {formatDate(leave.appliedDate)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statusSection}>
            <Text style={styles.sectionLabel}>Current Status</Text>
            <View style={[styles.badge, { backgroundColor: statusColors.bg }]}>
              <Text style={[styles.badgeText, { color: statusColors.text }]}>{leave.status}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Card 2: Dates and Reason */}
        <Animated.View entering={FadeInDown.delay(200).springify().damping(15)} style={styles.card}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Start Date</Text>
              <Text style={styles.detailValue}>{formatDate(leave.startDate)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>End Date</Text>
              <Text style={styles.detailValue}>{formatDate(leave.endDate)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Total Days</Text>
              <Text style={styles.detailValue}>{leave.days} Day{leave.days > 1 ? 's' : ''}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.reasonSection}>
            <Text style={styles.detailLabel}>Reason for Leave</Text>
            <Text style={styles.reasonText}>{leave.reason}</Text>
          </View>
        </Animated.View>

        {/* Card 3: Rejection Reason (If Applicable) */}
        {leave.status === 'REJECTED' && leave.rejectionReason && (
          <Animated.View entering={FadeInDown.delay(300).springify().damping(15)} style={[styles.card, styles.rejectedCard]}>
            <View style={styles.reasonSection}>
               <View style={styles.rejectedHeader}>
                 <Ionicons name="alert-circle" size={20} color="#ef4444" />
                 <Text style={styles.rejectedLabel}>Rejection Reason</Text>
               </View>
              <Text style={styles.rejectedText}>{leave.rejectionReason}</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
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
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#4f39f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  headerTextWrap: {
    marginLeft: 14,
    flex: 1,
  },
  leaveType: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  appliedDate: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 16,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  reasonSection: {
    flex: 1,
  },
  reasonText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
    marginTop: 4,
  },
  rejectedCard: {
    backgroundColor: '#fff5f5',
    borderColor: '#fee2e2',
  },
  rejectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rejectedLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ef4444',
    marginLeft: 6,
  },
  rejectedText: {
    fontSize: 15,
    color: '#991b1b',
    lineHeight: 22,
  },
});
