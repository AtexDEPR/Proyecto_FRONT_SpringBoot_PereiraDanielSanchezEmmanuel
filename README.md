# 🐟 Atunes del Pacífico S.A. - Frontend

## 📋 Descripción del Proyecto

**Atunes del Pacífico S.A.** es una aplicación web moderna desarrollada con React que permite gestionar las operaciones de una empresa productora y distribuidora de productos de atún. El frontend proporciona una interfaz intuitiva y responsiva para clientes, operadores y administradores.

### 🎯 Características Principales

- **Interfaz de Usuario Moderna**: Diseño responsivo con Tailwind CSS
- **Gestión de Productos**: Catálogo interactivo con filtros y búsqueda
- **Sistema de Pedidos**: Carrito de compras y seguimiento de pedidos
- **Dashboards Especializados**: Paneles para administradores y operadores
- **Autenticación Segura**: Login/registro con JWT
- **Experiencia Optimizada**: Animaciones fluidas con Framer Motion

---

## 👥 Equipo de Desarrollo

| Desarrollador | GitHub | Email |
|---------------|--------|-------|
| **Daniel Pereira** | [@AtexDEPR](https://github.com/AtexDEPR) | daniel.pereira@email.com |
| **Emmanuel Sánchez** | [@EmmanuelSan01](https://github.com/EmmanuelSan01) | emmanuel.sanchez@email.com |

---

## 🔗 Enlaces del Proyecto

### 📂 Repositorios
- **Frontend**: [https://github.com/AtexDEPR/Proyecto_FRONT_SpringBoot_PereiraDanielSanchezEmmanuel](https://github.com/AtexDEPR/Proyecto_FRONT_SpringBoot_PereiraDanielSanchezEmmanuel)
- **Backend**: [https://github.com/EmmanuelSan01/Proyecto_BACK_SpringBoot_PereiraDanielSanchezEmmanuel](https://github.com/EmmanuelSan01/Proyecto_BACK_SpringBoot_PereiraDanielSanchezEmmanuel)

### 🌐 URLs Desplegadas
- **Frontend**: [https://atunesdelpacifico.netlify.app/](https://atunesdelpacifico.netlify.app/)
- **Backend API**: [https://atunesdelpacifico.onrender.com/](https://atunesdelpacifico.onrender.com/)
- **Documentación API**: [https://atunesdelpacifico.onrender.com/swagger-ui/index.html](https://atunesdelpacifico.onrender.com/swagger-ui/index.html)

---

## 🛠️ Tecnologías Utilizadas

### Frontend Core
- **React 18** - Biblioteca de JavaScript para interfaces de usuario
- **Vite** - Herramienta de construcción rápida
- **React Router DOM** - Enrutamiento del lado del cliente

### Estilos y UI
- **Tailwind CSS** - Framework de CSS utilitario
- **Framer Motion** - Biblioteca de animaciones
- **Lucide React** - Iconos modernos

### Estado y Datos
- **Context API** - Gestión de estado global
- **Axios** - Cliente HTTP para API calls
- **React Hot Toast** - Notificaciones elegantes

### Herramientas de Desarrollo
- **ESLint** - Linter de JavaScript
- **PostCSS** - Procesador de CSS
- **Autoprefixer** - Prefijos CSS automáticos

---

## 🏗️ Arquitectura del Frontend

### 📁 Estructura de Carpetas

```
front/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── ErrorBoundary.jsx
│   │   ├── Footer.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Toast.jsx
│   │   └── UserRoleBadge.jsx
│   ├── contexts/          # Contextos de React
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── hooks/             # Hooks personalizados
│   │   └── useOrderStatusUpdater.js
│   ├── img/               # Imágenes del proyecto
│   │   ├── Logo.png
│   │   ├── AtunAceite.webp
│   │   ├── AtunAgua.webp
│   │   └── AtunSalsa.webp
│   ├── pages/             # Páginas principales
│   │   ├── AdminDashboard.jsx
│   │   ├── Cart.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── OperatorDashboard.jsx
│   │   ├── OrderHistory.jsx
│   │   ├── ProductDetail.jsx
│   │   └── Register.jsx
│   ├── services/          # Servicios API
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── clienteService.js
│   │   ├── loteService.js
│   │   ├── orderService.js
│   │   ├── productService.js
│   │   ├── reportService.js
│   │   └── userService.js
│   ├── App.jsx            # Componente principal
│   ├── main.jsx           # Punto de entrada
│   └── index.css          # Estilos globales
├── index.html             # Template HTML
├── package.json           # Dependencias
├── tailwind.config.js     # Configuración Tailwind
├── vite.config.js         # Configuración Vite
└── README.md              # Documentación
```

### 🔄 Flujo de Datos

1. **Autenticación**: Context API maneja el estado del usuario
2. **API Calls**: Axios interceptors para manejo de tokens
3. **Estado Local**: useState y useEffect para componentes
4. **Navegación**: React Router para SPA routing
5. **Notificaciones**: React Hot Toast para feedback

---

## 🚀 Instalación y Configuración

### 📋 Prerrequisitos

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0 o **yarn** >= 1.22.0
- **Git** para clonar el repositorio

### 🔧 Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/AtexDEPR/Proyecto_FRONT_SpringBoot_PereiraDanielSanchezEmmanuel.git
cd Proyecto_FRONT_SpringBoot_PereiraDanielSanchezEmmanuel/front
```

2. **Instalar dependencias**
```bash
npm install
# o
yarn install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env en la raíz del proyecto front/
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=Atunes del Pacífico
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
# o
yarn dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

### 🏗️ Build para Producción

```bash
# Construir la aplicación
npm run build

# Previsualizar build local
npm run preview
```

---

## 👤 Roles y Funcionalidades

### 🛒 Cliente
- **Registro/Login**: Crear cuenta y autenticarse
- **Catálogo**: Ver productos con filtros por tipo
- **Carrito**: Agregar/quitar productos
- **Pedidos**: Realizar y seguir pedidos
- **Historial**: Ver pedidos anteriores

### 👨‍💼 Operador
- **Dashboard**: Panel de control operativo
- **Inventario**: Gestión de lotes y stock
- **Pedidos**: Supervisar y actualizar estados
- **Producción**: Registrar nuevos lotes

### 👨‍💻 Administrador
- **Dashboard Completo**: Métricas y estadísticas
- **Gestión de Usuarios**: CRUD de usuarios
- **Gestión de Clientes**: CRUD de clientes
- **Reportes**: Generar reportes de ventas
- **Configuración**: Ajustes del sistema

---

## 🔐 Autenticación y Seguridad

### 🛡️ Implementación de Seguridad

```javascript
// Interceptor de Axios para JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer \${token}`;
  }
  return config;
});
```

### 🔒 Rutas Protegidas

```jsx
<ProtectedRoute requiredRole="ADMINISTRADOR">
  <AdminDashboard />
</ProtectedRoute>
```

### 🎫 Manejo de Tokens

- **Almacenamiento**: localStorage para persistencia
- **Expiración**: Manejo automático de tokens expirados
- **Refresh**: Redirección automática al login

---

## 🎨 Diseño y UX

### 🎭 Temas y Colores

```javascript
// Configuración Tailwind
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  }
}
```

### ✨ Animaciones

- **Framer Motion**: Transiciones suaves entre páginas
- **Loading States**: Spinners y skeletons
- **Micro-interactions**: Hover effects y feedback visual

### 📱 Responsividad

- **Mobile First**: Diseño adaptativo
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Touch Friendly**: Botones y elementos táctiles

---

## 🌐 Integración con Backend

### 📡 Servicios API

```javascript
// Ejemplo de servicio
export const productService = {
  getAllProducts: () => api.get('/productos'),
  getProductById: (id) => api.get(`/productos/\${id}`),
  createProduct: (data) => api.post('/productos', data),
  updateProduct: (id, data) => api.put(`/productos/\${id}`, data),
  deleteProduct: (id) => api.delete(`/productos/\${id}`)
};
```

### 🔄 Estados de Carga

- **Loading**: Indicadores de carga
- **Error**: Manejo de errores con retry
- **Success**: Confirmaciones y feedback
- **Empty**: Estados vacíos informativos

---

## 📊 Funcionalidades Principales

### 🏠 Página Principal
- Hero section con branding
- Catálogo de productos
- Filtros por tipo de conservante
- Búsqueda en tiempo real

### 🛒 Sistema de Carrito
- Agregar/quitar productos
- Cálculo automático de totales
- Persistencia en localStorage
- Checkout simplificado

### 📈 Dashboards
- **Admin**: Métricas generales, gestión completa
- **Operador**: Control de inventario y pedidos
- **Gráficos**: Visualización de datos

### 📋 Gestión de Pedidos
- Estados: Pendiente, En Proceso, Enviado, Entregado
- Seguimiento en tiempo real
- Historial completo
- Detalles expandibles

---

## 🚀 Despliegue

### 🌐 Netlify (Producción)

La aplicación está desplegada en Netlify con las siguientes configuraciones:

```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 🔧 Variables de Entorno (Producción)

```
VITE_API_URL=https://atunesdelpacifico.onrender.com/api
VITE_APP_NAME=Atunes del Pacífico
```

### 📦 Proceso de Deploy

1. **Push a main**: Trigger automático
2. **Build**: Netlify ejecuta `npm run build`
3. **Deploy**: Publicación automática
4. **URL**: https://atunesdelpacifico.netlify.app/

---

## 🧪 Testing y Calidad

### 🔍 Herramientas de Calidad

- **ESLint**: Linting de código
- **Prettier**: Formateo automático
- **React DevTools**: Debugging
- **Lighthouse**: Auditorías de rendimiento

### 📊 Métricas de Rendimiento

- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 3s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 4s

---

## 🐛 Solución de Problemas

### ❗ Problemas Comunes

1. **Error de CORS**
   ```bash
   # Verificar configuración del backend
   # Asegurar que el frontend esté en la lista de orígenes permitidos
   ```

2. **Token Expirado**
   ```javascript
   // El sistema redirige automáticamente al login
   // Verificar que el backend esté funcionando
   ```

3. **Problemas de Build**
   ```bash
   # Limpiar cache y reinstalar
   rm -rf node_modules package-lock.json
   npm install
   ```

### 🔧 Debug Mode

```bash
# Ejecutar con logs detallados
npm run dev -- --debug
```

---

## 📚 Documentación Adicional

### 🔗 Enlaces Útiles

- **React Docs**: https://react.dev/
- **Vite Guide**: https://vitejs.dev/guide/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/

### 📖 Guías de Desarrollo

1. **Componentes**: Crear componentes reutilizables
2. **Contextos**: Gestión de estado global
3. **Servicios**: Integración con APIs
4. **Estilos**: Convenciones de Tailwind

---

## 🤝 Contribución

### 📝 Guía de Contribución

1. **Fork** el repositorio
2. **Crear** una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** los cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Crear** un Pull Request

### 📋 Estándares de Código

- **ESLint**: Seguir las reglas configuradas
- **Componentes**: PascalCase para nombres
- **Funciones**: camelCase para nombres
- **Constantes**: UPPER_SNAKE_CASE

---

## 📄 Licencia

Este proyecto es desarrollado como parte de un proyecto académico para **Atunes del Pacífico S.A.**

---

## 📞 Contacto y Soporte

### 👨‍💻 Desarrolladores

- **Daniel Pereira**: daniel.pereira@email.com
- **Emmanuel Sánchez**: emmanuel.sanchez@email.com

### 🐛 Reportar Issues

Para reportar bugs o solicitar nuevas funcionalidades, crear un issue en:
[GitHub Issues](https://github.com/AtexDEPR/Proyecto_FRONT_SpringBoot_PereiraDanielSanchezEmmanuel/issues)

---

## 🎉 Agradecimientos

Agradecemos a todos los que han contribuido al desarrollo de este proyecto y a la empresa **Atunes del Pacífico S.A.** por la oportunidad de crear esta solución.

---

*Desarrollado con ❤️ por Daniel Pereira y Emmanuel Sánchez*
```

