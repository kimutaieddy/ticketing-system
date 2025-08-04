import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme';
import { Text } from 'react-native';

const App = () => {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Text>Welcome to the App</Text>
        </NavigationContainer>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

export default App;