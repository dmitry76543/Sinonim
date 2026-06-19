import { NextResponse } from "next/server";
import { getYooKassaPayment } from "@/lib/yookassa/client";
import { isYooKassaConfigured } from "@/lib/yookassa/config";

export async function GET(request: Request) {
  if (!isYooKassaConfigured()) {
    return NextResponse.json(
      { error: "Онлайн-оплата не настроена" },
      { status: 503 },
    );
  }

  const paymentId = new URL(request.url).searchParams.get("paymentId");
  if (!paymentId) {
    return NextResponse.json(
      { error: "Не указан идентификатор платежа" },
      { status: 400 },
    );
  }

  try {
    const payment = await getYooKassaPayment(paymentId);

    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      paid: payment.paid,
      orderId: payment.metadata?.order_id,
    });
  } catch (error) {
    console.error("YooKassa payment status error:", error);
    const message =
      error instanceof Error ? error.message : "Не удалось проверить оплату";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
