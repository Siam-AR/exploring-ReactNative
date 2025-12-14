import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import HelperCard from '../components/HelperCard';
import Card from '../components/Card';

import { colors, typography, spacing, borderRadius, layout } from '../theme/theme';
import { RootStackParamList, Helper } from '../types/navigation';
import { getHelpers } from '../api/helpers';

interface Service {
  id: string;
  name: string;
  emoji: string;
}

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();

  const [selectedService, setSelectedService] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [helpers, setHelpers] = useState<Helper[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const services: Service[] = [
    { id: '1', name: 'Doctor', emoji: '👨‍⚕️' },
    { id: '2', name: 'Plumber', emoji: '🔧' },
    { id: '3', name: 'Electrician', emoji: '⚡' },
    { id: '4', name: 'Tutor', emoji: '📚' },
    { id: '5', name: 'Mechanic', emoji: '🔩' },
    { id: '6', name: 'Cleaner', emoji: '🧹' },
    { id: '7', name: 'Carpenter', emoji: '🪚' },
    { id: '8', name: 'Painter', emoji: '🎨' },
    { id: '9', name: 'Blood Donor', emoji: '🩸' },
  ];

  // Check user role on mount and when screen focuses
  useFocusEffect(
    useCallback(() => {
      checkUserRole();
    }, [])
  );

  const checkUserRole = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        setUserRole(user.role);
        setIsLoggedIn(true);
        
        // If Consumer, fetch helpers automatically
        if (user.role === 'Consumer') {
          fetchHelpers();
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    } catch (err) {
      console.error('Error checking user role:', err);
    }
  };

  const fetchHelpers = async (serviceFilter?: string, locationFilter?: string) => {
    try {
      setLoading(true);
      
      const filters: any = {};
      if (serviceFilter) filters.service = serviceFilter;
      if (locationFilter) filters.location = locationFilter;
      
      const data = await getHelpers(filters);
      const arr: Helper[] = Array.isArray(data) ? data : [];
      setHelpers(arr);
    } catch (err) {
      console.error('Helpers Fetch Error:', err);
      Alert.alert('Error', 'Failed to fetch helpers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchHelpers(selectedService, location);
  };

  const handleClearFilters = () => {
    setSelectedService('');
    setLocation('');
    fetchHelpers();
  };

  // Helper Role Access Restriction
  if (isLoggedIn && userRole === 'Helper') {
    return (
      <View style={styles.container}>
        <Header
          title="Find Helpers"
          leftAction={{
            icon: <Text style={styles.backIcon}>←</Text>,
            onPress: () => navigation.goBack(),
          }}
        />
        
        <View style={styles.restrictedContainer}>
          <Card style={styles.restrictedCard} padding={spacing.xl}>
            <Text style={styles.restrictedEmoji}>🚫</Text>
            <Text style={styles.restrictedTitle}>Access Restricted</Text>
            <Text style={styles.restrictedText}>
              Searching helpers is only available for consumers.
            </Text>
            <Text style={styles.restrictedSubtext}>
              You are logged in as a Helper. Switch to a Consumer account to search for helpers.
            </Text>
          </Card>
        </View>
      </View>
    );
  }

  // Not Logged In
  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Header
          title="Find Helpers"
          leftAction={{
            icon: <Text style={styles.backIcon}>←</Text>,
            onPress: () => navigation.goBack(),
          }}
        />
        
        <View style={styles.restrictedContainer}>
          <Card style={styles.restrictedCard} padding={spacing.xl}>
            <Text style={styles.restrictedEmoji}>🔒</Text>
            <Text style={styles.restrictedTitle}>Login Required</Text>
            <Text style={styles.restrictedText}>
              Please login as a Consumer to search for helpers.
            </Text>
            <Button
              title="Go to Profile"
              onPress={() => navigation.navigate('MainTabs', { screen: 'Profile' })}
              variant="primary"
              size="medium"
              style={{ marginTop: spacing.base }}
            />
          </Card>
        </View>
      </View>
    );
  }

  // Consumer View - Normal Search
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
        {/* Filter Section */}
        <Card style={styles.filterCard} padding={spacing.base}>
          <Text style={styles.sectionTitle}>Select Service</Text>

          {/* Service Chips */}
          <View style={styles.chipsContainer}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.chip,
                  selectedService === service.name && styles.chipActive,
                ]}
                onPress={() => setSelectedService(service.name)}
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

          <Input
            label="Location"
            placeholder="Enter your area (e.g., Dhaka, Chittagong)"
            value={location}
            onChangeText={setLocation}
            icon={<Text style={styles.inputIcon}>📍</Text>}
          />

          <View style={styles.buttonRow}>
            <Button
              title="Clear"
              onPress={handleClearFilters}
              variant="outline"
              size="medium"
              style={{ flex: 1, marginRight: spacing.xs }}
            />
            <Button
              title="Search Helpers"
              onPress={handleSearch}
              variant="primary"
              size="medium"
              style={{ flex: 1, marginLeft: spacing.xs }}
            />
          </View>
        </Card>

        {/* Active Filters Display */}
        {(selectedService || location) && (
          <View style={styles.activeFilters}>
            <Text style={styles.activeFiltersText}>
              Filters: {selectedService && `Service: ${selectedService}`}
              {selectedService && location && ' • '}
              {location && `Location: ${location}`}
            </Text>
          </View>
        )}

        {/* Results */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Available Helpers</Text>
          <Text style={styles.resultsCount}>{helpers.length} found</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Searching helpers...</Text>
          </View>
        ) : helpers.length === 0 ? (
          <Card style={styles.emptyCard} padding={spacing.xl}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No Helpers Found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your filters or search in a different location.
            </Text>
          </Card>
        ) : (
          helpers.map((helper) => (
            <HelperCard
              key={helper._id}
              name={helper.name}
              service={helper.service}
              location={helper.address}
              onPress={() =>
                navigation.navigate('HelperDetail', { helper })
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  content: {
    padding: spacing.base,
    paddingBottom: layout.bottomNavHeight + spacing.base,
  },
  backIcon: { fontSize: 24, color: colors.textPrimary },

  filterCard: { marginBottom: spacing.base },

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

  chipEmoji: { fontSize: 16, marginRight: spacing.xs },

  chipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },

  chipTextActive: { color: colors.textWhite },

  inputIcon: { fontSize: 16 },

  buttonRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },

  activeFilters: {
    backgroundColor: colors.backgroundLight,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.base,
  },

  activeFiltersText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
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

  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },

  loadingText: {
    marginTop: spacing.sm,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },

  emptyCard: {
    alignItems: 'center',
  },

  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.base,
  },

  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Restricted Access Styles
  restrictedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },

  restrictedCard: {
    alignItems: 'center',
    maxWidth: 400,
  },

  restrictedEmoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },

  restrictedTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  restrictedText: {
    fontSize: typography.fontSize.lg,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },

  restrictedSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default SearchScreen;
