import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRecruitment, CandidateStatus } from '../_layout';

export default function CandidateProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { candidates, updateStatus } = useRecruitment();

  const candidate = useMemo(() => candidates.find(c => c.id === id), [candidates, id]);

  if (!candidate) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Candidate Profile</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={{ marginRight: 16 }}>
             <Ionicons name="share-social-outline" size={22} color="#4b5563" />
          </TouchableOpacity>
          <TouchableOpacity>
             <Ionicons name="ellipsis-vertical" size={22} color="#4b5563" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.profileSection}>
          <View>
            <Image source={{ uri: candidate.avatarUrl }} style={styles.avatar} />
            <View style={styles.onlineDot} />
          </View>
          <Text style={styles.name}>{candidate.name}</Text>
          <Text style={styles.role}>{candidate.role}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{candidate.status.toUpperCase()}</Text>
          </View>
        </Animated.View>

        <View style={styles.divider} />

        {/* Recruitment Progress */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.section}>
          <View style={styles.progressHeader}>
             <Text style={styles.sectionTitle}>RECRUITMENT PROGRESS</Text>
          </View>
          <View style={styles.progressHeaderRow}>
             <Text style={styles.progressStageText}>TECHNICAL INTERVIEW STAGE</Text>
             <Text style={styles.progressPercentText}>60%</Text>
          </View>
          <View style={styles.progressBarContainer}>
             <View style={styles.progressSegmentFilled} />
             <View style={styles.progressSegmentFilled} />
             <View style={styles.progressSegmentFilled} />
             <View style={styles.progressSegmentEmpty} />
             <View style={styles.progressSegmentEmpty} />
          </View>
        </Animated.View>

        <View style={styles.divider} />

        {/* Contact Information */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACT INFORMATION</Text>
          <View style={styles.contactItem}>
             <Ionicons name="mail-outline" size={20} color="#6366f1" style={styles.contactIcon} />
             <View>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{candidate.email}</Text>
             </View>
          </View>
          <View style={styles.contactItem}>
             <Ionicons name="call-outline" size={20} color="#6366f1" style={styles.contactIcon} />
             <View>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{candidate.phone}</Text>
             </View>
          </View>
          <View style={styles.contactItem}>
             <Ionicons name="globe-outline" size={20} color="#6366f1" style={styles.contactIcon} />
             <View>
                <Text style={styles.contactLabel}>Portfolio</Text>
                <Text style={styles.contactLink}>{candidate.portfolio}</Text>
             </View>
          </View>
        </Animated.View>

        <View style={styles.divider} />

        {/* Professional Summary */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
          <Text style={styles.bodyText}>{candidate.summary}</Text>
        </Animated.View>

        <View style={styles.divider} />

        {/* Applied Position */}
        <Animated.View entering={FadeInUp.delay(400).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>APPLIED POSITION</Text>
          <View style={styles.appliedCard}>
            <View style={{ flex: 1 }}>
               <Text style={styles.appliedRole}>{candidate.role}</Text>
               <Text style={styles.appliedDept}>Product & Engineering</Text>
            </View>
            <View style={styles.appliedDateBadge}>
               <Text style={styles.appliedDateText}>Applied {candidate.appliedDate}</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.divider} />

        {/* Experience */}
        <Animated.View entering={FadeInUp.delay(500).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>EXPERIENCE</Text>
          {candidate.pastRoles.map((role, idx) => (
            <View key={idx} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                 <View style={[styles.timelineDot, idx === 0 && { backgroundColor: '#4f46e5' }]} />
                 {idx < candidate.pastRoles.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineRight}>
                 <Text style={styles.timelineRole}>{role.split(',')[0]}</Text>
                 <Text style={styles.timelineCompany}>{role.split(',')[1] || role}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        <View style={styles.divider} />

        {/* Skills */}
        <Animated.View entering={FadeInUp.delay(600).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>SKILLS</Text>
          <View style={styles.skillsContainer}>
            {candidate.skills.map((skill, idx) => (
              <View key={idx} style={[styles.skillBadge, idx === 3 && { backgroundColor: '#eef2ff' }]}>
                <Text style={[styles.skillText, idx === 3 && { color: '#4f46e5' }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <View style={styles.divider} />

        {/* Education */}
        <Animated.View entering={FadeInUp.delay(700).duration(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>EDUCATION</Text>
          <View style={styles.eduItem}>
             <Ionicons name="school-outline" size={20} color="#6b7280" style={styles.eduIcon} />
             <View>
                <Text style={styles.eduDegree}>B.S. Interaction Design</Text>
                <Text style={styles.eduUni}>University of Washington • 2013 - 2017</Text>
             </View>
          </View>
        </Animated.View>
        
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Floating Bottom Navigation Actions */}
      <Animated.View entering={FadeInUp.delay(800).duration(400)} style={styles.bottomBar}>
        <View style={styles.bottomActionRowTop}>
           <TouchableOpacity 
             style={[styles.primaryBtn, { flex: 1.5 }]}
             onPress={() => router.push(`/(hr)/recruitment/feedback/${candidate.id}` as any)}
           >
             <Ionicons name="calendar-outline" size={18} color="#fff" />
             <Text style={styles.primaryBtnText}>Schedule Interview</Text>
           </TouchableOpacity>
           <TouchableOpacity style={[styles.secondaryBtn, { flex: 1 }]}>
             <Ionicons name="chatbubble-outline" size={18} color="#4b5563" />
             <Text style={styles.secondaryBtnText}>Message</Text>
           </TouchableOpacity>
        </View>

        <View style={styles.bottomActionRowBottom}>
           <TouchableOpacity style={styles.textActionBtn} onPress={() => updateStatus(candidate.id, 'Rejected')}>
             <Ionicons name="close-circle-outline" size={18} color="#ef4444" />
             <Text style={[styles.textActionText, { color: '#ef4444' }]}>Reject</Text>
           </TouchableOpacity>
           <View style={styles.verticalDivider} />
           <TouchableOpacity style={styles.textActionBtn}>
             <Ionicons name="document-text-outline" size={18} color="#6b7280" />
             <Text style={styles.textActionText}>Resume</Text>
           </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827', flex: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  content: { paddingBottom: 180 },
  profileSection: { alignItems: 'center', paddingVertical: 24 },
  avatar: { width: 88, height: 88, borderRadius: 44, marginBottom: 16 },
  onlineDot: { position: 'absolute', bottom: 16, right: 4, width: 20, height: 20, borderRadius: 10, backgroundColor: '#10b981', borderWidth: 3, borderColor: '#fff' },
  name: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 4 },
  role: { fontSize: 15, color: '#4b5563', marginBottom: 12, fontWeight: '500' },
  statusBadge: { backgroundColor: '#eef2ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#e0e7ff' },
  statusText: { color: '#4f46e5', fontWeight: '800', fontSize: 11, letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginHorizontal: 20 },
  section: { paddingHorizontal: 20, paddingVertical: 24 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#9ca3af', marginBottom: 16, letterSpacing: 1 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  progressStageText: { fontSize: 11, fontWeight: '800', color: '#4f46e5', letterSpacing: 0.5 },
  progressPercentText: { fontSize: 12, fontWeight: '700', color: '#4f46e5' },
  progressBarContainer: { flexDirection: 'row', gap: 4 },
  progressSegmentFilled: { flex: 1, height: 6, backgroundColor: '#4f46e5', borderRadius: 3 },
  progressSegmentEmpty: { flex: 1, height: 6, backgroundColor: '#eef2ff', borderRadius: 3 },
  contactItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  contactIcon: { marginTop: 2, marginRight: 12, width: 24 },
  contactLabel: { fontSize: 12, color: '#9ca3af', marginBottom: 2, fontWeight: '500' },
  contactValue: { fontSize: 14, color: '#111827', fontWeight: '500' },
  contactLink: { fontSize: 14, color: '#4f46e5', fontWeight: '500' },
  bodyText: { fontSize: 14, color: '#4b5563', lineHeight: 22 },
  appliedCard: { backgroundColor: '#f9fafb', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  appliedRole: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
  appliedDept: { fontSize: 13, color: '#6b7280' },
  appliedDateBadge: { backgroundColor: '#eef2ff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
  appliedDateText: { fontSize: 11, color: '#4f46e5', fontWeight: '600' },
  timelineItem: { flexDirection: 'row', marginBottom: 16 },
  timelineLeft: { width: 24, alignItems: 'center' },
  timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#d1d5db', marginTop: 4 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#f3f4f6', marginTop: 4 },
  timelineRight: { flex: 1, paddingLeft: 12, paddingBottom: 16 },
  timelineRole: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  timelineCompany: { fontSize: 13, color: '#6b7280' },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillBadge: { backgroundColor: '#f9fafb', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#f3f4f6' },
  skillText: { fontSize: 12, fontWeight: '600', color: '#4b5563' },
  eduItem: { flexDirection: 'row', alignItems: 'flex-start' },
  eduIcon: { marginRight: 12, marginTop: 2 },
  eduDegree: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 2 },
  eduUni: { fontSize: 13, color: '#6b7280' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6', padding: 20, paddingBottom: Platform.OS === 'ios' ? 34 : 20 },
  bottomActionRowTop: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  primaryBtn: { backgroundColor: '#4f46e5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, gap: 8 },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  secondaryBtn: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#d1d5db', gap: 8 },
  secondaryBtnText: { color: '#374151', fontSize: 15, fontWeight: '600' },
  bottomActionRowBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  textActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 24, paddingVertical: 8 },
  textActionText: { fontSize: 14, fontWeight: '600', color: '#6b7280' },
  verticalDivider: { width: 1, height: 16, backgroundColor: '#d1d5db' },
});
