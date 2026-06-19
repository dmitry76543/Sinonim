import { NextResponse } from "next/server";
import type { YooKassaWebhookEvent } from "@/lib/yookassa/types";

export async function POST(request: Request) {
  let body: YooKassaWebhookEvent;

  try {
    body = (await request.json()) as YooKassaWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.event;
  const payment = body.object;

  if (!event || !payment?.id) {
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }

  console.info("YooKassa webhook:", {
    event,
    paymentId: payment.id,
    status: payment.status,
    orderId: payment.metadata?.order_id,
    paid: payment.paid,
  });

  return NextResponse.json({ ok: true });
}
