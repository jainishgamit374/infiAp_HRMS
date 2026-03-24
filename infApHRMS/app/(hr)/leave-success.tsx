import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function LeaveSuccessScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.push('/(hr)' as any)}>
           <Ionicons name="close" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Success</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Animated.View entering={FadeIn.duration(800)} style={styles.iconContainer}>
          <View style={styles.iconCircleOuter}>
            <View style={styles.iconCircleInner}>
              <Ionicons name="checkmark" size={40} color="#10b981" />
            </View>
          </View>
          {/* Decorative floating dots */}
          <View style={[styles.dot, styles.dotSm, { backgroundColor: '#dcfce7', left: -10, top: 40 }]} />
          <View style={[styles.dot, styles.dotLg, { backgroundColor: '#eef2ff', right: -20, top: -10 }]} />
        </Animated.View>

        {/* Huge Gradient Card simulating the graphic in the screenshot */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.graphicContainer}>
          <LinearGradient
            colors={['#fbbf24', '#fcd34d', '#34d399', '#6ee7b7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientCard}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.textContainer}>
          <Text style={styles.title}>Approvals Successful!</Text>
          <Text style={styles.subtitle}>15 leave requests have been approved and employees have been notified via the InfiAP portal.</Text>
        </Animated.View>

        <Animated.View entering={SlideInDown.delay(400).springify()} style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/(hr)' as any)}>
            <Text style={styles.primaryText}>Back to Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(hr)/leave-history' as any)}>
            <Text style={styles.secondaryText}>View Approval History</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9fb' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  closeBtn: { padding: 8 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 40 },
  
  iconContainer: { position: 'relative', marginBottom: 40 },
  iconCircleOuter: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center' },
  iconCircleInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#10b981' },
  dot: { position: 'absolute', borderRadius: 99 },
  dotSm: { width: 16, height: 16 },
  dotLg: { width: 24, height: 24 },

  graphicContainer: { width: '100%', marginBottom: 40, shadowColor: '#34d399', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.15, shadowRadius: 30, elevation: 10 },
  gradientCard: { width: '100%', aspectRatio: 1.5, borderRadius: 16 },

  textContainer: { alignItems: 'center', marginBottom: 48 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 12 },
  subtitle: { fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 20, paddingHorizontal: 20 },
  
  buttonContainer: { width: '100%', gap: 16 },
  primaryBtn: { width: '100%', height: 56, backgroundColor: '#5a55d2', borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#5a55d2', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8 },
  primaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryBtn: { width: '100%', height: 56, backgroundColor: '#fff', borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  secondaryText: { color: '#4b5563', fontSize: 15, fontWeight: '700' },
});
