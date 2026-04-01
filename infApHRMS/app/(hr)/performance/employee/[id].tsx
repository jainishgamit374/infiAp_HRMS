import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { usePerformance } from '../_layout';
import Header from '@/components/layout/Header';

export default function PerformanceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { employees, feedbacks } = usePerformance();

  const employee = useMemo(() => employees.find(e => e.id === id), [employees, id]);
  const empFeedbacks = useMemo(() => feedbacks.filter(f => f.employeeId === id), [feedbacks, id]);

  if (!employee) return <View style={styles.container} />;

  const getStatusBg = (status: string) => {
    if (status === 'Top Performer') return { bg: '#eef2ff', text: '#4f46e5' };
    if (status === 'On Target') return { bg: '#ecfdf5', text: '#10b981' };
    if (status === 'Watch') return { bg: '#fffbeb', text: '#f59e0b' };
    return { bg: '#fef2f2', text: '#ef4444' };
  };

  const statusColors = getStatusBg(employee.status);

  return (
    <View style={styles.container}>
      <Header 
        title="Performance Detail"
        showBack={true}
        rightElement={
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="ellipsis-vertical" size={24} color="#111827" />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: employee.avatarUrl }} style={styles.avatar} />
            <View style={styles.activeDot} />
          </View>
          <Text style={styles.empName}>{employee.name}</Text>
          <Text style={styles.empRole}>{employee.role}</Text>
          <Text style={styles.empMeta}>{employee.department} • {employee.location}</Text>
        </Animated.View>

        {/* Performance Score Box */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.scoreBox}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreTitle}>Performance Score</Text>
            <View style={[styles.statusPill, { backgroundColor: statusColors.bg }]}>
              <Text style={[styles.statusPillText, { color: statusColors.text }]}>
                {employee.status}
              </Text>
            </View>
          </View>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreValue}>{employee.score}%</Text>
            <Text style={employee.scoreChange >= 0 ? styles.scoreChangePos : styles.scoreChangeNeg}>
              {employee.scoreChange >= 0 ? '+' : ''}{employee.scoreChange}%
            </Text>
          </View>
          
          <View style={styles.mainProgressBg}>
            <View style={[styles.mainProgressFill, { width: `${employee.score}%`, backgroundColor: statusColors.text }]} />
          </View>
          
          <View style={styles.scoreFooter}>
            <Text style={styles.targetLabel}>Target: 85%</Text>
            <Text style={styles.targetLabel}>Industry Avg: 72%</Text>
          </View>
        </Animated.View>

        {/* KPI Row */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.kpiRow}>
          <View style={styles.kpiBox}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#4f46e5" style={styles.kpiIcon} />
            <Text style={styles.kpiLabel}>TASKS</Text>
            <Text style={styles.kpiValue}>{employee.kpi.tasks}%</Text>
          </View>
          <View style={styles.kpiBox}>
            <Ionicons name="calendar-outline" size={20} color="#4f46e5" style={styles.kpiIcon} />
            <Text style={styles.kpiLabel}>ATTENDANCE</Text>
            <Text style={styles.kpiValue}>{employee.kpi.attendance}%</Text>
          </View>
          <View style={styles.kpiBox}>
            <Ionicons name="people-outline" size={20} color="#4f46e5" style={styles.kpiIcon} />
            <Text style={styles.kpiLabel}>COLLAB</Text>
            <Text style={styles.kpiValue}>{employee.kpi.collab}%</Text>
          </View>
        </Animated.View>

        {/* Monthly Progress (Graph Placeholder) */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Progress</Text>
          <View style={styles.graphBox}>
             {/* Creating a visual placeholder of a graph area since expo doesn't have native charts without heavy libraries */}
             <View style={styles.graphLines}>
               <View style={styles.graphLineH} />
               <View style={styles.graphLineH} />
               <View style={styles.graphLineH} />
               <View style={styles.graphLineH} />
             </View>
             
             {/* Fake path overlay mimicking the curve */}
             <View style={styles.graphOverlay}>
                {employee.monthlyProgress.map((p, i) => (
                   <View key={i} style={{ alignItems: 'center' }}>
                     <View style={[styles.graphPoint, { bottom: (p - 60) * 3 }]} />
                   </View>
                ))}
             </View>

             <View style={styles.graphXAxis}>
               <Text style={styles.xLabel}>Jan</Text>
               <Text style={styles.xLabel}>Feb</Text>
               <Text style={styles.xLabel}>Mar</Text>
               <Text style={styles.xLabel}>Apr</Text>
               <Text style={[styles.xLabel, { color: '#4f46e5', fontWeight: '800' }]}>May</Text>
             </View>
          </View>
        </Animated.View>

        {/* Monthly Goals */}
        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Goals</Text>
          {employee.goals.map((goal, idx) => (
             <View key={idx} style={styles.goalItem}>
               <View style={styles.goalHeader}>
                 <Text style={styles.goalTitle}>{goal.title}</Text>
                 <Text style={styles.goalPercent}>{goal.progress}%</Text>
               </View>
               <View style={styles.goalProgressBg}>
                 <View style={[styles.goalProgressFill, { width: `${goal.progress}%` }]} />
               </View>
               <View style={styles.goalFooter}>
                 <Text style={styles.goalTargetTxt}>Target: {goal.progress >= 100 ? 'Completed' : 'Jul 15'}</Text>
                 <View style={styles.goalStatusRow}>
                   <Ionicons 
                     name={goal.status === 'On Track' ? 'checkmark-circle' : 'time'} 
                     size={12} 
                     color={goal.status === 'On Track' ? '#10b981' : '#f59e0b'} 
                   />
                   <Text style={[styles.goalStatusTxt, { color: goal.status === 'On Track' ? '#10b981' : '#f59e0b' }]}>
                     {goal.status}
                   </Text>
                 </View>
               </View>
             </View>
          ))}
        </Animated.View>

        {/* Feedback History */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Feedback History</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllBtn}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.feedbackList}>
            {empFeedbacks.map((fb) => (
              <View key={fb.id} style={styles.fbItem}>
                <View style={styles.fbHeader}>
                  <Image source={{ uri: fb.reviewerAvatar }} style={styles.fbAvatar} />
                  <View style={styles.fbInfo}>
                    <Text style={styles.fbName}>{fb.reviewerName}</Text>
                    <Text style={styles.fbRoleText}>{fb.reviewerRole} • {fb.timeAgo}</Text>
                  </View>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons 
                        key={star} 
                        name={fb.rating >= star ? 'star' : 'star-outline'} 
                        size={12} 
                        color={fb.rating >= star ? '#f59e0b' : '#d1d5db'} 
                      />
                    ))}
                  </View>
                </View>
                <Text style={styles.fbComment}>"{fb.comment}"</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Improvement Notes */}
        <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Improvement Notes</Text>
          <View style={styles.notesBox}>
            {employee.improvementNotes.map((note, idx) => (
              <View key={idx} style={styles.noteRow}>
                <Ionicons name="flash-outline" size={16} color="#4f46e5" style={styles.noteIcon} />
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(hr)/performance')}>
          <Ionicons name="home-outline" size={20} color="#9ca3af" />
          <Text style={styles.navText}>HOME</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(hr)/performance/feedbacks')}>
          <Ionicons name="chatbubbles-outline" size={20} color="#9ca3af" />
          <Text style={styles.navText}>REVIEWS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(hr)/performance/reports')}>
          <Ionicons name="document-text-outline" size={20} color="#9ca3af" />
          <Text style={styles.navText}>REPORT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={20} color="#9ca3af" />
          <Text style={styles.navText}>CONFIG</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  iconBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  content: { padding: 20, paddingBottom: 120 },
  profileSection: { alignItems: 'center', marginBottom: 24 },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  activeDot: { position: 'absolute', bottom: 4, right: 4, width: 16, height: 16, borderRadius: 8, backgroundColor: '#10b981', borderWidth: 2, borderColor: '#fff' },
  empName: { fontSize: 22, fontWeight: '800', color: '#111827', marginBottom: 4 },
  empRole: { fontSize: 13, fontWeight: '600', color: '#4f46e5', marginBottom: 4 },
  empMeta: { fontSize: 12, color: '#6b7280', fontWeight: '500' },
  scoreBox: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  scoreHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  scoreTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusPillText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  scoreRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 16 },
  scoreValue: { fontSize: 36, fontWeight: '800', color: '#111827' },
  scoreChangePos: { fontSize: 15, fontWeight: '700', color: '#10b981' },
  scoreChangeNeg: { fontSize: 15, fontWeight: '700', color: '#ef4444' },
  mainProgressBg: { height: 8, backgroundColor: '#f3f4f6', borderRadius: 4, marginBottom: 16, overflow: 'hidden' },
  mainProgressFill: { height: '100%', borderRadius: 4 },
  scoreFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  targetLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '600' },
  kpiRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  kpiBox: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  kpiIcon: { marginBottom: 8 },
  kpiLabel: { fontSize: 10, fontWeight: '800', color: '#9ca3af', letterSpacing: 0.5, marginBottom: 4 },
  kpiValue: { fontSize: 18, fontWeight: '800', color: '#111827' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 16 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  viewAllBtn: { fontSize: 13, fontWeight: '700', color: '#4f46e5' },
  graphBox: { backgroundColor: '#fff', borderRadius: 20, padding: 20, paddingBottom: 16, height: 180, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  graphLines: { flex: 1, justifyContent: 'space-between', paddingBottom: 24 },
  graphLineH: { height: 1, backgroundColor: '#f3f4f6' },
  graphOverlay: { position: 'absolute', top: 20, bottom: 44, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 12 },
  graphPoint: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4f46e5', borderWidth: 2, borderColor: '#fff' },
  graphXAxis: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  xLabel: { fontSize: 11, color: '#9ca3af', fontWeight: '600' },
  goalItem: { marginBottom: 16 },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  goalTitle: { fontSize: 14, fontWeight: '600', color: '#111827' },
  goalPercent: { fontSize: 14, fontWeight: '700', color: '#4f46e5' },
  goalProgressBg: { height: 6, backgroundColor: '#eef2ff', borderRadius: 3, marginBottom: 8 },
  goalProgressFill: { height: '100%', backgroundColor: '#4f46e5', borderRadius: 3 },
  goalFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalTargetTxt: { fontSize: 11, color: '#9ca3af', fontWeight: '500' },
  goalStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  goalStatusTxt: { fontSize: 11, fontWeight: '600' },
  feedbackList: { gap: 16 },
  fbItem: { backgroundColor: '#fff', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  fbHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  fbAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  fbInfo: { flex: 1 },
  fbName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  fbRoleText: { fontSize: 11, color: '#9ca3af', fontWeight: '500' },
  starsRow: { flexDirection: 'row', gap: 2 },
  fbComment: { fontSize: 13, color: '#4b5563', lineHeight: 20, fontStyle: 'italic' },
  notesBox: { backgroundColor: '#f5f3ff', borderRadius: 20, padding: 20 },
  noteRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  noteIcon: { marginTop: 2, marginRight: 12 },
  noteText: { flex: 1, fontSize: 13, color: '#4b5563', lineHeight: 20, fontWeight: '500' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  navItem: { alignItems: 'center', justifyContent: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.5 },
});
