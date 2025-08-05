import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();

  const quickActions = [
    {
      id: 1,
      title: 'Browse Events',
      subtitle: 'Find amazing events',
      icon: 'calendar',
      color: '#FF6B6B',
      onPress: () => navigation.navigate('Events'),
    },
    {
      id: 2,
      title: 'My Tickets',
      subtitle: 'View your tickets',
      icon: 'ticket',
      color: '#4ECDC4',
      onPress: () => navigation.navigate('MyTickets'),
    },
    {
      id: 3,
      title: 'Profile',
      subtitle: 'Manage account',
      icon: 'person',
      color: '#45B7D1',
      onPress: () => navigation.navigate('Profile'),
    },
    {
      id: 4,
      title: 'Notifications',
      subtitle: 'Check updates',
      icon: 'notifications',
      color: '#96CEB4',
      onPress: () => console.log('Notifications'),
    },
  ];

  const featuredEvents = [
    {
      id: 1,
      title: 'Music Festival 2025',
      date: 'Aug 15, 2025',
      price: '$99',
    },
    {
      id: 2,
      title: 'Tech Conference',
      date: 'Sep 10, 2025',
      price: '$149',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome!</Text>
          <Text style={styles.subtitle}>Discover amazing events</Text>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.grid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionCard, { backgroundColor: action.color }]}
                onPress={action.onPress}
              >
                <Ionicons name={action.icon} size={32} color="white" />
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Events</Text>
          {featuredEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
            >
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>{event.date}</Text>
              </View>
              <Text style={styles.eventPrice}>{event.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1K+</Text>
              <Text style={styles.statLabel}>Users</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5K+</Text>
              <Text style={styles.statLabel}>Tickets Sold</Text>
            </View>
          </View>
        </View>
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
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  actionSubtitle: {
    color: 'white',
    fontSize: 12,
    opacity: 0.9,
    marginTop: 5,
    textAlign: 'center',
  },
  eventCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  eventPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  statLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 5,
  },
});
import * as Location from 'expo-location';

// 🎯 Revolutionary Components & Systems
import { UltraButton, UltraCard, UltraFAB, UltraLoading } from '../components/UltraComponents';
import { useTheme } from '../theme';
import { useThemeStore, useUserStore, useEventsStore } from '../store';

const { width, height } = Dimensions.get('window');

export const HomeScreen = () => {
  const theme = useTheme();
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useUserStore();
  const { events, fetchEvents, featuredEvents } = useEventsStore();
  
  // 🎯 Animation Values
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const cardScale = useRef(new Animated.Value(0.95)).current;
  
  // 🔥 State Management
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<string>('');
  const [greeting, setGreeting] = useState('');

  // 🌟 Initialize Screen with Spectacular Animations
  useEffect(() => {
    initializeScreen();
    generateGreeting();
    fetchUserLocation();
  }, []);

  const initializeScreen = async () => {
    // 🎯 Spectacular entrance animation
    Animated.sequence([
      Animated.timing(cardScale.current, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(headerOpacity.current, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // 🚀 Fetch events with smooth delay
    setTimeout(() => {
      fetchEvents();
    }, 500);
  };

  const generateGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = '';
    
    if (hour < 12) timeGreeting = 'Good Morning';
    else if (hour < 17) timeGreeting = 'Good Afternoon';
    else timeGreeting = 'Good Evening';
    
    setGreeting(`${timeGreeting}, ${user?.firstName || 'Explorer'}! 🌟`);
  };

  const fetchUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        if (address[0]) {
          setLocation(`${address[0].city}, ${address[0].region}`);
        }
      }
    } catch (error) {
      console.log('Location error:', error);
      setLocation('Discover Nearby');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    await Promise.all([
      fetchEvents(),
      new Promise(resolve => setTimeout(resolve, 1000)),
    ]);
    
    setRefreshing(false);
  };

  const handleEventPress = (eventId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Navigate to event details
    console.log('Event pressed:', eventId);
  };

  const handleLocationPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Open location selector
    console.log('Location pressed');
  };

  // 🎨 Dynamic Header Animation
  const headerStyle = {
    opacity: headerOpacity.current.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [0, 0.5, 1],
      extrapolate: 'clamp',
    }),
    transform: [{
      translateY: scrollY.current.interpolate({
        inputRange: [0, 100],
        outputRange: [0, -20],
        extrapolate: 'clamp',
      }),
    }],
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      {/* 🌟 Revolutionary Header with Blur Effect */}
      <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <BlurView 
          intensity={80} 
          tint={isDark ? 'dark' : 'light'}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          }}
        >
          <Animated.View style={headerStyle}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              {/* 📍 Location & Greeting */}
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 28,
                  fontWeight: '800',
                  color: theme.colors.text,
                  marginBottom: 4,
                }}>
                  {greeting}
                </Text>
                <TouchableOpacity onPress={handleLocationPress}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons 
                      name="location-outline" 
                      size={16} 
                      color={theme.colors.primary} 
                    />
                    <Text style={{
                      fontSize: 14,
                      color: theme.colors.textSecondary,
                      marginLeft: 4,
                      fontWeight: '600',
                    }}>
                      {location || 'Loading location...'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* 🎛️ Action Buttons */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    toggleTheme();
                  }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: theme.colors.cardBackground,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                    ...theme.shadows.medium,
                  }}
                >
                  <Ionicons 
                    name={isDark ? 'sunny' : 'moon'} 
                    size={22} 
                    color={theme.colors.primary} 
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    // TODO: Open notifications
                  }}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: theme.colors.cardBackground,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...theme.shadows.medium,
                  }}
                >
                  <Ionicons 
                    name="notifications-outline" 
                    size={22} 
                    color={theme.colors.text} 
                  />
                  {/* 🔔 Notification Badge */}
                  <View style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: theme.colors.error,
                  }} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </BlurView>
      </SafeAreaView>

      {/* 🎭 Main Content with Spectacular Animations */}
      <Animated.ScrollView
        style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 120 : 140 }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY.current } } }],
          { useNativeDriver: false }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        <Animated.View style={{
          transform: [{ scale: cardScale.current }],
          paddingHorizontal: 20,
        }}>
          
          {/* 🎯 Quick Actions Section */}
          <View style={{ marginBottom: 30 }}>
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: theme.colors.text,
              marginBottom: 16,
            }}>
              Quick Actions
            </Text>
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <UltraButton
                title="Scan QR"
                icon="qr-code-outline"
                variant="primary"
                size="medium"
                style={{ flex: 1, marginRight: 8 }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  // TODO: Open QR scanner
                }}
              />
              
              <UltraButton
                title="My Tickets"
                icon="ticket-outline"
                variant="secondary"
                size="medium"
                style={{ flex: 1, marginLeft: 8 }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  // TODO: Navigate to tickets
                }}
              />
            </View>
          </View>

          {/* 🌟 Featured Events */}
          <View style={{ marginBottom: 30 }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 22,
                fontWeight: '700',
                color: theme.colors.text,
              }}>
                Featured Events
              </Text>
              
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  // TODO: Show all events
                }}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: theme.colors.primary,
                }}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            {/* 🎪 Event Cards */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {featuredEvents.map((event, index) => (
                <TouchableOpacity
                  key={event.id}
                  onPress={() => handleEventPress(event.id)}
                  style={{ marginRight: 16 }}
                >
                  <UltraCard
                    style={{
                      width: width * 0.75,
                      height: 220,
                    }}
                  >
                    <LinearGradient
                      colors={[
                        theme.colors.primary + '20',
                        theme.colors.secondary + '20',
                      ]}
                      style={{
                        flex: 1,
                        borderRadius: 20,
                        padding: 20,
                        justifyContent: 'space-between',
                      }}
                    >
                      <View>
                        <View style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: 12,
                        }}>
                          <View style={{
                            backgroundColor: theme.colors.success + '20',
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 12,
                          }}>
                            <Text style={{
                              fontSize: 12,
                              fontWeight: '600',
                              color: theme.colors.success,
                            }}>
                              {event.category}
                            </Text>
                          </View>
                          
                          <View style={{
                            backgroundColor: theme.colors.cardBackground + '80',
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                            <Ionicons 
                              name="heart-outline" 
                              size={18} 
                              color={theme.colors.text} 
                            />
                          </View>
                        </View>

                        <Text style={{
                          fontSize: 18,
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
                        }}>
                          📍 {event.venue}
                        </Text>
                      </View>

                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <Text style={{
                          fontSize: 20,
                          fontWeight: '800',
                          color: theme.colors.primary,
                        }}>
                          ${event.price}
                        </Text>

                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                          <Ionicons 
                            name="star" 
                            size={14} 
                            color="#FFD700" 
                          />
                          <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: theme.colors.text,
                            marginLeft: 4,
                          }}>
                            {event.rating}
                          </Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </UltraCard>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 🎭 Categories Section */}
          <View style={{ marginBottom: 30 }}>
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: theme.colors.text,
              marginBottom: 16,
            }}>
              Explore Categories
            </Text>

            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
              {[
                { name: 'Music', icon: 'musical-notes', color: '#FF6B6B' },
                { name: 'Sports', icon: 'basketball', color: '#4ECDC4' },
                { name: 'Theater', icon: 'videocam', color: '#45B7D1' },
                { name: 'Comedy', icon: 'happy', color: '#FFA07A' },
              ].map((category, index) => (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    // TODO: Navigate to category
                  }}
                  style={{
                    width: '48%',
                    marginBottom: 16,
                  }}
                >
                  <UltraCard style={{ padding: 20 }}>
                    <View style={{ alignItems: 'center' }}>
                      <View style={{
                        width: 60,
                        height: 60,
                        borderRadius: 30,
                        backgroundColor: category.color + '20',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 12,
                      }}>
                        <Ionicons 
                          name={category.icon as any} 
                          size={30} 
                          color={category.color} 
                        />
                      </View>
                      
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: theme.colors.text,
                        textAlign: 'center',
                      }}>
                        {category.name}
                      </Text>
                    </View>
                  </UltraCard>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 🌈 Bottom Spacing */}
          <View style={{ height: 100 }} />
        </Animated.View>
      </Animated.ScrollView>

      {/* 🎯 Floating Action Button */}
      <UltraFAB
        icon="add"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          // TODO: Create event or quick action
        }}
        style={{
          position: 'absolute',
          bottom: 90,
          right: 20,
        }}
      />
    </View>
  );
};
