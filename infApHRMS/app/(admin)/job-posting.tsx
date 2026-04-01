import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn, ZoomIn, SlideInDown } from 'react-native-reanimated';
import { AdminBottomNav } from '../../components/AdminBottomNav';

const JOBS = [
  { id: 'j1', title: 'Senior React Native Developer', dept: 'Engineering', type: 'Full-time', status: 'Active', applicants: 12, exp: '5+ years', salary: '$120k - $150k' },
  { id: 'j2', title: 'UX/UI Designer', dept: 'Creative', type: 'Full-time', status: 'Active', applicants: 8, exp: '3+ years', salary: '$90k - $110k' },
  { id: 'j3', title: 'Marketing Manager', dept: 'Marketing', type: 'Contract', status: 'On Hold', applicants: 5, exp: '4+ years', salary: '$80k - $100k' },
];

export default function JobPosting() {
  const [jobs, setJobs] = useState(JOBS);
  const [showAddJob, setShowAddJob] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('');

  const handlePostJob = () => {
    if (!newJobTitle || !newJobDept) return;
    const newJob = {
      id: 'j' + (jobs.length + 1),
      title: newJobTitle,
      dept: newJobDept,
      type: 'Full-time',
      status: 'Active',
      applicants: 0,
      exp: '0-2 years',
      salary: 'Negotiable',
    };
    setJobs([newJob, ...jobs]);
    setShowAddJob(false);
    setNewJobTitle('');
    setNewJobDept('');
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Posting</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="search-outline" size={22} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(400)}>
          {jobs.map((job, idx) => (
            <Animated.View key={job.id} entering={FadeInDown.delay(100 + idx * 80).springify()} style={styles.jobCard}>
              <View style={styles.jobHeader}>
                <View>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.jobDept}>{job.dept} • {job.type}</Text>
                </View>
                <View style={[styles.statusBadge, job.status === 'Active' ? styles.activeBadge : styles.holdBadge]}>
                    <Text style={[styles.statusBadgeText, { color: job.status === 'Active' ? '#10b981' : '#f59e0b' }]}>{job.status}</Text>
                </View>
              </View>
              <View style={styles.jobDivider} />
              <View style={styles.jobStats}>
                <View style={styles.jobStatItem}>
                  <Ionicons name="people-outline" size={16} color="#64748b" />
                  <Text style={styles.jobStatText}>{job.applicants} Applicants</Text>
                </View>
                <View style={styles.jobStatItem}>
                  <Ionicons name="briefcase-outline" size={16} color="#64748b" />
                  <Text style={styles.jobStatText}>{job.exp}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.jobAction} onPress={() => router.push('/(admin)/candidate-tracking')}>
                <Text style={styles.jobActionText}>View Applicants</Text>
                <Ionicons name="chevron-forward" size={14} color="#4f46e5" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>
        <View style={{ height: 100 }} />
      </ScrollView>

      <Animated.View entering={ZoomIn.duration(400)} style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={() => setShowAddJob(true)}>
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.fabText}>Post a Job</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal visible={showAddJob} transparent animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalOverlay}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowAddJob(false)} />
          <Animated.View entering={SlideInDown.springify()} style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Post New Job</Text>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>JOB TITLE</Text>
              <TextInput style={styles.formInput} placeholder="e.g. Senior Product Manager" placeholderTextColor="#94a3b8" value={newJobTitle} onChangeText={setNewJobTitle} />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>DEPARTMENT</Text>
              <TextInput style={styles.formInput} placeholder="e.g. Engineering" placeholderTextColor="#94a3b8" value={newJobDept} onChangeText={setNewJobDept} />
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={handlePostJob}>
              <Text style={styles.submitBtnText}>Post Job</Text>
            </TouchableOpacity>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

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
  jobCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9' },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  jobTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  jobDept: { fontSize: 13, color: '#64748b', marginTop: 2, fontWeight: '500' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  activeBadge: { backgroundColor: '#f0fdf4' },
  holdBadge: { backgroundColor: '#fff7ed' },
  statusBadgeText: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  jobDivider: { height: 1, backgroundColor: '#f8fafc', marginBottom: 16 },
  jobStats: { flexDirection: 'row', gap: 20, marginBottom: 16 },
  jobStatItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  jobStatText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  jobAction: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  jobActionText: { fontSize: 14, fontWeight: '700', color: '#4f46e5' },
  fabContainer: { position: 'absolute', bottom: 100, right: 20 },
  fab: { backgroundColor: '#10b981', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 30, gap: 8, elevation: 5 },
  fabText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginBottom: 24 },
  formGroup: { marginBottom: 20 },
  formLabel: { fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 8, letterSpacing: 0.5 },
  formInput: { backgroundColor: '#f1f5f9', borderRadius: 12, padding: 16, fontSize: 16, color: '#1e293b' },
  submitBtn: { backgroundColor: '#10b981', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
