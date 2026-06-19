import { randomUUID } from "crypto";
import {
  getYooKassaReturnUrl,
  getYooKassaSecretKey,
  getYooKassaShopId,
} from "./config";
import type { YooKassaPayment } from "./types";

function formatAmount(rubles: number): string {
  return rubles.toFixed(2);
}

function getAuthHeader(): string {
  const credentials = `${getYooKassaShopId()}:${getYooKassaSecretKey()}`;
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}

async function yookassaFetch<T>(
  path: string,
  init: RequestInit & { idempotenceKey?: string } = {},
): Promise<T> {
  const { idempotenceKey, ...requestInit } = init;
  const headers = new Headers(requestInit.headers);
  headers.set("Authorization", getAuthHeader());
  headers.set("Content-Type", "application/json");
  if (idempotenceKey) {
    headers.set("Idempotence-Key", idempotenceKey);
  }

  const response = await fetch(`https://api.yookassa.ru/v3${path}`, {
    ...requestInit,
    headers,
  });

  const data = (await response.json()) as T & {
    type?: string;
    description?: string;
  };

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data &&
      "description" in data &&
      data.description
        ? data.description
        : `YooKassa API error (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export async function createYooKassaPayment(params: {
  orderId: string;
  amount: number;
  description: string;
  customerPhone?: string;
}): Promise<YooKassaPayment> {
  return yookassaFetch<YooKassaPayment>("/payments", {
    method: "POST",
    idempotenceKey: params.orderId || randomUUID(),
    body: JSON.stringify({
      amount: {
        value: formatAmount(params.amount),
        currency: "RUB",
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: getYooKassaReturnUrl(params.orderId),
      },
      description: params.description,
      metadata: {
        order_id: params.orderId,
      },
    }),
  });
}

export async function getYooKassaPayment(
  paymentId: string,
): Promise<YooKassaPayment> {
  return yookassaFetch<YooKassaPayment>(`/payments/${paymentId}`);
}
