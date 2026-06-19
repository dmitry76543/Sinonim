"use client";

import type { ReactNode } from "react";
import { trackShowroomMapClick } from "@/lib/analytics/metrika";

type MetrikaMapLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export function MetrikaMapLink({ href, className, children }: MetrikaMapLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackShowroomMapClick()}
    >
      {children}
    </a>
  );
}
