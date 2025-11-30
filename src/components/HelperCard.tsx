import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Card from './Card';
import { colors, typography, spacing, borderRadius } from '../theme/theme';

export interface HelperCardProps {
  name: string;
  service: string;
  location: string;
  imageUrl?: string;
  onPress: () => void;
}

const HelperCard: React.FC<HelperCardProps> = ({
  name,
  service,
  location,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card style={styles.card} padding={spacing.base}>
        <View style={styles.content}>
          
          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👤</Text>
          </View>

          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={1}>{name}</Text>

            <View style={styles.serviceBadge}>
              <Text style={styles.serviceText}>{service}</Text>
            </View>

            <View style={styles.locationRow}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.location} numberOfLines={1}>
                {location}
              </Text>
            </View>

          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.base,
  },
  content: {
    flexDirection: 'row',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  avatarEmoji: {
    fontSize: 32,
  },
  info: {
    flex: 1,
  },

  name: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  serviceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },

  serviceText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textWhite,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationIcon: {
    fontSize: 12,
    marginRight: spacing.xs,
  },

  location: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
});

export default HelperCard;
