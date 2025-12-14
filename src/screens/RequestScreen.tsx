import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  Linking,
  Alert as RNAlert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import EmergencyCard from "../components/EmergencyCard";
import Card from "../components/Card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createRequest, getRequests } from "../api/request";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  layout,
} from "../theme/theme";

interface Service {
  id: string;
  name: string;
  emoji: string;
}

const RequestScreen: React.FC = () => {
  const navigation = useNavigation();

  const [selectedService, setSelectedService] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showRequestDetail, setShowRequestDetail] = useState(false);
  
  // Add user role state
  const [userRole, setUserRole] = useState<string | null>(null);

  const services: Service[] = [
    { id: "1", name: "Doctor", emoji: "👨‍⚕️" },
    { id: "2", name: "Plumber", emoji: "🔧" },
    { id: "3", name: "Electrician", emoji: "⚡" },
    { id: "4", name: "Mechanic", emoji: "🔩" },
    { id: "5", name: "Blood Donor", emoji: "🩸" },
  ];

  // Fetch user role
  const fetchUserRole = async () => {
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserRole(user.role);
      }
    } catch (error) {
      console.log("Error fetching user role:", error);
    }
  };

  // Fetch Requests From Backend
  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log("❌ No token found");
        setError("Please login to view requests");
        setRequests([]);
        return;
      }

      console.log(
        "📡 Fetching requests with token:",
        token.substring(0, 20) + "..."
      );

      const data = await getRequests(token);

      console.log("✅ API Response:", JSON.stringify(data, null, 2));

      // Handle different response formats
      let requestsArray: any[] = [];

      if (Array.isArray(data)) {
        requestsArray = data;
      } else if (data && data.requests && Array.isArray(data.requests)) {
        requestsArray = data.requests;
      } else if (data && data.data && Array.isArray(data.data)) {
        requestsArray = data.data;
      } else {
        console.log("⚠️ Unexpected data format:", data);
      }

      console.log(`📊 Found ${requestsArray.length} requests`);
      setRequests(requestsArray);
    } catch (err: any) {
      console.log("❌ GET REQUEST ERROR:", err);
      console.log("Error details:", err.response?.data || err.message);

      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch requests";
      setError(errorMessage);

      // If token is invalid, clear it
      if (err.response?.status === 401 || err.response?.status === 403) {
        await AsyncStorage.removeItem("token");
        Alert.alert("Session Expired", "Please login again");
      }
    } finally {
      setLoading(false);
    }
  };

  // AUTO REFRESH WHEN SCREEN FOCUSES
  useFocusEffect(
    useCallback(() => {
      fetchUserRole();
      fetchRequests();
    }, [])
  );

  // Submit New Request
  const handlePostRequest = async () => {
    if (!selectedService || !description || !location) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    try {
      setPosting(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      console.log(
        "📤 Creating request:",
        { serviceType: selectedService, description, location }
      );

      await createRequest(token, {
        serviceType: selectedService,
        description,
        location,
      });

      Alert.alert("Success", "Request Posted Successfully!");

      // Clear fields
      setSelectedService("");
      setDescription("");
      setLocation("");

      // Refresh list
      fetchRequests();
    } catch (err: any) {
      console.log("❌ POST REQUEST ERROR:", err);
      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setPosting(false);
    }
  };

  // Add function to handle WhatsApp
  const handleWhatsApp = async (phone: string, consumerName: string) => {
    if (!phone) {
      Alert.alert("No Contact", "This consumer has not provided a contact number.");
      return;
    }

    let cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "880" + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith("880")) {
      cleanPhone = "880" + cleanPhone;
    }

    const msg = `Hi ${consumerName}, I saw your help request on Mini Bangladesh. I can assist you.`;
    
    // Try app URL first, then fallback to web URL
    const appUrl = `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
    const webUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

    try {
      // Try to open directly without canOpenURL check
      await Linking.openURL(appUrl);
    } catch (error) {
      console.log("App URL failed, trying web URL:", error);
      try {
        // Fallback to web URL (works on both platforms)
        await Linking.openURL(webUrl);
      } catch (err) {
        console.error("Both URLs failed:", err);
        Alert.alert(
          "Cannot Open WhatsApp",
          "Please make sure WhatsApp is installed or try calling instead."
        );
      }
    }
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
        {/* Post Request Card - Only show for Consumers */}
        {userRole === "Consumer" && (
          <Card style={styles.formCard} padding={spacing.base}>
            <View style={styles.formHeader}>
              <Text style={styles.formEmoji}>🚨</Text>
              <Text style={styles.formTitle}>Post Emergency Request</Text>
            </View>

            {/* Services */}
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
              label="Description"
              placeholder="Describe your emergency..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <Input
              label="Location"
              placeholder="Enter your location"
              value={location}
              onChangeText={setLocation}
              icon={<Text style={styles.inputIcon}>📍</Text>}
            />

            <Button
              title={posting ? "Posting..." : "Post Request"}
              onPress={handlePostRequest}
              variant="danger"
              size="large"
              fullWidth
              disabled={posting}
            />
          </Card>
        )}

        {/* Active Requests */}
        <View style={styles.requestsSection}>
          <Text style={styles.requestsTitle}>Active Requests</Text>
          <Text style={styles.requestsCount}>{requests.length} requests</Text>
        </View>

        {/* Loader */}
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading requests...</Text>
          </View>
        )}

        {/* Error State */}
        {!loading && error && (
          <Card style={styles.errorCard} padding={spacing.base}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Button
              title="Retry"
              onPress={fetchRequests}
              variant="outline"
              size="small"
            />
          </Card>
        )}

        {/* No Requests */}
        {!loading && !error && requests.length === 0 && (
          <Card style={styles.emptyCard} padding={spacing.xl}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>No Active Requests</Text>
            <Text style={styles.emptyText}>
              There are no emergency requests at the moment.
            </Text>
          </Card>
        )}

        {/* Render Requests */}
        {!loading &&
          !error &&
          requests.map((req: any) => (
            <EmergencyCard
              key={req._id || req.id}
              title={`${req.serviceType} Needed`}
              description={req.description}
              location={req.location}
              timeAgo={new Date(req.createdAt).toLocaleString()}
              status={req.status}
              phone={req.consumer?.phone}
              whatsapp={req.consumer?.whatsapp}
              onPhoneCall={() => {
                if (req.consumer?.phone) {
                  Linking.openURL(`tel:${req.consumer.phone}`).catch(() => {
                    Alert.alert('Error', 'Unable to make phone call');
                  });
                }
              }}
              onWhatsApp={() => {
                handleWhatsApp(
                  req.consumer?.whatsapp || req.consumer?.phone,
                  req.consumer?.name
                );
              }}
              onPress={() => {
                setSelectedRequest(req);
                setShowRequestDetail(true);
              }}
            />
          ))}
      </ScrollView>

      {/* Request Detail Modal */}
      <Modal
        visible={showRequestDetail}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRequestDetail(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.detailModal}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>Request Details</Text>
              <TouchableOpacity onPress={() => setShowRequestDetail(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedRequest && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Service Type */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Service Needed</Text>
                  <View style={styles.serviceBadge}>
                    <Text style={styles.serviceBadgeText}>
                      {selectedRequest.serviceType}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Description</Text>
                  <Text style={styles.detailValue}>
                    {selectedRequest.description}
                  </Text>
                </View>

                {/* Location */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>📍 Location</Text>
                  <Text style={styles.detailValue}>{selectedRequest.location}</Text>
                </View>

                {/* Status */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <Text
                    style={[styles.detailValue, { color: colors.primary }]}
                  >
                    {selectedRequest.status?.toUpperCase()}
                  </Text>
                </View>

                {/* Consumer Information */}
                {selectedRequest.consumer && (
                  <>
                    <View style={styles.divider} />
                    <Text style={styles.consumerTitle}>Consumer Information</Text>

                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>Name</Text>
                      <Text style={styles.detailValue}>
                        {selectedRequest.consumer.name}
                      </Text>
                    </View>

                    {selectedRequest.consumer.email && (
                      <View style={styles.detailSection}>
                        <Text style={styles.detailLabel}>Email</Text>
                        <Text style={styles.detailValue}>
                          {selectedRequest.consumer.email}
                        </Text>
                      </View>
                    )}

                    {selectedRequest.consumer.phone && (
                      <View style={styles.detailSection}>
                        <Text style={styles.detailLabel}>Phone</Text>
                        <Text style={styles.detailValue}>
                          {selectedRequest.consumer.phone}
                        </Text>
                      </View>
                    )}

                    {selectedRequest.consumer.whatsapp && (
                      <View style={styles.detailSection}>
                        <Text style={styles.detailLabel}>WhatsApp</Text>
                        <Text style={styles.detailValue}>
                          {selectedRequest.consumer.whatsapp}
                        </Text>
                      </View>
                    )}

                    {selectedRequest.consumer.address && (
                      <View style={styles.detailSection}>
                        <Text style={styles.detailLabel}>Address</Text>
                        <Text style={styles.detailValue}>
                          {selectedRequest.consumer.address}
                        </Text>
                      </View>
                    )}

                    {selectedRequest.consumer.bloodGroup && (
                      <View style={styles.detailSection}>
                        <Text style={styles.detailLabel}>Blood Group</Text>
                        <Text style={styles.detailValue}>
                          {selectedRequest.consumer.bloodGroup}
                        </Text>
                      </View>
                    )}
                  </>
                )}

                {/* Contact Button */}
                {selectedRequest.consumer &&
                  (selectedRequest.consumer.whatsapp ||
                    selectedRequest.consumer.phone) && (
                    <Button
                      title="💬 Contact on WhatsApp"
                      onPress={() =>
                        handleWhatsApp(
                          selectedRequest.consumer.whatsapp ||
                          selectedRequest.consumer.phone,
                          selectedRequest.consumer.name
                        )
                      }
                      variant="whatsapp"
                      size="large"
                      fullWidth
                      style={{ marginTop: spacing.base }}
                    />
                  )}

                {/* Posted Time */}
                <Text style={styles.postedTime}>
                  Posted: {new Date(selectedRequest.createdAt).toLocaleString()}
                </Text>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RequestScreen;

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
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  loaderContainer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
    fontSize: typography.fontSize.sm,
  },
  errorCard: {
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    marginVertical: spacing.base,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: typography.fontSize.md,
    color: colors.accent,
    textAlign: "center",
    marginBottom: spacing.base,
  },
  emptyCard: {
    alignItems: "center",
    marginVertical: spacing.base,
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
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  detailModal: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    elevation: 4,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.base,
  },
  detailTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  closeIcon: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  detailSection: {
    marginBottom: spacing.base,
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: typography.fontSize.md,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  serviceBadge: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignSelf: "flex-start",
    marginTop: spacing.xs,
  },
  serviceBadgeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textWhite,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.base,
  },
  consumerTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  postedTime: {
    marginTop: spacing.base,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
  },
});