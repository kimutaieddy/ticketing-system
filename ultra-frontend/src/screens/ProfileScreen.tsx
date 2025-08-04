// 👤 PROFILE SCREEN
// Revolutionary user profile management

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { UltraCard } from '../components/UltraComponents';

export const ProfileScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1, padding: theme.spacing.lg }}>
        <UltraCard>
          <Text style={{ ...theme.typography.h1, color: theme.colors.text }}>
            Profile
          </Text>
          <Text style={{ ...theme.typography.body1, color: theme.colors.textSecondary, marginTop: theme.spacing.md }}>
            🚧 Coming Soon: Complete profile management with biometric settings!
          </Text>
        </UltraCard>
      </ScrollView>
    </SafeAreaView>
  );
};
