import { Coupon } from '../types';

/**
 * คลังโค้ดส่วนลดทั้งหมด
 * - ไม่มี eligibleUsers = โค้ดสาธารณะ ใครพิมพ์ก็ใช้ได้
 * - มี eligibleUsers   = สิทธิเฉพาะบุคคล จะโชว์ในลิสต์ "สิทธิของคุณ" ของ user นั้น
 */
export const COUPONS: Coupon[] = [
  {
    code: 'WELCOME50',
    title: 'ลดทันที ฿50',
    description: 'สำหรับลูกค้าใหม่ เมื่อสั่งครบ ฿200',
    type: 'fixed',
    value: 50,
    minSpend: 200,
    expiresAt: '2026-12-31',
  },
  {
    code: 'SAVE10',
    title: 'ลด 10%',
    description: 'ลดสูงสุด ฿80 เมื่อสั่งครบ ฿150',
    type: 'percent',
    value: 10,
    minSpend: 150,
    maxDiscount: 80,
    expiresAt: '2026-12-31',
  },
  {
    code: 'FREEDEL',
    title: 'ส่งฟรี',
    description: 'ฟรีค่าจัดส่ง เมื่อสั่งครบ ฿100',
    type: 'freeDelivery',
    value: 0,
    minSpend: 100,
    expiresAt: '2026-12-31',
  },
  {
    code: 'VIP20',
    title: 'ลด 20% สำหรับสมาชิก VIP',
    description: 'ลดสูงสุด ฿150 เมื่อสั่งครบ ฿300',
    type: 'percent',
    value: 20,
    minSpend: 300,
    maxDiscount: 150,
    expiresAt: '2026-12-31',
    eligibleUsers: ['augodz', 'admin'],
  },
  {
    code: 'BIRTHDAY100',
    title: 'ของขวัญวันเกิด ฿100',
    description: 'สิทธิพิเศษเฉพาะคุณ เมื่อสั่งครบ ฿250',
    type: 'fixed',
    value: 100,
    minSpend: 250,
    expiresAt: '2026-12-31',
    eligibleUsers: ['augodz'],
  },
  {
    code: 'NEWYEAR25',
    title: 'ลด 25% เทศกาลปีใหม่',
    description: 'โค้ดหมดอายุแล้ว (ไว้ทดสอบเคสโค้ดหมดอายุ)',
    type: 'percent',
    value: 25,
    minSpend: 100,
    maxDiscount: 200,
    expiresAt: '2025-12-31',
  },
];

export const findCoupon = (code: string) =>
  COUPONS.find(c => c.code === code.trim().toUpperCase());

/** โค้ดที่ user คนนี้มีสิทธิใช้ (สาธารณะ + เฉพาะตัว) และยังไม่หมดอายุ */
export const getCouponsForUser = (username: string | null, now = new Date()) =>
  COUPONS.filter(c => {
    if (new Date(c.expiresAt) < now) {
      return false;
    }
    if (!c.eligibleUsers) {
      return true;
    }
    return username !== null && c.eligibleUsers.includes(username);
  });
