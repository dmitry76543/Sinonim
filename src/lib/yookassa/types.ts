export type YooKassaPaymentStatus =
  | "pending"
  | "waiting_for_capture"
  | "succeeded"
  | "canceled";

export type YooKassaPayment = {
  id: string;
  status: YooKassaPaymentStatus;
  paid: boolean;
  amount: {
    value: string;
    currency: string;
  };
  description?: string;
  metadata?: Record<string, string>;
  confirmation?: {
    type: string;
    confirmation_url?: string;
    return_url?: string;
  };
};

export type YooKassaWebhookEvent = {
  type: string;
  event: string;
  object: YooKassaPayment;
};
