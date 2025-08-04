// 🚀 ULTRA-ADVANCED LOGIN SCREEN
// Revolutionary authentication with stunning animations and biometric support

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
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { useUserStore, useThemeStore } from '../store';
import { UltraButton, UltraCard, UltraLoading } from '../components/UltraComponents';
import { apiClient } from '../services/api';

const { width, height } = Dimensions.get('window');

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { login } = useUserStore();
  const { hapticFeedback } = useThemeStore();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Spectacular entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(logoAnim, {
        toValue: 1,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.spring(formAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for logo
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      if (hapticFeedback) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiClient.login(email.toLowerCase().trim(), password);
      login(response.user, response.token);
      
      if (hapticFeedback) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      // Success animation before navigation
      Animated.spring(formAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('MainTabs');
      });
      
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials');
      if (hapticFeedback) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (!hasHardware || !isEnrolled) {
      Alert.alert('Biometric Authentication', 'Biometric authentication is not available on this device');
      return;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login with your biometric',
        disableDeviceFallback: false,
      });

      if (result.success) {
        // Auto-fill with saved credentials (if any)
        // This would typically come from secure storage
        if (hapticFeedback) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    } catch (error) {
      console.log('Biometric auth error:', error);
    }
  };

  const navigateToRegister = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    navigation.navigate('Register');
  };

  const navigateToForgotPassword = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    navigation.navigate('ForgotPassword');
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar 
        barStyle={theme.isDark ? 'light-content' : 'dark-content'} 
        backgroundColor="transparent" 
        translucent 
      />
      
      {/* Animated Background */}
      <LinearGradient
        colors={theme.gradients.primary}
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
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Floating Particles Background */}
          <View style={{
            position: 'absolute',
            top: 100,
            left: 50,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.1)',
          }} />
          <View style={{
            position: 'absolute',
            top: 200,
            right: 80,
            width: 15,
            height: 15,
            borderRadius: 7.5,
            backgroundColor: 'rgba(255,255,255,0.15)',
          }} />
          <View style={{
            position: 'absolute',
            top: 300,
            left: 100,
            width: 25,
            height: 25,
            borderRadius: 12.5,
            backgroundColor: 'rgba(255,255,255,0.08)',
          }} />
        </Animated.View>
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
          {/* Logo Section */}
          <Animated.View
            style={{
              alignItems: 'center',
              marginBottom: theme.spacing.xl * 2,
              transform: [
                { scale: logoAnim },
                { scale: pulseAnim },
              ],
            }}
          >
            <View style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: 'rgba(255,255,255,0.15)',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: theme.spacing.lg,
              ...theme.shadows.xl,
            }}>
              <Ionicons name="ticket" size={60} color="white" />
            </View>
            <Text style={{
              ...theme.typography.h1,
              color: 'white',
              fontWeight: 'bold',
              marginBottom: theme.spacing.sm,
            }}>
              UltraTickets
            </Text>
            <Text style={{
              ...theme.typography.body1,
              color: 'rgba(255,255,255,0.8)',
              textAlign: 'center',
            }}>
              Your gateway to amazing events
            </Text>
          </Animated.View>

          {/* Login Form */}
          <Animated.View
            style={{
              transform: [{ scale: formAnim }],
              opacity: formAnim,
            }}
          >
            <UltraCard variant="glass" blur={true} style={{ marginBottom: theme.spacing.lg }}>
              <Text style={{
                ...theme.typography.h3,
                color: 'white',
                marginBottom: theme.spacing.lg,
                textAlign: 'center',
              }}>
                Welcome Back
              </Text>

              {/* Email Input */}
              <View style={{ marginBottom: theme.spacing.md }}>
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
                  borderColor: 'rgba(255,255,255,0.2)',
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
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Password Input */}
              <View style={{ marginBottom: theme.spacing.lg }}>
                <Text style={{
                  ...theme.typography.caption,
                  color: 'rgba(255,255,255,0.8)',
                  marginBottom: theme.spacing.sm,
                }}>
                  PASSWORD
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: theme.borderRadius.md,
                  paddingHorizontal: theme.spacing.md,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.2)',
                }}>
                  <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.6)" />
                  <TextInput
                    style={{
                      flex: 1,
                      ...theme.typography.body1,
                      color: 'white',
                      paddingVertical: theme.spacing.md,
                      paddingLeft: theme.spacing.sm,
                    }}
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={{ padding: theme.spacing.sm }}
                  >
                    <Ionicons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="rgba(255,255,255,0.6)" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Remember Me & Forgot Password */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: theme.spacing.lg,
              }}>
                <TouchableOpacity
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <Ionicons 
                    name={rememberMe ? "checkbox" : "checkbox-outline"} 
                    size={20} 
                    color="rgba(255,255,255,0.8)" 
                  />
                  <Text style={{
                    ...theme.typography.body2,
                    color: 'rgba(255,255,255,0.8)',
                    marginLeft: theme.spacing.sm,
                  }}>
                    Remember me
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={navigateToForgotPassword}>
                  <Text style={{
                    ...theme.typography.body2,
                    color: 'white',
                    fontWeight: '600',
                  }}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              {isLoading ? (
                <View style={{ 
                  height: 56, 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: theme.borderRadius.md,
                }}>
                  <UltraLoading variant="spinner" size="medium" color="white" />
                </View>
              ) : (
                <UltraButton
                  title="Sign In"
                  onPress={handleLogin}
                  variant="gradient"
                  size="large"
                  fullWidth
                  style={{ marginBottom: theme.spacing.md }}
                />
              )}

              {/* Biometric Login */}
              <TouchableOpacity
                onPress={handleBiometricLogin}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: theme.spacing.md,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: theme.borderRadius.md,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.2)',
                }}
              >
                <Ionicons name="finger-print" size={24} color="rgba(255,255,255,0.8)" />
                <Text style={{
                  ...theme.typography.body1,
                  color: 'rgba(255,255,255,0.8)',
                  marginLeft: theme.spacing.sm,
                }}>
                  Use Biometric
                </Text>
              </TouchableOpacity>
            </UltraCard>

            {/* Register Link */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Text style={{
                ...theme.typography.body1,
                color: 'rgba(255,255,255,0.8)',
              }}>
                Don't have an account? 
              </Text>
              <TouchableOpacity onPress={navigateToRegister} style={{ marginLeft: theme.spacing.sm }}>
                <Text style={{
                  ...theme.typography.body1,
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
