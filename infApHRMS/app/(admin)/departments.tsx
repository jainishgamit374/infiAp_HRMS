import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Dimensions,
  Modal,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInDown,
  ZoomIn,
  Layout,
} from 'react-native-reanimated';
import { AdminBottomNav } from '../../components/AdminBottomNav';
import Header from '../../components/layout/Header';

const { width } = Dimensions.get('window');

interface Department {
  id: string;
  name: string;
  head: string;
  tag: string;
  tagColor: string;
  teams: number;
  employees: number;
}

const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: '1',
    name: 'Engineering',
    head: 'Alex Rivera',
    tag: 'Tech',
    tagColor: '#4f46e5',
    teams: 6,
    employees: 42,
  },
  {
    id: '2',
    name: 'Marketing',
    head: 'Sarah Chen',
    tag: 'Creative',
    tagColor: '#ec4899',
    teams: 4,
    employees: 28,
  },
  {
    id: '3',
    name: 'Human Resources',
    head: 'James Wilson',
    tag: 'Admin',
    tagColor: '#f59e0b',
    teams: 3,
    employees: 12,
  },
  {
    id: '4',
    name: 'Finance & Accounting',
    head: 'Priya Sharma',
    tag: 'Admin',
    tagColor: '#f59e0b',
    teams: 3,
    employees: 18,
  },
  {
    id: '5',
    name: 'Product Design',
    head: 'Marcus Lee',
    tag: 'Creative',
    tagColor: '#ec4899',
    teams: 2,
    employees: 15,
  },
  {
    id: '6',
    name: 'Sales & BD',
    head: 'Olivia Martinez',
    tag: 'Growth',
    tagColor: '#10b981',
    teams: 5,
    employees: 34,
  },
];

const TAG_OPTIONS = [
  { label: 'Tech', color: '#4f46e5' },
  { label: 'Creative', color: '#ec4899' },
  { label: 'Admin', color: '#f59e0b' },
  { label: 'Growth', color: '#10b981' },
  { label: 'Operations', color: '#0ea5e9' },
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formHead, setFormHead] = useState('');
  const [formTeams, setFormTeams] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTag, setFormTag] = useState(TAG_OPTIONS[0]);

  const totalTeams = departments.reduce((sum, d) => sum + d.teams, 0);
  const totalStaff = departments.reduce((sum, d) => sum + d.employees, 0);

  const filteredDepartments = searchQuery.trim()
    ? departments.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.head.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : departments;

  const resetForm = () => {
    setFormName('');
    setFormHead('');
    setFormTeams('');
    setFormDescription('');
    setFormTag(TAG_OPTIONS[0]);
  };

  const handleCreate = () => {
    if (!formName.trim()) {
      Alert.alert('Required', 'Please enter a department name.');
      return;
    }
    if (!formHead.trim()) {
      Alert.alert('Required', 'Please enter the department head.');
      return;
    }

    const newDept: Department = {
      id: Date.now().toString(),
      name: formName.trim(),
      head: formHead.trim(),
      tag: formTag.label,
      tagColor: formTag.color,
      teams: parseInt(formTeams) || 0,
      employees: 0,
    };

    setDepartments((prev) => [newDept, ...prev]);
    setShowCreateModal(false);
    resetForm();

    // Show success popup
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const STATS = [
    { label: 'Total Departments', value: departments.length.toString(), icon: 'business-outline', color: '#4f46e5' },
    { label: 'Total Teams', value: totalTeams.toString(), icon: 'people-outline', color: '#0ea5e9' },
    { label: 'Total Staff', value: totalStaff.toString(), icon: 'person-outline', color: '#10b981' },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header 
        title="Departments"
        showBack={true}
      />

      {/* Search Bar (toggle) */}
      {showSearch && (
        <Animated.View entering={FadeInDown.duration(300)} style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#94a3b8" />
          <TextInput
            placeholder="Search departments..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </Animated.View>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
        {/* Overview Stats */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.statsRow}>
          {STATS.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: stat.color + '15' }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Section Header */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Departments</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{filteredDepartments.length}</Text>
          </View>
        </Animated.View>

        {/* Department Cards */}
        {filteredDepartments.map((dept, index) => (
          <Animated.View
            key={dept.id}
            entering={FadeInDown.delay(300 + index * 80).springify()}
            layout={Layout.springify()}
            style={styles.deptCard}
          >
            {/* Top Row */}
            <View style={styles.deptCardTop}>
              <View style={styles.deptInfo}>
                <View style={styles.deptNameRow}>
                  <View style={styles.deptAvatarBox}>
                    <Text style={styles.deptAvatarText}>
                      {dept.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.deptName}>{dept.name}</Text>
                    <Text style={styles.deptHead}>Head: {dept.head}</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.tagBadge, { backgroundColor: dept.tagColor + '15' }]}>
                <Text style={[styles.tagText, { color: dept.tagColor }]}>{dept.tag}</Text>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.deptStatsRow}>
              <View style={styles.deptStat}>
                <Ionicons name="layers-outline" size={16} color="#64748b" />
                <Text style={styles.deptStatText}>{dept.teams} Teams</Text>
              </View>
              <View style={styles.deptStatDivider} />
              <View style={styles.deptStat}>
                <Ionicons name="people-outline" size={16} color="#64748b" />
                <Text style={styles.deptStatText}>{dept.employees} Employees</Text>
              </View>
            </View>

            {/* View Teams Button */}
            <TouchableOpacity 
              style={styles.viewTeamsBtn} 
              activeOpacity={0.7}
              onPress={() => router.push({
                pathname: '/(admin)/manage-teams',
                params: { deptId: dept.id, deptName: dept.name }
              } as any)}
            >
              <Ionicons name="eye-outline" size={16} color="#4f46e5" />
              <Text style={styles.viewTeamsText}>View Teams</Text>
              <Ionicons name="chevron-forward" size={16} color="#4f46e5" />
            </TouchableOpacity>
          </Animated.View>
        ))}

        {filteredDepartments.length === 0 && (
          <Animated.View entering={FadeIn} style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#e2e8f0" />
            <Text style={styles.emptyTitle}>No departments found</Text>
            <Text style={styles.emptySub}>Try adjusting your search query</Text>
          </Animated.View>
        )}

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floating Create Button */}
      <Animated.View entering={ZoomIn.delay(600).springify()}>
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.85}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={22} color="#fff" />
          <Text style={styles.fabText}>Create Department</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Create Department Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowCreateModal(false)}
          />
          <Animated.View entering={SlideInDown.springify().damping(18)} style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Department</Text>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
              >
                <Ionicons name="close" size={22} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Department Name */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>DEPARTMENT NAME *</Text>
                <TextInput
                  placeholder="e.g. Engineering, Marketing"
                  placeholderTextColor="#94a3b8"
                  style={styles.formInput}
                  value={formName}
                  onChangeText={setFormName}
                />
              </View>

              {/* Department Head */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>DEPARTMENT HEAD *</Text>
                <TextInput
                  placeholder="e.g. Alex Rivera"
                  placeholderTextColor="#94a3b8"
                  style={styles.formInput}
                  value={formHead}
                  onChangeText={setFormHead}
                />
              </View>

              {/* Department Tag */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>CATEGORY TAG</Text>
                <View style={styles.tagSelector}>
                  {TAG_OPTIONS.map((tag) => (
                    <TouchableOpacity
                      key={tag.label}
                      style={[
                        styles.tagOption,
                        formTag.label === tag.label && {
                          backgroundColor: tag.color + '20',
                          borderColor: tag.color,
                        },
                      ]}
                      onPress={() => setFormTag(tag)}
                    >
                      <View style={[styles.tagDot, { backgroundColor: tag.color }]} />
                      <Text
                        style={[
                          styles.tagOptionText,
                          formTag.label === tag.label && { color: tag.color, fontWeight: '700' },
                        ]}
                      >
                        {tag.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Number of Teams */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>NUMBER OF TEAMS (OPTIONAL)</Text>
                <TextInput
                  placeholder="e.g. 4"
                  placeholderTextColor="#94a3b8"
                  style={styles.formInput}
                  value={formTeams}
                  onChangeText={setFormTeams}
                  keyboardType="number-pad"
                />
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>DESCRIPTION (OPTIONAL)</Text>
                <TextInput
                  placeholder="Brief description of this department..."
                  placeholderTextColor="#94a3b8"
                  style={[styles.formInput, styles.formTextArea]}
                  value={formDescription}
                  onChangeText={setFormDescription}
                  multiline
                  numberOfLines={4}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitBtn} activeOpacity={0.85} onPress={handleCreate}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.submitBtnText}>Create Department</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <View style={{ height: 30 }} />
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Success Popup */}
      {showSuccess && (
        <View style={styles.successOverlay}>
          <Animated.View entering={ZoomIn.springify()} style={styles.successPopup}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={36} color="#fff" />
            </View>
            <Text style={styles.successTitle}>Department Created</Text>
            <Text style={styles.successTitle}>Successfully ✅</Text>
            <Text style={styles.successSub}>
              The new department has been added to your organization.
            </Text>
          </Animated.View>
        </View>
      )}

      <AdminBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#1e293b',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1e293b',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textAlign: 'center',
  },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  countBadge: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  countBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },

  // Department Card
  deptCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  deptCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  deptInfo: {
    flex: 1,
  },
  deptNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deptAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e7ff',
  },
  deptAvatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4f46e5',
  },
  deptName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  deptHead: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
  },
  tagBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  deptStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    gap: 16,
  },
  deptStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deptStatText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  deptStatDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#e2e8f0',
  },

  viewTeamsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e7ff',
    backgroundColor: '#f5f3ff',
    gap: 8,
  },
  viewTeamsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4f46e5',
  },

  // Empty
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1e293b',
    marginTop: 16,
  },
  emptySub: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  fabText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e2e8f0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Form
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  formInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    height: 52,
    fontSize: 15,
    color: '#1e293b',
  },
  formTextArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },

  // Tag Selector
  tagSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  tagDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  tagOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },

  // Submit
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    height: 56,
    borderRadius: 16,
    gap: 10,
    marginTop: 8,
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  cancelBtn: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748b',
  },

  // Success
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  successPopup: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    width: width - 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },
  successSub: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
});
