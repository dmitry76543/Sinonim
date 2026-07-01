"use client";

import { openMessengerFab } from "@/lib/messenger-fab";

type ShowroomBookButtonProps = {
  className?: string;
};

export function ShowroomBookButton({ className }: ShowroomBookButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => openMessengerFab()}
    >
      Записаться
    </button>
  );
}
