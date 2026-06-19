"use client";

import type { ReactNode } from "react";
import { trackContactPhone } from "@/lib/analytics/metrika";

type MetrikaPhoneLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

export function MetrikaPhoneLink({
  href,
  className,
  children,
  onClick,
}: MetrikaPhoneLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        trackContactPhone();
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}
