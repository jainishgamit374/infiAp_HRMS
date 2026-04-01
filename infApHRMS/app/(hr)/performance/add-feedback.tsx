import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { usePerformance, ReviewFeedback } from './_layout';
import Header from '@/components/layout/Header';

export default function AddFeedback() {
  const { employees, addFeedback } = usePerformance();
  const [selectedEmp, setSelectedEmp] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [scores, setScores] = useState({ technical: 0, communication: 0, problemSolving: 0, cultural: 0 });
  const [comment, setComment] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [showRecDropdown, setShowRecDropdown] = useState(false);

  const selectedEmployee = employees.find(e => e.id === selectedEmp);

  const handleScore = (cat: keyof typeof scores, val: number) => {
    setScores(prev => ({ ...prev, [cat]: val }));
  };

  const handleSubmit = () => {
    if (!selectedEmp) { Alert.alert('Error', 'Please select an employee.'); return; }
    if (!recommendation) { Alert.alert('Error', 'Please select a recommendation.'); return; }
    const avgRating = Math.round((scores.technical + scores.communication + scores.problemSolving + scores.cultural) / 4);
    const fb: ReviewFeedback = {
      id: Math.random().toString(36).substring(7),
      employeeId: selectedEmp,
      reviewerName: 'HR Manager',
      reviewerRole: 'Admin',
      reviewerAvatar: 'https://i.pravatar.cc/150?u=HRManager',
      comment: comment || `${recommendation} - Performance review completed.`,
      rating: avgRating,
      status: avgRating >= 4 ? 'Excellent' : avgRating >= 3 ? 'Good' : 'Pending',
      timeAgo: 'Just now',
    };
    addFeedback(fb);
    Alert.alert('✅ Success', 'Feedback submitted successfully!', [{ text: 'OK', onPress: () => router.back() }]);
  };

  const StarRow = ({ label, icon, cat }: { label: string; icon: string; cat: keyof typeof scores }) => (
    <View style={styles.ratingBox}>
      <View style={styles.ratingHeader}>
        <Ionicons name={icon as any} size={18} color="#4f46e5" />
        <Text style={styles.ratingLabel}>{label}</Text>
      </View>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity key={star} onPress={() => handleScore(cat, star)}>
            <Ionicons name={scores[cat] >= star ? 'star' : 'star-outline'} size={24} color={scores[cat] >= star ? '#f59e0b' : '#d1d5db'} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="Add Feedback"
        showBack={true}
        onBackPress={() => router.back()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.duration(400)}>
          <Text style={styles.label}>Select Employee</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowDropdown(!showDropdown)}>
            <Text style={selectedEmployee ? styles.dropdownValue : styles.dropdownPlaceholder}>
              {selectedEmployee ? selectedEmployee.name : 'Choose an employee...'}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#6b7280" />
          </TouchableOpacity>
          {showDropdown && (
            <View style={styles.dropdownList}>
              {employees.map(e => (
                <TouchableOpacity key={e.id} style={styles.dropdownItem} onPress={() => { setSelectedEmp(e.id); setShowDropdown(false); }}>
                  <Text style={styles.dropdownItemText}>{e.name} – {e.role}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>CORE COMPETENCIES</Text>
          <StarRow label="Technical Skills" icon="code-slash-outline" cat="technical" />
          <StarRow label="Communication" icon="chatbubbles-outline" cat="communication" />
          <StarRow label="Problem Solving" icon="bulb-outline" cat="problemSolving" />
          <StarRow label="Cultural Fit" icon="people-outline" cat="cultural" />

          <Text style={[styles.label, { marginTop: 24 }]}>Comments</Text>
          <TextInput style={styles.textArea} placeholder="Share your assessment..." placeholderTextColor="#9ca3af" multiline numberOfLines={4} textAlignVertical="top" value={comment} onChangeText={setComment} />

          <Text style={[styles.label, { marginTop: 24 }]}>Final Recommendation</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowRecDropdown(!showRecDropdown)}>
            <Text style={recommendation ? styles.dropdownValue : styles.dropdownPlaceholder}>{recommendation || 'Select...'}</Text>
            <Ionicons name="chevron-down" size={18} color="#6b7280" />
          </TouchableOpacity>
          {showRecDropdown && (
            <View style={styles.dropdownList}>
              {['Excellent', 'Good', 'Needs Improvement', 'Below Expectations'].map(opt => (
                <TouchableOpacity key={opt} style={styles.dropdownItem} onPress={() => { setRecommendation(opt); setShowRecDropdown(false); }}>
                  <Text style={styles.dropdownItemText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Submit Feedback</Text>
            <Ionicons name="paper-plane-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  content: { padding: 24, paddingBottom: 60 },
  label: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 8 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#9ca3af', letterSpacing: 1, marginBottom: 16 },
  dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, height: 50 },
  dropdownValue: { fontSize: 15, color: '#111827' },
  dropdownPlaceholder: { fontSize: 15, color: '#9ca3af' },
  dropdownList: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, marginTop: 4, marginBottom: 16, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  dropdownItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  dropdownItemText: { fontSize: 15, color: '#111827' },
  ratingBox: { backgroundColor: '#f9fafb', padding: 16, borderRadius: 16, marginBottom: 12 },
  ratingHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  ratingLabel: { fontSize: 14, fontWeight: '600', color: '#111827' },
  starsRow: { flexDirection: 'row', gap: 8 },
  textArea: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 16, fontSize: 14, color: '#111827', minHeight: 100 },
  submitBtn: { flexDirection: 'row', backgroundColor: '#4f46e5', height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 32 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
