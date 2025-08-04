// 🔐 LOGIN PROMPT SCREEN
// Beautiful authentication prompt for unauthenticated users

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';

// 🎨 Revolutionary Components & Systems
import { UltraButton, UltraCard } from '../components/UltraComponents';
import { useTheme } from '../theme';

const { width, height } = Dimensions.get('window');

interface LoginPromptProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const LoginPromptScreen: React.FC<LoginPromptProps> = ({
  title,
  subtitle,
  icon,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Login' as never);
  };

  const handleRegister = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('Register' as never);
  };

  const handleBrowse = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Home' as never);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
      
      {/* 🌌 Background Gradient */}
      <LinearGradient
        colors={[
          theme.colors.primary + '20',
          theme.colors.secondary + '10',
          theme.colors.background,
        ]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        {/* 🎯 Main Content */}
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          {/* 🎨 Icon Container */}
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: theme.colors.primary + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 32,
            }}
          >
            <Ionicons
              name={icon}
              size={64}
              color={theme.colors.primary}
            />
          </View>

          {/* 📝 Title & Subtitle */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: theme.colors.text,
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: theme.colors.textSecondary,
              textAlign: 'center',
              lineHeight: 24,
              paddingHorizontal: 24,
            }}
          >
            {subtitle}
          </Text>
        </View>

        {/* 🚀 Action Buttons */}
        <View style={{ gap: 16 }}>
          <UltraButton
            title="Sign In"
            onPress={handleLogin}
            variant="primary"
            icon="log-in-outline"
            style={{ marginBottom: 8 }}
          />

          <UltraButton
            title="Create Account"
            onPress={handleRegister}
            variant="secondary"
            icon="person-add-outline"
            style={{ marginBottom: 16 }}
          />

          {/* 🎪 Browse Events Option */}
          <TouchableOpacity
            onPress={handleBrowse}
            style={{
              padding: 16,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: theme.colors.primary,
                fontWeight: '600',
              }}
            >
              Browse Events Without Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* 🎨 Bottom Decoration */}
        <View
          style={{
            position: 'absolute',
            bottom: 48,
            left: 0,
            right: 0,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.textSecondary,
              textAlign: 'center',
            }}
          >
            Discover amazing events and book tickets securely
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

// 🎫 Pre-configured components for different screens
export const TicketsLoginPrompt = () => (
  <LoginPromptScreen
    title="Your Ticket Collection"
    subtitle="Sign in to view your purchased tickets, access QR codes, and manage your bookings."
    icon="ticket-outline"
  />
);

export const ProfileLoginPrompt = () => (
  <LoginPromptScreen
    title="Your Profile"
    subtitle="Create an account to personalize your experience, save favorites, and access exclusive features."
    icon="person-outline"
  />
);
