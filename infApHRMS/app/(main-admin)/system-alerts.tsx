import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MainAdminBottomNav } from '../../components/MainAdminBottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/layout/Header';

const { width } = Dimensions.get('window');

const STATS = [
  { label: '24', sub: 'TOTAL', color: '#1e293b' },
  { label: '3', sub: 'CRITICAL', color: '#ef4444' },
  { label: '8', sub: 'WARNING', color: '#f59e0b' },
  { label: '13', sub: 'RESOLVED', color: '#22c55e' },
];

const ALERTS = [
  {
    id: '1',
    type: 'CRITICAL',
    title: 'Database Connection Timeout',
    desc: 'Main RDS instance (us-east-1a) is failing to respond to health checks.',
    time: '2m ago',
    actions: ['View Logs', 'Restart Service'],
    color: '#ef4444',
  },
  {
    id: '2',
    type: 'WARNING',
    title: 'High CPU Usage - Server US-East-1',
    desc: 'Node cluster "infi-API-04" sustained 92% CPU for over 10 minutes.',
    time: '15m ago',
    actions: ['View Details', 'Dismiss'],
    color: '#f59e0b',
  },
  {
    id: '3',
    type: 'INFORMATION',
    title: 'Scheduled Backup Completed',
    desc: 'Full system state backup (Snapshot ID: #44921) successfully stored in S3.',
    time: '1h ago',
    actions: ['View Report'],
    color: '#4f46e5',
  },
  {
    id: '4',
    type: 'RESOLVED',
    title: 'Memory Leak Detected (Worker 09)',
    desc: 'Automatically resolved by container restart policy.',
    time: '3h ago',
    actions: [],
    color: '#22c55e',
  },
];

export default function SystemAlerts() {
  const [activeTab, setActiveTab] = React.useState('All');

  const filteredAlerts = ALERTS.filter(alert => {
    if (activeTab === 'All') return true;
    return alert.type.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header 
        title="InfiAP Platform"
        subtitle="MAIN ADMIN"
        rightElement={
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={24} color="#1e293b" />
            <View style={styles.dot} />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>System Alerts</Text>
          <Text style={styles.subTitle}>Real-time platform health monitoring</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#94a3b8" />
          <TextInput
            placeholder="Search specific alerts or nodes..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
          />
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((stat, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.statCard}
              onPress={() => setActiveTab(stat.sub === 'TOTAL' ? 'All' : stat.sub.charAt(0) + stat.sub.slice(1).toLowerCase())}
            >
              <Text style={styles.statTiny}>{stat.sub}</Text>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tabs Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          {['All', 'Critical', 'Warning', 'Info', 'Resolved'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.7}
              >
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Alert List */}
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert, idx) => (
            <Animated.View
              key={alert.id}
              entering={FadeInDown.delay(idx * 100).springify()}
              style={[styles.alertCard, { borderLeftColor: alert.color }]}
            >
              <View style={styles.alertHeader}>
                <View style={styles.typeRow}>
                  <Ionicons name="flash" size={12} color={alert.color} />
                  <Text style={[styles.typeText, { color: alert.color }]}>{alert.type}</Text>
                </View>
                <Text style={styles.timeText}>{alert.time}</Text>
              </View>

              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertDesc}>{alert.desc}</Text>

              <View style={styles.actionRow}>
                {alert.actions.map((action, actionIdx) => (
                  <TouchableOpacity 
                    key={actionIdx} 
                    style={[styles.actionBtn, actionIdx === 0 && styles.primaryAction]}
                  >
                    <Ionicons name={action.includes('Logs') ? 'albums-outline' : action.includes('Restart') ? 'refresh-outline' : 'open-outline'} size={14} color={actionIdx === 0 ? '#fff' : '#1e293b'} />
                    <Text style={[styles.actionText, actionIdx === 0 && styles.primaryActionText]}>{action}</Text>
                  </TouchableOpacity>
                ))}
                {alert.type === 'CRITICAL' && (
                  <TouchableOpacity style={styles.acknowledgeBtn}>
                    <Text style={styles.acknowledgeText}>Acknowledge</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          ))
        ) : (
          <View style={styles.noData}>
            <Ionicons name="notifications-off-outline" size={48} color="#cbd5e1" />
            <Text style={styles.noDataText}>No alerts found for this category.</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <MainAdminBottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notifBtn: {
    padding: 4,
  },
  dot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#1e293b',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statTiny: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  tabsScroll: {
    marginBottom: 24,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  activeTab: {
    backgroundColor: '#1e293b',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  activeTabText: {
    color: '#fff',
  },
  alertCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  alertDesc: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  primaryAction: {
    backgroundColor: '#1e293b',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  primaryActionText: {
    color: '#fff',
  },
  acknowledgeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  acknowledgeText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  noData: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noDataText: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 12,
    fontWeight: '500',
  },
});
