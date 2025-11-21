/**
 * Navigation Type Definitions
 * React Navigation v6 TypeScript types
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Helper data types
export interface Helper {
  id: string;
  name: string;
  service: string;
  location: string;
  rating: number;
  hourlyRate: string;
  experience?: string;
  availability?: string;
  phone?: string;
  about?: string;
  imageUrl?: string;
}

// Bottom Tab Navigator Params
export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Request: undefined;
  Profile: undefined;
};

// Root Stack Navigator Params
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  HelperDetail: { helper: Helper };
};

// Screen Props Types
export type HomeScreenProps = BottomTabScreenProps<BottomTabParamList, 'Home'>;
export type SearchScreenProps = BottomTabScreenProps<BottomTabParamList, 'Search'>;
export type RequestScreenProps = BottomTabScreenProps<BottomTabParamList, 'Request'>;
export type ProfileScreenProps = BottomTabScreenProps<BottomTabParamList, 'Profile'>;
export type HelperDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'HelperDetail'>;

// Navigation Props (for useNavigation hook)
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
