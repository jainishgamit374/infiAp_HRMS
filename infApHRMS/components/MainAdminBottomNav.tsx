import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid-outline', activeIcon: 'grid', route: '/(main-admin)' },
  { id: 'alerts', label: 'Alerts', icon: 'notifications-outline', activeIcon: 'notifications', route: '/(main-admin)/monitoring' },
  { id: 'analytics', label: 'Analytics', icon: 'pie-chart-outline', activeIcon: 'pie-chart', route: '/(main-admin)/reports' },
  { id: 'services', label: 'Services', icon: 'server-outline', activeIcon: 'server', route: '/(main-admin)/integrations' },
  { id: 'settings', label: 'Settings', icon: 'settings-outline', activeIcon: 'settings', route: '/(main-admin)/platform-config' },
];

export const MainAdminBottomNav = () => {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.route;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.navItem}
            onPress={() => router.push(item.route as any)}
          >
            <View style={[styles.iconBox, isActive && styles.activeIconBox]}>
              <Ionicons
                name={(isActive ? item.activeIcon : item.icon) as any}
                size={22}
                color={isActive ? '#4f46e5' : '#64748b'}
              />
            </View>
            <Text style={[styles.navText, isActive && styles.activeNavText]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  iconBox: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  activeIconBox: {
    backgroundColor: '#eef2ff',
  },
  navText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  activeNavText: {
    color: '#4f46e5',
    fontWeight: '700',
  },
});
