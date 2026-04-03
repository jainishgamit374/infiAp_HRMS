import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BottomNav } from '../../components/BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/layout/Header';

export default function AttendanceHistory() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Prev month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: 'prev',
        status: 'off'
      });
    }

    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      let status = 'present';
      if (i % 7 === 0 || i % 7 === 6) status = 'off';
      if (i === 6 || i === 20) status = 'missed';
      if (i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
        status = 'selected';
      }

      days.push({
        day: i,
        month: 'curr',
        status: status
      });
    }

    // Next month padding to fill 6 weeks (42 cells)
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
        days.push({
          day: i,
          month: 'next',
          status: 'off'
        });
    }

    return days;
  }, [currentDate]);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  return (
    <View style={styles.root}>
      {/* Unified Header */}
      <Header 
        title="Attendance History" 
        subtitle="View your presence & time logs"
        showBack={true} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL HOURS</Text>
            <Text style={styles.statValue}>164h 30m</Text>
            <View style={styles.growthBadge}>
              <Ionicons name="trending-up" size={12} color="#22c55e" />
              <Text style={styles.growthText}>+4.2%</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>PRESENT DAYS</Text>
            <Text style={styles.statValue}>18/22</Text>
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle-outline" size={12} color="#22c55e" />
              <Text style={styles.statusBadgeText}>On track</Text>
            </View>
          </View>
        </View>

        {/* Calendar Card */}
        <View style={styles.calendarCard}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => changeMonth(-1)}>
              <Ionicons name="chevron-back" size={20} color="#1e293b" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{monthName} {year}</Text>
            <TouchableOpacity onPress={() => changeMonth(1)}>
              <Ionicons name="chevron-forward" size={20} color="#1e293b" />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDays}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
              <Text key={idx} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {calendarData.map((item, idx) => (
              <View key={idx} style={styles.dayCell}>
                <View style={[
                  styles.dayCircle,
                  item.status === 'selected' && styles.selectedDayCircle,
                  (item.month === 'prev' || item.month === 'next') && styles.prevMonthDay
                ]}>
                  <Text style={[
                     styles.dayText,
                     item.status === 'selected' && styles.selectedDayText,
                     (item.month === 'prev' || item.month === 'next') && styles.prevMonthDayText
                  ]}>{item.day}</Text>
                </View>
                {item.status !== 'selected' && item.status !== 'off' && item.month === 'curr' && (
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: item.status === 'present' ? '#22c55e' : '#ef4444' }
                  ]} />
                )}
                {item.status === 'selected' && (
                  <View style={[styles.statusDot, { backgroundColor: '#4f46e5' }]} />
                )}
                {(item.status === 'off' || item.month === 'prev' || item.month === 'next') && (
                  <View style={[styles.statusDot, { backgroundColor: '#cbd5e1' }]} />
                )}
              </View>
            ))}
          </View>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.legendText}>PRESENT</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.legendText}>MISSED</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#cbd5e1' }]} />
              <Text style={styles.legendText}>OFF</Text>
            </View>
          </View>
        </View>

        {/* Daily Logs */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Logs</Text>
          <TouchableOpacity>
            <Text style={styles.viewHistory}>View History</Text>
          </TouchableOpacity>
        </View>

        {/* Log Cards */}
        <View style={styles.logList}>
           <View style={styles.logCard}>
             <View style={styles.logDateColumn}>
               <Text style={styles.logMonth}>OCT</Text>
               <Text style={styles.logDay}>12</Text>
             </View>
             <View style={styles.logInfo}>
               <View style={styles.punchRow}>
                 <Ionicons name="log-in-outline" size={16} color="#22c55e" />
                 <Text style={styles.punchTime}>09:05 AM</Text>
               </View>
               <View style={styles.punchRow}>
                 <Ionicons name="log-out-outline" size={16} color="#ef4444" />
                 <Text style={styles.punchTime}>06:12 PM</Text>
               </View>
             </View>
             <View style={styles.logRight}>
               <Text style={styles.durationText}>9h 07m</Text>
               <View style={styles.presentBadge}>
                 <Text style={styles.presentText}>PRESENT</Text>
               </View>
             </View>
           </View>

           <View style={[styles.logCard, { borderColor: '#fee2e2' }]}>
             <View style={styles.logDateColumn}>
               <Text style={styles.logMonth}>OCT</Text>
               <Text style={styles.logDay}>06</Text>
             </View>
             <View style={styles.logInfo}>
               <View style={styles.punchRow}>
                 <Ionicons name="log-in-outline" size={16} color="#cbd5e1" />
                 <Text style={styles.punchTime}>-- : --</Text>
               </View>
               <View style={styles.punchRow}>
                 <Ionicons name="log-out-outline" size={16} color="#cbd5e1" />
                 <Text style={styles.punchTime}>-- : --</Text>
               </View>
             </View>
             <View style={styles.logRight}>
               <TouchableOpacity style={styles.regularizeBtn}>
                 <Ionicons name="calendar-outline" size={14} color="#fff" />
                 <Text style={styles.regularizeBtnText}>Regularize</Text>
               </TouchableOpacity>
               <View style={styles.missedBadge}>
                 <Text style={styles.missedText}>MISSED PUNCH</Text>
               </View>
             </View>
           </View>

           <View style={styles.logCard}>
             <View style={styles.logDateColumn}>
               <Text style={styles.logMonth}>OCT</Text>
               <Text style={styles.logDay}>05</Text>
             </View>
             <View style={styles.logInfo}>
               <View style={styles.punchRow}>
                 <Ionicons name="log-in-outline" size={16} color="#22c55e" />
                 <Text style={styles.punchTime}>08:58 AM</Text>
               </View>
               <View style={styles.punchRow}>
                 <Ionicons name="log-out-outline" size={16} color="#ef4444" />
                 <Text style={styles.punchTime}>06:05 PM</Text>
               </View>
             </View>
             <View style={styles.logRight}>
               <Text style={styles.durationText}>9h 07m</Text>
               <View style={styles.presentBadge}>
                 <Text style={styles.presentText}>PRESENT</Text>
               </View>
             </View>
           </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8faff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#edf2ff',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#4f46e5',
    marginBottom: 8,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  growthText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#22c55e',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#22c55e',
  },
  calendarCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weekDayText: {
    width: 40,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#94a3b8',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
  dayCell: {
    width: 40,
    alignItems: 'center',
    gap: 4,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayCircle: {
    backgroundColor: '#eef2ff',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  selectedDayText: {
    color: '#4f46e5',
  },
  prevMonthDay: {
    opacity: 0.5,
  },
  prevMonthDayText: {
    color: '#cbd5e1',
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  viewHistory: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '600',
  },
  logList: {
    gap: 12,
  },
  logCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
  },
  logDateColumn: {
    alignItems: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#f1f5f9',
    width: 60,
  },
  logMonth: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 4,
  },
  logDay: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  logInfo: {
    paddingHorizontal: 16,
    gap: 8,
    flex: 1,
  },
  punchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  punchTime: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },
  logRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  presentBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  presentText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16a34a',
  },
  missedBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  missedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ef4444',
  },
  regularizeBtn: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  regularizeBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});
