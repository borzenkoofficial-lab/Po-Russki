# ПО-РУССКИ

Многостраничный сайт по демонтажу, подготовке помещений, отделке и фальшполу.

## Страницы

- `/` — главная
- `/uslugi` — каталог услуг
- `/uslugi/demontazh` — демонтаж
- `/uslugi/podgotovka` — подготовка
- `/uslugi/otdelka` — отделка
- `/uslugi/falshpol` — фальшпол
- `/raboty` — работы и кейсы
- `/o-nas` — о нас
- `/kontakty` — контакты и заявка

## Визуальная система

Industrial / editorial / architectural. Реальный Three.js hero, интерактивные переходы, case-study интерфейс, before/after, адаптив.

## Фото объектов

Реальные фото кладутся в `public/cases/`. Имена описаны в `public/cases/README.md`.

## Запуск

```bash
npm install
npm run dev
```


Последнее обновление визуального слоя: 2026-10-06.


## Production

- Navigation uses real URLs with client-side transitions, so every page also works on direct load.
- Vercel rewrites SPA routes to `index.html`.
- Production assets under `/assets/` are configured for immutable caching.
- The contact form prepares a structured request using the system share sheet on supported devices or clipboard on desktop.
- Real project photos should replace the current concept case visuals in `public/cases/` before publishing them as completed works.
