import { useSession } from "next-auth/react";
import { UserRole } from "@/types/auth.types";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    session,
    user: session?.user,
    role: session?.user?.role as UserRole | undefined,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
  };
}
