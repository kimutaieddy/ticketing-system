// 🚀 ULTRA-ADVANCED REGISTER SCREEN
// Revolutionary registration with progressive form validation and stunning animations

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
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { useUserStore, useThemeStore } from '../store';
import { UltraButton, UltraCard, UltraLoading } from '../components/UltraComponents';
import { apiClient } from '../services/api';

const { width, height } = Dimensions.get('window');

interface RegisterScreenProps {
  navigation: any;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { login } = useUserStore();
  const { hapticFeedback } = useThemeStore();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // 'user' or 'organizer'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Validation state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fieldValidated, setFieldValidated] = useState<Record<string, boolean>>({});
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const stepAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Spectacular entrance animation
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
  }, []);

  useEffect(() => {
    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: currentStep / 3,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Animate step transition
    Animated.spring(stepAnim, {
      toValue: currentStep,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'firstName':
        return value.length < 2 ? 'First name must be at least 2 characters' : '';
      case 'lastName':
        return value.length < 2 ? 'Last name must be at least 2 characters' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : '';
      case 'password':
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain at least one uppercase, lowercase, and number';
        }
        return '';
      case 'confirmPassword':
        return value !== formData.password ? 'Passwords do not match' : '';
      default:
        return '';
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    const error = validateField(field, value);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
    setFieldValidated(prev => ({ ...prev, [field]: !error }));
    
    // Haptic feedback for validation
    if (hapticFeedback && fieldErrors[field] && !error) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && 
                 !fieldErrors.firstName && !fieldErrors.lastName);
      case 2:
        return !!(formData.email && !fieldErrors.email);
      case 3:
        return !!(formData.password && formData.confirmPassword && 
                 !fieldErrors.password && !fieldErrors.confirmPassword && acceptTerms);
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (isStepValid(currentStep)) {
      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      setCurrentStep(prev => Math.min(prev + 1, 3));
    } else {
      if (hapticFeedback) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      Alert.alert('Incomplete', 'Please fill in all required fields correctly');
    }
  };

  const handlePrevStep = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleRegister = async () => {
    if (!isStepValid(3)) {
      Alert.alert('Error', 'Please complete all fields correctly');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiClient.register({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        role: formData.role,
      });
      
      login(response.user, response.token);
      
      if (hapticFeedback) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      
      Alert.alert(
        'Welcome!',
        'Your account has been created successfully',
        [{ text: 'Continue', onPress: () => navigation.replace('MainTabs') }]
      );
      
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again');
      if (hapticFeedback) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    navigation.navigate('Login');
  };

  const renderProgressBar = () => (
    <View style={{
      height: 4,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 2,
      marginBottom: theme.spacing.lg,
    }}>
      <Animated.View
        style={{
          height: '100%',
          backgroundColor: 'white',
          borderRadius: 2,
          width: progressAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
        }}
      />
    </View>
  );

  const renderStepIndicator = () => (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    }}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: currentStep >= step ? 'white' : 'rgba(255,255,255,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Text style={{
              ...theme.typography.caption,
              color: currentStep >= step ? theme.colors.primary : 'white',
              fontWeight: 'bold',
            }}>
              {step}
            </Text>
          </View>
          {step < 3 && (
            <View style={{
              width: 40,
              height: 2,
              backgroundColor: currentStep > step ? 'white' : 'rgba(255,255,255,0.3)',
              marginHorizontal: theme.spacing.sm,
            }} />
          )}
        </View>
      ))}
    </View>
  );

  const renderFormField = (
    field: string,
    placeholder: string,
    icon: string,
    isPassword: boolean = false,
    showToggle: boolean = false,
    toggleValue?: boolean,
    onToggle?: () => void
  ) => (
    <View style={{ marginBottom: theme.spacing.md }}>
      <Text style={{
        ...theme.typography.caption,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: theme.spacing.sm,
      }}>
        {placeholder.toUpperCase()}
      </Text>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        borderWidth: 1,
        borderColor: fieldValidated[field] ? 'rgba(16,185,129,0.5)' : 
                     fieldErrors[field] ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.2)',
      }}>
        <Ionicons name={icon as any} size={20} color="rgba(255,255,255,0.6)" />
        <TextInput
          style={{
            flex: 1,
            ...theme.typography.body1,
            color: 'white',
            paddingVertical: theme.spacing.md,
            paddingLeft: theme.spacing.sm,
          }}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={formData[field as keyof typeof formData]}
          onChangeText={(value) => handleFieldChange(field, value)}
          secureTextEntry={isPassword && !toggleValue}
          autoCapitalize={field === 'email' ? 'none' : 'words'}
          keyboardType={field === 'email' ? 'email-address' : 'default'}
          autoCorrect={false}
        />
        {showToggle && (
          <TouchableOpacity onPress={onToggle} style={{ padding: theme.spacing.sm }}>
            <Ionicons 
              name={toggleValue ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color="rgba(255,255,255,0.6)" 
            />
          </TouchableOpacity>
        )}
        {fieldValidated[field] && (
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
        )}
      </View>
      {fieldErrors[field] && (
        <Text style={{
          ...theme.typography.caption,
          color: '#EF4444',
          marginTop: theme.spacing.xs,
        }}>
          {fieldErrors[field]}
        </Text>
      )}
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text style={{
        ...theme.typography.h3,
        color: 'white',
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
      }}>
        What's your name?
      </Text>
      <Text style={{
        ...theme.typography.body2,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: theme.spacing.lg,
        textAlign: 'center',
      }}>
        Let's start with the basics
      </Text>

      {renderFormField('firstName', 'First Name', 'person-outline')}
      {renderFormField('lastName', 'Last Name', 'person-outline')}
      
      <UltraButton
        title="Continue"
        onPress={handleNextStep}
        variant="gradient"
        size="large"
        fullWidth
        disabled={!isStepValid(1)}
      />
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={{
        ...theme.typography.h3,
        color: 'white',
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
      }}>
        Your email address
      </Text>
      <Text style={{
        ...theme.typography.body2,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: theme.spacing.lg,
        textAlign: 'center',
      }}>
        We'll use this to keep you updated
      </Text>

      {renderFormField('email', 'Email Address', 'mail-outline')}

      {/* Role Selection */}
      <Text style={{
        ...theme.typography.caption,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: theme.spacing.sm,
      }}>
        I WANT TO
      </Text>
      <View style={{
        flexDirection: 'row',
        marginBottom: theme.spacing.lg,
      }}>
        <TouchableOpacity
          onPress={() => handleFieldChange('role', 'user')}
          style={{
            flex: 1,
            padding: theme.spacing.md,
            backgroundColor: formData.role === 'user' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: formData.role === 'user' ? 'white' : 'rgba(255,255,255,0.2)',
            marginRight: theme.spacing.sm,
            alignItems: 'center',
          }}
        >
          <Ionicons name="ticket-outline" size={24} color="white" />
          <Text style={{
            ...theme.typography.body2,
            color: 'white',
            marginTop: theme.spacing.sm,
            textAlign: 'center',
          }}>
            Buy Tickets
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => handleFieldChange('role', 'organizer')}
          style={{
            flex: 1,
            padding: theme.spacing.md,
            backgroundColor: formData.role === 'organizer' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: formData.role === 'organizer' ? 'white' : 'rgba(255,255,255,0.2)',
            marginLeft: theme.spacing.sm,
            alignItems: 'center',
          }}
        >
          <Ionicons name="calendar-outline" size={24} color="white" />
          <Text style={{
            ...theme.typography.body2,
            color: 'white',
            marginTop: theme.spacing.sm,
            textAlign: 'center',
          }}>
            Create Events
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={{ flexDirection: 'row' }}>
        <UltraButton
          title="Back"
          onPress={handlePrevStep}
          variant="outline"
          size="large"
          style={{ flex: 1, marginRight: theme.spacing.sm }}
        />
        <UltraButton
          title="Continue"
          onPress={handleNextStep}
          variant="gradient"
          size="large"
          disabled={!isStepValid(2)}
          style={{ flex: 1, marginLeft: theme.spacing.sm }}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={{
        ...theme.typography.h3,
        color: 'white',
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
      }}>
        Secure your account
      </Text>
      <Text style={{
        ...theme.typography.body2,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: theme.spacing.lg,
        textAlign: 'center',
      }}>
        Create a strong password
      </Text>

      {renderFormField('password', 'Password', 'lock-closed-outline', true, true, showPassword, () => setShowPassword(!showPassword))}
      {renderFormField('confirmPassword', 'Confirm Password', 'lock-closed-outline', true, true, showConfirmPassword, () => setShowConfirmPassword(!showConfirmPassword))}

      {/* Terms and Conditions */}
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: theme.spacing.lg,
        }}
        onPress={() => setAcceptTerms(!acceptTerms)}
      >
        <Ionicons 
          name={acceptTerms ? "checkbox" : "checkbox-outline"} 
          size={20} 
          color="rgba(255,255,255,0.8)" 
        />
        <Text style={{
          ...theme.typography.body2,
          color: 'rgba(255,255,255,0.8)',
          marginLeft: theme.spacing.sm,
          flex: 1,
        }}>
          I agree to the Terms of Service and Privacy Policy
        </Text>
      </TouchableOpacity>

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
        <View style={{ flexDirection: 'row' }}>
          <UltraButton
            title="Back"
            onPress={handlePrevStep}
            variant="outline"
            size="large"
            style={{ flex: 1, marginRight: theme.spacing.sm }}
          />
          <UltraButton
            title="Create Account"
            onPress={handleRegister}
            variant="gradient"
            size="large"
            disabled={!isStepValid(3)}
            style={{ flex: 1, marginLeft: theme.spacing.sm }}
          />
        </View>
      )}
    </View>
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
        colors={[theme.colors.secondary, theme.colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: height,
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Header */}
            <View style={{
              alignItems: 'center',
              marginBottom: theme.spacing.xl,
            }}>
              <Text style={{
                ...theme.typography.h1,
                color: 'white',
                fontWeight: 'bold',
                marginBottom: theme.spacing.sm,
              }}>
                Join UltraTickets
              </Text>
              <Text style={{
                ...theme.typography.body1,
                color: 'rgba(255,255,255,0.8)',
                textAlign: 'center',
              }}>
                Create your account in just a few steps
              </Text>
            </View>

            <UltraCard variant="glass" blur={true}>
              {renderProgressBar()}
              {renderStepIndicator()}
              
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </UltraCard>

            {/* Login Link */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: theme.spacing.lg,
            }}>
              <Text style={{
                ...theme.typography.body1,
                color: 'rgba(255,255,255,0.8)',
              }}>
                Already have an account? 
              </Text>
              <TouchableOpacity onPress={navigateToLogin} style={{ marginLeft: theme.spacing.sm }}>
                <Text style={{
                  ...theme.typography.body1,
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
