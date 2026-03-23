import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CreateNotification() {
  const [scheduled, setScheduled] = useState(false);
  const [audience, setAudience] = useState('All Employees');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Notification</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="ellipsis-vertical" size={24} color="#1e293b" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Form Fields */}
        <View style={styles.section}>
          <Text style={styles.label}>NOTIFICATION TITLE</Text>
          <TextInput
            placeholder="e.g. Annual Policy Update 2024"
            placeholderTextColor="#94a3b8"
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>CATEGORY</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Select Category</Text>
            <Ionicons name="chevron-down" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>MESSAGE BODY</Text>
          <TextInput
            placeholder="Type your message here... Employees will receive this as a push notification."
            placeholderTextColor="#94a3b8"
            style={styles.textArea}
            multiline
            numberOfLines={6}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>AUDIENCE SELECTION</Text>
          {['All Employees', 'Specific Department', 'Specific Employee(s)'].map((opt) => (
            <TouchableOpacity 
              key={opt}
              style={styles.radioItem}
              onPress={() => setAudience(opt)}
            >
              <View style={[styles.radio, audience === opt && styles.radioActive]}>
                {audience === opt && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Schedule */}
        <View style={styles.scheduleRow}>
          <View style={styles.scheduleInfo}>
            <Ionicons name="time-outline" size={20} color="#4f46e5" />
            <Text style={styles.scheduleTitle}>Schedule for Later</Text>
          </View>
          <Switch
            value={scheduled}
            onValueChange={setScheduled}
            trackColor={{ false: '#e2e8f0', true: '#4f46e5' }}
          />
        </View>

        {scheduled && (
          <View style={styles.dateRow}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>DATE</Text>
              <TouchableOpacity style={styles.dateBox}>
                <Text style={styles.dateText}>10/25/2024</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>TIME</Text>
              <TouchableOpacity style={styles.dateBox}>
                <Text style={styles.dateText}>09:00 AM</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Actions */}
        <TouchableOpacity style={styles.sendBtn} onPress={() => router.back()}>
          <Ionicons name="send-outline" size={20} color="#fff" />
          <Text style={styles.sendBtnText}>Send Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Draft</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'android' ? 30 : 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    height: 54,
    fontSize: 15,
    color: '#1e293b',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    height: 54,
  },
  dropdownText: {
    fontSize: 15,
    color: '#94a3b8',
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    height: 140,
    fontSize: 15,
    color: '#1e293b',
    textAlignVertical: 'top',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
    gap: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: '#4f46e5',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4f46e5',
  },
  radioLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    marginBottom: 8,
  },
  dateBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 14,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  sendBtn: {
    backgroundColor: '#4f46e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderRadius: 16,
    gap: 10,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  sendBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  saveBtn: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
});
