// 🚀 ULTRA-ADVANCED FORGOT PASSWORD SCREEN
// Revolutionary password recovery with elegant animations and progress tracking

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { useThemeStore } from '../store';
import { UltraButton, UltraCard, UltraLoading } from '../components/UltraComponents';
import { apiClient } from '../services/api';

const { width, height } = Dimensions.get('window');

interface ForgotPasswordScreenProps {
  navigation: any;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { hapticFeedback } = useThemeStore();
  
  // Form state
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // Validation
  const [emailError, setEmailError] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for icons
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  useEffect(() => {
    // Countdown timer for resend
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const validateEmail = (value: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const error = validateEmail(value);
    setEmailError(error);
    setEmailValid(!error && value.length > 0);
    
    if (hapticFeedback && emailError && !error) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSendResetEmail = async () => {
    if (!emailValid) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      if (hapticFeedback) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    setIsLoading(true);
    
    try {
      // This would typically call your API
      // await apiClient.sendPasswordReset(email.toLowerCase().trim());
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setEmailSent(true);
      setCountdown(60);
      
      if (hapticFeedback) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Success animation
      Animated.spring(successAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
      
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email');
      if (hapticFeedback) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (countdown > 0) return;
    
    setCountdown(60);
    handleSendResetEmail();
  };

  const navigateToLogin = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    navigation.navigate('Login');
  };

  const renderEmailForm = () => (
    <View>
      <View style={{
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
      }}>
        <Animated.View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(255,255,255,0.15)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: theme.spacing.lg,
            transform: [{ scale: pulseAnim }],
          }}
        >
          <Ionicons name="mail-outline" size={40} color="white" />
        </Animated.View>
        
        <Text style={{
          ...theme.typography.h2,
          color: 'white',
          marginBottom: theme.spacing.sm,
          textAlign: 'center',
        }}>
          Forgot Password?
        </Text>
        
        <Text style={{
          ...theme.typography.body1,
          color: 'rgba(255,255,255,0.8)',
          textAlign: 'center',
          lineHeight: 24,
        }}>
          Don't worry! Enter your email address and we'll send you a link to reset your password.
        </Text>
      </View>

      {/* Email Input */}
      <View style={{ marginBottom: theme.spacing.lg }}>
        <Text style={{
          ...theme.typography.caption,
          color: 'rgba(255,255,255,0.8)',
          marginBottom: theme.spacing.sm,
        }}>
          EMAIL ADDRESS
        </Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: theme.borderRadius.md,
          paddingHorizontal: theme.spacing.md,
          borderWidth: 1,
          borderColor: emailValid ? 'rgba(16,185,129,0.5)' : 
                       emailError ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.2)',
        }}>
          <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.6)" />
          <TextInput
            style={{
              flex: 1,
              ...theme.typography.body1,
              color: 'white',
              paddingVertical: theme.spacing.md,
              paddingLeft: theme.spacing.sm,
            }}
            placeholder="Enter your email address"
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {emailValid && (
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          )}
        </View>
        {emailError && (
          <Text style={{
            ...theme.typography.caption,
            color: '#EF4444',
            marginTop: theme.spacing.xs,
          }}>
            {emailError}
          </Text>
        )}
      </View>

      {/* Send Button */}
      {isLoading ? (
        <View style={{ 
          height: 56, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: theme.borderRadius.md,
          marginBottom: theme.spacing.md,
        }}>
          <UltraLoading variant="spinner" size="medium" color="white" />
        </View>
      ) : (
        <UltraButton
          title="Send Reset Link"
          onPress={handleSendResetEmail}
          variant="gradient"
          size="large"
          fullWidth
          disabled={!emailValid}
          style={{ marginBottom: theme.spacing.md }}
        />
      )}

      {/* Back to Login */}
      <TouchableOpacity
        onPress={navigateToLogin}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: theme.spacing.md,
        }}
      >
        <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.8)" />
        <Text style={{
          ...theme.typography.body1,
          color: 'rgba(255,255,255,0.8)',
          marginLeft: theme.spacing.sm,
        }}>
          Back to Login
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSuccessMessage = () => (
    <Animated.View
      style={{
        opacity: successAnim,
        transform: [{ scale: successAnim }],
      }}
    >
      <View style={{
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
      }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: 'rgba(16,185,129,0.2)',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: theme.spacing.lg,
        }}>
          <Ionicons name="checkmark-circle" size={40} color="#10B981" />
        </View>
        
        <Text style={{
          ...theme.typography.h2,
          color: 'white',
          marginBottom: theme.spacing.sm,
          textAlign: 'center',
        }}>
          Email Sent!
        </Text>
        
        <Text style={{
          ...theme.typography.body1,
          color: 'rgba(255,255,255,0.8)',
          textAlign: 'center',
          lineHeight: 24,
          marginBottom: theme.spacing.lg,
        }}>
          We've sent a password reset link to {'\n'}
          <Text style={{ fontWeight: 'bold' }}>{email}</Text>
        </Text>

        <View style={{
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: theme.borderRadius.md,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.lg,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.2)',
        }}>
          <Text style={{
            ...theme.typography.body2,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            lineHeight: 20,
          }}>
            💡 Check your spam folder if you don't see the email in your inbox
          </Text>
        </View>
      </View>

      {/* Resend Button */}
      <UltraButton
        title={countdown > 0 ? `Resend in ${countdown}s` : "Resend Email"}
        onPress={handleResendEmail}
        variant={countdown > 0 ? "outline" : "gradient"}
        size="large"
        fullWidth
        disabled={countdown > 0}
        style={{ marginBottom: theme.spacing.md }}
      />

      {/* Action Buttons */}
      <View style={{ flexDirection: 'row' }}>
        <UltraButton
          title="Back to Login"
          onPress={navigateToLogin}
          variant="outline"
          size="large"
          style={{ flex: 1, marginRight: theme.spacing.sm }}
        />
        <UltraButton
          title="Open Email App"
          onPress={() => {
            // This would open the default email app
            if (hapticFeedback) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
          }}
          variant="secondary"
          size="large"
          style={{ flex: 1, marginLeft: theme.spacing.sm }}
        />
      </View>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1 }}>
      <StatusBar 
        barStyle={theme.isDark ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent" 
        translucent 
      />
      
      {/* Animated Background */}
      <LinearGradient
        colors={[theme.colors.accent, theme.colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: height,
        }}
      >
        {/* Floating Elements */}
        <View style={{
          position: 'absolute',
          top: 150,
          right: 30,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: 'rgba(255,255,255,0.05)',
        }} />
        <View style={{
          position: 'absolute',
          top: 400,
          left: 20,
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'rgba(255,255,255,0.08)',
        }} />
      </LinearGradient>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: theme.spacing.lg,
        }}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <UltraCard variant="glass" blur={true}>
              {emailSent ? renderSuccessMessage() : renderEmailForm()}
            </UltraCard>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
