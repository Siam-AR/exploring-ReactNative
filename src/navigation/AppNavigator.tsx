import React from 'react';
import { Text, TextStyle } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';

import { RootStackParamList, BottomTabParamList } from '../types/navigation';

const colors = {
  primary: '#2563eb',
  textSecondary: '#6b7280',
  border: '#e5e7eb',
  card: '#ffffff',
};

const typography = {
  fontSize: { xs: 12 },
  fontWeight: { medium: '500' as TextStyle['fontWeight'] },
};

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import RequestScreen from '../screens/RequestScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HelperDetailScreen from '../screens/HelperDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const tabScreenOptions = ({
  route,
}: {
  route: { name: keyof BottomTabParamList };
}): BottomTabNavigationOptions => ({
  headerShown: false,

  tabBarIcon: ({ focused }) => {
    let icon = '';
    if (route.name === 'Home') icon = '🏠';
    if (route.name === 'Search') icon = '🔍';
    if (route.name === 'Request') icon = '📩';
    if (route.name === 'Profile') icon = '👤';

    return (
      <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.6 }}>
        {icon}
      </Text>
    );
  },

  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textSecondary,

  tabBarStyle: {
    height: 68,
    paddingBottom: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },

  tabBarLabelStyle: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  } as TextStyle,
});

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Request" component={RequestScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="HelperDetail" component={HelperDetailScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
