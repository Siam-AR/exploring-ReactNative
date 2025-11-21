import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, shadows, spacing, Shadow } from '../theme/theme';

export type CardElevation = 'sm' | 'md' | 'lg' | 'xl' | 'none';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  elevation?: CardElevation;
}

/**
 * Card Component
 * Reusable card container with customizable padding and elevation
 */
const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  padding = spacing.base,
  elevation = 'md',
}) => {
  const getElevationStyle = (): Shadow | {} => {
    switch (elevation) {
      case 'sm':
        return shadows.sm;
      case 'md':
        return shadows.md;
      case 'lg':
        return shadows.lg;
      case 'xl':
        return shadows.xl;
      case 'none':
        return {};
      default:
        return shadows.md;
    }
  };

  return (
    <View 
      style={[
        styles.card, 
        { padding },
        getElevationStyle(),
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
  },
});

export default Card;
