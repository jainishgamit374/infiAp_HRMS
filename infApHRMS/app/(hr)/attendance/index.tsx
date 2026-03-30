import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { HRBottomNav } from '@/components/HRBottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/layout/Header';

const MOCK_RECORDS = [
  {
    id: 'INF-201',
    name: 'James Wilson',
    role: 'Product Design',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    status: 'LATE',
    inTime: '09:45 AM',
    outTime: '06:15 PM',
  },
  {
    id: 'INF-202',
    name: 'Sarah Chen',
    role: 'Engineering',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
    status: 'PRESENT',
    inTime: '08:52 AM',
    outTime: '06:05 PM',
  },
  {
    id: 'INF-203',
    name: 'Marcus Wright',
    role: 'Marketing Ops',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b',
    status: 'WFH',
    inTime: '09:00 AM', // Remote Login
    outTime: '--:--',  // Remote Logout
  },
  {
    id: 'INF-204',
    name: 'Elena Rodriguez',
    role: 'Human Resources',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c',
    status: 'ON LEAVE',
    leaveInfo: 'Approved Annual Leave (Day 2 of 5)'
  }
];

export default function AttendanceMain() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return '#22c55e';
      case 'LATE': return '#f59e0b';
      case 'WFH': return '#6366f1';
      case 'ON LEAVE': return '#64748b';
      case 'ABSENT': return '#ef4444';
      default: return '#1f2937';
    }
  };

  const renderCard = (value: number, label: string, icon: any, color: string, index: number) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(600)} style={styles.card}>
      <View style={[styles.iconBg, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Unified Header */}
      <Header 
        title="Attendance Dashboard" 
        subtitle="Track & Manage Presence"
        showBack={true} 
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Intro Section */}
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text style={styles.sectionTitle}>Daily Overview</Text>
          <Text style={styles.sectionSubtitle}>Track employee attendance, monitor check-ins, and generate attendance reports for InfiAP.</Text>
        </Animated.View>

        {/* Quadrant Cards */}
        <View style={styles.cardsGrid}>
          {renderCard(280, 'PRESENT TODAY', 'checkmark-circle-outline', '#22c55e', 0)}
          {renderCard(15, 'ABSENT', 'close-circle-outline', '#ef4444', 1)}
          {renderCard(8, 'LATE ARRIVALS', 'time-outline', '#f59e0b', 2)}
          {renderCard(12, 'WFH MODE', 'home-outline', '#6366f1', 3)}
        </View>

        {/* Check-in Records Section */}
        <View style={styles.recordsHeader}>
          <Text style={styles.sectionTitle}>Check-in Records</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* List */}
        <View style={styles.recordsList}>
          {MOCK_RECORDS.map((record, index) => (
            <Animated.View key={record.id} entering={FadeInRight.delay(index * 100).duration(500)}>
              <TouchableOpacity activeOpacity={0.7} style={styles.recordItem} onPress={() => router.push(`/(hr)/attendance/${record.id}`)}>
                <View style={styles.recordMain}>
                  <Image source={{ uri: record.avatar }} style={styles.avatar} />
                  <View style={styles.recordInfo}>
                    <Text style={styles.recordName}>{record.name}</Text>
                    <Text style={styles.recordRole}>{record.role}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(record.status)}15` }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(record.status) }]}>{record.status}</Text>
                  </View>
                </View>

                {record.status !== 'ON LEAVE' ? (
                  <View style={styles.timeInfo}>
                    <View style={styles.timeBlock}>
                      <Text style={styles.timeLabel}>{record.status === 'WFH' ? 'REMOTE LOGIN' : 'IN TIME'}</Text>
                      <Text style={styles.timeValue}>{record.inTime}</Text>
                    </View>
                    <View style={[styles.timeBlock, { alignItems: 'flex-end' }]}>
                      <Text style={styles.timeLabel}>{record.status === 'WFH' ? 'REMOTE LOGOUT' : 'OUT TIME'}</Text>
                      <Text style={styles.timeValue}>{record.outTime}</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.leaveInfoBox}>
                    <Text style={styles.leaveInfoText}>{record.leaveInfo}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Since the user has requested a HR Bottom Nav logic */}
      <HRBottomNav />
    </SafeAreaView>
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
  headerBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  content: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 6 },
  sectionSubtitle: { fontSize: 13, color: '#6b7280', lineHeight: 20, marginBottom: 24, paddingRight: 20 },
  cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 32 },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 8,
  },
  iconBg: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardValue: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 4 },
  cardLabel: { fontSize: 11, fontWeight: '700', color: '#6b7280', letterSpacing: 0.5 },
  recordsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  viewAllText: { fontSize: 13, fontWeight: '600', color: '#4f46e5' },
  recordsList: { gap: 16 },
  recordItem: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  recordMain: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 46, height: 46, borderRadius: 23, marginRight: 12 },
  recordInfo: { flex: 1 },
  recordName: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 2 },
  recordRole: { fontSize: 12, color: '#6b7280' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  timeInfo: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  timeBlock: { flex: 1 },
  timeLabel: { fontSize: 10, fontWeight: '700', color: '#9ca3af', marginBottom: 4, letterSpacing: 0.5 },
  timeValue: { fontSize: 14, fontWeight: '700', color: '#1f2937' },
  leaveInfoBox: { paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  leaveInfoText: { fontSize: 13, color: '#64748b', fontStyle: 'italic' }
});
