# 🏗️ RESUMEN DE ESTRUCTURA - Sistema de Evaluaciones

## 📂 Árbol de Carpetas Completo

```
FrontendFutbol/
├── src/
│   ├── features/
│   │   └── seguimiento/
│   │       ├── components/
│   │       │   ├── EvaluationsList.jsx          ⭐ Lista de evaluaciones
│   │       │   ├── EvaluationForm.jsx           ⭐ Crear/Editar evaluación
│   │       │   ├── EvaluationDetail.jsx         ⭐ Ver detalles
│   │       │   ├── AddTestsForm.jsx             ⭐ Selector de tests
│   │       │   ├── tests/
│   │       │   │   ├── SprintTestForm.jsx       ⚡ Test de velocidad
│   │       │   │   ├── YoyoTestForm.jsx         🔄 Test Yoyo
│   │       │   │   ├── EnduranceTestForm.jsx    💪 Test resistencia
│   │       │   │   └── TechnicalAssessmentForm.jsx ⚽ Evaluación técnica
│   │       │   └── index.js                     📦 Exports
│   │       ├── hooks/
│   │       │   └── useEvaluations.js            🎣 Custom hooks + React Query
│   │       ├── services/
│   │       │   └── evaluations.api.js           📡 Llamadas API
│   │       ├── pages/
│   │       │   └── EvaluationsPage.jsx          🏠 Página principal con rutas
│   │       ├── README.md                        📚 Documentación
│   │       └── QUICK_REFERENCE.js               ⚡ Guía rápida
│   ├── app/
│   │   ├── config/
│   │   │   ├── constants.js                     ✏️ ACTUALIZADO: endpoints
│   │   │   └── http.js
│   │   └── router/
│   │       └── AppRouter.jsx                    ✏️ ACTUALIZADO: rutas
│   └── shared/
│       └── utils/
│           ├── dateUtils.js                     📅 Nuevas funciones de fecha
│           └── authUtils.js                     🔐 Nuevas funciones auth
└── IMPLEMENTATION_NOTES.md                      📋 Notas de implementación
```

## 🎯 Componentes Principales

### 1️⃣ EvaluationsList
**Función**: Mostrar tabla paginada de evaluaciones
**Props**: Ninguno
**Emite**: Eventos de navegación
**Requiere**: useEvaluations, useDeleteEvaluation

### 2️⃣ EvaluationForm
**Función**: Crear o editar evaluación
**Props**: `isEdit` (boolean)
**Emite**: Redirige tras guardar
**Requiere**: useCreateEvaluation, useUpdateEvaluation, useEvaluationById

### 3️⃣ EvaluationDetail
**Función**: Ver detalles y tests de una evaluación
**Props**: Ninguno (obtiene ID de URL)
**Emite**: Navegación a editar/agregar tests
**Requiere**: useEvaluationById

### 4️⃣ AddTestsForm
**Función**: Selector e interfaz para agregar tests
**Props**: Ninguno (obtiene ID de URL)
**Subcomponentes**: SprintTestForm, YoyoTestForm, EnduranceTestForm, TechnicalAssessmentForm

## 🔗 Mapa de Rutas

```
/seguimiento/evaluations/
├── (vacío)                    → EvaluationsList
├── create                     → EvaluationForm (create)
├── :id                        → EvaluationDetail
├── :id/edit                   → EvaluationForm (edit)
└── :id/add-tests              → AddTestsForm
    ├── → SprintTestForm
    ├── → YoyoTestForm
    ├── → EnduranceTestForm
    └── → TechnicalAssessmentForm
```

## 🧠 Lógica de Flujo

```
┌─────────────────────────────────────────────────────┐
│         USUARIO EN LISTA (EvaluationsList)         │
└────────────┬────────────────────────────────────────┘
             │
      ┌──────┼──────┬──────┐
      ▼      ▼      ▼      ▼
    [Crear][Ver][Editar][Eliminar]
      │      │      │       │
      ▼      ▼      ▼       ▼
     Form  Detail Form   Confirm
      │      │      │       │
      ├──────┴──────┘       │
      │                     │
      ▼                     │
   [AddTests]               │
      │                     │
  ┌───┴───┬───┬────┐       │
  ▼       ▼   ▼    ▼       │
Sprint  Yoyo Endo Tech     │
      │                     │
      └─────────┬───────────┘
                ▼
         [Refrescar Lista]
```

## 📊 Hook Dependencies

```javascript
useEvaluations
    ├── queryKey: ["evaluations", params]
    └── staleTime: 5 minutos

useEvaluationById
    ├── queryKey: ["evaluation", id]
    └── enabled: !!id

useCreateEvaluation
    ├── mutationKey: ["create-evaluation"]
    └── invalidates: ["evaluations"]

useCreateSprintTest
    ├── mutationKey: ["create-sprint-test"]
    └── invalidates: ["evaluation", id]

... (similar para otros)
```

## 🔄 Estado Global (Query Cache)

```
QueryClient Cache:
├── evaluations
│   └── { skip: 0, limit: 20 }: [...list...]
├── evaluation
│   └── { id: 1 }: {...detail...}
├── evaluations-by-user
│   └── { userId: 1 }: [...list...]
└── [otros...]
```

## ✅ Estados de Componentes

### EvaluationsList
```
Estado Loading    → Spinner
       ✅ Success → Tabla con datos
       ❌ Error   → Mensaje de error
       Empty     → Mensaje "no hay"
```

### EvaluationForm
```
Estado Default    → Formulario vacío
       Editing   → Formulario con datos
       Loading   → Botón deshabilitado
       ✅ Success → Redirección
       ❌ Error   → Toast error
```

### AddTestsForm
```
Estado Selecting → Botones de tipo
       Selected  → Formulario específico
       Submitting → Botón deshabilitado
       ✅ Success → Toast + Reset
```

## 🎨 Estilos Utilizados

```css
/* Colores principales */
bg-blue-600      /* Acciones primarias */
bg-amber-600     /* Editar */
bg-red-600       /* Eliminar */
bg-green-100/800 /* Éxito */
bg-gray-100      /* Hover/background */

/* Estructura */
px-6 py-3        /* Spacing standar */
rounded-lg       /* Border radius */
shadow-lg        /* Sombras */
transition       /* Animaciones */
grid grid-cols-1 md:grid-cols-2  /* Responsividad */
```

## 📡 Flujo de Datos API

```
Frontend                Backend
   │                     │
   ├─ POST /evaluations ─┤
   │  (crear)            │
   │                     ├─ Valida
   │                     ├─ Crea
   ├─ 201 Created ◄──────┤
   │  { data: {...} }    │
   │                     │
   ├─ GET /evaluations ──┤
   │  (listar)           │
   │                     ├─ Busca
   ├─ 200 OK ◄───────────┤
   │  { data: [...] }    │
   │                     │
   ├─ POST /sprint-tests ┤
   │  (crear test)       │
   │                     ├─ Valida
   │                     ├─ Crea
   ├─ 201 Created ◄──────┤
   │  { data: {...} }    │
```

## 🧪 Variables de Entorno Necesarias

```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 📦 Dependencias Externas

```json
{
  "@tanstack/react-query": "^5.71.10",
  "react-hook-form": "^7.69.0",
  "react-router-dom": "^7.10.1",
  "axios": "^1.7.7",
  "sonner": "^2.0.7",
  "lucide-react": "^0.562.0"
}
```

## 🔐 Seguridad

```
Autenticación
├── Token guardado en localStorage
├── Enviado en cada petición (interceptor)
├── Validado en backend
└── Redirige si 401

Validación
├── Frontend (React Hook Form)
├── Backend (Pydantic)
└── DB (constraints)

Autorización
├── Solo usuarios autenticados
└── Backend valida permisos
```

## 📈 Escalabilidad

El sistema está diseñado para:
- ✅ Manejar 1000s de evaluaciones
- ✅ Agregar más tipos de tests
- ✅ Paginación eficiente
- ✅ Caché inteligente con React Query
- ✅ Componentes reutilizables

Cuando necesites extender:
1. Nuevo tipo de test → Crear FormXxx.jsx + mutation hook
2. Nuevos campos → Actualizar API + formularios
3. Nuevas vistas → Crear componente + agregar ruta
4. Filtros avanzados → Extender useEvaluations params

---

**Última actualización**: 29 de diciembre de 2024
