import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn, Layout, ZoomIn } from 'react-native-reanimated';
import { AdminBottomNav } from '../../components/AdminBottomNav';

const { width } = Dimensions.get('window');

const ALL_TEAMS = [
  { id: 't1', name: 'Mobile App Team', dept: 'Engineering', deptId: '1', lead: 'Sarah Jenkins', members: 8, icon: 'phone-portrait-outline', color: '#4f46e5' },
  { id: 't2', name: 'Backend Services', dept: 'Engineering', deptId: '1', lead: 'Michael Chen', members: 12, icon: 'server-outline', color: '#0ea5e9' },
  { id: 't3', name: 'QA & Testing', dept: 'Engineering', deptId: '1', lead: 'Emily Davis', members: 6, icon: 'shield-checkmark-outline', color: '#10b981' },
  { id: 't4', name: 'UX Research', dept: 'Creative Dept', deptId: '2', lead: 'David Wilson', members: 4, icon: 'search-outline', color: '#f59e0b' },
  { id: 't5', name: 'Product Design', dept: 'Creative Dept', deptId: '2', lead: 'Anna White', members: 5, icon: 'color-palette-outline', color: '#ec4899' },
  { id: 't6', name: 'Billing Systems', dept: 'Finance Admin', deptId: '3', lead: 'John Brown', members: 3, icon: 'card-outline', color: '#ef4444' },
];

export default function ManageTeams() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const departments = ['All', ...new Set(ALL_TEAMS.map((t) => t.dept))];
  
  const filteredTeams = ALL_TEAMS.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         team.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.lead.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || team.dept === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage All Teams</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="filter-outline" size={22} color="#64748b" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Stats Summary */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{ALL_TEAMS.length}</Text>
            <Text style={styles.statLabel}>Total Teams</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{ALL_TEAMS.reduce((s,t) => s+t.members, 0)}</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{departments.length - 1}</Text>
            <Text style={styles.statLabel}>Depts</Text>
          </View>
        </Animated.View>

        {/* Search */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#94a3b8" />
          <TextInput
            placeholder="Search teams, leads or departments..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Animated.View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
          {departments.map((dept) => (
            <TouchableOpacity
              key={dept}
              style={[styles.filterTab, activeFilter === dept && styles.filterTabActive]}
              onPress={() => setActiveFilter(dept)}
            >
              <Text style={[styles.filterText, activeFilter === dept && styles.filterTextActive]}>{dept}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Teams List */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>All Teams</Text>
          <Text style={styles.listCount}>{filteredTeams.length} Found</Text>
        </View>

        {filteredTeams.map((team, index) => (
          <Animated.View
            key={team.id}
            entering={FadeInDown.delay(300 + index * 50).springify()}
            layout={Layout.springify()}
            style={styles.teamCard}
          >
            <View style={styles.teamMain}>
              <View style={[styles.teamIconBox, { backgroundColor: team.color + '15' }]}>
                <Ionicons name={team.icon as any} size={24} color={team.color} />
              </View>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{team.name}</Text>
                <View style={styles.deptRow}>
                  <Ionicons name="business-outline" size={12} color="#94a3b8" />
                  <Text style={styles.deptName}>{team.dept}</Text>
                </View>
              </View>
              <View style={styles.memberBox}>
                <Text style={styles.memberVal}>{team.members}</Text>
                <Text style={styles.memberLab}>Staff</Text>
              </View>
            </View>
            <View style={styles.teamFooter}>
              <View style={styles.leadInfo}>
                <View style={styles.leadAvatar}>
                  <Text style={styles.leadAvatarText}>{team.lead[0]}</Text>
                </View>
                <Text style={styles.leadName}>{team.lead}</Text>
              </View>
              <TouchableOpacity 
                style={styles.manageBtn}
                onPress={() => router.push({
                  pathname: '/(admin)/department-details/[id]',
                  params: { id: team.deptId, name: team.dept }
                } as any)}
              >
                <Text style={styles.manageBtnText}>Manage</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}

        {filteredTeams.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color="#e2e8f0" />
            <Text style={styles.emptyText}>No teams found</Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
      <AdminBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  headerIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  
  scrollContent: { padding: 20 },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  statValue: { fontSize: 20, fontWeight: '900', color: '#4f46e5' },
  statLabel: { fontSize: 10, fontWeight: '700', color: '#94a3b8', marginTop: 4, textTransform: 'uppercase' },

  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', gap: 10, marginBottom: 16 },
  searchInput: { flex: 1, fontSize: 14, color: '#1e293b' },

  filterScroll: { marginBottom: 24, marginHorizontal: -20 },
  filterContainer: { paddingHorizontal: 20, gap: 10 },
  filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: '#f1f5f9' },
  filterTabActive: { backgroundColor: '#4f46e5' },
  filterText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  filterTextActive: { color: '#fff' },

  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  listTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  listCount: { fontSize: 12, fontWeight: '700', color: '#94a3b8' },

  teamCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  teamMain: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  teamIconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  teamInfo: { flex: 1 },
  teamName: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  deptRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  deptName: { fontSize: 12, fontWeight: '600', color: '#94a3b8' },
  memberBox: { alignItems: 'flex-end' },
  memberVal: { fontSize: 18, fontWeight: '900', color: '#1e293b' },
  memberLab: { fontSize: 10, fontWeight: '700', color: '#94a3b8' },

  teamFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#f8fafc' },
  leadInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  leadAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0e7ff' },
  leadAvatarText: { fontSize: 12, fontWeight: '800', color: '#4f46e5' },
  leadName: { fontSize: 14, fontWeight: '700', color: '#475569' },
  manageBtn: { backgroundColor: '#f1f5f9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  manageBtnText: { fontSize: 13, fontWeight: '700', color: '#4f46e5' },

  emptyContainer: { alignItems: 'center', marginTop: 40, opacity: 0.5 },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#94a3b8', marginTop: 10 },
});
