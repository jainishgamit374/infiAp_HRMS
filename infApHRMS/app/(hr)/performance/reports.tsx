import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { usePerformance } from './_layout';
import Header from '@/components/layout/Header';

export default function PerformanceReports() {
  const { employees, reports, generateReport } = usePerformance();
  const [activeTab, setActiveTab] = useState('Monthly');

  const avgScore = useMemo(() => {
    if (!employees.length) return 0;
    return Math.round(employees.reduce((s, e) => s + e.score, 0) / employees.length);
  }, [employees]);

  const handleGenerate = () => {
    generateReport();
    Alert.alert('✅ Report Generated', 'Your report is now ready in the list below.');
  };

  const renderMonthly = () => (
    <Animated.View entering={FadeInDown.duration(400)}>
      <View style={styles.chartSection}>
        <Text style={styles.chartTitle}>Monthly Evaluation Trend</Text>
        <View style={styles.chartContainer}>
          {[65, 78, 82, 75, 88].map((h, i) => (
            <View key={i} style={styles.chartBarCol}>
              <View style={[styles.chartBar, { height: h * 1.2 }]} />
              <Text style={styles.chartLabel}>M{i+1}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.highlightCard}>
        <Ionicons name="sparkles" size={20} color="#f59e0b" />
        <Text style={styles.highlightText}>Avg. score increased by 12% compared to last month due to project completions.</Text>
      </View>
    </Animated.View>
  );

  const renderDepartment = () => (
    <Animated.View entering={FadeInDown.duration(400)}>
      {['Engineering', 'Design', 'Product', 'Sales'].map((dept, i) => (
        <View key={dept} style={styles.deptRow}>
          <View style={styles.deptMeta}>
            <Text style={styles.deptName}>{dept}</Text>
            <Text style={styles.deptScore}>{(80 + i * 4)}%</Text>
          </View>
          <View style={styles.deptProgressLine}>
            <View style={[styles.deptProgressFill, { width: `${(80+i*4)}%`, backgroundColor: i % 2 === 0 ? '#4f46e5' : '#10b981' }]} />
          </View>
        </View>
      ))}
    </Animated.View>
  );

  const renderPerformers = () => (
    <Animated.View entering={FadeInDown.duration(400)}>
      {employees.filter(e => e.score >= 88).map((emp, i) => (
        <View key={emp.id} style={styles.performerCard}>
          <View style={styles.performerRank}>
            <Text style={styles.rankText}>#{i+1}</Text>
          </View>
          <Image source={{ uri: emp.avatarUrl }} style={styles.performerAvatar} />
          <View style={styles.performerInfo}>
            <Text style={styles.performerName}>{emp.name}</Text>
            <Text style={styles.performerDept}>{emp.department}</Text>
          </View>
          <View style={styles.performerScore}>
            <Text style={styles.performerScoreVal}>{emp.score}%</Text>
          </View>
        </View>
      ))}
    </Animated.View>
  );

  const renderHistoryList = () => (
    <Animated.View entering={FadeInUp.duration(400)} style={styles.recentSection}>
      <Text style={styles.sectionTitle}>Generated History</Text>
      {reports.map((report, idx) => (
        <View key={report.id} style={styles.reportCard}>
          <View style={styles.reportIcon}>
            <Ionicons name="document-text" size={20} color="#4f46e5" />
          </View>
          <View style={styles.reportInfo}>
            <Text style={styles.reportName}>{report.name}</Text>
            <Text style={styles.reportDate}>{report.date}</Text>
          </View>
          <View style={styles.reportActions}>
            <TouchableOpacity style={styles.reportActionBtn}>
              <Ionicons name="eye-outline" size={16} color="#4f46e5" />
              <Text style={styles.reportActionText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Performance Reports"
        subtitle="GROWTH ANALYTICS"
        showBack={true}
      />

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {['Monthly', 'Department', 'Performers', 'History'].map(tab => (
          <TouchableOpacity key={tab} style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Global Summary Stats */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>AVG SCORE</Text>
            <View style={styles.statValRow}>
              <Text style={styles.statValue}>{avgScore}</Text>
              <Text style={styles.statSuffix}>/100</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>REPORTS DONE</Text>
            <View style={styles.statValRow}>
              <Text style={styles.statValue}>{reports.length}</Text>
              <Text style={styles.statSuffix}>total</Text>
            </View>
          </View>
        </Animated.View>

        {activeTab === 'Monthly' && renderMonthly()}
        {activeTab === 'Department' && renderDepartment()}
        {activeTab === 'Performers' && renderPerformers()}
        {activeTab === 'History' && renderHistoryList()}

        {/* Global Actions */}
        <View style={{ marginTop: 20 }}>
            {/* Generate Report Button */}
            <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
                <Ionicons name="document-text" size={18} color="#fff" />
                <Text style={styles.generateBtnText}>Generate New Report</Text>
            </TouchableOpacity>
            </Animated.View>

            {/* Export Actions */}
            <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.exportRow}>
            <TouchableOpacity style={styles.exportBtn} onPress={() => Alert.alert('Export Started', 'The PDF download has started.')}>
                <Ionicons name="document-outline" size={18} color="#4f46e5" />
                <Text style={styles.exportBtnText}>PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportBtn} onPress={() => Alert.alert('Export Started', 'The Excel spreadsheet is being generated.')}>
                <Ionicons name="grid-outline" size={18} color="#10b981" />
                <Text style={styles.exportBtnText}>Excel</Text>
            </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <TouchableOpacity style={styles.shareBtn} onPress={() => Alert.alert('Success', 'Hub secure link has been copied.')}>
                <Ionicons name="share-social-outline" size={18} color="#4f46e5" />
                <Text style={styles.shareBtnText}>Share Hub Link</Text>
            </TouchableOpacity>
            </Animated.View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(hr)/performance')}><Ionicons name="home-outline" size={20} color="#9ca3af" /><Text style={styles.navText}>HOME</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(hr)/performance/feedbacks')}><Ionicons name="chatbubbles-outline" size={20} color="#9ca3af" /><Text style={styles.navText}>REVIEWS</Text></TouchableOpacity>
        <TouchableOpacity style={styles.navItem}><Ionicons name="document-text" size={20} color="#4f46e5" /><Text style={[styles.navText, { color: '#4f46e5' }]}>REPORT</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfd' },
  tabsRow: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tabBtn: { marginRight: 20, paddingBottom: 8, paddingHorizontal: 4 },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: '#4f46e5' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  tabTextActive: { color: '#4f46e5', fontWeight: '800' },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#f3f4f6' },
  statLabel: { fontSize: 10, fontWeight: '800', color: '#9ca3af', letterSpacing: 0.5, marginBottom: 8 },
  statValRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  statValue: { fontSize: 28, fontWeight: '800', color: '#111827' },
  statSuffix: { fontSize: 14, fontWeight: '600', color: '#9ca3af' },
  generateBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#4f46e5', height: 52, borderRadius: 14, marginBottom: 16 },
  generateBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  exportRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  exportBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb' },
  exportBtnText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#eef2ff', height: 48, borderRadius: 12, marginBottom: 32 },
  shareBtnText: { fontSize: 14, fontWeight: '600', color: '#4f46e5' },
  recentSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 },
  reportCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 12 },
  reportIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  reportInfo: { flex: 1 },
  reportName: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  reportDate: { fontSize: 12, color: '#6b7280' },
  reportActions: { gap: 8 },
  reportActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  reportActionText: { fontSize: 12, fontWeight: '600', color: '#4f46e5' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  navItem: { alignItems: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.5 },

  // Tabs Contents Styles
  chartSection: { backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#f1f5f9', marginBottom: 16 },
  chartTitle: { fontSize: 14, fontWeight: '800', color: '#1e293b', marginBottom: 20 },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, paddingBottom: 10 },
  chartBarCol: { alignItems: 'center', gap: 8 },
  chartBar: { width: 14, backgroundColor: '#4f46e5', borderRadius: 4 },
  chartLabel: { fontSize: 10, fontWeight: '700', color: '#94a3b8' },
  highlightCard: { flexDirection: 'row', gap: 12, backgroundColor: '#fffbeb', padding: 16, borderRadius: 16, marginBottom: 24 },
  highlightText: { flex: 1, fontSize: 12, fontWeight: '600', color: '#92400e', lineHeight: 18 },

  deptRow: { marginBottom: 20 },
  deptMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  deptName: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  deptScore: { fontSize: 14, fontWeight: '800', color: '#4f46e5' },
  deptProgressLine: { height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' },
  deptProgressFill: { height: '100%', borderRadius: 3 },

  performerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 12, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 12 },
  performerRank: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rankText: { fontSize: 12, fontWeight: '800', color: '#16a34a' },
  performerAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  performerInfo: { flex: 1 },
  performerName: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  performerDept: { fontSize: 12, color: '#6b7280' },
  performerScore: { backgroundColor: '#eef2ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  performerScoreVal: { fontSize: 14, fontWeight: '800', color: '#4f46e5' },
});
