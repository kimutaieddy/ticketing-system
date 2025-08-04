// 🎫 MY TICKETS SCREEN
// Revolutionary ticket management with QR codes

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { UltraCard } from '../components/UltraComponents';

export const MyTicketsScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1, padding: theme.spacing.lg }}>
        <UltraCard>
          <Text style={{ ...theme.typography.h1, color: theme.colors.text }}>
            My Tickets
          </Text>
          <Text style={{ ...theme.typography.body1, color: theme.colors.textSecondary, marginTop: theme.spacing.md }}>
            🚧 Coming Soon: Your tickets with animated QR codes and transfer functionality!
          </Text>
        </UltraCard>
      </ScrollView>
    </SafeAreaView>
  );
};
