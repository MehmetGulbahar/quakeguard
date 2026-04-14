import type webpush from "web-push";

type StoredSubscription = {
  id: string;
  subscription: webpush.PushSubscription;
  createdAt: number;
};

const store = new Map<string, StoredSubscription>();

function toId(subscription: webpush.PushSubscription): string {
  return subscription.endpoint;
}

export function saveSubscription(subscription: webpush.PushSubscription) {
  const id = toId(subscription);

  store.set(id, {
    id,
    subscription,
    createdAt: Date.now(),
  });

  return id;
}

export function deleteSubscription(subscription: webpush.PushSubscription) {
  const id = toId(subscription);
  return store.delete(id);
}

export function listSubscriptions(): StoredSubscription[] {
  return [...store.values()];
}

export function countSubscriptions(): number {
  return store.size;
}
