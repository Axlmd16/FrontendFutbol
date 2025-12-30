# 🛠️ GUÍA DE DESARROLLO - Comandos y Tips

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Lint
npm run lint
```

## 📱 Testing Manual

### Test 1: Crear Evaluación
```
1. Navega a /seguimiento/evaluations
2. Click "Nueva Evaluación"
3. Completa el formulario:
   - Nombre: "Test Evaluación"
   - Fecha: Mañana (o futuro)
   - Hora: 10:30
   - Ubicación: "Cancha A"
4. Click "Crear Evaluación"
5. Deberías ver el selector de tests
```

### Test 2: Agregar Test Sprint
```
1. En el selector de tests, click en "Test de Velocidad"
2. Completa el formulario:
   - Deportista ID: 1 (o existente)
   - Distancia: 30
   - Tiempo 0-10: 1.85
   - Tiempo 0-30: 3.95
3. Click "Crear Test de Velocidad"
4. Toast de éxito
5. Vuelve al selector
```

### Test 3: Ver Detalles
```
1. Vuelve a la lista (/seguimiento/evaluations)
2. Haz click en el ícono de "ojo"
3. Deberías ver:
   - Información de la evaluación
   - Tabla de tests (con el que acabas de crear)
4. Click en "Agregar Tests" para más
```

### Test 4: Editar
```
1. En la lista, click en el ícono de "lápiz"
2. Modifica algún campo (ej: nombre)
3. Click "Actualizar Evaluación"
4. Vuelve a la lista y verifica el cambio
```

### Test 5: Eliminar
```
1. En la lista, click en el ícono de "papelera"
2. Confirma en el diálogo
3. La evaluación desaparece de la lista
```

## 🔍 Debug Tips

### Ver Peticiones API
```javascript
// En la consola del navegador
// Abre Network tab y filtra por XHR
// Verás todas las peticiones a /api/v1/
```

### Ver Estado de React Query
```javascript
// Instala React Query DevTools
npm install @tanstack/react-query-devtools

// El ícono aparecerá en la esquina
// Puedes inspeccionar el caché
```

### Ver Estado del Almacenamiento
```javascript
// En consola:
localStorage.getItem('kallpa_auth_token')
localStorage.getItem('kallpa_user_data')
```

### Logs de Componentes
```javascript
// Agrega esto en componentes para debug:
useEffect(() => {
  console.log('Evaluación cargada:', data);
}, [data]);
```

## 🐛 Problemas Comunes

### Problema: "404 - Evaluación no encontrada"
**Solución**:
```bash
# Verifica que el backend está corriendo
curl http://localhost:8000/api/v1/evaluations/

# Revisa los endpoints en constants.js
# Verifica que VITE_API_URL es correcto
```

### Problema: "Sin permisos"
**Solución**:
```bash
# Verifica el token
localStorage.getItem('kallpa_auth_token')

# Intenta login nuevamente
# Revisa que el usuario existe en el backend
```

### Problema: "Fechas incorrectas"
**Solución**:
```javascript
// Verifica que estés usando formato ISO
// YYYY-MM-DDTHH:mm:ss.000Z

// En dateUtils.js
import { formatDate } from '@/shared/utils/dateUtils';
console.log(formatDate(isoDate));
```

### Problema: "Tests no aparecen"
**Solución**:
```javascript
// Verifica que el backend devuelve tests en GET /evaluations/{id}
// En Network tab, busca la petición GET
// Verifica la respuesta JSON

// Si no aparecen, el endpoint del backend
// no está devolviendo los tests asociados
```

### Problema: "Toast no se muestra"
**Solución**:
```javascript
// Verifica que sonner esté importado en App.jsx
// y que <Toaster /> esté en el render
import { Toaster } from 'sonner';

// En el JSX:
<Toaster position="top-right" />
```

## ✨ Mejoras Frecuentes

### Agregar un nuevo campo a Evaluación

1. **Backend** (pyproject):
   - Agregar a modelo
   - Agregar a schema
   - Migración DB

2. **Frontend** (ya listo):
   ```jsx
   // En EvaluationForm.jsx
   <input {...register('new_field')} />
   ```

### Agregar un nuevo tipo de Test

1. **Crear componente**:
   ```jsx
   // src/features/seguimiento/components/tests/NewTestForm.jsx
   const NewTestForm = ({ evaluationId, mutation, onSuccess }) => {
     // Copiar estructura de SprintTestForm.jsx
   };
   ```

2. **Agregar hook**:
   ```javascript
   // En useEvaluations.js
   export const useCreateNewTest = () => { ... };
   ```

3. **Agregar servicio**:
   ```javascript
   // En evaluations.api.js
   createNewTest: async (testData) => {
     const response = await http.post('/new-tests', testData);
     return response.data;
   }
   ```

4. **Agregar en AddTestsForm**:
   ```jsx
   const testTypes = [
     ...existentes,
     {
       id: 'newtest',
       label: 'Nuevo Test',
       icon: '🆕',
     }
   ];
   ```

## 📊 Performance Tips

### Optimizar Paginación
```javascript
// Cambiar en EvaluationsList.jsx
const pageSize = 5; // Más pequeño para testing
const pageSize = 20; // Standard
const pageSize = 50; // Para desktop
```

### Desactivar Stale Time en Dev
```javascript
// En useEvaluations.js
staleTime: import.meta.env.DEV ? 0 : 5 * 60 * 1000,
```

### Ver Renders
```javascript
// Agregar en componentes
import { useEffect } from 'react';

useEffect(() => {
  console.log('Componente renderizado');
}, []);
```

## 🎯 Checklist Antes de Commit

- [ ] Tests manuales pasados
- [ ] Sin errores en consola
- [ ] Sin advertencias de eslint (npm run lint)
- [ ] Código formateado
- [ ] Comentarios agregados si necesario
- [ ] Variables console.log removidas
- [ ] Inputs validados
- [ ] Mensajes de error claros

## 📝 Agregar Logs Útiles

```javascript
// En API service
console.log('Petición:', API_ENDPOINTS.EVALUATIONS.CREATE);
console.log('Datos:', evaluationData);

// En componente
useEffect(() => {
  console.log('Evaluación:', evaluation);
}, [evaluation]);

// En hook
console.log('Mutación exitosa:', result);
```

## 🔄 Refrescar Cache Manualmente

```javascript
const queryClient = useQueryClient();

// Refrescar todo
queryClient.invalidateQueries();

// Refrescar específico
queryClient.invalidateQueries({ queryKey: ['evaluations'] });

// Forzar refetch
queryClient.refetchQueries({ queryKey: ['evaluation', id] });
```

## 📱 Testing en Móvil

```bash
# Obtener IP local
ipconfig getifaddr en0  # Mac
ipconfig              # Windows

# Acceder desde móvil
http://[tu-ip]:5173

# O usar device emulation en DevTools
```

## 🚀 Deploy Checklist

- [ ] Build sin errores: `npm run build`
- [ ] Lint pasado: `npm run lint`
- [ ] Variables de entorno configuradas
- [ ] VITE_API_URL apunta a API correcta
- [ ] Tests en producción validados
- [ ] No hay console.logs
- [ ] Imágenes optimizadas
- [ ] Rutas correctas

## 🤝 Contribuyendo

### Estructura de Ramas
```
main (producción)
  └── develop (desarrollo)
      └── feature/nombre (nuevas características)
          └── fix/nombre (correcciones)
```

### Commit Messages
```
feat: agregar componente nuevo
fix: corregir validación de fechas
docs: actualizar README
refactor: simplificar lógica
perf: optimizar queries
test: agregar tests
```

---

**Última actualización**: 29 de diciembre de 2024
