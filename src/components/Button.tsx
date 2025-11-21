import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'whatsapp';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Button Component
 * Reusable button with multiple variants and sizes
 */
const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return styles.primaryButton;
      case 'secondary':
        return styles.secondaryButton;
      case 'danger':
        return styles.dangerButton;
      case 'outline':
        return styles.outlineButton;
      case 'whatsapp':
        return styles.whatsappButton;
      default:
        return styles.primaryButton;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'medium':
        return styles.mediumButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  const getTextVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'outline':
        return styles.outlineButtonText;
      default:
        return styles.buttonText;
    }
  };

  const getSizeTextStyle = (): TextStyle => {
    switch (size) {
      case 'small':
        return styles.smallButtonText;
      case 'medium':
        return styles.mediumButtonText;
      case 'large':
        return styles.largeButtonText;
      default:
        return styles.mediumButtonText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? colors.primary : colors.textWhite} />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[getTextVariantStyle(), getSizeTextStyle(), textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...shadows.sm,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  
  // Variants
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.backgroundDark,
  },
  dangerButton: {
    backgroundColor: colors.accent,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  whatsappButton: {
    backgroundColor: colors.whatsapp,
  },
  
  // Sizes
  smallButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  mediumButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  largeButton: {
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
  },
  
  // Text Styles
  buttonText: {
    color: colors.textWhite,
    fontWeight: typography.fontWeight.semibold,
  },
  outlineButtonText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  smallButtonText: {
    fontSize: typography.fontSize.sm,
  },
  mediumButtonText: {
    fontSize: typography.fontSize.base,
  },
  largeButtonText: {
    fontSize: typography.fontSize.lg,
  },
});

export default Button;
