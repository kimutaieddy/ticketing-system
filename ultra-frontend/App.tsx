import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Text style={styles.title}>🎫 Ultra Ticketing</Text>
      <Text style={styles.subtitle}>App is working!</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>✅ React Native Connected</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  badge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  badgeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default App;