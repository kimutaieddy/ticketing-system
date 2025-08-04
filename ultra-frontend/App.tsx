// 🚀 ULTRA-ADVANCED APP ENTRY POINT
// Revolutionary React Native app with cutting-edge navigation and features

import React, { useEffect, useState } from 'react';
import { StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { MMKV } from 'react-native-mmkv';

// 🎨 Theme & Store Imports
import { useTheme } from './src/theme';
import { useUserStore, useThemeStore } from './src/store';

// 🗄️ Storage for onboarding state
const storage = new MMKV();


// 📱 Screen Imports
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { ForgotPasswordScreen } from './src/screens/ForgotPasswordScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { EventDetailsScreen } from './src/screens/EventDetailsScreen';
import { TicketBookingScreen } from './src/screens/TicketBookingScreen';
import { MyTicketsScreen } from './src/screens/MyTicketsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { QRScannerScreen } from './src/screens/QRScannerScreen';
import { OrganizerDashboardScreen } from './src/screens/OrganizerDashboardScreen';

// 🎯 Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  MainTabs: undefined;
  EventDetails: { eventId: string };
  TicketBooking: { eventId: string };
  QRScanner: undefined;
  OrganizerDashboard: undefined;
};

export type TabParamList = {
  Home: undefined;
  MyTickets: undefined;
  Profile: undefined;
};

// 🧭 Navigation Setup
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// 🎭 Main Tab Navigator with Revolutionary Design
const MainTabNavigator = () => {
  const theme = useTheme();
  const { user, isAuthenticated } = useUserStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MyTickets') {
            iconName = focused ? 'ticket' : 'ticket-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: theme.colors.text,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: 'Discover' }}
      />
      <Tab.Screen 
        name="MyTickets" 
        component={MyTicketsScreen}
        options={{ 
          tabBarLabel: 'My Tickets',
          // Show badge if user is not authenticated
          tabBarBadge: !isAuthenticated ? '!' : undefined,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          tabBarLabel: isAuthenticated ? 'Profile' : 'Sign In',
          tabBarBadge: !isAuthenticated ? '!' : undefined,
        }}
      />
    </Tab.Navigator>
  );
};

// 🎪 Main App Component
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const { isAuthenticated, user, initializeAuth } = useUserStore();
  const { currentTheme } = useThemeStore();
  const theme = useTheme();

  useEffect(() => {
    async function prepare() {
      try {
        // 🎨 Load custom fonts (fallback if not available)
        try {
          await Font.loadAsync({
            'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
            'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
            'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
            'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
          });
        } catch (fontError) {
          console.log('Custom fonts not available, using system fonts');
        }

        // 🔐 Initialize authentication state
        await initializeAuth();

        // 🎯 Check if user has seen onboarding
        const onboardingSeen = storage.contains('hasSeenOnboarding');
        setHasSeenOnboarding(onboardingSeen);

        // ⏱️ Artificial delay to show splash screen (optional)
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('Error preparing app:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      // Hide splash screen once app is ready
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer
          theme={{
            dark: theme.isDark,
            colors: {
              primary: theme.colors.primary,
              background: theme.colors.background,
              card: theme.colors.surface,
              text: theme.colors.text,
              border: theme.colors.border,
              notification: theme.colors.error,
            },
          }}
          onReady={onLayoutRootView}
        >
          <StatusBar
            barStyle={theme.isDark ? 'light-content' : 'dark-content'}
            backgroundColor={theme.colors.background}
          />
          
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
              animation: 'slide_from_right',
            }}
          >
            {/* 🎯 Show onboarding only for first-time users */}
            {!hasSeenOnboarding ? (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            ) : null}
            
            {/* 🏠 Main App Flow - Always Available */}
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            
            {/* 🔐 Authentication Screens - Modal-style */}
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                headerShown: true,
                headerTitle: 'Sign In',
                headerStyle: {
                  backgroundColor: theme.colors.surface,
                },
                headerTintColor: theme.colors.text,
              }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                headerShown: true,
                headerTitle: 'Create Account',
                headerStyle: {
                  backgroundColor: theme.colors.surface,
                },
                headerTintColor: theme.colors.text,
              }}
            />
            <Stack.Screen 
              name="ForgotPassword" 
              component={ForgotPasswordScreen}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                headerShown: true,
                headerTitle: 'Reset Password',
                headerStyle: {
                  backgroundColor: theme.colors.surface,
                },
                headerTintColor: theme.colors.text,
              }}
            />
            
            {/* 🎪 Event Flow */}
            <Stack.Screen 
              name="EventDetails" 
              component={EventDetailsScreen}
              options={{
                headerShown: true,
                headerTitle: 'Event Details',
                headerStyle: {
                  backgroundColor: theme.colors.surface,
                },
                headerTintColor: theme.colors.text,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            />
            <Stack.Screen 
              name="TicketBooking" 
              component={TicketBookingScreen}
              options={{
                headerShown: true,
                headerTitle: 'Book Tickets',
                headerStyle: {
                  backgroundColor: theme.colors.surface,
                },
                headerTintColor: theme.colors.text,
              }}
            />
            <Stack.Screen 
              name="QRScanner" 
              component={QRScannerScreen}
              options={{
                headerShown: true,
                headerTitle: 'Scan QR Code',
                headerStyle: {
                  backgroundColor: theme.colors.surface,
                },
                headerTintColor: theme.colors.text,
              }}
            />
            
            {/* 📊 Organizer Flow (conditional) */}
            {user?.role === 'organizer' || user?.role === 'admin' ? (
              <Stack.Screen 
                name="OrganizerDashboard" 
                component={OrganizerDashboardScreen}
                options={{
                  headerShown: true,
                  headerTitle: 'Organizer Dashboard',
                  headerStyle: {
                    backgroundColor: theme.colors.surface,
                  },
                  headerTintColor: theme.colors.text,
                }}
              />
            ) : null}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
