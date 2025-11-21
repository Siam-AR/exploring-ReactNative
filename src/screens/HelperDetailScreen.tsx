import React, { JSX } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, typography, spacing, borderRadius, layout, shadows } from '../theme/theme';
import { HelperDetailScreenProps } from '../types/navigation';

/**
 * HelperDetailScreen
 * Detailed view of a helper's profile
 */
const HelperDetailScreen: React.FC<HelperDetailScreenProps> = ({ route, navigation }) => {
  const helper = route?.params?.helper || {
    id: '1',
    name: 'Ahmed Rahman',
    service: 'Tutor',
    location: 'Dhaka, Gulshan',
    rating: 4.8,
    hourlyRate: '৳500',
    experience: '5 years',
    availability: 'Mon-Fri, 9 AM - 5 PM',
    phone: '+8801712345678',
    about: 'Experienced tutor specializing in Mathematics and Science for grades 6-12. Patient, dedicated, and focused on student success.',
  };

  const handleWhatsAppMessage = (): void => {
    const message = `Hi ${helper.name}, I found you on Mini Bangladesh and would like to discuss your ${helper.service} services.`;
    const url = `whatsapp://send?phone=${helper.phone}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      console.log('Please install WhatsApp to send messages');
    });
  };

  const renderStars = (): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(helper.rating);
    
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
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Helper Details</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <Card style={styles.profileCard} padding={spacing.lg} elevation="lg">
          <View style={styles.profileHeader}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarEmoji}>👤</Text>
            </View>
            
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{helper.name}</Text>
                <Text style={styles.verified}>✓</Text>
              </View>
              
              <View style={styles.rating}>
                {renderStars()}
                <Text style={styles.ratingText}>({helper.rating})</Text>
              </View>
              
              <View style={styles.serviceBadge}>
                <Text style={styles.serviceText}>{helper.service}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Details Cards */}
        <View style={styles.detailsGrid}>
          <Card style={styles.detailCard} padding={spacing.base}>
            <Text style={styles.detailIcon}>💰</Text>
            <Text style={styles.detailLabel}>Hourly Rate</Text>
            <Text style={styles.detailValue}>{helper.hourlyRate}</Text>
          </Card>
          
          <Card style={styles.detailCard} padding={spacing.base}>
            <Text style={styles.detailIcon}>⏱️</Text>
            <Text style={styles.detailLabel}>Experience</Text>
            <Text style={styles.detailValue}>{helper.experience}</Text>
          </Card>
        </View>

        <Card style={styles.availabilityCard} padding={spacing.base}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailLabel}>Availability</Text>
          <Text style={styles.detailValue}>{helper.availability}</Text>
        </Card>

        {/* About Section */}
        <Card style={styles.aboutCard} padding={spacing.base}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{helper.about}</Text>
        </Card>

        {/* Location */}
        <Card style={styles.locationCard} padding={spacing.base}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>{helper.location}</Text>
          </View>
          
          {/* Map Placeholder */}
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapIcon}>🗺️</Text>
            <Text style={styles.mapText}>Map View</Text>
          </View>
        </Card>

        {/* WhatsApp Contact Button */}
        <Button
          title="💬 Message on WhatsApp"
          onPress={handleWhatsAppMessage}
          variant="whatsapp"
          size="large"
          fullWidth
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: spacing.xl,
  },
  profileCard: {
    marginBottom: spacing.base,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  avatarEmoji: {
    fontSize: 48,
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginRight: spacing.xs,
  },
  verified: {
    fontSize: 20,
    color: colors.primary,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  ratingText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  serviceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  serviceText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textWhite,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.base,
  },
  detailCard: {
    flex: 1,
    alignItems: 'center',
  },
  availabilityCard: {
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  detailIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  aboutCard: {
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  aboutText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  locationCard: {
    marginBottom: spacing.base,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  locationIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  locationText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: colors.backgroundDark,
    borderRadius: borderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  mapText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
});

export default HelperDetailScreen;
