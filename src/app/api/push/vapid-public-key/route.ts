import { NextResponse } from "next/server";
import { getVapidPublicKey } from "@/lib/push-server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const publicKey = getVapidPublicKey();
    return NextResponse.json({ publicKey });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "VAPID key unavailable" },
      { status: 500 },
    );
  }
}
