"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { Ban, Check } from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase/client";

type AdminBusiness = {
  id: string;
  name: string;
  category: string;
  location: string;
  status: "pending" | "active" | "suspended";
  ownerId: string;
  createdAt?: Timestamp;
};

export function BusinessList() {
  const { user } = useAuth();

  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadBusinesses() {
      try {
        const businessQuery = query(
          collection(db, "businesses"),
          orderBy("createdAt", "desc"),
        );

        const snapshot = await getDocs(businessQuery);

        const items = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        })) as AdminBusiness[];

        setBusinesses(items);
      } catch (error) {
        console.error("Failed to load businesses:", error);
        setError("Could not load businesses.");
      } finally {
        setLoading(false);
      }
    }

    void loadBusinesses();
  }, []);

  async function updateBusinessStatus(
    businessId: string,
    status: "active" | "suspended",
  ) {
    if (!user) return;

    setUpdatingId(businessId);
    setError("");

    try {
      const businessRef = doc(db, "businesses", businessId);

      if (status === "active") {
        await updateDoc(businessRef, {
          status: "active",
          approvedAt: serverTimestamp(),
          approvedBy: user.uid,
        });
      } else {
        await updateDoc(businessRef, {
          status: "suspended",
          suspendedAt: serverTimestamp(),
          suspendedBy: user.uid,
        });
      }

      // Update the screen immediately.
      setBusinesses((current) =>
        current.map((business) =>
          business.id === businessId ? { ...business, status } : business,
        ),
      );
    } catch (error) {
      console.error("Failed to update business status:", error);
      setError("Could not update the business status.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">Loading businesses...</p>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>;
  }

  if (businesses.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No businesses have registered yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Businesses</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {businesses.map((business) => (
          <div
            key={business.id}
            className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{business.name}</p>

              <p className="mt-1 text-sm text-muted-foreground">
                {business.category} · {business.location}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline">{business.status}</Badge>

              {business.status === "pending" && (
                <Button
                  size="sm"
                  onClick={() => updateBusinessStatus(business.id, "active")}
                  disabled={updatingId === business.id}
                >
                  <Check className="size-4" />
                  Approve
                </Button>
              )}

              {business.status === "active" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateBusinessStatus(business.id, "suspended")
                  }
                  disabled={updatingId === business.id}
                >
                  <Ban className="size-4" />
                  Suspend
                </Button>
              )}

              {business.status === "suspended" && (
                <Button
                  size="sm"
                  onClick={() => updateBusinessStatus(business.id, "active")}
                  disabled={updatingId === business.id}
                >
                  <Check className="size-4" />
                  Reactivate
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
