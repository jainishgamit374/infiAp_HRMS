import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AdminBottomNav } from '../../components/AdminBottomNav';

const DOCS = [
  { id: '1', title: 'System Architecture Diagram', level: 'Confidential', date: 'Oct 01' },
  { id: '2', title: 'Network Security Audit', level: 'Restricted', date: 'Sep 24' },
  { id: '3', title: 'Compliance Report Q3', level: 'Internal', date: 'Sep 15' },
];

export default function SecurityDocs() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security Docs</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.warningBox}>
          <Ionicons name="shield-checkmark" size={24} color="#d97706" />
          <Text style={styles.warningText}>Access to these documents is logged and monitored for security purposes.</Text>
        </View>
        {DOCS.map(d => (
          <TouchableOpacity key={d.id} style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons name="lock-closed-outline" size={22} color="#d97706" />
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>{d.title}</Text>
              <View style={styles.meta}>
                <View style={[styles.badge, { backgroundColor: d.level === 'Confidential' ? '#fee2e2' : '#fef3c7' }]}>
                  <Text style={[styles.badgeText, { color: d.level === 'Confidential' ? '#ef4444' : '#d97706' }]}>{d.level}</Text>
                </View>
                <Text style={styles.date}>{d.date}</Text>
              </View>
            </View>
            <Ionicons name="eye-outline" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <AdminBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', paddingTop: Platform.OS === 'ios' ? 50 : 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  scroll: { padding: 20 },
  warningBox: { flexDirection: 'row', gap: 12, backgroundColor: '#fff7ed', padding: 16, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#ffedd5' },
  warningText: { flex: 1, fontSize: 13, color: '#9a3412', fontWeight: '500', lineHeight: 18 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fff7ed', justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, marginLeft: 16 },
  title: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
  date: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
});
