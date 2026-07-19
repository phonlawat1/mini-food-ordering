import { create } from 'zustand';
import { Coupon } from '../types';

interface CouponState {
  applied: Coupon | null;
  apply: (coupon: Coupon) => void;
  clear: () => void;
}

export const useCouponStore = create<CouponState>(set => ({
  applied: null,
  apply: coupon => set({ applied: coupon }),
  clear: () => set({ applied: null }),
}));
