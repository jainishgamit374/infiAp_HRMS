import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Image, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRecruitment, CandidateStatus } from './_layout';
import { HRBottomNav } from '@/components/HRBottomNav';
import Header from '@/components/layout/Header';

export default function CandidateTracking() {
  const { candidates, updateStatus } = useRecruitment();
  const [activeTab, setActiveTab] = useState<'All' | CandidateStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedExp, setSelectedExp] = useState('All Experience');
  const [showFilter, setShowFilter] = useState<'Dept' | 'Exp' | null>(null);

  const DEPARTMENTS = ['All Departments', 'Engineering', 'Design', 'Product', 'Sales', 'Analytics', 'Growth Team'];
  const EXPERIENCE_RANGES = ['All Experience', '0-2 Years', '3-5 Years', '6-8 Years', '8+ Years'];


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
    return candidates.filter(c => {
      const matchTab = activeTab === 'All' || c.status === activeTab;
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = selectedDept === 'All Departments' || c.department.includes(selectedDept.replace(' Team', ''));
      
      // Basic experience range mapping
      let matchExp = selectedExp === 'All Experience';
      if (!matchExp) {
        const years = parseInt(c.experience) || 0;
        if (selectedExp === '0-2 Years') matchExp = years <= 2;
        else if (selectedExp === '3-5 Years') matchExp = years >= 3 && years <= 5;
        else if (selectedExp === '6-8 Years') matchExp = years >= 6 && years <= 8;
        else if (selectedExp === '8+ Years') matchExp = years > 8;
      }

      return matchTab && matchSearch && matchDept && matchExp;
    });
  }, [candidates, activeTab, searchQuery, selectedDept, selectedExp]);

  return (
    <View style={styles.container}>
      <Header 
        title="Candidate Tracking"
        showBack={true}
      />
      <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16 }}>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/(hr)/recruitment/add-candidate')}>
          <Ionicons name="person-add" size={16} color="#fff" />
          <Text style={styles.addBtnText}>Add Candidate</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Search */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput 
            placeholder="Search by name, role, or skills..." 
            style={styles.searchInput} 
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Dropdown Filters */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.dropdownFilters}>
          <TouchableOpacity 
            style={[styles.filterBtn, selectedDept !== 'All Departments' && styles.filterBtnActive]}
            onPress={() => setShowFilter(showFilter === 'Dept' ? null : 'Dept')}
          >
            <Text style={[styles.filterBtnText, selectedDept !== 'All Departments' && styles.filterBtnTextActive]}>
              {selectedDept === 'All Departments' ? 'Department' : selectedDept}
            </Text>
            <Ionicons name={showFilter === 'Dept' ? "chevron-up" : "chevron-down"} size={14} color={selectedDept !== 'All Departments' ? '#4f46e5' : "#4b5563"} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.filterBtn, selectedExp !== 'All Experience' && styles.filterBtnActive]}
            onPress={() => setShowFilter(showFilter === 'Exp' ? null : 'Exp')}
          >
            <Text style={[styles.filterBtnText, selectedExp !== 'All Experience' && styles.filterBtnTextActive]}>
              {selectedExp === 'All Experience' ? 'Experience' : selectedExp}
            </Text>
            <Ionicons name={showFilter === 'Exp' ? "chevron-up" : "chevron-down"} size={14} color={selectedExp !== 'All Experience' ? '#4f46e5' : "#4b5563"} />
          </TouchableOpacity>
        </Animated.View>

        {/* Filter Selection Mini-Menus */}
        {showFilter === 'Dept' && (
          <Animated.View entering={FadeInDown.duration(200)} style={styles.filterMenu}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 50 }}>
              {DEPARTMENTS.map(dept => (
                <TouchableOpacity 
                  key={dept} 
                  style={[styles.menuItem, selectedDept === dept && styles.menuItemActive]}
                  onPress={() => { setSelectedDept(dept); setShowFilter(null); }}
                >
                  <Text style={[styles.menuItemText, selectedDept === dept && styles.menuItemTextActive]}>{dept}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {showFilter === 'Exp' && (
          <Animated.View entering={FadeInDown.duration(200)} style={styles.filterMenu}>
            <View style={styles.menuGrid}>
              {EXPERIENCE_RANGES.map(exp => (
                <TouchableOpacity 
                  key={exp} 
                  style={[styles.menuItem, selectedExp === exp && styles.menuItemActive]}
                  onPress={() => { setSelectedExp(exp); setShowFilter(null); }}
                >
                  <Text style={[styles.menuItemText, selectedExp === exp && styles.menuItemTextActive]}>{exp}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}


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
      </KeyboardAvoidingView>
      <HRBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  filterBtnActive: { borderColor: '#4f46e5', backgroundColor: '#f5f3ff' },
  filterBtnTextActive: { color: '#4f46e5', fontWeight: '700' },
  filterMenu: { marginBottom: 20, padding: 12, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  menuItem: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#f8fafc', borderStyle: 'solid', borderWidth: 1, borderColor: '#e2e8f0', marginRight: 4 },
  menuItemActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  menuItemText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  menuItemTextActive: { color: '#fff' },
});
