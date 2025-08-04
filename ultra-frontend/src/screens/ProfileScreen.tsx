// 👤 PROFILE SCREEN
// Revolutionary user profile management with authentication check

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { useUserStore } from '../store';
import { UltraCard } from '../components/UltraComponents';
import { ProfileLoginPrompt } from './LoginPromptScreen';

export const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const { isAuthenticated, user } = useUserStore();

  // 🔐 Show login prompt if user is not authenticated
  if (!isAuthenticated) {
    return <ProfileLoginPrompt />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1, padding: theme.spacing.lg }}>
        <UltraCard>
          <Text style={{ ...theme.typography.h1, color: theme.colors.text }}>
            Welcome, {user?.name || 'User'}!
          </Text>
          <Text style={{ ...theme.typography.body1, color: theme.colors.textSecondary, marginTop: theme.spacing.md }}>
            🚧 Coming Soon: Complete profile management with biometric settings, preferences, and account management!
          </Text>
        </UltraCard>
      </ScrollView>
    </SafeAreaView>
  );
};
