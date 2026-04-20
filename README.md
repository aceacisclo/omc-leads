# OMC Leads Manager

Aplicación frontend para administrar leads de marketing digital, con dashboard de estadísticas y resumen inteligente generado con lógica local.

## Stack tecnológico

| Categoría | Tecnología | Justificación |
|---|---|---|
| Framework | React 18 + Vite | Velocidad de desarrollo, HMR, ecosistema maduro |
| Lenguaje | TypeScript | Tipado fuerte, mejor DX y menos bugs en runtime |
| Estilos | Tailwind CSS | Utilidades rápidas, consistencia visual, responsive fácil |
| Estado | Zustand | Simple, sin boilerplate, con persistencia integrada |
| Formularios | React Hook Form + Zod | Validaciones declarativas, tipadas y eficientes |
| Gráficas | Recharts | Ligero, composable, fácil integración con React |
| Íconos | Lucide React | Consistentes y tree-shakeable |
| Fechas | date-fns | Ligero y modular |
| Datos | localStorage + JSON embebido | 100% frontend, sin backend requerido |

## Instalación y uso

```bash
# Clonar el repositorio
git clone <repo-url>
cd omc-leads

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```


## Estructura del proyecto

```
src/
├── types/          # Tipos TypeScript (Lead, LeadSource, etc.)
├── data/           # Datos iniciales (12 leads de ejemplo)
├── store/          # Zustand store (estado global + persistencia)
├── utils/          # Lógica de negocio (generador de resumen IA)
├── components/
│   ├── ui/         # Componentes genéricos (Button, Modal, Badge)
│   ├── leads/      # Tabla, filtros, formulario, detalle
│   ├── dashboard/  # Tarjetas y gráfica de estadísticas
│   └── ai/         # Módulo de resumen inteligente
└── pages/          # LeadsPage, DashboardPage, AISummaryPage
```

## Cómo funciona la persistencia

Los leads se almacenan en `localStorage` mediante Zustand Persist. Al primer inicio se cargan 12 leads de ejemplo desde `src/data/initialLeads.ts`. Las operaciones CRUD (crear, editar, eliminar) se reflejan inmediatamente en el estado y persisten entre sesiones.

## Resumen inteligente (IA local)

La función `generateLocalSummary()` en `src/utils/aiSummary.ts` calcula:
- Análisis estadístico de los leads filtrados
- Fuente principal de captación
- Promedio de presupuesto
- Tendencia de los últimos 7 días
- Recomendaciones accionables basadas en los datos

No requiere API key. Si se quisiera integrar con un LLM real (Anthropic/OpenAI), se reemplazaría la función con una llamada a la API.

## Variables de entorno

```
VITE_ANTHROPIC_API_KEY=   # Opcional: para integración real con Claude
```

## Build de producción

```bash
npm run build
npm run preview
```
