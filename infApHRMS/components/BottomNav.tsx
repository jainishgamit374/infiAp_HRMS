import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';

const NAV_ITEMS = [
  { 
    icon: 'home-outline', 
    activeIcon: 'home', 
    label: 'Home', 
    route: '/(employee)/' 
  },
  { 
    icon: 'calendar-outline', 
    activeIcon: 'calendar', 
    label: 'Leave', 
    route: '/(employee)/leave' 
  },
  { 
    icon: 'time-outline', 
    activeIcon: 'time', 
    label: 'Attendance', 
    route: '/(employee)/attendance' 
  },
  { 
    icon: 'person-outline', 
    activeIcon: 'person', 
    label: 'Profile', 
    route: '/(employee)/profile' 
  },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <View style={styles.bottomNav}>
      {NAV_ITEMS.map((item, i) => {
        // Match the current route to determine the active tab
        // Handle trailing slash for index route
        const isActive = pathname === item.route || 
                         (item.route === '/(employee)/' && pathname === '/(employee)') ||
                         (item.route === '/(employee)/leave' && (pathname === '/(employee)/leave' || pathname === '/(employee)/apply-leave')) ||
                         ((item.route === '/(employee)/attendance') && 
                          (pathname === '/(employee)/attendance' || pathname === '/(employee)/attendance-logging' || pathname === '/(employee)/attendance-history'));

        return (
          <TouchableOpacity
            key={i}
            style={styles.navItem}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={(isActive ? item.activeIcon : item.icon) as any}
              size={24}
              color={isActive ? '#4f46e5' : '#94a3b8'}
            />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#4f46e5',
  },
});
