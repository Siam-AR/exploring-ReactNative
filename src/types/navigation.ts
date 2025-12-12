/**
 * Navigation Type Definitions
 * React Navigation v6 TypeScript types
 */

import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Updated Helper type based on your backend fields
export interface Helper {
  _id: string;            // MongoDB ID
  name: string;
  service: string;
  address: string;        // backend uses "address"
  phone?: string;
  about?: string;
  imageUrl?: string;
}

// Bottom Tab Params
export type BottomTabParamList = {
  Home: undefined;
  Search: undefined;
  Request: undefined;
  Profile: undefined;
};

// Root Stack Params
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  HelperDetail: { helper: Helper };
};

// Screen Props
export type HomeScreenProps = BottomTabScreenProps<BottomTabParamList, 'Home'>;
export type SearchScreenProps = BottomTabScreenProps<BottomTabParamList, 'Search'>;
export type RequestScreenProps = BottomTabScreenProps<BottomTabParamList, 'Request'>;
export type ProfileScreenProps = BottomTabScreenProps<BottomTabParamList, 'Profile'>;
export type HelperDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'HelperDetail'
>;

// Navigation Props (global)
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
