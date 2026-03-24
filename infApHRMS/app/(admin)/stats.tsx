import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AdminBottomNav } from '../../components/AdminBottomNav';

const { width } = Dimensions.get('window');

const STAT_CARDS = [
  { label: 'Revenue', value: '$240k', trend: '+12%', color: '#4f46e5', icon: 'cash-outline' },
  { label: 'Expenses', value: '$85k', trend: '-5%', color: '#ef4444', icon: 'cart-outline' },
  { label: 'Efficiency', value: '94%', trend: '+2%', color: '#10b981', icon: 'flash-outline' },
  { label: 'Turnover', value: '4.2%', trend: '-1%', color: '#f59e0b', icon: 'trending-down-outline' },
];

export default function Analytics() {
  const [activeFilter, setActiveFilter] = useState('This Month');
  const FILTERS = ['This Week', 'This Month', 'This Year'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics & Reports</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="download-outline" size={22} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity 
              key={f} 
              style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsGrid}>
          {STAT_CARDS.map((stat, idx) => (
            <Animated.View key={idx} entering={FadeInDown.delay(idx * 100).springify()} style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: stat.color + '15' }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={[styles.trend, { color: stat.trend.startsWith('+') ? '#10b981' : '#ef4444' }]}>{stat.trend} {activeFilter.toLowerCase()}</Text>
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={FadeInDown.delay(400)} style={styles.chartPlaceholder}>
          <Ionicons name="bar-chart-outline" size={48} color="#e2e8f0" />
          <Text style={styles.placeholderText}>Detailed Performance Charts Rendered Here</Text>
        </Animated.View>
      </ScrollView>
      <AdminBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', paddingTop: Platform.OS === 'ios' ? 50 : 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  headerIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 120 },
  filterRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f5f9' },
  filterTabActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  filterText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  filterTextActive: { color: '#fff' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: (width - 52) / 2, backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#f1f5f9' },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statLabel: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginVertical: 4 },
  trend: { fontSize: 10, fontWeight: '700' },
  chartPlaceholder: { marginTop: 24, backgroundColor: '#fff', borderRadius: 24, height: 250, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9', borderStyle: 'dotted' },
  placeholderText: { marginTop: 12, fontSize: 14, color: '#94a3b8', fontWeight: '600' },
});
