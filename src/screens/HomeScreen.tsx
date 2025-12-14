import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, RefreshControl, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius, shadows, layout } from '../theme/theme';
import { HomeScreenProps } from '../types/navigation';
import { getStats } from '../api/stats';

interface Stats {
  helpers: number;
  consumers: number;
  requests: number;
  availableHelpers: number;
  activeRequests: number;
  recentHelpers: number;
  recentRequests: number;
  serviceBreakdown: Array<{ service: string; count: number }>;
  lastUpdated?: string;
}

/**
 * HomeScreen
 * Main landing screen with hero section and action cards
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showAbout, setShowAbout] = useState<boolean>(false);

  // Stats state
  const [stats, setStats] = useState<Stats>({
    helpers: 0,
    consumers: 0,
    requests: 0,
    availableHelpers: 0,
    activeRequests: 0,
    recentHelpers: 0,
    recentRequests: 0,
    serviceBreakdown: [],
  });
  const [loadingStats, setLoadingStats] = useState(true);
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

          {/* Post Emergency Request */}
          <TouchableOpacity
            style={[styles.actionCard, styles.dangerCard]}
            onPress={() => navigation.navigate('Request')}
            activeOpacity={0.9}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardEmoji}>🚨</Text>
                <Text style={styles.cardTitle}>Emergency Request</Text>
                <Text style={styles.cardDescription}>
                  Post urgent help requests to your community
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

        {/* Community Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Community Stats</Text>
          
          {loadingStats ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Loading statistics...</Text>
            </View>
          ) : (
            <>
              {/* Primary Stats Grid */}
              <View style={styles.statsGrid}>
                <View style={[styles.statCard, styles.statCardPrimary]}>
                  <Text style={styles.statIcon}>👥</Text>
                  <Text style={styles.statNumber}>{stats.helpers}</Text>
                  <Text style={styles.statLabel}>Total Helpers</Text>
                </View>

                <View style={[styles.statCard, styles.statCardSecondary]}>
                  <Text style={styles.statIcon}>🙋</Text>
                  <Text style={styles.statNumber}>{stats.consumers}</Text>
                  <Text style={styles.statLabel}>Total Consumers</Text>
                </View>
              </View>

              {/* Secondary Stats Grid */}
              <View style={styles.statsGrid}>
                <View style={[styles.statCard, styles.statCardSuccess]}>
                  <Text style={styles.statIcon}>✅</Text>
                  <Text style={styles.statNumber}>{stats.availableHelpers}</Text>
                  <Text style={styles.statLabel}>Available Now</Text>
                </View>

                <View style={[styles.statCard, styles.statCardWarning]}>
                  <Text style={styles.statIcon}>📋</Text>
                  <Text style={styles.statNumber}>{stats.activeRequests}</Text>
                  <Text style={styles.statLabel}>Active Requests</Text>
                </View>
              </View>

              {/* Recent Activity */}
              <View style={styles.activityCard}>
                <Text style={styles.activityTitle}>📈 Recent Activity (7 days)</Text>
                <View style={styles.activityRow}>
                  <View style={styles.activityItem}>
                    <Text style={styles.activityValue}>+{stats.recentHelpers}</Text>
                    <Text style={styles.activityLabel}>New Helpers</Text>
                  </View>
                  <View style={styles.activityDivider} />
                  <View style={styles.activityItem}>
                    <Text style={styles.activityValue}>+{stats.recentRequests}</Text>
                    <Text style={styles.activityLabel}>New Requests</Text>
                  </View>
                </View>
              </View>

              {/* Service Breakdown */}
              {stats.serviceBreakdown && stats.serviceBreakdown.length > 0 && (
                <View style={styles.servicesCard}>
                  <Text style={styles.servicesTitle}>🛠️ Popular Services</Text>
                  {stats.serviceBreakdown.map((service, index) => (
                    <View key={index} style={styles.serviceRow}>
                      <Text style={styles.serviceName}>{service.service}</Text>
                      <View style={styles.serviceCountBadge}>
                        <Text style={styles.serviceCount}>{service.count}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Last Updated */}
              {stats.lastUpdated && (
                <Text style={styles.lastUpdated}>
                  Last updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
                </Text>
              )}
            </>
          )}
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
                fetchStats();
              }}
            >
              <Text style={styles.menuItemIcon}>🔄</Text>
              <Text style={styles.menuItemText}>Refresh Stats</Text>
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
              Find trusted helpers in your community for any task – from tutoring
              to plumbing, from medical assistance to blood donation.
            </Text>
            <Text style={styles.aboutText}>
              Join our growing community of {stats.helpers + stats.consumers} members
              working together to make Bangladesh better!
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
    backgroundColor: '#2E7D32', // Green
  },
  dangerCard: {
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
    fontSize: typography.fontSize['2xl'],
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

  // Stats Section
  statsSection: {
    marginBottom: spacing.xl,
  },
  statsTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.base,
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
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.base,
    marginBottom: spacing.base,
  },
  statCard: {
    flex: 1,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  statCardPrimary: {
    backgroundColor: '#1976D2',
  },
  statCardSecondary: {
    backgroundColor: '#7B1FA2',
  },
  statCardSuccess: {
    backgroundColor: '#388E3C',
  },
  statCardWarning: {
    backgroundColor: '#F57C00',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  statNumber: {
    fontSize: typography.fontSize['4xl'],
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

  // Activity Card
  activityCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.base,
    ...shadows.sm,
  },
  activityTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityItem: {
    flex: 1,
    alignItems: 'center',
  },
  activityValue: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  activityLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  activityDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: spacing.base,
  },

  // Services Card
  servicesCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.base,
    ...shadows.sm,
  },
  servicesTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  serviceName: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  serviceCountBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  serviceCount: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textWhite,
  },

  lastUpdated: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  // Modal Styles
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
    marginBottom: spacing.base,
  },
  closeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.base,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginTop: spacing.base,
  },
  closeButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textWhite,
  },
});

export default HomeScreen;
