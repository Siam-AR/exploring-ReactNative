import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import EmergencyCard, { EmergencyStatus } from '../components/EmergencyCard';
import Card from '../components/Card';
import { colors, typography, spacing, borderRadius, layout } from '../theme/theme';

interface Service {
  id: string;
  name: string;
  emoji: string;
}

interface EmergencyRequest {
  id: string;
  title: string;
  description: string;
  location: string;
  timeAgo: string;
  status: EmergencyStatus;
}

/**
 * RequestScreen
 * Post emergency service requests and view active requests
 */
const RequestScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedService, setSelectedService] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  const services: Service[] = [
    { id: '1', name: 'Doctor', emoji: '👨‍⚕️' },
    { id: '2', name: 'Plumber', emoji: '🔧' },
    { id: '3', name: 'Electrician', emoji: '⚡' },
    { id: '4', name: 'Mechanic', emoji: '🔩' },
  ];

  const emergencyRequests: EmergencyRequest[] = [
    {
      id: '1',
      title: 'Urgent Plumber Needed',
      description: 'Water pipe burst in kitchen, need immediate help',
      location: 'Dhaka, Gulshan-2',
      timeAgo: '5 min ago',
      status: 'active',
    },
    {
      id: '2',
      title: 'Electrician Required',
      description: 'Power outage in entire building, fuse box issue',
      location: 'Dhaka, Dhanmondi',
      timeAgo: '15 min ago',
      status: 'pending',
    },
    {
      id: '3',
      title: 'Doctor Emergency',
      description: 'Need home visit for elderly patient with fever',
      location: 'Dhaka, Mirpur-10',
      timeAgo: '30 min ago',
      status: 'resolved',
    },
  ];

  const handlePostRequest = (): void => {
    if (!selectedService || !description || !location) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    console.log('Posting request:', { selectedService, description, location });
    // Clear form
    setSelectedService('');
    setDescription('');
    setLocation('');
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Emergency Requests"
        leftAction={{
          icon: <Text style={styles.backIcon}>←</Text>,
          onPress: () => navigation.goBack(),
        }}
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Post Request Form */}
        <Card style={styles.formCard} padding={spacing.base}>
          <View style={styles.formHeader}>
            <Text style={styles.formEmoji}>🚨</Text>
            <Text style={styles.formTitle}>Post Emergency Request</Text>
          </View>

          {/* Service Type Chips */}
          <Text style={styles.label}>Service Type</Text>
          <View style={styles.chipsContainer}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.chip,
                  selectedService === service.name && styles.chipActive,
                ]}
                onPress={() => setSelectedService(service.name)}
                activeOpacity={0.7}
              >
                <Text style={styles.chipEmoji}>{service.emoji}</Text>
                <Text
                  style={[
                    styles.chipText,
                    selectedService === service.name && styles.chipTextActive,
                  ]}
                >
                  {service.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description Input */}
          <Input
            label="Description"
            placeholder="Describe your emergency..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          {/* Location Input */}
          <Input
            label="Location"
            placeholder="Enter your location"
            value={location}
            onChangeText={setLocation}
            icon={<Text style={styles.inputIcon}>📍</Text>}
          />

          {/* Post Button */}
          <Button
            title="Post Request"
            onPress={handlePostRequest}
            variant="danger"
            size="large"
            fullWidth
          />
        </Card>

        {/* Active Requests Section */}
        <View style={styles.requestsSection}>
          <Text style={styles.requestsTitle}>Active Requests</Text>
          <Text style={styles.requestsCount}>{emergencyRequests.length} requests</Text>
        </View>

        {/* Emergency Cards */}
        {emergencyRequests.map((request) => (
          <EmergencyCard
            key={request.id}
            title={request.title}
            description={request.description}
            location={request.location}
            timeAgo={request.timeAgo}
            status={request.status}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.base,
    paddingBottom: layout.bottomNavHeight + spacing.base,
  },
  backIcon: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  formCard: {
    marginBottom: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  formEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  formTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.backgroundDark,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipEmoji: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  chipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.textWhite,
  },
  inputIcon: {
    fontSize: 16,
  },
  requestsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  requestsTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  requestsCount: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
});

export default RequestScreen;
