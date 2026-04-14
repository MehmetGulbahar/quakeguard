import { NextResponse } from "next/server";
import type webpush from "web-push";
import { sendPushNotification } from "@/lib/push-server";

export const runtime = "nodejs";

type PushPayload = {
  title: string;
  body: string;
  url?: string;
  tag?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as {
    subscription?: webpush.PushSubscription;
    payload?: PushPayload;
  };

  if (!body.subscription) {
    return NextResponse.json({ error: "Missing subscription" }, { status: 400 });
  }

  const payload: PushPayload = {
    title: body.payload?.title || "Yeni deprem tespit edildi",
    body: body.payload?.body || "Son 5 dakika icinde deprem kaydedildi.",
    url: body.payload?.url || "/list",
    tag: body.payload?.tag || "earthquake-alert",
  };

  try {
    await sendPushNotification(body.subscription, payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Push send failed" },
      { status: 500 },
    );
  }
}
