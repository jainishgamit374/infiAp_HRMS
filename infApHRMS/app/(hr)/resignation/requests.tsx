import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useResignation } from './_layout';
import { HRBottomNav } from '@/components/HRBottomNav';
import Header from '@/components/layout/Header';

export default function ResignationRequests() {
  const { requests, approveResignation, rejectResignation } = useResignation();
  const [activeTab, setActiveTab] = React.useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

  const displayedRequests = activeTab === 'All' ? requests : requests.filter(r => r.status === activeTab);

  const getStatusStyle = (s: string) => {
    if (s === 'Approved') return { bg: '#ecfdf5', text: '#10b981' };
    if (s === 'Rejected') return { bg: '#fef2f2', text: '#ef4444' };
    return { bg: '#fffbeb', text: '#f59e0b' };
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Resignation Requests"
        showBack={true}
      />

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab as any)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {displayedRequests.map((req, idx) => {
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
              <Text style={styles.reason}>&quot;{req.reason}&quot;</Text>
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  tabsContainer: { backgroundColor: '#fff', paddingTop: 10, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tabsScroll: { paddingHorizontal: 20, gap: 12 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb' },
  activeTab: { backgroundColor: '#5a55d2', borderColor: '#5a55d2' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  activeTabText: { color: '#fff' },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },
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
