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

/**
 * ProfileScreen
 * Connected login/register that stores JWT & user in AsyncStorage
 */
const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(
    null
  );

  // On mount -> attempt to restore session from AsyncStorage
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

  // --------------------------
  // 🔐 LOGIN (Real Backend)
  // --------------------------
  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      const { token, user: resUser } = res.data;

      // Persist token and user
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(resUser));

      setUser(resUser);
      setIsLoggedIn(true);
      setEmail("");
      setPassword("");

      Alert.alert("Success", "Logged in successfully");
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message || "Login failed";
      Alert.alert("Login failed", msg);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // 📝 REGISTER (Real Backend)
  // --------------------------
  const handleRegister = async (): Promise<void> => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ name, email, password });

      // After registration, switch to login tab and prefill email
      Alert.alert("Success", "Registration successful — please login");
      setActiveTab("login");
      setPassword("");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || error.message || "Registration failed";
      Alert.alert("Registration failed", msg);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // 🚪 LOGOUT
  // --------------------------
  const handleLogout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
    } catch (err) {
      console.warn("Error clearing storage:", err);
    }
    setIsLoggedIn(false);
    setUser(null);
    setEmail("");
    setPassword("");
    setName("");
  };

  // ===========================
  // UI: Logged-in profile view
  // ===========================
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
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <Card style={styles.profileCard} padding={spacing.lg}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarEmojiLarge}>👤</Text>
            </View>
            <Text style={styles.profileName}>{user.name ?? "Unknown"}</Text>
            <Text style={styles.profileEmail}>{user.email ?? "—"}</Text>
          </Card>

          {/* Stats Card (static for now) */}
          <Card style={styles.statsCard} padding={spacing.base}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>4.8</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>24</Text>
                <Text style={styles.statLabel}>Requests</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>৳12k</Text>
                <Text style={styles.statLabel}>Earnings</Text>
              </View>
            </View>
          </Card>

          {/* Availability Toggle */}
          <Card style={styles.availabilityCard} padding={spacing.base}>
            <View style={styles.availabilityRow}>
              <View>
                <Text style={styles.availabilityTitle}>Available for Help</Text>
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
            title="Edit Profile"
            onPress={() => console.log("Edit profile")}
            variant="primary"
            size="large"
            fullWidth
            style={styles.actionButton}
          />

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

  // ===========================
  // UI: Login / Register Form
  // ===========================
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
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "login" && styles.tabActive]}
            onPress={() => setActiveTab("login")}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === "login" && styles.tabTextActive]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "register" && styles.tabActive]}
            onPress={() => setActiveTab("register")}
            activeOpacity={0.7}
          >
            <Text
              style={[styles.tabText, activeTab === "register" && styles.tabTextActive]}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Card */}
        <Card style={styles.formCard} padding={spacing.lg}>
          {activeTab === "register" && (
            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              icon={<Text style={styles.inputIcon}>👤</Text>}
            />
          )}

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

          <Button
            title={activeTab === "login" ? "Login" : "Register"}
            onPress={activeTab === "login" ? handleLogin : handleRegister}
            variant="primary"
            size="large"
            fullWidth
          />

          {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
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
    fontWeight: typography.fontWeight.medium,
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
  },
  statsCard: {
    marginBottom: spacing.base,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
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
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  availabilitySubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  actionButton: {
    marginBottom: spacing.base,
  },
});

export default ProfileScreen;
