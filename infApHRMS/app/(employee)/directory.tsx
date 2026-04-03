import * as React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { BottomNav } from '../../components/BottomNav';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/layout/Header';

const TEAMS = ['All Teams', 'Engineering', 'Design', 'Marketing', 'Product', 'HR'];

const EMPLOYEES = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'Senior Product Designer',
    team: 'PRODUCT DESIGN',
    teamColor: '#22c55e',
    image: require('../../assets/images/sarah.png'),
    status: 'active'
  },
  {
    id: '2',
    name: 'Marcus Zhao',
    role: 'Lead Backend Developer',
    team: 'ENGINEERING',
    teamColor: '#94a3b8',
    image: require('../../assets/images/marcus.png'),
    status: 'inactive'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'Head of Growth',
    team: 'MARKETING',
    teamColor: '#22c55e',
    image: require('../../assets/images/elena.png'),
    status: 'active'
  },
  {
    id: '4',
    name: 'David Chen',
    role: 'Senior Frontend Engineer',
    team: 'ENGINEERING',
    teamColor: '#22c55e',
    image: require('../../assets/images/david.png'),
    status: 'active'
  }
];

export default function DirectoryPage() {
  const [activeTeam, setActiveTeam] = useState('All Teams');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = EMPLOYEES.filter(emp => {
    // Exact mapping for filter chips
    let teamMatch = false;
    if (activeTeam === 'All Teams') {
      teamMatch = true;
    } else if (activeTeam === 'Engineering') {
      teamMatch = emp.team === 'ENGINEERING';
    } else if (activeTeam === 'Design') {
      teamMatch = emp.team === 'PRODUCT DESIGN';
    } else if (activeTeam === 'Marketing') {
      teamMatch = emp.team === 'MARKETING';
    } else {
      teamMatch = emp.team.toLowerCase().includes(activeTeam.toLowerCase());
    }

    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         emp.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    return teamMatch && matchesSearch;
  });

  return (
    <View style={styles.root}>
      {/* Header */}
      <Header />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or role..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          {TEAMS.map((team) => (
            <TouchableOpacity
              key={team}
              style={[styles.chip, activeTeam === team && styles.chipActive]}
              onPress={() => setActiveTeam(team)}
            >
              <Text style={[styles.chipText, activeTeam === team && styles.chipTextActive]}>
                {team}
              </Text>
              {(team === 'Engineering' || team === 'Design') && (
                <Ionicons name="chevron-down" size={14} color={activeTeam === team ? '#fff' : '#64748b'} style={{ marginLeft: 4 }} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recommended Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllLink}>View all</Text>
          </TouchableOpacity>
        </View>

        {/* Employee Cards */}
        {filteredEmployees.map((employee) => (
          <View key={employee.id} style={styles.card}>
            <View style={styles.cardInfo}>
              <View style={styles.teamBadge}>
                <View style={[styles.statusDot, { backgroundColor: employee.teamColor }]} />
                <Text style={styles.teamLabel}>{employee.team}</Text>
              </View>
              <Text style={styles.employeeName}>{employee.name}</Text>
              <Text style={styles.employeeRole}>{employee.role}</Text>
              
              <View style={styles.cardButtons}>
                <TouchableOpacity style={styles.emailBtn}>
                  <Ionicons name="mail" size={16} color="#fff" />
                  <Text style={styles.emailBtnText}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.slackBtn}>
                  <Image 
                    source={{ uri: 'https://cdn.iconscout.com/icon/free/png-256/free-slack-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-6-pack-logos-icons-2945091.png' }}
                    style={{ width: 14, height: 14 }}
                    resizeMode="contain"
                  />
                  <Text style={styles.slackBtnText}>Slack</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <Image 
              source={employee.image} 
              style={styles.employeePhoto} 
              resizeMode="cover"
            />
          </View>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
  },
  chipsScroll: {
    paddingBottom: 24,
    gap: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#4f46e5',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  chipTextActive: {
    color: '#fff',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4f46e5',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
  },
  teamBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  teamLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  employeeRole: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  cardButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  emailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4f46e5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  emailBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  slackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  slackBtnText: {
    color: '#1e293b',
    fontSize: 13,
    fontWeight: '700',
  },
  employeePhoto: {
    width: 86,
    height: 100,
    borderRadius: 12,
    marginLeft: 12,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#2e4ce6',
  },
});
