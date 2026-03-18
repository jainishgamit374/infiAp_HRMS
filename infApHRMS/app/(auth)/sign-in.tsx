import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';

const ROLES = [
  { label: 'Employee', value: 'employee', icon: 'person-outline' },
  { label: 'HR', value: 'hr', icon: 'people-outline' },
  { label: 'Admin', value: 'admin', icon: 'shield-outline' },
];

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState('employee');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const currentRole = ROLES.find(r => r.value === selectedRole)!;

  const handleSignIn = () => {
    if (!email.trim()) {
      Alert.alert('Missing Info', 'Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Missing Info', 'Please enter your password.');
      return;
    }
    // Navigate to 2FA screen with selected role
    router.push({ pathname: '/(auth)/two-factor-auth', params: { role: selectedRole } });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Logo */}
        <View style={styles.header}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.headerLogo} 
            resizeMode="contain"
          />
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Enter your credentials to access your{'\n'}enterprise dashboard
          </Text>

          {/* Role Selector */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sign in as</Text>
            <TouchableOpacity
              style={styles.roleSelector}
              onPress={() => setShowRoleDropdown(!showRoleDropdown)}
              activeOpacity={0.7}
            >
              <View style={styles.roleSelectorLeft}>
                <Ionicons name={currentRole.icon as any} size={20} color="#5a55d2" />
                <Text style={styles.roleSelectorText}>{currentRole.label}</Text>
              </View>
              <Ionicons name={showRoleDropdown ? "chevron-up" : "chevron-down"} size={20} color="#9ca3af" />
            </TouchableOpacity>
            
            {showRoleDropdown && (
              <View style={styles.roleDropdown}>
                {ROLES.map((role) => (
                  <TouchableOpacity
                    key={role.value}
                    style={[
                      styles.roleOption,
                      selectedRole === role.value && styles.roleOptionActive,
                    ]}
                    onPress={() => {
                      setSelectedRole(role.value);
                      setShowRoleDropdown(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={role.icon as any} size={18} color={selectedRole === role.value ? '#5a55d2' : '#6b7280'} />
                    <Text style={[
                      styles.roleOptionText,
                      selectedRole === role.value && styles.roleOptionTextActive,
                    ]}>{role.label}</Text>
                    {selectedRole === role.value && (
                      <Ionicons name="checkmark" size={18} color="#5a55d2" style={{ marginLeft: 'auto' }} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email address</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="name@company.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <View style={styles.passwordHeader}>
              <Text style={styles.label}>Password</Text>
              <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity>
                  <Text style={styles.forgotPassword}>Forgot password?</Text>
                </TouchableOpacity>
              </Link>
            </View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="........"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Remember Me */}
          <TouchableOpacity
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={rememberMe ? "checkbox" : "square-outline"}
              size={20}
              color={rememberMe ? "#5a55d2" : "#9ca3af"}
            />
            <Text style={styles.rememberMeText}>Remember me</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} activeOpacity={0.8}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-linkedin" size={20} color="#0A66C2" />
              <Text style={styles.socialText}>LinkedIn</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Card Section */}
          <View style={styles.cardFooter}>
            <Text style={styles.noAccountText}>Don't have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <Text style={styles.createAccountText}>Create an account</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Footer Badges */}
        <View style={styles.badgesContainer}>
          <View style={styles.badge}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#9ca3af" />
            <Text style={styles.badgeText}>ENTERPRISE SECURE</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="cloud-done-outline" size={16} color="#9ca3af" />
            <Text style={styles.badgeText}>99.9% UPTIME</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f7fa',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    marginLeft: -24, // Flush to the edge if container padding is 24
  },
  headerLogo: {
    width: 150,
    height: 45,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 20,
    zIndex: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  // Role Selector
  roleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#5a55d2',
    borderRadius: 12,
    backgroundColor: '#f8f7ff',
    height: 52,
    paddingHorizontal: 16,
  },
  roleSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  roleSelectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5a55d2',
  },
  roleDropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  roleOptionActive: {
    backgroundColor: '#f8f7ff',
  },
  roleOptionText: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  },
  roleOptionTextActive: {
    color: '#5a55d2',
    fontWeight: '600',
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 14,
    color: '#5a55d2',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#ffffff',
    height: 52,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    height: '100%',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMeText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4b5563',
  },
  signInButton: {
    backgroundColor: '#5a55d2',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5a55d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  signInText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    height: 52,
    marginHorizontal: 6,
  },
  socialText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    marginHorizontal: -24,
    backgroundColor: '#fafafa',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  noAccountText: {
    fontSize: 14,
    color: '#6b7280',
  },
  createAccountText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5a55d2',
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 0.5,
  },
});
