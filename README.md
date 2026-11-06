# userinyerface-playwright

Suite de **401 pruebas** (Playwright + TypeScript, archivos `*.spec.ts`) para https://userinyerface.com

## Requisitos
- Node.js 18 o superior (recomendado 20/22) → https://nodejs.org
- Conexión a internet

## Instalación
```bash
npm install
npx playwright install          # descarga Chromium, Firefox y WebKit
# solo Chromium (más rápido):
# npx playwright install chromium
```
En Linux, si faltan librerías: `npx playwright install --with-deps`

## Ejecución
```bash
npm test                        # todo, en los 3 navegadores
npm run test:chromium           # solo Chromium (recomendado para empezar)
npm run test:headed             # viendo el navegador
npm run test:ui                 # modo interactivo
npx playwright test tests/password.spec.ts      # un archivo
npx playwright test -g "viewport"               # por nombre
npm run report                  # abrir reporte HTML
npm run count                   # listar/contar tests
```

## Estructura
```
src/selectors.ts      selectores centralizados (ajustar aquí si el sitio cambia)
src/pages/GamePage.ts page object del juego
src/data/testData.ts  datos y matrices de prueba
tests/                11 archivos .spec.ts
```

| Archivo | Pruebas |
|---|---|
| home.spec.ts | 44 |
| password.spec.ts | 70 |
| email-domain.spec.ts | 51 |
| dropdown-terms.spec.ts | 36 |
| interests-upload.spec.ts | 56 |
| dynamic.spec.ts | 22 |
| responsive.spec.ts | 48 |
| network.spec.ts | 22 |
| e2e-flow.spec.ts | 20 |
| keyboard-a11y.spec.ts | 20 |
| typing-behavior.spec.ts | 12 |

## Importante
User Inyerface es una web hecha a propósito con mala UX (overlays de cookies y ayuda, reglas de
contraseña raras, timer, etc.). Los selectores y reglas se escribieron según lo conocido del sitio
**sin poder ejecutarlos contra él**, así que es normal que algunos tests fallen en la primera corrida.
- Selectores: `src/selectors.ts`
- Regla de contraseña (mayúscula + dígito + letra cirílica + parte del email): `src/data/testData.ts`
