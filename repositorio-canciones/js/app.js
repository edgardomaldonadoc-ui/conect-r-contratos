// Chromatic scales for chord transposition and translation
const scaleEN = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const scaleENFlats = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const scaleES = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];
const scaleESFlats = ['Do', 'Reb', 'Re', 'Mib', 'Mi', 'Fa', 'Solb', 'Sol', 'Lab', 'La', 'Sib', 'Si'];

const flatKeys = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm'];

// Global state variables
let songs = [];
let activeSongId = null;
let currentLanguage = 'es';
let currentTheme = 'dark';
let currentNotation = 'ENG'; // 'ENG' (C, D, Em) or 'ESP' (Do, Re, Mim)
let activeViewMode = 'both'; // 'both', 'chords', 'lyrics'
let transpositionOffset = 0;
let isScrolling = false;
let fontScale = 1.0; // font size multiplier

// UI Translations Dictionary
const TRANSLATIONS = {
  es: {
    "brand-title": "Harmonía",
    "search-placeholder": "Buscar canciones, artistas...",
    "all-genres": "Todos los géneros",
    "all-keys": "Todos los tonos",
    "new-song": "Nueva Canción",
    "ai-import": "Importar con IA",
    "backup": "Respaldo",
    "settings": "Ajustes",
    "select-song": "Selecciona una canción",
    "welcome-sub": "Bienvenido a tu repertorio personal",
    "ctrl-key": "Tono",
    "ctrl-notation": "Acordes",
    "ctrl-view": "Ver",
    "ctrl-font": "Tamaño",
    "ctrl-scroll": "Auto-scroll",
    "empty-title": "Tu repertorio está listo",
    "empty-desc": "Selecciona una canción en la barra lateral para ver sus acordes, transpón tonos en vivo, usa el auto-scroll manos libres o crea tus propias canciones usando Inteligencia Artificial.",
    "settings-modal-title": "Configuración de Gemini IA",
    "settings-desc": "Para importar canciones automáticamente desde cualquier sitio web usando Inteligencia Artificial, necesitas ingresar una Gemini API Key de Google. La clave se almacena de forma totalmente local en tu navegador y las peticiones van directamente a Google.",
    "settings-get-key": "Obtener una Gemini API Key gratis aquí",
    "settings-key-label": "Gemini API Key",
    "settings-key-note": "Tu clave API está guardada solo en tu navegador a nivel local.",
    "btn-cancel": "Cancelar",
    "btn-save": "Guardar",
    "btn-close": "Cerrar",
    "ai-modal-title": "Importar Canción con IA",
    "ai-key-warning": "Necesitas configurar una clave API de Gemini antes de usar la importación con IA.",
    "ai-config-now": "Configurar ahora",
    "ai-status-processing": "Procesando y formateando canción con Gemini...",
    "ai-instructions": "Entra a cualquier sitio web de canciones (como LaCuerda, Ultimate Guitar, etc.), selecciona todo el texto de la página (Ctrl+A / Cmd+A) y cópialo. Pégalo aquí abajo. La Inteligencia Artificial limpiará los anuncios, menús, comentarios e instrucciones, dejando únicamente la canción estructurada y con acordes bien alineados.",
    "ai-url-label": "Enlace de Origen (Opcional)",
    "ai-content-label": "Contenido Copiado de la Web (Letras, Acordes, Publicidad...)",
    "ai-btn-process": "Procesar con IA",
    "editor-title-new": "Nueva Canción",
    "editor-title-edit": "Editar Canción",
    "editor-song-title": "Título de la Canción",
    "editor-song-artist": "Artista / Banda",
    "editor-song-genre": "Género",
    "editor-song-key": "Tono Original",
    "editor-song-bpm": "BPM (Tempo)",
    "editor-song-content": "Letra y Acordes (Formato ChordPro)",
    "editor-helper-text": "Inserta acordes en la posición del cursor:",
    "editor-chordpro-note": "Usa corchetes como [C] o [G#m] antes de la sílaba correspondiente para alinear los acordes.",
    "backup-modal-title": "Respaldar Repertorio",
    "backup-export-title": "Exportar Repertorio",
    "backup-export-desc": "Descarga todas tus canciones guardadas en un único archivo de respaldo JSON para guardarlo en tu computadora o compartirlo con otros dispositivos.",
    "backup-export-btn": "Exportar a JSON",
    "backup-import-title": "Importar Repertorio",
    "backup-import-desc": "Carga un archivo de respaldo JSON generado previamente para restaurar o combinar tus canciones en este dispositivo.",
    "backup-import-btn": "Seleccionar Archivo JSON",
    
    // Hover titles
    "backup-title": "Copias de Seguridad",
    "settings-title": "Configuración de IA",
    "lang-toggle-title": "Cambiar idioma de la interfaz",
    "theme-toggle-title": "Cambiar tema oscuro/claro",
    "transpose-down-title": "Bajar un semitono",
    "transpose-up-title": "Subir un semitono",
    "notation-title": "Cambiar sistema de cifrado (ENG/ESP)",
    "view-both-title": "Letra y Acordes",
    "view-chords-title": "Solo Acordes",
    "view-lyrics-title": "Solo Letra",
    "font-decrease-title": "Reducir letra",
    "font-increase-title": "Aumentar letra",
    "scroll-play-title": "Reproducir auto-scroll",
    "scroll-speed-title": "Velocidad de desplazamiento",
    "edit-title": "Editar canción",
    "print-title": "Imprimir acordes",
    "delete-title": "Eliminar canción",
    
    // Toast messages
    "toast-key-saved": "¡Clave API de Gemini guardada correctamente!",
    "toast-song-saved": "Canción guardada con éxito.",
    "toast-song-deleted": "Canción eliminada.",
    "toast-backup-exported": "Copia de seguridad descargada.",
    "toast-backup-imported": "Canciones importadas con éxito: ",
    "toast-backup-invalid": "El archivo de copia de seguridad no es válido.",
    "toast-ai-success": "¡Canción procesada con éxito por Gemini!",
    "toast-ai-error": "Error al procesar la canción con IA. Verifica tu clave API."
  },
  en: {
    "brand-title": "Harmonia",
    "search-placeholder": "Search songs, artists...",
    "all-genres": "All Genres",
    "all-keys": "All Keys",
    "new-song": "New Song",
    "ai-import": "AI Import",
    "backup": "Backup",
    "settings": "Settings",
    "select-song": "Select a song",
    "welcome-sub": "Welcome to your personal repository",
    "ctrl-key": "Key",
    "ctrl-notation": "Chords",
    "ctrl-view": "View",
    "ctrl-font": "Size",
    "ctrl-scroll": "Auto-scroll",
    "empty-title": "Your repertoire is ready",
    "empty-desc": "Select a song in the sidebar to view chords, transpose keys in real-time, use hands-free auto-scroll, or import new songs from the web using Artificial Intelligence.",
    "settings-modal-title": "Gemini AI Settings",
    "settings-desc": "To import songs automatically from any website using Artificial Intelligence, you need to input a Google Gemini API Key. The key is stored locally in your browser and requests are sent directly to Google.",
    "settings-get-key": "Get a free Gemini API Key here",
    "settings-key-label": "Gemini API Key",
    "settings-key-note": "Your API key is saved locally in your browser.",
    "btn-cancel": "Cancel",
    "btn-save": "Save",
    "btn-close": "Close",
    "ai-modal-title": "Import Song with AI",
    "ai-key-warning": "You need to configure a Gemini API key before using the AI import.",
    "ai-config-now": "Configure now",
    "ai-status-processing": "Processing and formatting song with Gemini...",
    "ai-instructions": "Go to any song website (such as Ultimate Guitar, LaCuerda, etc.), select all text on the page (Ctrl+A / Cmd+A) and copy it. Paste it below. The AI will clean ads, menus, comments, and instructions, leaving only the structured song with well-aligned chords.",
    "ai-url-label": "Source Link (Optional)",
    "ai-content-label": "Web Copied Content (Lyrics, Chords, Ads...)",
    "ai-btn-process": "Process with AI",
    "editor-title-new": "New Song",
    "editor-title-edit": "Edit Song",
    "editor-song-title": "Song Title",
    "editor-song-artist": "Artist / Band",
    "editor-song-genre": "Genre",
    "editor-song-key": "Original Key",
    "editor-song-bpm": "BPM (Tempo)",
    "editor-song-content": "Lyrics & Chords (ChordPro Format)",
    "editor-helper-text": "Insert chords at cursor position:",
    "editor-chordpro-note": "Use brackets like [C] or [G#m] before the corresponding syllable to align chords.",
    "backup-modal-title": "Backup Repertoire",
    "backup-export-title": "Export Repertoire",
    "backup-export-desc": "Download all your saved songs into a single JSON backup file to save on your computer or share with other devices.",
    "backup-export-btn": "Export to JSON",
    "backup-import-title": "Import Repertoire",
    "backup-import-desc": "Load a previously generated JSON backup file to restore or merge your songs on this device.",
    "backup-import-btn": "Select JSON File",
    
    // Hover titles
    "backup-title": "Backup Options",
    "settings-title": "AI Configuration",
    "lang-toggle-title": "Change interface language",
    "theme-toggle-title": "Toggle dark/light theme",
    "transpose-down-title": "Transpose down 1 semitone",
    "transpose-up-title": "Transpose up 1 semitone",
    "notation-title": "Toggle chord notation system (ENG/ESP)",
    "view-both-title": "Lyrics and Chords",
    "view-chords-title": "Chords Only",
    "view-lyrics-title": "Lyrics Only",
    "font-decrease-title": "Decrease font size",
    "font-increase-title": "Increase font size",
    "scroll-play-title": "Play auto-scroll",
    "scroll-speed-title": "Scroll speed",
    "edit-title": "Edit song",
    "print-title": "Print chords",
    "delete-title": "Delete song",
    
    // Toast messages
    "toast-key-saved": "Gemini API Key saved successfully!",
    "toast-song-saved": "Song saved successfully.",
    "toast-song-deleted": "Song deleted.",
    "toast-backup-exported": "Backup downloaded.",
    "toast-backup-imported": "Songs imported successfully: ",
    "toast-backup-invalid": "Invalid backup file.",
    "toast-ai-success": "Song successfully processed by Gemini!",
    "toast-ai-error": "Error processing song with AI. Check your API Key."
  }
};

/* --- SYSTEM INITIALIZATION --- */
document.addEventListener('DOMContentLoaded', () => {
  // Load settings from localStorage or defaults
  currentLanguage = localStorage.getItem('harmonia_lang') || 'es';
  currentTheme = localStorage.getItem('harmonia_theme') || 'dark';
  currentNotation = localStorage.getItem('harmonia_notation') || 'ENG';
  
  // Set initial theme classes
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // Load songs
  const storedSongs = localStorage.getItem('harmonia_songs');
  if (storedSongs) {
    songs = JSON.parse(storedSongs);
  } else {
    // If no songs in storage, initialize with defaults
    songs = [...DEFAULT_SONGS];
    localStorage.setItem('harmonia_songs', JSON.stringify(songs));
  }
  
  // Setup interface
  initAppEventListeners();
  applyLanguage();
  updateThemeUI();
  updateNotationUI();
  renderSongList();
  populateFilters();
});

/* --- CHORD PARSING AND TRANSPOSITION --- */

// Helper to get index of a note in chromatic scale
function getNoteIndex(note, lang) {
  if (lang === 'ES') {
    let idx = scaleES.indexOf(note);
    if (idx !== -1) return idx;
    idx = scaleESFlats.indexOf(note);
    return idx;
  } else {
    let idx = scaleEN.indexOf(note);
    if (idx !== -1) return idx;
    idx = scaleENFlats.indexOf(note);
    return idx;
  }
}

// Check if a song key is traditionally a flat key (e.g. F, Bb, Gm)
function isFlatKey(keyName) {
  if (!keyName) return false;
  keyName = keyName.trim();
  
  let standardizedKey = keyName;
  const spanishRootsRegex = /^(Solb|Sol#|Reb|Re#|Mib|Fa#|Lab|La#|Sib|Sol|Do#|Do|Re|Mi|Fa|La|Si)/;
  let match = keyName.match(spanishRootsRegex);
  
  if (match) {
    let esRoot = match[1];
    let enRoot = scaleEN[getNoteIndex(esRoot, 'ES')];
    standardizedKey = enRoot + keyName.substring(esRoot.length);
  }
  
  // Normalize minor notations
  standardizedKey = standardizedKey.replace(/min/g, 'm');
  
  if (standardizedKey.includes('b')) return true;
  return flatKeys.includes(standardizedKey);
}

// Parse chord into index, modifiers, and optional bass index
function parseChord(chordStr) {
  if (!chordStr) return null;
  chordStr = chordStr.trim();
  
  // Spanish roots first (longer matches like "Sol#" before "G", "Do" before "D")
  const spanishRootsRegex = /^(Solb|Sol#|Reb|Re#|Mib|Fa#|Lab|La#|Sib|Sol|Do#|Do|Re|Mi|Fa|La|Si)/;
  const englishRootsRegex = /^(C#|Db|D#|Eb|F#|Gb|G#|Ab|A#|Bb|C|D|E|F|G|A|B)/;
  
  let root = "";
  let rootLang = "";
  let remaining = "";
  
  let match = chordStr.match(spanishRootsRegex);
  if (match) {
    root = match[1];
    rootLang = "ES";
    remaining = chordStr.substring(root.length);
  } else {
    match = chordStr.match(englishRootsRegex);
    if (match) {
      root = match[1];
      rootLang = "EN";
      remaining = chordStr.substring(root.length);
    } else {
      return null; // Not a standard note
    }
  }
  
  let modifier = remaining;
  let bassNote = null;
  let bassLang = null;
  let slashIdx = remaining.indexOf('/');
  
  if (slashIdx !== -1) {
    modifier = remaining.substring(0, slashIdx);
    const bassPart = remaining.substring(slashIdx + 1);
    
    let bassMatch = bassPart.match(spanishRootsRegex);
    if (bassMatch) {
      bassNote = bassMatch[1];
      bassLang = "ES";
    } else {
      bassMatch = bassPart.match(englishRootsRegex);
      if (bassMatch) {
        bassNote = bassMatch[1];
        bassLang = "EN";
      }
    }
  }
  
  const rootIndex = getNoteIndex(root, rootLang);
  const bassIndex = bassNote ? getNoteIndex(bassNote, bassLang) : null;
  
  return {
    rootIndex,
    modifier,
    bassIndex
  };
}

// Format parsed chord back to string representation
function formatChord(parsedChord, transposition, notationSystem, useFlats) {
  if (!parsedChord) return "";
  
  let newRootIdx = (parsedChord.rootIndex + transposition + 12) % 12;
  
  let newRoot = "";
  if (notationSystem === 'ESP') {
    newRoot = useFlats ? scaleESFlats[newRootIdx] : scaleES[newRootIdx];
  } else {
    newRoot = useFlats ? scaleENFlats[newRootIdx] : scaleEN[newRootIdx];
  }
  
  let result = newRoot + parsedChord.modifier;
  
  if (parsedChord.bassIndex !== null) {
    let newBassIdx = (parsedChord.bassIndex + transposition + 12) % 12;
    let newBass = "";
    if (notationSystem === 'ESP') {
      newBass = useFlats ? scaleESFlats[newBassIdx] : scaleES[newBassIdx];
    } else {
      newBass = useFlats ? scaleENFlats[newBassIdx] : scaleEN[newBassIdx];
    }
    result += "/" + newBass;
  }
  
  return result;
}

// Convert ChordPro [C] line into text/chord segments
function parseLine(lineText) {
  const segments = [];
  const chordRegex = /\[([^\]]+)\]/g;
  let lastIndex = 0;
  let match;
  
  chordRegex.lastIndex = 0;
  
  while ((match = chordRegex.exec(lineText)) !== null) {
    const chordContent = match[1];
    const matchIndex = match.index;
    const textBefore = lineText.substring(lastIndex, matchIndex);
    
    if (lastIndex === 0 && textBefore.length > 0) {
      segments.push({ chord: "", text: textBefore });
    } else if (segments.length > 0 && textBefore.length > 0) {
      segments.push({ chord: "", text: textBefore });
    } else if (textBefore.length > 0) {
      segments.push({ chord: "", text: textBefore });
    }
    
    segments.push({ chord: chordContent, text: "" });
    lastIndex = chordRegex.lastIndex;
  }
  
  if (lastIndex < lineText.length) {
    const textAfter = lineText.substring(lastIndex);
    segments.push({ chord: "", text: textAfter });
  }
  
  // Collapse adjacent text segments
  const collapsed = [];
  segments.forEach(seg => {
    if (collapsed.length > 0 && !seg.chord && !collapsed[collapsed.length - 1].chord) {
      collapsed[collapsed.length - 1].text += seg.text;
    } else {
      collapsed.push(seg);
    }
  });
  
  return collapsed;
}

function escapeHTML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* --- RENDERING --- */

// Render list of songs in the sidebar
function renderSongList() {
  const songList = document.getElementById('song-list');
  const searchBar = document.getElementById('search-bar');
  const filterGenre = document.getElementById('filter-genre');
  const filterKey = document.getElementById('filter-key');
  
  const query = searchBar.value.toLowerCase().trim();
  const selectedGenre = filterGenre.value;
  const selectedKey = filterKey.value;
  
  songList.innerHTML = "";
  
  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(query) || 
                          song.artist.toLowerCase().includes(query) || 
                          song.content.toLowerCase().includes(query);
    const matchesGenre = !selectedGenre || song.genre === selectedGenre;
    
    // Normalize keys for filter comparison
    let normalizedSongKey = song.key || "";
    let matchesKey = !selectedKey || normalizedSongKey === selectedKey;
    
    return matchesSearch && matchesGenre && matchesKey;
  });
  
  if (filteredSongs.length === 0) {
    const noSongs = document.createElement('div');
    noSongs.style.padding = '20px';
    noSongs.style.textAlign = 'center';
    noSongs.style.color = 'var(--text-muted)';
    noSongs.style.fontSize = '0.9rem';
    noSongs.textContent = currentLanguage === 'es' ? 'No se encontraron canciones' : 'No songs found';
    songList.appendChild(noSongs);
    return;
  }
  
  // Sort alphabetically by title
  filteredSongs.sort((a, b) => a.title.localeCompare(b.title));
  
  filteredSongs.forEach(song => {
    const item = document.createElement('div');
    item.className = `song-item ${song.id === activeSongId ? 'active' : ''}`;
    item.dataset.id = song.id;
    
    // Translate Key to active notation style
    let displayKey = song.key || "--";
    if (song.key && currentNotation === 'ESP') {
      const parsedKey = parseChord(song.key);
      if (parsedKey) displayKey = formatChord(parsedKey, 0, 'ESP', isFlatKey(song.key));
    }
    
    item.innerHTML = `
      <div class="song-info">
        <span class="song-item-title">${escapeHTML(song.title)}</span>
        <span class="song-item-artist">${escapeHTML(song.artist)}</span>
      </div>
      <div class="song-badge-container">
        <span class="song-item-key">${escapeHTML(displayKey)}</span>
      </div>
    `;
    
    item.addEventListener('click', () => selectSong(song.id));
    songList.appendChild(item);
  });
}

// Select a song and render it on the canvas
function selectSong(id) {
  stopScroll();
  activeSongId = id;
  transpositionOffset = 0;
  
  // Highlight active sidebar item
  document.querySelectorAll('.song-item').forEach(item => {
    item.classList.toggle('active', item.dataset.id === id);
  });
  
  const song = songs.find(s => s.id === id);
  if (!song) {
    renderEmptyState();
    return;
  }
  
  // Hide empty state and show controls/sheet
  document.getElementById('empty-state-view').style.display = 'none';
  document.getElementById('viewer-controls').style.display = 'flex';
  document.getElementById('song-lyrics-render').style.display = 'block';
  
  // Render song title and metadata
  const headerDetails = document.getElementById('song-header-details');
  const displayGenre = song.genre ? song.genre : (currentLanguage === 'es' ? 'Sin género' : 'No genre');
  const displayBpm = song.bpm ? `${song.bpm} BPM` : '-- BPM';
  
  // Translate Key to active notation style
  let displayKey = song.key || "--";
  if (song.key) {
    const parsedKey = parseChord(song.key);
    if (parsedKey) displayKey = formatChord(parsedKey, 0, currentNotation, isFlatKey(song.key));
  }
  
  headerDetails.innerHTML = `
    <h1 class="song-main-title">${escapeHTML(song.title)}</h1>
    <div class="song-main-meta">
      <span>${escapeHTML(song.artist)}</span>
      <span class="song-meta-dot"></span>
      <span>${escapeHTML(displayGenre)}</span>
      <span class="song-meta-dot"></span>
      <span>${escapeHTML(displayBpm)}</span>
      <span class="song-meta-dot"></span>
      <span>Tono Original: ${escapeHTML(displayKey)}</span>
    </div>
  `;
  
  // Mobile sidebar auto-close
  document.getElementById('app-sidebar').classList.remove('mobile-open');
  
  // Trigger song rendering
  renderSongSheet();
}

function renderEmptyState() {
  document.getElementById('empty-state-view').style.display = 'flex';
  document.getElementById('viewer-controls').style.display = 'none';
  document.getElementById('song-lyrics-render').style.display = 'none';
  
  const headerDetails = document.getElementById('song-header-details');
  headerDetails.innerHTML = `
    <h1 class="song-main-title" data-t="select-song">${TRANSLATIONS[currentLanguage]["select-song"]}</h1>
    <div class="song-main-meta">
      <span data-t="welcome-sub">${TRANSLATIONS[currentLanguage]["welcome-sub"]}</span>
    </div>
  `;
}

// Core formatting and chord transposer engine
function renderSongSheet() {
  const song = songs.find(s => s.id === activeSongId);
  const canvas = document.getElementById('song-lyrics-render');
  
  if (!song) return;
  
  // Update Key Display
  const currentKeyDisplay = document.getElementById('current-key-display');
  let displayKey = song.key || "--";
  if (song.key) {
    const parsedKey = parseChord(song.key);
    if (parsedKey) {
      displayKey = formatChord(parsedKey, transpositionOffset, currentNotation, isFlatKey(song.key));
    }
  }
  currentKeyDisplay.textContent = displayKey;
  
  // Clear and determine flats
  canvas.innerHTML = "";
  canvas.className = `song-lyrics ${activeViewMode === 'chords' ? 'chords-only' : activeViewMode === 'lyrics' ? 'lyrics-only' : ''}`;
  canvas.style.fontSize = `${fontScale * 1.15}rem`;
  
  const lines = song.content.split('\n');
  const useFlats = isFlatKey(displayKey);
  
  lines.forEach(lineText => {
    // Blank lines
    if (lineText.trim() === "") {
      const emptyLine = document.createElement('div');
      emptyLine.className = "chordpro-line";
      emptyLine.style.height = "1.5em";
      canvas.appendChild(emptyLine);
      return;
    }
    
    // Check for section headers (e.g. [Chorus], [Intro], Verse 1:)
    const trimmed = lineText.trim();
    const isSectionHeader = /^(Intro|Verse|Chorus|Bridge|Outro|Solo|Coro|Estrofa|Verso|Puente)/i.test(trimmed) || 
                            (trimmed.startsWith('[') && trimmed.endsWith(']') && !trimmed.includes(' '));
    
    if (isSectionHeader) {
      let headerText = trimmed;
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        headerText = trimmed.slice(1, -1);
      }
      
      const headerLine = document.createElement('div');
      headerLine.className = "chordpro-line";
      headerLine.style.fontWeight = "700";
      headerLine.style.color = "var(--accent)";
      headerLine.style.marginTop = "16px";
      headerLine.style.marginBottom = "8px";
      headerLine.textContent = headerText;
      canvas.appendChild(headerLine);
      return;
    }
    
    // Parse normal lyrics and chords
    const segments = parseLine(lineText);
    const lineContainer = document.createElement('div');
    lineContainer.className = "chordpro-line";
    
    segments.forEach(seg => {
      const segmentSpan = document.createElement('span');
      segmentSpan.className = "chordpro-segment";
      
      if (seg.chord) {
        const chordSpan = document.createElement('span');
        chordSpan.className = "chordpro-chord";
        
        const parsed = parseChord(seg.chord);
        const formattedChord = parsed ? formatChord(parsed, transpositionOffset, currentNotation, useFlats) : seg.chord;
        
        chordSpan.textContent = formattedChord;
        segmentSpan.appendChild(chordSpan);
      }
      
      const textSpan = document.createElement('span');
      textSpan.className = "chordpro-lyrics-text";
      textSpan.innerHTML = seg.text ? escapeHTML(seg.text) : "&nbsp;";
      segmentSpan.appendChild(textSpan);
      
      lineContainer.appendChild(segmentSpan);
    });
    
    canvas.appendChild(lineContainer);
  });
}

// Populate filters dynamically from existing songs
function populateFilters() {
  const genres = new Set();
  const keys = new Set();
  
  songs.forEach(song => {
    if (song.genre) genres.add(song.genre);
    if (song.key) keys.add(song.key);
  });
  
  const filterGenre = document.getElementById('filter-genre');
  const filterKey = document.getElementById('filter-key');
  
  // Save selected values
  const prevGenre = filterGenre.value;
  const prevKey = filterKey.value;
  
  filterGenre.innerHTML = `<option value="">${TRANSLATIONS[currentLanguage]["all-genres"]}</option>`;
  filterKey.innerHTML = `<option value="">${TRANSLATIONS[currentLanguage]["all-keys"]}</option>`;
  
  // Add genres sorted
  Array.from(genres).sort().forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = g;
    filterGenre.appendChild(opt);
  });
  
  // Add keys sorted
  Array.from(keys).sort().forEach(k => {
    const opt = document.createElement('option');
    opt.value = k;
    
    // Format key if in Spanish notation
    let displayKey = k;
    if (currentNotation === 'ESP') {
      const parsed = parseChord(k);
      if (parsed) displayKey = formatChord(parsed, 0, 'ESP', isFlatKey(k));
    }
    opt.textContent = displayKey;
    filterKey.appendChild(opt);
  });
  
  // Restore selections if valid
  if (genres.has(prevGenre)) filterGenre.value = prevGenre;
  if (keys.has(prevKey)) filterKey.value = prevKey;
}

/* --- AUTO SCROLL WITH SMOOTH REQUESTANIMATIONFRAME --- */

function scrollLoop() {
  if (!isScrolling) return;
  
  const canvas = document.getElementById('song-viewer-canvas');
  const speed = parseFloat(document.getElementById('scroll-speed').value);
  
  // Speed maps 1-10 to px/frame
  const step = speed * 0.15;
  canvas.scrollTop += step;
  
  // Stop at bottom
  if (Math.ceil(canvas.scrollTop + canvas.clientHeight) >= canvas.scrollHeight) {
    stopScroll();
  } else {
    requestAnimationFrame(scrollLoop);
  }
}

function startScroll() {
  if (isScrolling) return;
  isScrolling = true;
  const playBtn = document.getElementById('btn-scroll-play');
  playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
  requestAnimationFrame(scrollLoop);
}

function stopScroll() {
  if (!isScrolling) return;
  isScrolling = false;
  const playBtn = document.getElementById('btn-scroll-play');
  playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
}

function toggleScroll() {
  if (isScrolling) {
    stopScroll();
  } else {
    startScroll();
  }
}

/* --- MODAL DIALOG CONTROLS --- */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.showModal();
    
    // Specific setup for AI modal
    if (id === 'modal-ai-import') {
      const key = localStorage.getItem('harmonia_gemini_key') || "";
      const warning = document.getElementById('ai-import-key-warning');
      const processBtn = document.getElementById('btn-process-ai');
      
      if (!key) {
        warning.style.display = 'block';
        processBtn.disabled = true;
        processBtn.style.opacity = '0.5';
      } else {
        warning.style.display = 'none';
        processBtn.disabled = false;
        processBtn.style.opacity = '1';
      }
    }
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.close();
  }
}

// Global modal close accessible
window.closeModal = closeModal;

/* --- TOAST NOTIFICATIONS --- */
function showToast(translationKey, extraText = "") {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const text = TRANSLATIONS[currentLanguage][translationKey] || translationKey;
  
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--success);"></i> <span>${text}${extraText}</span>`;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s reverse forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

/* --- AI IMPORT: GEMINI API CONNECTOR --- */
async function processSongWithGemini() {
  const apiKey = localStorage.getItem('harmonia_gemini_key');
  if (!apiKey) return;
  
  const rawText = document.getElementById('ai-paste-area').value.trim();
  const sourceUrl = document.getElementById('ai-source-url').value.trim();
  
  if (!rawText) return;
  
  // Show spinner
  const indicator = document.getElementById('ai-status-indicator');
  indicator.style.display = 'flex';
  
  const promptText = `
Eres un experto formateador musical. Tu tarea es extraer la letra y acordes de una canción desde el texto copiado de una página web (el cual puede contener anuncios, menús de navegación, comentarios de usuarios y diagramas de acordes) y estructurarlo en formato JSON limpio de publicidad y elementos extraños.

Información adicional sobre el origen: ${sourceUrl ? "Enlace de origen: " + sourceUrl : "No provisto"}

Sigue estas reglas estrictamente:
1. Identifica el Título, Artista, Género (estimado), Tono Original (Key, en notación americana como C, D, Em, F#m, etc.), y BPM (Tempo estimado si no se indica, típicamente entre 60 y 160).
2. Limpia el texto eliminando: anuncios, comentarios, diagramas de acordes (como e|---0---, etc.), información de copyright, pies de página y cabeceras de navegación.
3. Formatea la letra y los acordes utilizando el formato ChordPro: coloca cada acorde entre corchetes rectangulares (ej. [C], [Am], [G7]) justo antes de la sílaba en la que debe sonar.
4. Si hay secciones (como Intro, Estrofa, Coro, Solo, Puente, Outro), indícalas en líneas separadas como encabezados de sección.
5. Los acordes en el texto original a veces están en una línea separada por encima de la letra. Debes alinearlos e insertarlos con precisión dentro de la línea de texto correspondiente.
6. Devuelve ÚNICAMENTE un objeto JSON válido con la siguiente estructura, sin markdown (no incluyas bloques \`\`\`json ... \`\`\`, devuelve solo el objeto crudo):
{
  "title": "Título de la canción",
  "artist": "Artista o banda",
  "genre": "Género musical",
  "key": "Tono (ej: C, Dm, G)",
  "bpm": "BPM (número como string, ej: 95)",
  "content": "Letra en formato ChordPro con acordes en corchetes"
}

Aquí está el texto copiado:
${rawText}
  `;
  
  try {
    // REST fetch calling Google Gemini API directly
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: promptText }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });
    
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    
    const responseData = await response.json();
    const responseText = responseData.candidates[0].content.parts[0].text;
    
    let cleanedJson = responseText.trim();
    // Safely remove markdown fences if present
    if (cleanedJson.startsWith("```")) {
      cleanedJson = cleanedJson.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }
    
    const songData = JSON.parse(cleanedJson);
    
    // Create new song in memory
    const newSong = {
      id: "song-" + Date.now(),
      title: songData.title || "Canción Importada",
      artist: songData.artist || "Artista Desconocido",
      genre: songData.genre || "",
      key: songData.key || "C",
      bpm: songData.bpm || "",
      content: songData.content || ""
    };
    
    songs.push(newSong);
    localStorage.setItem('harmonia_songs', JSON.stringify(songs));
    
    // Reload UI
    populateFilters();
    renderSongList();
    
    // Reset Form and close
    document.getElementById('ai-paste-area').value = "";
    document.getElementById('ai-source-url').value = "";
    closeModal('modal-ai-import');
    
    // Select the new song
    selectSong(newSong.id);
    showToast("toast-ai-success");
    
  } catch (error) {
    console.error("AI import failed:", error);
    showToast("toast-ai-error");
  } finally {
    indicator.style.display = 'none';
  }
}

/* --- EVENT LISTENERS & LOCAL UI SETUP --- */

function initAppEventListeners() {
  // Mobile sidebar trigger
  const mobToggle = document.getElementById('mobile-sidebar-toggle');
  const sidebar = document.getElementById('app-sidebar');
  const mobClose = document.getElementById('mobile-sidebar-close');
  
  mobToggle.addEventListener('click', () => {
    sidebar.classList.add('mobile-open');
  });
  
  mobClose.addEventListener('click', () => {
    sidebar.classList.remove('mobile-open');
  });
  
  // Search bar live filter
  document.getElementById('search-bar').addEventListener('input', renderSongList);
  
  // Filters dropdown
  document.getElementById('filter-genre').addEventListener('change', renderSongList);
  document.getElementById('filter-key').addEventListener('change', renderSongList);
  
  // Lang Toggle Button
  document.getElementById('btn-lang-toggle').addEventListener('click', () => {
    currentLanguage = currentLanguage === 'es' ? 'en' : 'es';
    localStorage.setItem('harmonia_lang', currentLanguage);
    
    // Update Button Text
    document.getElementById('btn-lang-toggle').querySelector('span').textContent = currentLanguage.toUpperCase();
    
    applyLanguage();
    populateFilters();
    renderSongList();
    if (activeSongId) {
      selectSong(activeSongId);
    } else {
      renderEmptyState();
    }
  });
  
  // Theme Toggle Button
  document.getElementById('btn-theme-toggle').addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('harmonia_theme', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeUI();
  });
  
  // Modal Triggers
  document.getElementById('btn-new-song').addEventListener('click', () => {
    // Clear editor fields for creation
    document.getElementById('editor-song-id').value = "";
    document.getElementById('editor-title').value = "";
    document.getElementById('editor-artist').value = "";
    document.getElementById('editor-genre').value = "";
    document.getElementById('editor-key').value = "";
    document.getElementById('editor-bpm').value = "";
    document.getElementById('editor-content').value = "";
    
    document.getElementById('editor-modal-title').querySelector('span').textContent = TRANSLATIONS[currentLanguage]["editor-title-new"];
    openModal('modal-editor');
  });
  
  document.getElementById('btn-edit-song').addEventListener('click', () => {
    const song = songs.find(s => s.id === activeSongId);
    if (!song) return;
    
    document.getElementById('editor-song-id').value = song.id;
    document.getElementById('editor-title').value = song.title;
    document.getElementById('editor-artist').value = song.artist;
    document.getElementById('editor-genre').value = song.genre || "";
    document.getElementById('editor-key').value = song.key || "";
    document.getElementById('editor-bpm').value = song.bpm || "";
    document.getElementById('editor-content').value = song.content || "";
    
    document.getElementById('editor-modal-title').querySelector('span').textContent = TRANSLATIONS[currentLanguage]["editor-title-edit"];
    openModal('modal-editor');
  });
  
  document.getElementById('btn-ai-import').addEventListener('click', () => openModal('modal-ai-import'));
  document.getElementById('btn-backup').addEventListener('click', () => openModal('modal-backup'));
  document.getElementById('btn-settings-trigger').addEventListener('click', () => {
    document.getElementById('setting-gemini-key').value = localStorage.getItem('harmonia_gemini_key') || "";
    openModal('modal-settings');
  });
  
  // Settings API key save
  document.getElementById('btn-save-settings').addEventListener('click', () => {
    const key = document.getElementById('setting-gemini-key').value.trim();
    localStorage.setItem('harmonia_gemini_key', key);
    closeModal('modal-settings');
    showToast("toast-key-saved");
  });
  
  // Manual Editor Save
  document.getElementById('btn-save-song').addEventListener('click', () => {
    const id = document.getElementById('editor-song-id').value;
    const title = document.getElementById('editor-title').value.trim();
    const artist = document.getElementById('editor-artist').value.trim();
    const genre = document.getElementById('editor-genre').value.trim();
    const key = document.getElementById('editor-key').value.trim();
    const bpm = document.getElementById('editor-bpm').value.trim();
    const content = document.getElementById('editor-content').value.trim();
    
    if (!title || !artist || !content) return; // Basic validation
    
    if (id) {
      // Update
      const song = songs.find(s => s.id === id);
      if (song) {
        song.title = title;
        song.artist = artist;
        song.genre = genre;
        song.key = key;
        song.bpm = bpm;
        song.content = content;
      }
    } else {
      // Create
      const newSong = {
        id: "song-" + Date.now(),
        title,
        artist,
        genre,
        key,
        bpm,
        content
      };
      songs.push(newSong);
    }
    
    localStorage.setItem('harmonia_songs', JSON.stringify(songs));
    closeModal('modal-editor');
    populateFilters();
    renderSongList();
    
    if (id) {
      selectSong(id);
    } else {
      selectSong(songs[songs.length - 1].id);
    }
    
    showToast("toast-song-saved");
  });
  
  // Delete song
  document.getElementById('btn-delete-song').addEventListener('click', () => {
    if (!activeSongId) return;
    
    const confirmMsg = currentLanguage === 'es' ? '¿Estás seguro de que deseas eliminar esta canción?' : 'Are you sure you want to delete this song?';
    if (confirm(confirmMsg)) {
      songs = songs.filter(s => s.id !== activeSongId);
      localStorage.setItem('harmonia_songs', JSON.stringify(songs));
      
      populateFilters();
      renderSongList();
      renderEmptyState();
      
      showToast("toast-song-deleted");
    }
  });
  
  // Print song
  document.getElementById('btn-print-song').addEventListener('click', () => {
    window.print();
  });
  
  // Transposition offset changes
  document.getElementById('btn-transpose-down').addEventListener('click', () => {
    transpositionOffset--;
    if (transpositionOffset < -6) transpositionOffset = 5; // Roll around
    renderSongSheet();
  });
  
  document.getElementById('btn-transpose-up').addEventListener('click', () => {
    transpositionOffset++;
    if (transpositionOffset > 6) transpositionOffset = -5; // Roll around
    renderSongSheet();
  });
  
  // Notation system toggle
  document.getElementById('btn-chord-notation').addEventListener('click', () => {
    currentNotation = currentNotation === 'ENG' ? 'ESP' : 'ENG';
    localStorage.setItem('harmonia_notation', currentNotation);
    updateNotationUI();
    renderSongSheet();
    populateFilters();
    renderSongList();
  });
  
  // View mode changes
  document.getElementById('btn-view-both').addEventListener('click', () => {
    setViewMode('both');
  });
  
  document.getElementById('btn-view-chords').addEventListener('click', () => {
    setViewMode('chords');
  });
  
  document.getElementById('btn-view-lyrics').addEventListener('click', () => {
    setViewMode('lyrics');
  });
  
  // Font scale changes
  document.getElementById('btn-font-decrease').addEventListener('click', () => {
    if (fontScale > 0.6) {
      fontScale -= 0.1;
      renderSongSheet();
    }
  });
  
  document.getElementById('btn-font-increase').addEventListener('click', () => {
    if (fontScale < 2.0) {
      fontScale += 0.1;
      renderSongSheet();
    }
  });
  
  // Auto-scroll toggle
  document.getElementById('btn-scroll-play').addEventListener('click', toggleScroll);
  
  // Gemini AI Process Trigger
  document.getElementById('btn-process-ai').addEventListener('click', processSongWithGemini);
  
  // Database Backup options
  document.getElementById('btn-export-database').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(songs, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `harmonia_respaldo_${new Date().toISOString().slice(0,10)}.json`);
    dlAnchorElem.click();
    showToast("toast-backup-exported");
  });
  
  document.getElementById('import-file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const importedSongs = JSON.parse(e.target.result);
        if (Array.isArray(importedSongs)) {
          // Merge logic: append if id doesn't exist, overwrite if it does
          importedSongs.forEach(impSong => {
            if (!impSong.id || !impSong.title || !impSong.content) return;
            const existingIdx = songs.findIndex(s => s.id === impSong.id || (s.title === impSong.title && s.artist === impSong.artist));
            if (existingIdx !== -1) {
              songs[existingIdx] = impSong;
            } else {
              songs.push(impSong);
            }
          });
          
          localStorage.setItem('harmonia_songs', JSON.stringify(songs));
          populateFilters();
          renderSongList();
          closeModal('modal-backup');
          showToast("toast-backup-imported", `${importedSongs.length}`);
        } else {
          showToast("toast-backup-invalid");
        }
      } catch (err) {
        showToast("toast-backup-invalid");
      }
    };
    reader.readAsText(file);
  });
}

function updateThemeUI() {
  const icon = document.getElementById('btn-theme-toggle').querySelector('i');
  if (currentTheme === 'dark') {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

function updateNotationUI() {
  const btn = document.getElementById('btn-chord-notation');
  btn.querySelector('span').textContent = currentNotation;
}

function setViewMode(mode) {
  activeViewMode = mode;
  document.getElementById('btn-view-both').classList.toggle('active', mode === 'both');
  document.getElementById('btn-view-chords').classList.toggle('active', mode === 'chords');
  document.getElementById('btn-view-lyrics').classList.toggle('active', mode === 'lyrics');
  renderSongSheet();
}

function applyLanguage() {
  // Translate HTML elements marked with data-t
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.dataset.t;
    if (TRANSLATIONS[currentLanguage][key]) {
      el.textContent = TRANSLATIONS[currentLanguage][key];
    }
  });
  
  // Translate placeholders
  document.querySelectorAll('[data-t-placeholder]').forEach(el => {
    const key = el.dataset.tPlaceholder;
    if (TRANSLATIONS[currentLanguage][key]) {
      el.placeholder = TRANSLATIONS[currentLanguage][key];
    }
  });
  
  // Translate tooltips
  document.querySelectorAll('[data-t-title]').forEach(el => {
    const key = el.dataset.tTitle;
    if (TRANSLATIONS[currentLanguage][key]) {
      el.title = TRANSLATIONS[currentLanguage][key];
    }
  });
}

// Editor helper function to insert chords into cursor position
function insertChord(chordMarkup) {
  const textarea = document.getElementById('editor-content');
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  
  textarea.value = text.substring(0, start) + chordMarkup + text.substring(end);
  textarea.focus();
  
  // Put cursor inside the brackets or right after
  textarea.selectionStart = textarea.selectionEnd = start + chordMarkup.length;
}

window.insertChord = insertChord;
