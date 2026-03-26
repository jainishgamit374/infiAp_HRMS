import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { HRBottomNav } from '@/components/HRBottomNav';

const INSIGHTS = [
  { title: 'Top performer this quarter', value: 'Alex Johnson', score: '90%', avatar: 'https://i.pravatar.cc/150?u=AlexJohnson' },
  { title: 'Most improved', value: 'Emily Rodriguez', score: '+8%', avatar: 'https://i.pravatar.cc/150?u=EmilyRodriguez' },
  { title: 'Needs attention', value: 'Michael Chen', score: '76%', avatar: 'https://i.pravatar.cc/150?u=MichaelChen' },
];

const DEPT_PERFORMANCE = [
  { dept: 'Engineering', avg: 88, employees: 48 },
  { dept: 'Design', avg: 85, employees: 22 },
  { dept: 'Sales', avg: 91, employees: 35 },
  { dept: 'Marketing', avg: 82, employees: 18 },
  { dept: 'Product', avg: 84, employees: 15 },
];

const TRENDS = [
  { month: 'Oct', avg: 82 }, { month: 'Nov', avg: 84 }, { month: 'Dec', avg: 83 },
  { month: 'Jan', avg: 85 }, { month: 'Feb', avg: 87 }, { month: 'Mar', avg: 86 },
];

export default function PerformanceInsights() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#111827" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Performance Insights</Text>
        <TouchableOpacity><Ionicons name="options-outline" size={22} color="#111827" /></TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {['Overview', 'History', 'Department'].map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Key Insights */}
        {activeTab === 'Overview' && (
          <Animated.View entering={FadeInDown.duration(400)}>
            <Text style={styles.sectionTitle}>Key Insights</Text>
            {INSIGHTS.map((ins, idx) => (
              <View key={idx} style={styles.insightCard}>
                <Image source={{ uri: ins.avatar }} style={styles.insAvatar} />
                <View style={styles.insInfo}>
                  <Text style={styles.insTitle}>{ins.title}</Text>
                  <Text style={styles.insName}>{ins.value}</Text>
                </View>
                <View style={[styles.scoreBadge, idx === 2 ? { backgroundColor: '#fef2f2' } : { backgroundColor: '#ecfdf5' }]}>
                  <Text style={[styles.scoreText, idx === 2 ? { color: '#ef4444' } : { color: '#10b981' }]}>{ins.score}</Text>
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Trend Chart */}
        {activeTab === 'History' && (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.trendSection}>
            <Text style={styles.sectionTitle}>Performance Trend</Text>
            <View style={styles.trendChart}>
              {TRENDS.map((t, i) => (
                <View key={i} style={styles.trendCol}>
                  <View style={styles.trendBar}>
                    <View style={[styles.trendFill, { height: `${t.avg}%` }]} />
                  </View>
                  <Text style={styles.trendLabel}>{t.month}</Text>
                  <Text style={styles.trendPct}>{t.avg}%</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Department Performance */}
        {(activeTab === 'Department' || activeTab === 'Overview') && (
          <Animated.View entering={FadeInUp.delay(activeTab === 'Overview' ? 200 : 0).duration(400)}>
            <Text style={styles.sectionTitle}>Department Performance</Text>
            {DEPT_PERFORMANCE.map((d, idx) => (
              <View key={idx} style={styles.deptRow}>
                <View style={styles.deptInfo}>
                  <Text style={styles.deptName}>{d.dept}</Text>
                  <Text style={styles.deptEmp}>{d.employees} employees</Text>
                </View>
                <Text style={styles.deptAvg}>{d.avg}%</Text>
                <View style={styles.deptBarBg}>
                  <View style={[styles.deptBarFill, { width: `${d.avg}%` }]} />
                </View>
              </View>
            ))}
          </Animated.View>
        )}
      </ScrollView>
      <HRBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfd' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 16, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  tabs: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tab: { marginRight: 24, paddingBottom: 8 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#4f46e5' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  tabTextActive: { color: '#4f46e5', fontWeight: '800' },
  content: { padding: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 },
  insightCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 12 },
  insAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  insInfo: { flex: 1 },
  insTitle: { fontSize: 11, color: '#9ca3af', fontWeight: '600', marginBottom: 2 },
  insName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  scoreBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  scoreText: { fontSize: 14, fontWeight: '800' },
  trendSection: { marginBottom: 32, marginTop: 16 },
  trendChart: { flexDirection: 'row', justifyContent: 'space-between', height: 160, backgroundColor: '#fff', borderRadius: 20, padding: 16, paddingTop: 20, borderWidth: 1, borderColor: '#f3f4f6' },
  trendCol: { flex: 1, alignItems: 'center' },
  trendBar: { flex: 1, width: 16, backgroundColor: '#eef2ff', borderRadius: 8, justifyContent: 'flex-end', overflow: 'hidden', marginBottom: 8 },
  trendFill: { width: '100%', backgroundColor: '#4f46e5', borderRadius: 8 },
  trendLabel: { fontSize: 10, color: '#6b7280', fontWeight: '600', marginBottom: 2 },
  trendPct: { fontSize: 9, color: '#9ca3af', fontWeight: '700' },
  deptRow: { backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 12 },
  deptInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  deptName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  deptEmp: { fontSize: 12, color: '#6b7280' },
  deptAvg: { fontSize: 18, fontWeight: '800', color: '#4f46e5', marginBottom: 8 },
  deptBarBg: { height: 4, backgroundColor: '#eef2ff', borderRadius: 2, overflow: 'hidden' },
  deptBarFill: { height: '100%', backgroundColor: '#4f46e5', borderRadius: 2 },
});
