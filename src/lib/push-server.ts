import webpush from "web-push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:alerts@quakeguard.app";

let initialized = false;

export function getVapidPublicKey() {
  if (!VAPID_PUBLIC_KEY) {
    throw new Error("NEXT_PUBLIC_VAPID_PUBLIC_KEY is not configured");
  }

  return VAPID_PUBLIC_KEY;
}

export function initializeWebPush() {
  if (initialized) {
    return;
  }

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    throw new Error("VAPID keys are not configured");
  }

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  initialized = true;
}

export async function sendPushNotification(
  subscription: webpush.PushSubscription,
  payload: Record<string, unknown>,
) {
  initializeWebPush();
  await webpush.sendNotification(subscription, JSON.stringify(payload));
}
