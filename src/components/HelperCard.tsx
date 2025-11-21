import React, { JSX } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Card from './Card';
import { colors, typography, spacing, borderRadius } from '../theme/theme';

export interface HelperCardProps {
  name: string;
  service: string;
  location: string;
  rating: number;
  hourlyRate: string;
  imageUrl?: string;
  onPress: () => void;
}

/**
 * HelperCard Component
 * Displays helper information in a card format
 */
const HelperCard: React.FC<HelperCardProps> = ({
  name,
  service,
  location,
  rating,
  hourlyRate,
  imageUrl,
  onPress,
}) => {
  // Generate star rating
  const renderStars = (): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Text key={i} style={styles.star}>
          {i < fullStars ? '⭐' : '☆'}
        </Text>
      );
    }
    return stars;
  };

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
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>{name}</Text>
              <Text style={styles.verified}>✓</Text>
            </View>
            
            <View style={styles.serviceBadge}>
              <Text style={styles.serviceText}>{service}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.location} numberOfLines={1}>{location}</Text>
            </View>
            
            <View style={styles.footer}>
              <View style={styles.rating}>
                {renderStars()}
                <Text style={styles.ratingText}>({rating.toFixed(1)})</Text>
              </View>
              
              <Text style={styles.rate}>{hourlyRate}/hr</Text>
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  verified: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: spacing.xs,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 14,
    marginRight: 2,
  },
  ratingText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  rate: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
  },
});

export default HelperCard;
