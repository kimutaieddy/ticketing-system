import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function EventDetailsScreen({ route }) {
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Mock event data - would come from route.params in real app
  const event = {
    id: 1,
    title: 'Taylor Swift | The Eras Tour',
    artist: 'Taylor Swift',
    venue: 'MetLife Stadium',
    city: 'East Rutherford, NJ',
    date: 'Aug 15, 2025',
    time: '7:00 PM',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    minPrice: 89,
    maxPrice: 599,
    description: 'Taylor Swift brings The Eras Tour to MetLife Stadium for an unforgettable night celebrating her entire musical journey. Experience hits from every era in this spectacular show.',
    genre: 'Pop',
    duration: '3h 30m',
    ageLimit: 'All Ages',
    ticketTypes: [
      { id: 1, name: 'General Admission', price: 89, available: true },
      { id: 2, name: 'Reserved Seating', price: 149, available: true },
      { id: 3, name: 'Premium', price: 299, available: true },
      { id: 4, name: 'VIP Package', price: 599, available: false },
    ]
  };

  const handleSelectTickets = () => {
    navigation.navigate('SelectTickets', { event });
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#FF3B30" : "#333"} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 15 }}>
            <Ionicons name="share-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Event Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.image }} style={styles.eventImage} />
          <View style={styles.imageOverlay}>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Event Info */}
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventArtist}>{event.artist}</Text>
          
          <View style={styles.eventDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <Text style={styles.detailText}>{event.date} • {event.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.detailText}>{event.venue}, {event.city}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.detailText}>Duration: {event.duration}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text style={styles.detailText}>{event.ageLimit}</Text>
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Tickets from</Text>
            <Text style={styles.priceRange}>${event.minPrice} - ${event.maxPrice}</Text>
            <Text style={styles.priceNote}>*Prices may include service fees</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="calendar-outline" size={24} color="#0066CC" />
            <Text style={styles.actionText}>Add to Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="people-outline" size={24} color="#0066CC" />
            <Text style={styles.actionText}>Find Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="car-outline" size={24} color="#0066CC" />
            <Text style={styles.actionText}>Parking</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* Ticket Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ticket Options</Text>
          {event.ticketTypes.map(ticket => (
            <View key={ticket.id} style={styles.ticketOption}>
              <View style={styles.ticketInfo}>
                <Text style={styles.ticketName}>{ticket.name}</Text>
                <Text style={[
                  styles.ticketAvailability,
                  { color: ticket.available ? '#22C55E' : '#FF3B30' }
                ]}>
                  {ticket.available ? 'Available' : 'Sold Out'}
                </Text>
              </View>
              <Text style={styles.ticketPrice}>${ticket.price}</Text>
            </View>
          ))}
        </View>

        {/* Venue Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Venue</Text>
          <View style={styles.venueInfo}>
            <Text style={styles.venueName}>{event.venue}</Text>
            <Text style={styles.venueAddress}>{event.city}</Text>
            <TouchableOpacity style={styles.venueButton}>
              <Text style={styles.venueButtonText}>View Seating Chart</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Similar Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>You Might Also Like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3].map(item => (
              <TouchableOpacity key={item} style={styles.similarEvent}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=200' }} 
                  style={styles.similarImage} 
                />
                <Text style={styles.similarTitle}>Similar Event {item}</Text>
                <Text style={styles.similarDate}>Sep 20, 2025</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCTA}>
        <View style={styles.ctaInfo}>
          <Text style={styles.ctaPrice}>From ${event.minPrice}</Text>
          <Text style={styles.ctaNote}>Select your tickets</Text>
        </View>
        <TouchableOpacity style={styles.ctaButton} onPress={handleSelectTickets}>
          <Text style={styles.ctaButtonText}>Find Tickets</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  eventImage: {
    width: width,
    height: 250,
    backgroundColor: '#F0F0F0',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventInfo: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  eventArtist: {
    fontSize: 18,
    color: '#0066CC',
    marginBottom: 20,
  },
  eventDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  priceSection: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  priceRange: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  priceNote: {
    fontSize: 12,
    color: '#999',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: '#0066CC',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  ticketOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  ticketInfo: {
    flex: 1,
  },
  ticketName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  ticketAvailability: {
    fontSize: 14,
    fontWeight: '500',
  },
  ticketPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  venueInfo: {
    alignItems: 'flex-start',
  },
  venueName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  venueAddress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  venueButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  venueButtonText: {
    color: '#0066CC',
    fontSize: 16,
    fontWeight: '600',
  },
  similarEvent: {
    width: 150,
    marginRight: 15,
  },
  similarImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  similarTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  similarDate: {
    fontSize: 12,
    color: '#666',
  },
  bottomCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  ctaInfo: {
    flex: 1,
  },
  ctaPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ctaNote: {
    fontSize: 14,
    color: '#666',
  },
  ctaButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EventDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params || { eventId: 1 };

  // Mock event data
  const event = {
    id: eventId,
    title: 'Summer Music Festival',
    date: 'August 15, 2025',
    time: '6:00 PM - 11:00 PM',
    location: 'Central Park, New York',
    price: '$99',
    description: 'Join us for the biggest music festival of the summer! Featuring top artists from around the world, food trucks, and amazing atmosphere. This is an event you don\'t want to miss!',
    features: [
      'Live performances by 10+ artists',
      'Food and beverage vendors',
      'VIP packages available',
      'Free parking',
      'All ages welcome',
    ],
    organizer: 'Music Events Co.',
  };

  const handlePurchaseTicket = () => {
    navigation.navigate('PurchaseTicket', { eventId: event.id });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#2C3E50" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Event Image Placeholder */}
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={48} color="#BDC3C7" />
          <Text style={styles.imagePlaceholderText}>Event Image</Text>
        </View>

        {/* Event Info */}
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventPrice}>{event.price}</Text>
        </View>

        {/* Event Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color="#007AFF" />
            <Text style={styles.detailText}>{event.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color="#007AFF" />
            <Text style={styles.detailText}>{event.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={20} color="#007AFF" />
            <Text style={styles.detailText}>{event.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={20} color="#007AFF" />
            <Text style={styles.detailText}>Organized by {event.organizer}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Included</Text>
          {event.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Purchase Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchaseTicket}>
          <Text style={styles.purchaseButtonText}>Purchase Ticket</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 12,
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#BDC3C7',
    marginTop: 8,
  },
  eventInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
    marginRight: 10,
  },
  eventPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  detailsSection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 12,
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#7F8C8D',
    lineHeight: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  purchaseButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  purchaseButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});
