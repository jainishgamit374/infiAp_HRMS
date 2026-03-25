import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  interpolateColor
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const NAV_ITEMS = [
  {
    icon: 'grid-outline',
    activeIcon: 'grid',
    label: 'Dashboard',
    route: '/(main-admin)/'
  },
  {
    icon: 'notifications-outline',
    activeIcon: 'notifications',
    label: 'Alerts',
    route: '/(main-admin)/monitoring'
  },
  {
    icon: 'pie-chart-outline',
    activeIcon: 'pie-chart',
    label: 'Analytics',
    route: '/(main-admin)/reports'
  },
  {
    icon: 'server-outline',
    activeIcon: 'server',
    label: 'Services',
    route: '/(main-admin)/integrations'
  },
  {
    icon: 'settings-outline',
    activeIcon: 'settings',
    label: 'Settings',
    route: '/(main-admin)/platform-config'
  },
];

const NavItem = ({ item, isActive }: { item: typeof NAV_ITEMS[0], isActive: boolean }) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withSpring(isActive ? 1.15 : 1);
    opacity.value = withTiming(isActive ? 1 : 0.6);
  }, [isActive]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <TouchableOpacity
      style={styles.navItem}
      onPress={() => router.push(item.route as any)}
      activeOpacity={0.7}
    >
      <Animated.View style={[animatedIconStyle, isActive && styles.iconGlow]}>
        <Ionicons
          name={(isActive ? item.activeIcon : item.icon) as any}
          size={24}
          color={isActive ? '#4f46e5' : '#94a3b8'}
        />
      </Animated.View>
      <Animated.Text style={[styles.navLabel, isActive && styles.navLabelActive, animatedTextStyle]}>
        {item.label}
      </Animated.Text>
      {isActive && (
        <Animated.View
          style={styles.activeIndicator}
        />
      )}
    </TouchableOpacity>
  );
};

export const MainAdminBottomNav = () => {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <View style={styles.floatingNav}>
        {NAV_ITEMS.map((item, i) => {
          const isActive = pathname === item.route ||
            (item.route === '/(main-admin)/' && (pathname === '/(main-admin)' || pathname === '/(main-admin)/'));

          return <NavItem key={i} item={item} isActive={isActive} />;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Platform.OS === 'ios' ? 24 : 0,
    zIndex: 1000,
  },
  floatingNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: width * 0.9,
    height: 70,
    borderRadius: 35,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
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
  activeIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4f46e5',
  },
  iconGlow: {
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  }
});
