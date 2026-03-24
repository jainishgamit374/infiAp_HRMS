import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  LayoutAnimation,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { AdminBottomNav } from '../../components/AdminBottomNav';

const { width } = Dimensions.get('window');

const SALARY_COMPONENTS = [
  {
    title: 'Earnings',
    items: [
      { label: 'Basic Salary', value: 45000, icon: 'cash-outline', color: '#4f46e5' },
      { label: 'House Rent Allowance (HRA)', value: 18000, icon: 'home-outline', color: '#8b5cf6' },
      { label: 'Special Allowance', value: 12000, icon: 'star-outline', color: '#0ea5e9' },
      { label: 'Conveyance Allowance', value: 5000, icon: 'car-outline', color: '#10b981' },
    ],
  },
  {
    title: 'Deductions',
    items: [
      { label: 'Provident Fund (PF)', value: 5400, icon: 'shield-checkmark-outline', color: '#f59e0b' },
      { label: 'Professional Tax', value: 2000, icon: 'briefcase-outline', color: '#ef4444' },
      { label: 'Income Tax (TDS)', value: 8500, icon: 'receipt-outline', color: '#ef4444' },
    ],
  },
];

export default function SalaryStructure() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['Earnings', 'Deductions']);

  const toggleSection = (title: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (expandedSections.includes(title)) {
      setExpandedSections(expandedSections.filter((s) => s !== title));
    } else {
      setExpandedSections([...expandedSections, title]);
    }
  };

  const totalEarnings = SALARY_COMPONENTS[0].items.reduce((sum, i) => sum + i.value, 0);
  const totalDeductions = SALARY_COMPONENTS[1].items.reduce((sum, i) => sum + i.value, 0);
  const netSalary = totalEarnings - totalDeductions;
  const annualCTC = totalEarnings * 12;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Salary Structure</Text>
        <TouchableOpacity style={styles.headerIcon} onPress={() => Alert.alert("Download", "Salary structure report is being generated...")}>
          <Ionicons name="download-outline" size={22} color="#4f46e5" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Annual CTC Card */}
        <Animated.View entering={ZoomIn.delay(200).duration(600)} style={styles.ctcCard}>
          <View style={styles.ctcHeader}>
            <Text style={styles.ctcLabel}>Annual CTC</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#fff" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
          <Text style={styles.ctcValue}>${annualCTC.toLocaleString()}</Text>
          <View style={styles.ctcDivider} />
          <View style={styles.monthlyRow}>
            <View>
              <Text style={styles.monthlyLabel}>Monthly Take Home</Text>
              <Text style={styles.monthlyValue}>${netSalary.toLocaleString()}</Text>
            </View>
            <TouchableOpacity 
              style={styles.editBtn}
              onPress={() => Alert.alert("Update Structure", "Enter edit mode to modify salary components?")}
            >
              <Text style={styles.editBtnText}>Update</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Components */}
        {SALARY_COMPONENTS.map((section, idx) => (
          <Animated.View 
            key={section.title} 
            entering={FadeInUp.delay(300 + idx * 100).duration(500)}
            style={styles.sectionContainer}
          >
            <TouchableOpacity 
              style={styles.sectionHeader} 
              onPress={() => toggleSection(section.title)}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Ionicons 
                name={expandedSections.includes(section.title) ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#64748b" 
              />
            </TouchableOpacity>

            {expandedSections.includes(section.title) && (
              <View style={styles.sectionItems}>
                {section.items.map((item, itemIdx) => (
                  <View key={item.label} style={styles.salaryItem}>
                    <View style={styles.itemLeft}>
                      <View style={[styles.itemIcon, { backgroundColor: item.color + '15' }]}>
                        <Ionicons name={item.icon as any} size={18} color={item.color} />
                      </View>
                      <Text style={styles.itemLabel}>{item.label}</Text>
                    </View>
                    <Text style={styles.itemValue}>${item.value.toLocaleString()}</Text>
                  </View>
                ))}
                <View style={[styles.totalRow, section.title === 'Deductions' && styles.deductionTotal]}>
                  <Text style={styles.totalLabel}>Total {section.title}</Text>
                  <Text style={styles.totalValue}>
                    {section.title === 'Deductions' ? '-' : ''}${section.title === 'Earnings' ? totalEarnings.toLocaleString() : totalDeductions.toLocaleString()}
                  </Text>
                </View>
              </View>
            )}
          </Animated.View>
        ))}

        {/* Info Note */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.noteContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#64748b" />
          <Text style={styles.noteText}>
            This structure is based on the company standard policy for Grade A employees. TAX (TDS) is calculated as per current government norms.
          </Text>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <AdminBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  scrollContent: {
    padding: 20,
  },
  ctcCard: {
    backgroundColor: '#4f46e5',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  ctcHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ctcLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  ctcValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 20,
  },
  ctcDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginBottom: 20,
  },
  monthlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthlyLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  monthlyValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  editBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  editBtnText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  sectionItems: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  salaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  itemValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#f1f5f9',
  },
  deductionTotal: {
    borderTopColor: '#fee2e2',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4f46e5',
  },
  noteContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    gap: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    fontWeight: '500',
  },
});
