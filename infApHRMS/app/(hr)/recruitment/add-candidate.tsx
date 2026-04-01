import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Alert, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRecruitment, Candidate } from './_layout';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Header from '@/components/layout/Header';

export default function AddCandidate() {
  const { addCandidate } = useRecruitment();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    experience: '',
    location: '',
    email: '',
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.role) {
      Alert.alert('Required Fields', 'Please fill in at least the name and role.');
      return;
    }

    const newCandidate: Candidate = {
      id: Math.random().toString(36).substring(7),
      name: formData.name,
      role: formData.role,
      department: formData.department || 'Engineering',
      status: 'Applied',
      experience: formData.experience || 'Entry Level',
      location: formData.location || 'Remote',
      email: formData.email || '',
      phone: '',
      portfolio: '',
      summary: 'New application received.',
      skills: [],
      pastRoles: [],
      appliedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      avatarUrl: `https://i.pravatar.cc/150?u=${formData.name.replace(/\s/g, '')}`,
      time: 'Just now'
    };

    addCandidate(newCandidate);
    Alert.alert('Success', 'Candidate added successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Add New Candidate"
        showBack={true}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.duration(400)}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Jane Doe"
              value={formData.name}
              onChangeText={(t) => setFormData({...formData, name: t})}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Applied Role *</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Product Manager"
              value={formData.role}
              onChangeText={(t) => setFormData({...formData, role: t})}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Department</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Design"
              value={formData.department}
              onChangeText={(t) => setFormData({...formData, department: t})}
            />
          </View>

          <View style={styles.row}>
             <View style={[styles.formGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.label}>Experience</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. 5 Years"
                  value={formData.experience}
                  onChangeText={(t) => setFormData({...formData, experience: t})}
                />
             </View>
             <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Location</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. Remote"
                  value={formData.location}
                  onChangeText={(t) => setFormData({...formData, location: t})}
                />
             </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput 
              style={styles.input} 
              placeholder="jane.doe@example.com"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(t) => setFormData({...formData, email: t})}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
             <Text style={styles.submitBtnText}>Add Candidate</Text>
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
  content: { padding: 24 },
  formGroup: { marginBottom: 20 },
  row: { flexDirection: 'row' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, height: 50, fontSize: 15, color: '#111827' },
  submitBtn: { backgroundColor: '#4f46e5', height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
