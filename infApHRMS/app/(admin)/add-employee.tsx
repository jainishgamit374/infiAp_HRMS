import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, SlideInRight } from 'react-native-reanimated';
import Header from '../../components/layout/Header';

export default function AddEmployee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [dept, setDept] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name || !email || !role || !dept) {
      Alert.alert(
        'Missing Information ⚠️',
        'Please fill in all the required fields to create a new employee account.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Simulated submission
    Alert.alert(
      'Success ✅',
      'Employee account created successfully!',
      [{ text: 'Great', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Unified Header */}
      <Header 
        title="Add New Employee" 
        showBack={true} 
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FULL NAME</Text>
              <View style={[styles.inputWrapper, focusedField === 'name' && styles.inputWrapperFocused]}>
                <Ionicons name="person-outline" size={20} color={focusedField === 'name' ? '#4f46e5' : '#94a3b8'} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. Marcus Johnson" 
                  value={name} 
                  onChangeText={setName} 
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={[styles.inputWrapper, focusedField === 'email' && styles.inputWrapperFocused]}>
                <Ionicons name="mail-outline" size={20} color={focusedField === 'email' ? '#4f46e5' : '#94a3b8'} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="marcus@company.com" 
                  keyboardType="email-address" 
                  value={email} 
                  onChangeText={setEmail} 
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>DESIGNATION</Text>
              <View style={[styles.inputWrapper, focusedField === 'role' && styles.inputWrapperFocused]}>
                <Ionicons name="briefcase-outline" size={20} color={focusedField === 'role' ? '#4f46e5' : '#94a3b8'} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. Senior Backend Dev" 
                  value={role} 
                  onChangeText={setRole} 
                  onFocus={() => setFocusedField('role')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>DEPARTMENT</Text>
              <View style={[styles.inputWrapper, focusedField === 'dept' && styles.inputWrapperFocused]}>
                <Ionicons name="business-outline" size={20} color={focusedField === 'dept' ? '#4f46e5' : '#94a3b8'} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. Engineering" 
                  value={dept} 
                  onChangeText={setDept} 
                  onFocus={() => setFocusedField('dept')}
                  onBlur={() => setFocusedField(null)}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitBtnText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 5 },
  inputGroup: { marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '800', color: '#64748b', marginBottom: 8, letterSpacing: 1 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1.5, borderColor: '#e2e8f0', paddingHorizontal: 16 },
  inputWrapperFocused: { borderColor: '#4f46e5', backgroundColor: '#fff' },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, height: 56, fontSize: 16, color: '#1e293b', fontWeight: '600' },
  submitBtn: { backgroundColor: '#4f46e5', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginTop: 20, shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
