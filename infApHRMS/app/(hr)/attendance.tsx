import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { HRBottomNav } from '@/components/HRBottomNav';
import Animated, { FadeInDown } from 'react-native-reanimated';

const AttendanceScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Attendance</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.placeholderCard}>
          <Ionicons name="time-outline" size={64} color="#5a55d2" />
          <Text style={styles.placeholderTitle}>Attendance Module</Text>
          <Text style={styles.placeholderBox}>Track daily attendance, shifts, and late arrivals in real-time.</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>View Today's Report</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
      <HRBottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fe' },
  content: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 32, gap: 12 },
  backButton: { padding: 4 },
  title: { fontSize: 24, fontWeight: '700', color: '#1f2937' },
  placeholderCard: { backgroundColor: '#fff', borderRadius: 24, padding: 40, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' },
  placeholderTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginTop: 20 },
  placeholderBox: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginTop: 12, lineHeight: 20 },
  actionButton: { backgroundColor: '#5a55d2', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 24 },
  actionButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

export default AttendanceScreen;
