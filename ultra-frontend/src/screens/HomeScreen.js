import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🎫 Ultra Ticketing</Text>
          <Text style={styles.headerSubtitle}>Welcome to your event hub!</Text>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <View style={styles.actionGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('Events')}
            >
              <Ionicons name="calendar" size={32} color="#007AFF" />
              <Text style={styles.actionTitle}>Browse Events</Text>
              <Text style={styles.actionSubtitle}>Discover amazing events</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('MyTickets')}
            >
              <Ionicons name="ticket" size={32} color="#28a745" />
              <Text style={styles.actionTitle}>My Tickets</Text>
              <Text style={styles.actionSubtitle}>View your bookings</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person" size={32} color="#6c757d" />
              <Text style={styles.actionTitle}>Profile</Text>
              <Text style={styles.actionSubtitle}>Manage your account</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => {
                // You can add more functionality here
                navigation.navigate('Events');
              }}
            >
              <Ionicons name="search" size={32} color="#ffc107" />
              <Text style={styles.actionTitle}>Search</Text>
              <Text style={styles.actionSubtitle}>Find events near you</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Why Choose Ultra Ticketing?</Text>
          
          <View style={styles.featureItem}>
            <Ionicons name="flash" size={24} color="#007AFF" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Instant Booking</Text>
              <Text style={styles.featureDescription}>Book tickets instantly with just a few taps</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="shield-checkmark" size={24} color="#28a745" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Secure & Safe</Text>
              <Text style={styles.featureDescription}>Your data and payments are always protected</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Ionicons name="qr-code" size={24} color="#6c757d" />
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>QR Code Tickets</Text>
              <Text style={styles.featureDescription}>Easy entry with digital QR code tickets</Text>
            </View>
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
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  featuresSection: {
    padding: 20,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
