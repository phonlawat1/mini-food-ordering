import React, { useCallback, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Coupon } from '../types';
import { getCouponsForUser } from '../data/coupons';
import { useAuthStore } from '../store/useAuthStore';
import { useCouponStore } from '../store/useCouponStore';
import { shortfallText, validateCoupon } from '../utils/coupon';
import { COLORS, baht } from '../theme';

interface Props {
  subtotal: number;
}

const CouponSection: React.FC<Props> = ({ subtotal }) => {
  const username = useAuthStore(s => s.username);
  const applied = useCouponStore(s => s.applied);
  const apply = useCouponStore(s => s.apply);
  const clear = useCouponStore(s => s.clear);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const myCoupons = useMemo(() => getCouponsForUser(username), [username]);

  const handleApplyCode = useCallback(
    (rawCode: string) => {
      const result = validateCoupon(rawCode, username, subtotal);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setError(null);
      setCode('');
      apply(result.coupon);
    },
    [username, subtotal, apply],
  );

  const handleRemove = useCallback(() => {
    clear();
    setError(null);
  }, [clear]);

  const handleChangeCode = useCallback((t: string) => {
    setCode(t.toUpperCase());
    setError(null);
  }, []);

  const handleApplyInput = useCallback(
    () => handleApplyCode(code),
    [handleApplyCode, code],
  );

  // ---------- ใช้โค้ดอยู่แล้ว ----------
  if (applied) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>ส่วนลด / สิทธิพิเศษ</Text>
        <View style={styles.appliedBox}>
          <Text style={styles.appliedIcon}>🎟️</Text>
          <View style={styles.appliedInfo}>
            <Text style={styles.appliedCode}>{applied.code}</Text>
            <Text style={styles.appliedTitle}>{applied.title}</Text>
          </View>
          <TouchableOpacity
            onPress={handleRemove}
            hitSlop={8}
            testID="btn-remove-coupon">
            <Text style={styles.removeText}>ยกเลิก</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ---------- ยังไม่ได้ใช้โค้ด ----------
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>ส่วนลด / สิทธิพิเศษ</Text>

      {/* พิมพ์โค้ดเอง */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="กรอกโค้ดส่วนลด"
          placeholderTextColor={COLORS.textMuted}
          value={code}
          onChangeText={handleChangeCode}
          autoCapitalize="characters"
          autoCorrect={false}
          testID="input-coupon"
        />
        <TouchableOpacity
          style={[styles.applyBtn, !code.trim() && styles.applyBtnDisabled]}
          disabled={!code.trim()}
          onPress={handleApplyInput}
          testID="btn-apply-coupon">
          <Text style={styles.applyText}>ใช้โค้ด</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <Text style={styles.errorText} testID="text-coupon-error">
          {error}
        </Text>
      )}

      {/* เลือกจากสิทธิที่มี */}
      {myCoupons.length > 0 && (
        <>
          <Text style={styles.subHeading}>สิทธิของคุณ</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardList}>
            {myCoupons.map(c => (
              <CouponCard
                key={c.code}
                coupon={c}
                subtotal={subtotal}
                onApply={handleApplyCode}
              />
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
};

interface CardProps {
  coupon: Coupon;
  subtotal: number;
  /** รับ code กลับไป เพื่อให้ parent ส่ง callback ตัวเดิมได้ทุก render */
  onApply: (code: string) => void;
}

const CouponCard = React.memo(({ coupon, subtotal, onApply }: CardProps) => {
  const shortfall = shortfallText(coupon, subtotal);
  const locked = shortfall !== null;
  const exclusive = coupon.eligibleUsers !== undefined;
  const handlePress = useCallback(
    () => onApply(coupon.code),
    [onApply, coupon.code],
  );

  return (
    <TouchableOpacity
      style={[styles.card, locked && styles.cardLocked]}
      onPress={handlePress}
      disabled={locked}
      testID={`coupon-${coupon.code}`}>
      <View style={styles.cardTop}>
        <Text style={styles.cardCode}>{coupon.code}</Text>
        {exclusive && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>สิทธิพิเศษ</Text>
          </View>
        )}
      </View>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {coupon.title}
      </Text>
      <Text style={styles.cardDesc} numberOfLines={2}>
        {coupon.description}
      </Text>
      <Text style={[styles.cardFoot, locked && styles.cardFootLocked]}>
        {locked ? shortfall : `ขั้นต่ำ ${baht(coupon.minSpend)} • แตะเพื่อใช้`}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: { marginTop: 4, marginBottom: 8 },
  heading: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 10,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  applyBtn: {
    marginLeft: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  applyBtnDisabled: { backgroundColor: COLORS.textMuted, opacity: 0.5 },
  applyText: { color: COLORS.white, fontWeight: '800', fontSize: 14 },
  errorText: { color: COLORS.danger, fontSize: 13, marginTop: 8 },
  subHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 16,
    marginBottom: 8,
  },
  cardList: { paddingRight: 12, paddingBottom: 4 },
  card: {
    width: 200,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    padding: 12,
    marginRight: 10,
  },
  cardLocked: { opacity: 0.55, borderLeftColor: COLORS.textMuted },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardCode: { fontSize: 14, fontWeight: '800', color: COLORS.primary },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: { color: COLORS.white, fontSize: 9, fontWeight: '800' },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 6,
  },
  cardDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
    lineHeight: 15,
  },
  cardFoot: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
    marginTop: 8,
  },
  cardFootLocked: { color: COLORS.textMuted },
  appliedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.success,
    padding: 12,
  },
  appliedIcon: { fontSize: 22 },
  appliedInfo: { flex: 1, marginLeft: 10 },
  appliedCode: { fontSize: 14, fontWeight: '800', color: COLORS.success },
  appliedTitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  removeText: { fontSize: 13, fontWeight: '700', color: COLORS.danger },
});

export default React.memo(CouponSection);
