import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import HelperCard from '../components/HelperCard';
import Card from '../components/Card';
import { colors, typography, spacing, borderRadius, layout } from '../theme/theme';
import { RootStackParamList, Helper } from '../types/navigation';

interface Service {
  id: string;
  name: string;
  emoji: string;
}

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * SearchScreen
 * Search and filter helpers by service type and location
 */
const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [selectedService, setSelectedService] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  const services: Service[] = [
    { id: '1', name: 'Tutor', emoji: '📚' },
    { id: '2', name: 'Doctor', emoji: '👨‍⚕️' },
    { id: '3', name: 'Plumber', emoji: '🔧' },
    { id: '4', name: 'Electrician', emoji: '⚡' },
    { id: '5', name: 'Cleaner', emoji: '🧹' },
    { id: '6', name: 'Mechanic', emoji: '🔩' },
  ];

  const helpers: Helper[] = [
    {
      id: '1',
      name: 'Ahmed Rahman',
      service: 'Tutor',
      location: 'Dhaka, Gulshan',
      rating: 4.8,
      hourlyRate: '৳500',
    },
    {
      id: '2',
      name: 'Dr. Fatima Khan',
      service: 'Doctor',
      location: 'Dhaka, Dhanmondi',
      rating: 4.9,
      hourlyRate: '৳1000',
    },
    {
      id: '3',
      name: 'Karim Hossain',
      service: 'Plumber',
      location: 'Dhaka, Mirpur',
      rating: 4.5,
      hourlyRate: '৳400',
    },
    {
      id: '4',
      name: 'Rashid Ali',
      service: 'Electrician',
      location: 'Dhaka, Banani',
      rating: 4.7,
      hourlyRate: '৳600',
    },
  ];

  const handleSearch = (): void => {
    console.log('Searching for:', selectedService, 'in', location);
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Find Helpers"
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
        {/* Filters Card */}
        <Card style={styles.filterCard} padding={spacing.base}>
          <Text style={styles.sectionTitle}>Select Service</Text>
          
          {/* Service Type Chips */}
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

          {/* Location Input */}
          <Input
            label="Location"
            placeholder="Enter your area (e.g., Dhaka, Gulshan)"
            value={location}
            onChangeText={setLocation}
            icon={<Text style={styles.inputIcon}>📍</Text>}
          />

          {/* Search Button */}
          <Button
            title="Search Helpers"
            onPress={handleSearch}
            variant="primary"
            size="large"
            fullWidth
          />
        </Card>

        {/* Results Section */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Available Helpers</Text>
          <Text style={styles.resultsCount}>{helpers.length} helpers found</Text>
        </View>

        {/* Helper Cards */}
        {helpers.map((helper) => (
          <HelperCard
            key={helper.id}
            name={helper.name}
            service={helper.service}
            location={helper.location}
            rating={helper.rating}
            hourlyRate={helper.hourlyRate}
            onPress={() => navigation.navigate('HelperDetail', { helper })}
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
  filterCard: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
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
    backgroundColor: colors.primary,
    borderColor: colors.primary,
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
  resultsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  resultsTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  resultsCount: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
});

export default SearchScreen;
