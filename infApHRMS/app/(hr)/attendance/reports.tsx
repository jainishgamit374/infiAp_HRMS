import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { HRBottomNav } from '@/components/HRBottomNav';

export default function AttendanceReports() {
  const [activeTab, setActiveTab] = useState('Daily');
  const tabs = ['Daily', 'Weekly', 'Monthly', 'Department'];

  const REPORTS_DATA = [
    { id: '1', type: 'Daily', name: 'Oct_24_Daily_Log.pdf', date: 'Generated 1 hour ago', format: 'pdf' },
    { id: '2', type: 'Weekly', name: 'Week42_Attendance.xlsx', date: 'Generated 2 days ago', format: 'excel' },
    { id: '3', type: 'Monthly', name: 'Sept_Attendance_Final.pdf', date: 'Generated 2 hours ago', format: 'pdf' },
    { id: '4', type: 'Monthly', name: 'Aug_Attendance_Final.pdf', date: 'Generated 1 month ago', format: 'pdf' },
    { id: '5', type: 'Department', name: 'Sales_Sept_Report.pdf', date: 'Generated 3 hours ago', format: 'pdf' },
    { id: '6', type: 'Department', name: 'Eng_Sept_Report.xlsx', date: 'Generated 4 hours ago', format: 'excel' },
    { id: '7', type: 'Daily', name: 'Oct_23_Daily_Log.pdf', date: 'Generated 1 day ago', format: 'pdf' },
  ];

  const displayedReports = REPORTS_DATA.filter(r => r.type === activeTab);


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Attendance Reports</Text>
        <TouchableOpacity style={styles.headerRightBtn}>
          <Ionicons name="ellipsis-vertical" size={22} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Tabs */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Notifications & Alerts */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>NOTIFICATIONS & ALERTS</Text>
          <View style={styles.alertCard}>
            <Ionicons name="warning-outline" size={24} color="#f59e0b" />
            <View style={styles.alertInfo}>
              <Text style={styles.alertTitle}>Late check-in detected</Text>
              <Text style={styles.alertDesc}>5 employees from Sales checked in after 09:30 AM.</Text>
            </View>
          </View>
          <View style={[styles.alertCard, { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }]}>
            <Ionicons name="time-outline" size={24} color="#3b82f6" />
            <View style={styles.alertInfo}>
              <Text style={[styles.alertTitle, { color: '#1e3a8a' }]}>Correction request</Text>
              <Text style={[styles.alertDesc, { color: '#3b82f6' }]}>Sarah Jenkins submitted a manual time correction.</Text>
            </View>
          </View>
        </Animated.View>

        {/* Report Filters */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Report Filters</Text>
          
          <Text style={styles.inputLabel}>
            {activeTab === 'Daily' ? 'Select Date' : 
             activeTab === 'Weekly' ? 'Select Week' : 
             activeTab === 'Monthly' ? 'Select Month' : 'Time Period'}
          </Text>
          <TouchableOpacity style={styles.inputWrapper}>
            <Text style={styles.inputText}>
              {activeTab === 'Daily' ? 'Oct 24, 2023' : 
               activeTab === 'Weekly' ? 'Oct 16 - Oct 22, 2023' : 
               activeTab === 'Monthly' ? 'September 2023' : 'September 2023'}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <Text style={styles.inputLabel}>Department Selection</Text>
          <TouchableOpacity style={styles.inputWrapper}>
            <Text style={styles.inputText}>{activeTab === 'Department' ? 'Select Departments...' : 'All Departments'}</Text>
            <Ionicons name="chevron-down" size={20} color="#9ca3af" />
          </TouchableOpacity>

          {/* Action Buttons */}
          <TouchableOpacity style={styles.generateBtn} onPress={() => router.push('/(hr)/attendance/report-success')}>
            <Ionicons name="document-text-outline" size={20} color="#ffffff" />
            <Text style={styles.generateBtnText}>Generate Report</Text>
          </TouchableOpacity>

          <View style={styles.rowBtns}>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Ionicons name="document-outline" size={18} color="#4b5563" />
              <Text style={styles.secondaryBtnText}>PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Ionicons name="share-social-outline" size={18} color="#4b5563" />
              <Text style={styles.secondaryBtnText}>Share</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Recent Generations */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>RECENT {activeTab.toUpperCase()} GENERATIONS</Text>
          {displayedReports.length === 0 ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
               <Text style={{ color: '#9ca3af' }}>No reports generated recently.</Text>
            </View>
          ) : displayedReports.map((report) => (
            <TouchableOpacity key={report.id} style={styles.fileCard} onPress={() => router.push(`/(hr)/attendance/report/${report.id}`)}>
              <View style={[styles.fileIcon, report.format === 'excel' && { backgroundColor: '#dcfce7' }]}>
                <Ionicons name={report.format === 'pdf' ? 'document-text' : 'grid'} size={24} color={report.format === 'pdf' ? '#ef4444' : '#16a34a'} />
              </View>
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{report.name}</Text>
                <Text style={styles.fileDate}>{report.date}</Text>
              </View>
              <TouchableOpacity style={styles.downloadBtn}>
                <Ionicons name="download-outline" size={20} color="#4f46e5" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <HRBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1f2937' },
  headerRightBtn: { padding: 8 },
  content: { padding: 20 },
  
  tabsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  tab: { paddingVertical: 8, paddingHorizontal: 12 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: '#4f46e5' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#6b7280' },
  activeTabText: { color: '#4f46e5' },

  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#9ca3af', marginBottom: 16, letterSpacing: 0.5 },
  
  alertCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a', borderRadius: 16, padding: 16, marginBottom: 12 },
  alertInfo: { flex: 1, marginLeft: 12 },
  alertTitle: { fontSize: 14, fontWeight: '700', color: '#b45309', marginBottom: 4 },
  alertDesc: { fontSize: 12, color: '#f59e0b', lineHeight: 18 },

  inputLabel: { fontSize: 12, fontWeight: '600', color: '#4b5563', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20 },
  inputText: { fontSize: 14, color: '#111827', fontWeight: '500' },

  generateBtn: { backgroundColor: '#4f46e5', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#4f46e5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  generateBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700', marginLeft: 8 },
  rowBtns: { flexDirection: 'row', gap: 12 },
  secondaryBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#ffffff' },
  secondaryBtnText: { fontSize: 14, fontWeight: '600', color: '#4b5563', marginLeft: 6 },

  fileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f3f4f6', borderRadius: 16, padding: 16, marginBottom: 12 },
  fileIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#fef2f2', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  fileInfo: { flex: 1 },
  fileName: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 4 },
  fileDate: { fontSize: 11, color: '#9ca3af' },
  downloadBtn: { padding: 8 }
});
