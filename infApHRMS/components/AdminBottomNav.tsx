import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

const NAV_ITEMS = [
  { id: 'home', label: 'HOME', icon: 'home-outline', activeIcon: 'home', route: '/(admin)' },
  { id: 'staff', label: 'STAFF', icon: 'people-outline', activeIcon: 'people', route: '/(admin)/staff' },
  { id: 'alerts', label: 'ALERTS', icon: 'notifications-outline', activeIcon: 'notifications', route: '/(admin)/notifications' },
  { id: 'stats', label: 'STATS', icon: 'stats-chart-outline', activeIcon: 'stats-chart', route: '/(admin)/stats' },
  { id: 'admin', label: 'ADMIN', icon: 'shield-outline', activeIcon: 'shield', route: '/(admin)/settings' },
];

export const AdminBottomNav = () => {
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
            <Ionicons
              name={(isActive ? item.activeIcon : item.icon) as any}
              size={24}
              color={isActive ? '#4f46e5' : '#94a3b8'}
            />
            <Text style={[styles.navText, isActive && styles.activeNavText]}>
              {item.label}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
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
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
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
    minWidth: 60,
  },
  navText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  activeNavText: {
    color: '#4f46e5',
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4f46e5',
    marginTop: 2,
  },
});
