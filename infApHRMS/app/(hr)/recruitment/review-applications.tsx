import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useRecruitment } from './_layout';
import { HRBottomNav } from '@/components/HRBottomNav';

export default function ReviewApplications() {
  const { candidates, updateStatus } = useRecruitment();
  const [activeTab, setActiveTab] = useState<'Applied' | 'Shortlisted' | 'Interview'>('Applied');

  const pendingCandidates = useMemo(() => {
    return candidates.filter((c) => c.status === activeTab);
  }, [candidates, activeTab]);

  return (
    <View style={styles.container}>
      {/* Header Area */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
             <Ionicons name="settings-outline" size={24} color="#4f46e5" />
          </TouchableOpacity>
          <Text style={styles.headerTitleSmall}>InfiAp Recruiter</Text>
          <View style={{ flex: 1 }} />
          <Ionicons name="notifications-outline" size={20} color="#6b7280" style={{ marginRight: 16 }} />
          <View style={styles.avatarCircle}><Text style={styles.avatarTextSmall}>JD</Text></View>
        </View>

        <Text style={styles.headerTitle}>Review Applications</Text>
        
        <View style={styles.statsRow}>
           <View style={styles.statChip}>
             <Text style={styles.statChipValue}>12</Text>
             <Text style={styles.statChipLabel}>New Today</Text>
           </View>
           <View style={styles.statChip}>
             <Text style={styles.statChipValue}>48</Text>
             <Text style={styles.statChipLabel}>Pending Review</Text>
           </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity 
          style={activeTab === 'Applied' ? styles.activeTab : styles.inactiveTab}
          onPress={() => setActiveTab('Applied')}
        >
          <Text style={activeTab === 'Applied' ? styles.activeTabText : styles.inactiveTabText}>
            New ({candidates.filter(c => c.status === 'Applied').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={activeTab === 'Shortlisted' ? styles.activeTab : styles.inactiveTab}
          onPress={() => setActiveTab('Shortlisted')}
        >
          <Text style={activeTab === 'Shortlisted' ? styles.activeTabText : styles.inactiveTabText}>
            Shortlisted ({candidates.filter(c => c.status === 'Shortlisted').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={activeTab === 'Interview' ? styles.activeTab : styles.inactiveTab}
          onPress={() => setActiveTab('Interview')}
        >
          <Text style={activeTab === 'Interview' ? styles.activeTabText : styles.inactiveTabText}>
            Interview ({candidates.filter(c => c.status === 'Interview').length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {pendingCandidates.map((candidate, index) => (
          <Animated.View 
            key={candidate.id} 
            entering={FadeInRight.delay(100 + index * 100).duration(400)}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Image source={{ uri: candidate.avatarUrl }} style={styles.cardAvatar} />
              <View>
                <Text style={styles.cardName}>{candidate.name}</Text>
                <Text style={styles.cardApplied}>Applied {candidate.appliedDate}</Text>
              </View>
            </View>

            <View style={styles.cardDetails}>
              <View style={styles.detailRow}>
                 <Ionicons name="briefcase-outline" size={14} color="#6b7280" />
                 <Text style={styles.detailText}>{candidate.role}</Text>
              </View>
              <View style={styles.detailRow}>
                 <Ionicons name="business-outline" size={14} color="#6b7280" />
                 <Text style={styles.detailText}>{candidate.department}</Text>
              </View>
              <View style={styles.detailRow}>
                 <Ionicons name="location-outline" size={14} color="#6b7280" />
                 <Text style={styles.detailText}>{candidate.location}</Text>
              </View>
            </View>

            <View style={styles.actionsGrid}>
              <TouchableOpacity style={[styles.actionBtn, styles.btnReview]} onPress={() => router.push(`/(hr)/recruitment/candidate/${candidate.id}` as any)}>
                <Ionicons name="eye" size={14} color="#fff" />
                <Text style={styles.btnReviewText}>Review</Text>
              </TouchableOpacity>
              
              {activeTab === 'Applied' && (
                <TouchableOpacity 
                   style={[styles.actionBtn, styles.btnShortlist]} 
                   onPress={() => {
                     updateStatus(candidate.id, 'Shortlisted');
                     Alert.alert('✅ Success', `${candidate.name} has been shortlisted.`);
                   }}
                >
                  <Ionicons name="checkmark-circle-outline" size={14} color="#10b981" />
                  <Text style={styles.btnShortlistText}>Shortlist</Text>
                </TouchableOpacity>
              )}
              
              {(activeTab === 'Applied' || activeTab === 'Shortlisted') && (
                <TouchableOpacity 
                  style={[styles.actionBtn, styles.btnSchedule]} 
                  onPress={() => {
                    updateStatus(candidate.id, 'Interview');
                    Alert.alert('📅 Interview Scheduled', `A notification has been sent to ${candidate.name}.`);
                  }}
                >
                  <Ionicons name="calendar-outline" size={14} color="#f59e0b" />
                  <Text style={styles.btnScheduleText}>Schedule{'\n'}Interview</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={[styles.actionBtn, styles.btnReject]} 
                onPress={() => {
                  updateStatus(candidate.id, 'Rejected');
                  Alert.alert('❌ Rejected', `${candidate.name}'s application has been rejected.`);
                }}
              >
                <Ionicons name="close-circle-outline" size={14} color="#ef4444" />
                <Text style={styles.btnRejectText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}

        {/* Pagination mock */}
        <View style={styles.pagination}>
           <Text style={styles.paginationText}>Showing 1-4 of 24{'\n'}applications</Text>
           <View style={styles.pageNumbers}>
              <Ionicons name="chevron-back" size={16} color="#9ca3af" style={{ marginHorizontal: 8 }} />
              <View style={styles.activePage}><Text style={styles.activePageText}>1</Text></View>
              <Text style={styles.pageText}>2</Text>
              <Text style={styles.pageText}>3</Text>
              <Ionicons name="chevron-forward" size={16} color="#4b5563" style={{ marginHorizontal: 8 }} />
           </View>
        </View>
      </ScrollView>
      <HRBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fe' },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 50 : 30, backgroundColor: '#fff' },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backBtn: { marginRight: 8 },
  headerTitleSmall: { fontSize: 16, fontWeight: '700', color: '#111827' },
  avatarCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center' },
  avatarTextSmall: { fontSize: 12, fontWeight: '700', color: '#4f46e5' },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#f3f4f6' },
  statChipValue: { fontSize: 15, fontWeight: '700', color: '#4f46e5', marginRight: 6 },
  statChipLabel: { fontSize: 13, color: '#4b5563', fontWeight: '500' },
  tabsRow: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingHorizontal: 20 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#4f46e5', paddingVertical: 12, marginRight: 24 },
  activeTabText: { fontSize: 14, fontWeight: '600', color: '#4f46e5' },
  inactiveTab: { paddingVertical: 12, marginRight: 24 },
  inactiveTabText: { fontSize: 14, fontWeight: '500', color: '#6b7280' },
  listContainer: { padding: 20, gap: 16, paddingBottom: 100 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  cardAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 16 },
  cardName: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 2 },
  cardApplied: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  cardDetails: { gap: 8, marginBottom: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailText: { fontSize: 13, color: '#4b5563', fontWeight: '500' },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  actionBtn: { width: '48%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, gap: 6, marginBottom: 8 },
  btnReview: { backgroundColor: '#4f46e5' },
  btnReviewText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  btnShortlist: { backgroundColor: '#ecfdf5' },
  btnShortlistText: { color: '#10b981', fontWeight: '600', fontSize: 13 },
  btnSchedule: { backgroundColor: '#fffbeb' },
  btnScheduleText: { color: '#f59e0b', fontWeight: '600', fontSize: 12, textAlign: 'center' },
  btnReject: { backgroundColor: '#fef2f2' },
  btnRejectText: { color: '#ef4444', fontWeight: '600', fontSize: 13 },
  pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  paginationText: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  pageNumbers: { flexDirection: 'row', alignItems: 'center' },
  activePage: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center', marginHorizontal: 4 },
  activePageText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  pageText: { fontSize: 14, color: '#4b5563', fontWeight: '500', marginHorizontal: 12 },
});
