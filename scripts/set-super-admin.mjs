import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Service account credentials are read from environment variables.
// Never expose these with NEXT_PUBLIC_ variables.
const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

const app =
  getApps().length === 0
    ? initializeApp({
      credential: cert(serviceAccount),
    })
    : getApps()[0];

const adminAuth = getAuth(app);

const email = "superadmin@expluse.com";

try {
  // Find the Firebase Auth user.
  const user = await adminAuth.getUserByEmail(email);

  // Give this user server-controlled admin authority.
  await adminAuth.setCustomUserClaims(user.uid, {
    admin: true,
  });

  console.log(`Super admin enabled for ${email}`);
  console.log(`UID: ${user.uid}`);
} catch (error) {
  console.error("Failed to set super admin:", error);
  process.exit(1);
}