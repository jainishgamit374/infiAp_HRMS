import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRecruitment, CandidateStatus } from './_layout';
import { HRBottomNav } from '@/components/HRBottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/layout/Header';

export default function RecruitmentDashboard() {
  const { candidates } = useRecruitment();

  const getStatusColor = (status: CandidateStatus) => {
    switch (status) {
      case 'Applied': return { bg: '#eef2ff', text: '#4f46e5' };
      case 'Shortlisted': return { bg: '#fffbeb', text: '#d97706' };
      case 'Interview': return { bg: '#ecfdf5', text: '#10b981' };
      case 'Selected': return { bg: '#ecfdf5', text: '#10b981' };
      case 'Rejected': return { bg: '#fef2f2', text: '#ef4444' };
      default: return { bg: '#f3f4f6', text: '#4b5563' };
    }
  };

  const recentCandidates = candidates.filter(c => ['Sarah Connor', 'Marcus Thompson', 'Elena Gilbert', 'Kyle Reese'].includes(c.name));

  return (
    <SafeAreaView style={styles.container}>
      {/* Unified Header */}
      <Header 
        title="Recruitment" 
        subtitle="Manage Candidates & Jobs"
        showBack={true} 
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput 
            placeholder="Search candidates, jobs, or skills..." 
            style={styles.searchInput} 
            placeholderTextColor="#9ca3af"
          />
        </Animated.View>

        {/* Filter Tabs */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.filterTabs}>
          <TouchableOpacity style={styles.activeTab} onPress={() => router.push('/(hr)/recruitment/candidate-tracking')}>
            <Text style={styles.activeTabText}>All Applicants</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inactiveTab} onPress={() => router.push('/(hr)/recruitment/candidate-tracking')}>
            <Text style={styles.inactiveTabText}>Shortlisted</Text>
            <Ionicons name="chevron-down" size={14} color="#4b5563" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.inactiveTab} onPress={() => router.push('/(hr)/recruitment/review-applications')}>
            <Text style={styles.inactiveTabText}>Interview</Text>
            <Ionicons name="chevron-down" size={14} color="#4b5563" />
          </TouchableOpacity>
        </Animated.View>

        {/* 2x2 Stats Grid */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.statsGrid}>
          {/* Box 1 */}
          <TouchableOpacity 
            style={styles.statBox}
            onPress={() => router.push('/(hr)/recruitment/candidate-tracking')}
          >
            <View style={styles.statBoxHeader}>
              <View style={[styles.iconCircle, { backgroundColor: '#eef2ff' }]}>
                <Ionicons name="briefcase-outline" size={20} color="#4f46e5" />
              </View>
              <View style={[styles.badge, { backgroundColor: '#eef2ff' }]}>
                <Text style={[styles.badgeText, { color: '#4f46e5' }]}>+2 new</Text>
              </View>
            </View>
            <Text style={styles.statLabel}>Open Jobs</Text>
            <Text style={styles.statValue}>12</Text>
          </TouchableOpacity>

          {/* Box 2 */}
          <TouchableOpacity 
            style={styles.statBox}
            onPress={() => router.push('/(hr)/recruitment/candidate-tracking')}
          >
            <View style={styles.statBoxHeader}>
              <View style={[styles.iconCircle, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="people-outline" size={20} color="#10b981" />
              </View>
              <Text style={styles.positiveText}>+10%</Text>
            </View>
            <Text style={styles.statLabel}>Candidates</Text>
            <Text style={styles.statValue}>145</Text>
          </TouchableOpacity>

          {/* Box 3 */}
          <TouchableOpacity 
            style={styles.statBox}
            onPress={() => router.push('/(hr)/recruitment/review-applications')}
          >
            <View style={styles.statBoxHeader}>
              <View style={[styles.iconCircle, { backgroundColor: '#fffbeb' }]}>
                <Ionicons name="calendar-outline" size={20} color="#f59e0b" />
              </View>
              <View style={[styles.badge, { backgroundColor: '#f3f4f6' }]}>
                <Text style={styles.badgeText}>Weekly</Text>
              </View>
            </View>
            <Text style={styles.statLabel}>Interviews</Text>
            <Text style={styles.statValue}>32</Text>
          </TouchableOpacity>

          {/* Box 4 */}
          <TouchableOpacity 
            style={styles.statBox}
            onPress={() => router.push('/(hr)/recruitment/candidate-tracking')}
          >
            <View style={styles.statBoxHeader}>
              <View style={[styles.iconCircle, { backgroundColor: '#ecfdf5' }]}>
                <Ionicons name="checkmark-done-circle-outline" size={20} color="#10b981" />
              </View>
              <View style={[styles.badge, { backgroundColor: '#ecfdf5' }]}>
                <Text style={[styles.badgeText, { color: '#10b981' }]}>Target Met</Text>
              </View>
            </View>
            <Text style={styles.statLabel}>Filled Roles</Text>
            <Text style={styles.statValue}>5</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Recent Candidates */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Candidates</Text>
            <TouchableOpacity onPress={() => router.push('/(hr)/recruitment/candidate-tracking')}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {recentCandidates.map((candidate, idx) => (
              <TouchableOpacity 
                key={candidate.id} 
                style={styles.candidateCard}
                onPress={() => router.push(`/(hr)/recruitment/candidate/${candidate.id}` as any)}
              >
                <Image source={{ uri: candidate.avatarUrl }} style={styles.candidateAvatar} />
                <View style={styles.candidateInfo}>
                  <View style={styles.nameRow}>
                    <Text style={styles.candidateName}>{candidate.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(candidate.status).bg }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(candidate.status).text }]}>
                        {candidate.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.candidateRole}>{candidate.role}</Text>
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="briefcase-outline" size={14} color="#6b7280" />
                      <Text style={styles.metaText}>{candidate.experience}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="location-outline" size={14} color="#6b7280" />
                      <Text style={styles.metaText}>{candidate.time || candidate.location}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
      <HRBottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingBottom: 100 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 12, paddingHorizontal: 16, height: 50, marginBottom: 16 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 15, color: '#111827' },
  filterTabs: { flexDirection: 'row', gap: 12, marginBottom: 24, paddingBottom: 4 },
  activeTab: { backgroundColor: '#4f46e5', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  activeTabText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  inactiveTab: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  inactiveTabText: { color: '#4b5563', fontSize: 14, fontWeight: '600' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 32 },
  statBox: { width: '47%', padding: 16, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  statBoxHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  iconCircle: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#4b5563' },
  positiveText: { color: '#10b981', fontSize: 13, fontWeight: '700', marginTop: 8 },
  statLabel: { fontSize: 14, color: '#6b7280', marginBottom: 4, fontWeight: '500' },
  statValue: { fontSize: 24, fontWeight: '800', color: '#111827' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  viewAllText: { fontSize: 14, color: '#4f46e5', fontWeight: '600' },
  list: { gap: 16 },
  candidateCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#f3f4f6', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  candidateAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 16 },
  candidateInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  candidateName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  candidateRole: { fontSize: 13, color: '#6b7280', marginBottom: 8 },
  metaRow: { flexDirection: 'row', gap: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#9ca3af', fontWeight: '500' },
});
