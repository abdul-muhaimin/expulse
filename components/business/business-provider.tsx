"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { doc, getDoc } from "firebase/firestore";

import { useAuth } from "@/components/auth/auth-provider";
import { db } from "@/lib/firebase/client";

type BusinessStatus = "pending" | "active" | "suspended";

type Business = {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  location: string;
  status: BusinessStatus;
};

type BusinessContextValue = {
  business: Business | null;
  loading: boolean;
  hasBusiness: boolean;
  refreshBusiness: () => Promise<void>;
};

const BusinessContext = createContext<BusinessContextValue | undefined>(
  undefined,
);

export function BusinessProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();

  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  const loadBusiness = useCallback(async () => {
    // Wait until Firebase Auth knows who the user is.
    if (authLoading) {
      return;
    }

    // Logged-out users cannot have an Expulse business.
    if (!user) {
      setBusiness(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Load the Expulse user profile.
      const userSnapshot = await getDoc(doc(db, "users", user.uid));

      if (!userSnapshot.exists()) {
        setBusiness(null);
        return;
      }

      const userData = userSnapshot.data();
      const businessId = userData.businessId as string | undefined;

      // No business means onboarding has not been completed.
      if (!businessId) {
        setBusiness(null);
        return;
      }

      // Load the user's business.
      const businessSnapshot = await getDoc(doc(db, "businesses", businessId));

      if (!businessSnapshot.exists()) {
        setBusiness(null);
        return;
      }

      const data = businessSnapshot.data();

      setBusiness({
        id: businessSnapshot.id,
        ownerId: data.ownerId,
        name: data.name,
        category: data.category,
        location: data.location,
        status: data.status,
      });
    } catch (error) {
      console.error("Failed to load business:", error);
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    // Avoid calling setState synchronously inside the effect body
    // by deferring the work to the next macrotask.
    if (authLoading) return;

    const id = setTimeout(() => {
      void loadBusiness();
    }, 0);

    return () => clearTimeout(id);
  }, [loadBusiness, authLoading]);

  return (
    <BusinessContext.Provider
      value={{
        business,
        loading,
        hasBusiness: business !== null,
        refreshBusiness: loadBusiness,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);

  if (!context) {
    throw new Error("useBusiness must be used inside BusinessProvider");
  }

  return context;
}
