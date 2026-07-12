import { create } from "zustand";
import { UserRole } from "@/types/auth.types";

interface AuthState {
  staffId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: UserRole | null;
  setUser: (user: { staffId: string; firstName: string; lastName: string; email: string; role: UserRole }) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  staffId: null,
  firstName: null,
  lastName: null,
  email: null,
  role: null,
  setUser: (user) => set(user),
  clearUser: () => set({ staffId: null, firstName: null, lastName: null, email: null, role: null }),
}));
