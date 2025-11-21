import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, layout, shadows } from '../theme/theme';

export type TabId = 'Home' | 'Search' | 'Request' | 'Profile';

export interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

export interface BottomNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

/**
 * BottomNavigation Component
 * Bottom tab navigation with 4 tabs
 */
const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: Tab[] = [
    { id: 'Home', label: 'Home', icon: '🏠' },
    { id: 'Search', label: 'Search', icon: '🔍' },
    { id: 'Request', label: 'Request', icon: '📋' },
    { id: 'Profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: layout.bottomNavHeight,
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: spacing.sm,
    ...shadows.lg,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    opacity: 0.6,
    marginBottom: spacing.xs,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
});

export default BottomNavigation;
