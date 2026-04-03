import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BottomNav } from '../../components/BottomNav';
import { useNotifications } from '../../context/NotificationContext';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS, withTiming, withDelay, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/layout/Header';
import { useUser } from '../../context/UserContext';

// Helper for dates
const TODAY = new Date();
const FORMAT_DATE = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();

// Mock SVGs / Images using Ionicons and Views
const CircularProgress = ({ value, total, color, label, subLabel }: { value: number, total: number, color: string, label: string, subLabel: string }) => {
  // A simple representation since SVG isn't available out of the box
  return (
    <View style={styles.leaveCard}>
      <View style={[styles.progressCircle, { borderColor: `${color}33` }]}>
        <View style={[styles.progressCircleInner, {
          borderTopColor: color,
          borderRightColor: color,
          borderBottomColor: value > total / 2 ? color : 'transparent',
          borderLeftColor: value > total * 0.75 ? color : 'transparent',
          transform: [{ rotate: '-45deg' }]
        }]} />
        <Text style={styles.progressValueText}>{value}</Text>
      </View>
      <Text style={styles.leaveTypeLabel}>{label}</Text>
      <Text style={styles.leaveTypeSub}>{subLabel}</Text>
    </View>
  );
};

// Swipe to Check-in Component
const SwipeToCheckIn = () => {
  const SWIPE_WIDTH = width - 72; // Dynamic width: window width - screen padding (40) - card padding (32)
  const KNOB_SIZE = 48;
  const MAX_TRANSLATE = SWIPE_WIDTH - KNOB_SIZE - 8;

  const translateX = useSharedValue(0);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [time, setTime] = useState('09:02 AM');

  const handleToggle = () => {
    const newStatus = !isCheckedIn;
    setIsCheckedIn(newStatus);
    const now = new Date();
    setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    // Reset knob after short delay
    setTimeout(() => {
      translateX.value = withTiming(0);
    }, 500);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = Math.max(0, Math.min(event.translationX, MAX_TRANSLATE));
    })
    .onEnd(() => {
      if (translateX.value > MAX_TRANSLATE * 0.8) {
        translateX.value = withSpring(MAX_TRANSLATE);
        runOnJS(handleToggle)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedKnobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: 1 - translateX.value / (MAX_TRANSLATE * 0.5),
  }));

  return (
    <View style={styles.swipeContainer}>
      <GestureDetector gesture={panGesture}>
        <View style={[styles.swipeTrack, isCheckedIn && styles.swipeTrackSuccess]}>
          <Animated.View style={[styles.swipeTextContainer, animatedTextStyle]}>
            <Text style={[styles.swipeText, isCheckedIn && { color: '#059669', marginLeft: 10 }]}>
              {isCheckedIn ? 'SWIPE TO CHECK-OUT' : 'SWIPE TO CHECK-IN'}
            </Text>
          </Animated.View>
          <Animated.View style={[styles.swipeKnob, animatedKnobStyle, isCheckedIn && styles.swipeKnobSuccess]}>
            <Ionicons name={isCheckedIn ? "log-out-outline" : "log-in-outline"} size={22} color="#fff" />
          </Animated.View>
        </View>
      </GestureDetector>

      <View style={styles.swipeFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="time-outline" size={14} color={isCheckedIn ? "#059669" : "#22c55e"} />
          <Text style={styles.footerText}>{isCheckedIn ? 'Checked in at' : 'Last check'}: {time}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="location-outline" size={14} color="#3b82f6" />
          <Text style={styles.footerText}>Mumbai Office</Text>
        </View>
      </View>
    </View>
  );
};


const FeatureCard = ({ icon, title, sub, color, bgColor, route, delay, unreadCount }: { icon: any, title: string, sub: string, color: string, bgColor: string, route: string, delay: number, unreadCount?: number }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={animatedStyle}>
      <TouchableOpacity
        style={[styles.featureCard, { backgroundColor: bgColor }]}
        onPress={() => router.push(route as any)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <View style={[styles.featureIconWrap, { backgroundColor: color }]}>
          <Ionicons name={icon} size={24} color="#fff" />
          {title === 'Notifications' && unreadCount !== undefined && unreadCount > 0 && (
            <View style={styles.notiBadge}>
              <Text style={styles.notiBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureSub}>{sub}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};


export default function EmployeeDashboard() {
  const { user } = useUser();
  const { notifications } = useNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollIndex = useRef(0);
  const totalItems = 4;
  const itemWidth = 212;

  useEffect(() => {
    const timer = setInterval(() => {
      if (scrollViewRef.current) {
        scrollIndex.current = (scrollIndex.current + 1) % totalItems;
        scrollViewRef.current.scrollTo({
          x: scrollIndex.current * itemWidth,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.root}>
        <Animated.View entering={FadeInDown.duration(800).springify()} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

            {/* Header */}
            <Header 
              title="Employee Dashboard"
            />

            <View style={styles.contentPadding}>

            {/* Welcome Banner */}
            <View style={styles.bannerContainer}>
              <View style={styles.bannerBadge}>
                <Text style={styles.bannerBadgeText}>JAN 28, 2026</Text>
              </View>
              <Text style={styles.bannerTitle}>Welcome, Sneha Desai!</Text>
              <Text style={styles.bannerSubtitle}>
                Sneha Desai joined the Engineering team on Jan 20, 2026. Let's give her a warm welcome!
              </Text>
              <TouchableOpacity style={styles.sendWelcomeBtn}>
                <Text style={styles.sendWelcomeText}>Send Welcome </Text>
                <Ionicons name="paper-plane" size={12} color="#2e4ce6" />
              </TouchableOpacity>
            </View>

            {/* Check-In Section */}
            <Text style={styles.sectionHeader}>Check-In</Text>
            <SwipeToCheckIn />

            {/* Leave Balance Section */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeader}>Leave Balance</Text>
              <TouchableOpacity>
                <Text style={styles.historyLink}>History</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.leaveGrid}>
              <CircularProgress value={6} total={10} color="#3b82f6" label="Privilege Leave" subLabel="AVAILABLE" />
              <CircularProgress value={6} total={10} color="#6366f1" label="Casual Leave" subLabel="AVAILABLE" />
              <CircularProgress value={6} total={10} color="#22c55e" label="Sick Leave" subLabel="AVAILABLE" />
              <View style={[styles.leaveCard, styles.darkCard]}>
                <View style={styles.darkCircle}>
                  <Text style={styles.darkCircleValue}>18</Text>
                </View>
                <Text style={[styles.leaveTypeLabel, { color: '#fff' }]}>Total Balance</Text>
                <Text style={styles.leaveTypeSubDark}>DAYS</Text>
              </View>
            </View>

            <View style={styles.statsRowGrid}>
              <View style={styles.statBadge}>
                <View style={styles.statBadgeContent}>
                  <Text style={styles.statBadgeLabel}>EARLY OUT RECORD</Text>
                  <Text style={styles.statBadgeValue}>0</Text>
                </View>
              </View>
              <View style={[styles.statBadge, { backgroundColor: '#fef3c7', borderColor: '#fde68a' }]}>
                <View style={styles.statBadgeContent}>
                  <Text style={styles.statBadgeLabel}>LATE IN</Text>
                  <Text style={[styles.statBadgeValue, { color: '#d97706' }]}>0/5</Text>
                </View>
              </View>
              <View style={styles.statBadge}>
                <View style={styles.statBadgeContent}>
                  <Text style={styles.statBadgeLabel}>EARLY OUT</Text>
                  <Text style={styles.statBadgeValue}>0/5</Text>
                </View>
              </View>
              <View style={styles.statBadge}>
                <View style={styles.statBadgeContent}>
                  <Text style={styles.statBadgeLabel}>HALF DAY</Text>
                  <Text style={styles.statBadgeValue}>0</Text>
                </View>
              </View>
            </View>

            {/* Attendance Summary */}
            <Text style={styles.sectionHeader}>Attendance Summary</Text>
            <View style={styles.attendanceSummaryContainer}>
              <View style={styles.attendanceItem}>
                <View style={[styles.attIconWrap, { backgroundColor: '#dcfce7' }]}>
                  <Ionicons name="person-circle" size={24} color="#22c55e" />
                </View>
                <Text style={styles.attNumber}>22</Text>
                <Text style={styles.attLabel}>PRESENT</Text>
              </View>
              <View style={styles.attendanceItem}>
                <View style={[styles.attIconWrap, { backgroundColor: '#fee2e2' }]}>
                  <Ionicons name="calendar" size={20} color="#ef4444" />
                </View>
                <Text style={styles.attNumber}>2</Text>
                <Text style={styles.attLabel}>LEAVES</Text>
              </View>
              <View style={styles.attendanceItem}>
                <View style={[styles.attIconWrap, { backgroundColor: '#dbeafe' }]}>
                  <Ionicons name="umbrella" size={20} color="#3b82f6" />
                </View>
                <Text style={styles.attNumber}>1</Text>
                <Text style={styles.attLabel}>HOLIDAY</Text>
              </View>
            </View>
            {/* Quick Features Section */}
            <Text style={styles.sectionHeader}>Quick Actions</Text>
            <View style={styles.featuresGrid}>
              <FeatureCard
                icon="calendar-outline"
                title="Leave Requests"
                sub="Manage"
                color="#3b82f6"
                bgColor="#eff6ff"
                route="/(employee)/leave"
                delay={100}
              />
              <FeatureCard
                icon="laptop-outline"
                title="Upcoming WFH"
                sub="Schedule"
                color="#8b5cf6"
                bgColor="#f5f3ff"
                route="/(employee)/upcoming-wfh"
                delay={200}
              />
              <FeatureCard
                icon="megaphone-outline"
                title="Events"
                sub="Explore"
                color="#f97316"
                bgColor="#fff7ed"
                route="/(employee)/events"
                delay={300}
              />
              <FeatureCard
                icon="cash-outline"
                title="Payroll"
                sub="Salary Slips"
                color="#4f46e5"
                bgColor="#f5f3ff"
                route="/(employee)/payroll"
                delay={400}
              />
              <FeatureCard
                icon="trending-up-outline"
                title="Performance"
                sub="Metrics"
                color="#6366f1"
                bgColor="#f5f3ff"
                route="/(employee)/performance"
                delay={500}
              />
              <FeatureCard
                icon="notifications-outline"
                title="Notifications"
                sub="Alerts"
                color="#ef4444"
                bgColor="#fef2f2"
                route="/(employee)/notifications"
                delay={600}
                unreadCount={unreadCount}
              />
            </View>

            {/* Missed Punches Carousel */}
            <Text style={[styles.sectionHeader, { marginTop: 12, marginBottom: 16 }]}>Missed Punches</Text>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.missedPunchesCarousel}
              snapToInterval={212} // card width (200) + gap (12)
              decelerationRate="fast"
            >
              <View style={styles.missedPunchCard}>
                <View style={styles.missedPunchRow}>
                  <Text style={styles.missedPunchDate}>Mar 2, 2026</Text>
                  <Ionicons name="warning-outline" size={16} color="#ef4444" />
                </View>
                <Text style={styles.missedPunchTitle}>Missing Out</Text>
                <Text style={styles.missedPunchAction}>APPLY PUNCH</Text>
              </View>
              <View style={styles.missedPunchCard}>
                <View style={styles.missedPunchRow}>
                  <Text style={styles.missedPunchDate}>Mar 3, 2026</Text>
                  <Ionicons name="warning-outline" size={16} color="#ef4444" />
                </View>
                <Text style={styles.missedPunchTitle}>Missing Out</Text>
                <Text style={styles.missedPunchAction}>APPLY PUNCH</Text>
              </View>
              <View style={styles.missedPunchCard}>
                <View style={styles.missedPunchRow}>
                  <Text style={styles.missedPunchDate}>Mar 4, 2026</Text>
                  <Ionicons name="warning-outline" size={16} color="#ef4444" />
                </View>
                <Text style={styles.missedPunchTitle}>Missing Out</Text>
                <Text style={styles.missedPunchAction}>APPLY PUNCH</Text>
              </View>
              <View style={styles.missedPunchCard}>
                <View style={styles.missedPunchRow}>
                  <Text style={styles.missedPunchDate}>Mar 5, 2026</Text>
                  <Ionicons name="warning-outline" size={16} color="#ef4444" />
                </View>
                <Text style={styles.missedPunchTitle}>Missing Out</Text>
                <Text style={styles.missedPunchAction}>APPLY PUNCH</Text>
              </View>
            </ScrollView>


            {/* Employee of the Month */}
            <View style={styles.eomCard}>
              <View style={styles.eomContent}>
                <View style={styles.eomAvatarWrap}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' }}
                    style={styles.eomAvatar}
                  />
                  <View style={styles.eomBadge}>
                    <Ionicons name="star" size={10} color="#fff" />
                  </View>
                </View>
                <View>
                  <Text style={styles.eomLabel}>EMPLOYEE OF THE MONTH</Text>
                  <Text style={styles.eomName}>Siddharth Rao</Text>
                  <Text style={styles.eomRole}>Senior Product Designer</Text>
                </View>
              </View>
              {/* background watermark star */}
              <Ionicons name="ribbon" size={100} color="rgba(255,255,255,0.05)" style={styles.eomWatermark} />
            </View>

            {/* Birthdays */}
            <View style={styles.birthdayCard}>
              <View style={styles.birthdayHeader}>
                <Text style={styles.birthdayTitle}>Birthdays</Text>
                <View style={styles.birthdayTag}>
                  <Text style={styles.birthdayTagText}>3 This Week</Text>
                </View>
              </View>
              <View style={styles.avatarsRow}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop' }} style={[styles.avatarOverlap, { zIndex: 3 }]} />
                <Image source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop' }} style={[styles.avatarOverlap, { zIndex: 2, marginLeft: -12 }]} />
                <Image source={{ uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&h=50&fit=crop' }} style={[styles.avatarOverlap, { zIndex: 1, marginLeft: -12 }]} />
                <View style={[styles.avatarOverlap, styles.avatarMore, { marginLeft: -12 }]}>
                  <Text style={styles.avatarMoreText}>+3</Text>
                </View>
              </View>
            </View>
          </View>
          </ScrollView>
        </Animated.View>
        <BottomNav />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    paddingBottom: 140,
  },
  contentPadding: {
    paddingHorizontal: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Banner
  bannerContainer: {
    backgroundColor: '#2e4ce6',
    borderRadius: 20,
    padding: 24,
    marginTop: 10,
    marginBottom: 16,
    shadowColor: '#2e4ce6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  bannerBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  bannerBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  sendWelcomeBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sendWelcomeText: {
    color: '#2e4ce6',
    fontWeight: '700',
    fontSize: 13,
  },

  // Typography Elements
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 8,
  },
  historyLink: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 13,
  },

  // Swipe Card
  swipeContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  swipeTrack: {
    width: width - 72,
    height: 56,
    backgroundColor: '#f8fafc',
    borderRadius: 28,
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  swipeTrackSuccess: {
    backgroundColor: '#dcfce7',
    borderColor: '#bbf7d0',
  },
  swipeKnob: {
    width: 48,
    height: 48,
    backgroundColor: '#2e4ce6',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 4,
    shadowColor: '#2e4ce6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  swipeKnobSuccess: {
    backgroundColor: '#22c55e',
    shadowColor: '#22c55e',
  },
  swipeTextContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeText: {
    color: '#94a3b8',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
    marginLeft: 30, // Offset for the knob
  },
  swipeFooter: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 24,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '500',
  },

  // Leave Balance Grid
  leaveGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  leaveCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  darkCard: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  progressCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  progressCircleInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    ...StyleSheet.absoluteFillObject,
    left: -4, top: -4,
  },
  progressValueText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  leaveTypeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
    textAlign: 'center',
  },
  leaveTypeSub: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  darkCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  darkCircleValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
  },
  leaveTypeSubDark: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Stats Grid Mini
  statsRowGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statBadge: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 16,
    width: '48%',
    padding: 4,
  },
  statBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  statBadgeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    flex: 1,
  },
  statBadgeValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1e293b',
    marginLeft: 8,
  },

  // Attendance Summary
  attendanceSummaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  attendanceItem: {
    alignItems: 'center',
    width: '30%',
  },
  attIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  attNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
  },
  attLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 0.5,
  },

  // Missed Punches Carousel
  missedPunchesCarousel: {
    paddingRight: 20, // To allow the last card to be centered or at least have some space
    gap: 12,
    paddingBottom: 24,
  },
  missedPunchCard: {
    width: 200,
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#fee2e2',
    borderRadius: 16,
    padding: 16,
    // Add shadow to make it pop more in the carousel
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  missedPunchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  missedPunchDate: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ef4444',
  },
  missedPunchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  missedPunchAction: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1e293b',
  },

  // Approvals List
  listCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  listIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listItemBody: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  listItemSub: {
    fontSize: 12,
    color: '#64748b',
  },
  listDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },

  // Features Grid
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  featureCard: {
    width: (width - 52) / 2, // 20 padding * 2 + 12 gap = 52
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  featureIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
    textAlign: 'center',
  },
  featureSub: {
    fontSize: 9,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  notiBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notiBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
  },

  // Employee of the Month
  eomCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  eomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  eomAvatarWrap: {
    position: 'relative',
    marginRight: 16,
  },
  eomAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  eomBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    backgroundColor: '#6366f1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  eomLabel: {
    color: '#6366f1',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  eomName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  eomRole: {
    color: '#94a3b8',
    fontSize: 12,
  },
  eomWatermark: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    zIndex: 1,
    transform: [{ rotate: '-15deg' }],
  },

  // Birthdays
  birthdayCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  birthdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  birthdayTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  birthdayTag: {
    backgroundColor: '#fdf2f8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  birthdayTagText: {
    color: '#db2777',
    fontSize: 10,
    fontWeight: '700',
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarOverlap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarMore: {
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarMoreText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
  },
  birthdayMsg: {
    fontSize: 13,
    color: '#64748b',
  },
});
