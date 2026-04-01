import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInRight, FadeInLeft, ZoomIn } from 'react-native-reanimated';
import { AdminBottomNav } from '../../components/AdminBottomNav';
import Header from '../../components/layout/Header';

const { width } = Dimensions.get('window');

const STEPS = [
  { id: 1, title: 'Period', icon: 'calendar-outline' },
  { id: 2, title: 'Verify', icon: 'people-outline' },
  { id: 3, title: 'Review', icon: 'receipt-outline' },
  { id: 4, title: 'Done', icon: 'checkmark-circle-outline' },
];

export default function PayslipGeneration() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    else router.push('/(admin)/payroll');
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Animated.View entering={FadeInRight} style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Payroll Period</Text>
            <Text style={styles.stepSub}>Select the month and year to generate slips for.</Text>
            <TouchableOpacity style={styles.selector}>
              <Text style={styles.selectorText}>October 2023</Text>
              <Ionicons name="chevron-down" size={20} color="#64748b" />
            </TouchableOpacity>
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View entering={FadeInRight} style={styles.stepContent}>
            <Text style={styles.stepTitle}>Verify Employees</Text>
            <Text style={styles.stepSub}>248 employees selected for this run.</Text>
            <View style={styles.listPlaceholder}>
              {[1, 2, 3].map(i => (
                <View key={i} style={styles.listItem}>
                  <View style={styles.circle} />
                  <View style={styles.line} />
                </View>
              ))}
              <Text style={styles.moreText}>+ 245 others</Text>
            </View>
          </Animated.View>
        );
      case 3:
        return (
          <Animated.View entering={FadeInRight} style={styles.stepContent}>
            <Text style={styles.stepTitle}>Financial Review</Text>
            <Text style={styles.stepSub}>Global totals for the selected period.</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}><Text style={styles.summaryLab}>Total Earnings</Text><Text style={styles.summaryVal}>$248,500</Text></View>
              <View style={styles.summaryRow}><Text style={styles.summaryLab}>Total Deductions</Text><Text style={[styles.summaryVal, { color: '#ef4444' }]}>-$42,000</Text></View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}><Text style={styles.totalLab}>Net Payout</Text><Text style={styles.totalVal}>$206,500</Text></View>
            </View>
          </Animated.View>
        );
      case 4:
        return (
          <Animated.View entering={ZoomIn} style={styles.successContent}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-done" size={60} color="#fff" />
            </View>
            <Text style={styles.successTitle}>Payslips Generated!</Text>
            <Text style={styles.successSub}>All employees will receive their slips via email and app notifications instantly.</Text>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Generate Payslips"
        showBack={true}
        backIconName="close"
      />

      <View style={styles.progressContainer}>
        {STEPS.map((s, idx) => (
          <React.Fragment key={s.id}>
            <View style={[styles.progressItem, currentStep >= s.id && styles.progressActive]}>
              <Ionicons name={s.icon as any} size={18} color={currentStep >= s.id ? '#fff' : '#94a3b8'} />
            </View>
            {idx < STEPS.length - 1 && (
              <View style={[styles.progressLine, currentStep > s.id && styles.lineActive]} />
            )}
          </React.Fragment>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {renderStepContent()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 1 && currentStep < 4 && (
          <TouchableOpacity style={styles.prevBtn} onPress={prevStep}>
            <Text style={styles.prevText}>Previous</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
          <Text style={styles.nextText}>{currentStep === 3 ? 'Confirm & Process' : (currentStep === 4 ? 'Back to Payroll' : 'Continue')}</Text>
        </TouchableOpacity>
      </View>
      <AdminBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  progressContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 24, paddingHorizontal: 40 },
  progressItem: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  progressActive: { backgroundColor: '#4f46e5' },
  progressLine: { flex: 1, height: 2, backgroundColor: '#f1f5f9', marginHorizontal: 4 },
  lineActive: { backgroundColor: '#4f46e5' },
  scroll: { flex: 1, padding: 24 },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 24, fontWeight: '900', color: '#1e293b', marginBottom: 8 },
  stepSub: { fontSize: 14, color: '#64748b', marginBottom: 30, lineHeight: 20 },
  selector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#f8fafc', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  selectorText: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  listPlaceholder: { gap: 12 },
  listItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  circle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f1f5f9' },
  line: { flex: 1, height: 12, borderRadius: 4, backgroundColor: '#f1f5f9' },
  moreText: { fontSize: 13, color: '#94a3b8', fontWeight: '600', marginTop: 8 },
  summaryCard: { backgroundColor: '#f8fafc', borderRadius: 24, padding: 24, gap: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLab: { fontSize: 14, color: '#64748b', fontWeight: '600' },
  summaryVal: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  summaryDivider: { height: 1, backgroundColor: '#e2e8f0' },
  totalLab: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  totalVal: { fontSize: 20, fontWeight: '900', color: '#4f46e5' },
  successContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  successIcon: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center', marginBottom: 24, elevation: 10, shadowColor: '#10b981', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15 },
  successTitle: { fontSize: 28, fontWeight: '900', color: '#1e293b', marginBottom: 12, textAlign: 'center' },
  successSub: { fontSize: 15, color: '#64748b', textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
  footer: { padding: 20, paddingBottom: 100, flexDirection: 'row', gap: 12 },
  prevBtn: { flex: 1, height: 56, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
  prevText: { fontSize: 16, fontWeight: '700', color: '#64748b' },
  nextBtn: { flex: 2, height: 56, borderRadius: 16, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center', shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
