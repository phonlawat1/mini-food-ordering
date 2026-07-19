import { Coupon } from '../types';
import { findCoupon } from '../data/coupons';
import { baht } from '../theme';

export type CouponErrorCode =
  | 'NOT_FOUND'
  | 'EXPIRED'
  | 'NOT_ELIGIBLE'
  | 'MIN_SPEND';

export type ValidateResult =
  | { ok: true; coupon: Coupon }
  | { ok: false; code: CouponErrorCode; message: string };

/** ตรวจว่าโค้ดนี้ user คนนี้ใช้กับยอดนี้ได้จริงไหม */
export const validateCoupon = (
  rawCode: string,
  username: string | null,
  subtotal: number,
  now = new Date(),
): ValidateResult => {
  const coupon = findCoupon(rawCode);

  if (!coupon) {
    return {
      ok: false,
      code: 'NOT_FOUND',
      message: 'ไม่พบโค้ดนี้ในระบบ กรุณาตรวจสอบอีกครั้ง',
    };
  }

  if (new Date(coupon.expiresAt) < now) {
    return { ok: false, code: 'EXPIRED', message: 'โค้ดนี้หมดอายุแล้ว' };
  }

  if (coupon.eligibleUsers && !coupon.eligibleUsers.includes(username ?? '')) {
    return {
      ok: false,
      code: 'NOT_ELIGIBLE',
      message: 'โค้ดนี้เป็นสิทธิเฉพาะบุคคล บัญชีของคุณใช้ไม่ได้',
    };
  }

  if (subtotal < coupon.minSpend) {
    return {
      ok: false,
      code: 'MIN_SPEND',
      message: `ต้องสั่งอาหารครบ ${baht(coupon.minSpend)} ขึ้นไปจึงใช้โค้ดนี้ได้`,
    };
  }

  return { ok: true, coupon };
};

export interface DiscountBreakdown {
  /** ส่วนลดจากค่าอาหาร */
  itemDiscount: number;
  /** ส่วนลดค่าจัดส่ง */
  deliveryDiscount: number;
  /** รวมส่วนลดทั้งหมด */
  total: number;
}

const EMPTY: DiscountBreakdown = {
  itemDiscount: 0,
  deliveryDiscount: 0,
  total: 0,
};

/** คำนวณส่วนลด — ไม่ตรวจเงื่อนไขซ้ำ ให้ validateCoupon ผ่านมาก่อน */
export const calcDiscount = (
  coupon: Coupon | null,
  subtotal: number,
  deliveryFee: number,
): DiscountBreakdown => {
  if (!coupon) {
    return EMPTY;
  }

  switch (coupon.type) {
    case 'percent': {
      const raw = Math.floor((subtotal * coupon.value) / 100);
      const itemDiscount = Math.min(raw, coupon.maxDiscount ?? raw, subtotal);
      return { itemDiscount, deliveryDiscount: 0, total: itemDiscount };
    }
    case 'fixed': {
      // ไม่ให้ลดเกินค่าอาหาร ยอดสุทธิจะได้ไม่ติดลบ
      const itemDiscount = Math.min(coupon.value, subtotal);
      return { itemDiscount, deliveryDiscount: 0, total: itemDiscount };
    }
    case 'freeDelivery':
      return {
        itemDiscount: 0,
        deliveryDiscount: deliveryFee,
        total: deliveryFee,
      };
    default:
      return EMPTY;
  }
};

/** ข้อความสั้น ๆ บอกว่าต้องซื้อเพิ่มเท่าไหร่ถึงใช้โค้ดได้ (null = ใช้ได้แล้ว) */
export const shortfallText = (coupon: Coupon, subtotal: number) => {
  const diff = coupon.minSpend - subtotal;
  return diff > 0 ? `สั่งเพิ่มอีก ${baht(diff)}` : null;
};
