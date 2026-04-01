import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { router, usePathname } from 'expo-router';
import { useSidebar } from '../../context/SidebarContext';
import { useUser } from '../../context/UserContext';
// import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

const MENU_CONFIG = {
  employee: [
    { icon: 'grid-outline', label: 'Dashboard', route: '/(employee)/' },
    { icon: 'person-outline', label: 'My Profile', route: '/(employee)/profile' },
    { icon: 'calendar-outline', label: 'Leave Management', route: '/(employee)/leave' },
    { icon: 'time-outline', label: 'Attendance', route: '/(employee)/attendance' },
    { icon: 'cash-outline', label: 'Payroll', route: '/(employee)/payroll' },
    { icon: 'trending-up-outline', label: 'Performance', route: '/(employee)/performance' },
    { icon: 'notifications-outline', label: 'Notifications', route: '/(employee)/notifications' },
    { icon: 'settings-outline', label: 'Settings', route: '/(employee)/profile-settings' },
  ],
  hr: [
    { icon: 'grid-outline', label: 'Dashboard', route: '/(hr)/' },
    { icon: 'person-outline', label: 'My Profile', route: '/(hr)/profile' },
    { icon: 'people-outline', label: 'Employees', route: '/(hr)/employee-management' },
    { icon: 'calendar-outline', label: 'Leaves', route: '/(hr)/leave' },
    { icon: 'time-outline', label: 'Attendance', route: '/(hr)/attendance' },
    { icon: 'briefcase-outline', label: 'Recruitment', route: '/(hr)/recruitment' },
    { icon: 'cash-outline', label: 'Finance', route: '/(hr)/finance' },
    { icon: 'settings-outline', label: 'Analytics', route: '/(hr)/analytics' },
  ],
  admin: [
    { icon: 'grid-outline', label: 'Dashboard', route: '/(admin)/' },
    { icon: 'person-outline', label: 'My Profile', route: '/(admin)/profile' },
    { icon: 'business-outline', label: 'Departments', route: '/(admin)/departments' },
    { icon: 'people-outline', label: 'User Management', route: '/(admin)/users' },
    { icon: 'settings-outline', label: 'System Settings', route: '/(admin)/settings' },
    { icon: 'shield-outline', label: 'Security', route: '/(admin)/security' },
    { icon: 'notifications-outline', label: 'Notifications', route: '/(admin)/notifications' },
  ]
};

const Sidebar = () => {
  const { isOpen, closeSidebar } = useSidebar();
  const { user } = useUser();
  const pathname = usePathname();
  const translateX = useSharedValue(-SIDEBAR_WIDTH);

  const menuItems = MENU_CONFIG[user.systemRole] || MENU_CONFIG.employee;

  useEffect(() => {
    translateX.value = withSpring(isOpen ? 0 : -SIDEBAR_WIDTH, {
      damping: 20,
      stiffness: 100,
    });
  }, [isOpen]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SIDEBAR_WIDTH, 0],
      [0, 1],
      Extrapolate.CLAMP
    ),
    display: translateX.value === -SIDEBAR_WIDTH ? 'none' : 'flex' as any,
  }));

  const handleNavigate = (route: string) => {
    closeSidebar();
    router.push(route as any);
  };

  return (
    <>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={styles.flex1} onPress={closeSidebar} />
      </Animated.View>

      <Animated.View style={[styles.sidebar, animatedStyle]}>
        <View style={styles.header}>
          <View style={styles.logoAndName}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.appName}>infiAp HRMS</Text>
              <Text style={styles.appTagline}>Modern Workforce</Text>
            </View>
          </View>
          <TouchableOpacity onPress={closeSidebar} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.userProfile}
          onPress={() => handleNavigate(`/${user.systemRole === 'admin' ? '(admin)' : user.systemRole === 'hr' ? '(hr)' : '(employee)'}/profile` as any)}
        >
           <Image source={user.avatar} style={styles.userAvatar} />
           <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userRole}>{user.role}</Text>
           </View>
           <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
        </TouchableOpacity>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => {
            const isActive = pathname === item.route || (item.route === `/${user.systemRole === 'admin' ? '(admin)' : user.systemRole === 'hr' ? '(hr)' : '(employee)'}/` && (pathname === `/${user.systemRole === 'admin' ? '(admin)' : user.systemRole === 'hr' ? '(hr)' : '(employee)'}` || pathname === `/${user.systemRole === 'admin' ? '(admin)' : user.systemRole === 'hr' ? '(hr)' : '(employee)'}/`));
            return (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, isActive && styles.activeMenuItem]}
                onPress={() => handleNavigate(item.route)}
              >
                <View style={[styles.iconWrap, isActive && styles.activeIconWrap]}>
                  <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={isActive ? '#4f46e5' : '#64748b'}
                  />
                </View>
                <Text style={[styles.menuLabel, isActive && styles.activeMenuLabel]}>
                  {item.label}
                </Text>
                {isActive && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutBtn} onPress={() => {
            closeSidebar();
            router.replace('/(auth)/sign-in');
          }}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>v1.0.0 (Pre-Alpha)</Text>
        </View>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 9998,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#fff',
    zIndex: 9999,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  logoAndName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 100,
    height: 32,
  },
  appName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  appTagline: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
  },
  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
    backgroundColor: '#f8fafc',
    marginHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 16,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  userRole: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  activeMenuItem: {
    backgroundColor: '#4f46e510',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activeIconWrap: {
    backgroundColor: '#4f46e515',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    flex: 1,
  },
  activeMenuLabel: {
    color: '#4f46e5',
    fontWeight: '700',
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4f46e5',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ef4444',
  },
  versionText: {
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default Sidebar;
