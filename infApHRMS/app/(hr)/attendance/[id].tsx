import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/layout/Header';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

export default function AttendanceDetails() {
  const { id } = useLocalSearchParams();

  // Mock employee details
  const employee = {
    id: id || 'INF-204',
    name: 'Sneha Desai',
    department: 'Engineering Department',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    summary: { work: 22, pres: 20, abs: 1, lv: 1, percentage: 91 }
  };

  const MOCK_LOGS = [
    { date: 'Oct 26, 2023', type: 'Regular Entry', in: '09:12 AM', out: 'On Time', icon: 'log-in-outline', color: '#22c55e' },
    { date: 'Oct 26, 2023', type: 'Regular Exit', in: '06:45 PM', out: 'Total: 9h 33m', icon: 'log-out-outline', color: '#3b82f6' },
    { date: 'Oct 25, 2023', type: 'Regular Entry', in: '08:58 AM', out: 'Early', icon: 'log-in-outline', color: '#22c55e' },
  ];

  // Calendar render helper
  const renderCalendar = () => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    // Mock dates for Oct 2023 starting on Sun (1st is Sun)
    const dates = Array.from({ length: 31 }, (_, i) => i + 1);
    
    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <Text style={styles.monthText}>October 2023</Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <TouchableOpacity><Ionicons name="chevron-back" size={20} color="#9ca3af" /></TouchableOpacity>
            <TouchableOpacity><Ionicons name="chevron-forward" size={20} color="#9ca3af" /></TouchableOpacity>
          </View>
        </View>
        <View style={styles.daysRow}>
          {days.map(d => <Text key={d} style={styles.dayLabel}>{d}</Text>)}
        </View>
        <View style={styles.datesGrid}>
          {dates.map((date, index) => {
            let isAbsent = date === 15;
            let isPresent = date >= 1 && date <= 14 && date !== 7 && date !== 8;
            let isLate = date === 17;

            let bgColor = 'transparent';
            let textColor = '#4b5563';

            if (isPresent) { bgColor = '#f0fdf4'; textColor = '#22c55e'; }
            else if (isAbsent) { bgColor = '#fef2f2'; textColor = '#ef4444'; }
            else if (isLate) { bgColor = '#fffbeb'; textColor = '#f59e0b'; }

            return (
              <View key={index} style={[styles.dateCell, { backgroundColor: bgColor }]}>
                <Text style={[styles.dateText, { color: textColor }]}>{date}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Attendance Details" 
        subtitle="Employee Presence Log"
        showBack={true}
        rightElement={
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="calendar-outline" size={22} color="#1f2937" />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Employee Card */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.employeeCard}>
          <Image source={{ uri: employee.avatar }} style={styles.avatar} />
          <View style={styles.employeeInfo}>
            <Text style={styles.employeeName}>{employee.name}</Text>
            <View style={styles.deptRow}>
              <Ionicons name="business-outline" size={12} color="#6b7280" />
              <Text style={styles.employeeDept}>{employee.department}</Text>
            </View>
            <Text style={styles.employeeId}>EMP ID: {employee.id}</Text>
          </View>
        </Animated.View>

        {/* Summary Row */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>WORK</Text>
            <Text style={[styles.summaryValue, { color: '#6366f1' }]}>{employee.summary.work}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>PRES</Text>
            <Text style={[styles.summaryValue, { color: '#22c55e' }]}>{employee.summary.pres}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>ABS</Text>
            <Text style={[styles.summaryValue, { color: '#ef4444' }]}>{employee.summary.abs}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>LV</Text>
            <Text style={[styles.summaryValue, { color: '#f59e0b' }]}>{employee.summary.lv}</Text>
          </View>
          <View style={[styles.summaryItem, { backgroundColor: '#111827' }]}>
            <Text style={[styles.summaryLabel, { color: '#9ca3af' }]}>%</Text>
            <Text style={[styles.summaryValue, { color: '#ffffff' }]}>{employee.summary.percentage}</Text>
          </View>
        </Animated.View>

        {/* Calendar */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          {renderCalendar()}
        </Animated.View>

        {/* Log Header */}
        <View style={styles.logHeader}>
          <Text style={styles.sectionTitle}>Check-in / Out Log</Text>
          <TouchableOpacity>
            <Text style={styles.viewHistoryText}>View History</Text>
          </TouchableOpacity>
        </View>

        {/* Logs */}
        <View style={styles.logsContainer}>
          {MOCK_LOGS.map((log, index) => (
            <Animated.View key={index} entering={FadeInRight.delay(300 + index * 100).duration(500)}>
              <View style={styles.logItem}>
                <View style={[styles.logIconBg, { backgroundColor: `${log.color}15` }]}>
                  <Ionicons name={log.icon as any} size={20} color={log.color} />
                </View>
                <View style={styles.logMiddle}>
                  <Text style={styles.logDate}>{log.date}</Text>
                  <Text style={styles.logType}>{log.type}</Text>
                </View>
                <View style={styles.logRight}>
                  <Text style={styles.logTime}>{log.in}</Text>
                  <Text style={[styles.logStatus, { color: log.color }]}>{log.out}</Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  iconBtn: { padding: 8 },
  content: { padding: 20 },
  
  employeeCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatar: { width: 56, height: 56, borderRadius: 28, marginRight: 16 },
  employeeInfo: { flex: 1 },
  employeeName: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 4 },
  deptRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  employeeDept: { fontSize: 13, color: '#6b7280' },
  employeeId: { fontSize: 11, fontWeight: '700', color: '#4f46e5', letterSpacing: 0.5 },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginBottom: 32 },
  summaryItem: { flex: 1, backgroundColor: '#f8f9fe', paddingVertical: 12, borderRadius: 16, alignItems: 'center' },
  summaryLabel: { fontSize: 11, fontWeight: '700', color: '#6b7280', marginBottom: 4 },
  summaryValue: { fontSize: 18, fontWeight: '800' },

  calendarContainer: { backgroundColor: '#ffffff', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 32 },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  monthText: { fontSize: 16, fontWeight: '800', color: '#111827' },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  dayLabel: { width: 36, textAlign: 'center', fontSize: 10, fontWeight: '700', color: '#9ca3af' },
  datesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dateCell: { width: `${100/7}%`, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderRadius: 20 },
  dateText: { fontSize: 13, fontWeight: '600' },

  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  viewHistoryText: { fontSize: 13, fontWeight: '600', color: '#4f46e5' },

  logsContainer: { gap: 12 },
  logItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 20, padding: 16 },
  logIconBg: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  logMiddle: { flex: 1 },
  logDate: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 2 },
  logType: { fontSize: 12, color: '#6b7280' },
  logRight: { alignItems: 'flex-end' },
  logTime: { fontSize: 15, fontWeight: '800', color: '#111827', marginBottom: 2 },
  logStatus: { fontSize: 12, fontWeight: '700' },
});
