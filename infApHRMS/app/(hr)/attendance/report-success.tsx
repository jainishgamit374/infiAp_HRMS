import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeIn, ZoomIn } from 'react-native-reanimated';

export default function ReportSuccessScreen() {
  return (
    <View style={styles.container}>
      {/* Dynamic Background Pattern */}
      <View style={styles.brandBg} />
      <Animated.View entering={FadeIn.duration(1000)} style={styles.bgGlow} />

      <View style={styles.content}>
        {/* Success Icon Animation */}
        <Animated.View entering={ZoomIn.duration(500).springify()} style={styles.iconContainer}>
          <View style={styles.iconBg}>
            <View style={styles.iconInner}>
              <Ionicons name="document-text" size={48} color="#ffffff" />
            </View>
          </View>
          <View style={styles.checkmarkBadge}>
            <Ionicons name="checkmark" size={16} color="#ffffff" />
          </View>
        </Animated.View>

        {/* Text Content */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.textContainer}>
          <Text style={styles.title}>Report Generated</Text>
          <Text style={styles.subtitle}>
            Your comprehensive attendance report has been successfully generated and is ready to view or download.
          </Text>
        </Animated.View>

        {/* Details Card */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.detailsCard}>
           <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Format</Text>
              <Text style={styles.detailValue}>PDF Document</Text>
           </View>
           <View style={styles.divider} />
           <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time range</Text>
              <Text style={styles.detailValue}>Current Selection</Text>
           </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(400).duration(500)} style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={() => router.replace('/(hr)/attendance/report/new')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>View Report</Text>
            <Ionicons name="arrow-forward" size={18} color="#ffffff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryBtn} 
            onPress={() => router.back()}
            activeOpacity={0.6}
          >
            <Text style={styles.secondaryBtnText}>Back to Reports</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  brandBg: { position: 'absolute', top: 0, left: 0, right: 0, height: Platform.OS === 'ios' ? 250 : 200, backgroundColor: '#f5f4ff', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  bgGlow: { position: 'absolute', top: -50, left: -50, width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(79, 70, 229, 0.05)' },
  content: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  iconContainer: { marginBottom: 32, position: 'relative' },
  iconBg: { width: 120, height: 120, borderRadius: 36, backgroundColor: '#ffffff', shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.15, shadowRadius: 30, elevation: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#f3f4f6' },
  iconInner: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center' },
  checkmarkBadge: { position: 'absolute', bottom: -5, right: -5, width: 32, height: 32, borderRadius: 16, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#ffffff', shadowColor: '#10b981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  textContainer: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#6b7280', textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  detailsCard: { width: '100%', backgroundColor: '#ffffff', borderRadius: 20, padding: 20, marginBottom: 40, borderWidth: 1, borderColor: '#f3f4f6', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: 14, fontWeight: '600', color: '#9ca3af' },
  detailValue: { fontSize: 14, fontWeight: '700', color: '#111827' },
  divider: { height: 1, backgroundColor: '#f3f4f6', marginVertical: 16 },
  actionsContainer: { width: '100%', gap: 16 },
  primaryBtn: { backgroundColor: '#4f46e5', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 18, borderRadius: 16, shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6 },
  primaryBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700', marginRight: 8 },
  secondaryBtn: { backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', paddingVertical: 16 },
  secondaryBtnText: { color: '#6b7280', fontSize: 15, fontWeight: '700' }
});
