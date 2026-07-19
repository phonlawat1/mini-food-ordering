import { create } from 'zustand';
import { CartItem, FoodItem } from '../types';

export const DELIVERY_FEE = 25;

interface CartState {
  items: CartItem[];
  addToCart: (food: FoodItem, qty?: number) => void;
  increase: (foodId: string) => void;
  decrease: (foodId: string) => void;
  remove: (foodId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>(set => ({
  items: [],

  addToCart: (food, qty = 1) =>
    set(state => {
      const existing = state.items.find(i => i.food.id === food.id);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.food.id === food.id ? { ...i, qty: i.qty + qty } : i,
          ),
        };
      }
      return { items: [...state.items, { food, qty }] };
    }),

  increase: foodId =>
    set(state => ({
      items: state.items.map(i =>
        i.food.id === foodId ? { ...i, qty: i.qty + 1 } : i,
      ),
    })),

  // ลดจำนวน — ถ้าเหลือ 1 แล้วกดลบ จะเอาออกจากตะกร้า
  decrease: foodId =>
    set(state => ({
      items: state.items
        .map(i => (i.food.id === foodId ? { ...i, qty: i.qty - 1 } : i))
        .filter(i => i.qty > 0),
    })),

  remove: foodId =>
    set(state => ({ items: state.items.filter(i => i.food.id !== foodId) })),

  clear: () => set({ items: [] }),
}));

// ---------- Selectors ----------

/** จำนวนชิ้นรวมทั้งหมดในตะกร้า (ใช้กับ Badge — อัปเดต real-time) */
export const selectTotalCount = (s: { items: CartItem[] }) =>
  s.items.reduce((sum, i) => sum + i.qty, 0);

/** ราคารวมของอาหาร (Subtotal) */
export const selectSubtotal = (s: { items: CartItem[] }) =>
  s.items.reduce((sum, i) => sum + i.food.price * i.qty, 0);
