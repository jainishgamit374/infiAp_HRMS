import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AdminBottomNav } from '../../components/AdminBottomNav';

export default function Settings() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [bioEnabled, setBioEnabled] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>System Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>GENERAL CONFIG</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.settingItem}>
            <View style={styles.settingIconBox}>
              <Ionicons name="notifications-outline" size={20} color="#92400e" />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingSub}>Real-time system alerts</Text>
            </View>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingItem}>
            <View style={styles.settingIconBox}>
              <Ionicons name="finger-print-outline" size={20} color="#92400e" />
            </View>
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Biometric Login</Text>
              <Text style={styles.settingSub}>Enable FaceID / Fingerprint</Text>
            </View>
            <Switch value={bioEnabled} onValueChange={setBioEnabled} />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ADMIN TOOLS</Text>
        </View>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="cloud-upload-outline" size={20} color="#92400e" />
          <Text style={styles.menuText}>Database Backup</Text>
          <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Reset System Cache</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
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
  scrollContent: { padding: 20 },
  sectionHeader: { marginTop: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#94a3b8', letterSpacing: 1 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 4, borderWidth: 1, borderColor: '#f1f5f9' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  settingIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center' },
  settingText: { flex: 1, marginLeft: 12 },
  settingTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  settingSub: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginHorizontal: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9' },
  menuText: { flex: 1, fontSize: 15, fontWeight: '700', color: '#1e293b', marginLeft: 12 },
  logoutText: { flex: 1, fontSize: 15, fontWeight: '700', color: '#ef4444', marginLeft: 12 },
});
