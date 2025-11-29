import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows, layout } from '../theme/theme';
import { HomeScreenProps } from '../types/navigation';
import { getStats } from '../api/auth'; // <-- Added import

/**
 * HomeScreen
 * Main landing screen with hero section and action cards
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);

  // Stats state
  const [stats, setStats] = useState({ helpers: 0, consumers: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  // Refresh state
  const [refreshing, setRefreshing] = useState(false);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchStats();
    }, [])
  );

  // Fetch stats function
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      console.log("Stats fetch failed:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getStats();
      setStats(data);
    } catch (e) {
      console.log("Refresh error:", e);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Menu */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMenu(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🇧🇩</Text>
          </View>
          <Text style={styles.title}>Mini Bangladesh</Text>
          <Text style={styles.subtitle}>Find help near you – instantly!</Text>
        </View>

        {/* Main Action Cards */}
        <View style={styles.actionCards}>
          {/* Search for Helpers */}
          <TouchableOpacity
            style={[styles.actionCard, styles.primaryCard]}
            onPress={() => navigation.navigate('Search')}
            activeOpacity={0.9}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardEmoji}>🔍</Text>
                <Text style={styles.cardTitle}>Search for Helpers</Text>
                <Text style={styles.cardDescription}>
                  Find tutors, electricians, doctors, plumbers and more
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Become a Helper */}
          <TouchableOpacity
            style={[styles.actionCard, styles.secondaryCard]}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.9}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardEmoji}>🤝</Text>
                <Text style={styles.cardTitle}>Become a Helper</Text>
                <Text style={styles.cardDescription}>
                  Register to help others in your community
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Community Stats */}
        <View style={styles.stats}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <Text style={styles.statNumber}>
              {loadingStats ? "…" : stats.helpers}
            </Text>
            <Text style={styles.statLabel}>Total Helpers</Text>
          </View>

          <View style={[styles.statCard, styles.statCardSecondary]}>
            <Text style={styles.statNumber}>
              {loadingStats ? "…" : stats.consumers}
            </Text>
            <Text style={styles.statLabel}>Total Consumers</Text>
          </View>
        </View>
      </ScrollView>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuModal}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                // Toggle theme functionality
              }}
            >
              <Text style={styles.menuItemIcon}>🌙</Text>
              <Text style={styles.menuItemText}>Toggle Theme</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                setShowAbout(true);
              }}
            >
              <Text style={styles.menuItemIcon}>ℹ️</Text>
              <Text style={styles.menuItemText}>About</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                // Help & Feedback functionality
              }}
            >
              <Text style={styles.menuItemIcon}>💬</Text>
              <Text style={styles.menuItemText}>Help & Feedback</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={showAbout}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAbout(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.aboutModal}>
            <Text style={styles.aboutTitle}>About Mini Bangladesh</Text>
            <Text style={styles.aboutText}>
              Mini Bangladesh connects local people with nearby service providers.
              Find trusted helpers in your community for any task.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAbout(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.base,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 24,
    color: colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl,
    paddingBottom: layout.bottomNavHeight + spacing.base,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
    borderWidth: 4,
    borderColor: colors.primary,
    ...shadows.lg,
  },
  logoEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
  },
  actionCards: {
    marginBottom: spacing.xl,
  },
  actionCard: {
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    marginBottom: spacing.base,
    ...shadows.lg,
  },
  primaryCard: {
    backgroundColor: colors.primary,
  },
  secondaryCard: {
    backgroundColor: colors.accent,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    flex: 1,
  },
  cardEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    fontSize: typography.fontSize.base,
    color: colors.textWhite,
    opacity: 0.9,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#ffffff22",
  },
  statCardPrimary: {
    backgroundColor: "#234C6A", 
  },
  statCardSecondary: {
    backgroundColor: "#234C6A", 
  },

  statNumber: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textWhite,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textWhite,
    opacity: 0.9,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuModal: {
    position: 'absolute',
    top: layout.headerHeight + spacing.sm,
    right: spacing.base,
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    minWidth: 200,
    ...shadows.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  menuItemIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  menuItemText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  aboutModal: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginHorizontal: spacing.xl,
    ...shadows.xl,
  },
  aboutTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.base,
  },
  aboutText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.base,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textWhite,
  },
});

export default HomeScreen;
