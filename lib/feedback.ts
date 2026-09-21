import { useCallback, useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  type Timestamp,
  where,
} from "firebase/firestore";

import { useBusiness } from "@/components/business/business-provider";
import { db } from "@/lib/firebase/client";

export type FeedbackDoc = {
  id: string;
  businessId: string;
  rating: number;    // 1–5
  recommend: boolean;
  comment?: string;  // optional — customers may leave no comment
  createdAt: Timestamp;
};

type UseBusinessFeedbackResult = {
  feedback: FeedbackDoc[];
  loading: boolean;
  error: string | null;
};

export function useBusinessFeedback(): UseBusinessFeedbackResult {
  const { business, loading: businessLoading } = useBusiness();

  const [feedback, setFeedback] = useState<FeedbackDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeedback = useCallback(async () => {
    if (businessLoading) return;

    if (!business) {
      setFeedback([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Requires a composite index: businessId ASC, createdAt DESC
      const q = query(
        collection(db, "feedback"),
        where("businessId", "==", business.id),
        orderBy("createdAt", "desc"),
      );

      const snapshot = await getDocs(q);

      setFeedback(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<FeedbackDoc, "id">),
        })),
      );
    } catch (err) {
      console.error("Failed to load feedback:", err);
      setError("Could not load feedback.");
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  }, [business, businessLoading]);

  useEffect(() => {
    // Defer to avoid calling setState synchronously inside the effect body.
    const id = setTimeout(() => {
      void loadFeedback();
    }, 0);
    return () => clearTimeout(id);
  }, [loadFeedback]);

  return { feedback, loading, error };
}
