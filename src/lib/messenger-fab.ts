export const MESSENGER_FAB_OPEN_EVENT = "messenger-fab:open";

export type MessengerFabOpenDetail = {
  focusOnDesktop?: boolean;
};

export function openMessengerFab(options?: MessengerFabOpenDetail) {
  window.dispatchEvent(
    new CustomEvent<MessengerFabOpenDetail>(MESSENGER_FAB_OPEN_EVENT, {
      detail: { focusOnDesktop: true, ...options },
    }),
  );
}
