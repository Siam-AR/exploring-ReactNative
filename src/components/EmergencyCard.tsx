import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import Card from './Card';
import { colors, typography, spacing, borderRadius } from '../theme/theme';

export type EmergencyStatus = 'pending' | 'active' | 'resolved';

export interface EmergencyCardProps {
  title: string;
  description: string;
  location: string;
  timeAgo: string;
  status?: EmergencyStatus;
  phone?: string;
  whatsapp?: string;
  onPress?: () => void;
  onPhoneCall?: () => void;
  onWhatsApp?: () => void;
}

/**
 * EmergencyCard Component
 * Displays emergency request information with contact buttons
 */
const EmergencyCard: React.FC<EmergencyCardProps> = ({
  title,
  description,
  location,
  timeAgo,
  status = 'pending',
  phone,
  whatsapp,
  onPress,
  onPhoneCall,
  onWhatsApp,
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

  const CardContent = (
    <>
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

      {/* Contact Information */}
      {(phone || whatsapp) && (
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Contact:</Text>
          <View style={styles.contactButtons}>
            {phone && (
              <TouchableOpacity 
                style={styles.contactButton}
                onPress={onPhoneCall}
              >
                <Text style={styles.contactButtonText}>📞 {phone}</Text>
              </TouchableOpacity>
            )}
            {whatsapp && (
              <TouchableOpacity 
                style={styles.whatsappButton}
                onPress={onWhatsApp}
              >
                <Text style={styles.whatsappButtonText}>💬 {whatsapp}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      
      {onPress && (
        <View style={styles.tapHint}>
          <Text style={styles.tapHintText}>Tap to view details →</Text>
        </View>
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <Card style={styles.card} padding={spacing.base}>
          {CardContent}
        </Card>
      </TouchableOpacity>
    );
  }

  return (
    <Card style={styles.card} padding={spacing.base}>
      {CardContent}
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

  // Contact Info Styles
  contactInfo: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  contactLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  contactButton: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  whatsappButton: {
    flex: 1,
    backgroundColor: '#25D366',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  whatsappButtonText: {
    fontSize: typography.fontSize.xs,
    color: colors.textWhite,
    fontWeight: typography.fontWeight.medium,
  },

  tapHint: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tapHintText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    textAlign: 'center',
  },
});

export default EmergencyCard;
