# Dashboard de ActivaChain

## Descripción

El Dashboard de ActivaChain es una sección personalizada y privada que solo es accesible cuando el usuario tiene su wallet conectado. Ofrece una experiencia visual impresionante con efectos neurales y glassmorphism, proporcionando un centro de control completo para los usuarios.

## Características Principales

### 🔐 Acceso Restringido
- Solo accesible con wallet conectado
- Redirección automática al inicio si no hay conexión
- Verificación de estado de conexión en tiempo real

### 🎨 Diseño Neural y Glassmorphism
- Efectos de partículas neurales animadas
- Efectos de glassmorphism con transparencias
- Animaciones suaves y transiciones fluidas
- Efectos de glow y pulsos neurales
- Colores degradados dinámicos

### 📊 Secciones del Dashboard

#### 1. Perfil Principal
- Información del usuario con avatar animado
- Estadísticas principales (ganancias, servicios, cursos)
- Nivel de reputación y progreso
- Efectos de hover y animaciones

#### 2. Estadísticas en Tiempo Real
- Reputación del usuario
- Ganancias totales
- Servicios completados
- Cursos completados
- Barras de progreso animadas
- Indicadores de tendencia

#### 3. Navegación por Tabs
- **Perfil**: Información personal y estadísticas detalladas
- **Servicios**: Lista de servicios comprados con estado
- **Cursos**: Progreso de cursos con lecciones completadas
- **Actividad**: Historial de actividades recientes

### 🎯 Funcionalidades por Sección

#### Perfil
- Dirección del wallet (truncada)
- Nivel actual del usuario
- Puntos de reputación
- Fecha de registro
- Barras de progreso animadas

#### Servicios
- Lista de servicios comprados
- Estado de cada servicio (Completado, En Progreso, Pendiente)
- Información del proveedor
- Precio y fecha de compra
- Barras de progreso por servicio

#### Cursos
- Progreso de cursos activos
- Lecciones completadas vs total
- Próxima lección a realizar
- Porcentaje de completado
- Efectos visuales de progreso

#### Actividad
- Historial de actividades recientes
- Tipos de actividad (curso completado, servicio comprado, reputación ganada)
- Fechas relativas
- Iconos animados

## Componentes Técnicos

### DashboardNeuralEffects
- Canvas con partículas neurales animadas
- Conexiones dinámicas entre partículas
- Efectos de ondas de energía
- Partículas de energía orbitales
- Optimización de rendimiento

### DashboardStats
- Estadísticas animadas en tiempo real
- Barras de progreso con efectos de flujo
- Indicadores de tendencia
- Animaciones de hover
- Cálculos dinámicos de progreso

### Efectos CSS Personalizados
- `animate-dashboard-glow`: Efectos de brillo neural
- `animate-dashboard-pulse`: Pulsos de energía
- `animate-dashboard-float`: Flotación suave
- `animate-progress-flow`: Flujo de progreso
- `animate-tab-glow`: Brillo de tabs activos

## Estilos y Animaciones

### Colores Principales
- **Cyan**: `#06B6D4` - Efectos principales
- **Purple**: `#9333EA` - Acentos y gradientes
- **Pink**: `#EC4899` - Detalles y highlights
- **Green**: `#10B981` - Estados positivos
- **Yellow**: `#F59E0B` - Advertencias y reputación

### Efectos de Glassmorphism
- Transparencias con `backdrop-blur-xl`
- Bordes sutiles con `border-white/20`
- Sombras dinámicas
- Efectos de hover con cambios de opacidad

### Animaciones
- Transiciones suaves de 300-1000ms
- Delays escalonados para efectos en cascada
- Efectos de pulsación y flotación
- Animaciones de progreso fluidas

## Responsive Design

- **Mobile**: Layout de una columna
- **Tablet**: Layout de dos columnas
- **Desktop**: Layout completo con múltiples columnas
- Navegación adaptativa
- Tabs responsivas

## Accesibilidad

- Navegación con teclado
- Labels descriptivos
- Contraste adecuado
- Estados de hover claros
- Feedback visual para interacciones

## Integración con Web3

- Verificación de conexión de wallet
- Mostrar dirección del wallet
- Estado de conexión en tiempo real
- Redirección automática si se desconecta

## Performance

- Animaciones optimizadas con `requestAnimationFrame`
- Efectos de canvas eficientes
- Lazy loading de componentes
- Memoización de cálculos pesados
- Cleanup de event listeners

## Futuras Mejoras

- [ ] Integración con contratos inteligentes reales
- [ ] Notificaciones en tiempo real
- [ ] Gráficos de progreso más detallados
- [ ] Sistema de logros y badges
- [ ] Exportación de datos
- [ ] Temas personalizables
- [ ] Modo oscuro/claro
- [ ] Accesibilidad mejorada
- [ ] PWA offline support
- [ ] Analytics de uso

## Estructura de Archivos

```
frontend/app/dashboard/
├── page.tsx                    # Página principal del dashboard
└── components/
    ├── DashboardNeuralEffects.tsx  # Efectos neurales avanzados
    └── DashboardStats.tsx          # Componente de estadísticas
```

## Uso

1. Conectar wallet en la aplicación
2. Navegar a `/dashboard` desde el header
3. Explorar las diferentes secciones usando las tabs
4. Ver estadísticas en tiempo real
5. Monitorear progreso de cursos y servicios

El Dashboard proporciona una experiencia inmersiva y funcional que empodera a los usuarios de ActivaChain con información completa sobre su progreso y actividades en la plataforma.
