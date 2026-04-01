import React, { useState, useEffect } from 'react';
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
import { useLocalSearchParams, router } from 'expo-router';
import { useHR, Employee } from '@/context/HRContext';
import { HRBottomNav } from '@/components/HRBottomNav';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Header from '@/components/layout/Header';

const EditEmployee = () => {
  const { id } = useLocalSearchParams();
  const { employees, updateEmployee } = useHR();

  const employee = employees.find(e => e.id === id);

  const [form, setForm] = useState({
    name: '',
    department: '',
    role: '',
    manager: '',
    salary: '',
    status: 'Active' as Employee['status'],
  });

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name,
        department: employee.department,
        role: employee.role,
        manager: employee.manager,
        salary: employee.salary,
        status: employee.status,
      });
    }
  }, [employee]);

  const handleSave = () => {
    if (!employee) return;
    updateEmployee(employee.id, form);
    Alert.alert(
      'Success ✅',
      'Employee Updated Successfully',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const renderInput = (label: string, value: string, onChange: (text: string) => void, icon: string) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <Ionicons name={icon as any} size={20} color="#9ca3af" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholderTextColor="#9ca3af"
        />
      </View>
    </View>
  );

  if (!employee) return null;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Header 
          title="Edit Employee"
          showBack={true}
          rightElement={
            <TouchableOpacity>
              <Text style={styles.helpText}>Help</Text>
            </TouchableOpacity>
          }
        />

        {/* Profile Header */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: employee.avatar }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{form.name}</Text>
          <Text style={styles.profileId}>Employee ID: {employee.id}</Text>
        </Animated.View>

        {/* Form Fields */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.form}>
          {renderInput('Full Name', form.name, (t) => setForm({...form, name: t}), 'person-outline')}
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Department</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="business-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                value={form.department} 
                onChangeText={(t) => setForm({...form, department: t})}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Role</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="briefcase-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                value={form.role} 
                onChangeText={(t) => setForm({...form, role: t})}
              />
            </View>
          </View>

          {renderInput('Reporting Manager', form.manager, (t) => setForm({...form, manager: t}), 'people-outline')}
          {renderInput('Annual Salary (USD)', form.salary, (t) => setForm({...form, salary: t}), 'cash-outline')}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Employment Status</Text>
            <View style={styles.statusRow}>
              {['Active', 'On Leave', 'Terminated'].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.statusChip,
                    form.status === s && styles.statusChipActive,
                  ]}
                  onPress={() => setForm({...form, status: s as any})}
                >
                  <Text style={[
                    styles.statusChipText,
                    form.status === s && styles.statusChipTextActive,
                  ]}>{s.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>

        {/* Footer Actions */}
        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

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
    paddingBottom: 40,
  },
  helpText: {
    fontSize: 14,
    color: '#5a55d2',
    fontWeight: '600',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#f3f4f6',
  },
  editAvatarButton: {
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
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  profileId: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
    marginTop: 4,
  },
  form: {
    marginBottom: 24,
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
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusChip: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusChipActive: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  statusChipText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6b7280',
  },
  statusChipTextActive: {
    color: '#22c55e',
  },
  footerActions: {
    flexDirection: 'row',
    gap: 12,
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
  saveButton: {
    flex: 2,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#5a55d2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default EditEmployee;
