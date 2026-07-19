import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { useAuthStore } from "../store/useAuthStore";
import { COLORS } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation, route }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);
  const redirectTo = route.params?.redirectTo;

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("กรอกข้อมูลไม่ครบ", "กรุณากรอก Username และ Password");
      return;
    }
    login(username.trim());

    if (redirectTo === "Cart") {
      // มาจากปุ่มตะกร้า → เข้าสู่ระบบเสร็จพาไป Cart (กด Back จะกลับ Home)
      navigation.reset({
        index: 1,
        routes: [{ name: "Home" }, { name: "Cart" }],
      });
    } else {
      // เข้าสู่ระบบสำเร็จ → พาไปหน้า Home
      navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.logo}>🍜</Text>
        <Text style={styles.title}>Mini Food Ordering</Text>
        <Text style={styles.subtitle}>เข้าสู่ระบบเพื่อเริ่มสั่งอาหาร</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor={COLORS.textMuted}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          testID="input-username"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          testID="input-password"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          testID="btn-login"
        >
          <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logo: { fontSize: 48, textAlign: "center" },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.bg,
  },
  button: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: { color: COLORS.white, fontSize: 16, fontWeight: "700" },
});

export default LoginScreen;
