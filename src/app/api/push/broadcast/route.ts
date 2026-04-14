import { NextResponse } from "next/server";
import { sendPushNotification } from "@/lib/push-server";
import { deleteSubscription, listSubscriptions } from "@/lib/push-subscriptions";

export const runtime = "nodejs";

type BroadcastPayload = {
  title?: string;
  body?: string;
  url?: string;
  tag?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as { payload?: BroadcastPayload };

  const payload = {
    title: body.payload?.title || "Acil deprem uyarisi",
    body: body.payload?.body || "Yeni deprem tespit edildi.",
    url: body.payload?.url || "/list",
    tag: body.payload?.tag || "earthquake-alert",
  };

  const subscribers = listSubscriptions();

  if (subscribers.length === 0) {
    return NextResponse.json({ success: true, sent: 0, failed: 0, totalSubscriptions: 0 });
  }

  let sent = 0;
  let failed = 0;

  await Promise.all(
    subscribers.map(async ({ subscription }) => {
      try {
        await sendPushNotification(subscription, payload);
        sent += 1;
      } catch (error) {
        failed += 1;

        const statusCode = (error as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          deleteSubscription(subscription);
        }
      }
    }),
  );

  return NextResponse.json({
    success: true,
    sent,
    failed,
    totalSubscriptions: listSubscriptions().length,
  });
}
