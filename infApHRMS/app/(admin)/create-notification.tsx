import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AdminBottomNav } from '../../components/AdminBottomNav';
import Header from '../../components/layout/Header';

export default function CreateNotification() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const handleSend = () => {
    if(!title || !desc) return;
    alert('Announcement broadcasted successfully to all employees!');
    router.back();
  };

  return (
    <View style={styles.container}>
      <Header 
        title="New Broadcast"
        showBack={true}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>CATEGORY</Text>
            <View style={styles.categoryRow}>
              {['Announcement', 'Policy', 'Alert'].map(c => (
                <TouchableOpacity key={c} style={[styles.catTab, c === 'Announcement' && styles.catActive]}>
                  <Text style={[styles.catText, c === 'Announcement' && styles.catTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>TITLE</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. Q4 Strategy Meeting" 
              placeholderTextColor="#94a3b8"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>DESCRIPTION</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Write your message here..." 
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              value={desc}
              onChangeText={setDesc}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>TARGET AUDIENCE</Text>
            <TouchableOpacity style={styles.selector}>
              <Text style={styles.selectorText}>All Employees</Text>
              <Ionicons name="chevron-down" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Ionicons name="send" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.sendText}>Send Broadcast</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <AdminBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  scroll: { padding: 24 },
  formGroup: { marginBottom: 24 },
  label: { fontSize: 12, fontWeight: '800', color: '#94a3b8', marginBottom: 10, letterSpacing: 0.5 },
  categoryRow: { flexDirection: 'row', gap: 10 },
  catTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: '#f1f5f9' },
  catActive: { backgroundColor: '#4f46e5' },
  catText: { fontSize: 13, fontWeight: '700', color: '#64748b' },
  catTextActive: { color: '#fff' },
  input: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 16, fontSize: 16, color: '#1e293b', borderWidth: 1, borderColor: '#e2e8f0' },
  textArea: { height: 120, textAlignVertical: 'top' },
  selector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  selectorText: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  sendBtn: { backgroundColor: '#4f46e5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 18, marginTop: 10, shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  sendText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
