import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function EventsScreen() {
  const navigation = useNavigation();

  const events = [
    {
      id: 1,
      title: 'Summer Music Festival',
      date: 'August 15, 2025',
      location: 'Central Park',
      price: '$99',
      description: 'The biggest music festival of the summer!',
    },
    {
      id: 2,
      title: 'Tech Conference 2025',
      date: 'September 10, 2025',
      location: 'Convention Center',
      price: '$149',
      description: 'Learn about the latest in technology.',
    },
    {
      id: 3,
      title: 'Food & Wine Festival',
      date: 'October 5, 2025',
      location: 'Downtown Plaza',
      price: '$75',
      description: 'Taste amazing food and wine from local vendors.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        <Text style={styles.subtitle}>Discover amazing events near you</Text>
      </View>

      <ScrollView style={styles.content}>
        {events.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
          >
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventPrice}>{event.price}</Text>
            </View>
            
            <View style={styles.eventDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{event.date}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.detailText}>{event.location}</Text>
              </View>
            </View>
            
            <Text style={styles.eventDescription}>{event.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eventCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
    marginRight: 10,
  },
  eventPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  eventDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
});
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
