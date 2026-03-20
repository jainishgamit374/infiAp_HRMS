import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BottomNav } from '../../components/BottomNav';

const { width } = Dimensions.get('window');

export default function LeaveManagement() {
  const menuItems = [
    {
      id: 'apply',
      title: 'Apply Leave',
      subtitle: 'Submit leave request',
      icon: 'calendar-outline',
      color: '#4f39f6',
      route: '/(employee)/apply-leave',
    },
    {
      id: 'my-leaves',
      title: 'My Leave Applications',
      subtitle: 'View all your leaves',
      icon: 'document-text-outline',
      color: '#4f39f6',
      route: '/(employee)/my-leaves',
    },
    {
      id: 'approvals',
      title: 'Leave Approvals',
      subtitle: 'Approve/reject leaves',
      icon: 'checkmark-circle-outline',
      color: '#4f39f6',
      route: '/(employee)/leave-approvals',
    },
  ];

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave Management</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Central Icon Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconCircle}>
            <Ionicons name="calendar" size={40} color="#4f39f6" />
          </View>
          <Text style={styles.heroTitle}>Leave Management</Text>
          <Text style={styles.heroSubtitle}>Manage time off • 3 features</Text>
        </View>

        {/* Menu Cards */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              activeOpacity={0.7}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.cardLeft}>
                <View style={[styles.iconBox, { backgroundColor: `${item.color}10` }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

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
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#4f39f6', // user requested theme color
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'serif', // Trying to match the font style
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  heroIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#eef2ff', // Light purple tint
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'serif',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  menuContainer: {
    gap: 16,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardInfo: {
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
});
