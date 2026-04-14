import { NextResponse } from "next/server";
import type webpush from "web-push";
import { countSubscriptions, saveSubscription } from "@/lib/push-subscriptions";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { subscription?: webpush.PushSubscription };

  if (!body.subscription) {
    return NextResponse.json({ error: "Missing subscription" }, { status: 400 });
  }

  const id = saveSubscription(body.subscription);
  return NextResponse.json({ success: true, id, totalSubscriptions: countSubscriptions() });
}
