import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useHR } from '@/context/HRContext';
import { HRBottomNav } from '@/components/HRBottomNav';
import Animated, { FadeInDown } from 'react-native-reanimated';

const AddEmployee = () => {
  const { addEmployee } = useHR();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    manager: '',
    joiningDate: '',
    salary: '',
  });

  const handleAdd = () => {
    if (!form.name || !form.email || !form.role) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    
    addEmployee({
      ...form,
      status: 'Active',
      avatar: `https://i.pravatar.cc/150?u=${form.name.replace(/\s/g, '')}`,
    });
    
    Alert.alert(
      'Success ✅',
      'Employee Added Successfully',
      [{ text: 'OK', onPress: () => router.push('/(hr)/employee-management' as any) }]
    );
  };

  const renderInput = (label: string, value: string, onChange: (text: string) => void, placeholder: string, icon: string, required = false) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}{required && <Text style={{ color: '#ef4444' }}> *</Text>}</Text>
      <View style={styles.inputContainer}>
        <Ionicons name={icon as any} size={20} color="#9ca3af" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
        />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Add Employee</Text>
        </Animated.View>

        {/* Photo Upload Section */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.photoSection}>
          <TouchableOpacity style={styles.photoPlaceholder}>
            <Ionicons name="camera-outline" size={32} color="#9ca3af" />
            <View style={styles.addBadge}>
              <Ionicons name="add" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.uploadText}>Upload Profile Photo</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(600)}>
          <Text style={styles.sectionHeading}>PERSONAL DETAILS</Text>
          
          {renderInput('Full Name', form.name, (t) => setForm({...form, name: t}), 'e.g. John Doe', 'person-outline', true)}
          {renderInput('Email Address', form.email, (t) => setForm({...form, email: t}), 'john@company.com', 'mail-outline', true)}
          {renderInput('Phone Number', form.phone, (t) => setForm({...form, phone: t}), '+1 (555) 000-0000', 'call-outline')}

          <Text style={[styles.sectionHeading, { marginTop: 24 }]}>EMPLOYMENT DETAILS</Text>
          
          {renderInput('Department', form.department, (t) => setForm({...form, department: t}), 'Engineering', 'business-outline')}
          {renderInput('Role', form.role, (t) => setForm({...form, role: t}), 'Senior Designer', 'briefcase-outline', true)}
          {renderInput('Joining Date', form.joiningDate, (t) => setForm({...form, joiningDate: t}), 'mm/dd/yyyy', 'calendar-outline')}
          {renderInput('Reporting Manager', form.manager, (t) => setForm({...form, manager: t}), 'Search manager...', 'people-outline')}
          {renderInput('Annual Salary', form.salary, (t) => setForm({...form, salary: t}), '$ 95,000', 'cash-outline')}

          <View style={styles.footerActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleAdd}>
              <Text style={styles.submitText}>Create Employee</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
      <HRBottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  addBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#5a55d2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  uploadText: {
    fontSize: 13,
    color: '#5a55d2',
    fontWeight: '600',
    marginTop: 12,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
    height: 52,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  footerActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
  submitButton: {
    flex: 2,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#5a55d2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AddEmployee;
