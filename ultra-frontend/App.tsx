import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Text>Welcome to the App</Text>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;