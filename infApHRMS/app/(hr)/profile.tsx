import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { HRBottomNav } from '../../components/HRBottomNav';
import { useUser } from '../../context/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/layout/Header';

export default function HRProfilePage() {
  const { user } = useUser();

  return (
    <SafeAreaView style={styles.root}>
      <Header 
        title="HR Profile" 
        showBack={true} 
        onBackPress={() => router.push('/(hr)/' as any)}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.pageMainTitle}>HR Administration Profile</Text>
          <Text style={styles.pageSubTitle}>Manage your account details and administrative preferences.</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image 
              source={user.avatar} 
              style={styles.avatar} 
            />
            <View style={styles.statusBadge} />
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileRole}>HR Manager</Text>
          <View style={styles.profileMeta}>
            <Text style={styles.metaLabel}>{user.department}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaLabel}>{user.employeeId}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="person-outline" size={20} color="#4f46e5" />
            <Text style={styles.sectionHeaderTitle}>PERSONAL INFORMATION</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>FULL NAME</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>JOINING DATE</Text>
              <Text style={styles.infoValue}>{user.joiningDate}</Text>
            </View>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>PHONE</Text>
              <Text style={styles.infoValue}>+91 98765 43210</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>EMAIL</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="shield-outline" size={20} color="#4f46e5" />
            <Text style={styles.sectionHeaderTitle}>ADMINISTRATIVE ACCESS</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>ACCESS LEVEL</Text>
              <Text style={styles.infoValue}>Full HR Permissions</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>COMPLIANCE STATUS</Text>
              <Text style={styles.infoValue}>Certified</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.logoutBtn} 
          onPress={() => router.replace('/(auth)/sign-in')}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out from HR Console</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      <HRBottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  titleSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  pageMainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  pageSubTitle: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#f1f5f9',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#22c55e',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4f46e5',
    marginBottom: 8,
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#94a3b8',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: 0.5,
  },
  infoGrid: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 12,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 8,
    gap: 10,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '800',
  },
});
