import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../context/UserContext';

const ROLE_DASHBOARD_MAP: Record<string, string> = {
  employee: '/(employee)/',
  hr: '/(hr)/',
  admin: '/(admin)/',
};

const ROLE_LABEL_MAP: Record<string, string> = {
  employee: 'Employee Dashboard',
  hr: 'HR Dashboard',
  admin: 'Admin Dashboard',
};

export default function TwoFactorAuth() {
  const { role = 'employee' } = useLocalSearchParams<{ role: string }>();
  const { updateUser } = useUser();
  const [code, setCode] = useState<string>('');
  const [timer, setTimer] = useState(54);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const CODE_LENGTH = 6;

  const dashboardRoute = ROLE_DASHBOARD_MAP[role] || '/(employee)/';
  const dashboardLabel = ROLE_LABEL_MAP[role] || 'Dashboard';

  const progressWidth = useRef(new Animated.Value(0)).current;
  const checkmarkScale = useRef(new Animated.Value(0)).current;

  // Handle countdown timer
  useEffect(() => {
    let interval: any;
    if (timer > 0 && !isSuccess) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, isSuccess]);

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      setCode((prev) => prev.slice(0, -1));
    } else if (code.length < CODE_LENGTH) {
      setCode((prev) => prev + key);
    }
  };

  const handleVerify = () => {
    if (code.length !== CODE_LENGTH) return;
    
    setIsVerifying(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);
      
      // Update system role in context
      updateUser({ systemRole: role as any });
      
      // Animate success state
      Animated.timing(progressWidth, {
        toValue: 100,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start();

      Animated.spring(checkmarkScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
      
      // Navigate to role-based dashboard after delay
      setTimeout(() => {
        router.replace(dashboardRoute as any);
      }, 2500);
    }, 1500);
  };

  const renderNumpad = () => {
    const keys = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['', '0', 'backspace'],
    ];

    return (
      <View style={styles.numpadContainer}>
        {keys.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.numpadRow}>
            {row.map((key, colIndex) => {
              if (key === '') {
                return <View key={`empty-${colIndex}`} style={styles.numpadKey} />;
              }
              
              const isBackspace = key === 'backspace';
              
              return (
                <TouchableOpacity
                  key={key}
                  style={styles.numpadKey}
                  onPress={() => handleKeyPress(key)}
                  activeOpacity={0.7}
                >
                  {isBackspace ? (
                    <Ionicons name="backspace-outline" size={28} color="#374151" />
                  ) : (
                    <Text style={styles.numpadText}>{key}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.container}>

        <View style={styles.cardCenter}>
          

          <View style={styles.successContent}>
            <View style={styles.successIconOuter}>
              <Animated.View style={[styles.successIconInner, { transform: [{ scale: checkmarkScale }] }]}>
                <Ionicons name="checkmark" size={40} color="#fff" />
              </Animated.View>
            </View>
            
            <Text style={styles.successTitle}>Verification Successful</Text>
            <Text style={styles.successSubtitle}>
              Your identity has been verified.{'\n'}Redirecting you to your {dashboardLabel.toLowerCase()}...
            </Text>

            {/* Role Badge */}
            <View style={styles.roleBadge}>
              <Ionicons name={
                role === 'hr' ? 'people' : role === 'admin' ? 'shield-checkmark' : 'person'
              } size={14} color="#5a55d2" />
              <Text style={styles.roleBadgeText}>Signing in as {role === 'hr' ? 'HR' : role.charAt(0).toUpperCase() + role.slice(1)}</Text>
            </View>

            <View style={styles.progressBarContainer}>
              <Animated.View style={[styles.progressBarFill, { width: progressWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%']
              }) }]} />
            </View>

            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={() => router.replace(dashboardRoute as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue to {dashboardLabel}</Text>
            </TouchableOpacity>
            
            <Text style={styles.securityText}>Security by InfiAP Auth Engine</Text>
            <View style={styles.bottomGradientLine} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardFull}>
        {/* Header Icon */}
        <View style={styles.headerIconContainer}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#5a55d2" />
        </View>

        <Text style={styles.title}>Two-Factor{'\n'}Authentication</Text>
        <Text style={styles.subtitle}>
          A 6-digit code has been sent to your{'\n'}mobile device or email. Please enter it{'\n'}below to verify your identity.
        </Text>

        {/* Code Input Boxes */}
        <View style={styles.codeContainer}>
          {Array.from({ length: CODE_LENGTH }).map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.codeBox, 
                code.length === index && styles.codeBoxActive,
                code.length > index && styles.codeBoxFilled
              ]}
            >
              <Text style={styles.codeText}>
                {code[index] || ''}
              </Text>
            </View>
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity 
          style={[styles.verifyButton, code.length !== CODE_LENGTH && styles.verifyButtonDisabled]} 
          onPress={handleVerify}
          disabled={code.length !== CODE_LENGTH || isVerifying}
          activeOpacity={0.8}
        >
          <Text style={styles.verifyButtonText}>
            {isVerifying ? 'Verifying...' : 'Verify & Continue'}
          </Text>
          {!isVerifying && <Ionicons name="arrow-forward" size={18} color="#fff" style={styles.verifyButtonIcon} />}
        </TouchableOpacity>

        {/* Resend Code */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive a code? </Text>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend in 00:{timer.toString().padStart(2, '0')}</Text>
          ) : (
            <TouchableOpacity onPress={() => setTimer(54)}>
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Numpad */}
        {renderNumpad()}

        {/* Back to Sign In */}
        <View style={styles.footer}>
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="arrow-back" size={16} color="#6b7280" />
              <Text style={styles.backButtonText}>Back to Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    justifyContent: 'center',
    padding: 16,
  },
  cardFull: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  cardCenter: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 0,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eff0fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  codeBox: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  codeBoxActive: {
    borderColor: '#5a55d2',
    borderWidth: 2,
  },
  codeBoxFilled: {
    borderColor: '#e5e7eb',
  },
  codeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  verifyButton: {
    backgroundColor: '#5a55d2',
    borderRadius: 12,
    height: 52,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#5a55d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonDisabled: {
    backgroundColor: '#a5a3e8',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  verifyButtonIcon: {
    marginLeft: 8,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  resendText: {
    fontSize: 14,
    color: '#6b7280',
  },
  timerText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  resendLink: {
    fontSize: 14,
    color: '#5a55d2',
    fontWeight: '500',
  },
  numpadContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    marginTop: 16,
  },
  numpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  numpadKey: {
    width: '30%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numpadText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#111827',
  },
  footer: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginTop: 'auto',
    marginHorizontal: -24,
    backgroundColor: '#fafafa',
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  
  // Success View Styles
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  headerLogo: {
    width: 320,
    height: 90,
  },
  successContent: {
    alignItems: 'center',
    width: '100%',
  },
  successIconOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e6fcf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  successIconInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#20c997',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#20c997',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0ff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
    marginBottom: 24,
  },
  roleBadgeText: {
    color: '#5a55d2',
    fontSize: 13,
    fontWeight: '600',
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 2,
    marginBottom: 40,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#5a55d2',
    borderRadius: 2,
  },
  continueButton: {
    backgroundColor: '#5a55d2',
    borderRadius: 12,
    height: 52,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#5a55d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  securityText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 24,
  },
  bottomGradientLine: {
    height: 4,
    width: '120%', 
    backgroundColor: '#5a55d2',
    position: 'absolute',
    bottom: 0,
  }
});
