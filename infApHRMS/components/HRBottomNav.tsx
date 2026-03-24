import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue, 
  withTiming 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const NAV_ITEMS = [
  { icon: 'grid-outline', activeIcon: 'grid', label: 'Dashboard', route: '/(hr)' },
  { icon: 'people-outline', activeIcon: 'people', label: 'Employees', route: '/(hr)/employee-management' },
  { icon: 'cash-outline', activeIcon: 'cash', label: 'Finance', route: '/(hr)/finance' },
  { icon: 'settings-outline', activeIcon: 'settings', label: 'Settings', route: '/(hr)/analytics' },
];

const NavItem = ({ item, isActive }: { item: typeof NAV_ITEMS[0], isActive: boolean }) => {
  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={() => router.push(item.route as any)}
    >
      <Ionicons
        name={(isActive ? item.activeIcon : item.icon) as any}
        size={24}
        color={isActive ? '#5a55d2' : '#9ca3af'}
      />
      <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

export const HRBottomNav = () => {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <NavItem item={NAV_ITEMS[0]} isActive={pathname === '/(hr)' || pathname === '/(hr)/'} />
        <NavItem item={NAV_ITEMS[1]} isActive={pathname.includes('employee')} />
        
        {/* Floating Add Button */}
        <View style={styles.fabContainer}>
          <TouchableOpacity 
            style={styles.fab}
            onPress={() => router.push('/(hr)/add-employee' as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        <NavItem item={NAV_ITEMS[2]} isActive={pathname.includes('finance')} />
        <NavItem item={NAV_ITEMS[3]} isActive={pathname.includes('analytics')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    backgroundColor: 'transparent',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: width,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#5a55d2',
  },
  fabContainer: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30, // Negative margin to make it float
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5a55d2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5a55d2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#fff',
  },
});
