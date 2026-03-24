import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AdminBottomNav } from '../../components/AdminBottomNav';

const INTERVIEWS = [
  { id: 'i1', candidate: 'Liam Wilson', role: 'Node.js Backend', date: 'Oct 24, 2023', time: '10:00 AM', interviewer: 'Alex Rivera' },
  { id: 'i2', candidate: 'Sophia Chen', role: 'UX Designer', date: 'Oct 25, 2023', time: '02:30 PM', interviewer: 'Marcus Lee' },
];

export default function InterviewManagement() {
  const [interviews, setInterviews] = useState(INTERVIEWS);

  const handleAction = (id: string) => {
    // In a real app, this might open a video call or reschedule modal
    alert('Join Interview call started!');
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Interview Management</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="calendar-outline" size={22} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(400)}>
          {interviews.map((interview, idx) => (
            <Animated.View key={interview.id} entering={FadeInDown.delay(100 + idx * 80).springify()} style={styles.intCard}>
              <View style={styles.intDateBox}>
                <Text style={styles.intDay}>{interview.date.split(' ')[1].replace(',', '')}</Text>
                <Text style={styles.intMonth}>{interview.date.split(' ')[0]}</Text>
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
          ))}
        </Animated.View>
        <View style={{ height: 100 }} />
      </ScrollView>
      <AdminBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  searchBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16 },
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
});
