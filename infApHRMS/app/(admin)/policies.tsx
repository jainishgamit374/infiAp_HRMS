import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { AdminBottomNav } from '../../components/AdminBottomNav';
import Header from '../../components/layout/Header';

const POLICIES = [
  { id: '1', title: 'Employee Handbook 2023', date: 'Oct 12, 2023', size: '2.4 MB' },
  { id: '2', title: 'Leave & Attendance Policy', date: 'Sep 05, 2023', size: '1.1 MB' },
  { id: '3', title: 'Data Privacy Policy', date: 'Jul 20, 2023', size: '3.5 MB' },
  { id: '4', title: 'Code of Conduct', date: 'Jan 15, 2023', size: '1.8 MB' },
];

export default function Policies() {
  return (
    <View style={styles.container}>
      <Header 
        title="Company Policies"
        showBack={true}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        {POLICIES.map(p => (
          <TouchableOpacity key={p.id} style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons name="document-text-outline" size={24} color="#f59e0b" />
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>{p.title}</Text>
              <Text style={styles.sub}>{p.date} • {p.size}</Text>
            </View>
            <Ionicons name="download-outline" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <AdminBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  scroll: { padding: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 20, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center' },
  info: { flex: 1, marginLeft: 16 },
  title: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  sub: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
});
