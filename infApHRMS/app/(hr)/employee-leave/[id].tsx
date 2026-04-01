import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Header from '@/components/layout/Header';

export default function EmployeeLeaveProfile() {
  const { id } = useLocalSearchParams();
  const userName = typeof id === 'string' ? id : 'Sneha Desai';

  // Mock Calendar Data for visual consistency with screenshot
  const daysInMonth = 30;
  // 11 and 12 logic handled inline

  return (
    <View style={styles.container}>
      <Header 
        title="Leave Profile"
        showBack={true}
      />

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Profile Card */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: `https://i.pravatar.cc/150?u=${userName.replace(/\s+/g,'')}` }} style={styles.avatar} />
            <View style={styles.onlineDot} />
          </View>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.role}>Senior Software Engineer</Text>
        </Animated.View>

        {/* Stats Row */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.statsRow}>
          <View style={styles.statBox}>
             <View style={styles.statBoxHeader}>
                <Ionicons name="document-text-outline" size={14} color="#5a55d2" />
                <Text style={styles.statLabel}>TAKEN</Text>
             </View>
             <View style={styles.statValueRow}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statDaysText}>Days</Text>
             </View>
             <Text style={styles.statSubGreen}>~2% from last year</Text>
          </View>
          <View style={[styles.statBox, { marginLeft: 12 }]}>
             <View style={styles.statBoxHeader}>
                <Ionicons name="calendar-outline" size={14} color="#5a55d2" />
                <Text style={styles.statLabel}>REMAINING</Text>
             </View>
             <View style={styles.statValueRow}>
                <Text style={styles.statValue}>18</Text>
                <Text style={styles.statDaysText}>Days</Text>
             </View>
             <Text style={styles.statSubRed}>~5% vs team avg</Text>
          </View>
        </Animated.View>

        {/* Calendar Section */}
        <Animated.View entering={FadeInDown.delay(300)}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Monthly Leave Calendar</Text>
            <Text style={styles.calendarMonth}>June 2024</Text>
          </View>
          
          <View style={styles.calendarContainer}>
             <View style={styles.weekDaysRow}>
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <Text key={i} style={styles.weekDayText}>{d}</Text>
                ))}
             </View>
             <View style={styles.daysGrid}>
                {/* Pad first days as 28, 29, 30... */}
                {['28','29','30','31'].map((d, i) => (
                    <View key={`pad-${i}`} style={styles.dayCellWrapper}>
                      <View style={styles.dayCell}>
                        <Text style={styles.dayTextMuted}>{d}</Text>
                      </View>
                    </View>
                ))}
                {/* Active days */}
                {Array.from({length: daysInMonth}).map((_, i) => {
                  const day = i + 1;
                  const isLeave = day === 11 || day === 12; // Matching the screenshot exactly
                  return (
                    <View key={i} style={styles.dayCellWrapper}>
                      <View style={[styles.dayCell, isLeave && styles.dayCellLeave]}>
                        <Text style={[styles.dayText, isLeave && styles.dayTextLeave]}>{day}</Text>
                      </View>
                    </View>
                  )
                })}
                {/* Pad remaining */}
                <View style={styles.dayCellWrapper}>
                   <View style={styles.dayCell}>
                     <Text style={styles.dayTextMuted}>1</Text>
                   </View>
                </View>
             </View>
          </View>
        </Animated.View>

        {/* Activity Section */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <Text style={styles.sectionTitle}>Recent Leave Activity</Text>
          
          {/* Activity item 1 */}
          <View style={styles.activityCard}>
             <View style={[styles.activityIconBg, { backgroundColor: '#f5f3ff' }]}>
               <Ionicons name="umbrella-outline" size={20} color="#8b5cf6" />
             </View>
             <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Casual Leave</Text>
                <Text style={styles.activitySub}>11 Jun - 12 Jun • 2 Days</Text>
             </View>
             <View style={[styles.activityBadge, { backgroundColor: '#ecfdf5' }]}>
                <Text style={[styles.activityBadgeText, { color: '#10b981' }]}>APPROVED</Text>
             </View>
          </View>

          {/* Activity item 2 */}
          <View style={styles.activityCard}>
             <View style={[styles.activityIconBg, { backgroundColor: '#fef2f2' }]}>
               <Ionicons name="medkit-outline" size={20} color="#ef4444" />
             </View>
             <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Sick Leave</Text>
                <Text style={styles.activitySub}>22 May • 1 Day</Text>
             </View>
             <View style={[styles.activityBadge, { backgroundColor: '#ecfdf5' }]}>
                <Text style={[styles.activityBadgeText, { color: '#10b981' }]}>APPROVED</Text>
             </View>
          </View>

          {/* Activity item 3 */}
          <View style={styles.activityCard}>
             <View style={[styles.activityIconBg, { backgroundColor: '#f3f4f6' }]}>
               <Ionicons name="airplane-outline" size={20} color="#6b7280" />
             </View>
             <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>Vacation</Text>
                <Text style={styles.activitySub}>10 Apr - 15 Apr • 5 Days</Text>
             </View>
             <View style={[styles.activityBadge, { backgroundColor: '#f3f4f6' }]}>
                <Text style={[styles.activityBadgeText, { color: '#4b5563' }]}>COMPLETED</Text>
             </View>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' }, // fully white bg based on screenshot
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },
  
  profileSection: { alignItems: 'center', marginBottom: 24 },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#f3f4f6' },
  onlineDot: { position: 'absolute', bottom: 4, right: 4, width: 18, height: 18, borderRadius: 9, backgroundColor: '#10b981', borderWidth: 3, borderColor: '#fff' },
  name: { fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 4 },
  role: { fontSize: 13, color: '#6b7280', fontWeight: '500' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  statBox: { flex: 1, backgroundColor: '#fafafa', padding: 16, borderRadius: 16 },
  statBoxHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  statLabel: { fontSize: 11, fontWeight: '800', color: '#5a55d2', letterSpacing: 0.5 },
  statValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 8 },
  statValue: { fontSize: 28, fontWeight: '800', color: '#111827' },
  statDaysText: { fontSize: 13, color: '#9ca3af', fontWeight: '600' },
  statSubGreen: { fontSize: 10, color: '#10b981', fontWeight: '700' },
  statSubRed: { fontSize: 10, color: '#ef4444', fontWeight: '700' },

  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#1f2937' },
  calendarMonth: { fontSize: 13, fontWeight: '700', color: '#5a55d2' },
  
  calendarContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1, marginBottom: 32 },
  weekDaysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  weekDayText: { width: 30, textAlign: 'center', fontSize: 11, fontWeight: '800', color: '#9ca3af' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCellWrapper: { width: '14.28%', aspectRatio: 1, padding: 2 },
  dayCell: { flex: 1, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  dayCellLeave: { backgroundColor: '#eef2ff' },
  dayText: { fontSize: 12, fontWeight: '700', color: '#111827' },
  dayTextMuted: { fontSize: 12, fontWeight: '600', color: '#d1d5db' },
  dayTextLeave: { color: '#5a55d2', fontWeight: '800' },

  activityCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f9fafb', marginBottom: 8 },
  activityIconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: 14, fontWeight: '800', color: '#1f2937', marginBottom: 4 },
  activitySub: { fontSize: 11, color: '#6b7280', fontWeight: '500' },
  activityBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  activityBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
});
