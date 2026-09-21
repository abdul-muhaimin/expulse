rules_version = '2';

service cloud.firestore {
match /databases/{database}/documents {

    function signedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return signedIn() &&
             request.auth.token.admin == true;
    }

    // -------------------------
    // Users
    // -------------------------

    match /users/{userId} {

      allow create: if signedIn()
                    && request.auth.uid == userId;

      allow read: if signedIn()
                  && (
                    request.auth.uid == userId ||
                    isAdmin()
                  );

      allow update: if signedIn()
                    && request.auth.uid == userId;

      allow delete: if false;
    }

    // -------------------------
    // Businesses
    // -------------------------

    match /businesses/{businessId} {

      allow create: if signedIn()
                    && request.resource.data.ownerId == request.auth.uid
                    && request.resource.data.status == "pending";

      // Owner/admin can always read.
      // Anonymous visitors can only read ACTIVE businesses.
      allow read: if (
                    signedIn()
                    && (
                      resource.data.ownerId == request.auth.uid ||
                      isAdmin()
                    )
                  )
                  ||
                  resource.data.status == "active";

      // Admin can manage status.
      // Owner can edit business details but cannot change
      // ownership or approval status.
      allow update: if signedIn()
                    && (
                      isAdmin()
                      ||
                      (
                        resource.data.ownerId == request.auth.uid
                        && request.resource.data.ownerId == resource.data.ownerId
                        && request.resource.data.status == resource.data.status
                      )
                    );

      allow delete: if false;
    }

    // -------------------------
    // Feedback
    // -------------------------

    match /feedback/{feedbackId} {

      // Anyone can submit feedback, but only with our expected fields,
      // valid values, and for an ACTIVE business.
      allow create: if
        request.resource.data.keys().hasOnly([
          "businessId",
          "rating",
          "recommend",
          "comment",
          "createdAt"
        ])
        &&
        request.resource.data.businessId is string
        &&
        request.resource.data.rating is int
        &&
        request.resource.data.rating >= 1
        &&
        request.resource.data.rating <= 5
        &&
        request.resource.data.recommend is bool
        &&
        request.resource.data.comment is string
        &&
        request.resource.data.comment.size() <= 1000
        &&
        request.resource.data.createdAt == request.time
        &&
        get(
          /databases/$(database)/documents/businesses/$(request.resource.data.businessId)
        ).data.status == "active";

      // Business owners can only read feedback belonging to
      // a business they own. Admin can read everything.
      allow read: if isAdmin()
                  ||
                  (
                    signedIn()
                    &&
                    get(
                      /databases/$(database)/documents/businesses/$(resource.data.businessId)
                    ).data.ownerId == request.auth.uid
                  );

      // Customer feedback is immutable.
      allow update, delete: if false;
    }

    // Everything not explicitly allowed above is denied.
    match /{document=**} {
      allow read, write: if false;
    }

}
}
