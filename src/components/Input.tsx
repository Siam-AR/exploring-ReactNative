import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme/theme';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: React.ReactNode;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

/**
 * Input Component
 * Reusable text input with label, icon, and error support
 */
const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  icon,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        <TextInput
          style={[
            styles.input,
            icon ? { paddingLeft: spacing.base } : null,
            multiline && styles.inputMultiline,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  inputMultiline: {
    minHeight: 100,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

export default Input;
