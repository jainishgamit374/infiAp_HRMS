import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function CorrectionSuccess() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../../assets/images/logo.png')} 
          style={styles.successLogo} 
          resizeMode="contain"
        />
        {/* Animated Icon */}
        <Animated.View entering={ZoomIn.duration(600).springify()} style={styles.iconContainer}>
          <View style={styles.iconBg}>
            <Ionicons name="checkmark-outline" size={48} color="#22c55e" />
          </View>
        </Animated.View>

        {/* Text */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.textContainer}>
          <Text style={styles.title}>Correction Approved!</Text>
          <Text style={styles.subtitle}>
            The attendance record for <Text style={styles.highlight}>Sneha Desai</Text> has been successfully updated and reflected in the logs.
          </Text>
        </Animated.View>

        {/* Summary Card */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.summaryCard}>
          <Text style={styles.cardHeader}>CORRECTION SUMMARY</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>Oct 24, 2023</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.label}>Requested Correction</Text>
            <Text style={[styles.value, { width: '60%', textAlign: 'right' }]}>06:45 PM (Punch Out)</Text>
          </View>
          <View style={[styles.summaryRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <Text style={styles.label}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Updated</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Footer Actions */}
      <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/(hr)/attendance/corrections')}>
          <Text style={styles.primaryBtnText}>Back to Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/(hr)/attendance/REQ-02' as any)}>
          <Text style={styles.secondaryBtnText}>View Updated Logs</Text>
        </TouchableOpacity>
        <Text style={styles.footerMotto}>INFIAP ENTERPRISE</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  successLogo: {
    width: 150,
    height: 42,
    marginBottom: 32,
  },
  iconContainer: { marginBottom: 32 },
  iconBg: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#f0fdf4', justifyContent: 'center', alignItems: 'center' },
  
  textContainer: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 22 },
  highlight: { fontWeight: '700', color: '#1f2937' },

  summaryCard: { width: '100%', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 20, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 12, elevation: 2 },
  cardHeader: { fontSize: 11, fontWeight: '800', color: '#9ca3af', letterSpacing: 1, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  label: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  value: { fontSize: 13, fontWeight: '700', color: '#111827' },
  statusBadge: { backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 11, fontWeight: '700', color: '#22c55e' },

  footer: { paddingHorizontal: 24, paddingBottom: 40 },
  primaryBtn: { backgroundColor: '#4f46e5', width: '100%', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginBottom: 12, shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  primaryBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  secondaryBtn: { backgroundColor: '#ffffff', width: '100%', paddingVertical: 18, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 32 },
  secondaryBtnText: { color: '#4b5563', fontSize: 15, fontWeight: '700' },
  footerMotto: { fontSize: 11, color: '#9ca3af', textAlign: 'center', fontWeight: '700', letterSpacing: 2 }
});
