import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useCouponStore } from '../store/useCouponStore';
import { useOrderStore } from '../store/useOrderStore';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import SuccessScreen from '../screens/SuccessScreen';
import { COLORS } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

const LogoutButton: React.FC = () => {
  const { username, logout } = useAuthStore();
  const clearCoupon = useCouponStore(s => s.clear);
  const clearOrders = useOrderStore(s => s.clear);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (!username) {
    return null;
  }

  const handleLogout = () => {
    logout();
    clearCoupon(); // สิทธิเป็นของเฉพาะบุคคล ห้ามติดไปหา user คนถัดไป
    clearOrders(); // ประวัติออร์เดอร์ก็เป็นของเฉพาะบุคคลเช่นกัน
    // ล้าง stack ทั้งหมด กด Back จาก Login แล้วต้องไม่ย้อนกลับเข้าแอปได้
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      hitSlop={10}
      style={styles.logoutButton}
      testID="button-logout">
      <Text style={styles.logoutText}>ออกจากระบบ</Text>
    </TouchableOpacity>
  );
};

const renderLogoutButton = () => <LogoutButton />;

const RootNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitleStyle: { fontWeight: '700' },
        headerTintColor: COLORS.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: COLORS.bg },
      }}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Mini Food Ordering',
          headerBackVisible: false,
          headerRight: renderLogoutButton,
        }}
      />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: 'รายละเอียดอาหาร' }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: 'ตะกร้าสินค้า' }}
      />
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ title: 'สถานะออร์เดอร์' }}
      />
      <Stack.Screen
        name="Success"
        component={SuccessScreen}
        options={{ headerShown: false, animation: 'fade' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoutText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
});

export default RootNavigator;
