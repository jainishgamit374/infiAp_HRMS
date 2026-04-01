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

        {/* Feedback List */}
        <View style={styles.list}>
          {feedbacks.map((fb, idx) => {
             const employee = employees.find(e => e.id === fb.employeeId);
             
             return (
               <Animated.View 
                 key={fb.id} 
                 entering={FadeInUp.delay(200 + idx * 100).duration(400)}
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
                     { backgroundColor: '#fef3c7' }
                   ]}>
                     <Text style={[
                       styles.statusText, 
                       fb.status === 'Excellent' ? { color: '#10b981' } :
                       fb.status === 'Good' ? { color: '#4f46e5' } : 
                       { color: '#d97706' }
                     ]}>
                       {fb.status}
                     </Text>
                   </View>
                 </View>

                 {fb.status !== 'Pending' && (
                   <Text style={styles.reviewerText}>Reviewer: {fb.reviewerName} ({fb.reviewerRole})</Text>
                 )}
                 {fb.status === 'Pending' && (
                   <Text style={styles.draftText}>Draft saved {fb.timeAgo}</Text>
                 )}

                 <Text style={styles.fbComment}>
                   {fb.comment}
                 </Text>

                 <View style={styles.fbFooter}>
                   {fb.status !== 'Pending' ? (
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
                   ) : (
                     <Text style={styles.draftHintText}>Draft: Showing promising growth...</Text>
                   )}

                   <View style={styles.fbActions}>
                     <TouchableOpacity style={styles.actionBtnText}>
                       <Text style={styles.actionTxtStyle}>View</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.actionBtnSolid}>
                       <Text style={styles.actionBtnSolidTxt}>{fb.status === 'Pending' ? 'Cont.' : 'Edit'}</Text>
                     </TouchableOpacity>
                   </View>
                 </View>
               </Animated.View>
             );
          })}
        </View>
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
  topTabs: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 20, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
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
  navText: { fontSize: 10, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.5 }
});
