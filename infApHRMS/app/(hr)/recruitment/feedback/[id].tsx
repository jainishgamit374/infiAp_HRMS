import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRecruitment, Feedback } from '../_layout';
import { HRBottomNav } from '@/components/HRBottomNav';

export default function InterviewFeedback() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { candidates, addFeedback } = useRecruitment();
  
  const candidate = useMemo(() => candidates.find(c => c.id === id), [candidates, id]);

  const [scores, setScores] = useState({
    technical: 0,
    communication: 0,
    problemSolving: 0,
    cultural: 0,
  });
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [recommendation, setRecommendation] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!candidate) return null;

  const handleScore = (category: keyof typeof scores, score: number) => {
    setScores(prev => ({ ...prev, [category]: score }));
  };

  const StarRating = ({ label, icon, category }: { label: string, icon: any, category: keyof typeof scores }) => (
    <View style={styles.ratingBox}>
      <View style={styles.ratingHeader}>
        <Ionicons name={icon} size={18} color="#4f46e5" style={styles.ratingIcon} />
        <Text style={styles.ratingLabel}>{label}</Text>
      </View>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleScore(category, star)} style={styles.starBtn}>
            <Ionicons 
              name={scores[category] >= star ? "star" : "star-outline"} 
              size={20} 
              color={scores[category] >= star ? "#4f46e5" : "#9ca3af"} 
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const handleSubmit = () => {
    if (!recommendation) {
      alert('Please select a final recommendation.');
      return;
    }
    const feedback: Feedback = {
      candidateId: id,
      technical: scores.technical,
      communication: scores.communication,
      problemSolving: scores.problemSolving,
      cultural: scores.cultural,
      strengths,
      improvements,
      recommendation,
    };
    addFeedback(feedback);
    router.replace(`/(hr)/recruitment/feedback-status?id=${id}&rec=${recommendation}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Interview Feedback</Text>
          <View style={styles.inReviewBadge}>
             <Text style={styles.inReviewText}>IN REVIEW</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Candidate Info Snippet */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.candidateSnippet}>
           <Image source={{ uri: candidate.avatarUrl }} style={styles.snippetAvatar} />
           <View style={{ flex: 1 }}>
              <Text style={styles.snippetName}>{candidate.name}</Text>
              <Text style={styles.snippetRole}>{candidate.role}</Text>
              <View style={styles.snippetDateRow}>
                 <Ionicons name="calendar-outline" size={14} color="#6b7280" />
                 <Text style={styles.snippetDateText}>Oct 24, 2023 - 10:30 AM</Text>
              </View>
           </View>
        </Animated.View>

        {/* Core Competencies */}
        <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>CORE COMPETENCIES</Text>
          <StarRating label="Technical Skills" icon="code-slash-outline" category="technical" />
          <StarRating label="Communication" icon="chatbubbles-outline" category="communication" />
          <StarRating label="Problem Solving" icon="bulb-outline" category="problemSolving" />
          <StarRating label="Cultural Fit" icon="people-outline" category="cultural" />
        </Animated.View>

        {/* Detailed Assessment */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>DETAILED ASSESSMENT</Text>
          
          <Text style={styles.inputLabel}>Key Strengths</Text>
          <TextInput 
            style={styles.textArea}
            placeholder="What stood out about this candidate?"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={strengths}
            onChangeText={setStrengths}
          />

          <Text style={[styles.inputLabel, { marginTop: 24 }]}>Areas for Improvement</Text>
          <TextInput 
            style={styles.textArea}
            placeholder="Any red flags or growth opportunities?"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={improvements}
            onChangeText={setImprovements}
          />
        </Animated.View>

        {/* Final Recommendation */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>FINAL RECOMMENDATION</Text>
          <View style={{ zIndex: 10 }}>
            <TouchableOpacity 
               style={styles.dropdownBtn}
               onPress={() => setDropdownOpen(!dropdownOpen)}
            >
               <Text style={[styles.dropdownText, !recommendation && { color: '#9ca3af' }]}>
                 {recommendation || "Select an option"}
               </Text>
               <Ionicons name="chevron-down" size={20} color="#6b7280" />
            </TouchableOpacity>

            {dropdownOpen && (
               <View style={styles.dropdownList}>
                  {['Strong Hire', 'Hire', 'Hold', 'Reject'].map(opt => (
                     <TouchableOpacity 
                        key={opt}
                        style={styles.dropdownItem}
                        onPress={() => { setRecommendation(opt); setDropdownOpen(false); }}
                     >
                        <Text style={styles.dropdownItemText}>{opt}</Text>
                     </TouchableOpacity>
                  ))}
               </View>
            )}
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Submit Feedback</Text>
            <Ionicons name="paper-plane-outline" size={18} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </Animated.View>
        
      </ScrollView>

      <HRBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fe' },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827', flex: 1 },
  inReviewBadge: { backgroundColor: '#eef2ff', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  inReviewText: { color: '#4f46e5', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  content: { padding: 20, paddingBottom: 100 },
  candidateSnippet: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  snippetAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 16 },
  snippetName: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 2 },
  snippetRole: { fontSize: 13, color: '#4f46e5', fontWeight: '500', marginBottom: 6 },
  snippetDateRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  snippetDateText: { fontSize: 12, color: '#6b7280' },
  sectionContainer: { marginBottom: 32 },
  sectionTitle: { fontSize: 12, color: '#6b7280', fontWeight: '700', letterSpacing: 1, marginBottom: 16 },
  ratingBox: { backgroundColor: '#fff', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 12 },
  ratingHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingIcon: { marginRight: 8, backgroundColor: '#eef2ff', padding: 4, borderRadius: 8, overflow: 'hidden' },
  ratingLabel: { fontSize: 14, fontWeight: '600', color: '#111827' },
  starsContainer: { flexDirection: 'row', gap: 4 },
  starBtn: { paddingVertical: 4, paddingRight: 4 },
  inputLabel: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 8 },
  textArea: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, fontSize: 14, color: '#111827', minHeight: 120 },
  dropdownBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, height: 50, marginBottom: 24 },
  dropdownText: { fontSize: 15, color: '#111827' },
  dropdownList: { position: 'absolute', top: 54, left: 0, right: 0, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, zIndex: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  dropdownItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  dropdownItemText: { fontSize: 15, color: '#111827' },
  submitBtn: { backgroundColor: '#4f46e5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 12 },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
