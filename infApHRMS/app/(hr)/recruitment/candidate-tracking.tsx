import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRecruitment, CandidateStatus } from './_layout';
import { HRBottomNav } from '@/components/HRBottomNav';

export default function CandidateTracking() {
  const { candidates, updateStatus } = useRecruitment();
  const [activeTab, setActiveTab] = useState<'All' | CandidateStatus>('All');

  const getStatusColor = (status: CandidateStatus) => {
    switch (status) {
      case 'Applied': return { bg: '#eef2ff', text: '#4f46e5', icon: 'send-outline' };
      case 'Shortlisted': return { bg: '#fdf4ff', text: '#c026d3', icon: 'star-outline' };
      case 'Interview': return { bg: '#fff7ed', text: '#ea580c', icon: 'calendar-outline' };
      case 'Selected': return { bg: '#ecfdf5', text: '#10b981', icon: 'checkmark-circle-outline' };
      case 'Rejected': return { bg: '#fef2f2', text: '#ef4444', icon: 'close-circle-outline' };
      default: return { bg: '#f3f4f6', text: '#4b5563', icon: 'ellipse-outline' };
    }
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => activeTab === 'All' ? true : c.status === activeTab);
  }, [candidates, activeTab]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Candidate Tracking</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(hr)/recruitment/add-candidate')}>
          <Ionicons name="person-add" size={16} color="#fff" />
          <Text style={styles.addBtnText}>Add Candidate</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput 
            placeholder="Search by name, role, or skills..." 
            style={styles.searchInput} 
            placeholderTextColor="#9ca3af"
          />
        </Animated.View>

        {/* Dropdown Filters */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.dropdownFilters}>
          <TouchableOpacity style={[styles.filterBtn, { backgroundColor: '#4f46e5', borderColor: '#4f46e5' }]}>
            <Text style={[styles.filterBtnText, { color: '#fff' }]}>All Status</Text>
            <Ionicons name="chevron-down" size={14} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterBtnText}>Experience</Text>
            <Ionicons name="chevron-down" size={14} color="#4b5563" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Text style={styles.filterBtnText}>Department</Text>
            <Ionicons name="chevron-down" size={14} color="#4b5563" />
          </TouchableOpacity>
        </Animated.View>

        {/* Status Pill Tabs */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.pillContainer}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
              {[
                { id: 'All', label: 'All Status', count: candidates.length },
                { id: 'Applied', label: 'Applied', count: candidates.filter(c => c.status === 'Applied').length },
                { id: 'Shortlisted', label: 'Shortlisted', count: candidates.filter(c => c.status === 'Shortlisted').length },
                { id: 'Interview', label: 'Interview', count: candidates.filter(c => c.status === 'Interview').length },
                { id: 'Rejected', label: 'Rejected', count: candidates.filter(c => c.status === 'Rejected').length }
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <TouchableOpacity 
                    key={tab.id} 
                    style={[styles.pillTab, isActive && styles.pillTabActive]}
                    onPress={() => setActiveTab(tab.id as any)}
                  >
                    <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{tab.label}</Text>
                    <View style={[styles.pillBadge, isActive && styles.pillBadgeActive]}>
                       <Text style={[styles.pillBadgeText, isActive && styles.pillBadgeTextActive]}>{tab.count}</Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
           </ScrollView>
        </Animated.View>

        {/* List */}
        <View style={styles.list}>
          {filteredCandidates.map((candidate, index) => (
            <Animated.View 
              key={candidate.id} 
              entering={FadeInUp.delay(300 + index * 100).duration(400)}
              style={styles.card}
            >
              <View style={styles.cardInfo}>
                <Image source={{ uri: candidate.avatarUrl }} style={styles.cardAvatar} />
                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.cardName}>{candidate.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(candidate.status).bg }]}>
                      <Ionicons name={getStatusColor(candidate.status).icon as any} size={10} color={getStatusColor(candidate.status).text} style={{ marginRight: 4 }} />
                      <Text style={[styles.statusText, { color: getStatusColor(candidate.status).text }]}>
                        {candidate.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.cardRole}>{candidate.role} • {candidate.department}</Text>
                  <View style={styles.cardMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar-outline" size={14} color="#9ca3af" />
                      <Text style={styles.metaText}>{candidate.time}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="briefcase-outline" size={14} color="#9ca3af" />
                      <Text style={styles.metaText}>{candidate.experience}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Dynamic Actions */}
              <View style={styles.cardActions}>
                {candidate.status === 'Applied' && (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionBtn, { borderColor: '#eef2ff', backgroundColor: '#fff' }]}
                      onPress={() => router.push(`/(hr)/recruitment/candidate/${candidate.id}` as any)}
                    >
                      <Ionicons name="eye-outline" size={16} color="#4f46e5" />
                      <Text style={[styles.actionText, { color: '#4f46e5' }]}>Profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.actionBtn, { backgroundColor: '#ecfdf5', borderColor: '#ecfdf5' }]}
                      onPress={() => updateStatus(candidate.id, 'Shortlisted')}
                    >
                      <Ionicons name="checkmark" size={16} color="#10b981" />
                      <Text style={[styles.actionText, { color: '#10b981' }]}>Shortlist</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.actionBtn, { backgroundColor: '#fef2f2', borderColor: '#fef2f2' }]}
                      onPress={() => updateStatus(candidate.id, 'Rejected')}
                    >
                      <Ionicons name="close" size={16} color="#ef4444" />
                      <Text style={[styles.actionText, { color: '#ef4444' }]}>Reject</Text>
                    </TouchableOpacity>
                  </>
                )}

                {candidate.status === 'Shortlisted' && (
                  <>
                    <TouchableOpacity 
                      style={[styles.actionBtn, { backgroundColor: '#4f46e5', borderColor: '#4f46e5' }]}
                      onPress={() => updateStatus(candidate.id, 'Interview')}
                    >
                      <Ionicons name="calendar-outline" size={16} color="#fff" />
                      <Text style={[styles.actionText, { color: '#fff' }]}>Schedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, { paddingHorizontal: 16, backgroundColor: '#f3f4f6', borderColor: '#f3f4f6' }]}>
                      <Ionicons name="ellipsis-horizontal" size={16} color="#4b5563" />
                    </TouchableOpacity>
                  </>
                )}

                {candidate.status === 'Selected' && (
                  <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: '#10b981', borderColor: '#10b981' }]}
                    onPress={() => alert('Offer Sent!')}
                  >
                    <Ionicons name="paper-plane-outline" size={16} color="#fff" />
                    <Text style={[styles.actionText, { color: '#fff' }]}>Send Offer</Text>
                  </TouchableOpacity>
                )}

                {candidate.status === 'Rejected' && (
                  <TouchableOpacity 
                    style={[styles.actionBtn, { backgroundColor: '#f9fafb', borderColor: '#e5e7eb' }]}
                    onPress={() => updateStatus(candidate.id, 'Applied')}
                  >
                    <Ionicons name="refresh" size={16} color="#6b7280" />
                    <Text style={[styles.actionText, { color: '#4b5563' }]}>Re-evaluate</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
      <HRBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 50 : 30, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backBtn: { marginRight: 12 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#111827' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#4f46e5', paddingVertical: 12, borderRadius: 12 },
  addBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  content: { padding: 20, paddingBottom: 100 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 16, height: 50, marginBottom: 16 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, color: '#111827' },
  dropdownFilters: { flexDirection: 'row', gap: 8, marginBottom: 24, paddingBottom: 4 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  filterBtnText: { color: '#4b5563', fontSize: 13, fontWeight: '500' },
  pillContainer: { marginBottom: 24, marginHorizontal: -20 },
  pillTab: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', paddingLeft: 16, paddingRight: 6, paddingVertical: 8, borderRadius: 24, marginRight: 12 },
  pillTabActive: { backgroundColor: '#111827', borderColor: '#111827' },
  pillText: { fontSize: 14, fontWeight: '600', color: '#4b5563', marginRight: 8 },
  pillTextActive: { color: '#fff' },
  pillBadge: { backgroundColor: '#e5e7eb', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  pillBadgeActive: { backgroundColor: '#374151' },
  pillBadgeText: { fontSize: 12, fontWeight: '700', color: '#4b5563' },
  pillBadgeTextActive: { color: '#e5e7eb' },
  list: { gap: 16 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 2 },
  cardInfo: { flexDirection: 'row', alignItems: 'flex-start' },
  cardAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 16 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cardName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  cardRole: { fontSize: 13, color: '#6b7280', marginBottom: 8, fontWeight: '500' },
  cardMeta: { flexDirection: 'row', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: '#9ca3af', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 16 },
  cardActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  actionText: { fontSize: 12, fontWeight: '600' },
});
