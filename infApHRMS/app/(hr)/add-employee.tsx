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
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useHR } from '@/context/HRContext';
import { HRBottomNav } from '@/components/HRBottomNav';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '@/components/layout/Header';
import { useImagePicker } from '@/hooks/useImagePicker';
import { Modal } from 'react-native';

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
    avatarUri: null as string | null,
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { showImagePickerOptions } = useImagePicker();

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    const formatted = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    setForm(prev => ({ ...prev, joiningDate: formatted }));
    setShowDatePicker(false);
  };

  const handlePickImage = () => {
    showImagePickerOptions((uri) => {
      setForm({ ...form, avatarUri: uri });
    });
  };

  const handleAdd = () => {
    if (!form.name || !form.email || !form.role) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }
    
    addEmployee({
      ...form,
      status: 'Active',
      avatar: form.avatarUri || `https://i.pravatar.cc/150?u=${form.name.replace(/\s/g, '')}`,
    });
    
    Alert.alert(
      'Success ✅',
      'Employee Added Successfully',
      [{ text: 'OK', onPress: () => router.push('/(hr)/employee-management' as any) }]
    );
  };

  const renderInput = (label: string, value: string, onChange: (text: string) => void, placeholder: string, icon: string, required = false, isDate = false) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}{required && <Text style={{ color: '#ef4444' }}> *</Text>}</Text>
      <TouchableOpacity 
        style={styles.inputContainer} 
        activeOpacity={isDate ? 0.7 : 1}
        onPress={() => isDate && setShowDatePicker(true)}
      >
        <Ionicons name={icon as any} size={20} color="#9ca3af" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={isDate ? undefined : onChange}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          editable={!isDate}
          onFocus={isDate ? () => setShowDatePicker(true) : undefined}
        />
        {isDate && (
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={20} color="#5a55d2" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header 
        title="Add Employee" 
        showBack={true} 
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Photo Upload Section */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.photoSection}>
            <TouchableOpacity style={styles.photoContainer} onPress={handlePickImage} activeOpacity={0.9}>
              <View style={styles.photoPlaceholder}>
                {form.avatarUri ? (
                  <Image source={{ uri: form.avatarUri }} style={styles.pickedImage} />
                ) : (
                  <View style={styles.emptyAvatar}>
                    <Ionicons name="person" size={48} color="#e2e8f0" />
                  </View>
                )}
                <View style={styles.addBadge}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.uploadText}>{form.avatarUri ? 'Change Profile Photo' : 'Upload Profile Photo'}</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)}>
            {/* Personal Details Card */}
            <View style={styles.formCard}>
              <Text style={styles.sectionHeading}>PERSONAL DETAILS</Text>
              {renderInput('Full Name', form.name, (t) => setForm({...form, name: t}), 'e.g. John Doe', 'person-outline', true)}
              {renderInput('Email Address', form.email, (t) => setForm({...form, email: t}), 'john@company.com', 'mail-outline', true)}
              {renderInput('Phone Number', form.phone, (t) => setForm({...form, phone: t}), '+1 (555) 000-0000', 'call-outline')}
            </View>

            {/* Employment Details Card */}
            <View style={styles.formCard}>
              <Text style={styles.sectionHeading}>EMPLOYMENT DETAILS</Text>
              {renderInput('Department', form.department, (t) => setForm({...form, department: t}), 'Engineering', 'business-outline')}
              {renderInput('Role', form.role, (t) => setForm({...form, role: t}), 'Senior Designer', 'briefcase-outline', true)}
              {renderInput('Joining Date', form.joiningDate, (t) => setForm({...form, joiningDate: t}), 'Select joining date', 'calendar-outline', false, true)}
              {renderInput('Reporting Manager', form.manager, (t) => setForm({...form, manager: t}), 'Search manager...', 'people-outline')}
              {renderInput('Annual Salary', form.salary, (t) => setForm({...form, salary: t}), '$ 95,000', 'cash-outline')}
            </View>

            <View style={styles.footerActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleAdd}>
                <Text style={styles.submitText}>Create Employee</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {showDatePicker && (
            <CustomDatePickerModal
              visible={showDatePicker}
              initialDate={selectedDate}
              onClose={() => setShowDatePicker(false)}
              onConfirm={handleDateConfirm}
            />
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingTop: 10,
    paddingBottom: 120,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 0,
  },
  photoContainer: {
    padding: 4,
    borderRadius: 60,
    backgroundColor: '#fff',
    shadowColor: '#5a55d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  photoPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  emptyAvatar: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 55,
  },
  pickedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 55,
  },
  addBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#5a55d2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerPreview: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  previewText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5a55d2',
  },
  customPickerGrid: {
    flexDirection: 'row',
    height: 200,
    marginBottom: 24,
    gap: 10,
  },
  pickerCol: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  pickerItem: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  pickerItemActive: {
    backgroundColor: '#5a55d2',
  },
  pickerItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  pickerItemTextActive: {
    color: '#fff',
    fontWeight: '800',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryModalBtn: {
    flex: 2,
    backgroundColor: '#5a55d2',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryModalBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryModalBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryModalBtnText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '700',
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

const CustomDatePickerModal = ({ visible, initialDate, onClose, onConfirm }: { visible: boolean, initialDate: Date, onClose: () => void, onConfirm: (date: Date) => void }) => {
  const [date, setDate] = useState(initialDate);
  
  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - 25 + i);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Joining Date</Text>
          
          <View style={styles.pickerPreview}>
            <Text style={styles.previewText}>
              {date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </Text>
          </View>

          <View style={styles.customPickerGrid}>
             {/* Year Selector */}
             <ScrollView style={styles.pickerCol} showsVerticalScrollIndicator={false}>
               {years.map(y => (
                 <TouchableOpacity 
                   key={y} 
                   style={[styles.pickerItem, date.getFullYear() === y && styles.pickerItemActive]} 
                   onPress={() => {
                     const newDate = new Date(date);
                     newDate.setFullYear(y);
                     setDate(newDate);
                   }}
                 >
                   <Text style={[styles.pickerItemText, date.getFullYear() === y && styles.pickerItemTextActive]}>{y}</Text>
                 </TouchableOpacity>
               ))}
             </ScrollView>

             {/* Month Selector */}
             <ScrollView style={styles.pickerCol} showsVerticalScrollIndicator={false}>
               {months.map((m, i) => (
                 <TouchableOpacity 
                   key={m} 
                   style={[styles.pickerItem, date.getMonth() === i && styles.pickerItemActive]} 
                   onPress={() => {
                     const newDate = new Date(date);
                     newDate.setMonth(i);
                     setDate(newDate);
                   }}
                 >
                   <Text style={[styles.pickerItemText, date.getMonth() === i && styles.pickerItemTextActive]}>{m}</Text>
                 </TouchableOpacity>
               ))}
             </ScrollView>

             {/* Day Selector */}
             <ScrollView style={styles.pickerCol} showsVerticalScrollIndicator={false}>
               {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                 <TouchableOpacity 
                   key={d} 
                   style={[styles.pickerItem, date.getDate() === d && styles.pickerItemActive]} 
                   onPress={() => {
                     const newDate = new Date(date);
                     newDate.setDate(d);
                     setDate(newDate);
                   }}
                 >
                   <Text style={[styles.pickerItemText, date.getDate() === d && styles.pickerItemTextActive]}>{d}</Text>
                 </TouchableOpacity>
               ))}
             </ScrollView>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.secondaryModalBtn} onPress={onClose}>
              <Text style={styles.secondaryModalBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryModalBtn} onPress={() => onConfirm(date)}>
              <Text style={styles.primaryModalBtnText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AddEmployee;
