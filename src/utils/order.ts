import { Order, OrderStatus } from '../types';
import { COLORS } from '../theme';

/**
 * ไม่มี backend จริง จึงจำลองสถานะจากเวลาที่ผ่านไปตั้งแต่กดสั่ง
 * ของจริงค่านี้ต้องมาจากเซิร์ฟเวอร์
 */
const PREPARING_MS = 30_000;
const DELIVERING_MS = 90_000;

export const ORDER_STEPS: OrderStatus[] = [
  'preparing',
  'delivering',
  'completed',
];

export const statusOf = (order: Order, now = Date.now()): OrderStatus => {
  const elapsed = now - order.createdAt;
  if (elapsed < PREPARING_MS) {
    return 'preparing';
  }
  if (elapsed < DELIVERING_MS) {
    return 'delivering';
  }
  return 'completed';
};

interface StatusMeta {
  label: string;
  detail: string;
  icon: string;
  color: string;
}

export const STATUS_META: Record<OrderStatus, StatusMeta> = {
  preparing: {
    label: 'กำลังเตรียมอาหาร',
    detail: 'ร้านได้รับออร์เดอร์แล้ว กำลังปรุงให้คุณ',
    icon: '👨‍🍳',
    color: COLORS.primary,
  },
  delivering: {
    label: 'กำลังจัดส่ง',
    detail: 'ไรเดอร์รับอาหารแล้ว กำลังไปหาคุณ',
    icon: '🛵',
    color: COLORS.primaryDark,
  },
  completed: {
    label: 'จัดส่งสำเร็จ',
    detail: 'ส่งถึงเรียบร้อย ขอบคุณที่ใช้บริการ',
    icon: '✅',
    color: COLORS.success,
  },
};

/** ออร์เดอร์ที่ยังไม่จบ ใช้ทำ badge บนแถบเมนู */
export const countActiveOrders = (orders: Order[], now = Date.now()) =>
  orders.filter(o => statusOf(o, now) !== 'completed').length;

/** เวลาแบบ 24 ชม. เช่น 14:05 */
export const formatTime = (epochMs: number) =>
  new Date(epochMs).toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  });

/** สรุปรายการอาหารเป็นบรรทัดเดียว เช่น "ผัดไทย x2, ชาไทย x1" */
export const summarizeItems = (order: Order) =>
  order.items.map(i => `${i.food.name} x${i.qty}`).join(', ');
