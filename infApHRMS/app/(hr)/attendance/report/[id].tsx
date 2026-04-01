import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Header from '@/components/layout/Header';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Header 
        title="Report Preview"
        showBack={true}
        rightElement={
          <TouchableOpacity style={styles.headerRightBtn} onPress={() => Alert.alert('Share Initiated', 'Report presentation link created.')}>
            <Ionicons name="share-outline" size={24} color="#4f46e5" />
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
         {/* Document Header */}
         <Animated.View entering={FadeInDown.duration(400)} style={styles.docHeader}>
            <View style={styles.docIcon}>
               <Ionicons name="document-text" size={36} color="#4f46e5" />
            </View>
            <Text style={styles.docTitle}>Attendance_Report_{id === 'new' ? 'Latest' : id}.pdf</Text>
            <Text style={styles.docMeta}>PDF Document • 2.4 MB • Generated Today</Text>
         </Animated.View>

         {/* Document Preview Area (Mock) */}
         <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.previewContainer}>
            <View style={styles.previewSheet}>
               <View style={styles.sheetHeader}>
                  <Text style={styles.sheetBrand}>INFIAP ENTERPRISE</Text>
                  <Text style={styles.sheetDate}>Oct 2023</Text>
               </View>
               <Text style={styles.sheetTitle}>ATTENDANCE SUMMARY REPORT</Text>
               
               <View style={styles.sheetRow}>
                  <Text style={styles.sheetLabel}>Total Working Days</Text>
                  <Text style={styles.sheetValue}>21</Text>
               </View>
               <View style={styles.sheetRow}>
                  <Text style={styles.sheetLabel}>Average Attendance</Text>
                  <Text style={styles.sheetValue}>94%</Text>
               </View>
               <View style={styles.sheetRow}>
                  <Text style={styles.sheetLabel}>Late Arrivals</Text>
                  <Text style={styles.sheetValue}>12</Text>
               </View>

               <View style={styles.mockGraph} />

               <Text style={styles.watermark}>PREVIEW ONLY</Text>
            </View>
         </Animated.View>
      </ScrollView>

      {/* Floating Action */}
      <View style={styles.footer}>
         <TouchableOpacity style={styles.downloadBtn} onPress={() => Alert.alert('Download Started', 'The PDF is downloading to your device.')}>
            <Ionicons name="download-outline" size={20} color="#fff" />
            <Text style={styles.downloadBtnText}>Download File</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfd' },
  headerRightBtn: { padding: 8 },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 120 },
  
  docHeader: { alignItems: 'center', marginBottom: 32 },
  docIcon: { width: 72, height: 72, borderRadius: 20, backgroundColor: '#eef2ff', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  docTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 4 },
  docMeta: { fontSize: 12, color: '#6b7280', fontWeight: '500' },

  previewContainer: { alignItems: 'center' },
  previewSheet: { width: '100%', minHeight: 450, backgroundColor: '#fff', borderRadius: 8, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 16 },
  sheetBrand: { fontSize: 14, fontWeight: '800', color: '#4f46e5', letterSpacing: 1 },
  sheetDate: { fontSize: 12, color: '#9ca3af', fontWeight: '600' },
  sheetTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 24, textAlign: 'center' },
  sheetRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f9fafb' },
  sheetLabel: { fontSize: 13, color: '#6b7280', fontWeight: '500' },
  sheetValue: { fontSize: 13, color: '#111827', fontWeight: '700' },
  mockGraph: { width: '100%', height: 120, backgroundColor: '#f1f5f9', borderRadius: 8, marginTop: 20 },
  watermark: { position: 'absolute', top: 200, alignSelf: 'center', fontSize: 32, fontWeight: '900', color: 'rgba(0,0,0,0.03)', transform: [{ rotate: '-45deg' }] },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingVertical: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  downloadBtn: { backgroundColor: '#4f46e5', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderRadius: 16 },
  downloadBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700', marginLeft: 8 }
});
