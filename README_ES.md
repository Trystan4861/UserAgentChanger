# User-Agent Changer - Extensión para Chrome

Una extensión profesional para Chrome que permite cambiar rápida y fácilmente la cadena User-Agent del navegador. Perfecta para desarrolladores web, testers y usuarios que necesitan emular diferentes navegadores y dispositivos.

**[English README](README.md)** | **[Historial de Cambios](CHANGELOG.md)** | **[Licencia](LICENSE_ES.md)**

## 🌟 Características Principales

### 🎯 Cambio Rápido de User-Agent
- **Interfaz popup intuitiva**: Cambio rápido de User-Agent con un solo clic
- **Modos global y por pestaña**: 
  - **DEFAULT**: Usa el User-Agent original del navegador
  - **AUTO**: Detecta y usa automáticamente el mejor User-Agent para cada sitio
  - **User-Agents personalizados**: Aplica User-Agents específicos por pestaña
- **Sistema de badge visual**: Muestra el alias del User-Agent activo en el icono de la extensión
  - Sin badge cuando DEFAULT está activo
  - Badge personalizado para cada User-Agent

### 🔧 Interfaz de Gestión Completa
Página de opciones con múltiples secciones:

#### 1. **User-Agents Personalizados**
- Añade User-Agents personalizados ilimitados
- Dos modos de operación:
  - **Reemplazar**: Sustituye completamente el User-Agent del navegador
  - **Agregar**: Añade texto al User-Agent actual
- Badge personalizable con:
  - Alias (máximo 4 caracteres)
- Edita y elimina User-Agents personalizados
- User-Agents preconfigurados incluidos (iPhone 14, Android)

#### 2. **Lista de Spoofs Permanentes**
- Configura User-Agents específicos para dominios particulares
- Soporta comodines: `*.example.com`, `localhost/core/*`
- Aplicación automática sin intervención manual
- Gestiona fácilmente tu lista de spoofs permanentes

#### 3. **Importar/Exportar Configuración**
- **Exportar**: Guarda toda tu configuración en un archivo JSON
  - User-Agents personalizados
  - Lista de Spoofs Permanentes
  - Configuración de la extensión
  - Nombres de archivo con marca temporal
- **Importar**: Restaura configuración desde un archivo JSON
  - Soporte de arrastrar y soltar
  - Vista previa antes de importar
  - Combinar o reemplazar configuración existente

#### 4. **Acerca de y Configuración**
- Selector de tema (Auto, Claro, Oscuro)
- Selector de idioma (Inglés, Español)
- Información y versión de la extensión
- Funcionalidad de reseteo
- Enlaces de soporte y contribución

### 🛡️ Protección de Páginas Especiales de Chrome
- La extensión se deshabilita automáticamente en páginas especiales de Chrome
- Previene la modificación de páginas protegidas como:
  - `chrome://` (páginas internas de Chrome)
  - `chrome-extension://` (páginas de extensiones)
  - `edge://` (páginas internas de Edge)
  - `about:` (páginas about)
  - `view-source:` (vista de código fuente)
- Retroalimentación visual clara con:
  - Badge gris con símbolo ✕
  - Mensaje de deshabilitado en el popup
  - Explicación de seguridad

### 🌍 Soporte Multi-idioma
- **Inglés** (en)
- **Español** (es)
- Fácil de añadir más idiomas mediante archivos JSON de locale

### 🎨 Soporte de Temas
- **Auto**: Sigue la preferencia del sistema
- **Claro**: Tema claro
- **Oscuro**: Tema oscuro
- Estilo consistente en todas las interfaces

## 📦 Instalación

1. Descarga o clona este repositorio
2. Abre Google Chrome y navega a `chrome://extensions/`
3. Activa el **Modo de desarrollador** (interruptor en la esquina superior derecha)
4. Haz clic en **Cargar extensión sin empaquetar**
5. Selecciona la carpeta del proyecto `UserAgentChanger`
6. ¡Listo! El icono de la extensión aparecerá en tu barra de herramientas

## 🚀 Uso

### Cambio Rápido de User-Agent:
1. Haz clic en el icono de la extensión en la barra de herramientas
2. Selecciona una de las opciones:
   - **DEFAULT**: Usa el User-Agent original del navegador (configuración global)
   - **AUTO**: Detección automática de User-Agent (configuración global)
   - **User-Agent personalizado**: Aplica un User-Agent específico a la pestaña actual
3. El badge mostrará el alias del User-Agent activo
4. Los cambios se aplican inmediatamente

### Gestionar User-Agents:
1. Haz clic en el icono de la extensión
2. Haz clic en el botón **"⚙️ Gestionar User-Agents"**
3. Se abrirá una nueva pestaña con la interfaz completa de gestión

#### Añadir User-Agent Personalizado:
1. Ve a la sección **"Custom User-Agents"**
2. Completa el formulario:
   - **Nombre**: Nombre descriptivo (ej., "iPhone 14 Pro")
   - **Alias**: Identificador corto para el badge (máximo 4 caracteres)
   - **Modo**: Elige "Reemplazar" o "Agregar"
   - **User-Agent String**: Cadena completa del User-Agent
3. Haz clic en **"Agregar User-Agent"**

#### Configurar Spoofs Permanentes:
1. Ve a la sección **"Permanent Spoof List"**
2. Introduce el patrón del dominio (ej., `*.google.com`, `localhost/*`)
3. Selecciona el User-Agent a aplicar
4. Haz clic en **"Add Permanent Spoof"**
5. El spoof se aplicará automáticamente a los dominios coincidentes

#### Importar/Exportar Configuración:
1. Ve a la sección **"Import/Export Settings"**
2. **Para Exportar**:
   - Haz clic en **"Click Here To Download"**
   - Guarda el archivo JSON con tu configuración
3. **Para Importar**:
   - Selecciona un archivo JSON o arrástralo y suéltalo
   - Previsualiza la configuración antes de importar
   - Elige combinar o reemplazar la configuración existente
   - Confirma la importación

## 📁 Estructura del Proyecto

```
UserAgentChanger/
├── manifest.json                    # Configuración de la extensión
├── popup.html                       # HTML del popup
├── options.html                     # HTML de la página de opciones
├── generate_icons.html              # Utilidad generadora de iconos
├── README.md                        # README en inglés
├── README_ES.md                     # Este archivo (Español)
├── CHANGELOG.md                     # Historial de versiones
├── LICENSE                          # Licencia MIT (Inglés)
├── LICENSE_ES.md                    # Licencia MIT (Español)
├── _locales/                        # Internacionalización
│   ├── en/
│   │   └── messages.json           # Traducciones al inglés
│   └── es/
│       └── messages.json           # Traducciones al español
├── css/                            # Hojas de estilo
│   ├── commons.css                 # Estilos comunes
│   ├── popup.css                   # Estilos del popup
│   ├── theme.css                   # Variables de tema
│   └── options/                    # Estilos de la página de opciones
│       ├── about.css
│       ├── cards.css
│       ├── forms.css
│       ├── header.css
│       ├── import-export.css
│       └── layout.css
├── icons/                          # Iconos de la extensión
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   ├── icon128.png
│   ├── icon256.png
│   └── logo.png
└── js/                             # Archivos JavaScript
    ├── background.js               # Service worker principal
    ├── background-badge.js         # Gestión del badge
    ├── background-listeners.js     # Listeners de eventos
    ├── background-permanentSpoofs.js # Lógica de spoofs permanentes
    ├── background-userAgent.js     # Aplicación del User-Agent
    ├── popup.js                    # Lógica del popup
    ├── options.js                  # Lógica de la página de opciones
    ├── i18n.js                     # Internacionalización
    ├── messaging.js                # Comunicación entre componentes
    ├── notify.js                   # Sistema de notificaciones
    ├── storage.js                  # Utilidades de almacenamiento
    ├── ua.js                       # Utilidades de User-Agent
    ├── utils.js                    # Utilidades generales
    ├── validations.js              # Validaciones de entrada
    └── version.js                  # Gestión de versiones
```

## 🔧 Tecnologías Utilizadas

- **Manifest V3**: Sistema más reciente de extensiones de Chrome
- **declarativeNetRequest API**: Para modificar cabeceras de peticiones HTTP
- **Chrome Storage API**: Para persistir configuraciones
- **Chrome Badge API**: Para mostrar indicadores en el icono
- **Chrome Tabs API**: Para gestión de User-Agent por pestaña
- **HTML5/CSS3/JavaScript**: Interfaz moderna y responsive
- **CSS Custom Properties**: Tematización dinámica
- **Internationalization API**: Soporte multi-idioma

## ⚙️ Permisos Necesarios

Esta extensión requiere los siguientes permisos para funcionar correctamente:

### Permisos de la API de Chrome:

- **`declarativeNetRequest`**
  - **Propósito**: Permite a la extensión modificar las cabeceras de peticiones HTTP
  - **Por qué es necesario**: Esencial para cambiar la cabecera User-Agent en las peticiones web. Esta API permite a la extensión interceptar y modificar la cadena User-Agent antes de que las peticiones se envíen a los servidores.

- **`declarativeNetRequestWithHostAccess`**
  - **Propósito**: Extiende las capacidades de declarativeNetRequest para trabajar con permisos de host
  - **Por qué es necesario**: Requerido para aplicar modificaciones de User-Agent en todos los sitios web. Funciona en conjunto con `<all_urls>` para asegurar que la extensión pueda modificar cabeceras en cualquier dominio.

- **`storage`**
  - **Propósito**: Proporciona acceso a la API de almacenamiento de Chrome
  - **Por qué es necesario**: Almacena todas las configuraciones de la extensión localmente, incluyendo:
    - Definiciones de User-Agents personalizados
    - Lista de spoofs permanentes
    - Preferencias del usuario (tema, idioma)
    - Colores y configuración del badge
    - Estado del User-Agent activo por pestaña

- **`tabs`**
  - **Propósito**: Permite la interacción con las pestañas del navegador
  - **Por qué es necesario**: Requerido para:
    - Detectar cuando las pestañas se crean, actualizan o eliminan
    - Gestionar configuraciones de User-Agent por pestaña
    - Actualizar el badge en el icono de la extensión para cada pestaña
    - Abrir la página de opciones en una nueva pestaña
    - Detectar páginas especiales de Chrome para deshabilitar la extensión

- **`scripting`**
  - **Propósito**: Proporciona acceso a la API de scripting de Chrome
  - **Por qué es necesario**: Habilita funcionalidad avanzada para:
    - Interacción dinámica con el contenido si es necesario
    - Mejoras de características futuras
    - Mejor compatibilidad con páginas web

### Permisos de Host:

- **`<all_urls>`**
  - **Propósito**: Otorga permiso para acceder y modificar peticiones en todos los sitios web
  - **Por qué es necesario**: Permite a la extensión aplicar cambios de User-Agent en todos los dominios. Sin este permiso, la extensión necesitaría solicitar permiso para cada sitio web individual, haciéndola impráctica de usar.
  - **Nota**: Este permiso es necesario para la funcionalidad principal pero la extensión nunca lee el contenido de las páginas ni recopila datos de navegación.

### Notas de Seguridad:
- Todos los datos se almacenan localmente usando la API de almacenamiento de Chrome
- No se transmiten datos a servidores externos
- La extensión solo modifica las cabeceras User-Agent, no el contenido de las páginas
- La protección automática previene modificaciones en páginas especiales de Chrome (`chrome://`, `edge://`, etc.)

## 💡 Casos de Uso

1. **Desarrollo Web**: Prueba cómo se ve tu sitio en diferentes dispositivos
2. **Testing**: Verifica comportamiento específico por User-Agent
3. **Web Scraping**: Simula diferentes navegadores o dispositivos
4. **Privacidad**: Modifica tu huella digital del navegador
5. **Acceso a Contenido**: Algunos sitios muestran contenido diferente según el dispositivo
6. **Automatización**: Configura spoofs permanentes para entornos de desarrollo específicos
7. **Testing de APIs**: Prueba respuestas de APIs para diferentes User-Agents

## 🛡️ Privacidad y Seguridad

- Todos los datos se almacenan localmente en tu navegador
- No se envía información a servidores externos
- No se recopilan datos de navegación
- Código abierto y auditable
- Protección automática en páginas especiales de Chrome
- Respeta las restricciones de seguridad del navegador

## 📝 Notas Técnicas

- El User-Agent se aplica a todas las peticiones HTTP/HTTPS
- Los cambios son inmediatos sin necesidad de recargar pestañas
- El modo "Agregar" usa el User-Agent actual de Chrome como base
- El modo DEFAULT no muestra badge en el icono
- Los spoofs permanentes tienen precedencia sobre la configuración global
- La extensión se deshabilita en páginas especiales de Chrome por seguridad

## 🌐 Navegadores Compatibles

- Google Chrome (navegadores basados en Chromium)
- Microsoft Edge
- Brave
- Opera
- Cualquier navegador basado en Chromium que soporte Manifest V3

## 👨‍💻 Autor

**Trystan4861**
- GitHub: [@Trystan4861](https://github.com/Trystan4861)
- Repositorio: [UserAgentChanger](https://github.com/Trystan4861/UserAgentChanger)

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras un bug o tienes una sugerencia:

1. Abre un issue en el [repositorio de GitHub](https://github.com/Trystan4861/UserAgentChanger/issues)
2. Si quieres contribuir con código, haz un fork del repositorio y crea un pull request
3. Sigue el estilo de código y convenciones existentes
4. Añade tests apropiados para nuevas características
5. Actualiza la documentación según sea necesario

### Configuración de Desarrollo

1. Clona el repositorio
2. Realiza tus cambios
3. Prueba en Chrome cargando la extensión sin empaquetar
4. Envía un pull request con una descripción clara

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE_ES.md](LICENSE_ES.md) para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:
- Verifica que la extensión esté habilitada en `chrome://extensions/`
- Comprueba que tienes permisos suficientes
- Revisa la consola de errores de la extensión
- Consulta [issues cerrados](https://github.com/Trystan4861/UserAgentChanger/issues?q=is%3Aissue+is%3Aclosed) para problemas similares
- Abre un [nuevo issue](https://github.com/Trystan4861/UserAgentChanger/issues/new) si es necesario

## 🎯 Hoja de Ruta

Características futuras en consideración:
- Más User-Agents preconfigurados
- Plantillas de User-Agent
- Estadísticas y seguimiento de uso
- Sincronización en la nube (opcional)
- Mejoras en la detección de navegadores
- Soporte de idiomas adicionales
- Rotación personalizada de User-Agent
- Opciones de filtrado avanzadas

---

Desarrollado con ❤️ para facilitar el desarrollo y testing web.

**¡Dale ⭐ a este repositorio si te resulta útil!**
