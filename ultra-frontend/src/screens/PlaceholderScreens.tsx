// 🎭 PLACEHOLDER SCREENS
// Temporary screens for tab navigation

import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme';

// 🔍 Explore Screen
export const ExploreScreen = () => {
  const theme = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
      }}>
        <Text style={{
          fontSize: 24,
          fontWeight: '700',
          color: theme.colors.text,
          textAlign: 'center',
          marginBottom: 12,
        }}>
          🔍 Explore Events
        </Text>
        <Text style={{
          fontSize: 16,
          color: theme.colors.textSecondary,
          textAlign: 'center',
        }}>
          Coming soon with revolutionary event discovery!
        </Text>
      </View>
    </SafeAreaView>
  );
};

// 🎫 Tickets Screen
export const TicketsScreen = () => {
  const theme = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
      }}>
        <Text style={{
          fontSize: 24,
          fontWeight: '700',
          color: theme.colors.text,
          textAlign: 'center',
          marginBottom: 12,
        }}>
          🎫 My Tickets
        </Text>
        <Text style={{
          fontSize: 16,
          color: theme.colors.textSecondary,
          textAlign: 'center',
        }}>
          Your tickets will appear here with spectacular animations!
        </Text>
      </View>
    </SafeAreaView>
  );
};

// 👤 Profile Screen
export const ProfileScreen = () => {
  const theme = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
      }}>
        <Text style={{
          fontSize: 24,
          fontWeight: '700',
          color: theme.colors.text,
          textAlign: 'center',
          marginBottom: 12,
        }}>
          👤 Profile
        </Text>
        <Text style={{
          fontSize: 16,
          color: theme.colors.textSecondary,
          textAlign: 'center',
        }}>
          Revolutionary profile experience coming soon!
        </Text>
      </View>
    </SafeAreaView>
  );
};
