# Guía de Usuario: Bitácora de Tiempos y Conciliación con RingCentral

Esta guía te ayudará a ti y a tus empleados a utilizar el sistema interactivo de control de tiempos (`Registro_Tiempos_Conectr.html`). El objetivo de este sistema es dar visibilidad clara sobre las jornadas laborales, asegurar el cumplimiento de las **9.6 horas diarias (48 horas semanales)**, registrar pausas de manera honesta y conciliar la información de forma automatizada contra los reportes de RingCentral.

---

## 💻 Para los Empleados: ¿Cómo registrar mis tiempos?

La bitácora interactiva es un archivo HTML local. **No requiere instalación**. Para comenzar:
1. Haz doble clic sobre el archivo `Registro_Tiempos_Conectr.html` en tu computadora para abrirlo en cualquier navegador (Chrome, Safari, Edge, Firefox).
2. Tus registros se guardarán de forma automática en el navegador (`localStorage`), por lo que si cierras la pestaña por error, no perderás tus datos del día actual.

### Paso 1: Identificación y Límites de Jornada
* Selecciona tu nombre en la sección de **Identificación** (si tu administrador ya los personalizó, verás tu nombre real).
* Al iniciar tu día de trabajo, ve a la tarjeta **Límites de Jornada** y presiona el botón **"Ahora"** en *Hora de Entrada* (o escríbela manualmente).
* Al finalizar tu jornada, ve a la misma tarjeta y presiona **"Ahora"** en *Hora de Salida*.

### Paso 2: Registrar pausas en tiempo real (Cuando te levantas de la computadora)
Siempre que te separes del equipo (para comer, ir al baño, tomar un descanso, resolver un asunto personal o si sufres una falla de internet):
1. Selecciona el **Motivo** en la lista desplegable.
2. Añade una nota breve si lo deseas (ej. "Comiendo", "Atendiendo repartidor").
3. Presiona el botón **"Iniciar Pausa"**. Verás que el cronómetro en pantalla empieza a correr en color naranja.
4. **Al volver al equipo**, haz clic en el botón rojo **"Detener y Registrar"**. Tu pausa se guardará inmediatamente en la tabla inferior y el tiempo efectivo de trabajo neto se recalculará automáticamente.

### Paso 3: ¿Olvidaste activar el cronómetro? (Registro Manual)
Si olvidaste presionar el botón al levantarte:
1. Haz clic en la pestaña *"¿Olvidaste registrar una pausa en tiempo real? Agregar manualmente"*.
2. Elige el motivo, ingresa la *Hora de Inicio* y la *Hora de Fin* aproximadas.
3. Presiona **"Agregar Registro"**.

### Paso 4: Enviar el reporte a tu administrador
Al final del día o de la semana, tienes dos opciones en la sección **Registros de Tiempos del Día**:
* **Copiar Tabla**: Copia un resumen limpio en formato de texto directo al portapapeles. Ideal para pegarlo en un chat de WhatsApp o Slack para tu jefe.
* **Exportar CSV**: Descarga un archivo compatible con Excel o Google Sheets con el desglose exacto de tus tiempos. Envíaselo a tu administrador.

---

## 👔 Para el Administrador: ¿Cómo conciliar con RingCentral?

El módulo del administrador te permite auditar los tiempos declarados de tus empleados contra la actividad objetiva registrada en el sistema telefónico de RingCentral.

### Paso 1: Acceder al Panel e Iniciar Sesión
La vista de administrador está protegida por contraseña para evitar que los empleados modifiquen registros.
1. En la esquina superior derecha, haz clic en **Vista Administrador**.
2. Aparecerá un modal pidiendo la contraseña. Escribe la clave predeterminada: **`Pajarin1`** y presiona Enter o haz clic en **Desbloquear**.
3. **Nombres Fijos de los Empleados**: Los nombres de tus 3 empleados ya han sido preestablecidos y configurados como inmutables:
   - **Eleazar Aguilar**
   - **Ignacio Flores**
   - **Luis Flores**
   *(Ya no es necesario configurar nombres manualmente; están listos para conciliar con los registros de RingCentral).*
4. **Cerrar Sesión**: Cuando termines de auditar, haz clic en el botón **"Cerrar Sesión"** en la tarjeta superior izquierda del panel de administrador para bloquear la vista nuevamente.

### Paso 2: Descargar el reporte de RingCentral
Para obtener la información de disponibilidad de tus empleados de RingCentral:
1. Inicia sesión en tu **Portal de Administrador de RingCentral**.
2. Ve a **Analytics** (Analíticas) -> **Reports** (Reportes).
3. Busca el reporte de **User Status Log** (Log de Estados de Usuario) o **Presence Report** (Reporte de Presencia).
4. Filtra por la **Fecha** específica que deseas evaluar.
5. Exporta el reporte en formato **CSV**. El formato debe contener al menos las columnas: *Name* (Nombre), *Date* (Fecha), *Time* (Hora), *Status* (Estado) y *Duration* (Duración del estado).

### Paso 3: Ejecutar la conciliación
1. Abre la **Vista Administrador** en la herramienta de tiempos.
2. Copia todo el contenido del CSV descargado de RingCentral y pégalo en el cuadro de texto **"Datos de RingCentral (CSV)"**.
3. Selecciona el nombre del empleado que deseas auditar en el menú desplegable en la parte superior derecha de la sección.
4. Asegúrate de que la fecha seleccionada en el calendario global sea la misma que la del reporte.
5. Presiona el botón **"Conciliar y Buscar Discrepancias"**.

*Tip: Si deseas probar la herramienta inmediatamente para entender el formato de RingCentral, puedes seleccionar a un empleado y hacer clic en **"Cargar muestra de ejemplo"** para autocompletar el campo con un caso real de simulación.*

### Paso 4: Analizar Resultados y Discrepancias
* **Línea de Tiempo Comparativa**: El sistema dibujará dos barras horizontales. La barra superior muestra lo que declaró el empleado (Verde = Activo, Amarillo = Pausa). La barra inferior muestra lo registrado en RingCentral (Morado = Disponible/En llamada, Rojo = Desconectado/Offline, Amarillo = Away/Ausente).
* **Alertas Detectadas**: Abajo se generará una tabla con las discrepancias que superen los 5 minutos.
  * 🔴 **Alerta Roja (Desconexión Offline)**: Ocurre si el empleado declaró estar trabajando en su bitácora, pero RingCentral lo reporta como *Offline* (completamente desconectado de la red de RingCentral).
  * 🟡 **Alerta Amarilla (Ausencia Away)**: Ocurre si el empleado declara estar activo, pero RingCentral registra su estado como *Away* (Ausente) o *Lunch* (Almuerzo) sin que se haya registrado la pausa correspondiente en la bitácora.

### Paso 5: Generar Reportes de Asistencia e Imprimir PDF
El sistema cuenta con un generador de reportes corporativos donde puedes consultar un rango de fechas y generar un reporte limpio e imprimible:
1. En la **Vista Administrador**, busca la tarjeta **"Reportes PDF de Asistencia"** en el panel lateral izquierdo.
2. Ingresa la **Fecha de Inicio (Desde)** y la **Fecha de Fin (Hasta)** del período que deseas auditar.
3. En **Filtrar Empleado**, selecciona uno en específico (ej. *Eleazar Aguilar*) o elige **"Todos los Empleados"** para un consolidado completo del equipo.
4. Haz clic en **"Generar Reporte / Imprimir PDF"**.
5. **Acción del Navegador**: Se abrirá la interfaz de impresión nativa de tu computadora.
   * **Para guardar como PDF**: En el campo *Destino*, selecciona **"Guardar como PDF"** o **"Microsoft Print to PDF"**.
   * **Ajustes de página**: Se recomienda activar la opción *"Gráficos de fondo"* en los ajustes de impresión para que las celdas de color de la tabla de resumen (Verde de horas trabajadas y Naranja de pausas) se vean nítidas en el PDF.
   * Haz clic en **Guardar** o **Imprimir**. El reporte se ha formateado especialmente para hojas A4 con saltos de página inteligentes para que las tablas no se corten.

### Paso 6: Descarga consolidada mensual (CSV)
En la barra lateral izquierda, cuentas con el botón **"Exportar Bitácora Mensual Consolidada"**, el cual consolida en un solo archivo CSV todos los registros de todos los empleados guardados históricamente en tu navegador para que puedas archivarlos en Excel.

---

## ☁️ Configuración con Google Forms y Google Sheets (Método en la Nube Recomendado)

Si prefieres que tus empleados no tengan que guardar archivos locales o si quieres acumular en tiempo real y en una sola base de datos centralizada todos los registros del equipo, la mejor solución es utilizar **Google Forms**. 

Los empleados solo guardan el link de tu Google Form en sus teléfonos o barra de favoritos, lo abren, responden la acción en 5 segundos cada vez que se levantan, y todo se registra con marca de tiempo automática.

### Paso 1: Crear el Formulario en Google Forms
1. Ingresa a [Google Forms](https://forms.google.com) y crea un formulario en blanco.
2. Nómbralo **"Conect-r | Bitácora Diaria de Tiempos"**.
3. Añade las siguientes **3 preguntas obligatorias**:
   * **Pregunta 1: Selecciona tu Nombre** (Tipo: *Desplegable* o *Varias opciones*).
     * Opción 1: Escribe el nombre del Empleado 1
     * Opción 2: Escribe el nombre del Empleado 2
     * Opción 3: Escribe el nombre del Empleado 3
     *(Asegúrate de escribirlos exactamente igual que como aparecen en RingCentral)*.
   * **Pregunta 2: Acción que realizas** (Tipo: *Varias opciones*).
     * Opción 1: `Entrada Jornada` (Al empezar el día de trabajo)
     * Opción 2: `Inicio Pausa` (Al separarse de la computadora)
     * Opción 3: `Fin Pausa` (Al regresar a trabajar a la computadora)
     * Opción 4: `Salida Jornada` (Al finalizar el día de trabajo)
     *(Es vital usar exactamente estos términos o similares para que el software los reconozca)*.
   * **Pregunta 3: Motivo de la pausa** (Tipo: *Varias opciones* - Solo obligatoria si es pausa).
     * Opciones: `Comida`, `Descanso`, `Baño`, `Asunto Personal`, `Falla Técnica`, `Otro` o `N/A`.
   * **Pregunta 4: Notas (Opcional)** (Tipo: *Texto corto* o *Párrafo*).
     * Campo libre para comentarios extras.

### Paso 2: Vincular a Google Sheets
1. En la parte superior de tu formulario, ve a la pestaña de **"Respuestas"**.
2. Haz clic en el icono verde de **"Vincular con Hojas de cálculo"** (Google Sheets) para crear una hoja nueva.
3. Se abrirá un archivo de Google Sheets en tu Google Drive donde se irán guardando cronológicamente las marcas de tiempo, nombres de empleados y acciones realizadas.

### Paso 3: ¿Cómo conciliar en el Administrador usando el Google Sheets?
Cuando vayas a auditar a tus empleados:
1. Abre tu hoja de Google Sheets de respuestas.
2. Ve a **Archivo** -> **Descargar** -> **Valores separados por comas (.csv)** de la hoja actual.
3. Abre tu herramienta de tiempos [Registro_Tiempos_Conectr.html](file:///Users/getair10/Conect-r/Registro_Tiempos_Conectr.html) e ingresa a la **Vista Administrador**.
4. En **1. Origen de la Bitácora del Empleado**, selecciona **"Cargar CSV externo (Google Forms / Sheets)"**.
5. Se abrirá una nueva caja de texto llamada **"2. Pegar CSV de Bitácora"**. Pega allí el texto del CSV que acabas de descargar de tu Google Sheets (puedes abrir el archivo descargado con el Bloc de notas o TextEdit, copiar todo y pegarlo).
6. Pega en la caja 3 el reporte de RingCentral.
7. Presiona **"Conciliar"** y el sistema interpretará automáticamente las marcas temporales, reconstruirá la jornada de tu empleado y te mostrará la comparativa gráfica y las alertas.

---

## 🔔 Configuración de Alertas en Tiempo Real (Discord / Slack / Teams)

El sistema ahora cuenta con un módulo de **Alertas en Tiempo Real**. Cada vez que un empleado comience jornada (Entrada), termine jornada (Salida), inicie una pausa o regrese de ella, se enviará una notificación instantánea con emojis formateados a tu canal de Slack o Discord, permitiéndote recibir notificaciones push directamente en tu celular.

### Opción A: Configurar alertas en Discord (Recomendado por facilidad)
1. Abre tu servidor de Discord y ve a los **Ajustes del Canal** (icono de engranaje al lado del nombre del canal, ej: `#tiempos-conectr`).
2. Ve a la sección **Integraciones** y haz clic en **Webhooks**.
3. Haz clic en **"Crear Webhook"**. Asóciale un nombre (ej: "Conect-r Tiempos") y selecciona el canal correcto.
4. Haz clic en **"Copiar URL del Webhook"**.
5. Abre [Registro_Tiempos_Conectr.html](file:///Users/getair10/Conect-r/Registro_Tiempos_Conectr.html), ve a la **Vista Administrador**, busca la tarjeta **"Alertas en Tiempo Real"** a la izquierda, pega la URL en el campo de texto y haz clic fuera del cuadro para guardarlo.
6. Haz clic en **"Probar Alerta"** y verifica que te llegue un mensaje a Discord.

### Opción B: Configurar alertas en Slack
1. Ve a la consola de tus aplicaciones de Slack (`https://api.slack.com/apps`).
2. Crea una nueva aplicación llamada **"Conect-r Tiempos"** y conéctala a tu espacio de trabajo.
3. En el menú de la izquierda, activa la función **Incoming Webhooks** (Webhooks entrantes).
4. Haz clic en **Add New Webhook to Workspace**, selecciona el canal donde deseas las alertas y haz clic en **Permitir**.
5. Copia la **Webhook URL** generada.
6. Pega esta URL en el campo de **"Alertas en Tiempo Real"** en la **Vista Administrador** de tu app de tiempos.

---

## ⚡ Configuración de Base de Datos en Tiempo Real (Firebase Firestore)

Si deseas que los datos que ingresan los empleados se sincronicen de forma instantánea en la pantalla de administración del gerente en tiempo real, puedes configurar una base de datos en la nube gratuita con **Cloud Firestore** de Google. 

### Paso 1: Crear el proyecto en la consola de Firebase
1. Entra a [Firebase Console](https://console.firebase.google.com/) e inicia sesión con tu cuenta de Google.
2. Haz clic en **Crear un proyecto** (nómbralo `Conectr-Bitacora`). Desactiva Google Analytics para agilizar la creación.
3. En la barra lateral izquierda, navega a **Compilación (Build)** -> **Firestore Database**.
4. Presiona **Crear base de datos**.
5. Selecciona la ubicación geográfica (ej. `us-central` si estás en California) y presiona **Siguiente**.
6. Elige la opción **"Iniciar en modo de prueba"** (para desarrollo rápido y pruebas sin restricciones de inicio) y haz clic en **Crear**.

### Paso 2: Registrar la aplicación Web para obtener las llaves
1. Ve al panel de inicio de tu proyecto (haz clic en el icono de Engranaje -> **Configuración del proyecto**).
2. En la pestaña general, ve abajo a la sección "Tus aplicaciones" y haz clic en el icono de **Web (`</>`)**.
3. Registra tu aplicación con el nombre `Bitacora POS` y presiona **Registrar app**.
4. Firebase te mostrará un bloque de código que contiene las llaves. Copia únicamente los valores del objeto `firebaseConfig`:
   ```javascript
   const firebaseConfig = {
     apiKey: "TU_API_KEY",
     authDomain: "TU_PROJECT_ID.firebaseapp.com",
     projectId: "TU_PROJECT_ID",
     storageBucket: "TU_PROJECT_ID.appspot.com",
     messagingSenderId: "TU_MESSAGING_SENDER_ID",
     appId: "TU_APP_ID"
   };
   ```

### Paso 3: Pegar las llaves en tu código HTML
1. Abre tu archivo local [Registro_Tiempos_Conectr.html](file:///Users/getair10/Conect-r/Registro_Tiempos_Conectr.html).
2. Busca la sección que dice `const FIREBASE_CONFIG = { ... }` (aproximadamente en la línea **775**).
3. Pega los valores correspondientes dentro de cada campo del objeto:
   ```javascript
   const FIREBASE_CONFIG = {
       apiKey: "TU_API_KEY",
       authDomain: "TU_PROJECT_ID.firebaseapp.com",
       projectId: "TU_PROJECT_ID",
       storageBucket: "TU_PROJECT_ID.appspot.com",
       messagingSenderId: "TU_MESSAGING_SENDER_ID",
       appId: "TU_APP_ID"
   };
   ```
4. Guarda el archivo e implementa la nueva versión en Vercel (renombrando el archivo a `index.html` y arrastrando la carpeta al panel de Vercel).
5. **Resultado esperado**: Cada vez que un empleado marque una entrada, salida o descanso en su dispositivo, la base de datos se actualizará y la vista del administrador mostrará los cambios al instante, sin necesidad de recargar la página ni importar CSVs manualmente.

---

## 🚀 ¿Cómo compartir esta aplicación para que la usen todos los días?

Como es un archivo HTML autocontenido (con CSS y JS embebidos), no necesita instalación de base de datos ni servidores complejos. Puedes compartirla con las siguientes opciones:

### 1. Opción Rápida: Almacenamiento en la Nube (Google Drive / Dropbox)
1. Sube el archivo `Registro_Tiempos_Conectr.html` a una carpeta compartida en tu Google Drive o Dropbox.
2. Da permisos de lectura/descarga a tus empleados.
3. Ellos descargan el archivo en sus computadoras y crean un acceso directo en sus escritorios para abrirlo todos los días. 
*Nota: Los registros se guardan localmente en el navegador de cada computadora por lo que funciona individualmente.*

### 2. Opción Premium: Hosting Gratuito Estático (GitHub Pages / Vercel / Firebase)
Si quieres que todos accedan a una dirección web única desde cualquier navegador o teléfono sin descargar archivos:
* **Vercel (Gratis y toma 2 minutos)**:
  1. Ve a [Vercel](https://vercel.com) y regístrate de forma gratuita.
  2. Crea una carpeta vacía en tu computadora, mete dentro el archivo `Registro_Tiempos_Conectr.html` y cámbiale el nombre a `index.html` (vital para que el hosting lo tome como la página principal).
  3. Arrastra y suelta la carpeta en la sección de despliegue rápido de Vercel.
  4. Vercel te dará una URL pública gratuita y segura (ej: `https://conectr-tiempos.vercel.app`) para que se la compartas a tus empleados.
* **GitHub Pages (Gratis)**:
  1. Sube el archivo a un repositorio de GitHub como `index.html` y activa GitHub Pages en la configuración del repositorio para obtener una dirección web pública.
* **Firebase Hosting (Gratis)**:
  1. Si usas el ecosistema Firebase en Conect-r, puedes inicializar Firebase Hosting y desplegar el archivo en segundos usando la consola CLI.

---

## 🖥️ ¿Cómo dejar la página abierta o convertirla en una App?

Si quieres evitar que tus empleados tengan que buscar y abrir el enlace todos los días, la aplicación está diseñada para dejarse abierta permanentemente o instalarse como una app dedicada de escritorio:

### A. Dejar la página abierta 24/7 (Resiliencia al "Sleep" y Cambio de Día)
* **Resistente a la Suspensión**: Si la computadora se suspende por la noche, no hay problema. La aplicación mide la duración de las pausas comparando la hora de inicio con la hora actual real del sistema operativo, por lo que las suspensiones no detienen ni desfasan los tiempos.
* **Cambio de Día Automático**: La aplicación incluye un detector de cambio de fecha en tiempo real. Si la pestaña se queda abierta de un día para otro, en cuanto el empleado vuelva a enfocar la pestaña a la mañana siguiente, el calendario global **se actualizará de forma automática a la fecha de hoy**. Esto evita que los empleados registren tiempos por error en la fecha del día anterior.

### B. Instalar la página como una aplicación de escritorio dedicada
Cualquier navegador moderno basado en Chromium (como **Google Chrome** o **Microsoft Edge**) te permite convertir cualquier página web en una aplicación nativa instalada en tu computadora:

1. Abre el enlace web de tu bitácora en **Google Chrome** o **Microsoft Edge**.
2. En la esquina superior derecha, haz clic en los **Tres Puntos (Menú)**.
3. Selecciona **"Guardar y compartir"** y luego haz clic en **"Instalar página como aplicación..."** (en Edge dice *"Aplicaciones"* -> *"Instalar este sitio como una aplicación"*).
4. Elige el nombre (ej: "Bitácora Conect-r") y haz clic en **Instalar**.
5. **Resultado**: 
   * La bitácora se abrirá en una ventana propia, limpia, sin barra de direcciones ni pestañas de navegación (luciendo como una app nativa de Mac o Windows).
   * Se creará un **icono en el Dock (Mac) o en el Escritorio / Barra de herramientas (Windows)**.
   * Los empleados solo tendrán que hacer doble clic en el icono para abrirla al instante cada día.

