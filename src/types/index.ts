import { ImageSourcePropType } from 'react-native';

export type CategoryId = 'all' | 'savory' | 'dessert' | 'drink';

export interface Category {
  id: CategoryId;
  label: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  /** รูปถูก bundle ไว้ในแอป (require) ไม่ได้โหลดผ่านเน็ต */
  image: ImageSourcePropType;
  category: Exclude<CategoryId, 'all'>;
}

export interface CartItem {
  food: FoodItem;
  qty: number;
}

/** percent = ลด % / fixed = ลดเป็นบาท / freeDelivery = ส่งฟรี */
export type CouponType = 'percent' | 'fixed' | 'freeDelivery';

export interface Coupon {
  code: string;
  title: string;
  description: string;
  type: CouponType;
  /** percent → 0-100, fixed → จำนวนบาท, freeDelivery → ไม่ใช้ */
  value: number;
  /** ยอดอาหารขั้นต่ำที่ใช้โค้ดนี้ได้ */
  minSpend: number;
  /** เพดานส่วนลด (ใช้กับ percent เท่านั้น) */
  maxDiscount?: number;
  /** YYYY-MM-DD */
  expiresAt: string;
  /** ไม่ระบุ = โค้ดสาธารณะใครก็ใช้ได้, ระบุ = เฉพาะ user ในลิสต์ */
  eligibleUsers?: string[];
}

/** preparing = ร้านกำลังเตรียม / delivering = ไรเดอร์กำลังส่ง / completed = ส่งถึงแล้ว */
export type OrderStatus = 'preparing' | 'delivering' | 'completed';

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  /** โค้ดส่วนลดที่ใช้ตอนสั่ง (null = ไม่ได้ใช้) */
  couponCode: string | null;
  total: number;
  /** epoch ms ใช้คำนวณสถานะตามเวลาที่ผ่านไป */
  createdAt: number;
}

export type RootStackParamList = {
  Login: { redirectTo?: 'Cart' } | undefined;
  Home: undefined;
  Detail: { foodId: string };
  Cart: undefined;
  Orders: undefined;
  Success: { orderId: string };
};
