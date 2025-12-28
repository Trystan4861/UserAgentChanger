# CSS Architecture - User Agent Changer

## 📁 Estructura de Archivos

```
css/
├── theme.css              # Variables CSS globales (colores, espaciado, tipografía)
├── commons.css            # Estilos compartidos entre popup y options
├── popup.css              # Estilos específicos del popup
├── options.css            # Estilos principales de options (importa módulos)
└── options/               # Módulos de la página de opciones
    ├── layout.css         # Layout, container, navegación
    ├── header.css         # Header, título, selector de idioma
    ├── forms.css          # Formularios, inputs, secciones
    ├── cards.css          # User agent cards y spoof cards
    ├── import-export.css  # Funcionalidad de importar/exportar
    └── about.css          # Sección About, autor, soporte
```

## 🎨 Sistema de Diseño

### Variables CSS (theme.css)

El archivo `theme.css` contiene todas las variables CSS que definen el sistema de diseño:

#### Colores
- **Primarios**: `--color-primary`, `--color-primary-dark`, `--color-primary-hover`
- **Fondos**: `--color-bg-primary`, `--color-bg-secondary`, `--color-bg-tertiary`
- **Texto**: `--color-text-primary` hasta `--color-text-quaternary`
- **Estados**: `--color-success`, `--color-warning`, `--color-danger`
- **Bordes**: `--color-border-primary`, `--color-border-secondary`, `--color-border-tertiary`

#### Espaciado
Sistema basado en múltiplos de 4px:
- `--spacing-xs` (4px)
- `--spacing-sm` (8px)
- `--spacing-md` (12px)
- `--spacing-lg` (16px)
- `--spacing-xl` (20px)
- `--spacing-2xl` (24px)
- `--spacing-3xl` (32px)

#### Tipografía
- **Familias**: `--font-family-base`, `--font-family-mono`
- **Tamaños**: De `--font-size-2xs` (10px) hasta `--font-size-8xl` (64px)
- **Pesos**: `--font-weight-normal` (400), `--font-weight-medium` (500), etc.

#### Bordes y Sombras
- **Radios**: De `--radius-sm` (4px) hasta `--radius-2xl` (24px)
- **Sombras**: `--shadow-sm`, `--shadow-md`, `--shadow-lg`

#### Transiciones
- `--transition-fast` (0.15s)
- `--transition-normal` (0.3s)

#### Dimensiones
- **Popup**: `--popup-min-width`, `--popup-max-width`
- **Container**: `--container-max-width`
- **Navegación**: `--nav-menu-width`

## 🏗️ Arquitectura Modular

### commons.css
Contiene estilos compartidos entre popup.html y options.html:
- Reset básico y estilos base
- Botones (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`)
- Badges (`.badge`, `.version-badge`, `.card-badge`)
- Estados vacíos (`.empty-state`)
- Scrollbars personalizados
- Animaciones comunes

### popup.css
Estilos específicos del popup (importa `commons.css`):
- Layout del popup
- Header del popup
- Lista de user agents
- Items de user agent especiales (DEFAULT, AUTO)
- Footer del popup

### options.css
Archivo principal que importa todos los módulos (importa `commons.css` y módulos):

#### options/layout.css
- Container y layout principal
- Sistema de grid de dos columnas
- Menú de navegación lateral
- Responsive design (mobile: menú horizontal)

#### options/header.css
- Header principal
- Título y subtítulo
- Selector de idioma
- Credits

#### options/forms.css
- Secciones (`.form-section`, `.list-section`)
- Form groups y labels
- Inputs, textareas, selects
- Color input personalizado
- Badge preview

#### options/cards.css
- User agent cards (`.user-agent-card`)
- Permanent spoof cards (`.spoof-card`)
- Card headers, titles, actions
- Información de las cards
- Estados vacíos

#### options/import-export.css
- Container de import/export
- Drag & drop de archivos
- Preview de importación
- Selección de items a importar
- Barra de acciones
- Sección de exportación

#### options/about.css
- Container de about
- About cards
- Author card con avatar
- Support card
- Danger zone

## 🎯 Metodología BEM

Todos los estilos siguen la metodología BEM (Block Element Modifier):

```css
/* Block */
.user-agent-card { }

/* Element */
.user-agent-card__header { }
.user-agent-card__title { }

/* Modifier */
.user-agent-card--default { }
.user-agent-card--active { }
```

### Ejemplos de uso:

```html
<!-- User Agent Card -->
<div class="user-agent-card user-agent-card--default">
  <div class="card-header">
    <div class="card-title">
      <h3>Chrome Desktop</h3>
      <span class="card-badge">WIN</span>
    </div>
    <div class="card-actions">
      <button class="btn btn-edit">Edit</button>
      <button class="btn btn-danger">Delete</button>
    </div>
  </div>
  <div class="card-info">
    <div class="info-row">
      <span class="info-label">Platform:</span>
      <span class="info-value">Windows</span>
    </div>
  </div>
</div>

<!-- Button Examples -->
<button class="btn btn-primary">Save</button>
<button class="btn btn-secondary">Cancel</button>
<button class="btn btn-danger">Delete</button>

<!-- Badge Examples -->
<span class="badge">NEW</span>
<span class="version-badge">v1.0.0</span>
<span class="card-badge">WIN</span>
```

## 🎨 Creación de Temas

Para crear un nuevo tema, modifica las variables en `theme.css`:

```css
:root {
  /* Cambiar colores primarios */
  --color-primary: #your-color;
  --color-primary-dark: #your-dark-color;
  
  /* Cambiar fondos */
  --color-bg-primary: #your-bg;
  
  /* etc. */
}
```

### Tema Oscuro (Futuro)
Para implementar un tema oscuro, crea un media query o clase:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #1a1a1a;
    --color-text-primary: #ffffff;
    /* ... más variables ... */
  }
}
```

## 📱 Responsive Design

El diseño es completamente responsive:

### Breakpoints
- **Desktop**: > 1024px (layout de dos columnas con menú lateral)
- **Tablet**: ≤ 1024px (layout de una columna, menú horizontal)
- **Mobile**: ≤ 768px (optimizaciones adicionales)

### Características Responsive
- Grid de contenido adapta de 2 a 1 columna
- Menú de navegación cambia de vertical a horizontal
- Import selection grid se ajusta automáticamente
- Formularios en una sola columna en mobile

## 🔧 Mantenimiento

### Añadir nuevos estilos
1. Determina si el estilo es compartido (commons.css) o específico
2. Si es específico de options, añádelo al módulo correspondiente
3. Usa las variables CSS del theme.css
4. Sigue la metodología BEM para nombres de clases

### Modificar colores o espaciado
1. Edita las variables en `theme.css`
2. Los cambios se aplicarán automáticamente en toda la aplicación

### Debugging
1. Usa las DevTools del navegador
2. Inspecciona los elementos para ver qué clases y variables se aplican
3. Verifica que los @import están cargando correctamente

## 📚 Referencias

- [BEM Methodology](http://getbem.com/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [CSS @import](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)

---

**Última actualización**: Diciembre 2024  
**Versión**: 2.0 - Arquitectura Modular
