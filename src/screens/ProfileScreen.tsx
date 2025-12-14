import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import {
  colors,
  typography,
  spacing,
  borderRadius,
  layout,
} from "../theme/theme";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, registerUser } from "../api/auth";
import { getMyProfile, updateMyProfile } from "../api/helpers";
import { getMyConsumerProfile, updateMyConsumerProfile } from "../api/consumer";

type ActiveTab = "login" | "register";

const ROLES = ["Consumer", "Helper"];
const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

const SERVICE_TYPES = [
  "Doctor",
  "Plumber",
  "Electrician",
  "Mechanic",
  "Tutor",
  "Cleaner",
  "Carpenter",
  "Painter",
  "Blood Donor",
  "Other",
];

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("login");

  // Auth fields
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<string>("Consumer");
  const [bloodGroup, setBloodGroup] = useState<string>("A+");
  const [address, setAddress] = useState<string>("");

  // Dropdowns
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isBloodMenuOpen, setIsBloodMenuOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);

  // Helper profile fields
  const [helperService, setHelperService] = useState<string>("");
  const [helperPhone, setHelperPhone] = useState<string>("");
  const [helperWhatsapp, setHelperWhatsapp] = useState<string>("");
  const [helperAddress, setHelperAddress] = useState<string>("");
  const [helperAvailable, setHelperAvailable] = useState<boolean>(true);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  // Consumer profile fields
  const [consumerPhone, setConsumerPhone] = useState<string>("");
  const [consumerWhatsapp, setConsumerWhatsapp] = useState<string>("");
  const [consumerAddress, setConsumerAddress] = useState<string>("");
  const [consumerProfileLoading, setConsumerProfileLoading] = useState<boolean>(false);
  const [isEditingConsumerProfile, setIsEditingConsumerProfile] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userJson = await AsyncStorage.getItem("user");
        if (token && userJson) {
          const userData = JSON.parse(userJson);
          setUser(userData);
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.warn("Error restoring session:", err);
      }
    })();
  }, []);

  // Fetch helper profile when screen focuses
  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn && user?.role === "Helper") {
        fetchHelperProfile();
      } else if (isLoggedIn && user?.role === "Consumer") {
        fetchConsumerProfile();
      }
    }, [isLoggedIn, user])
  );

  const fetchHelperProfile = async () => {
    try {
      setProfileLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const profile = await getMyProfile(token);

      setHelperService(profile.service || "");
      setHelperPhone(profile.phone || "");
      setHelperWhatsapp(profile.whatsapp || "");
      setHelperAddress(profile.address || "");
      setHelperAvailable(
        profile.available !== undefined ? profile.available : true
      );
    } catch (err: any) {
      console.error("Failed to fetch helper profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  const fetchConsumerProfile = async () => {
    try {
      setConsumerProfileLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const profile = await getMyConsumerProfile(token);

      setConsumerPhone(profile.phone || "");
      setConsumerWhatsapp(profile.whatsapp || "");
      setConsumerAddress(profile.address || "");
    } catch (err: any) {
      console.error("Failed to fetch consumer profile:", err);
    } finally {
      setConsumerProfileLoading(false);
    }
  };

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      console.log("🔐 Attempting login with:", email);

      const res = await loginUser(email, password);
      console.log("✅ Login response:", res);

      const token = res.token;
      const resUser = res.user;

      if (!token || !resUser) {
        throw new Error("Invalid response from server");
      }

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(resUser));

      setUser(resUser);
      setIsLoggedIn(true);
      setEmail("");
      setPassword("");

      Alert.alert("Success", "Logged in successfully");
    } catch (error: any) {
      console.error("❌ Login error:", error);
      const msg = error?.message || "Login failed";
      Alert.alert("Login failed", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (): Promise<void> => {
    if (!name || !email || !password || !confirmPassword || !role) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      console.log("📝 Attempting registration for:", email);

      const res = await registerUser({
        name,
        email,
        password,
        confirmPassword,
        role,
        bloodGroup,
        address,
      });

      console.log("✅ Registration response:", res);

      Alert.alert("Success", "Registration successful — please login");
      setActiveTab("login");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAddress("");
      setRole("Consumer");
      setBloodGroup("A+");
    } catch (error: any) {
      console.error("❌ Registration error:", error);
      const msg = error?.message || "Registration failed";
      Alert.alert("Registration failed", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHelperProfile = async (): Promise<void> => {
    if (!helperService || !helperPhone || !helperAddress) {
      Alert.alert("Error", "Please fill service type, phone, and address");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Not authenticated");
        return;
      }

      await updateMyProfile(token, {
        service: helperService,
        phone: helperPhone,
        whatsapp: helperWhatsapp,
        address: helperAddress,
        available: helperAvailable,
      });

      Alert.alert("Success", "Profile updated successfully");
      setIsEditingProfile(false);
      fetchHelperProfile();
    } catch (error: any) {
      console.error("❌ Update helper profile error:", error);
      const msg = error?.message || "Failed to update profile";
      Alert.alert("Update failed", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConsumerProfile = async (): Promise<void> => {
    if (!consumerPhone || !consumerAddress) {
      Alert.alert("Error", "Please fill phone number and address");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Not authenticated");
        return;
      }

      await updateMyConsumerProfile(token, {
        phone: consumerPhone,
        whatsapp: consumerWhatsapp,
        address: consumerAddress,
      });

      Alert.alert("Success", "Profile updated successfully");
      setIsEditingConsumerProfile(false);
      fetchConsumerProfile();
    } catch (error: any) {
      console.error("❌ Update consumer profile error:", error);
      const msg = error?.message || "Failed to update profile";
      Alert.alert("Update failed", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setIsEditingProfile(false);
    setIsEditingConsumerProfile(false);
    Alert.alert("Success", "Logged out successfully");
  };

  // Helper Logged In View
  if (isLoggedIn && user && user.role === "Helper") {
    return (
      <View style={styles.container}>
        <Header
          title="Helper Profile"
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
          <Card style={styles.profileCard} padding={spacing.lg}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarEmojiLarge}>👨‍⚕️</Text>
            </View>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <Text style={styles.roleTag}>Helper Account</Text>
          </Card>

          {profileLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              <Card style={styles.formCard} padding={spacing.lg}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Profile Information</Text>
                  {!isEditingProfile && (
                    <TouchableOpacity onPress={() => setIsEditingProfile(true)}>
                      <Text style={styles.editButton}>Edit</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Service Type Chips */}
                <Text style={styles.label}>Service Type *</Text>
                <View style={styles.chipsContainer}>
                  {SERVICE_TYPES.map((service) => (
                    <TouchableOpacity
                      key={service}
                      style={[
                        styles.serviceChip,
                        helperService === service && styles.serviceChipActive,
                        !isEditingProfile && styles.serviceChipDisabled,
                      ]}
                      onPress={() => isEditingProfile && setHelperService(service)}
                      disabled={!isEditingProfile}
                    >
                      <Text
                        style={[
                          styles.serviceChipText,
                          helperService === service &&
                            styles.serviceChipTextActive,
                        ]}
                      >
                        {service}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Phone */}
                <Input
                  label="Phone Number *"
                  placeholder="Enter phone number"
                  value={helperPhone}
                  onChangeText={setHelperPhone}
                  keyboardType="phone-pad"
                  editable={isEditingProfile}
                  icon={<Text style={styles.inputIcon}>📱</Text>}
                />

                {/* WhatsApp */}
                <Input
                  label="WhatsApp Number"
                  placeholder="Enter WhatsApp number"
                  value={helperWhatsapp}
                  onChangeText={setHelperWhatsapp}
                  keyboardType="phone-pad"
                  editable={isEditingProfile}
                  icon={<Text style={styles.inputIcon}>💬</Text>}
                />

                {/* Address */}
                <Input
                  label="Address *"
                  placeholder="Enter your address"
                  value={helperAddress}
                  onChangeText={setHelperAddress}
                  multiline
                  numberOfLines={3}
                  editable={isEditingProfile}
                  icon={<Text style={styles.inputIcon}>📍</Text>}
                />

                {/* Availability Toggle */}
                <View style={styles.availabilityRow}>
                  <View>
                    <Text style={styles.availabilityTitle}>
                      Available for Help
                    </Text>
                    <Text style={styles.availabilitySubtitle}>
                      Toggle to show/hide from search
                    </Text>
                  </View>
                  <Switch
                    value={helperAvailable}
                    onValueChange={setHelperAvailable}
                    disabled={!isEditingProfile}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={colors.card}
                  />
                </View>

                {isEditingProfile && (
                  <View style={styles.buttonRow}>
                    <Button
                      title="Cancel"
                      onPress={() => {
                        setIsEditingProfile(false);
                        fetchHelperProfile();
                      }}
                      variant="outline"
                      size="medium"
                      style={{ flex: 1, marginRight: spacing.xs }}
                    />
                    <Button
                      title={loading ? "Saving..." : "Save"}
                      onPress={handleUpdateHelperProfile}
                      variant="primary"
                      size="medium"
                      disabled={loading}
                      style={{ flex: 1, marginLeft: spacing.xs }}
                    />
                  </View>
                )}
              </Card>

              <Button
                title="Logout"
                onPress={handleLogout}
                variant="danger"
                size="large"
                fullWidth
              />
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  // Consumer Logged In View
  if (isLoggedIn && user && user.role === "Consumer") {
    return (
      <View style={styles.container}>
        <Header
          title="Consumer Profile"
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
          <Card style={styles.profileCard} padding={spacing.lg}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarEmojiLarge}>👤</Text>
            </View>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <Text style={styles.roleTag}>Consumer Account</Text>
          </Card>

          {consumerProfileLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              <Card style={styles.formCard} padding={spacing.lg}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Contact Information</Text>
                  {!isEditingConsumerProfile && (
                    <TouchableOpacity
                      onPress={() => setIsEditingConsumerProfile(true)}
                    >
                      <Text style={styles.editButton}>Edit</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Phone */}
                <Input
                  label="Phone Number *"
                  placeholder="Enter phone number"
                  value={consumerPhone}
                  onChangeText={setConsumerPhone}
                  keyboardType="phone-pad"
                  editable={isEditingConsumerProfile}
                  icon={<Text style={styles.inputIcon}>📱</Text>}
                />

                {/* WhatsApp */}
                <Input
                  label="WhatsApp Number"
                  placeholder="Enter WhatsApp number"
                  value={consumerWhatsapp}
                  onChangeText={setConsumerWhatsapp}
                  keyboardType="phone-pad"
                  editable={isEditingConsumerProfile}
                  icon={<Text style={styles.inputIcon}>💬</Text>}
                />

                {/* Address */}
                <Input
                  label="Address *"
                  placeholder="Enter your address / location"
                  value={consumerAddress}
                  onChangeText={setConsumerAddress}
                  multiline
                  numberOfLines={3}
                  editable={isEditingConsumerProfile}
                  icon={<Text style={styles.inputIcon}>📍</Text>}
                />

                {isEditingConsumerProfile && (
                  <View style={styles.buttonRow}>
                    <Button
                      title="Cancel"
                      onPress={() => {
                        setIsEditingConsumerProfile(false);
                        fetchConsumerProfile();
                      }}
                      variant="outline"
                      size="medium"
                      style={{ flex: 1, marginRight: spacing.xs }}
                    />
                    <Button
                      title={loading ? "Saving..." : "Save"}
                      onPress={handleUpdateConsumerProfile}
                      variant="primary"
                      size="medium"
                      disabled={loading}
                      style={{ flex: 1, marginLeft: spacing.xs }}
                    />
                  </View>
                )}
              </Card>

              <Button
                title="Logout"
                onPress={handleLogout}
                variant="outline"
                size="large"
                fullWidth
              />
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  // Login/Register View
  return (
    <View style={styles.container}>
      <Header
        title="Profile"
        leftAction={{
          icon: <Text style={styles.backIcon}>←</Text>,
          onPress: () => navigation.goBack(),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "login" && styles.tabActive]}
            onPress={() => setActiveTab("login")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "login" && styles.tabTextActive,
              ]}
            >
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "register" && styles.tabActive]}
            onPress={() => setActiveTab("register")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "register" && styles.tabTextActive,
              ]}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.formCard} padding={spacing.lg}>
          {activeTab === "register" && (
            <>
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                icon={<Text style={styles.inputIcon}>👤</Text>}
              />

              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                icon={<Text style={styles.inputIcon}>✉️</Text>}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon={<Text style={styles.inputIcon}>🔒</Text>}
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                icon={<Text style={styles.inputIcon}>🔒</Text>}
              />

              {/* ROLE DROPDOWN */}
              <Input
                label="Role"
                value={role}
                editable={false}
                onPressIn={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                icon={<Text style={styles.inputIcon}>👥</Text>}
              />

              {isRoleMenuOpen && (
                <View style={styles.dropdownList}>
                  {ROLES.map((r) => (
                    <TouchableOpacity
                      key={r}
                      onPress={() => {
                        setRole(r);
                        setIsRoleMenuOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownItem}>{r}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* BLOOD GROUP DROPDOWN */}
              <Input
                label="Blood Group"
                value={bloodGroup}
                editable={false}
                onPressIn={() => setIsBloodMenuOpen(!isBloodMenuOpen)}
                icon={<Text style={styles.inputIcon}>🩸</Text>}
              />

              {isBloodMenuOpen && (
                <View style={styles.dropdownListScroll}>
                  <ScrollView>
                    {BLOOD_GROUPS.map((bg) => (
                      <TouchableOpacity
                        key={bg}
                        onPress={() => {
                          setBloodGroup(bg);
                          setIsBloodMenuOpen(false);
                        }}
                      >
                        <Text style={styles.dropdownItem}>{bg}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <Input
                label="Address"
                placeholder="Enter your address"
                value={address}
                onChangeText={setAddress}
                icon={<Text style={styles.inputIcon}>📍</Text>}
              />
            </>
          )}

          {activeTab === "login" && (
            <>
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                icon={<Text style={styles.inputIcon}>✉️</Text>}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon={<Text style={styles.inputIcon}>🔒</Text>}
              />
            </>
          )}

          <Button
            title={
              loading
                ? "Please wait..."
                : activeTab === "login"
                ? "Login"
                : "Register"
            }
            onPress={activeTab === "login" ? handleLogin : handleRegister}
            variant="primary"
            size="large"
            fullWidth
            disabled={loading}
          />

          {loading && (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ marginTop: spacing.base }}
            />
          )}
        </Card>
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
  tabs: {
    flexDirection: "row",
    marginBottom: spacing.base,
    backgroundColor: colors.card,
    borderRadius: borderRadius.base,
    padding: spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderRadius: borderRadius.sm,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.textWhite,
  },
  formCard: {
    marginBottom: spacing.base,
  },
  inputIcon: {
    fontSize: 16,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  serviceChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.backgroundDark,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  serviceChipDisabled: {
    opacity: 0.6,
  },
  serviceChipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  serviceChipTextActive: {
    color: colors.textWhite,
  },
  dropdownList: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  dropdownListScroll: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
    maxHeight: 150,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  dropdownItem: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  profileCard: {
    alignItems: "center",
    marginBottom: spacing.base,
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.backgroundDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.base,
  },
  avatarEmojiLarge: {
    fontSize: 48,
  },
  profileName: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  roleTag: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginTop: spacing.xs,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.base,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
  },
  editButton: {
    fontSize: typography.fontSize.base,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  availabilityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.base,
    paddingTop: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  availabilityTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  availabilitySubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: spacing.base,
  },
});

export default ProfileScreen;