// 🎫 MY TICKETS SCREEN
// Revolutionary ticket management with QR codes and authentication check

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { useUserStore } from '../store';
import { UltraCard } from '../components/UltraComponents';
import { TicketsLoginPrompt } from './LoginPromptScreen';

export const MyTicketsScreen: React.FC = () => {
  const theme = useTheme();
  const { isAuthenticated } = useUserStore();

  // 🔐 Show login prompt if user is not authenticated
  if (!isAuthenticated) {
    return <TicketsLoginPrompt />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1, padding: theme.spacing.lg }}>
        <UltraCard>
          <Text style={{ ...theme.typography.h1, color: theme.colors.text }}>
            My Tickets
          </Text>
          <Text style={{ ...theme.typography.body1, color: theme.colors.textSecondary, marginTop: theme.spacing.md }}>
            🚧 Coming Soon: Your tickets with animated QR codes, transfer functionality, and offline access!
          </Text>
        </UltraCard>
      </ScrollView>
    </SafeAreaView>
  );
};
