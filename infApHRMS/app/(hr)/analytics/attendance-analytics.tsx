import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { HRBottomNav } from '@/components/HRBottomNav';
import Header from '@/components/layout/Header';

const DEPARTMENTS = [
  { name: 'Engineering', rate: 96, count: 48, change: '+1.2%' },
  { name: 'Design', rate: 93, count: 22, change: '+0.8%' },
  { name: 'Sales', rate: 91, count: 35, change: '-0.5%' },
  { name: 'Marketing', rate: 89, count: 18, change: '+2.1%' },
  { name: 'Product', rate: 94, count: 15, change: '+1.5%' },
  { name: 'HR', rate: 98, count: 8, change: '+0.3%' },
];

const WEEKLY = [
  { day: 'Mon', pct: 96 }, { day: 'Tue', pct: 94 }, { day: 'Wed', pct: 92 },
  { day: 'Thu', pct: 95 }, { day: 'Fri', pct: 88 },
];

export default function AttendanceAnalytics() {
  const [activeTab, setActiveTab] = useState<'Weekly' | 'Monthly' | 'Quarterly'>('Weekly');

  const data = useMemo(() => {
    if (activeTab === 'Weekly') {
      return {
        avgRate: '93.5%',
        late: 12,
        absence: 5,
        trend: [
          { day: 'Mon', pct: 96 }, { day: 'Tue', pct: 94 }, { day: 'Wed', pct: 92 },
          { day: 'Thu', pct: 95 }, { day: 'Fri', pct: 88 },
        ]
      };
    }
    if (activeTab === 'Monthly') {
      return {
        avgRate: '91.2%',
        late: 45,
        absence: 18,
        trend: [
          { day: 'W1', pct: 92 }, { day: 'W2', pct: 89 }, { day: 'W3', pct: 94 },
          { day: 'W4', pct: 90 },
        ]
      };
    }
    return {
      avgRate: '92.8%',
      late: 120,
      absence: 52,
      trend: [
        { day: 'Jan', pct: 93 }, { day: 'Feb', pct: 91 }, { day: 'Mar', pct: 94 },
      ]
    };
  }, [activeTab]);


  return (
    <View style={styles.container}>
      <Header 
        title="Attendance Analytics"
        showBack={true}
      />

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['Weekly', 'Monthly', 'Quarterly'] as const).map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.overviewRow}>
          <View style={[styles.overviewCard, { backgroundColor: '#4f46e5' }]}>
            <Text style={[styles.ovLabel, { color: '#e0e7ff' }]}>AVG RATE</Text>
            <Text style={[styles.ovValue, { color: '#fff' }]}>{data.avgRate}</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.ovLabel}>LATE ARRIVALS</Text>
            <Text style={[styles.ovValue, { color: '#f59e0b' }]}>{data.late}</Text>
          </View>
          <View style={styles.overviewCard}>
            <Text style={styles.ovLabel}>ABSENCES</Text>
            <Text style={[styles.ovValue, { color: '#ef4444' }]}>{data.absence}</Text>
          </View>
        </Animated.View>

        {/* Trend Graph (Bars) */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.graphSection}>
          <Text style={styles.sectionTitle}>{activeTab} Trend</Text>
          <View style={styles.barChart}>
            {data.trend.map((d, i) => (
              <View key={i} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { height: `${d.pct}%` }]} />
                </View>
                <Text style={styles.barLabel}>{d.day}</Text>
                <Text style={styles.barPct}>{d.pct}%</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Department Breakdown */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)}>
          <Text style={styles.sectionTitle}>By Department</Text>
          {DEPARTMENTS.map((dept, idx) => (
            <View key={idx} style={styles.deptCard}>
              <View style={styles.deptInfo}>
                <Text style={styles.deptName}>{dept.name}</Text>
                <Text style={styles.deptCount}>{dept.count} employees</Text>
              </View>
              <View style={styles.deptRight}>
                <Text style={styles.deptRate}>{dept.rate}%</Text>
                <Text style={[styles.deptChange, { color: dept.change.startsWith('-') ? '#ef4444' : '#10b981' }]}>{dept.change}</Text>
              </View>
              <View style={styles.deptProgressBg}>
                <View style={[styles.deptProgressFill, { width: `${dept.rate}%` }]} />
              </View>
            </View>
          ))}
        </Animated.View>
      </ScrollView>
      <HRBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfd' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tab: { marginRight: 24, paddingBottom: 8 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#4f46e5' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  tabTextActive: { color: '#4f46e5', fontWeight: '800' },
  content: { padding: 20, paddingBottom: 100 },
  overviewRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  overviewCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#f3f4f6' },
  ovLabel: { fontSize: 9, fontWeight: '800', color: '#9ca3af', letterSpacing: 0.5, marginBottom: 4 },
  ovValue: { fontSize: 20, fontWeight: '800', color: '#111827' },
  graphSection: { marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 },
  barChart: { flexDirection: 'row', justifyContent: 'space-between', height: 160, backgroundColor: '#fff', borderRadius: 20, padding: 16, paddingTop: 20, borderWidth: 1, borderColor: '#f3f4f6' },
  barCol: { flex: 1, alignItems: 'center' },
  barTrack: { flex: 1, width: 20, backgroundColor: '#eef2ff', borderRadius: 10, justifyContent: 'flex-end', overflow: 'hidden', marginBottom: 8 },
  barFill: { width: '100%', backgroundColor: '#4f46e5', borderRadius: 10 },
  barLabel: { fontSize: 11, color: '#6b7280', fontWeight: '600', marginBottom: 2 },
  barPct: { fontSize: 10, color: '#9ca3af', fontWeight: '700' },
  deptCard: { backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 12 },
  deptInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  deptName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  deptCount: { fontSize: 12, color: '#6b7280' },
  deptRight: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  deptRate: { fontSize: 16, fontWeight: '800', color: '#4f46e5' },
  deptChange: { fontSize: 12, fontWeight: '700' },
  deptProgressBg: { height: 4, backgroundColor: '#eef2ff', borderRadius: 2, overflow: 'hidden' },
  deptProgressFill: { height: '100%', backgroundColor: '#4f46e5', borderRadius: 2 },
});
