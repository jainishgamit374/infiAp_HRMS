import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { HRBottomNav } from '@/components/HRBottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/layout/Header';

const METRICS = [
  { label: 'Total Employees', value: '156', change: '+12', color: '#4f46e5', icon: 'people' },
  { label: 'Avg Attendance', value: '94%', change: '+2.1%', color: '#10b981', icon: 'calendar' },
  { label: 'Avg Performance', value: '85%', change: '+3.4%', color: '#f59e0b', icon: 'trending-up' },
  { label: 'Attrition Rate', value: '4.2%', change: '-0.8%', color: '#ef4444', icon: 'exit' },
];

const REPORTS = [
  { title: 'Monthly HR Summary', date: 'March 2026', status: 'Ready' },
  { title: 'Department Headcount', date: 'March 2026', status: 'Ready' },
  { title: 'Compensation Analysis', date: 'Q1 2026', status: 'Processing' },
  { title: 'Training & Development', date: 'February 2026', status: 'Ready' },
];

export default function EmployeeReports() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Unified Header */}
      <Header 
        title="HR Analytics" 
        subtitle="Data-Driven Insights"
        showBack={true} 
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Metrics Grid */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.grid}>
          {METRICS.map((m, idx) => (
            <View key={idx} style={styles.metricCard}>
              <View style={[styles.metricIcon, { backgroundColor: `${m.color}15` }]}>
                <Ionicons name={m.icon as any} size={18} color={m.color} />
              </View>
              <Text style={styles.metricLabel}>{m.label}</Text>
              <Text style={styles.metricValue}>{m.value}</Text>
              <Text style={[styles.metricChange, { color: m.change.startsWith('-') ? '#ef4444' : '#10b981' }]}>{m.change}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Quick Links */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.quickRow}>
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(hr)/analytics/attendance-analytics')}>
            <Ionicons name="bar-chart" size={18} color="#4f46e5" /><Text style={styles.quickText}>Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn} onPress={() => router.push('/(hr)/analytics/performance-insights')}>
            <Ionicons name="pulse" size={18} color="#4f46e5" /><Text style={styles.quickText}>Performance</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Reports List */}
        <Text style={styles.sectionTitle}>Available Reports</Text>
        {REPORTS.map((r, idx) => (
          <Animated.View key={idx} entering={FadeInUp.delay(200 + idx * 80).duration(400)} style={styles.reportCard}>
            <View style={styles.reportIcon}><Ionicons name="document-text" size={20} color="#4f46e5" /></View>
            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>{r.title}</Text>
              <Text style={styles.reportDate}>{r.date}</Text>
            </View>
            <View style={[styles.badge, r.status === 'Ready' ? { backgroundColor: '#ecfdf5' } : { backgroundColor: '#fffbeb' }]}>
              <Text style={[styles.badgeText, r.status === 'Ready' ? { color: '#10b981' } : { color: '#f59e0b' }]}>{r.status}</Text>
            </View>
          </Animated.View>
        ))}
      </ScrollView>
      <HRBottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfd' },
  content: { padding: 20, paddingBottom: 100 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 },
  metricCard: { width: '48%', backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f3f4f6' },
  metricIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  metricLabel: { fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.5, marginBottom: 4 },
  metricValue: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 4 },
  metricChange: { fontSize: 12, fontWeight: '700' },
  quickRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  quickBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#eef2ff', height: 48, borderRadius: 12 },
  quickText: { fontSize: 14, fontWeight: '600', color: '#4f46e5' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 16 },
  reportCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 12 },
  reportIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  reportInfo: { flex: 1 },
  reportTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  reportDate: { fontSize: 12, color: '#6b7280' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
});
