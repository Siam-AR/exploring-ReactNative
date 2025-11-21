import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/theme';

// Enable native optimized screens
enableScreens(true);

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.card}
      />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
