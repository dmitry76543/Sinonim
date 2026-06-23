Резервная копия перед установкой виджета Photta
=============================================

Создана: 2026-06-23
Git-ветка: backup/before-photta-widget
Коммит: 2360c2b

Как отменить изменения Photta
-----------------------------

Полностью вернуть проект к состоянию до виджета:

  git checkout backup/before-photta-widget

Только убрать файлы виджета, оставив остальные правки:

  git checkout backup/before-photta-widget -- src/components/product/ProductPage.tsx
  git rm src/components/product/ProductTryOn.tsx
  git rm src/lib/photta/config.ts
  del BACKUP_PHOTTA.md

Также удалите NEXT_PUBLIC_PHOTTA_API_KEY из .env.local и с production env.

Изменённые файлы (Photta)
-------------------------
- src/components/product/ProductTryOn.tsx (новый)
- src/lib/photta/config.ts (новый)
- src/components/product/ProductPage.tsx
- .env.example
