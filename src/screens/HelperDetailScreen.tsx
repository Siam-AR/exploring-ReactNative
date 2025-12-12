import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, typography, spacing, borderRadius, layout, shadows } from '../theme/theme';
import { HelperDetailScreenProps } from '../types/navigation';

const HelperDetailScreen: React.FC<HelperDetailScreenProps> = ({ route, navigation }) => {
  const helper = route.params.helper;

  const handleWhatsAppMessage = () => {
    if (!helper.phone) return;
    const msg = `Hi ${helper.name}, I found you on Mini Bangladesh and would like to discuss your ${helper.service} service.`;
    const url = `whatsapp://send?phone=${helper.phone}&text=${encodeURIComponent(msg)}`;
    Linking.openURL(url).catch(() => console.log("WhatsApp is not installed"));
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Helper Details</Text>
        <View style={{ width: 40 }} />
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
              <Text style={styles.name}>{helper.name}</Text>

              <View style={styles.serviceBadge}>
                <Text style={styles.serviceText}>{helper.service}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* About Section */}
        {helper.about && (
          <Card style={styles.aboutCard} padding={spacing.base}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{helper.about}</Text>
          </Card>
        )}

        {/* Location */}
        <Card style={styles.locationCard} padding={spacing.base}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>{helper.address}</Text>
          </View>
        </Card>

        {/* WhatsApp Contact */}
        {helper.phone && (
          <Button
            title="💬 Message on WhatsApp"
            onPress={handleWhatsAppMessage}
            variant="whatsapp"
            size="large"
            fullWidth
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 24, color: colors.textPrimary },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  scrollView: { flex: 1 },
  content: { padding: spacing.base, paddingBottom: spacing.xl },
  profileCard: { marginBottom: spacing.base },
  profileHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  avatarEmoji: { fontSize: 48 },
  profileInfo: { flex: 1 },
  name: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  serviceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  serviceText: { color: colors.textWhite, fontSize: typography.fontSize.sm },

  aboutCard: { marginBottom: spacing.base },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  aboutText: { color: colors.textSecondary, fontSize: typography.fontSize.base, lineHeight: 22 },

  locationCard: { marginBottom: spacing.base },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationIcon: { fontSize: 16, marginRight: spacing.sm },
  locationText: { color: colors.textSecondary, fontSize: typography.fontSize.base },
});

export default HelperDetailScreen;
