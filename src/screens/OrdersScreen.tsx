import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Order, RootStackParamList } from '../types';
import { useOrderStore } from '../store/useOrderStore';
import {
  ORDER_STEPS,
  STATUS_META,
  formatTime,
  statusOf,
  summarizeItems,
} from '../utils/order';
import FloatingNav from '../components/FloatingNav';
import { COLORS, baht } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Orders'>;

const orderKeyExtractor = (o: Order) => o.id;

const OrdersScreen: React.FC<Props> = ({ navigation }) => {
  const orders = useOrderStore(s => s.orders);
  const insets = useSafeAreaInsets();

  // สถานะคำนวณจากเวลา จึงต้องเดินนาฬิกาเองให้ UI ขยับตาม
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>🧾</Text>
          <Text style={styles.emptyText}>ยังไม่มีออร์เดอร์</Text>
          <Text style={styles.emptyHint}>
            เมื่อสั่งอาหารแล้ว สถานะจะมาแสดงที่นี่
          </Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.emptyBtnText}>ไปเลือกเมนูอาหาร</Text>
          </TouchableOpacity>
        </View>
        <FloatingNav active="Orders" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={orderKeyExtractor}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: 110 + insets.bottom },
        ]}
        renderItem={({ item }) => <OrderCard order={item} now={now} />}
      />
      <FloatingNav active="Orders" />
    </View>
  );
};

const OrderCard: React.FC<{ order: Order; now: number }> = ({ order, now }) => {
  const status = statusOf(order, now);
  const meta = STATUS_META[status];
  const currentStep = ORDER_STEPS.indexOf(status);

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.flex}>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.orderTime}>สั่งเมื่อ {formatTime(order.createdAt)}</Text>
        </View>
        <View style={[styles.statusChip, { backgroundColor: meta.color }]}>
          <Text style={styles.statusChipText}>
            {meta.icon} {meta.label}
          </Text>
        </View>
      </View>

      {/* แถบความคืบหน้า 3 ขั้น */}
      <View style={styles.steps}>
        {ORDER_STEPS.map((step, i) => (
          <View key={step} style={styles.stepCol}>
            <View style={styles.stepRow}>
              <View
                style={[
                  styles.line,
                  styles.lineLeft,
                  i === 0 && styles.lineHidden,
                  i <= currentStep && styles.lineDone,
                ]}
              />
              <View
                style={[styles.dot, i <= currentStep && styles.dotDone]}
              />
              <View
                style={[
                  styles.line,
                  styles.lineRight,
                  i === ORDER_STEPS.length - 1 && styles.lineHidden,
                  i < currentStep && styles.lineDone,
                ]}
              />
            </View>
            <Text
              style={[styles.stepText, i <= currentStep && styles.stepTextDone]}
              numberOfLines={1}>
              {STATUS_META[step].label.replace('กำลัง', '')}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.detail}>{meta.detail}</Text>

      <View style={styles.divider} />

      <Text style={styles.itemsLabel}>รายการ</Text>
      <Text style={styles.items}>{summarizeItems(order)}</Text>

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>ค่าอาหาร</Text>
        <Text style={styles.priceValue}>{baht(order.subtotal)}</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>ค่าจัดส่ง</Text>
        <Text style={styles.priceValue}>{baht(order.deliveryFee)}</Text>
      </View>
      {order.discount > 0 && (
        <View style={styles.priceRow}>
          <Text style={styles.discountLabel}>
            ส่วนลด{order.couponCode ? ` (${order.couponCode})` : ''}
          </Text>
          <Text style={styles.discountValue}>-{baht(order.discount)}</Text>
        </View>
      )}
      <View style={styles.priceRow}>
        <Text style={styles.totalLabel}>ยอดสุทธิ</Text>
        <Text style={styles.totalValue}>{baht(order.total)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  flex: { flex: 1 },
  list: { padding: 12 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  orderId: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  orderTime: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  statusChip: {
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 8,
  },
  statusChipText: { color: COLORS.white, fontSize: 11, fontWeight: '800' },

  steps: { flexDirection: 'row', marginTop: 18 },
  stepCol: { flex: 1, alignItems: 'center' },
  stepRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.border,
  },
  dotDone: { backgroundColor: COLORS.primary },
  line: { flex: 1, height: 3, backgroundColor: COLORS.border },
  lineLeft: { marginRight: -1 },
  lineRight: { marginLeft: -1 },
  lineHidden: { backgroundColor: 'transparent' },
  lineDone: { backgroundColor: COLORS.primary },
  stepText: { fontSize: 10, color: COLORS.textMuted, marginTop: 6 },
  stepTextDone: { color: COLORS.text, fontWeight: '700' },

  detail: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 14,
    textAlign: 'center',
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 14 },
  itemsLabel: { fontSize: 12, color: COLORS.textMuted },
  items: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 2,
    marginBottom: 10,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  priceLabel: { fontSize: 13, color: COLORS.textMuted },
  priceValue: { fontSize: 13, color: COLORS.text, fontWeight: '600' },
  discountLabel: { fontSize: 13, color: COLORS.success, fontWeight: '600' },
  discountValue: { fontSize: 13, color: COLORS.success, fontWeight: '800' },
  totalLabel: { fontSize: 15, fontWeight: '800', color: COLORS.text },
  totalValue: { fontSize: 16, fontWeight: '800', color: COLORS.primary },

  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyIcon: { fontSize: 56 },
  emptyText: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 12,
  },
  emptyHint: { fontSize: 13, color: COLORS.textMuted, marginTop: 6 },
  emptyBtn: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyBtnText: { color: COLORS.white, fontWeight: '700' },
});

export default OrdersScreen;
