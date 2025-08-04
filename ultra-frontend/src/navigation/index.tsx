// import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { useThemeStore, useUserStore, useStore } from '../store';
import { UltraLoading } from '../components/UltraComponents';
import { LoginScreen, RegisterScreen, ForgotPasswordScreen, HomeScreen } from '../screens'; SYSTEM
// Revolutionary navigation with smooth animations and gestures

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';
import { useThemeStore, useUserStore } from '../store';
import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from '../screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// 🎨 Custom Tab Bar with Glass Morphism
interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, descriptors, navigation }) => {
  const theme = useTheme();
  const { hapticFeedback } = useThemeStore();
  const scaleValues = useRef(state.routes.map(() => new Animated.Value(1))).current;
  const { width } = Dimensions.get('window');

  const onTabPress = (route: any, index: number, isFocused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      // Haptic feedback
      if (hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Animation
      Animated.sequence([
        Animated.spring(scaleValues[index], {
          toValue: 0.85,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValues[index], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      navigation.navigate(route.name);
    }
  };

  const getTabIcon = (routeName: string, focused: boolean) => {
    const iconMap: { [key: string]: string } = {
      Home: focused ? 'home' : 'home-outline',
      Explore: focused ? 'compass' : 'compass-outline',
      Tickets: focused ? 'ticket' : 'ticket-outline',
      Profile: focused ? 'person' : 'person-outline',
    };

    return iconMap[routeName] || 'circle';
  };

  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    }}>
      <BlurView
        intensity={95}
        tint={theme.isDark ? 'dark' : 'light'}
        style={{
          flexDirection: 'row',
          paddingTop: 12,
          marginHorizontal: 20,
          marginBottom: 20,
          borderRadius: 28,
          overflow: 'hidden',
          ...theme.shadows.xl,
        }}
      >
        <LinearGradient
          colors={theme.isDark 
            ? ['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.6)']
            : ['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.8)']
          }
          style={{
            flexDirection: 'row',
            flex: 1,
            paddingVertical: 8,
          }}
        >
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel !== undefined 
              ? options.tabBarLabel 
              : options.title !== undefined 
              ? options.title 
              : route.name;

            const isFocused = state.index === index;

            return (
              <Animated.View
                key={route.key}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  transform: [{ scale: scaleValues[index] }],
                }}
              >
                <TouchableOpacity
                  onPress={() => onTabPress(route, index, isFocused)}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 20,
                    backgroundColor: isFocused 
                      ? `${theme.colors.primary}20` 
                      : 'transparent',
                    minHeight: 44,
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={getTabIcon(route.name, isFocused) as any}
                    size={24}
                    color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
                  />
                  <Text
                    style={{
                      ...theme.typography.caption,
                      color: isFocused ? theme.colors.primary : theme.colors.textSecondary,
                      marginTop: 2,
                      fontWeight: isFocused ? '600' : '400',
                    }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </LinearGradient>
      </BlurView>
    </View>
  );
};

// 🎭 Ultra Header Component
interface UltraHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
  gradient?: boolean;
}

export const UltraHeader: React.FC<UltraHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  rightComponent,
  transparent = false,
  gradient = false,
}) => {
  const theme = useTheme();
  const slideValue = useRef(new Animated.Value(-50)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const headerStyle = {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: transparent ? 'transparent' : theme.colors.surface,
    ...(!transparent && theme.shadows.sm),
  };

  const animatedStyle = {
    transform: [{ translateY: slideValue }],
    opacity: opacityValue,
  };

  const HeaderContent = () => (
    <Animated.View style={[headerStyle, animatedStyle]}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          {showBack && (
            <TouchableOpacity
              style={{
                marginRight: 16,
                padding: 8,
                borderRadius: 20,
                backgroundColor: `${theme.colors.primary}10`,
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }}>
            <Text style={{
              ...theme.typography.h2,
              color: theme.colors.text,
              marginBottom: subtitle ? 4 : 0,
            }}>
              {title}
            </Text>
            {subtitle && (
              <Text style={{
                ...theme.typography.body2,
                color: theme.colors.textSecondary,
              }}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {rightComponent && (
          <View>{rightComponent}</View>
        )}
      </View>
    </Animated.View>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={theme.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <HeaderContent />
      </LinearGradient>
    );
  }

  return <HeaderContent />;
};

// 🎪 Navigation Theme Configuration
export const getNavigationTheme = (isDark: boolean, colors: any) => ({
  ...(isDark ? DarkTheme : DefaultTheme),
  colors: {
    ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.accent,
  },
});

// 🌟 Main Tab Navigator
export const MainTabNavigator = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide default tab bar
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Tickets" component={TicketsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// 🎯 Authentication Stack Navigator
export const AuthStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

// 🎯 Stack Navigator with Custom Transitions
export const AppStackNavigator = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 300,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen 
        name="EventDetails" 
        component={EventDetailsScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
      <Stack.Screen 
        name="BookingFlow" 
        component={BookingFlowScreen}
        options={{
          animation: 'fade_from_bottom',
          presentation: 'fullScreenModal',
        }}
      />
      <Stack.Screen 
        name="ARPreview" 
        component={ARPreviewScreen}
        options={{
          animation: 'fade',
          presentation: 'fullScreenModal',
        }}
      />
    </Stack.Navigator>
  );
};

// 🏗️ Root Navigation Container with Revolutionary Authentication Flow
export const RootNavigator = () => {
  const theme = useTheme();
  const { isDark } = useThemeStore();
  const { user } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🎯 Check for existing authentication with smooth loading
    const checkAuthStatus = async () => {
      try {
        // Simulate authentication check with elegant delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDark ? '#0A0A0A' : '#FFFFFF',
      }}>
        <UltraLoading size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={getNavigationTheme(isDark, theme.colors)}>
      {user ? <AppStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

// Placeholder screens (will be implemented next)
const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Home Screen</Text>
  </View>
);

const ExploreScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Explore Screen</Text>
  </View>
);

const TicketsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Tickets Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Profile Screen</Text>
  </View>
);

const EventDetailsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Event Details Screen</Text>
  </View>
);

const BookingFlowScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Booking Flow Screen</Text>
  </View>
);

const ARPreviewScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>AR Preview Screen</Text>
  </View>
);
