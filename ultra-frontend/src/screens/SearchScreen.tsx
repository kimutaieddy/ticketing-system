import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SearchScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  const popularSearches = [
    'Taylor Swift',
    'Yankees',
    'Hamilton',
    'Ed Sheeran',
    'Comedy Shows',
    'NBA',
  ];

  const recentSearches = [
    'Concerts near me',
    'Broadway shows',
    'Basketball games',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for artists, events or venues"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {searchQuery.length === 0 ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Searches</Text>
              {popularSearches.map((search, index) => (
                <TouchableOpacity key={index} style={styles.searchItem}>
                  <Ionicons name="trending-up" size={16} color="#0066CC" />
                  <Text style={styles.searchText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              {recentSearches.map((search, index) => (
                <TouchableOpacity key={index} style={styles.searchItem}>
                  <Ionicons name="time" size={16} color="#999" />
                  <Text style={styles.searchText}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Results</Text>
            <Text style={styles.noResults}>No results found for "{searchQuery}"</Text>
          </View>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  cancelText: {
    fontSize: 16,
    color: '#0066CC',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  noResults: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
  },
});
