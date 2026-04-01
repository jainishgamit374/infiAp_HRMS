import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  TextInput,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn, ZoomIn, SlideInDown, Layout } from 'react-native-reanimated';
import { AdminBottomNav } from '../../components/AdminBottomNav';
import Header from '../../components/layout/Header';

const { width } = Dimensions.get('window');

// --- MOCK DATA ---
const JOBS = [
  { id: 'j1', title: 'Senior React Native Developer', dept: 'Engineering', type: 'Full-time', status: 'Active', applicants: 12, exp: '5+ years', salary: '$120k - $150k' },
  { id: 'j2', title: 'UX/UI Designer', dept: 'Creative', type: 'Full-time', status: 'Active', applicants: 8, exp: '3+ years', salary: '$90k - $110k' },
  { id: 'j3', title: 'Marketing Manager', dept: 'Marketing', type: 'Contract', status: 'On Hold', applicants: 5, exp: '4+ years', salary: '$80k - $100k' },
];

const CANDIDATES = [
  { id: 'c1', name: 'James Rodriquez', role: 'React Native Dev', status: 'In Review', applied: '2 days ago', avatar: 'JR' },
  { id: 'c2', name: 'Sophia Chen', role: 'UX Designer', status: 'Shortlisted', applied: '1 week ago', avatar: 'SC' },
  { id: 'c3', name: 'Liam Wilson', role: 'Node.js Backend', status: 'Interviewed', applied: '3 days ago', avatar: 'LW' },
  { id: 'c4', name: 'Emma Watson', role: 'Frontend Lead', status: 'Applied', applied: 'Just now', avatar: 'EW' },
];

const INTERVIEWS = [
  { id: 'i1', candidate: 'Liam Wilson', role: 'Node.js Backend', date: 'Oct 24, 2023', time: '10:00 AM', interviewer: 'Alex Rivera' },
  { id: 'i2', candidate: 'Sophia Chen', role: 'UX Designer', date: 'Oct 25, 2023', time: '02:30 PM', interviewer: 'Marcus Lee' },
];

type Tab = 'Jobs' | 'Candidates' | 'Interviews';

export default function RecruitmentHub() {
  const [activeTab, setActiveTab] = useState<Tab>('Jobs');
  const [showAddJob, setShowAddJob] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDept, setNewJobDept] = useState('');

  const renderJobs = () => (
    <Animated.View entering={FadeInDown.duration(400)}>
      {JOBS.map((job, idx) => (
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
          <TouchableOpacity style={styles.jobAction}>
            <Text style={styles.jobActionText}>View Applicants</Text>
            <Ionicons name="chevron-forward" size={14} color="#4f46e5" />
          </TouchableOpacity>
        </Animated.View>
      ))}
    </Animated.View>
  );

  const renderCandidates = () => (
    <Animated.View entering={FadeInDown.duration(400)}>
      {CANDIDATES.map((cand, idx) => (
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
            <View style={styles.candStatusBox}>
              <Text style={styles.candStatusText}>{cand.status}</Text>
            </View>
            <TouchableOpacity style={styles.candTrackBtn}>
              <Text style={styles.candTrackText}>Track</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      ))}
    </Animated.View>
  );

  const renderInterviews = () => (
    <Animated.View entering={FadeInDown.duration(400)}>
      {INTERVIEWS.map((interview, idx) => (
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
          <TouchableOpacity style={styles.intAction}>
            <Ionicons name="videocam-outline" size={20} color="#4f46e5" />
          </TouchableOpacity>
        </Animated.View>
      ))}
    </Animated.View>
  );

  return (
    <View style={styles.mainContainer}>
      <Header 
        title="Recruitment Hub"
        showBack={true}
        rightElement={
          <TouchableOpacity style={styles.searchBtn}>
            <Ionicons name="search-outline" size={22} color="#64748b" />
          </TouchableOpacity>
        }
      />

      <View style={styles.tabsContainer}>
        {(['Jobs', 'Candidates', 'Interviews'] as Tab[]).map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === 'Jobs' && renderJobs()}
        {activeTab === 'Candidates' && renderCandidates()}
        {activeTab === 'Interviews' && renderInterviews()}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB for Jobs Tab */}
      {activeTab === 'Jobs' && (
        <Animated.View entering={ZoomIn.duration(400)} style={styles.fabContainer}>
          <TouchableOpacity style={styles.fab} onPress={() => setShowAddJob(true)}>
            <Ionicons name="add" size={24} color="#fff" />
            <Text style={styles.fabText}>Post a Job</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Post Job Modal */}
      <Modal visible={showAddJob} transparent animationType="fade">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
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
            <TouchableOpacity style={styles.submitBtn} onPress={() => setShowAddJob(false)}>
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
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  searchBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },

  tabsContainer: { flexDirection: 'row', padding: 16, backgroundColor: '#fff', gap: 12 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center', backgroundColor: '#f8fafc' },
  activeTab: { backgroundColor: '#4f46e5' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  activeTabText: { color: '#fff' },

  scrollContent: { padding: 16 },

  // Jobs
  jobCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9', elevation: 2 },
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

  // Candidates
  candCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  candAvatarBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0e7ff' },
  candAvatarText: { fontSize: 16, fontWeight: '800', color: '#4f46e5' },
  candInfo: { flex: 1, marginLeft: 16 },
  candName: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  candRole: { fontSize: 12, color: '#64748b', fontWeight: '500', marginTop: 1 },
  candTime: { fontSize: 10, color: '#94a3b8', fontWeight: '600', marginTop: 4 },
  candRight: { alignItems: 'flex-end', gap: 8 },
  candStatusBox: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  candStatusText: { fontSize: 10, fontWeight: '800', color: '#475569' },
  candTrackBtn: { backgroundColor: '#4f46e5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  candTrackText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  // Interviews
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

  fabContainer: { position: 'absolute', bottom: 100, right: 20 },
  fab: { backgroundColor: '#4f46e5', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 30, gap: 8, elevation: 5 },
  fabText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, paddingBottom: 40 },
  modalHandle: { width: 40, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b', marginBottom: 24 },
  formGroup: { marginBottom: 20 },
  formLabel: { fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 8, letterSpacing: 0.5 },
  formInput: { backgroundColor: '#f1f5f9', borderRadius: 12, padding: 16, fontSize: 16, color: '#1e293b' },
  submitBtn: { backgroundColor: '#4f46e5', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 10 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
