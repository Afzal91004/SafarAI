import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Share,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { router } from "expo-router";
import { auth, db } from "../../config/FirebaseConfig";
import {
  signOut,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import GoBack from "../../components/GoBack";
import {
  User,
  Mail,
  Edit3,
  LogOut,
  Share2,
  MessageSquarePlus,
  Shield,
  FileText,
  Trash2,
  Save,
  X,
  Lock,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";

const { width, height } = Dimensions.get("window");

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    bio: "",
  });
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [password, setPassword] = useState("");
  const [reauthError, setReauthError] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      fetchUserProfile(currentUser.uid);
    }
  }, []);

  const reauthenticateUser = async (password) => {
    try {
      const currentUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        password
      );
      await reauthenticateWithCredential(currentUser, credential);
      return true;
    } catch (error) {
      console.error("Reauthentication error:", error);
      setReauthError(
        error.code === "auth/wrong-password"
          ? "Incorrect password"
          : "Authentication failed"
      );
      return false;
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfileData({
          name: data.name || "",
          phone: data.phone || "",
          bio: data.bio || "",
          ...data,
        });
      } else {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const basicProfile = {
            name: "",
            email: currentUser.email,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await setDoc(doc(db, "users", userId), basicProfile);
          setProfileData(basicProfile);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      ToastAndroid.show("Error loading profile", ToastAndroid.BOTTOM);
    }
  };

  const handleUpdateProfile = async () => {
    if (!profileData.name) {
      ToastAndroid.show("Name is required", ToastAndroid.BOTTOM);
      return;
    }

    setLoading(true);
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          ...profileData,
          email: user.email,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      ToastAndroid.show("Profile updated successfully", ToastAndroid.BOTTOM);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      ToastAndroid.show("Error updating profile", ToastAndroid.BOTTOM);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setShowReauthModal(true);
            setIsDeletingAccount(true);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const proceedWithDeletion = async () => {
    if (!password) {
      setReauthError("Password is required");
      return;
    }

    try {
      setLoading(true);
      const isReauthenticated = await reauthenticateUser(password);

      if (isReauthenticated) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // First delete user data from Firestore
          await deleteDoc(doc(db, "users", currentUser.uid));

          // Then delete the user account
          await deleteUser(currentUser);

          // Clear states
          setShowReauthModal(false);
          setPassword("");
          setReauthError("");
          setIsDeletingAccount(false);

          // Show success message
          ToastAndroid.show(
            "Account deleted successfully",
            ToastAndroid.BOTTOM
          );

          // Navigate to sign-in screen
          router.replace("/auth/sign-in/Index");
        }
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setReauthError(
        error.code === "auth/requires-recent-login"
          ? "Please sign in again and retry"
          : "Error deleting account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Add the re-authentication modal component
  const ReauthenticationModal = () => (
    <Modal
      visible={showReauthModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        setShowReauthModal(false);
        setPassword("");
        setReauthError("");
        setIsDeletingAccount(false);
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm Your Password</Text>
          <Text style={styles.modalSubtitle}>
            Please enter your password to delete your account
          </Text>

          <View style={styles.inputWrapper}>
            <Lock size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setReauthError("");
              }}
              placeholder="Enter your password"
              secureTextEntry
              placeholderTextColor="#999"
              editable={!loading}
            />
          </View>

          {reauthError ? (
            <Text style={styles.errorText}>{reauthError}</Text>
          ) : null}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setShowReauthModal(false);
                setPassword("");
                setReauthError("");
                setIsDeletingAccount(false);
              }}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.deleteButton,
                loading && styles.disabledButton,
              ]}
              onPress={proceedWithDeletion}
              disabled={!password || loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Deleting..." : "Delete Account"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const handleFeatureRequest = () => {
    const email = "shaikhmohammedafjal@gmail.com";
    const subject = "Feature Request";
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    Linking.canOpenURL(mailtoUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(mailtoUrl);
        }
        ToastAndroid.show("Email app not found", ToastAndroid.BOTTOM);
      })
      .catch((err) => console.error("Error opening email:", err));
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: "Check out this awesome app!", // Replace with your app's sharing message
        // You can add your app's Play Store/App Store link here
      });
    } catch (error) {
      console.error("Error sharing app:", error);
    }
  };

  const openPrivacyPolicy = () => {
    // Replace with your actual privacy policy URL
    Linking.openURL("https://yourapp.com/privacy-policy").catch((err) =>
      console.error("Error opening privacy policy:", err)
    );
  };

  const openTermsConditions = () => {
    // Replace with your actual terms and conditions URL
    Linking.openURL("https://yourapp.com/terms-conditions").catch((err) =>
      console.error("Error opening terms:", err)
    );
  };

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Sign Out",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace("/auth/sign-in/Index");
            } catch (error) {
              console.error("Error signing out:", error);
              ToastAndroid.show("Error signing out", ToastAndroid.BOTTOM);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
      >
        {/* Header */}
        <View style={styles.subContainer1}>
          <View style={styles.header1}>
            <GoBack color="white" />
            <Text style={styles.searchText1}>Account</Text>
          </View>
          <View style={styles.hr} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Card */}
          <Animatable.View
            animation="fadeIn"
            delay={400}
            style={styles.profileCard}
          >
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {profileData.name ? profileData.name[0].toUpperCase() : "U"}
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <User size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profileData.name}
                  onChangeText={(text) =>
                    setProfileData({ ...profileData, name: text })
                  }
                  placeholder="Enter your name"
                  editable={isEditing}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Mail size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={user.email}
                  editable={false}
                  placeholderTextColor="#999"
                />
              </View>

              {/* Action Buttons */}
              {isEditing ? (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setIsEditing(false)}
                  >
                    <X size={20} color="#fff" />
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleUpdateProfile}
                    disabled={loading}
                  >
                    <Save size={20} color="#fff" />
                    <Text style={styles.buttonText}>
                      {loading ? "Saving..." : "Save"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.editButton]}
                    onPress={() => setIsEditing(true)}
                  >
                    <Edit3 size={20} color="#fff" />
                    <Text style={styles.buttonText}>Edit Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.signOutButton]}
                    onPress={handleSignOut}
                  >
                    <LogOut size={20} color="#fff" />
                    <Text style={styles.buttonText}>Sign Out</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Animatable.View>

          {/* Settings Options */}
          <View style={styles.settingsContainer}>
            <TouchableOpacity
              style={styles.settingButton}
              onPress={handleShareApp}
            >
              <Share2 size={24} color="#4CAF50" />
              <Text style={styles.settingText}>Share App</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingButton}
              onPress={handleFeatureRequest}
            >
              <MessageSquarePlus size={24} color="#2196F3" />
              <Text style={styles.settingText}>Request Feature</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingButton}
              onPress={openPrivacyPolicy}
            >
              <Shield size={24} color="#9C27B0" />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingButton}
              onPress={openTermsConditions}
            >
              <FileText size={24} color="#FF9800" />
              <Text style={styles.settingText}>Terms & Conditions</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingButton}
              onPress={handleDeleteAccount}
            >
              <Trash2 size={24} color="#f44336" />
              <Text style={[styles.settingText, styles.deleteText]}>
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container1: {
    backgroundColor: Colors.light.background,
    height: "100%",
    flex: 1,
    paddingBottom: 60,
  },
  subContainer1: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
    backgroundColor: Colors.PRIMARY,
    marginTop: -40,
  },
  header1: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  searchText1: {
    paddingTop: 28,
    fontSize: 20,
    fontFamily: "QuickSand-Medium",
    marginLeft: "18%",
    color: "white",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    backgroundColor: "#5c6bc0",
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    color: "#fff",
    fontFamily: "QuickSand-Bold",
    marginLeft: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 32,
    color: "#fff",
    fontFamily: "QuickSand-Bold",
  },
  formContainer: {
    gap: 15,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "QuickSand-Medium",
    color: "#333",
  },
  inputDisabled: {
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  editButton: {
    backgroundColor: Colors.PRIMARY,
  },
  signOutButton: {
    backgroundColor: "#f44336",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#9e9e9e",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "QuickSand-Bold",
  },
  settingsContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  settingButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
    marginVertical: 5,
  },
  settingText: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: "QuickSand-SemiBold",
    color: "#333",
  },
  deleteText: {
    color: "#f44336",
  },
  loadingText: {
    fontSize: 18,
    fontFamily: "QuickSand-Medium",
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "QuickSand-Bold",
    color: "#333",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: "QuickSand-Medium",
    color: "#666",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 20,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    flex: 0,
    paddingHorizontal: 20,
  },
  errorText: {
    color: "#f44336",
    fontSize: 14,
    fontFamily: "QuickSand-Medium",
    marginTop: 8,
  },
});
