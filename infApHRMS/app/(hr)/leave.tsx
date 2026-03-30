import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useHR, LeaveRequest } from '@/context/HRContext';
import { HRBottomNav } from '@/components/HRBottomNav';
import Animated, { FadeInDown, FadeInUp, Layout, FadeIn } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const LeaveManagementScreen = () => {
  const { leaves, pendingLeaves, approveLeave, rejectLeave, approveBulkLeaves, rejectBulkLeaves } = useHR();
  const [activeTab, setActiveTab] = useState<'All Requests' | 'Pending' | 'Approved' | 'Rejected'>('All Requests');
  const [selectedLeaves, setSelectedLeaves] = useState<string[]>([]);

  const stats = useMemo(() => {
    return {
      pending: leaves.filter(l => l.status === 'Pending').length,
      approved: leaves.filter(l => l.status === 'Approved').length,
      rejected: leaves.filter(l => l.status === 'Rejected').length,
      today: leaves.filter(l => l.status === 'Approved').length,
    }
  }, [leaves]);
  const displayedLeaves = activeTab === 'All Requests' 
    ? leaves 
    : leaves.filter(l => l.status === activeTab);
  const toggleSelection = (id: string) => {
    if (selectedLeaves.includes(id)) {
      setSelectedLeaves(prev => prev.filter(lId => lId !== id));
    } else {
      setSelectedLeaves(prev => [...prev, id]);
    }
  };

  const handleBulkApprove = () => {
    if(selectedLeaves.length === 0) return;
    approveBulkLeaves(selectedLeaves);
    router.push('/(hr)/leave-success' as any);
    setSelectedLeaves([]);
  };

  const handleBulkReject = () => {
    if(selectedLeaves.length === 0) return;
    rejectBulkLeaves(selectedLeaves);
    router.push('/(hr)/leave-success' as any);
    setSelectedLeaves([]);
  };

  const navigateToDetails = (id: string) => {
    router.push(`/(hr)/employee-leave/${leaves.find(l=>l.id===id)?.employeeName}` as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9f9fb' }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <View style={styles.headerTitles}>
             <Text style={styles.title}>Leave Management</Text>
             <Text style={styles.subtitle}>INFIAP DASHBOARD</Text>
          </View>
          <View style={styles.headerRight}>
             <TouchableOpacity style={styles.iconBtn}><Ionicons name="search" size={20} color="#6b7280" /></TouchableOpacity>
             <Image source={{ uri: 'https://i.pravatar.cc/150?u=hrmanager' }} style={styles.headerAvatar} />
          </View>
        </Animated.View>

        <Text style={styles.introText}>Manage employee leave requests, approvals, and leave history.</Text>

        {/* Filters Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersWrapper} contentContainerStyle={styles.filtersContainer}>
           <TouchableOpacity style={activeTab === 'All Requests' ? styles.filterPillActive : styles.filterPill} onPress={() => setActiveTab('All Requests')}>
              <Text style={activeTab === 'All Requests' ? styles.filterTextActive : styles.filterText}>All Requests</Text>
           </TouchableOpacity>
           <TouchableOpacity style={activeTab === 'Pending' ? styles.filterPillActive : styles.filterPill} onPress={() => setActiveTab('Pending')}>
              <Text style={activeTab === 'Pending' ? styles.filterTextActive : styles.filterText}>Pending</Text>
           </TouchableOpacity>
           <TouchableOpacity style={activeTab === 'Approved' ? styles.filterPillActive : styles.filterPill} onPress={() => setActiveTab('Approved')}>
              <Text style={activeTab === 'Approved' ? styles.filterTextActive : styles.filterText}>Approved</Text>
           </TouchableOpacity>
           <TouchableOpacity style={activeTab === 'Rejected' ? styles.filterPillActive : styles.filterPill} onPress={() => setActiveTab('Rejected')}>
              <Text style={activeTab === 'Rejected' ? styles.filterTextActive : styles.filterText}>Rejected</Text>
           </TouchableOpacity>
        </ScrollView>

        {/* Grid */}
        <View style={styles.gridContainer}>
           <View style={styles.gridRow}>
              <View style={styles.gridBox}>
                 <View style={styles.gridTop}>
                   <View style={[styles.gridIconBg, { backgroundColor: '#fff7ed' }]}><Ionicons name="calendar-outline" size={16} color="#f97316" /></View>
                   <Text style={styles.gridNum}>{stats.pending}</Text>
                 </View>
                 <Text style={styles.gridLabel}>Pending</Text>
              </View>
              <View style={styles.gridBox}>
                 <View style={styles.gridTop}>
                   <View style={[styles.gridIconBg, { backgroundColor: '#ecfdf5' }]}><Ionicons name="checkmark-circle-outline" size={16} color="#10b981" /></View>
                   <Text style={styles.gridNum}>{stats.approved}</Text>
                 </View>
                 <Text style={styles.gridLabel}>Approved</Text>
              </View>
           </View>
           <View style={styles.gridRow}>
              <View style={styles.gridBox}>
                 <View style={styles.gridTop}>
                   <View style={[styles.gridIconBg, { backgroundColor: '#fef2f2' }]}><Ionicons name="close-circle-outline" size={16} color="#ef4444" /></View>
                   <Text style={styles.gridNum}>{stats.rejected}</Text>
                 </View>
                 <Text style={styles.gridLabel}>Rejected</Text>
              </View>
              <View style={styles.gridBox}>
                 <View style={styles.gridTop}>
                   <View style={[styles.gridIconBg, { backgroundColor: '#f5f3ff' }]}><Ionicons name="person-outline" size={16} color="#8b5cf6" /></View>
                   <Text style={styles.gridNum}>{stats.today}</Text>
                 </View>
                 <Text style={styles.gridLabel}>On Leave Today</Text>
              </View>
           </View>
        </View>

        <View style={styles.listHeader}>
           <Text style={styles.listSectionTitle}>RECENT LEAVE REQUESTS</Text>
           <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
        </View>

        {/* Requests List */}
        {displayedLeaves.map((leave, index) => {
          const isSelected = selectedLeaves.includes(leave.id);
          const isPending = leave.status === 'Pending';
          
          return (
            <AnimatedPressable 
              key={leave.id} 
              entering={FadeInDown.delay(100 + index * 100).duration(600)}
              style={styles.leaveCard}
              onPress={() => toggleSelection(leave.id)}
            >
              <View style={styles.leaveCardInner}>
                {isPending && (
                  <TouchableOpacity onPress={() => toggleSelection(leave.id)} style={styles.checkboxWrapper}>
                    <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                       {isSelected && <Ionicons name="checkmark" size={12} color="#fff" />}
                    </View>
                  </TouchableOpacity>
                )}
                <Image source={{ uri: leave.avatar }} style={styles.cardAvatar} />
                <View style={styles.cardInfo}>
                   <View style={styles.cardInfoTop}>
                     <Text style={styles.empNameText}>{leave.employeeName}</Text>
                     <View style={[styles.badge, { backgroundColor: leave.status === 'Approved' ? '#dcfce7' : leave.status === 'Rejected' ? '#fee2e2' : '#fef3c7' }]}>
                        <Text style={[styles.badgeText, { color: leave.status === 'Approved' ? '#16a34a' : leave.status === 'Rejected' ? '#ef4444' : '#d97706' }]}>{leave.status.toUpperCase()}</Text>
                     </View>
                   </View>
                   <Text style={styles.empRoleText}>{leave.department || 'Engineering'} • {leave.type}</Text>
                   
                   <View style={styles.dateRow}>
                     <Ionicons name="calendar-outline" size={12} color="#9ca3af" />
                     <Text style={styles.dateText}>{leave.startDate} - {leave.endDate}</Text>
                     <View style={styles.durationPill}><Text style={styles.durationText}>3 Days</Text></View>
                   </View>
                   
                   <Text style={styles.reasonText} numberOfLines={2}>&quot;{leave.reason || 'Family vacation planned long ago. Handover document shared.'}&quot;</Text>
                </View>
              </View>

              {isPending && (
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionBtnReject} onPress={(e) => { e.stopPropagation(); rejectLeave(leave.id); }}>
                    <Text style={styles.rejectText}>REJECT</Text>
                  </TouchableOpacity>
                  <View style={styles.actionRowDivider} />
                  <TouchableOpacity style={styles.actionBtnApprove} onPress={(e) => { e.stopPropagation(); approveLeave(leave.id); }}>
                    <Text style={styles.approveText}>APPROVE</Text>
                  </TouchableOpacity>
                </View>
              )}
            </AnimatedPressable>
          );
        })}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Bulk Actions Bar */}
      {selectedLeaves.length > 0 && (
        <Animated.View entering={FadeInUp.duration(400)} style={styles.bulkActionBar}>
          <View style={styles.selectionPill}>
             <Text style={styles.selectionPillText}>{selectedLeaves.length}</Text>
          </View>
          <Text style={styles.selectedCountText}>Selected</Text>
          <View style={styles.bulkActionButtons}>
            <TouchableOpacity onPress={handleBulkReject}>
               <Text style={styles.bulkRejectText}>REJECT{'\n'}ALL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bulkApproveBtn} onPress={handleBulkApprove}>
               <Text style={styles.bulkApproveText}>APPROVE{'\n'}SELECTED</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {!selectedLeaves.length && <HRBottomNav />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 50 : 30 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backButton: { marginRight: 12 },
  headerTitles: { flex: 1 },
  title: { fontSize: 18, fontWeight: '800', color: '#1f2937' },
  subtitle: { fontSize: 10, fontWeight: '700', color: '#5a55d2', letterSpacing: 0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { padding: 4 },
  headerAvatar: { width: 32, height: 32, borderRadius: 16 },
  
  introText: { fontSize: 13, color: '#6b7280', marginBottom: 20, lineHeight: 20 },
  
  filtersWrapper: { marginBottom: 20 },
  filtersContainer: { gap: 10, paddingRight: 20 },
  filterPillActive: { backgroundColor: '#5a55d2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  filterPill: { backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#e5e7eb' },
  filterTextActive: { color: '#fff', fontSize: 13, fontWeight: '600' },
  filterText: { color: '#4b5563', fontSize: 13, fontWeight: '500' },

  gridContainer: { marginBottom: 24, gap: 12 },
  gridRow: { flexDirection: 'row', gap: 12 },
  gridBox: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.02, shadowRadius: 4, elevation: 1 },
  gridTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  gridIconBg: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  gridNum: { fontSize: 24, fontWeight: '800', color: '#111827' },
  gridLabel: { fontSize: 11, color: '#6b7280', fontWeight: '500' },

  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  listSectionTitle: { fontSize: 11, fontWeight: '800', color: '#111827', letterSpacing: 0.5 },
  viewAllText: { fontSize: 12, fontWeight: '700', color: '#5a55d2' },

  leaveCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f3f4f6', overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 2 },
  leaveCardInner: { padding: 16, flexDirection: 'row', gap: 12 },
  checkboxWrapper: { paddingTop: 4 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: '#d1d5db', justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#5a55d2', borderColor: '#5a55d2' },
  cardAvatar: { width: 44, height: 44, borderRadius: 22 },
  cardInfo: { flex: 1 },
  cardInfoTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  empNameText: { fontSize: 14, fontWeight: '800', color: '#111827' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  empRoleText: { fontSize: 11, color: '#6b7280', marginTop: 2, marginBottom: 8 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  dateText: { fontSize: 11, fontWeight: '600', color: '#4b5563' },
  durationPill: { backgroundColor: '#f3f4f6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  durationText: { fontSize: 9, fontWeight: '700', color: '#4b5563' },
  reasonText: { fontSize: 11, color: '#6b7280', fontStyle: 'italic', lineHeight: 16 },

  actionRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f3f4f6', height: 44 },
  actionBtnReject: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  actionBtnApprove: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  actionRowDivider: { width: 1, backgroundColor: '#f3f4f6' },
  rejectText: { color: '#ef4444', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  approveText: { color: '#10b981', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },

  bulkActionBar: { position: 'absolute', bottom: Platform.OS === 'ios' ? 30 : 20, left: 20, right: 20, backgroundColor: '#fff', borderRadius: 16, paddingLeft: 16, paddingRight: 8, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 12, borderWidth: 1, borderColor: '#f3f4f6' },
  selectionPill: { backgroundColor: '#e0e7ff', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  selectionPillText: { color: '#5a55d2', fontSize: 14, fontWeight: '800' },
  selectedCountText: { fontSize: 14, fontWeight: '700', color: '#374151', flex: 1 },
  bulkActionButtons: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  bulkRejectText: { color: '#ef4444', fontSize: 10, fontWeight: '800', textAlign: 'center' },
  bulkApproveBtn: { backgroundColor: '#5a55d2', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  bulkApproveText: { color: '#fff', fontSize: 10, fontWeight: '800', textAlign: 'center' },
});

export default LeaveManagementScreen;
