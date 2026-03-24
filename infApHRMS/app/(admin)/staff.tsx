import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AdminBottomNav } from '../../components/AdminBottomNav';

const STAFF = [
  { id: '1', name: 'John Doe', role: 'UI/UX Designer', dept: 'Creative', avatar: 'JD' },
  { id: '2', name: 'Sarah Wilson', role: 'Full Stack Dev', dept: 'Engineering', avatar: 'SW' },
  { id: '3', name: 'Michael Chen', role: 'Product Manager', dept: 'Product', avatar: 'MC' },
  { id: '4', name: 'Alex Rivera', role: 'HR Manager', dept: 'Admin', avatar: 'AR' },
];

export default function StaffList() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Staff Directory</Text>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/(admin)/add-employee')}>
          <Ionicons name="person-add-outline" size={22} color="#4f46e5" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {STAFF.map((person, idx) => (
          <Animated.View key={person.id} entering={FadeInDown.delay(idx * 80).springify()} style={styles.staffCard}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>{person.avatar}</Text>
            </View>
            <View style={styles.staffInfo}>
              <Text style={styles.staffName}>{person.name}</Text>
              <Text style={styles.staffRole}>{person.role} • {person.dept}</Text>
            </View>
            <TouchableOpacity style={styles.callBtn}>
              <Ionicons name="call-outline" size={18} color="#4f46e5" />
            </TouchableOpacity>
          </Animated.View>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
      <AdminBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#fff', paddingTop: Platform.OS === 'ios' ? 50 : 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  headerIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  scrollContent: { padding: 20 },
  staffCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  avatarBox: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0e7ff' },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#4f46e5' },
  staffInfo: { flex: 1, marginLeft: 16 },
  staffName: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  staffRole: { fontSize: 13, color: '#64748b', marginTop: 2, fontWeight: '600' },
  callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
});
