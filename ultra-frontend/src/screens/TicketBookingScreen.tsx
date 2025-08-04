// 🎟️ TICKET BOOKING SCREEN
// Revolutionary booking experience with 3D seat selection

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { UltraCard } from '../components/UltraComponents';

interface TicketBookingScreenProps {
  navigation: any;
  route: any;
}

export const TicketBookingScreen: React.FC<TicketBookingScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const { eventId } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1, padding: theme.spacing.lg }}>
        <UltraCard>
          <Text style={{ ...theme.typography.h1, color: theme.colors.text }}>
            Book Tickets
          </Text>
          <Text style={{ ...theme.typography.body1, color: theme.colors.textSecondary, marginTop: theme.spacing.md }}>
            Event ID: {eventId}
          </Text>
          <Text style={{ ...theme.typography.body1, color: theme.colors.textSecondary, marginTop: theme.spacing.md }}>
            🚧 Coming Soon: 3D venue visualization and interactive seat selection!
          </Text>
        </UltraCard>
      </ScrollView>
    </SafeAreaView>
  );
};
