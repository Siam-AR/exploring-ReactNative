import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import Card from '../components/Card';
import Button from '../components/Button';
import { colors, typography, spacing, borderRadius, layout, shadows } from '../theme/theme';
import { HelperDetailScreenProps } from '../types/navigation';

const HelperDetailScreen: React.FC<HelperDetailScreenProps> = ({ route, navigation }) => {
  const helper = route.params.helper;

  const handlePhoneCall = () => {
    if (!helper.phone) {
      Alert.alert('No Phone Number', 'This helper has not provided a phone number.');
      return;
    }
    
    const phoneUrl = `tel:${helper.phone}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Error', 'Unable to open phone dialer');
        }
      })
      .catch((err) => {
        console.error('Error opening phone dialer:', err);
        Alert.alert('Error', 'Unable to make phone call');
      });
  };

  const handleWhatsAppMessage = () => {
    const phoneNumber = helper.whatsapp || helper.phone;
    
    if (!phoneNumber) {
      Alert.alert('No WhatsApp Number', 'This helper has not provided a WhatsApp number.');
      return;
    }
    
    // Remove any non-digit characters and add country code if needed
    let cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // If phone starts with 0, replace with country code (880 for Bangladesh)
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '880' + cleanPhone.substring(1);
    }
    
    const msg = `Hi ${helper.name}, I found you on Mini Bangladesh and would like to discuss your ${helper.service} service.`;
    const url = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('WhatsApp Not Installed', 'Please install WhatsApp to send messages.');
        }
      })
      .catch((err) => {
        console.error('Error opening WhatsApp:', err);
        Alert.alert('Error', 'Unable to open WhatsApp');
      });
  };

  const getServiceEmoji = (service: string) => {
    const emojiMap: { [key: string]: string } = {
      'Doctor': '👨‍⚕️',
      'Plumber': '🔧',
      'Electrician': '⚡',
      'Tutor': '📚',
      'Mechanic': '🔩',
      'Cleaner': '🧹',
      'Carpenter': '🪚',
      'Painter': '🎨',
      'Blood Donor': '🩸',
    };
    return emojiMap[service] || '👨‍💼';
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
              <Text style={styles.avatarEmoji}>{getServiceEmoji(helper.service)}</Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.name}>{helper.name}</Text>

              <View style={styles.serviceBadge}>
                <Text style={styles.serviceText}>{helper.service}</Text>
              </View>

              {/* Availability Badge */}
              <View style={[
                styles.availabilityBadge, 
                helper.available ? styles.availableBadge : styles.unavailableBadge
              ]}>
                <Text style={styles.availabilityText}>
                  {helper.available !== false ? '✓ Available' : '✗ Not Available'}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Contact Information Card */}
        <Card style={styles.contactCard} padding={spacing.base}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          {/* Phone */}
          {helper.phone && (
            <View style={styles.contactRow}>
              <Text style={styles.contactIcon}>📱</Text>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{helper.phone}</Text>
              </View>
            </View>
          )}

          {/* WhatsApp */}
          {helper.whatsapp && (
            <View style={styles.contactRow}>
              <Text style={styles.contactIcon}>💬</Text>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>WhatsApp</Text>
                <Text style={styles.contactValue}>{helper.whatsapp}</Text>
              </View>
            </View>
          )}

          {/* Email */}
          {helper.email && (
            <View style={styles.contactRow}>
              <Text style={styles.contactIcon}>✉️</Text>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{helper.email}</Text>
              </View>
            </View>
          )}

          {!helper.phone && !helper.whatsapp && !helper.email && (
            <Text style={styles.noContactText}>No contact information available</Text>
          )}
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
            <Text style={styles.locationText}>{helper.address || 'No address provided'}</Text>
          </View>
        </Card>

        {/* Blood Group */}
        {helper.bloodGroup && (
          <Card style={styles.bloodCard} padding={spacing.base}>
            <Text style={styles.sectionTitle}>Blood Group</Text>
            <View style={styles.bloodRow}>
              <Text style={styles.bloodIcon}>🩸</Text>
              <Text style={styles.bloodText}>{helper.bloodGroup}</Text>
            </View>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {/* Phone Button */}
          {helper.phone && (
            <Button
              title="📞 Call"
              onPress={handlePhoneCall}
              variant="primary"
              size="large"
              fullWidth
              style={styles.actionButton}
            />
          )}

          {/* WhatsApp Button */}
          {(helper.whatsapp || helper.phone) && (
            <Button
              title="💬 WhatsApp"
              onPress={handleWhatsAppMessage}
              variant="whatsapp"
              size="large"
              fullWidth
              style={styles.actionButton}
            />
          )}
        </View>

        {/* Help Text */}
        <View style={styles.helpCard}>
          <Text style={styles.helpIcon}>ℹ️</Text>
          <Text style={styles.helpText}>
            Tap the buttons above to call or message this helper directly from your device.
          </Text>
        </View>
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

  // Profile Card
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
    marginBottom: spacing.xs,
  },
  serviceText: { 
    color: colors.textWhite, 
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },

  // Availability Badge
  availabilityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  availableBadge: {
    backgroundColor: '#E8F5E9',
  },
  unavailableBadge: {
    backgroundColor: '#FFEBEE',
  },
  availabilityText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.textPrimary,
  },

  // Contact Card
  contactCard: { marginBottom: spacing.base },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  contactValue: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    fontWeight: typography.fontWeight.medium,
  },
  noContactText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: spacing.base,
  },

  // About Card
  aboutCard: { marginBottom: spacing.base },
  aboutText: { 
    color: colors.textSecondary, 
    fontSize: typography.fontSize.base, 
    lineHeight: 22 
  },

  // Location Card
  locationCard: { marginBottom: spacing.base },
  locationRow: { flexDirection: 'row', alignItems: 'flex-start' },
  locationIcon: { fontSize: 16, marginRight: spacing.sm, marginTop: 2 },
  locationText: { 
    flex: 1,
    color: colors.textSecondary, 
    fontSize: typography.fontSize.base,
    lineHeight: 22,
  },

  // Blood Card
  bloodCard: { marginBottom: spacing.base },
  bloodRow: { flexDirection: 'row', alignItems: 'center' },
  bloodIcon: { fontSize: 20, marginRight: spacing.sm },
  bloodText: { 
    fontSize: typography.fontSize.lg, 
    fontWeight: typography.fontWeight.semibold,
    color: colors.accent,
  },

  // Action Buttons
  actionButtons: {
    marginBottom: spacing.base,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },

  // Help Card
  helpCard: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundLight,
    padding: spacing.base,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  helpIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  helpText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default HelperDetailScreen;
