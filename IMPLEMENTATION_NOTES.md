# 📋 Notas de Implementación - Sistema de Evaluaciones Frontend

## ✅ Lo que se ha hecho

### 1. **Servicios API** (`services/evaluations.api.js`)
- ✅ Crear evaluación
- ✅ Listar evaluaciones (con paginación)
- ✅ Obtener evaluación por ID
- ✅ Obtener evaluaciones por usuario
- ✅ Actualizar evaluación
- ✅ Eliminar evaluación (soft delete)
- ✅ Crear test de velocidad (Sprint)
- ✅ Crear test Yoyo
- ✅ Crear test de resistencia
- ✅ Crear evaluación técnica

### 2. **Custom Hooks** (`hooks/useEvaluations.js`)
- ✅ `useEvaluations()` - Listar con caché
- ✅ `useEvaluationById()` - Obtener por ID
- ✅ `useEvaluationsByUser()` - Listar por usuario
- ✅ `useCreateEvaluation()` - Mutation para crear
- ✅ `useUpdateEvaluation()` - Mutation para actualizar
- ✅ `useDeleteEvaluation()` - Mutation para eliminar
- ✅ `useCreateSprintTest()` - Mutation para sprint
- ✅ `useCreateYoyoTest()` - Mutation para yoyo
- ✅ `useCreateEnduranceTest()` - Mutation para resistencia
- ✅ `useCreateTechnicalAssessment()` - Mutation para técnica

### 3. **Componentes** (`components/`)

#### Componente Principal
- ✅ **EvaluationsList.jsx**: Lista paginada con opciones CRUD
  - Búsqueda, paginación
  - Botones para ver, editar, eliminar
  - Estados de carga y error

#### Formularios
- ✅ **EvaluationForm.jsx**: Crear/Editar evaluación
  - Validación de fechas (no pasado)
  - Validación de campos
  - Estados de carga

- ✅ **EvaluationDetail.jsx**: Ver detalles
  - Información de la evaluación
  - Lista de tests asociados
  - Botón para agregar tests

#### Tests
- ✅ **AddTestsForm.jsx**: Selector de tipo de test
  - Interfaz amigable para elegir tipo
  - Componente dinámico

- ✅ **SprintTestForm.jsx**: Test de velocidad
  - Campos: athlete_id, distancia, tiempos (0-10, 0-30)
  - Validaciones numéricas

- ✅ **YoyoTestForm.jsx**: Test Yoyo
  - Campos: athlete_id, lanzaderas, nivel final, fallos
  - Validaciones

- ✅ **EnduranceTestForm.jsx**: Test de resistencia
  - Campos: athlete_id, duración, distancia total
  - Validaciones

- ✅ **TechnicalAssessmentForm.jsx**: Evaluación técnica
  - Campos: control de balón, pases, disparo, regate
  - Escalas: MUY_BAJO, BAJO, MEDIO, ALTO, MUY_ALTO

### 4. **Utilidades** (`src/shared/utils/`)
- ✅ **dateUtils.js**: Funciones de formato de fechas
  - `formatDate()` - Convierte ISO a local
  - `formatTime()` - Formatea hora
  - `getTodayISO()` - Fecha actual
  - `isFutureDate()` - Valida fechas futuras
  - `dateToISO()` - Convierte a ISO

- ✅ **authUtils.js**: Funciones de autenticación
  - `getCurrentUser()` - Obtiene usuario
  - `getAuthToken()` - Obtiene token
  - `isAuthenticated()` - Verifica autenticación
  - `getUserField()` - Obtiene campo de usuario

### 5. **Configuración**
- ✅ **API Endpoints actualizados** (constants.js)
  - Rutas correctas para evaluaciones
  - Rutas correctas para tests

- ✅ **Rutas configuradas** (AppRouter.jsx)
  - Rutas dinámicas para evaluaciones
  - Soporte para subrutas

### 6. **Documentación**
- ✅ **README.md**: Documentación completa
- ✅ **QUICK_REFERENCE.js**: Guía rápida de uso

---

## 🔄 Flujo Completo del Usuario

### 1. **Crear una Evaluación**
```
Usuario → Click "Nueva Evaluación" 
       → EvaluationForm (create mode)
       → Llena: nombre, fecha, hora, ubicación
       → Submit → createEvaluation.mutate()
       → Redirect a AddTestsForm
```

### 2. **Agregar Tests**
```
Usuario → Click "Agregar Tests"
       → AddTestsForm (selector)
       → Selecciona tipo de test
       → Completa formulario específico
       → Submit → createSprintTest.mutate() (etc)
       → Toast de éxito, vuelve al selector
       → Puede agregar más tests
```

### 3. **Ver Detalles**
```
Usuario → EvaluationsList
       → Click ojo (detalle)
       → EvaluationDetail
       → Muestra info + tests
       → Opción de editar o agregar más tests
```

### 4. **Editar**
```
Usuario → EvaluationsList o Detail
       → Click lápiz (edit)
       → EvaluationForm (edit mode)
       → Carga datos existentes
       → Modifica campos
       → Submit → updateEvaluation.mutate()
```

### 5. **Eliminar**
```
Usuario → EvaluationsList
       → Click papelera
       → Confirmación
       → deleteEvaluation.mutate()
       → Se refresca lista
```

---

## 📦 Estructura de Datos

### Evaluación
```javascript
{
  id: number,
  name: string,
  date: ISO string,           // "2024-01-15T00:00:00"
  time: string,               // "10:30"
  user_id: number,
  location: string | null,
  observations: string | null,
  tests: Array,               // Tests asociados
  created_at: ISO string,
  updated_at: ISO string,
  is_active: boolean
}
```

### Test (genérico)
```javascript
{
  id: number,
  evaluation_id: number,
  athlete_id: number,
  date: ISO string,
  test_type: string,          // "sprint", "yoyo", etc
  observations: string | null,
  created_at: ISO string
}
```

### Test Sprint
```javascript
{
  ...test,
  distance_meters: number,
  time_0_10_s: float,
  time_0_30_s: float
}
```

### Test Yoyo
```javascript
{
  ...test,
  shuttle_count: number,
  final_level: string,        // "18.2"
  failures: number
}
```

### Test Resistencia
```javascript
{
  ...test,
  min_duration: number,
  total_distance_m: number
}
```

### Evaluación Técnica
```javascript
{
  ...test,
  ball_control: enum,         // MUY_BAJO, BAJO, MEDIO, ALTO, MUY_ALTO
  short_pass: enum,
  long_pass: enum,
  shooting: enum,
  dribbling: enum
}
```

---

## 🔗 Endpoints del Backend Utilizados

### Evaluaciones
```
GET    /api/v1/evaluations/              ← lista
POST   /api/v1/evaluations/              ← crear
GET    /api/v1/evaluations/{id}          ← detalle
PUT    /api/v1/evaluations/{id}          ← actualizar
DELETE /api/v1/evaluations/{id}          ← eliminar
GET    /api/v1/evaluations/user/{uid}    ← por usuario
```

### Tests
```
POST   /api/v1/sprint-tests/             ← velocidad
POST   /api/v1/yoyo-tests/               ← yoyo
POST   /api/v1/endurance-tests/          ← resistencia
POST   /api/v1/technical-assessments/    ← técnica
```

---

## 🎯 Características Implementadas

### Validaciones ✅
- [x] Fecha no puede ser en el pasado
- [x] Todos los campos requeridos validados
- [x] Valores numéricos > 0
- [x] IDs válidos (athlete_id, evaluation_id)
- [x] Escalas técnicas correctas

### UX/UI ✅
- [x] Formularios intuitivos
- [x] Notificaciones con Sonner (toast)
- [x] Indicadores de carga
- [x] Mensajes de error claros
- [x] Confirmaciones para eliminar
- [x] Diseño responsivo

### Gestión de Estado ✅
- [x] React Query para caché
- [x] Sincronización automática
- [x] Invalidación inteligente
- [x] Manejo de errores global

### Autenticación ✅
- [x] Token Bearer automático
- [x] Obtención de usuario actual
- [x] Protección de rutas

---

## 🚀 Próximos Pasos Sugeridos

### Opcional - Frontend
1. Agregar filtros avanzados en lista de evaluaciones
2. Exportar evaluaciones a PDF/Excel
3. Gráficos de progreso por deportista
4. Búsqueda y filtros por fecha
5. Vista de calendario de evaluaciones
6. Importar datos en bulk

### Opcional - Backend
1. Agregar búsqueda full-text
2. Reportes analíticos
3. Comparación entre evaluaciones
4. Cálculo automático de índices
5. Alertas de performance

---

## 🔍 Testing

### Casos de Prueba Recomendados

#### Crear Evaluación
- [x] Nombre vacío → error
- [x] Fecha pasada → error
- [x] Fecha futura → OK
- [x] Sin hora → error
- [x] Todos los campos → OK

#### Crear Tests
- [x] Sin athlete_id → error
- [x] athlete_id inválido → error 400
- [x] Valores negativos → error
- [x] Escalas inválidas (técnica) → error
- [x] Todos válidos → OK

#### CRUD
- [x] Crear → Listar (aparece)
- [x] Editar → Detalle (muestra cambios)
- [x] Eliminar → Desaparece de lista

---

## 📝 Notas Técnicas

### React Query
- **Stale time**: 5 minutos
- **Cache invalidation**: Al crear/actualizar/eliminar
- **Error handling**: Automático con toast

### React Hook Form
- Validación en tiempo real
- Errores formateados
- Reset automático tras envío

### Tailwind CSS
- Responsive: mobile → tablet → desktop
- Colores consistentes
- Animaciones de carga

### Axios
- Interceptor de autenticación
- Manejo de errores 401
- Base URL configurable

---

## 🐛 Solución de Problemas

### "Error: usuario no autenticado"
→ Verifica que el token esté en localStorage
→ Intenta hacer login nuevamente

### "404 en crear evaluación"
→ Backend no está corriendo
→ Endpoint incorrecto en VITE_API_URL
→ Revisa la ruta en constants.js

### "Tests no aparecen en detalle"
→ Backend no devuelve tests en GET /evaluations/{id}
→ Revisa la respuesta en Network tools

### "Fechas incorrectas"
→ Verifica que el servidor devuelva ISO strings
→ Revisa dateUtils.js para conversión

---

## 📚 Referencias

### Librerías
- [React Query Docs](https://tanstack.com/query)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)

### Archivos Clave
- `src/features/seguimiento/services/evaluations.api.js` - Llamadas API
- `src/features/seguimiento/hooks/useEvaluations.js` - Hooks
- `src/features/seguimiento/components/` - Componentes
- `src/app/config/constants.js` - Constantes

---

**Actualizado**: 29 de diciembre de 2024
