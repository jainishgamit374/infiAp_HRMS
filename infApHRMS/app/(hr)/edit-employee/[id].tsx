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
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useHR, Employee } from '@/context/HRContext';
import { HRBottomNav } from '@/components/HRBottomNav';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/layout/Header';
import { useImagePicker } from '@/hooks/useImagePicker';

const EditEmployee = () => {
  const { id } = useLocalSearchParams();
  const { employees, updateEmployee } = useHR();

  // Robust ID extraction
  const employeeId = typeof id === 'string' ? id : (Array.isArray(id) ? id[0] : '');
  const employee = employees.find(e => e.id === employeeId);

  const [activeTab, setActiveTab] = useState<'General' | 'Work' | 'Financial'>('General');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    manager: '',
    joiningDate: '',
    salary: '',
    status: 'Active' as Employee['status'],
    avatarUri: null as string | null,
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { showImagePickerOptions } = useImagePicker();

  const handlePickImage = () => {
    showImagePickerOptions((uri) => {
      setForm(prev => ({ ...prev, avatarUri: uri }));
    });
  };

  useEffect(() => {
    if (employee && !isInitialized) {
      setForm({
        name: employee.name,
        email: employee.email || '',
        phone: employee.phone || '',
        department: employee.department,
        role: employee.role,
        manager: employee.manager,
        joiningDate: employee.joiningDate || '',
        salary: employee.salary,
        status: employee.status,
        avatarUri: null,
      });
      setIsInitialized(true);
    }
  }, [employee, isInitialized]);

  const handleSave = () => {
    if (!employee) return;
    updateEmployee(employee.id, {
      name: form.name,
      email: form.email,
      phone: form.phone,
      department: form.department,
      role: form.role,
      manager: form.manager,
      joiningDate: form.joiningDate,
      salary: form.salary,
      status: form.status,
      avatar: form.avatarUri || employee.avatar
    });
    Alert.alert(
      'Changes Saved! 🎉',
      'Employee records have been updated successfully.',
      [{ text: 'Great', onPress: () => router.back() }]
    );
  };

  const renderInput = (label: string, value: string, onChange: (text: string) => void, icon: string, fieldName: string, placeholder?: string) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer,
        focusedField === fieldName && styles.inputContainerFocused
      ]}>
        <Ionicons 
          name={icon as any} 
          size={18} 
          color={focusedField === fieldName ? '#5a55d2' : '#9ca3af'} 
          style={styles.inputIcon} 
        />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          onFocus={() => setFocusedField(fieldName)}
          onBlur={() => setFocusedField(null)}
          placeholderTextColor="#9ca3af"
        />
      </View>
    </View>
  );

  const renderTabItem = (title: string, icon: string, value: typeof activeTab) => (
    <TouchableOpacity 
      style={[styles.tabItem, activeTab === value && styles.tabItemActive]}
      onPress={() => setActiveTab(value)}
    >
      <Ionicons 
        name={(activeTab === value ? icon : `${icon}-outline`) as any} 
        size={20} 
        color={activeTab === value ? '#5a55d2' : '#6b7280'} 
      />
      <Text style={[styles.tabText, activeTab === value && styles.tabTextActive]}>{title}</Text>
      {activeTab === value && <Animated.View entering={FadeInDown.duration(300)} style={styles.activeTabIndicator} />}
    </TouchableOpacity>
  );

  if (!employee) return null;

  return (
    <View style={{ flex: 1, backgroundColor: '#fcfcff' }}>
      <Header 
        title="Modify Staff"
        showBack={true}
        rightElement={
          <TouchableOpacity style={styles.helpBtn}>
            <Ionicons name="help-circle-outline" size={24} color="#5a55d2" />
          </TouchableOpacity>
        }
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.container} 
          contentContainerStyle={styles.content} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Enhanced Profile Header */}
          <Animated.View entering={FadeInUp.duration(600)} style={styles.profileHeaderContainer}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: form.avatarUri || employee.avatar }} 
                style={styles.avatarMain} 
              />
              <TouchableOpacity style={styles.avatarEditBadge} onPress={handlePickImage} activeOpacity={0.8}>
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerName}>{form.name || 'Full Name'}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.idBadge}>
                  <Text style={styles.idBadgeText}>#{employee.id}</Text>
                </View>
                <View style={[styles.statusTag, { backgroundColor: form.status === 'Active' ? '#f0fdf4' : (form.status === 'On Leave' ? '#fffbeb' : '#fef2f2') }]}>
                  <Text style={[styles.statusTagText, { color: form.status === 'Active' ? '#15803d' : (form.status === 'On Leave' ? '#b45309' : '#b91c1c') }]}>
                    {form.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* New Tab Navigation */}
          <View style={styles.tabContainer}>
            {renderTabItem('General', 'person', 'General')}
            {renderTabItem('Work', 'briefcase', 'Work')}
            {renderTabItem('Financial', 'card', 'Financial')}
          </View>

          {/* Dynamic Tab Content */}
          <View style={styles.formContentWrapper}>
            {activeTab === 'General' && (
              <Animated.View entering={FadeInDown.duration(400)} style={styles.formInner}>
                <Text style={styles.formDescription}>Basic identification and contact details.</Text>
                {renderInput('Full Name', form.name, (t) => setForm({...form, name: t}), 'person-outline', 'name', 'e.g. John Doe')}
                {renderInput('Email Address', form.email, (t) => setForm({...form, email: t}), 'mail-outline', 'email', 'john@company.com')}
                {renderInput('Phone Number', form.phone, (t) => setForm({...form, phone: t}), 'call-outline', 'phone', '+1 555-0123')}
              </Animated.View>
            )}

            {activeTab === 'Work' && (
              <Animated.View entering={FadeInDown.duration(400)} style={styles.formInner}>
                <Text style={styles.formDescription}>Department and role-specific information.</Text>
                {renderInput('Department', form.department, (t) => setForm({...form, department: t}), 'business-outline', 'dept', 'e.g. Engineering')}
                {renderInput('Professional Role', form.role, (t) => setForm({...form, role: t}), 'ribbon-outline', 'role', 'e.g. Senior Developer')}
                {renderInput('Reporting Manager', form.manager, (t) => setForm({...form, manager: t}), 'people-outline', 'manager', 'e.g. Sarah Jenkins')}
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Employment Status</Text>
                  <View style={styles.modernStatusGrid}>
                    {['Active', 'On Leave', 'Terminated'].map((s) => (
                      <TouchableOpacity
                        key={s}
                        style={[
                          styles.modernStatusBtn,
                          form.status === s && styles.modernStatusBtnActive,
                          form.status === s && { 
                            borderColor: s === 'Active' ? '#22c55e' : (s === 'On Leave' ? '#f59e0b' : '#ef4444'),
                            backgroundColor: s === 'Active' ? '#f0fdf4' : (s === 'On Leave' ? '#fffbeb' : '#fef2f2'),
                          }
                        ]}
                        onPress={() => setForm({...form, status: s as any})}
                      >
                        <View style={[
                          styles.statusDotInner, 
                          { backgroundColor: s === 'Active' ? '#22c55e' : (s === 'On Leave' ? '#f59e0b' : '#ef4444') }
                        ]} />
                        <Text style={[
                          styles.modernStatusText,
                          form.status === s && { color: s === 'Active' ? '#15803d' : (s === 'On Leave' ? '#b45309' : '#b91c1c') }
                        ]}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </Animated.View>
            )}

            {activeTab === 'Financial' && (
              <Animated.View entering={FadeInDown.duration(400)} style={styles.formInner}>
                <Text style={styles.formDescription}>Remuneration and financial data.</Text>
                <View style={styles.salaryActionCard}>
                  <View style={styles.salaryIconCircle}>
                    <Ionicons name="cash" size={24} color="#5a55d2" />
                  </View>
                  <View style={styles.salaryActionInfo}>
                    <Text style={styles.salaryActionTitle}>Current Base Salary</Text>
                    <Text style={styles.salaryActionSubtitle}>Monthly payout in USD</Text>
                  </View>
                </View>
                {renderInput('Annual Salary (USD)', form.salary, (t) => setForm({...form, salary: t}), 'wallet-outline', 'salary', '95,000')}
              </Animated.View>
            )}
          </View>
        </ScrollView>

        {/* Polished Floating Action Footer */}
        <View style={styles.enhancedFooter}>
          <TouchableOpacity style={styles.discardBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.discardBtnText}>Discard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyBtn} onPress={handleSave} activeOpacity={0.8}>
            <View style={styles.applyBtnContent}>
              <Ionicons name="checkmark-done" size={20} color="#fff" />
              <Text style={styles.applyBtnText}>Update Records</Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <HRBottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  helpBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f0ff',
  },
  profileHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f0f0ff',
    shadowColor: '#5a55d2',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatarMain: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#f5f4ff',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#5a55d2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  idBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  idBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6b7280',
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f0f0ff',
  },
  tabItem: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    gap: 4,
  },
  tabItemActive: {
    // No explicit BG for active tab to keep it clean
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#5a55d2',
    fontWeight: '800',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#5a55d2',
  },
  formContentWrapper: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f0f0ff',
    minHeight: 300,
  },
  formInner: {
    flex: 1,
  },
  formDescription: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 22,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4b5563',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#f9f9ff',
    borderRadius: 16,
    backgroundColor: '#f9f9ff',
    height: 56,
    paddingHorizontal: 18,
  },
  inputContainerFocused: {
    borderColor: '#5a55d2',
    backgroundColor: '#fff',
    shadowColor: '#5a55d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  modernStatusGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  modernStatusBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f9f9ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#f9f9ff',
  },
  modernStatusBtnActive: {
    // Styling handled dynamically
  },
  statusDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  modernStatusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6b7280',
  },
  salaryActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f4ff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 24,
    gap: 16,
  },
  salaryIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  salaryActionInfo: {
    flex: 1,
  },
  salaryActionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  salaryActionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  enhancedFooter: {
    position: 'absolute',
    bottom: 110,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 28,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#f0f0ff',
  },
  discardBtn: {
    flex: 1,
    height: 58,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  discardBtnText: {
    color: '#9ca3af',
    fontSize: 15,
    fontWeight: '700',
  },
  applyBtn: {
    flex: 2,
    height: 58,
    borderRadius: 20,
    backgroundColor: '#5a55d2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5a55d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  applyBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  applyBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default EditEmployee;
