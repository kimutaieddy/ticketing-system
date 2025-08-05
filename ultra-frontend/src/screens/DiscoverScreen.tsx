import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const navigation = useNavigation();
  const [location, setLocation] = useState('New York, NY');

  // Mock featured events - like Ticketmaster's homepage
  const featuredEvents = [
    {
      id: 1,
      title: 'Taylor Swift | The Eras Tour',
      venue: 'MetLife Stadium',
      date: 'Aug 15',
      image: 'https://via.placeholder.com/300x200/FF6B6B/white?text=Taylor+Swift',
      price: 'From $89',
      category: 'Music',
    },
    {
      id: 2,
      title: 'Yankees vs Red Sox',
      venue: 'Yankee Stadium',
      date: 'Aug 20',
      image: 'https://via.placeholder.com/300x200/4ECDC4/white?text=Yankees',
      price: 'From $45',
      category: 'Sports',
    },
    {
      id: 3,
      title: 'Hamilton',
      venue: 'Richard Rodgers Theatre',
      date: 'Aug 25',
      image: 'https://via.placeholder.com/300x200/45B7D1/white?text=Hamilton',
      price: 'From $199',
      category: 'Theatre',
    },
  ];

  // Categories like Ticketmaster
  const categories = [
    { id: 1, name: 'Music', icon: 'musical-notes', color: '#FF6B6B' },
    { id: 2, name: 'Sports', icon: 'basketball', color: '#4ECDC4' },
    { id: 3, name: 'Theatre', icon: 'sparkles', color: '#45B7D1' },
    { id: 4, name: 'Comedy', icon: 'happy', color: '#96CEB4' },
    { id: 5, name: 'Family', icon: 'heart', color: '#FECA57' },
    { id: 6, name: 'More', icon: 'ellipsis-horizontal', color: '#A8A8A8' },
  ];

  // Popular events near you
  const nearYouEvents = [
    {
      id: 4,
      title: 'Ed Sheeran',
      venue: 'Madison Square Garden',
      date: 'Sep 5',
      price: 'From $125',
    },
    {
      id: 5,
      title: 'Knicks vs Lakers',
      venue: 'Madison Square Garden',
      date: 'Sep 12',
      price: 'From $89',
    },
    {
      id: 6,
      title: 'The Lion King',
      venue: 'Minskoff Theatre',
      date: 'Sep 18',
      price: 'From $79',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header - Ticketmaster style */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.logo}>Ticketing</Text>
          <TouchableOpacity style={styles.locationButton}>
            <Ionicons name="location-outline" size={16} color="#0066CC" />
            <Text style={styles.locationText}>{location}</Text>
            <Ionicons name="chevron-down" size={16} color="#0066CC" />
          </TouchableOpacity>
        </View>
        
        {/* Search bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={20} color="#999" />
          <Text style={styles.searchPlaceholder}>Search for artists, events or venues</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryItem}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Ionicons name={category.icon} size={24} color="white" />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Events Carousel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Events</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.carousel}
          >
            {featuredEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.featuredCard}
                onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
              >
                <Image source={{ uri: event.image }} style={styles.eventImage} />
                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
                  <Text style={styles.eventVenue}>{event.venue}</Text>
                  <View style={styles.eventBottom}>
                    <Text style={styles.eventDate}>{event.date}</Text>
                    <Text style={styles.eventPrice}>{event.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Near You */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Near You</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {nearYouEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.listItem}
              onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
            >
              <View style={styles.listItemContent}>
                <View style={styles.listItemInfo}>
                  <Text style={styles.listItemTitle}>{event.title}</Text>
                  <Text style={styles.listItemVenue}>{event.venue}</Text>
                  <Text style={styles.listItemDate}>{event.date}</Text>
                </View>
                <View style={styles.listItemRight}>
                  <Text style={styles.listItemPrice}>{event.price}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#999" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 14,
    color: '#0066CC',
    marginHorizontal: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#999',
    marginLeft: 10,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 16,
    color: '#0066CC',
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    width: (width - 60) / 3,
    marginBottom: 20,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  carousel: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  featuredCard: {
    width: 250,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  eventInfo: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  eventVenue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  eventBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventDate: {
    fontSize: 14,
    color: '#0066CC',
    fontWeight: '600',
  },
  eventPrice: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  listItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  listItemContent: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  listItemInfo: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  listItemVenue: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  listItemDate: {
    fontSize: 14,
    color: '#0066CC',
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
});
