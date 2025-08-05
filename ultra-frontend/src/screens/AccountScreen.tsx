import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function AccountScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  const accountOptions = [
    {
      id: 1,
      title: 'Orders & Tickets',
      subtitle: 'View your purchase history',
      icon: 'ticket-outline',
      action: () => {},
    },
    {
      id: 2,
      title: 'Payment Methods',
      subtitle: 'Manage your cards and payment options',
      icon: 'card-outline',
      action: () => {},
    },
    {
      id: 3,
      title: 'Addresses',
      subtitle: 'Manage billing and shipping addresses',
      icon: 'location-outline',
      action: () => {},
    },
    {
      id: 4,
      title: 'Notifications',
      subtitle: 'Manage email and push notifications',
      icon: 'notifications-outline',
      action: () => {},
    },
    {
      id: 5,
      title: 'Favorites',
      subtitle: 'Your saved events and venues',
      icon: 'heart-outline',
      action: () => {},
    },
    {
      id: 6,
      title: 'Following',
      subtitle: 'Artists and teams you follow',
      icon: 'people-outline',
      action: () => {},
    },
  ];

  const supportOptions = [
    {
      id: 1,
      title: 'Help Center',
      subtitle: 'Get answers to common questions',
      icon: 'help-circle-outline',
      action: () => {},
    },
    {
      id: 2,
      title: 'Contact Support',
      subtitle: 'Chat or call our support team',
      icon: 'chatbubble-outline',
      action: () => {},
    },
    {
      id: 3,
      title: 'Terms of Service',
      subtitle: 'Read our terms and conditions',
      icon: 'document-text-outline',
      action: () => {},
    },
    {
      id: 4,
      title: 'Privacy Policy',
      subtitle: 'Learn how we protect your data',
      icon: 'shield-outline',
      action: () => {},
    },
  ];

  const renderOptionItem = (option) => (
    <TouchableOpacity key={option.id} style={styles.optionItem} onPress={option.action}>
      <View style={styles.optionLeft}>
        <Ionicons name={option.icon} size={24} color="#0066CC" />
        <View style={styles.optionText}>
          <Text style={styles.optionTitle}>{option.title}</Text>
          <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCCCCC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#0066CC" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Ticketmaster+ Section */}
        <View style={styles.premiumSection}>
          <View style={styles.premiumHeader}>
            <View style={styles.premiumInfo}>
              <Text style={styles.premiumTitle}>Ticketmaster+</Text>
              <Text style={styles.premiumSubtitle}>Unlock exclusive perks</Text>
            </View>
            <TouchableOpacity style={styles.premiumButton}>
              <Text style={styles.premiumButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {accountOptions.map(renderOptionItem)}
        </View>

        {/* Support Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {supportOptions.map(renderOptionItem)}
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>

        <View style={{ height: 100 }} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0066CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  editProfileButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    color: '#0066CC',
    fontSize: 16,
    fontWeight: '600',
  },
  premiumSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  premiumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  premiumInfo: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  premiumButton: {
    backgroundColor: '#0066CC',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  premiumButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    marginLeft: 15,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  signOutText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
});
