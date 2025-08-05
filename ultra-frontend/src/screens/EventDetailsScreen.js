import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ApiService from '../services/api';

export const EventDetailsScreen = ({ route, navigation }) => {
  const { event } = route.params || {};

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={64} color="#dc3545" />
          <Text style={styles.errorText}>Event not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBookTicket = async () => {
    try {
      const response = await ApiService.bookTicket(event.id);
      Alert.alert(
        'Success!', 
        'Ticket booked successfully!',
        [
          { text: 'View My Tickets', onPress: () => navigation.navigate('MyTickets') },
          { text: 'OK' }
        ]
      );
    } catch (error) {
      console.error('Error booking ticket:', error);
      Alert.alert('Error', error.message || 'Failed to book ticket. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Event Details</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventName}>{event.name}</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
          </View>

          <Text style={styles.eventDescription}>{event.description}</Text>

          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Ionicons name="location" size={24} color="#007AFF" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailText}>{event.location}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={24} color="#28a745" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Date & Time</Text>
                <Text style={styles.detailText}>
                  {new Date(event.start_time).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
                <Text style={styles.detailText}>
                  {new Date(event.start_time).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {event.end_time && ` - ${new Date(event.end_time).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Ionicons name="people" size={24} color="#6c757d" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Capacity</Text>
                <Text style={styles.detailText}>{event.capacity} attendees</Text>
              </View>
            </View>

            {event.organizer && (
              <View style={styles.detailRow}>
                <Ionicons name="person" size={24} color="#ffc107" />
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Organizer</Text>
                  <Text style={styles.detailText}>{event.organizer}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={handleBookTicket}
            >
              <Ionicons name="ticket" size={20} color="white" />
              <Text style={styles.bookButtonText}>Book Ticket</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={() => Alert.alert('Coming Soon', 'Share feature is coming soon!')}
            >
              <Ionicons name="share" size={20} color="#007AFF" />
              <Text style={styles.shareButtonText}>Share Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  eventCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  eventDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  detailContent: {
    flex: 1,
    marginLeft: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 0.6,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  shareButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 0.35,
  },
  shareButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
