# Design tokens – TractorsCompare

Referencia rápida del sistema de diseño (inspirado en [UI UX Pro Max](https://ui-ux-pro-max-skill.nextlevelbuilder.io/#styles)). Usar estas clases y colores para mantener coherencia.

---

## Tipografía

| Uso | Clase Tailwind | Fuente |
|-----|----------------|--------|
| Cuerpo, UI | `font-sans` | Inter |
| Títulos, marca, H1–H6 | `font-heading` | Plus Jakarta Sans |

- Los headings (`h1`–`h6`) tienen `font-heading` por defecto en `globals.css`.
- Logo y títulos de sección: usar `font-heading` si no son un tag de heading.

---

## Paleta (agricultura + datos)

### Primary (verde – confianza, campo)
- **primary-50** a **primary-900**: escala completa.
- Botones principales, marca, estados hover activos: `primary-600`, `primary-700`.
- Fondos suaves: `primary-50`, `primary-100`.

### Accent (azul – enlaces, datos)
- **accent-50** a **accent-600**.
- Enlaces y acciones secundarias tipo “link”: `accent-600`, `accent-500`.

### Surface
- **surface** / **surface.elevated**: `#ffffff`.
- **surface.muted**: `#f8fafc` – fondos de sección.

---

## Radios y sombras

| Token | Clase | Uso |
|-------|--------|-----|
| Card radius | `rounded-card` | Tarjetas, paneles (0.75rem). |
| Button radius | `rounded-button` | Botones (0.5rem). |
| Card shadow | `shadow-card` | Sombra por defecto de tarjetas. |
| Card hover | `shadow-card-hover` | Sombra al hover. |

---

## Componentes base (globals.css)

- **`.card`**: `bg-white rounded-card shadow-card hover:shadow-card-hover border border-gray-100`.
- **`.btn-primary`**: primario verde, focus ring, estados hover/active.
- **`.btn-secondary`**: borde gris, hover fondo gris claro, focus ring.

---

## Accesibilidad

- **Focus visible**: `outline-2 outline-offset-2 outline-primary-500` en `*:focus-visible`.
- Botones y enlaces interactivos deben tener estado focus visible (ya aplicado en `.btn-primary` y `.btn-secondary`).

---

## Dónde se define

- **Colores y fuentes**: `tailwind.config.js` → `theme.extend`.
- **Base y componentes**: `app/globals.css` → `@layer base` y `@layer components`.
