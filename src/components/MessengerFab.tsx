"use client";

import { useEffect, useRef, useState } from "react";
import { MESSENGERS } from "@/lib/contacts";

function IconMax() {
  return (
    <svg width="28" height="28" viewBox="0 0 1000 1000" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M506.532 801.271C446.865 801.271 419.136 792.551 370.937 757.673C340.45 796.911 243.908 827.575 239.698 775.112C239.698 735.728 230.987 702.448 221.115 666.116C209.356 621.356 196 571.508 196 499.281C196 326.777 337.402 197 504.935 197C672.614 197 803.998 333.172 803.998 500.879C804.561 665.993 671.473 800.39 506.532 801.271ZM509 346.106C427.411 341.891 363.824 398.424 349.742 487.073C338.128 560.463 358.743 649.84 376.309 654.49C384.729 656.525 405.925 639.376 419.136 626.151C440.981 641.258 466.419 650.331 492.885 652.456C577.425 656.526 649.661 592.099 655.338 507.564C658.642 422.851 593.551 351.099 509 346.251L509 346.106Z"
      />
    </svg>
  );
}

function IconTelegram() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38Z" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.881 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function IconChat() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const ICONS = {
  max: IconMax,
  telegram: IconTelegram,
  whatsapp: IconWhatsApp,
} as const;

const ICON_CLASS = "text-brand-olive-dark drop-shadow-sm";

const MESSENGER_BUTTON_BG =
  "bg-[url('/images/logo-sinonim.png')] bg-cover bg-center bg-no-repeat";

export function MessengerFab() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="fixed bottom-5 right-5 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-3"
    >
      <div
        className={`flex flex-col items-end gap-2 transition-all duration-300 ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {MESSENGERS.map((messenger, index) => {
          const Icon = ICONS[messenger.id];
          const closeDelay = `${(MESSENGERS.length - 1 - index) * 40}ms`;
          const openDelay = `${index * 50}ms`;

          return (
            <a
              key={messenger.id}
              href={messenger.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 origin-bottom-right"
              onClick={() => setOpen(false)}
            >
              <span
                className={`rounded-full bg-brand-surface px-3 py-1.5 text-sm text-brand-olive-dark shadow-md border border-brand-olive/10 transition-all duration-300 ${
                  open
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-2"
                }`}
                style={{ transitionDelay: open ? openDelay : closeDelay }}
              >
                {messenger.label}
              </span>
              <span
                className={`flex h-12 w-12 origin-bottom-right items-center justify-center rounded-full shadow-lg transition-all duration-300 group-hover:scale-105 ${
                  open ? "scale-100 opacity-100" : "scale-0 opacity-0"
                } ${MESSENGER_BUTTON_BG} ${ICON_CLASS}`}
                style={{ transitionDelay: open ? openDelay : closeDelay }}
                aria-label={messenger.label}
              >
                <Icon />
              </span>
            </a>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-terracotta text-white shadow-xl transition-all duration-300 hover:bg-brand-terracotta-logo hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-terracotta"
        aria-expanded={open}
        aria-label={open ? "Закрыть мессенджеры" : "Написать в мессенджер"}
      >
        <span
          className={`absolute transition-all duration-300 ${
            open ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          }`}
        >
          <IconChat />
        </span>
        <span
          className={`absolute transition-all duration-300 ${
            open ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
          }`}
        >
          <IconClose />
        </span>
      </button>
    </div>
  );
}
