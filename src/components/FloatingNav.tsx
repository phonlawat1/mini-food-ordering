import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types';
import { selectTotalCount, useCartStore } from '../store/useCartStore';
import { useOrderStore } from '../store/useOrderStore';
import { useAuthStore } from '../store/useAuthStore';
import { countActiveOrders } from '../utils/order';
import CartIcon from './CartIcon';
import HomeIcon from './icons/HomeIcon';
import OrdersIcon from './icons/OrdersIcon';
import { COLORS } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type TabKey = 'Home' | 'Cart' | 'Orders';

interface Props {
  /** แท็บที่กำลังเปิดอยู่ ใช้ไฮไลต์ */
  active: TabKey;
}

/**
 * แถบเมนูลอยด้านล่าง — หน้าหลัก / ตะกร้า / สถานะออร์เดอร์
 * ตะกร้าและออร์เดอร์กดได้เฉพาะตอน Login แล้ว ถ้ายังไม่ Login จะพาไปหน้า Login ก่อน
 */
const FloatingNav: React.FC<Props> = ({ active }) => {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const cartCount = useCartStore(selectTotalCount);
  const orders = useOrderStore(s => s.orders);
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);

  const activeOrders = countActiveOrders(orders);

  const goHome = useCallback(() => {
    if (active !== 'Home') {
      navigation.navigate('Home');
    }
  }, [active, navigation]);

  const goCart = useCallback(() => {
    if (active === 'Cart') {
      return;
    }
    if (isLoggedIn) {
      navigation.navigate('Cart');
    } else {
      navigation.navigate('Login', { redirectTo: 'Cart' });
    }
  }, [active, isLoggedIn, navigation]);

  const goOrders = useCallback(() => {
    if (active !== 'Orders') {
      navigation.navigate('Orders');
    }
  }, [active, navigation]);

  return (
    <View style={[styles.wrapper, { bottom: 18 + insets.bottom }]}>
      <View style={styles.bar}>
        <NavItem
          label="หน้าหลัก"
          active={active === 'Home'}
          onPress={goHome}
          testID="nav-home"
          renderIcon={color => <HomeIcon size={22} color={color} />}
        />
        <NavItem
          label="ตะกร้า"
          active={active === 'Cart'}
          onPress={goCart}
          badge={cartCount}
          testID="nav-cart"
          renderIcon={color => <CartIcon size={22} color={color} />}
        />
        <NavItem
          label="ออร์เดอร์"
          active={active === 'Orders'}
          onPress={goOrders}
          badge={activeOrders}
          testID="nav-orders"
          renderIcon={color => <OrdersIcon size={22} color={color} />}
        />
      </View>
    </View>
  );
};

interface ItemProps {
  label: string;
  active: boolean;
  onPress: () => void;
  renderIcon: (color: string) => React.ReactNode;
  badge?: number;
  testID?: string;
}

const NavItem: React.FC<ItemProps> = ({
  label,
  active,
  onPress,
  renderIcon,
  badge = 0,
  testID,
}) => {
  const color = active ? COLORS.primary : COLORS.textMuted;

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID}>
      <View>
        {renderIcon(color)}
        {badge > 0 && (
          <Text style={styles.badge} testID={`${testID}-badge`}>
            {badge > 99 ? '99+' : badge}
          </Text>
        )}
      </View>
      <Text style={[styles.label, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 26,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 4,
    minWidth: 84,
  },
  label: { fontSize: 11, fontWeight: '700', marginTop: 4 },
  badge: {
    position: 'absolute',
    top: -7,
    right: -12,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.danger,
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
});

export default React.memo(FloatingNav);
