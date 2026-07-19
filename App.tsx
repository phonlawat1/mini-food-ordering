import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';

const App: React.FC = () => (
  <SafeAreaProvider>
    <StatusBar barStyle="dark-content" backgroundColor="#F7F7F9" />
    <RootNavigator />
  </SafeAreaProvider>
);

export default App;
