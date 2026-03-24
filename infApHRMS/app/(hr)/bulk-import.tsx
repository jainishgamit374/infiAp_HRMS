import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { HRBottomNav } from '@/components/HRBottomNav';
import Animated, { FadeInDown, FadeOut, Layout } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const BulkImport = () => {
  const [step, setStep] = useState(2); // 1: Upload, 2: Map, 3: Import
  const [progress, setProgress] = useState(85);

  const handleStartImport = () => {
    Alert.alert(
      'Import Started',
      'Employees are being imported in the background.',
      [{ text: 'OK', onPress: () => router.push('/(hr)' as any) }]
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepItem}>
        <View style={[styles.stepCircle, step >= 1 && styles.stepCircleActive]}>
          <Ionicons name="cloud-upload" size={18} color={step >= 1 ? '#fff' : '#9ca3af'} />
        </View>
        <Text style={[styles.stepText, step >= 1 && styles.stepTextActive]}>UPLOAD</Text>
      </View>
      <View style={[styles.stepLine, step >= 2 && styles.stepLineActive]} />
      <View style={styles.stepItem}>
        <View style={[styles.stepCircle, step >= 2 && styles.stepCircleActive]}>
          <Ionicons name="git-branch" size={18} color={step >= 2 ? '#fff' : '#9ca3af'} />
        </View>
        <Text style={[styles.stepText, step >= 2 && styles.stepTextActive]}>MAP</Text>
      </View>
      <View style={[styles.stepLine, step >= 3 && styles.stepLineActive]} />
      <View style={styles.stepItem}>
        <View style={[styles.stepCircle, step >= 3 && styles.stepCircleActive]}>
          <Ionicons name="checkmark-circle" size={18} color={step >= 3 ? '#fff' : '#9ca3af'} />
        </View>
        <Text style={[styles.stepText, step >= 3 && styles.stepTextActive]}>IMPORT</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.title}>Bulk Employee Import</Text>
        </View>

        {renderStepIndicator()}

        <Text style={styles.stepTitle}>Step {step}: Map Fields</Text>
        <Text style={styles.stepSubtitle}>Match your file columns to InfiAP employee fields.</Text>

        {/* File Card */}
        <View style={styles.fileCard}>
          <View style={styles.fileInfo}>
            <View style={styles.csvIcon}>
              <MaterialCommunityIcons name={"file-delimited-outline" as any} size={24} color="#5a55d2" />
            </View>
            <View style={styles.fileDetails}>
              <Text style={styles.fileName}>employees_q3_revised.csv</Text>
              <Text style={styles.fileSize}>4.2 MB • 124 records detected</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="close" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Analysis Progress</Text>
            <Text style={styles.progressValue}>{progress}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>
          
          <Text style={styles.validationText}>
            <Text style={{ color: '#22c55e', fontWeight: '700' }}>● 118 Ready </Text>
            <Text style={{ color: '#ef4444', fontWeight: '700' }}>● 6 Errors</Text>
          </Text>
        </View>

        {/* Column Mapping */}
        <View style={styles.mappingHeader}>
          <Text style={styles.mappingTitle}>COLUMN MAPPING</Text>
          <TouchableOpacity>
            <Text style={styles.autoMatchText}>Auto-match all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mappingList}>
          {[
            { file: 'Full Name', system: 'employee_name', icon: 'person-outline' },
            { file: 'Email Address', system: 'work_email', icon: 'mail-outline' },
            { file: 'Emp_ID', system: 'Unmapped', icon: 'card-outline', error: true },
          ].map((item, idx) => (
            <View key={idx} style={styles.mappingRow}>
              <View style={styles.mappingBox}>
                <Text style={styles.mappingBoxLabel}>FILE COLUMN</Text>
                <View style={styles.mappingBoxContent}>
                  <Text style={styles.mappingBoxText}>{item.file}</Text>
                </View>
              </View>
              
              <Ionicons name="repeat" size={20} color="#9ca3af" />
              
              <View style={styles.mappingBox}>
                <Text style={styles.mappingBoxLabel}>SYSTEM FIELD</Text>
                <TouchableOpacity style={[styles.mappingBoxContent, item.error && styles.errorBox]}>
                  <Ionicons name={item.icon as any} size={16} color={item.error ? '#ef4444' : '#5a55d2'} />
                  <Text style={[styles.mappingBoxText, item.error && styles.errorText]}>{item.system}</Text>
                  <Ionicons name="chevron-down" size={16} color={item.error ? '#ef4444' : '#9ca3af'} style={{ marginLeft: 'auto' }} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.errorAlert}>
          <Ionicons name="alert-circle" size={16} color="#ef4444" />
          <Text style={styles.errorAlertText}>Column 'Emp_ID' must be mapped to proceed.</Text>
        </View>

        <TouchableOpacity style={styles.helpLink}>
          <Text style={styles.helpLinkText}>Having trouble with mapping?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.templateButton}>
          <Ionicons name="download-outline" size={20} color="#4b5563" />
          <Text style={styles.templateText}>Download CSV Template</Text>
        </TouchableOpacity>

        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.startButton} onPress={handleStartImport}>
            <Text style={styles.startText}>Start Import</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
      <HRBottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  stepItem: {
    alignItems: 'center',
    gap: 8,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#5a55d2',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 8,
    marginTop: -20,
  },
  stepLineActive: {
    backgroundColor: '#5a55d2',
  },
  stepText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
  },
  stepTextActive: {
    color: '#5a55d2',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  stepSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 24,
  },
  fileCard: {
    backgroundColor: '#f8f9fe',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 32,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  csvIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f5f4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  fileSize: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
  },
  progressValue: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5a55d2',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5a55d2',
    borderRadius: 3,
  },
  validationText: {
    fontSize: 12,
  },
  mappingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mappingTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 0.5,
  },
  autoMatchText: {
    fontSize: 12,
    color: '#5a55d2',
    fontWeight: '600',
  },
  mappingList: {
    gap: 16,
    marginBottom: 12,
  },
  mappingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mappingBox: {
    flex: 1,
  },
  mappingBoxLabel: {
    fontSize: 10,
    color: '#9ca3af',
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  mappingBoxContent: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    backgroundColor: '#fff',
  },
  mappingBoxText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  errorBox: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    color: '#ef4444',
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  errorAlertText: {
    fontSize: 11,
    color: '#ef4444',
    fontWeight: '500',
  },
  helpLink: {
    alignItems: 'center',
    marginBottom: 16,
  },
  helpLinkText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  templateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 40,
  },
  templateText: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '600',
  },
  footerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
  startButton: {
    flex: 2,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#5a55d2',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  startText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default BulkImport;
