import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
  const [filteredHelpers, setFilteredHelpers] = useState<Helper[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const services: Service[] = [
    { id: '1', name: 'Tutor', emoji: '📚' },
    { id: '2', name: 'Doctor', emoji: '👨‍⚕️' },
    { id: '3', name: 'Plumber', emoji: '🔧' },
    { id: '4', name: 'Electrician', emoji: '⚡' },
    { id: '5', name: 'Cleaner', emoji: '🧹' },
    { id: '6', name: 'Mechanic', emoji: '🔩' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getHelpers();

        const arr: Helper[] = Array.isArray(data) ? data : [];
        setHelpers(arr);
        setFilteredHelpers(arr);
      } catch (err) {
        console.error("Helpers Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    let results = helpers;

    if (selectedService) {
      results = results.filter(
        (h) => h.service.toLowerCase() === selectedService.toLowerCase()
      );
    }

    if (location) {
      results = results.filter((h) =>
        h.address.toLowerCase().includes(location.toLowerCase())
      );
    }

    setFilteredHelpers(results);
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
        {/* Filter Section */}
        <Card style={styles.filterCard} padding={spacing.base}>
          <Text style={styles.sectionTitle}>Select Service</Text>

          {/* Chips */}
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
            placeholder="Enter your area"
            value={location}
            onChangeText={setLocation}
            icon={<Text style={styles.inputIcon}>📍</Text>}
          />

          <Button
            title="Search Helpers"
            onPress={handleSearch}
            variant="primary"
            size="large"
            fullWidth
          />
        </Card>

        {/* Results */}
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Available Helpers</Text>
          <Text style={styles.resultsCount}>{filteredHelpers.length} found</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          filteredHelpers.map((helper) => (
            <HelperCard
              key={helper._id}
              name={helper.name}
              service={helper.service}
              location={helper.address}
              onPress={() =>
                navigation.navigate("HelperDetail", { helper })
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

  filterCard: { marginBottom: spacing.xl },

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
