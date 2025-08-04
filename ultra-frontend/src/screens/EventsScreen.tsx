// 🎪 EVENTS SCREEN
// Browse all available events with revolutionary UI

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Components and Theme
import { UltraCard, UltraButton } from '../components/UltraComponents';
import { useTheme } from '../theme';
import { useThemeStore, useEventsStore } from '../store';

const { width } = Dimensions.get('window');

export const EventsScreen = () => {
  const theme = useTheme();
  const { isDark } = useThemeStore();
  const { events, fetchEvents } = useEventsStore();

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        }}>
          <Text style={{
            fontSize: 28,
            fontWeight: '800',
            color: theme.colors.text,
            marginBottom: 4,
          }}>
            🎪 All Events
          </Text>
          <Text style={{
            fontSize: 16,
            color: theme.colors.textSecondary,
          }}>
            Discover amazing events near you
          </Text>
        </View>

        {/* Events List */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {events.map((event, index) => (
            <TouchableOpacity
              key={event.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                // TODO: Navigate to event details
              }}
              style={{ marginBottom: 16 }}
            >
              <UltraCard style={{ padding: 20 }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 12,
                }}>
                  <View style={{
                    backgroundColor: theme.colors.primary + '20',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                  }}>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: theme.colors.primary,
                    }}>
                      {event.category}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      // TODO: Toggle favorite
                    }}
                  >
                    <Ionicons 
                      name="heart-outline" 
                      size={24} 
                      color={theme.colors.textSecondary} 
                    />
                  </TouchableOpacity>
                </View>

                <Text style={{
                  fontSize: 20,
                  fontWeight: '700',
                  color: theme.colors.text,
                  marginBottom: 8,
                }}>
                  {event.title}
                </Text>

                <Text style={{
                  fontSize: 14,
                  color: theme.colors.textSecondary,
                  marginBottom: 4,
                }}>
                  📅 {event.date}
                </Text>

                <Text style={{
                  fontSize: 14,
                  color: theme.colors.textSecondary,
                  marginBottom: 16,
                }}>
                  📍 {event.venue}
                </Text>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    fontSize: 24,
                    fontWeight: '800',
                    color: theme.colors.primary,
                  }}>
                    ${event.price}
                  </Text>

                  <UltraButton
                    title="View Details"
                    size="small"
                    variant="secondary"
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      // TODO: Navigate to details
                    }}
                  />
                </View>
              </UltraCard>
            </TouchableOpacity>
          ))}

          {/* Bottom spacing for tab bar */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};
