import { create } from 'zustand';
import { Order } from '../types';

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  clear: () => void;
}

export const useOrderStore = create<OrderState>(set => ({
  orders: [],

  // ออร์เดอร์ใหม่อยู่บนสุดเสมอ
  addOrder: order => set(state => ({ orders: [order, ...state.orders] })),

  clear: () => set({ orders: [] }),
}));
