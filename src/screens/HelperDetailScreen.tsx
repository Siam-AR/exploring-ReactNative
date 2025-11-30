import React from 'react';
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
  const helper = route?.params?.helper;

  const handleWhatsAppMessage = (): void => {
    const message = `Hi ${helper?.name}, I found you on Mini Bangladesh and would like to discuss your services.`;
    const url = `whatsapp://send?phone=${helper?.phone}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      console.log('Please install WhatsApp to send messages');
    });
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
              <Text style={styles.name}>{helper?.name}</Text>
            </View>
          </View>
        </Card>

        {/* About Section */}
        <Card style={styles.aboutCard} padding={spacing.base}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{helper?.about}</Text>
        </Card>

        {/* Location */}
        <Card style={styles.locationCard} padding={spacing.base}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.locationText}>{helper?.location}</Text>
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
  name: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
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
  locationText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
});

export default HelperDetailScreen;
