import React, { useEffect, useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
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

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("login");

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [role, setRole] = useState<string>("Consumer");
  const [bloodGroup, setBloodGroup] = useState<string>("A+");
  const [address, setAddress] = useState<string>("");

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isBloodMenuOpen, setIsBloodMenuOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(
    null
  );

  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userJson = await AsyncStorage.getItem("user");
        if (token && userJson) {
          setUser(JSON.parse(userJson));
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.warn("Error restoring session:", err);
      }
    })();
  }, []);

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      console.log("🔐 Attempting login with:", email);
      
      // loginUser returns the response data directly
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

  const handleLogout = async (): Promise<void> => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    Alert.alert("Success", "Logged out successfully");
  };

  if (isLoggedIn && user) {
    return (
      <View style={styles.container}>
        <Header
          title="My Profile"
          leftAction={{
            icon: <Text style={styles.backIcon}>←</Text>,
            onPress: () => navigation.goBack(),
          }}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <Card style={styles.profileCard} padding={spacing.lg}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarEmojiLarge}>👤</Text>
            </View>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </Card>

          <Card style={styles.availabilityCard} padding={spacing.base}>
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
                value={isAvailable}
                onValueChange={setIsAvailable}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.card}
              />
            </View>
          </Card>

          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            size="large"
            fullWidth
          />
        </ScrollView>
      </View>
    );
  }

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
            title={loading ? "Please wait..." : activeTab === "login" ? "Login" : "Register"}
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
  dropdownList: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.base,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
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
  },
  profileEmail: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  availabilityCard: {
    marginBottom: spacing.base,
  },
  availabilityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
});

export default ProfileScreen;