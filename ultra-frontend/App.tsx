import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Temporarily import a simple test component
const TestApp = () => {
  return (
    <View style={styles.testContainer}>
      <Text style={styles.testText}>🎫 Ultra Ticketing App Loading...</Text>
      <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
    </View>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // For now, let's show a simple test screen to fix the white screen
  // We'll add back the full navigation after confirming this works
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <TestApp />
      </NavigationContainer>
    </SafeAreaProvider>
  );

  /* ORIGINAL CODE - Will restore after testing
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator isAuthenticated={isAuthenticated} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
  */
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  testContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  testText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default App;