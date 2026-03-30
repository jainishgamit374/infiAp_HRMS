import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSidebar } from '../../context/SidebarContext';
import { router } from 'expo-router';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBackPress?: () => void;
}

const Header = ({ title, subtitle, showBack, onBackPress }: HeaderProps) => {
  const { openSidebar } = useSidebar();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity onPress={handleBack} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={24} color="#1e293b" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={openSidebar} style={styles.iconBtn}>
            <Ionicons name="menu-outline" size={28} color="#1e293b" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        {title ? (
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
            {subtitle && <Text style={styles.headerSubtitle} numberOfLines={1}>{subtitle}</Text>}
          </View>
        ) : (
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        )}
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity 
          style={styles.profileBtn}
          onPress={() => router.push('/(employee)/profile')}
        >
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={18} color="#4f46e5" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginTop: Platform.OS === 'android' ? 30 : 0,
  },
  leftSection: {
    width: 48,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 48,
    alignItems: 'flex-end',
  },
  iconBtn: {
    padding: 4,
    marginLeft: -4,
  },
  headerLogo: {
    width: 42,
    height: 42,
    borderRadius: 8,
  },
  titleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
