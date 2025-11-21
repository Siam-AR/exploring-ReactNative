import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing, layout, shadows } from '../theme/theme';

export interface HeaderAction {
  icon: React.ReactNode;
  onPress: () => void;
}

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  leftAction?: HeaderAction;
  rightAction?: HeaderAction;
  style?: ViewStyle;
}

/**
 * Header Component
 * App header with logo, title, and action buttons
 */
const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showLogo = false,
  leftAction,
  rightAction,
  style,
}) => {
  return (
    <View style={[styles.header, style]}>
      {/* Left Action */}
      {leftAction && (
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={leftAction.onPress}
          activeOpacity={0.7}
        >
          {leftAction.icon}
        </TouchableOpacity>
      )}
      
      {/* Center Content */}
      <View style={styles.centerContent}>
        {showLogo && (
          <View style={styles.logoContainer}>
            <Text style={styles.logoEmoji}>🇧🇩</Text>
          </View>
        )}
        
        {title && (
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            {subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
            )}
          </View>
        )}
      </View>
      
      {/* Right Action */}
      {rightAction && (
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={rightAction.onPress}
          activeOpacity={0.7}
        >
          {rightAction.icon}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: layout.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginRight: spacing.sm,
  },
  logoEmoji: {
    fontSize: 24,
  },
  titleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
});

export default Header;
