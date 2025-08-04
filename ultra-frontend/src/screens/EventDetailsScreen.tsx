// 🎫 EVENT DETAILS SCREEN
// Revolutionary event viewing experience

import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { UltraCard } from '../components/UltraComponents';

interface EventDetailsScreenProps {
  navigation: any;
  route: any;
}

export const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const { eventId } = route.params;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={{ flex: 1, padding: theme.spacing.lg }}>
        <UltraCard>
          <Text style={{ ...theme.typography.h1, color: theme.colors.text }}>
            Event Details
          </Text>
          <Text style={{ ...theme.typography.body1, color: theme.colors.textSecondary, marginTop: theme.spacing.md }}>
            Event ID: {eventId}
          </Text>
          <Text style={{ ...theme.typography.body1, color: theme.colors.textSecondary, marginTop: theme.spacing.md }}>
            🚧 Coming Soon: Full event details with 3D venue visualization!
          </Text>
        </UltraCard>
      </ScrollView>
    </SafeAreaView>
  );
};
