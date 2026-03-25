import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { HRBottomNav } from '@/components/HRBottomNav';

const MOCK_REQUESTS = [
  {
    id: 'REQ-01',
    name: 'Alexander Wright',
    role: 'Software Engineer',
    empId: 'ID: 1042',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267041',
    date: 'Oct 24, 2023',
    originalTime: '09:15 AM',
    requestedCorrection: '08:30 AM',
    status: 'Pending'
  },
  {
    id: 'REQ-02',
    name: 'Sarah Jenkins',
    role: 'UX Designer',
    empId: 'ID: 1069',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267042',
    date: 'Oct 23, 2023',
    originalTime: '06:05 PM',
    requestedCorrection: '06:45 PM',
    status: 'Pending'
  },
  {
    id: 'REQ-03',
    name: 'David Miller',
    role: 'Data Analyst',
    empId: 'ID: 1121',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267043',
    date: 'Oct 23, 2023',
    originalTime: '09:00 AM',
    requestedCorrection: '08:45 AM',
    status: 'Pending'
  }
];

export default function AttendanceCorrections() {
  const [activeTab, setActiveTab] = useState('Pending');
  const tabs = ['Pending', 'Approved', 'Rejected'];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="apps-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>InfiAP Corrections</Text>
            <Text style={styles.headerSubtitle}>MANAGER PORTAL</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <Ionicons name="notifications-outline" size={22} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>Transform your workforce through innovation with AI-powered enterprise technology.</Text>
      </View>

      {/* Tabs */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Pending Requests ({MOCK_REQUESTS.length})</Text>
          <TouchableOpacity>
            <Text style={styles.selectAllText}>Select All</Text>
          </TouchableOpacity>
        </View>

        {/* Requests List */}
        <View style={styles.listContainer}>
          {MOCK_REQUESTS.map((req, index) => (
            <Animated.View key={req.id} entering={FadeInRight.delay(index * 100).duration(500)}>
              <TouchableOpacity activeOpacity={0.8} style={styles.card} onPress={() => router.push(`/(hr)/attendance/correction-request/${req.id}`)}>
                <View style={styles.cardHeader}>
                  <Image source={{ uri: req.avatar }} style={styles.avatar} />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{req.name}</Text>
                    <Text style={styles.userRole}>{req.role} · {req.empId}</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{req.status}</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.timeCol}>
                    <Text style={styles.label}>DATE</Text>
                    <Text style={styles.valueText}>{req.date}</Text>
                    <Text style={[styles.label, { marginTop: 12 }]}>REQUESTED CORRECTION</Text>
                    <Text style={[styles.valueText, { color: '#4f46e5' }]}>{req.requestedCorrection}</Text>
                  </View>
                  <View style={styles.timeCol}>
                    <Text style={styles.label}>ORIGINAL TIME</Text>
                    <Text style={styles.valueText}>{req.originalTime}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <TouchableOpacity style={styles.reviewBtn} onPress={() => router.push(`/(hr)/attendance/correction-request/${req.id}`)}>
                    <Text style={styles.reviewBtnText}>Review</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.approveBtn}>
                    <Text style={styles.approveBtnText}>Approve</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bulk Action Sticky Bottom */}
      <View style={styles.stickyBottom}>
        <TouchableOpacity style={styles.bulkBtn}>
          <Ionicons name="checkmark-done" size={20} color="#ffffff" />
          <Text style={styles.bulkBtnText}>Bulk Approve ({MOCK_REQUESTS.length} Requests)</Text>
        </TouchableOpacity>
      </View>
      
      <HRBottomNav />
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
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  headerSubtitle: { fontSize: 10, fontWeight: '700', color: '#6b7280', letterSpacing: 0.5 },
  bellBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e7eb', justifyContent: 'center', alignItems: 'center' },
  
  banner: { paddingHorizontal: 20, paddingBottom: 16 },
  bannerText: { fontSize: 13, color: '#4b5563', lineHeight: 20, textAlign: 'center' },

  tabsContainer: { paddingHorizontal: 20, flexDirection: 'row', gap: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 12 },
  tab: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, backgroundColor: 'transparent' },
  activeTab: { backgroundColor: '#f0fdf4' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  activeTabText: { color: '#22c55e' },

  content: { padding: 20 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
  selectAllText: { fontSize: 13, fontWeight: '600', color: '#4f46e5' },

  listContainer: { gap: 16 },
  card: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 20, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '800', color: '#111827', marginBottom: 2 },
  userRole: { fontSize: 12, color: '#6b7280' },
  badge: { backgroundColor: '#fffbeb', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#f59e0b' },
  
  cardBody: { flexDirection: 'row', marginBottom: 16, backgroundColor: '#f8f9fe', padding: 12, borderRadius: 12 },
  timeCol: { flex: 1 },
  label: { fontSize: 10, fontWeight: '700', color: '#9ca3af', marginBottom: 4, letterSpacing: 0.5 },
  valueText: { fontSize: 14, fontWeight: '700', color: '#111827' },
  
  cardFooter: { flexDirection: 'row', gap: 12 },
  reviewBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center' },
  reviewBtnText: { fontSize: 14, fontWeight: '700', color: '#4b5563' },
  approveBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#4f46e5', alignItems: 'center' },
  approveBtnText: { fontSize: 14, fontWeight: '700', color: '#ffffff' },

  stickyBottom: { position: 'absolute', bottom: 85, left: 20, right: 20 }, // Placed just above the bottom nav
  bulkBtn: { backgroundColor: '#4f46e5', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderRadius: 16, shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  bulkBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700', marginLeft: 8 }
});
