import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useRecruitment } from './_layout';
import { HRBottomNav } from '@/components/HRBottomNav';
import Header from '@/components/layout/Header';

export default function FeedbackStatus() {
  const { id, rec } = useLocalSearchParams<{ id: string, rec: string }>();
  const { candidates } = useRecruitment();

  const candidate = useMemo(() => candidates.find(c => c.id === id), [candidates, id]);

  if (!candidate) return null;

  return (
    <View style={styles.container}>
      <Header 
        title="Submission Status"
        showBack={true}
        onBackPress={() => router.navigate('/(hr)/recruitment')}
      />

      <View style={styles.content}>
        <Animated.View entering={ZoomIn.duration(500).springify()} style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={40} color="#10b981" />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.textContainer}>
          <Text style={styles.title}>Feedback Submitted{'\n'}Successfully!</Text>
          <Text style={styles.subtitle}>
            Your evaluation for <Text style={styles.highlight}>{candidate.name}</Text> ({candidate.role}) has been recorded and the recruitment team has been notified.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.summarySection}>
          <Text style={styles.summaryLabel}>SUMMARY OF EVALUATION</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryCandidateRow}>
              <Image source={{ uri: candidate.avatarUrl }} style={styles.summaryAvatar} />
              <View>
                 <Text style={styles.summaryCandidateLabel}>CANDIDATE</Text>
                 <Text style={styles.summaryCandidateName}>{candidate.name}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryDataRow}>
               <View style={styles.summaryDataCol}>
                  <Text style={styles.summaryDataLabel}>DATE SUBMITTED</Text>
                  <Text style={styles.summaryDataValue}>Oct 24, 2023</Text>
               </View>
               <View style={styles.summaryDataCol}>
                  <Text style={styles.summaryDataLabel}>RECOMMENDATION</Text>
                  <View style={styles.recBadge}>
                     <View style={[styles.recDot, 
                       rec === 'Hire' || rec === 'Strong Hire' ? { backgroundColor: '#4f46e5' } :
                       rec === 'Hold' ? { backgroundColor: '#f59e0b' } : { backgroundColor: '#ef4444' }
                     ]} />
                     <Text style={[styles.recText,
                       rec === 'Hire' || rec === 'Strong Hire' ? { color: '#4f46e5' } :
                       rec === 'Hold' ? { color: '#f59e0b' } : { color: '#ef4444' }
                     ]}>{rec}</Text>
                  </View>
               </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => router.navigate('/(hr)/recruitment')}
          >
            <Text style={styles.primaryBtnText}>Back to Recruitment Dashboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryBtn}
            onPress={() => router.replace(`/(hr)/recruitment/candidate/${id}`)}
          >
            <Text style={styles.secondaryBtnText}>View Candidate Profile</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <HRBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 40 },
  iconWrapper: { marginBottom: 24 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#dcfce7', alignItems: 'center', justifyContent: 'center' },
  textContainer: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: 16, lineHeight: 32 },
  subtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 22 },
  highlight: { color: '#111827', fontWeight: '700' },
  summarySection: { width: '100%', marginBottom: 40 },
  summaryLabel: { fontSize: 11, fontWeight: '700', color: '#9ca3af', letterSpacing: 1, marginBottom: 12 },
  summaryCard: { width: '100%', backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  summaryCandidateRow: { flexDirection: 'row', alignItems: 'center', padding: 20 },
  summaryAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  summaryCandidateLabel: { fontSize: 10, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.5, marginBottom: 2 },
  summaryCandidateName: { fontSize: 15, fontWeight: '700', color: '#111827' },
  divider: { height: 1, backgroundColor: '#f3f4f6' },
  summaryDataRow: { flexDirection: 'row', padding: 20 },
  summaryDataCol: { flex: 1 },
  summaryDataLabel: { fontSize: 10, fontWeight: '700', color: '#9ca3af', letterSpacing: 0.5, marginBottom: 6 },
  summaryDataValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  recBadge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  recDot: { width: 6, height: 6, borderRadius: 3 },
  recText: { fontSize: 14, fontWeight: '700' },
  actions: { width: '100%', gap: 12 },
  primaryBtn: { backgroundColor: '#4f46e5', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  secondaryBtn: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  secondaryBtnText: { color: '#374151', fontSize: 15, fontWeight: '600' },
});
