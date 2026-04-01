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
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { AdminBottomNav } from '../../components/AdminBottomNav';
import Header from '../../components/layout/Header';

const CANDIDATES = [
  { id: 'c1', name: 'James Rodriquez', role: 'React Native Dev', status: 'In Review', applied: '2 days ago', avatar: 'JR' },
  { id: 'c2', name: 'Sophia Chen', role: 'UX Designer', status: 'Shortlisted', applied: '1 week ago', avatar: 'SC' },
  { id: 'c3', name: 'Liam Wilson', role: 'Node.js Backend', status: 'Interviewed', applied: '3 days ago', avatar: 'LW' },
  { id: 'c4', name: 'Emma Watson', role: 'Frontend Lead', status: 'Applied', applied: 'Just now', avatar: 'EW' },
];

export default function CandidateTracking() {
  const [candidates, setCandidates] = useState(CANDIDATES);

  const cycleStatus = (id: string) => {
    const statusOrder = ['Applied', 'In Review', 'Shortlisted', 'Interviewed'];
    setCandidates(prev => prev.map(c => {
      if (c.id === id) {
        const nextIdx = (statusOrder.indexOf(c.status) + 1) % statusOrder.length;
        return { ...c, status: statusOrder[nextIdx] };
      }
      return c;
    }));
  };
  return (
    <View style={styles.mainContainer}>
      <Header 
        title="Candidate Tracking"
        showBack={true}
        rightElement={
          <TouchableOpacity style={styles.searchBtn}>
            <Ionicons name="filter-outline" size={22} color="#64748b" />
          </TouchableOpacity>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(400)}>
          {candidates.map((cand, idx) => (
            <Animated.View key={cand.id} entering={FadeInDown.delay(100 + idx * 80).springify()} style={styles.candCard}>
              <View style={styles.candAvatarBox}>
                <Text style={styles.candAvatarText}>{cand.avatar}</Text>
              </View>
              <View style={styles.candInfo}>
                <Text style={styles.candName}>{cand.name}</Text>
                <Text style={styles.candRole}>{cand.role}</Text>
                <Text style={styles.candTime}>Applied: {cand.applied}</Text>
              </View>
              <View style={styles.candRight}>
                <View style={[styles.candStatusBox, { backgroundColor: cand.status === 'Shortlisted' ? '#f0fdf4' : (cand.status === 'Interviewed' ? '#eff6ff' : '#f1f5f9') }]}>
                  <Text style={[styles.candStatusText, { color: cand.status === 'Shortlisted' ? '#10b981' : (cand.status === 'Interviewed' ? '#3b82f6' : '#475569') }]}>{cand.status}</Text>
                </View>
                <TouchableOpacity style={styles.candTrackBtn} onPress={() => cycleStatus(cand.id)}>
                  <Text style={styles.candTrackText}>Update</Text>
                </TouchableOpacity>
              </View>
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
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  searchBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16 },
  candCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  candAvatarBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0e7ff' },
  candAvatarText: { fontSize: 16, fontWeight: '800', color: '#4f46e5' },
  candInfo: { flex: 1, marginLeft: 16 },
  candName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  candRole: { fontSize: 12, color: '#64748b', fontWeight: '500', marginTop: 1 },
  candTime: { fontSize: 10, color: '#94a3b8', fontWeight: '600', marginTop: 4 },
  candRight: { alignItems: 'flex-end', gap: 8 },
  candStatusBox: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  candStatusText: { fontSize: 10, fontWeight: '800' },
  candTrackBtn: { backgroundColor: '#059669', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  candTrackText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
