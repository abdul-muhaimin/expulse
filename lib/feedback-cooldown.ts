const COOLDOWN_MS = 24 * 60 * 60 * 1000;

function getStorageKey(businessId: string) {
  return `expulse_feedback_${businessId}`;
}

export function hasRecentFeedback(businessId: string) {
  if (typeof window === "undefined") return false;

  const value = window.localStorage.getItem(getStorageKey(businessId));

  if (!value) return false;

  const submittedAt = Number(value);

  if (!Number.isFinite(submittedAt)) {
    window.localStorage.removeItem(getStorageKey(businessId));

    return false;
  }

  const stillCoolingDown = Date.now() - submittedAt < COOLDOWN_MS;

  if (!stillCoolingDown) {
    window.localStorage.removeItem(getStorageKey(businessId));
  }

  return stillCoolingDown;
}

export function markFeedbackSubmitted(businessId: string) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(getStorageKey(businessId), String(Date.now()));
}
