import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AdminBottomNav } from '../../components/AdminBottomNav';
import Header from '../../components/layout/Header';

const STAFF = [
  { id: '1', name: 'John Doe', role: 'UI/UX Designer', dept: 'Creative', avatar: 'JD' },
  { id: '2', name: 'Sarah Wilson', role: 'Full Stack Dev', dept: 'Engineering', avatar: 'SW' },
  { id: '3', name: 'Michael Chen', role: 'Product Manager', dept: 'Product', avatar: 'MC' },
  { id: '4', name: 'Alex Rivera', role: 'HR Manager', dept: 'Admin', avatar: 'AR' },
];

export default function StaffList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filteredStaff = STAFF.filter(person => 
    person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Unified Header */}
      <Header 
        title="Staff Directory" 
        showBack={true} 
      />
      {/* Search Bar */}
      <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
        <Ionicons name="search-outline" size={20} color={isFocused ? '#4f46e5' : '#94a3b8'} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search staff members..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#94a3b8"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredStaff.map((person, idx) => (
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
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 5 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 16, backgroundColor: '#f1f5f9', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1.5, borderColor: '#f1f5f9' },
  searchContainerFocused: { borderColor: '#4f46e5', backgroundColor: '#fff' },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1e293b' },
  staffCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  avatarBox: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e0e7ff' },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#4f46e5' },
  staffInfo: { flex: 1, marginLeft: 16 },
  staffName: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  staffRole: { fontSize: 13, color: '#64748b', marginTop: 2, fontWeight: '600' },
  callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
});
