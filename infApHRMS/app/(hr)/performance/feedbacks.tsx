import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { usePerformance, ReviewFeedback, PerformanceEmployee } from './_layout';
import Header from '@/components/layout/Header';

export default function FeedbacksList() {
  const { feedbacks, employees } = usePerformance();
  const [activeTab, setActiveTab] = useState('Feedbacks');

  const avgRating = useMemo(() => {
    const valid = feedbacks.filter(f => f.rating > 0);
    if (!valid.length) return 0;
    const sum = valid.reduce((acc, f) => acc + f.rating, 0);
    return (sum / valid.length).toFixed(1);
  }, [feedbacks]);

  const { reports } = usePerformance();

  const renderFeedbacks = () => (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.list}>
        {feedbacks.map((fb, idx) => {
            const employee = employees.find(e => e.id === fb.employeeId);
            return (
                <Animated.View 
                    key={fb.id} 
                    entering={FadeInUp.delay(idx * 100).duration(400)}
                    style={styles.fbCard}
                >
                    <View style={styles.fbHeader}>
                        {employee ? (
                            <Image source={{ uri: employee.avatarUrl }} style={styles.empAvatar} />
                        ) : (
                            <View style={[styles.empAvatar, { backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }]}>
                                <Text style={{ fontSize: 16, fontWeight: '700', color: '#9ca3af' }}>?</Text>
                            </View>
                        )}
                        <View style={styles.empInfo}>
                            <Text style={styles.empName}>{employee ? employee.name : 'Unknown'}</Text>
                            <Text style={styles.empRole}>{employee ? employee.role : ''}</Text>
                        </View>
                        <View style={[
                            styles.statusBadge, 
                            fb.status === 'Excellent' ? { backgroundColor: '#ecfdf5' } :
                            fb.status === 'Good' ? { backgroundColor: '#eef2ff' } : 
                            { backgroundColor: '#fffbeb' }
                        ]}>
                            <Text style={[
                                styles.statusText, 
                                fb.status === 'Excellent' ? { color: '#10b981' } :
                                fb.status === 'Good' ? { color: '#4f46e5' } : 
                                { color: '#f59e0b' }
                            ]}>
                                {fb.status}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.reviewerText}>Reviewer: {fb.reviewerName} ({fb.reviewerRole})</Text>
                    <Text style={styles.fbComment}>{fb.comment}</Text>
                    <View style={styles.fbFooter}>
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <Ionicons 
                                    key={star} 
                                    name={fb.rating >= star ? 'star' : 'star-outline'} 
                                    size={16} 
                                    color={fb.rating >= star ? '#f59e0b' : '#d1d5db'} 
                                />
                            ))}
                        </View>
                    </View>
                </Animated.View>
            );
        })}
    </Animated.View>
  );

  const renderAnalytics = () => (
    <Animated.View entering={FadeInDown.duration(400)}>
      <View style={styles.analyticsHeader}>
        <Text style={styles.analyticsTitle}>Performance Insight</Text>
        <Text style={styles.analyticsSub}>AI-powered growth analysis for Q1 2024</Text>
      </View>
      
      <View style={styles.analyticsGrid}>
        <View style={styles.statCardFull}>
           <Text style={styles.statCardLabel}>Overall Organization Health</Text>
           <Text style={styles.statCardValue}>84.5%</Text>
           <View style={styles.progressBarLarge}>
             <View style={[styles.progressFillLarge, { width: '84.5%' }]} />
           </View>
        </View>
        
        <View style={styles.analyticsCardsRow}>
          <View style={styles.miniStatCard}>
             <Ionicons name="trending-up" size={18} color="#10b981" />
             <Text style={styles.miniStatValue}>+12.4%</Text>
             <Text style={styles.miniStatLabel}>MoM Growth</Text>
          </View>
          <View style={styles.miniStatCard}>
             <Ionicons name="people" size={18} color="#4f46e5" />
             <Text style={styles.miniStatValue}>94%</Text>
             <Text style={styles.miniStatLabel}>Team Collab</Text>
          </View>
        </View>
      </View>

      <View style={styles.insightBox}>
        <Ionicons name="bulb" size={24} color="#f59e0b" />
        <Text style={styles.insightText}>Engineering team has shown a 15% increase in velocity since the last review cycle.</Text>
      </View>
    </Animated.View>
  );

  const renderTeams = () => {
    const departments = ['Engineering', 'Design', 'Product', 'Sales'];
    return (
      <Animated.View entering={FadeInDown.duration(400)}>
        {departments.map((dept, idx) => {
            const deptEmps = employees.filter(e => e.department === dept);
            const deptAvg = deptEmps.length > 0 
                ? (deptEmps.reduce((s, e) => s + e.score, 0) / deptEmps.length).toFixed(1) 
                : 0;
            
            return (
                <TouchableOpacity key={dept} style={styles.deptCard}>
                    <View style={styles.deptHeader}>
                        <View style={styles.deptInfo}>
                            <Text style={styles.deptName}>{dept} Team</Text>
                            <Text style={styles.deptCount}>{deptEmps.length} Employees</Text>
                        </View>
                        <View style={styles.deptScoreBox}>
                            <Text style={styles.deptScoreValue}>{deptAvg}%</Text>
                        </View>
                    </View>
                    <View style={styles.deptProgress}>
                        <View style={[styles.deptProgressBar, { width: `${deptAvg}%` as any }]} />
                    </View>
                </TouchableOpacity>
            );
        })}
      </Animated.View>
    );
  };

  const renderHistory = () => (
    <Animated.View entering={FadeInDown.duration(400)}>
      {reports.map((report, idx) => (
        <TouchableOpacity key={report.id} style={styles.historyItem}>
          <View style={styles.historyIcon}>
            <Ionicons name="document-text" size={24} color="#6366f1" />
          </View>
          <View style={styles.historyInfo}>
            <Text style={styles.historyTitle}>{report.name}</Text>
            <Text style={styles.historyMeta}>{report.date} • {report.size}</Text>
          </View>
          <TouchableOpacity style={styles.downloadBtn}>
            <Ionicons name="download-outline" size={20} color="#4f46e5" />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="InfiAP Feedbacks"
        subtitle="PERFORMANCE REVIEWS"
        showBack={true}
      />

      {/* Top Tabs */}
      <View style={styles.topTabs}>
        {['Feedbacks', 'Analytics', 'Teams', 'History'].map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'Feedbacks' && (
          <>
            {/* KPI Cards */}
            <Animated.View entering={FadeInDown.duration(400)} style={styles.cardsRow}>
              <View style={styles.statCard}>
                 <Text style={styles.statLabel}>AVG RATING</Text>
                 <View style={styles.statRow}>
                   <Text style={styles.statValue}>{avgRating}</Text>
                   <Text style={styles.statChangePos}>+2%</Text>
                 </View>
                 <View style={styles.starsRow}>
                   {[1, 2, 3, 4, 5].map(star => (
                     <Ionicons 
                       key={star} 
                       name={Number(avgRating) >= star ? 'star' : Number(avgRating) >= star - 0.5 ? 'star-half' : 'star-outline'} 
                       size={14} 
                       color="#f59e0b" 
                     />
                   ))}
                 </View>
              </View>

              <View style={styles.statCard}>
                 <Text style={styles.statLabel}>COMPLETED</Text>
                 <View style={styles.statRow}>
                   <Text style={styles.statValue}>{feedbacks.length}</Text>
                   <Text style={styles.statLabelSub}>Reviews</Text>
                 </View>
                 <View style={styles.statLine} />
              </View>
            </Animated.View>

            {/* Recent Reviews Header */}
            <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.listHeaderRow}>
              <Text style={styles.listTitle}>Recent Reviews</Text>
              <TouchableOpacity>
                <Text style={styles.filterText}>Filter</Text>
              </TouchableOpacity>
            </Animated.View>

            {renderFeedbacks()}
          </>
        )}

        {activeTab === 'Analytics' && renderAnalytics()}
        {activeTab === 'Teams' && renderTeams()}
        {activeTab === 'History' && renderHistory()}
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View entering={ZoomIn.delay(500).duration(400)} style={styles.fabContainer}>
         <TouchableOpacity 
           style={styles.fab} 
           onPress={() => router.push('/(hr)/performance/add-feedback')}
           activeOpacity={0.8}
         >
            <View style={styles.fabIconBox}>
              <Ionicons name="pencil" size={14} color="#fff" />
              <Text style={styles.fabText}>Eval.</Text>
            </View>
            <View style={styles.fabCircle}>
              <Ionicons name="add" size={24} color="#fff" />
            </View>
         </TouchableOpacity>
      </Animated.View>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(hr)/performance')}>
          <Ionicons name="home-outline" size={20} color="#9ca3af" />
          <Text style={styles.navText}>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(hr)/performance/feedbacks')}>
          <Ionicons name="chatbubbles" size={20} color="#4f46e5" />
          <Text style={[styles.navText, { color: '#4f46e5' }]}>REVIEWS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(hr)/performance/reports')}>
          <Ionicons name="document-text-outline" size={20} color="#9ca3af" />
          <Text style={styles.navText}>REPORT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfd' },
  topTabs: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tabBtn: { marginRight: 24, paddingBottom: 8 },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: '#4f46e5' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  tabTextActive: { color: '#4f46e5', fontWeight: '800' },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },
  cardsRow: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 1 },
  statLabel: { fontSize: 10, fontWeight: '800', color: '#9ca3af', letterSpacing: 0.5, marginBottom: 8 },
  statRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: '800', color: '#111827' },
  statChangePos: { fontSize: 13, fontWeight: '700', color: '#10b981' },
  statLabelSub: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  starsRow: { flexDirection: 'row', gap: 2 },
  statLine: { height: 4, backgroundColor: '#eef2ff', borderRadius: 2, marginTop: 4 },
  listHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  listTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  filterText: { fontSize: 13, fontWeight: '700', color: '#4f46e5' },
  list: { gap: 16 },
  fbCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  fbHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  empAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  empInfo: { flex: 1 },
  empName: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 2 },
  empRole: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  reviewerText: { fontSize: 12, fontWeight: '700', color: '#374151', marginBottom: 8 },
  draftText: { fontSize: 12, fontWeight: '600', color: '#9ca3af', marginBottom: 8 },
  fbComment: { fontSize: 14, color: '#4b5563', lineHeight: 22, marginBottom: 4 },
  draftHintText: { fontSize: 13, color: '#9ca3af', fontStyle: 'italic', flex: 1 },
  fbFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  fbActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  actionBtnText: { padding: 8 },
  actionTxtStyle: { fontSize: 13, fontWeight: '700', color: '#4f46e5' },
  actionBtnSolid: { backgroundColor: '#4f46e5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  actionBtnSolidTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },
  fabContainer: { position: 'absolute', bottom: 100, right: 20, zIndex: 10 },
  fab: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eef2ff', paddingLeft: 12, paddingRight: 4, paddingVertical: 4, borderRadius: 30, borderWidth: 1, borderColor: '#e0e7ff', shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  fabIconBox: { flexDirection: 'row', alignItems: 'center', gap: 4, marginRight: 8 },
  fabText: { fontSize: 14, fontWeight: '800', color: '#4f46e5' },
  fabCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  navItem: { alignItems: 'center', justifyContent: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.5 },

  // New Tab Content Styles
  analyticsHeader: { marginBottom: 24, alignItems: 'center' },
  analyticsTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  analyticsSub: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  analyticsGrid: { gap: 16, marginBottom: 24 },
  statCardFull: { backgroundColor: '#fff', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#f1f5f9' },
  statCardLabel: { fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 12 },
  statCardValue: { fontSize: 32, fontWeight: '900', color: '#4f46e5', marginBottom: 12 },
  progressBarLarge: { height: 10, backgroundColor: '#f1f5f9', borderRadius: 5, overflow: 'hidden' },
  progressFillLarge: { height: '100%', backgroundColor: '#4f46e5', borderRadius: 5 },
  analyticsCardsRow: { flexDirection: 'row', gap: 12 },
  miniStatCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#f1f5f9', alignItems: 'center', gap: 4 },
  miniStatValue: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  miniStatLabel: { fontSize: 11, fontWeight: '600', color: '#94a3b8' },
  insightBox: { flexDirection: 'row', gap: 12, backgroundColor: '#fffbeb', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#fef3c7', alignItems: 'center' },
  insightText: { flex: 1, fontSize: 13, color: '#92400e', fontWeight: '600', lineHeight: 20 },

  deptCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 12 },
  deptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  deptInfo: { flex: 1 },
  deptName: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  deptCount: { fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  deptScoreBox: { backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  deptScoreValue: { fontSize: 14, fontWeight: '800', color: '#16a34a' },
  deptProgress: { height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' },
  deptProgressBar: { height: '100%', backgroundColor: '#10b981', borderRadius: 3 },

  historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  historyIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  historyInfo: { flex: 1 },
  historyTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
  historyMeta: { fontSize: 12, color: '#94a3b8', fontWeight: '500' },
  downloadBtn: { padding: 8 },
});
