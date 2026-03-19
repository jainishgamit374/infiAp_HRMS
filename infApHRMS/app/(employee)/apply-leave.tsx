import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BottomNav } from '../../components/BottomNav';

export default function ApplyLeave() {
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [notifyManager, setNotifyManager] = useState(true);

  const handleSubmit = () => {
    // Basic validation
    if (!leaveType || !startDate || !endDate || !reason) {
      alert('Please fill in all fields');
      return;
    }
    
    // Success feedback
    alert('Application Submitted Successfully!');
    router.back();
  };

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Apply Leave</Text>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="ellipsis-vertical" size={24} color="#1e293b" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Banner Card */}
          <View style={styles.bannerCard}>
            <View style={styles.bannerIconWrap}>
              <Ionicons name="calendar" size={24} color="#6366f1" />
            </View>
            <View style={styles.bannerTextWrap}>
              <Text style={styles.bannerTitle}>Leave Application</Text>
              <Text style={styles.bannerSub}>Request time off from InfiAP portal</Text>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <Text style={styles.label}>Leave Type</Text>
            <TouchableOpacity style={styles.dropdown} activeOpacity={0.7}>
              <Text style={leaveType ? styles.inputText : styles.placeholderText}>
                {leaveType || 'Select leave category'}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#64748b" />
            </TouchableOpacity>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>Start Date</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="mm/dd/yyyy"
                    placeholderTextColor="#94a3b8"
                    value={startDate}
                    onChangeText={setStartDate}
                  />
                </View>
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>End Date</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="mm/dd/yyyy"
                    placeholderTextColor="#94a3b8"
                    value={endDate}
                    onChangeText={setEndDate}
                  />
                </View>
              </View>
            </View>

            <Text style={styles.label}>Reason for Leave</Text>
            <View style={[styles.inputWrap, styles.textAreaWrap]}>
              <TextInput
                style={styles.textArea}
                placeholder="Please provide details about your request..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={reason}
                onChangeText={setReason}
              />
            </View>
          </View>

          {/* Settings Section */}
          <View style={styles.settingsCard}>
            <View style={styles.settingsIconWrap}>
              <Ionicons name="notifications-outline" size={22} color="#475569" />
            </View>
            <View style={styles.settingsTextWrap}>
              <Text style={styles.settingsTitle}>Notify Manager</Text>
              <Text style={styles.settingsSub}>Send instant alert to your supervisor</Text>
            </View>
            <Switch
              value={notifyManager}
              onValueChange={setNotifyManager}
              trackColor={{ false: '#e2e8f0', true: '#6366f1' }}
              thumbColor={Platform.OS === 'ios' ? '#fff' : notifyManager ? '#fff' : '#f4f3f4'}
            />
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#f59e0b" style={{ marginTop: 2 }} />
            <Text style={styles.infoText}>
              By submitting this form, you agree to follow the InfiAP leave policy. Your manager will receive a notification for approval.
            </Text>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.8}>
              <Ionicons name="send" size={18} color="#fff" />
              <Text style={styles.submitBtnText}>Submit Application</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.draftBtn}>
              <Text style={styles.draftBtnText}>Save as Draft</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>

        <BottomNav />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  scrollContent: {
    padding: 20,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  bannerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerTextWrap: {
    marginLeft: 16,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  bannerSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  formSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 10,
    marginTop: 16,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 54,
  },
  placeholderText: {
    color: '#94a3b8',
    fontSize: 15,
  },
  inputText: {
    color: '#1e293b',
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  halfWidth: {
    width: '48%',
  },
  inputWrap: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 54,
    justifyContent: 'center',
  },
  input: {
    color: '#1e293b',
    fontSize: 15,
  },
  textAreaWrap: {
    height: 120,
    paddingTop: 12,
    justifyContent: 'flex-start',
  },
  textArea: {
    color: '#1e293b',
    fontSize: 15,
    minHeight: 100,
  },
  settingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  settingsIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  settingsTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  settingsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  settingsSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 10,
    marginBottom: 32,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#92400e',
    marginLeft: 10,
    lineHeight: 18,
  },
  submitBtn: {
    backgroundColor: '#5046e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    shadowColor: '#5046e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  draftBtn: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  draftBtnText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
  }
});
