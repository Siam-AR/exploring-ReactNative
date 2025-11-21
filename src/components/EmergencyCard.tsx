import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from './Card';
import { colors, typography, spacing, borderRadius } from '../theme/theme';

export type EmergencyStatus = 'pending' | 'active' | 'resolved';

export interface EmergencyCardProps {
  title: string;
  description: string;
  location: string;
  timeAgo: string;
  status?: EmergencyStatus;
}

/**
 * EmergencyCard Component
 * Displays emergency request information
 */
const EmergencyCard: React.FC<EmergencyCardProps> = ({
  title,
  description,
  location,
  timeAgo,
  status = 'pending',
}) => {
  const getStatusColor = (): string => {
    switch (status) {
      case 'pending':
        return colors.warning;
      case 'active':
        return colors.info;
      case 'resolved':
        return colors.success;
      default:
        return colors.textTertiary;
    }
  };

  const getStatusText = (): string => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'active':
        return 'Active';
      case 'resolved':
        return 'Resolved';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card style={styles.card} padding={spacing.base}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.emergencyIcon}>🚨</Text>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>{description}</Text>
      
      <View style={styles.footer}>
        <View style={styles.locationContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.location} numberOfLines={1}>{location}</Text>
        </View>
        
        <Text style={styles.timeAgo}>{timeAgo}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.base,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textWhite,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  timeAgo: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
  },
});

export default EmergencyCard;
