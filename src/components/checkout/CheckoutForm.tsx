"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import {
  formatPhoneInput,
  generateOrderId,
  getDeliveryFee,
  DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD,
  saveOrder,
  SHOWROOM,
  validateCheckoutForm,
  type CheckoutFormData,
  type DeliveryMethod,
  type Order,
} from "@/lib/checkout";
import { formatPrice } from "@/lib/products";

const initialForm: CheckoutFormData = {
  name: "",
  phone: "",
  deliveryMethod: "pickup",
  city: "Москва",
  address: "",
  apartment: "",
  comment: "",
};

export function CheckoutForm() {
  const router = useRouter();
  const { items, total, isReady, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutFormData>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const deliveryFee = useMemo(
    () => getDeliveryFee(form.deliveryMethod, total),
    [form.deliveryMethod, total]
  );
  const orderTotal = total + deliveryFee;

  useEffect(() => {
    if (!isReady || completedOrder) return;
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [isReady, items.length, completedOrder, router]);

  const updateField = <K extends keyof CheckoutFormData>(
    key: K,
    value: CheckoutFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  const handlePhoneChange = (value: string) => {
    updateField("phone", formatPhoneInput(value));
  };

  const handleDeliveryMethod = (method: DeliveryMethod) => {
    updateField("deliveryMethod", method);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateCheckoutForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    const order: Order = {
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      customer: {
        ...form,
        name: form.name.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        apartment: form.apartment.trim(),
        comment: form.comment.trim(),
      },
      items: [...items],
      subtotal: total,
      deliveryFee,
      total: orderTotal,
    };

    saveOrder(order);
    clearCart();
    setCompletedOrder(order);
    setIsSubmitting(false);
  };

  if (!isReady) {
    return (
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10 text-center text-brand-muted">
          Загрузка…
        </div>
      </section>
    );
  }

  if (completedOrder) {
    const isPickup = completedOrder.customer.deliveryMethod === "pickup";

    return (
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-2xl px-4 md:px-6 lg:px-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-olive/10 text-brand-olive text-2xl mb-6">
            ✓
          </div>
          <h1 className="font-heading text-3xl md:text-4xl text-brand-olive-dark mb-3">
            Заказ оформлен
          </h1>
          <p className="text-brand-muted mb-2">
            Номер заказа{" "}
            <span className="font-medium text-brand-olive-dark">
              {completedOrder.id}
            </span>
          </p>
          <p className="text-brand-muted mb-8">
            Мы свяжемся с вами по телефону{" "}
            <span className="text-brand-olive-dark">
              {completedOrder.customer.phone}
            </span>{" "}
            для подтверждения
            {isPickup ? " и согласования времени визита в шоурум" : " и уточнения доставки"}.
          </p>

          <div className="bg-brand-surface rounded-xl p-6 text-left shadow-sm mb-8 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Способ получения</span>
              <span className="text-brand-olive-dark">
                {isPickup ? "Самовывоз из шоурума" : "Доставка курьером"}
              </span>
            </div>
            {isPickup ? (
              <p className="text-sm text-brand-muted">
                {SHOWROOM.address}
                <br />
                {SHOWROOM.hours}
              </p>
            ) : (
              <p className="text-sm text-brand-muted">
                {completedOrder.customer.city}, {completedOrder.customer.address}
                {completedOrder.customer.apartment &&
                  `, кв. ${completedOrder.customer.apartment}`}
              </p>
            )}
            <div className="flex justify-between pt-3 border-t border-brand-sand font-heading text-lg text-brand-olive-dark">
              <span>К оплате</span>
              <span>{formatPrice(completedOrder.total)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="inline-flex justify-center px-8 py-3.5 bg-brand-olive hover:bg-brand-olive-dark text-white text-sm tracking-widest uppercase transition-colors"
            >
              В каталог
            </Link>
            <Link
              href="/"
              className="inline-flex justify-center px-8 py-3.5 border border-brand-olive/30 text-brand-olive-dark hover:border-brand-olive text-sm tracking-widest uppercase transition-colors"
            >
              На главную
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-10">
        <div className="mb-8">
          <p className="text-brand-olive text-sm tracking-[0.2em] uppercase mb-2">
            Оформление
          </p>
          <h1 className="font-heading text-3xl md:text-4xl text-brand-olive-dark">
            Данные заказа
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-brand-surface rounded-xl p-5 md:p-6 shadow-sm space-y-5">
                <h2 className="font-heading text-xl text-brand-olive-dark">
                  Контакты
                </h2>

                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-xs tracking-[0.15em] uppercase text-brand-muted mb-2"
                  >
                    Имя
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Как к вам обращаться"
                    className="w-full px-4 py-3 rounded-lg border border-brand-olive/20 bg-white text-brand-text placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-olive"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-xs tracking-[0.15em] uppercase text-brand-muted mb-2"
                  >
                    Телефон
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    className="w-full px-4 py-3 rounded-lg border border-brand-olive/20 bg-white text-brand-text placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-olive"
                    required
                  />
                </div>
              </section>

              <section className="bg-brand-surface rounded-xl p-5 md:p-6 shadow-sm space-y-5">
                <h2 className="font-heading text-xl text-brand-olive-dark">
                  Способ получения
                </h2>

                <div className="grid sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleDeliveryMethod("pickup")}
                    className={`text-left p-4 rounded-xl border transition-colors ${
                      form.deliveryMethod === "pickup"
                        ? "border-brand-olive bg-brand-olive/10"
                        : "border-brand-olive/20 hover:border-brand-olive/50"
                    }`}
                  >
                    <p className="font-heading text-brand-olive-dark mb-1">
                      Самовывоз
                    </p>
                    <p className="text-sm text-brand-muted">
                      Бесплатно · {SHOWROOM.hours}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeliveryMethod("delivery")}
                    className={`text-left p-4 rounded-xl border transition-colors ${
                      form.deliveryMethod === "delivery"
                        ? "border-brand-olive bg-brand-olive/10"
                        : "border-brand-olive/20 hover:border-brand-olive/50"
                    }`}
                  >
                    <p className="font-heading text-brand-olive-dark mb-1">
                      Доставка
                    </p>
                    <p className="text-sm text-brand-muted">
                      {total >= FREE_DELIVERY_THRESHOLD
                        ? "Бесплатно"
                        : `от ${formatPrice(DELIVERY_FEE)} · бесплатно от ${formatPrice(FREE_DELIVERY_THRESHOLD)}`}
                    </p>
                  </button>
                </div>

                {form.deliveryMethod === "pickup" ? (
                  <div className="rounded-lg bg-brand-sand/40 p-4 text-sm text-brand-muted space-y-1">
                    <p className="font-medium text-brand-olive-dark">
                      {SHOWROOM.title}
                    </p>
                    <p>{SHOWROOM.address}</p>
                    <p>{SHOWROOM.hours}</p>
                    <a
                      href={`tel:${SHOWROOM.phone.replace(/\D/g, "")}`}
                      className="inline-block text-brand-olive hover:text-brand-terracotta transition-colors"
                    >
                      {SHOWROOM.phone}
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="checkout-city"
                        className="block text-xs tracking-[0.15em] uppercase text-brand-muted mb-2"
                      >
                        Город
                      </label>
                      <input
                        id="checkout-city"
                        type="text"
                        autoComplete="address-level2"
                        value={form.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-brand-olive/20 bg-white text-brand-text focus:outline-none focus:border-brand-olive"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="checkout-address"
                        className="block text-xs tracking-[0.15em] uppercase text-brand-muted mb-2"
                      >
                        Адрес
                      </label>
                      <input
                        id="checkout-address"
                        type="text"
                        autoComplete="street-address"
                        value={form.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        placeholder="Улица, дом"
                        className="w-full px-4 py-3 rounded-lg border border-brand-olive/20 bg-white text-brand-text placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-olive"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="checkout-apartment"
                        className="block text-xs tracking-[0.15em] uppercase text-brand-muted mb-2"
                      >
                        Квартира / офис
                      </label>
                      <input
                        id="checkout-apartment"
                        type="text"
                        value={form.apartment}
                        onChange={(e) => updateField("apartment", e.target.value)}
                        placeholder="Необязательно"
                        className="w-full px-4 py-3 rounded-lg border border-brand-olive/20 bg-white text-brand-text placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-olive"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="checkout-comment"
                    className="block text-xs tracking-[0.15em] uppercase text-brand-muted mb-2"
                  >
                    Комментарий к заказу
                  </label>
                  <textarea
                    id="checkout-comment"
                    rows={3}
                    value={form.comment}
                    onChange={(e) => updateField("comment", e.target.value)}
                    placeholder="Пожелания по доставке или примерке"
                    className="w-full px-4 py-3 rounded-lg border border-brand-olive/20 bg-white text-brand-text placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-olive resize-none"
                  />
                </div>
              </section>

              {error && (
                <p className="text-sm text-brand-terracotta" role="alert">
                  {error}
                </p>
              )}
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-28 bg-brand-surface rounded-xl p-6 shadow-sm space-y-4">
                <h2 className="font-heading text-xl text-brand-olive-dark">
                  Ваш заказ
                </h2>

                <ul className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-brand-sand/30">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-brand-olive-dark line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-xs text-brand-muted mt-0.5">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2 text-sm pt-2 border-t border-brand-sand">
                  <div className="flex justify-between text-brand-muted">
                    <span>Товары</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-brand-muted">
                    <span>
                      {form.deliveryMethod === "pickup"
                        ? "Самовывоз"
                        : "Доставка"}
                    </span>
                    <span>
                      {deliveryFee === 0 ? "Бесплатно" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-brand-sand font-heading text-xl text-brand-olive-dark">
                  <span>К оплате</span>
                  <span>{formatPrice(orderTotal)}</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3.5 bg-brand-terracotta hover:bg-brand-terracotta-logo disabled:opacity-60 text-white text-sm tracking-widest uppercase transition-colors"
                >
                  {isSubmitting ? "Отправка…" : "Подтвердить заказ"}
                </button>

                <Link
                  href="/cart"
                  className="block text-center text-sm text-brand-olive hover:text-brand-terracotta transition-colors"
                >
                  Вернуться в корзину
                </Link>

                <p className="text-xs text-brand-muted leading-relaxed">
                  Оплата при получении или по ссылке после подтверждения менеджером.
                  Данные используются только для обработки заказа.
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </section>
  );
}
