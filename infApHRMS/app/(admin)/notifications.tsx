import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AdminBottomNav } from '../../components/AdminBottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const STATS = [
  { label: '1,284', sub: 'Notifications Sent', icon: 'send-outline', color: '#4f46e5' },
  { label: '142', sub: 'By Active Staff', icon: 'people-outline', color: '#f59e0b' },
  { label: '08', sub: 'Scheduled Tasks', icon: 'time-outline', color: '#6366f1' },
  { label: '05', sub: 'Active Alerts', icon: 'flash-outline', color: '#10b981' },
];

const BROADCASTS = [
  {
    id: '1',
    category: 'HR ANNOUNCEMENT',
    title: 'Q3 Performance Review Kick-off',
    desc: 'Attention all departments, the Q3 review cycle starts this Monday. Please ensure your KPIs ar...',
    date: 'Oct 12, 2023',
    recipients: '450 Recipients',
    status: 'ACTIVE',
    color: '#3b82f6',
  },
  {
    id: '2',
    category: 'POLICY UPDATE',
    title: 'Revised Remote Work Guidelines',
    desc: 'New updates regarding the hybrid work model and office safety protocols effective from next...',
    date: 'Oct 15, 2023',
    recipients: 'All Employees',
    status: 'SCHEDULED',
    color: '#a855f7',
  },
  {
    id: '3',
    category: 'SYSTEM ALERT',
    title: 'Planned Maintenance: payroll Module',
    desc: 'The payroll module will be unavailable for 2 hours on Saturday for critical security patches.',
    date: 'Last saved 2h ago',
    recipients: '',
    status: 'DRAFT',
    color: '#f97316',
  },
];

export default function AdminNotifications() {
  const [activeTab, setActiveTab] = useState('All Alerts');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSub}>Admin Activity Hub</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={() => alert('Filter options')}>
          <Ionicons name="options-outline" size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#94a3b8" />
          <TextInput
            placeholder="Search announcements..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
          />
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {['All Alerts', 'HR Announcements', 'Policy Updates', 'System Alerts'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((stat, idx) => (
            <View key={idx} style={styles.statCard}>
              <View style={styles.statHeader}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                <Text style={styles.statTiny}>TOTAL</Text>
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statSub}>{stat.sub}</Text>
            </View>
          ))}
        </View>

        {/* Recent Broadcasts Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Broadcasts</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {BROADCASTS.map((item, idx) => (
          <Animated.View
            key={item.id}
            entering={FadeInDown.delay(idx * 100).springify()}
            style={styles.broadcastCard}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.categoryBadge, { backgroundColor: `${item.color}15` }]}>
                <Text style={[styles.categoryText, { color: item.color }]}>{item.category}</Text>
              </View>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, { backgroundColor: item.status === 'ACTIVE' ? '#22c55e' : item.status === 'SCHEDULED' ? '#3b82f6' : '#94a3b8' }]} />
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>

            <View style={styles.cardMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
                <Text style={styles.metaText}>{item.date}</Text>
              </View>
              {item.recipients ? (
                <View style={styles.metaItem}>
                  <Ionicons name="people-outline" size={14} color="#94a3b8" />
                  <Text style={styles.metaText}>{item.recipients}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="analytics-outline" size={16} color="#64748b" />
                <Text style={styles.actionText}>Analytics</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="create-outline" size={16} color="#64748b" />
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="refresh-outline" size={16} color="#64748b" />
                <Text style={styles.actionText}>Resend</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/(admin)/create-notification')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      <AdminBottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  headerSub: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#1e293b',
  },
  tabsScroll: {
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#4f46e5',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  activeTabText: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTiny: {
    fontSize: 9,
    fontWeight: '800',
    color: '#10b981',
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 4,
  },
  statSub: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  viewAll: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '700',
  },
  broadcastCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 16,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
});
