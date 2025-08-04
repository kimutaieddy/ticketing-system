// 🌟 ULTRA-ADVANCED ONBOARDING SCREEN
// Revolutionary first-time user experience with stunning animations

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  Animated,
  StatusBar,
  TouchableOpacity,
  PanGestureHandler,
  State,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { MMKV } from 'react-native-mmkv';
import { useTheme } from '../theme';
import { useThemeStore } from '../store';
import { UltraButton, UltraCard } from '../components/UltraComponents';

// 🗄️ Storage for onboarding state
const storage = new MMKV();

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  navigation: any;
}

interface OnboardingSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: string[];
}

const onboardingData: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Discover Amazing Events',
    subtitle: 'Find Your Next Adventure',
    description: 'Explore thousands of concerts, sports, conferences, and entertainment events happening near you.',
    icon: 'search',
    gradient: ['#667eea', '#764ba2'],
  },
  {
    id: 2,
    title: 'Book Instantly',
    subtitle: 'Secure Your Spot',
    description: 'Quick and secure booking with multiple payment options. Get your digital tickets instantly.',
    icon: 'ticket',
    gradient: ['#f093fb', '#f5576c'],
  },
  {
    id: 3,
    title: 'Smart QR Scanning',
    subtitle: 'Seamless Entry',
    description: 'Show your QR code at the venue for contactless, instant entry. No more waiting in long lines.',
    icon: 'qr-code',
    gradient: ['#4facfe', '#00f2fe'],
  },
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { hapticFeedback } = useThemeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Animation values
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const dotAnimations = useRef(onboardingData.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Animate current dot
    dotAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: index === currentIndex ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    // Icon rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, [currentIndex]);

  const nextSlide = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (currentIndex < onboardingData.length - 1) {
      // Slide out animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex(currentIndex + 1);
        slideAnim.setValue(width);
        
        // Slide in animation
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      navigateToLogin();
    }
  };

  const previousSlide = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (currentIndex > 0) {
      // Slide out animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex(currentIndex - 1);
        slideAnim.setValue(-width);
        
        // Slide in animation
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }
  };

  const navigateToLogin = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    // Mark onboarding as seen
    storage.set('hasSeenOnboarding', true);

    // Exit animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate directly to main app
      navigation.replace('MainTabs');
    });
  };

  const skipOnboarding = () => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Mark onboarding as seen and navigate to main app
    storage.set('hasSeenOnboarding', true);
    navigation.replace('MainTabs');
  };

  const currentSlide = onboardingData[currentIndex];

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Dynamic Background */}
      <LinearGradient
        colors={currentSlide.gradient}
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
        <Animated.View
          style={{
            position: 'absolute',
            top: 100,
            left: 50,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: 'rgba(255,255,255,0.1)',
            transform: [
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        />
        <Animated.View
          style={{
            position: 'absolute',
            top: 200,
            right: 80,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.15)',
            transform: [
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['360deg', '0deg'],
                }),
              },
            ],
          }}
        />
      </LinearGradient>

      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        {/* Skip Button */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingTop: 60,
          paddingHorizontal: theme.spacing.lg,
        }}>
          <TouchableOpacity onPress={skipOnboarding}>
            <Text style={{
              ...theme.typography.body1,
              color: 'rgba(255,255,255,0.8)',
              fontWeight: '600',
            }}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <Animated.View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: theme.spacing.lg,
            transform: [
              { translateX: slideAnim },
              { scale: scaleAnim },
            ],
            opacity: fadeAnim,
          }}
        >
          {/* Icon */}
          <View style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: theme.spacing.xl,
            ...theme.shadows.xl,
          }}>
            <Ionicons name={currentSlide.icon} size={60} color="white" />
          </View>

          {/* Text Content */}
          <Text style={{
            ...theme.typography.h1,
            color: 'white',
            textAlign: 'center',
            marginBottom: theme.spacing.md,
            fontWeight: 'bold',
          }}>
            {currentSlide.title}
          </Text>

          <Text style={{
            ...theme.typography.h3,
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            marginBottom: theme.spacing.lg,
            fontWeight: '600',
          }}>
            {currentSlide.subtitle}
          </Text>

          <Text style={{
            ...theme.typography.body1,
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            lineHeight: 24,
            paddingHorizontal: theme.spacing.md,
          }}>
            {currentSlide.description}
          </Text>
        </Animated.View>

        {/* Bottom Navigation */}
        <View style={{
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: 50,
        }}>
          {/* Page Indicators */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: theme.spacing.xl,
          }}>
            {onboardingData.map((_, index) => (
              <Animated.View
                key={index}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.4)',
                  marginHorizontal: 4,
                  transform: [
                    {
                      scale: dotAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.5],
                      }),
                    },
                  ],
                  opacity: dotAnimations[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.4, 1],
                  }),
                }}
              />
            ))}
          </View>

          {/* Navigation Buttons */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              onPress={previousSlide}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: 'rgba(255,255,255,0.2)',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: currentIndex > 0 ? 1 : 0.5,
              }}
              disabled={currentIndex === 0}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>

            <UltraButton
              title={currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
              onPress={nextSlide}
              variant="outline"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderColor: 'rgba(255,255,255,0.4)',
                paddingHorizontal: theme.spacing.xl,
              }}
            />

            <TouchableOpacity
              onPress={nextSlide}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: 'rgba(255,255,255,0.2)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};
