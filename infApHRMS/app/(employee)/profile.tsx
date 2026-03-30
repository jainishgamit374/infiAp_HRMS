import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BottomNav } from '../../components/BottomNav';
import { useUser } from '../../context/UserContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/layout/Header';

export default function PersonalProfilePage() {
  const { user } = useUser();

  return (
    <SafeAreaView style={styles.root}>
      {/* New Unified Header */}
      <Header 
        title="My Profile" 
        showBack={true} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Page Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.pageMainTitle}>Personal Profile</Text>
          <Text style={styles.pageSubTitle}>View and manage your personal and professional profile details.</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image 
              source={user.avatar} 
              style={styles.avatar} 
            />
            <View style={styles.statusBadge} />
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileRole}>{user.role}</Text>
          <View style={styles.profileMeta}>
            <Text style={styles.metaLabel}>{user.department}</Text>
            <View style={styles.metaDot} />
            <Text style={styles.metaLabel}>{user.employeeId}</Text>
          </View>
        </View>

        {/* Personal Information Section */}
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
          <View style={styles.singleInfo}>
            <Text style={styles.infoLabel}>ADDRESS</Text>
            <Text style={styles.infoValue}>123, Tech Heights, Bangalore, India</Text>
          </View>
        </View>

        {/* Professional Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="briefcase-outline" size={20} color="#4f46e5" />
            <Text style={styles.sectionHeaderTitle}>PROFESSIONAL INFORMATION</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>DEPARTMENT</Text>
              <Text style={styles.infoValue}>{user.department}</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>ROLE</Text>
              <Text style={styles.infoValue}>{user.role}</Text>
            </View>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>MANAGER</Text>
              <Text style={styles.infoValue}>Arjun Mehta</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>WORK LOCATION</Text>
              <Text style={styles.infoValue}>Hybrid (Bangalore)</Text>
            </View>
          </View>
        </View>

        {/* Activity Feed Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Ionicons name="time-outline" size={20} color="#4f46e5" />
            <Text style={styles.sectionHeaderTitle}>PROFILE ACTIVITY FEED</Text>
          </View>
          <View style={styles.feedList}>
            {[
              { title: 'Address details updated', date: 'Oct 12, 2023 • 11:45 AM', completed: true },
              { title: 'Emergency contact added', date: 'Sep 05, 2023 • 09:20 AM', completed: false },
            ].map((feed, idx) => (
              <View key={idx} style={styles.feedItem}>
                <View style={styles.feedTimeline}>
                  <View style={[styles.feedDot, feed.completed && styles.feedDotActive]} />
                  {idx === 0 && <View style={styles.feedLine} />}
                </View>
                <View style={styles.feedContent}>
                  <Text style={styles.feedTitle}>{feed.title}</Text>
                  <Text style={styles.feedDate}>{feed.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginTop: Platform.OS === 'android' ? 30 : 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
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
  singleInfo: {
    paddingVertical: 12,
  },
  feedList: {
    marginTop: 8,
  },
  feedItem: {
    flexDirection: 'row',
  },
  feedTimeline: {
    alignItems: 'center',
    marginRight: 16,
    width: 12,
  },
  feedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e2e8f0',
    zIndex: 1,
  },
  feedDotActive: {
    backgroundColor: '#4f46e5',
  },
  feedLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 4,
  },
  feedContent: {
    flex: 1,
    paddingBottom: 20,
  },
  feedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  feedDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
