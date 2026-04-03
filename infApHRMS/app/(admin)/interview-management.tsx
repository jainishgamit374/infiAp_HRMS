import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn, SlideInDown } from 'react-native-reanimated';
import { AdminBottomNav } from '../../components/AdminBottomNav';
import Header from '../../components/layout/Header';

const INTERVIEWS = [
  { id: 'i1', candidate: 'Liam Wilson', role: 'Node.js Backend', date: '2023-10-24', time: '10:00 AM', interviewer: 'Alex Rivera' },
  { id: 'i2', candidate: 'Sophia Chen', role: 'UX Designer', date: '2023-10-25', time: '02:30 PM', interviewer: 'Marcus Lee' },
  { id: 'i3', candidate: 'James Miller', role: 'DevOps Engineer', date: '2023-11-02', time: '11:00 AM', interviewer: 'Alex Rivera' },
];

export default function InterviewManagement() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date(2023, 9, 1)); // October 2023
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleAction = (id: string) => {
    alert('Join Interview call started!');
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getStartDay = (year: number, month: number) => new Date(year, month, 1).getDay();

  const changeMonth = (delta: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setViewDate(newDate);
  };

  const filteredInterviews = selectedDate 
    ? INTERVIEWS.filter(i => i.date === selectedDate)
    : INTERVIEWS;

  const formatDateLabel = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
  };

  const renderCalendarModal = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysCount = getDaysInMonth(year, month);
    const startDay = getStartDay(year, month);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
      <Modal visible={showCalendar} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowCalendar(false)} />
          <Animated.View entering={SlideInDown.springify().damping(18)} style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Interview Schedule</Text>
              <TouchableOpacity style={styles.modalClose} onPress={() => setShowCalendar(false)}>
                <Ionicons name="close" size={22} color="#64748b" />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <Text style={styles.calendarMonth}>{months[month]} {year}</Text>
                <View style={styles.calendarNav}>
                  <TouchableOpacity style={styles.calNavBtn} onPress={() => changeMonth(-1)}><Ionicons name="chevron-back" size={20} color="#64748b" /></TouchableOpacity>
                  <TouchableOpacity style={styles.calNavBtn} onPress={() => changeMonth(1)}><Ionicons name="chevron-forward" size={20} color="#64748b" /></TouchableOpacity>
                </View>
              </View>

              <View style={styles.weekDays}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                  <Text key={d} style={styles.weekDayText}>{d}</Text>
                ))}
              </View>

              <View style={styles.daysGrid}>
                {/* Padding for start of month */}
                {Array.from({ length: (startDay + 6) % 7 }).map((_, i) => (
                  <View key={`pad-${i}`} style={styles.dayCell} />
                ))}
                
                {Array.from({ length: daysCount }, (_, i) => i + 1).map(day => {
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isEvent = INTERVIEWS.some(inter => inter.date === dateStr);
                  const isSelected = selectedDate === dateStr;
                  const isToday = day === 22 && month === 9 && year === 2023; // Static today for demo purpose

                  return (
                    <TouchableOpacity 
                      key={day} 
                      style={[styles.dayCell, isSelected && styles.todayCell, isToday && !isSelected && { backgroundColor: '#f1f5f9' }]}
                      onPress={() => {
                        setSelectedDate(dateStr);
                        setShowCalendar(false);
                      }}
                    >
                      <Text style={[styles.dayText, isSelected && styles.todayText, isToday && { color: '#4f46e5' }]}>{day}</Text>
                      {isEvent && <View style={[styles.eventMarker, isSelected && { backgroundColor: '#fff' }]} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.clearBtn} onPress={() => { setSelectedDate(null); setShowCalendar(false); }}>
                <Text style={styles.clearBtnText}>View All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={() => setShowCalendar(false)}>
                <Text style={styles.confirmBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.mainContainer}>
      {renderCalendarModal()}
      <Header 
        title="Interview Management"
        showBack={true}
        rightElement={
          <TouchableOpacity style={styles.searchBtn} onPress={() => setShowCalendar(true)}>
            <Ionicons name="calendar-outline" size={22} color="#64748b" />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {selectedDate && (
          <View style={styles.activeFilterRow}>
            <Text style={styles.filterLabel}>Showing interviews for:</Text>
            <TouchableOpacity style={styles.filterChip} onPress={() => setSelectedDate(null)}>
              <Text style={styles.filterChipText}>{formatDateLabel(selectedDate)}</Text>
              <Ionicons name="close-circle" size={16} color="#4f46e5" />
            </TouchableOpacity>
          </View>
        )}

        <Animated.View entering={FadeInDown.duration(400)}>
          {filteredInterviews.length > 0 ? (
            filteredInterviews.map((interview, idx) => (
              <Animated.View key={interview.id} entering={FadeInDown.delay(idx * 80).springify()} style={styles.intCard}>
                <View style={styles.intDateBox}>
                  <Text style={styles.intDay}>{interview.date.split('-')[2]}</Text>
                  <Text style={styles.intMonth}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(interview.date.split('-')[1]) - 1]}</Text>
                </View>
                <View style={styles.intInfo}>
                  <Text style={styles.intCand}>{interview.candidate}</Text>
                  <Text style={styles.intRole}>{interview.role}</Text>
                  <View style={styles.intTimeRow}>
                    <Ionicons name="time-outline" size={14} color="#64748b" />
                    <Text style={styles.intTimeText}>{interview.time} • with {interview.interviewer}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.intAction} onPress={() => handleAction(interview.id)}>
                  <Ionicons name="videocam-outline" size={20} color="#047857" />
                </TouchableOpacity>
              </Animated.View>
            ))
          ) : (
            <View style={styles.noData}>
              <Ionicons name="calendar-clear-outline" size={48} color="#cbd5e1" />
              <Text style={styles.noDataText}>No interviews scheduled for this date.</Text>
            </View>
          )}
        </Animated.View>
        <View style={{ height: 100 }} />
      </ScrollView>
      <AdminBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f8fafc' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  searchBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16 },
  activeFilterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  filterLabel: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  filterChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#dbeafe' },
  filterChipText: { fontSize: 13, fontWeight: '700', color: '#4f46e5' },
  noData: { alignItems: 'center', paddingVertical: 60 },
  noDataText: { fontSize: 14, color: '#94a3b8', marginTop: 12, fontWeight: '500' },
  intCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  intDateBox: { width: 50, height: 50, borderRadius: 14, backgroundColor: '#f5f3ff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd6fe' },
  intDay: { fontSize: 18, fontWeight: '900', color: '#4f46e5' },
  intMonth: { fontSize: 10, fontWeight: '800', color: '#4f46e5', textTransform: 'uppercase' },
  intInfo: { flex: 1, marginLeft: 16 },
  intCand: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  intRole: { fontSize: 12, color: '#64748b', fontWeight: '600', marginBottom: 4 },
  intTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  intTimeText: { fontSize: 11, fontWeight: '500', color: '#64748b' },
  intAction: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center' },

  // Modal Styles
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  modalClose: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },

  // Calendar Styles
  calendarContainer: { backgroundColor: '#f8fafc', borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  calendarMonth: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  calendarNav: { flexDirection: 'row', gap: 8 },
  calNavBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  weekDays: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 16 },
  weekDayText: { fontSize: 12, fontWeight: '700', color: '#94a3b8', width: (Dimensions.get('window').width - 80) / 7, textAlign: 'center' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  dayCell: { width: (Dimensions.get('window').width - 85) / 7, height: 45, justifyContent: 'center', alignItems: 'center' },
  todayCell: { backgroundColor: '#4f46e5', borderRadius: 12 },
  dayText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  todayText: { color: '#fff' },
  eventMarker: { position: 'absolute', bottom: 6, width: 4, height: 4, borderRadius: 2, backgroundColor: '#10b981' },
  modalActions: { flexDirection: 'row', gap: 12 },
  clearBtn: { flex: 1, paddingVertical: 18, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  clearBtnText: { color: '#64748b', fontSize: 16, fontWeight: '700' },
  confirmBtn: { flex: 2, backgroundColor: '#4f46e5', paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
