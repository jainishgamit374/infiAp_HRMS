import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useHR, LeaveRequest } from '@/context/HRContext';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function LeaveHistoryScreen() {
  const { leaves } = useHR();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Approved' | 'Rejected'>('All');

  const processedLeaves = useMemo(() => leaves.filter(l => l.status !== 'Pending'), [leaves]);

  const filteredLeaves = useMemo(() => {
    return processedLeaves.filter(leave => {
      const matchesSearch = leave.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'All' || leave.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [processedLeaves, searchQuery, filterStatus]);

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Leave History</Text>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Search & Filters */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search employees..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150)} style={styles.filterRow}>
          {['All', 'Approved', 'Rejected'].map(status => (
            <TouchableOpacity 
              key={status}
              style={[styles.filterChip, filterStatus === status && styles.filterChipActive]}
              onPress={() => setFilterStatus(status as any)}
            >
              <Text style={[styles.filterText, filterStatus === status && styles.filterTextActive]}>{status}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Reports Section */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.reportsCard}>
           <View style={styles.reportsHeader}>
             <Ionicons name="document-text-outline" size={20} color="#5a55d2" />
             <Text style={styles.reportsTitle}>Generate Report</Text>
           </View>
           <View style={styles.reportsActions}>
              <TouchableOpacity style={styles.reportBtn}>
                <Ionicons name="download-outline" size={16} color="#374151" />
                <Text style={styles.reportBtnText}>Export PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reportBtn}>
                <Ionicons name="grid-outline" size={16} color="#374151" />
                <Text style={styles.reportBtnText}>Export Excel</Text>
              </TouchableOpacity>
           </View>
        </Animated.View>

        <Text style={styles.sectionTitle}>Past Records ({filteredLeaves.length})</Text>

        {filteredLeaves.map((leave, index) => (
          <Animated.View 
            key={leave.id} 
            entering={FadeInDown.delay(300 + index * 100).duration(600)}
            style={styles.historyCard}
          >
            <View style={styles.cardInfo}>
               <Image source={{ uri: leave.avatar }} style={styles.avatar} />
               <View>
                 <Text style={styles.employeeName}>{leave.employeeName}</Text>
                 <Text style={styles.leaveType}>{leave.type} • {leave.startDate} to {leave.endDate}</Text>
               </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: leave.status === 'Approved' ? '#dcfce7' : '#fee2e2' }]}>
               <Text style={[styles.statusText, { color: leave.status === 'Approved' ? '#16a34a' : '#ef4444' }]}>{leave.status.toUpperCase()}</Text>
            </View>
          </Animated.View>
        ))}

        {filteredLeaves.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No historical records found for this filter.</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfd' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  backButton: { padding: 4, marginRight: 12 },
  title: { fontSize: 20, fontWeight: '800', color: '#1f2937' },
  content: { padding: 20 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16, height: 52, marginBottom: 16, borderWidth: 1, borderColor: '#f3f4f6' },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#111827' },
  filterRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f3f4f6' },
  filterChipActive: { backgroundColor: '#5a55d2' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  filterTextActive: { color: '#fff' },
  reportsCard: { backgroundColor: '#f8f9ff', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#e0e7ff', marginBottom: 32 },
  reportsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  reportsTitle: { fontSize: 16, fontWeight: '800', color: '#1f2937' },
  reportsActions: { flexDirection: 'row', gap: 12 },
  reportBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  reportBtnText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1f2937', marginBottom: 16 },
  historyCard: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6' },
  cardInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 14 },
  employeeName: { fontSize: 15, fontWeight: '800', color: '#111827' },
  leaveType: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '800' },
  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#6b7280', fontSize: 14 },
});
