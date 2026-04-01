import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  TextInput,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, FadeIn, ZoomIn, SlideInDown, Layout } from 'react-native-reanimated';
import { AdminBottomNav } from '../../../components/AdminBottomNav';
import Header from '../../../components/layout/Header';

const { width } = Dimensions.get('window');

// --- MOCK TEAMS DATA ---
const MOCK_TEAMS: Record<string, any[]> = {
  '1': [
    { id: 't1', name: 'Mobile App Team', lead: 'Sarah Jenkins', members: 8, icon: 'phone-portrait-outline', color: '#4f46e5' },
    { id: 't2', name: 'Backend Services', lead: 'Michael Chen', members: 12, icon: 'server-outline', color: '#0ea5e9' },
    { id: 't3', name: 'QA & Testing', lead: 'Emily Davis', members: 6, icon: 'shield-checkmark-outline', color: '#10b981' },
  ],
  '2': [
    { id: 't4', name: 'UX Research', lead: 'David Wilson', members: 4, icon: 'search-outline', color: '#f59e0b' },
    { id: 't5', name: 'Product Design', lead: 'Anna White', members: 5, icon: 'color-palette-outline', color: '#ec4899' },
  ],
};

export default function DepartmentDetails() {
  const { id, name } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [teamName, setTeamName] = useState('');
  const [teamLead, setTeamLead] = useState('');

  const teams = MOCK_TEAMS[id as string] || [
    { id: 'tx', name: 'General Operations', lead: 'TBD', members: 0, icon: 'apps-outline', color: '#64748b' }
  ];

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.lead.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header 
        title={name as string || 'Department'}
        subtitle="Team Management"
        showBack={true}
        rightElement={
          <TouchableOpacity style={styles.headerIcon} onPress={() => setShowSearch(!showSearch)}>
            <Ionicons name="search-outline" size={22} color="#64748b" />
          </TouchableOpacity>
        }
      />

      {/* Search Bar */}
      {showSearch && (
        <Animated.View entering={FadeInDown.duration(300)} style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#94a3b8" />
          <TextInput
            placeholder="Search teams or leads..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </Animated.View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Dept Summary */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>{(name as string)?.[0] || 'D'}</Text>
            </View>
            <View>
              <Text style={styles.summaryName}>{name}</Text>
              <Text style={styles.summaryId}>ID: #DEPT-{id}</Text>
            </View>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={styles.statLabel}>TEAMS</Text>
              <Text style={styles.statValue}>{teams.length}</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={styles.statLabel}>TOTAL STAFF</Text>
              <Text style={styles.statValue}>{teams.reduce((s, t) => s + t.members, 0)}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Department Teams</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{filteredTeams.length}</Text>
          </View>
        </View>

        {/* Teams List */}
        {filteredTeams.map((team, index) => (
          <Animated.View 
            key={team.id}
            entering={FadeInDown.delay(200 + index * 80).springify()}
            layout={Layout.springify()}
            style={styles.teamCard}
          >
            <View style={styles.teamCardMain}>
              <View style={[styles.teamIconBox, { backgroundColor: team.color + '15' }]}>
                <Ionicons name={team.icon} size={24} color={team.color} />
              </View>
              <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{team.name}</Text>
                <Text style={styles.teamLead}>Lead: {team.lead}</Text>
              </View>
              <View style={styles.memberCountBox}>
                <Ionicons name="people" size={14} color="#64748b" />
                <Text style={styles.memberCountText}>{team.members}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.viewMembersBtn}>
              <Text style={styles.viewMembersText}>View Members</Text>
              <Ionicons name="arrow-forward" size={14} color="#4f46e5" />
            </TouchableOpacity>
          </Animated.View>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Add Button */}
      <Animated.View entering={ZoomIn.delay(600).springify()} style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.fabText}>Add Team</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Add Team Modal */}
      <Modal visible={showAddModal} transparent animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowAddModal(false)} />
          <Animated.View entering={SlideInDown.springify()} style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add New Team</Text>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>TEAM NAME</Text>
              <TextInput style={styles.formInput} placeholder="e.g. Design System" placeholderTextColor="#94a3b8" value={teamName} onChangeText={setTeamName} />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>TEAM LEAD</Text>
              <TextInput style={styles.formInput} placeholder="Assign a lead" placeholderTextColor="#94a3b8" value={teamLead} onChangeText={setTeamLead} />
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={() => setShowAddModal(false)}>
              <Text style={styles.submitBtnText}>Create Team</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

      <AdminBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', gap: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#1e293b' },

  scrollContent: { padding: 20 },
  
  summaryCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#f1f5f9', elevation: 2 },
  summaryTop: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 24, fontWeight: '800', color: '#fff' },
  summaryName: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  summaryId: { fontSize: 12, color: '#64748b', fontWeight: '600', marginTop: 2 },
  summaryDivider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 16 },
  summaryStats: { flexDirection: 'row', justifyContent: 'space-around' },
  summaryStat: { alignItems: 'center' },
  statLabel: { fontSize: 10, fontWeight: '700', color: '#94a3b8', letterSpacing: 0.5 },
  statValue: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginTop: 4 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  badge: { backgroundColor: '#4f46e5', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },

  teamCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  teamCardMain: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  teamIconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  teamInfo: { flex: 1 },
  teamName: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  teamLead: { fontSize: 13, color: '#64748b', marginTop: 2 },
  memberCountBox: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f8fafc', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  memberCountText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  viewMembersBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f8fafc' },
  viewMembersText: { fontSize: 13, fontWeight: '700', color: '#4f46e5' },

  fabContainer: { position: 'absolute', bottom: 100, right: 20 },
  fab: { backgroundColor: '#4f46e5', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 30, gap: 8, elevation: 5 },
  fabText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginBottom: 24 },
  formGroup: { marginBottom: 20 },
  formLabel: { fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 8, letterSpacing: 0.5 },
  formInput: { backgroundColor: '#f1f5f9', borderRadius: 12, padding: 16, fontSize: 16, color: '#1e293b' },
  submitBtn: { backgroundColor: '#4f46e5', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
