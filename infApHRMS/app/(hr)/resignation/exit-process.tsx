import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useResignation } from './_layout';
import { HRBottomNav } from '@/components/HRBottomNav';
import Header from '@/components/layout/Header';

export default function ExitProcess() {
  const { requests, completeExitStep } = useResignation();
  const approved = requests.filter(r => r.status === 'Approved');

  return (
    <View style={styles.container}>
      <Header 
        title="Exit Process"
        showBack={true}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {approved.length === 0 && (
          <View style={styles.emptyBox}>
            <Ionicons name="information-circle-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyText}>No approved resignations to process.</Text>
          </View>
        )}

        {approved.map((req, idx) => {
          const completedCount = req.exitSteps.filter(s => s.completed).length;
          const progress = Math.round((completedCount / req.exitSteps.length) * 100);

          return (
            <Animated.View key={req.id} entering={FadeInUp.delay(idx * 100).duration(400)} style={styles.card}>
              <View style={styles.cardTop}>
                <Image source={{ uri: req.avatarUrl }} style={styles.avatar} />
                <View style={styles.info}>
                  <Text style={styles.name}>{req.employeeName}</Text>
                  <Text style={styles.role}>{req.employeeRole}</Text>
                  <Text style={styles.meta}>Last day: {req.lastWorkingDate}</Text>
                </View>
                <Text style={styles.progressText}>{progress}%</Text>
              </View>

              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>

              <Text style={styles.stepsLabel}>EXIT CHECKLIST</Text>
              {req.exitSteps.map((step, sIdx) => (
                <TouchableOpacity
                  key={sIdx}
                  style={styles.stepRow}
                  onPress={() => {
                    if (!step.completed) {
                      completeExitStep(req.id, sIdx);
                      Alert.alert('✅ Done', `"${step.title}" marked as completed.`);
                    }
                  }}
                >
                  <View style={[styles.stepCircle, step.completed && styles.stepCircleDone]}>
                    {step.completed && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                  <Text style={[styles.stepText, step.completed && styles.stepTextDone]}>{step.title}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          );
        })}
      </ScrollView>
      <HRBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfd' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  content: { padding: 20, paddingBottom: 100 },
  emptyBox: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 14, color: '#9ca3af', marginTop: 12 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 16 },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 2 },
  role: { fontSize: 12, color: '#4b5563', marginBottom: 2 },
  meta: { fontSize: 11, color: '#9ca3af' },
  progressText: { fontSize: 18, fontWeight: '800', color: '#4f46e5' },
  progressBg: { height: 6, backgroundColor: '#eef2ff', borderRadius: 3, marginBottom: 20, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4f46e5', borderRadius: 3 },
  stepsLabel: { fontSize: 11, fontWeight: '800', color: '#9ca3af', letterSpacing: 0.5, marginBottom: 12 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  stepCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#d1d5db', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  stepCircleDone: { backgroundColor: '#10b981', borderColor: '#10b981' },
  stepText: { fontSize: 14, fontWeight: '500', color: '#374151' },
  stepTextDone: { color: '#9ca3af', textDecorationLine: 'line-through' },
});
