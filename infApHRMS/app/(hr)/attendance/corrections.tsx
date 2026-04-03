import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HRBottomNav } from '@/components/HRBottomNav';
import Header from '@/components/layout/Header';

import { useHR } from '@/context/HRContext';

export default function AttendanceCorrections() {
  const { correctionRequests, approveCorrection, approveBulkCorrections } = useHR();
  const [activeTab, setActiveTab] = useState('Pending');
  const tabs = ['Pending', 'Approved', 'Rejected'];

  const displayedRequests = correctionRequests.filter(req => req.status === activeTab);
  const pendingRequests = correctionRequests.filter(req => req.status === 'Pending');

  return (
    <View style={styles.container}>
      <Header 
        title="Attendance Corrections"
        subtitle="MANAGER PORTAL"
        showBack={true}
      />

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
          <Text style={styles.sectionTitle}>{activeTab === 'Pending' ? 'Pending Requests' : `${activeTab} Requests`} ({displayedRequests.length})</Text>
          {activeTab === 'Pending' && (
            <TouchableOpacity>
              <Text style={styles.selectAllText}>Select All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Requests List */}
        <View style={styles.listContainer}>
          {displayedRequests.map((req, index) => (
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
                  {req.status === 'Pending' && (
                    <TouchableOpacity style={styles.approveBtn} onPress={() => { approveCorrection(req.id); router.push('/(hr)/attendance/correction-success'); }}>
                      <Text style={styles.approveBtnText}>Approve</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
          {displayedRequests.length === 0 && (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#9ca3af' }}>No {activeTab.toLowerCase()} requests.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bulk Action Sticky Bottom */}
      {activeTab === 'Pending' && pendingRequests.length > 0 && (
        <View style={styles.stickyBottom}>
          <TouchableOpacity 
            style={styles.bulkBtn} 
            onPress={() => {
              approveBulkCorrections(pendingRequests.map(r => r.id));
              router.push('/(hr)/attendance/correction-success');
            }}
          >
            <Ionicons name="checkmark-done" size={20} color="#ffffff" />
            <Text style={styles.bulkBtnText}>Bulk Approve ({pendingRequests.length} Requests)</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <HRBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  
  banner: { paddingHorizontal: 20, paddingBottom: 16, paddingTop: 6 },
  bannerText: { fontSize: 13, color: '#4b5563', lineHeight: 20, textAlign: 'center' },

  tabsContainer: { paddingHorizontal: 20, flexDirection: 'row', gap: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 12 },
  tab: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, backgroundColor: 'transparent' },
  activeTab: { backgroundColor: '#f0fdf4' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  activeTabText: { color: '#22c55e' },

  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 180 },
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

  stickyBottom: { position: 'absolute', bottom: 120, left: 20, right: 20, zIndex: 50 }, // Placed above the floating nav
  bulkBtn: { backgroundColor: '#4f46e5', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderRadius: 16, shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  bulkBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '800', marginLeft: 10 }
});
