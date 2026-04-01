import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { usePerformance, PerformanceEmployee } from './_layout';
import { HRBottomNav } from '@/components/HRBottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/layout/Header';

export default function PerformanceDashboard() {
  const { employees } = usePerformance();

  const avgScore = useMemo(() => {
    if (employees.length === 0) return 0;
    const total = employees.reduce((sum, e) => sum + e.score, 0);
    return Math.round(total / employees.length);
  }, [employees]);

  const topPerformers = useMemo(() => employees.filter(e => e.status === 'Top Performer').length, [employees]);
  const onTargetPct = useMemo(() => {
    if (employees.length === 0) return 0;
    const good = employees.filter(e => e.status === 'Top Performer' || e.status === 'On Target').length;
    return Math.round((good / employees.length) * 100);
  }, [employees]);

  const belowTargetPct = useMemo(() => {
    if (employees.length === 0) return 0;
    const bad = employees.filter(e => e.status === 'Watch' || e.status === 'Below Target').length;
    return Math.round((bad / employees.length) * 100);
  }, [employees]);

  const getStatusColor = (status: PerformanceEmployee['status']) => {
    switch (status) {
      case 'Top Performer': return '#4f46e5';
      case 'On Target': return '#10b981';
      case 'Below Target': return '#ef4444';
      case 'Watch': return '#f59e0b';
      default: return '#9ca3af';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Unified Header */}
      <Header 
        title="Performance" 
        subtitle="Track & Review Growth"
        showBack={true} 
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top 2x2 Stats Summary */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>AVG SCORE</Text>
            <View style={styles.cardRow}>
              <Text style={styles.cardValue}>{avgScore}%</Text>
              <Text style={styles.cardChangePos}>+2.4%</Text>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: '#4f46e5' }]}>
            <Text style={[styles.cardTitle, { color: '#e0e7ff' }]}>TOP PERFORMER</Text>
            <Text style={[styles.cardValue, { color: '#fff', marginVertical: 4 }]}>{topPerformers}</Text>
            <Text style={[styles.cardSubValue, { color: '#e0e7ff' }]}>Active departments</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>ON TARGET</Text>
            <View style={styles.cardRow}>
              <Text style={styles.cardValue}>{onTargetPct}%</Text>
              <Text style={styles.cardChangePos}>+1.2%</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>BELOW TARGET</Text>
            <View style={styles.cardRow}>
              <Text style={styles.cardValue}>{belowTargetPct}%</Text>
              <Text style={styles.cardChangeNeg}>-0.5%</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Monthly Performance</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllBtn}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Employee List */}
        <View style={styles.list}>
          {employees.map((emp, index) => (
            <Animated.View 
              key={emp.id}
              entering={FadeInUp.delay(100 + index * 100).duration(400)}
            >
              <TouchableOpacity 
                style={styles.empCard}
                onPress={() => router.push(`/(hr)/performance/employee/${emp.id}` as any)}
              >
                <View style={styles.empCardTop}>
                  <Image source={{ uri: emp.avatarUrl }} style={styles.empAvatar} />
                  <View style={styles.empInfo}>
                    <Text style={styles.empName}>{emp.name}</Text>
                    <Text style={styles.empRole}>{emp.department} Dept.</Text>
                  </View>
                  <View style={styles.empScoreBox}>
                    <Text style={[styles.empScoreTxt, { color: getStatusColor(emp.status) }]}>{emp.score}%</Text>
                    <Text style={[styles.empStatusTxt, { color: getStatusColor(emp.status) }]}>
                      {emp.status === 'Top Performer' ? 'TOP' : emp.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.progressRow}>
                  <Text style={styles.progressLabel}>PROGRESS</Text>
                  <Text style={styles.progressLabel}>TARGET: 85%</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${emp.score}%`, backgroundColor: getStatusColor(emp.status) }]} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Since the UI has a specific custom bottom nav for Performance, we could use the standard HRBottomNav, but I'll add a simplified custom bar matching Screenshot 1 to stay pixel-perfect. */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(hr)/performance')}>
          <Ionicons name="home" size={20} color="#4f46e5" />
          <Text style={[styles.navText, { color: '#4f46e5' }]}>HOME</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfd' },
  content: { padding: 20, paddingBottom: 100 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 32 },
  card: { width: '48%', backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 1 },
  cardTitle: { fontSize: 10, fontWeight: '800', color: '#9ca3af', letterSpacing: 0.5, marginBottom: 8 },
  cardRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  cardValue: { fontSize: 28, fontWeight: '800', color: '#111827' },
  cardChangePos: { fontSize: 13, fontWeight: '700', color: '#10b981' },
  cardChangeNeg: { fontSize: 13, fontWeight: '700', color: '#ef4444' },
  cardSubValue: { fontSize: 11, fontWeight: '600', color: '#6b7280' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  listTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  viewAllBtn: { fontSize: 13, fontWeight: '700', color: '#4f46e5' },
  list: { gap: 16 },
  empCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  empCardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  empAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 16 },
  empInfo: { flex: 1 },
  empName: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 2 },
  empRole: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  empScoreBox: { alignItems: 'flex-end' },
  empScoreTxt: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  empStatusTxt: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 10, fontWeight: '800', color: '#9ca3af', letterSpacing: 0.5 },
  progressBarBg: { height: 6, backgroundColor: '#f3f4f6', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 16, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  navItem: { alignItems: 'center', justifyContent: 'center', gap: 4 },
  navText: { fontSize: 10, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.5 },
});
