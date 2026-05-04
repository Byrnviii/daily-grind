// ════════════════════════════════════════════════
// DAILY GRIND — app.js
// ════════════════════════════════════════════════

// ── STORAGE VERSION ──────────────────────────────
// Bump this number whenever the data schema changes.
// On mismatch, the app migrates or resets gracefully.
const STORAGE_VERSION = 1;
const STORAGE_KEY_VERSION  = 'dg_version';
const STORAGE_KEY_DATA     = 'dailygrind_v2';
const STORAGE_KEY_HABITS   = 'dailygrind_habits_v2';
const STORAGE_KEY_USERNAME = 'dg_username';
const STORAGE_KEY_LANG     = 'dg_lang';

function checkStorageVersion() {
  const saved = parseInt(localStorage.getItem(STORAGE_KEY_VERSION) || '0', 10);
  if (saved !== STORAGE_VERSION) {
    // Future: add migration logic here instead of a hard reset
    // For now: just stamp the version so it's tracked
    localStorage.setItem(STORAGE_KEY_VERSION, String(STORAGE_VERSION));
  }
}
checkStorageVersion();

// ════════════════════════════════════════════════
// DEFAULTS
// ════════════════════════════════════════════════
const DEFAULT_HABITS = [
  { id: 'read',     name: 'Leer',               desc: 'Alimenta tu mente cada dia',            icon: 'L',  time: '30 min', color: '#4fc3f7' },
  { id: 'english',  name: 'Clases de Ingles',    desc: 'Tu pasaporte al mundo global',           icon: 'C',  time: '45 min', color: '#81d4fa' },
  { id: 'trading',  name: 'Estudiar Trading',    desc: 'Domina el mercado, domina tu vida',      icon: 'E',  time: '1 hr',   color: '#ffffff' },
  { id: 'trenches', name: 'Trenches Mem Coin',   desc: 'Analiza, ejecuta, aprende',              icon: 'T',  time: '1 hr',   color: '#69f0ae' },
  { id: 'water',    name: 'Agua y Meditar',      desc: 'El cuerpo y mente son tu mayor activo',  icon: 'W',  time: '15 min', color: '#ce93d8' },
  { id: 'savings',  name: 'Gestionar Ahorros',   desc: 'La riqueza se construye en silencio',    icon: 'G',  time: '20 min', color: '#e63946' },
];

const MOTIVATIONS = [
  "El exito no es un accidente. Es <span>trabajo duro</span> todos los dias.",
  "Cada habito completado es un ladrillo en tu <span>fortaleza personal</span>.",
  "Los grandes traders no tienen suerte. Tienen <span>disciplina brutal</span>.",
  "Hoy es el dia mas joven que tendras en el resto de tu vida. <span>Aprovechalo.</span>",
  "Tu version futura te agradecera cada dia que no <span>tiraste la toalla</span>.",
  "La consistencia es la diferencia entre el <span>sueno y la realidad</span>.",
  "No necesitas motivacion. Necesitas <span>disciplina</span>. La motivacion viene despues.",
  "Cada pagina leida es una inversion en <span>ti mismo</span>.",
  "El mercado premia a los que <span>se preparan</span>. Tu te estas preparando.",
  "El ingles que aprendes hoy abre puertas que ni imaginas. <span>Sigue adelante.</span>",
  "Los ahorros de hoy son la <span>libertad de manana</span>.",
  "La meditacion no es un lujo. Es tu <span>arma mental secreta</span>.",
  "Un dia a la vez, un habito a la vez. <span>Eso es todo lo que se necesita.</span>",
  "Los que dominan sus habitos <span>dominan su destino</span>.",
  "Mientras otros duermen, tu <span>construyes tu imperio</span>.",
];

const PALETTE = ['#e74c3c','#c0392b','#ff6b5b','#c8cdd4','#a8c4b0','#8b2020','#d44c3e','#7a7a7a','#909090','#ff4444'];

// ════════════════════════════════════════════════
// STATE & PERSISTENCE
// ════════════════════════════════════════════════
const TODAY_KEY = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

function loadData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_DATA) || '{}'); } catch { return {}; }
}
function saveData(d) { localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(d)); }

function loadHabits() {
  try {
    const h = JSON.parse(localStorage.getItem(STORAGE_KEY_HABITS) || 'null');
    return h || DEFAULT_HABITS;
  } catch { return DEFAULT_HABITS; }
}
function saveHabits(h) { localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(h)); }

let appData = loadData();
let HABITS  = loadHabits();

// Calendar state
const now0 = new Date();
let calViewYear  = now0.getFullYear();
let calViewMonth = now0.getMonth();
let selectedDay  = null;

// Add modal state
let editingHabitId = null;
let selectedColor  = PALETTE[0];

// ════════════════════════════════════════════════
// I18N — TRANSLATIONS
// ════════════════════════════════════════════════
const TRANSLATIONS = {
  es: {
    logoSub:        'Tu rutina. Tu legado.',
    greeting:       'Bienvenido',
    streakLabel:    'Dias de racha',
    panelTitle:     'Habitos del dia',
    addBtn:         '+ Nuevo habito',
    progressSuffix: 'completados',
    allDoneTitle:   'Mision Completada',
    allDoneSub:     'Todos los habitos conquistados. Eres una leyenda.',
    statDays:       'Dias activo',
    statPerfect:    'Perfectos',
    statHabits:     'Habitos',
    exportBtn:      '⬇ Exportar',
    importBtn:      '⬆ Importar',
    closeBtn:       'Cerrar',
    newHabitTitle:  'Nuevo Habito',
    editHabitTitle: 'Editar Habito',
    nameLabel:      'Nombre del habito',
    descLabel:      'Descripcion breve',
    timeLabel:      'Tiempo estimado',
    iconLabel:      'Icono (1-2 letras)',
    colorLabel:     'Color',
    cancelBtn:      'Cancelar',
    saveBtn:        'Guardar Habito',
    calWeekdays:    ['L','M','X','J','V','S','D'],
    calMonths:      ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    deleteConfirm:  '¿Eliminar este habito? Se borrara de todos los dias.',
    allDoneToast:   'Perfecto. Todos los habitos del dia. Eres una leyenda.',
    obTagline:      'Tu rutina. Tu legado.',
    obLabel:        '¿Cómo te llamas?',
    obBtn:          'Comenzar',
    obPlaceholder:  'Tu nombre...',
    welcomePrefix:  'Bienvenido',
    done:           'listo',
  },
  en: {
    logoSub:        'Your routine. Your legacy.',
    greeting:       'Welcome',
    streakLabel:    'Streak days',
    panelTitle:     "Today's habits",
    addBtn:         '+ New habit',
    progressSuffix: 'completed',
    allDoneTitle:   'Mission Complete',
    allDoneSub:     'All habits conquered. You are a legend.',
    statDays:       'Active days',
    statPerfect:    'Perfect',
    statHabits:     'Habits',
    exportBtn:      '⬇ Export',
    importBtn:      '⬆ Import',
    closeBtn:       'Close',
    newHabitTitle:  'New Habit',
    editHabitTitle: 'Edit Habit',
    nameLabel:      'Habit name',
    descLabel:      'Brief description',
    timeLabel:      'Estimated time',
    iconLabel:      'Icon (1-2 chars)',
    colorLabel:     'Color',
    cancelBtn:      'Cancel',
    saveBtn:        'Save Habit',
    calWeekdays:    ['M','T','W','T','F','S','S'],
    calMonths:      ['January','February','March','April','May','June','July','August','September','October','November','December'],
    deleteConfirm:  'Delete this habit? It will be removed from all days.',
    allDoneToast:   'Perfect. All habits done today. You are a legend.',
    obTagline:      'Your routine. Your legacy.',
    obLabel:        'What is your name?',
    obBtn:          'Get started',
    obPlaceholder:  'Your name...',
    welcomePrefix:  'Welcome',
    done:           'done',
  }
};

let currentLang = localStorage.getItem(STORAGE_KEY_LANG) ||
  (navigator.language && navigator.language.startsWith('es') ? 'es' : 'en');

function t(key) {
  return (TRANSLATIONS[currentLang] || TRANSLATIONS.en)[key] || key;
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem(STORAGE_KEY_LANG, lang);
  applyLang();
  renderHabits();
  renderCalendar();
}

function applyLang() {
  const name = localStorage.getItem(STORAGE_KEY_USERNAME) || '';
  const qs  = (s) => document.querySelector(s);
  const qsa = (s) => document.querySelectorAll(s);

  const logoSub = document.getElementById('logoSub');
  if (logoSub) logoSub.textContent = t('logoSub');

  const ug = document.getElementById('userGreeting');
  if (ug) ug.innerHTML = name ? `${t('greeting')}, <span>${name}</span>` : '';

  const sl = qs('.streak-label');
  if (sl) sl.textContent = t('streakLabel');

  const pt = qs('.panel-title');
  if (pt) pt.textContent = t('panelTitle');
  const ab = qs('.add-habit-btn');
  if (ab) ab.textContent = t('addBtn');

  const adt = qs('.all-done-title');
  if (adt) adt.textContent = t('allDoneTitle');
  const ads = qs('.all-done-sub');
  if (ads) ads.textContent = t('allDoneSub');

  const statLabels = qsa('.stat-label');
  const statKeys = ['statDays','statPerfect','statHabits'];
  statLabels.forEach((el, i) => { if (statKeys[i]) el.textContent = t(statKeys[i]); });

  const actBtns = qsa('.action-btn');
  if (actBtns[0]) actBtns[0].textContent = t('exportBtn');
  if (actBtns[1]) actBtns[1].textContent = t('importBtn');

  const wds  = qsa('.cal-wd');
  const days = t('calWeekdays');
  wds.forEach((el, i) => { if (days[i]) el.textContent = days[i]; });

  const mc = qs('.modal-close');
  if (mc) mc.textContent = t('closeBtn');

  const amt = document.getElementById('addModalTitle');
  if (amt) amt.textContent = editingHabitId ? t('editHabitTitle') : t('newHabitTitle');

  const formLabels = qsa('.form-label');
  const labelKeys  = ['nameLabel','descLabel','timeLabel','iconLabel','colorLabel'];
  formLabels.forEach((el, i) => { if (labelKeys[i]) el.textContent = t(labelKeys[i]); });

  const cancelB = qs('.btn-secondary');
  if (cancelB) cancelB.textContent = t('cancelBtn');
  const saveB = qs('.btn-primary');
  if (saveB) saveB.textContent = t('saveBtn');

  const obTag = document.getElementById('ob-tagline');
  if (obTag) obTag.textContent = t('obTagline');
  const obLbl = document.getElementById('ob-label');
  if (obLbl) obLbl.textContent = t('obLabel');
  const obBtn = document.getElementById('ob-btn');
  if (obBtn) obBtn.textContent = t('obBtn');
  const obInp = document.getElementById('onboardingInput');
  if (obInp) obInp.placeholder = t('obPlaceholder');

  const bES = document.getElementById('btnES');
  const bEN = document.getElementById('btnEN');
  if (bES) bES.classList.toggle('active', currentLang === 'es');
  if (bEN) bEN.classList.toggle('active', currentLang === 'en');

  document.documentElement.lang = currentLang;
  updateProgress();
}

// ════════════════════════════════════════════════
// CLOCK & DATE
// ════════════════════════════════════════════════
function updateClock() {
  const n = new Date();
  document.getElementById('clock').textContent =
    `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`;
}
setInterval(updateClock, 1000);
updateClock();

(function setupDate() {
  const DAYS   = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
  const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const n = new Date();
  document.getElementById('dateDisplay').textContent =
    `${DAYS[n.getDay()]}, ${n.getDate()} de ${MONTHS[n.getMonth()]} ${n.getFullYear()}`;
})();

// ════════════════════════════════════════════════
// MOTIVATION
// ════════════════════════════════════════════════
(function setupMotivation() {
  const day = Math.floor((new Date() - new Date(new Date().getFullYear(),0,0)) / 86400000);
  document.getElementById('motivationText').innerHTML = MOTIVATIONS[day % MOTIVATIONS.length];
})();

// ════════════════════════════════════════════════
// HABIT RENDER
// ════════════════════════════════════════════════
function getTodayState() {
  const k = TODAY_KEY();
  if (!appData[k]) appData[k] = { habits: {} };
  return appData[k];
}

function renderHabits() {
  const state = getTodayState();
  const list  = document.getElementById('habitsList');
  list.innerHTML = '';

  HABITS.forEach(habit => {
    const done = !!state.habits[habit.id];
    const card = document.createElement('div');
    card.className = 'habit-card' + (done ? ' done' : '');
    card.innerHTML = `
      <div class="habit-check">
        <svg class="check-icon" viewBox="0 0 12 12">
          <polyline points="1.5,6 4.5,9.5 10.5,2.5"/>
        </svg>
      </div>
      <div class="habit-icon-wrap" style="background:${habit.color}18; color:${habit.color}; letter-spacing:1px;">
        ${habit.icon}
      </div>
      <div class="habit-info">
        <div class="habit-name">${habit.name}</div>
        <div class="habit-desc">${habit.desc}</div>
      </div>
      <div class="habit-badge">${done ? '✓ ' + t('done') : habit.time}</div>
      <button class="habit-delete" title="Eliminar habito" onclick="deleteHabit(event,'${habit.id}')">×</button>
    `;
    card.addEventListener('click', e => {
      if (e.target.closest('.habit-delete')) return;
      const rect   = card.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(card.clientWidth, card.clientHeight);
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;`;
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
      toggleHabit(habit.id);
    });
    list.appendChild(card);
  });

  updateProgress();
  updateStats();
}

function toggleHabit(habitId) {
  const state = getTodayState();
  if (state.habits[habitId]) {
    delete state.habits[habitId];
  } else {
    state.habits[habitId] = Date.now();
  }
  appData[TODAY_KEY()] = state;
  saveData(appData);
  renderHabits();
  renderCalendar();

  const habit = HABITS.find(h => h.id === habitId);
  if (state.habits[habitId]) {
    const msgs = {
      read:     'Mente alimentada. Saber es poder.',
      english:  'Un paso mas cerca del mundo global.',
      trading:  'Analisis completado. El mercado te teme.',
      trenches: 'En las trincheras y sobreviviste.',
      water:    'Cuerpo y mente alineados.',
      savings:  'Tus ahorros trabajan para ti.',
    };
    playHabitSound();
    showToast(msgs[habitId] || `${habit ? habit.name : 'Habito'} completado.`);
  }
}

function deleteHabit(e, habitId) {
  e.stopPropagation();
  if (!confirm(t('deleteConfirm'))) return;
  HABITS = HABITS.filter(h => h.id !== habitId);
  saveHabits(HABITS);
  Object.keys(appData).forEach(k => {
    if (appData[k] && appData[k].habits) delete appData[k].habits[habitId];
  });
  saveData(appData);
  renderHabits();
  renderCalendar();
}

// ════════════════════════════════════════════════
// PROGRESS
// ════════════════════════════════════════════════
function updateProgress() {
  const state = getTodayState();
  const done  = Object.keys(state.habits).length;
  const total = HABITS.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressLabel').textContent = `${done} / ${total} ${t('progressSuffix')}`;
  document.getElementById('progressPct').textContent   = pct + '%';

  const allMsg = document.getElementById('allDoneMsg');
  if (done > 0 && done === total) {
    allMsg.classList.add('visible');
    if (!state._completedToday) {
      state._completedToday = true;
      appData[TODAY_KEY()] = state;
      saveData(appData);
      playAllDoneSound();
      setTimeout(() => showToast(t('allDoneToast')), 300);
    }
  } else {
    allMsg.classList.remove('visible');
  }
}

// ════════════════════════════════════════════════
// STATS
// ════════════════════════════════════════════════
function updateStats() {
  let totalDays = 0, perfectDays = 0;
  Object.keys(appData).forEach(k => {
    const d = appData[k];
    if (!d || !d.habits) return;
    const count = Object.keys(d.habits).length;
    if (count > 0) totalDays++;
    if (count === HABITS.length) perfectDays++;
  });

  let streak = 0;
  let cur = new Date();
  const todayCount = Object.keys(getTodayState().habits).length;
  if (todayCount === 0) cur.setDate(cur.getDate() - 1);

  while (true) {
    const k = `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}-${String(cur.getDate()).padStart(2,'0')}`;
    const day = appData[k];
    if (day && Object.keys(day.habits || {}).length > 0) {
      streak++;
      cur.setDate(cur.getDate() - 1);
    } else break;
  }
  if (todayCount > 0) streak++;

  document.getElementById('totalDaysNum').textContent   = totalDays;
  document.getElementById('perfectDaysNum').textContent = perfectDays;
  document.getElementById('streakNum').textContent      = streak;
  document.getElementById('totalHabitsNum').textContent = HABITS.length;
}

// ════════════════════════════════════════════════
// TOAST
// ════════════════════════════════════════════════
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ════════════════════════════════════════════════
// CALENDAR
// ════════════════════════════════════════════════
function renderCalendar() {
  document.getElementById('calMonthLabel').textContent = `${t('calMonths')[calViewMonth]} ${calViewYear}`;
  const daysEl = document.getElementById('calDays');
  daysEl.innerHTML = '';

  const firstDay      = new Date(calViewYear, calViewMonth, 1).getDay();
  const daysInMonth   = new Date(calViewYear, calViewMonth + 1, 0).getDate();
  const startOffset   = firstDay === 0 ? 6 : firstDay - 1;
  const prevMonthDays = new Date(calViewYear, calViewMonth, 0).getDate();

  for (let i = startOffset - 1; i >= 0; i--) {
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.textContent = prevMonthDays - i;
    daysEl.appendChild(el);
  }

  const todayStr = TODAY_KEY();
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calViewYear}-${String(calViewMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;
    if (dateStr === todayStr) el.classList.add('today');
    if (dateStr === selectedDay) el.classList.add('selected');
    const dayData = appData[dateStr];
    if (dayData && dayData.habits) {
      const count = Object.keys(dayData.habits).length;
      if (HABITS.length > 0 && count === HABITS.length) el.classList.add('done-day');
      else if (count > 0) el.classList.add('partial-day');
    }
    el.addEventListener('click', () => {
      selectedDay = dateStr;
      renderCalendar();
      openDayModal(dateStr);
    });
    daysEl.appendChild(el);
  }

  const total     = startOffset + daysInMonth;
  const remaining = (7 - (total % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.textContent = d;
    daysEl.appendChild(el);
  }
}

document.getElementById('calPrev').addEventListener('click', () => {
  calViewMonth--;
  if (calViewMonth < 0) { calViewMonth = 11; calViewYear--; }
  renderCalendar();
});
document.getElementById('calNext').addEventListener('click', () => {
  calViewMonth++;
  if (calViewMonth > 11) { calViewMonth = 0; calViewYear++; }
  renderCalendar();
});

// ════════════════════════════════════════════════
// DAY MODAL
// ════════════════════════════════════════════════
function openDayModal(dateStr) {
  const modal = document.getElementById('dayModal');
  const [y, m, d] = dateStr.split('-');
  const dateObj   = new Date(+y, +m-1, +d);
  const DAY_NAMES  = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
  const MONTH_FULL = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  document.getElementById('modalDate').textContent =
    `${DAY_NAMES[dateObj.getDay()]} ${d}, ${MONTH_FULL[dateObj.getMonth()]} ${y}`;

  if (!appData[dateStr]) appData[dateStr] = { habits: {} };
  const state     = appData[dateStr];
  const container = document.getElementById('modalHabitsList');
  container.innerHTML = '';

  HABITS.forEach(habit => {
    const done = !!state.habits[habit.id];
    const el   = document.createElement('div');
    el.className = 'modal-habit' + (done ? ' done' : '');
    el.innerHTML = `<div class="modal-check"></div>${habit.name}`;
    el.addEventListener('click', () => {
      if (done) delete state.habits[habit.id];
      else state.habits[habit.id] = Date.now();
      appData[dateStr] = state;
      saveData(appData);
      if (dateStr === TODAY_KEY()) renderHabits();
      else { renderCalendar(); updateStats(); }
      openDayModal(dateStr);
    });
    container.appendChild(el);
  });

  modal.classList.add('open');
}

function closeModal() {
  document.getElementById('dayModal').classList.remove('open');
  selectedDay = null;
  renderCalendar();
}

document.getElementById('dayModal').addEventListener('click', e => {
  if (e.target === document.getElementById('dayModal')) closeModal();
});

// ════════════════════════════════════════════════
// ADD / EDIT HABIT MODAL
// ════════════════════════════════════════════════
function buildColorSwatches() {
  const row = document.getElementById('colorRow');
  row.innerHTML = '';
  PALETTE.forEach(color => {
    const sw = document.createElement('div');
    sw.className = 'color-swatch' + (color === selectedColor ? ' active' : '');
    sw.style.background = color;
    sw.dataset.color = color;
    sw.title = color;
    sw.addEventListener('click', () => {
      selectedColor = color;
      document.querySelectorAll('.color-swatch').forEach(s => {
        s.classList.toggle('active', s.dataset.color === color);
      });
    });
    row.appendChild(sw);
  });
}

function openAddModal() {
  editingHabitId = null;
  selectedColor  = PALETTE[0];
  document.getElementById('addModalTitle').textContent = t('newHabitTitle');
  document.getElementById('habitNameInput').value = '';
  document.getElementById('habitDescInput').value = '';
  document.getElementById('habitTimeInput').value = '';
  document.getElementById('habitIconInput').value = '';
  buildColorSwatches();
  document.getElementById('addModal').classList.add('open');
}

function closeAddModal() {
  document.getElementById('addModal').classList.remove('open');
  editingHabitId = null;
}

document.getElementById('addModal').addEventListener('click', e => {
  if (e.target === document.getElementById('addModal')) closeAddModal();
});

function saveHabit() {
  const name = document.getElementById('habitNameInput').value.trim();
  const desc = document.getElementById('habitDescInput').value.trim();
  const time = document.getElementById('habitTimeInput').value.trim() || '—';
  const icon = document.getElementById('habitIconInput').value.trim().substring(0, 3).toUpperCase() || name.substring(0,1).toUpperCase();

  if (!name) { showToast('Por favor escribe un nombre para el habito.'); return; }

  const newHabit = {
    id:    editingHabitId || 'habit_' + Date.now(),
    name, desc, icon, time,
    color: selectedColor,
  };

  if (editingHabitId) {
    HABITS = HABITS.map(h => h.id === editingHabitId ? newHabit : h);
  } else {
    HABITS.push(newHabit);
  }

  saveHabits(HABITS);
  closeAddModal();
  renderHabits();
  renderCalendar();
  showToast(`"${name}" agregado a tus habitos.`);
}

// ════════════════════════════════════════════════
// EXPORT / IMPORT
// ════════════════════════════════════════════════
function exportData() {
  const payload = {
    version:    STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    habits:     HABITS,
    data:       appData,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `dailygrind_backup_${TODAY_KEY()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Datos exportados correctamente.');
}

function triggerImport() {
  document.getElementById('importFile').click();
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const payload = JSON.parse(ev.target.result);
      if (payload.habits) { HABITS = payload.habits; saveHabits(HABITS); }
      if (payload.data)   { appData = payload.data;  saveData(appData); }
      renderHabits();
      renderCalendar();
      showToast('Datos importados correctamente.');
    } catch {
      showToast('Error al importar. Verifica el archivo.');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

// ════════════════════════════════════════════════
// SOUNDS — Web Audio API
// ════════════════════════════════════════════════
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
}

function playHabitSound() {
  try {
    const ctx  = getAudioCtx();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1120, ctx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.16, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.32);
  } catch(e) {}
}

function playAllDoneSound() {
  try {
    const ctx = getAudioCtx();
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      const t0 = ctx.currentTime + i * 0.14;
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.15, t0 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.55);
      osc.start(t0);
      osc.stop(t0 + 0.55);
    });
  } catch(e) {}
}

// ════════════════════════════════════════════════
// ONBOARDING
// ════════════════════════════════════════════════
function submitOnboarding() {
  const inp  = document.getElementById('onboardingInput');
  const name = inp.value.trim();
  if (!name) { inp.focus(); inp.style.borderColor = 'rgba(231,76,60,0.8)'; return; }
  localStorage.setItem(STORAGE_KEY_USERNAME, name);

  const screen = document.getElementById('onboardingScreen');
  screen.style.opacity = '0';
  setTimeout(() => {
    screen.style.display = 'none';
    showWelcomeAnimation(name);
  }, 600);
}

document.getElementById('onboardingInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') submitOnboarding();
  document.getElementById('onboardingInput').style.borderColor = '';
});

// ════════════════════════════════════════════════
// WELCOME ANIMATION — typewriter
// ════════════════════════════════════════════════
function showWelcomeAnimation(name) {
  const overlay = document.getElementById('welcomeOverlay');
  const textEl  = document.getElementById('welcomeText');
  const cursor  = document.getElementById('welcomeCursor');
  const prefix  = t('welcomePrefix') + ', ';
  const fullText = prefix + name;

  overlay.classList.add('active');
  textEl.innerHTML = '';
  cursor.style.display = 'inline-block';

  let i = 0;
  const nameStart = prefix.length;

  function typeChar() {
    if (i < fullText.length) {
      if (i === nameStart) {
        textEl.innerHTML = prefix + '<span class="welcome-name">' + name.slice(0, 0) + '</span>';
      }
      if (i >= nameStart) {
        const span = textEl.querySelector('.welcome-name');
        if (span) span.textContent = name.slice(0, i - nameStart + 1);
      } else {
        textEl.textContent += fullText[i];
      }
      i++;
      setTimeout(typeChar, 65);
    } else {
      setTimeout(() => {
        overlay.classList.add('fading');
        setTimeout(() => {
          overlay.classList.remove('active', 'fading');
          cursor.style.display = 'none';
          applyLang();
        }, 550);
      }, 1100);
    }
  }
  typeChar();
}

// ════════════════════════════════════════════════
// APP INIT
// ════════════════════════════════════════════════
(function initApp() {
  applyLang();
  const name = localStorage.getItem(STORAGE_KEY_USERNAME);
  if (name) {
    document.getElementById('onboardingScreen').style.display = 'none';
    showWelcomeAnimation(name);
  } else {
    document.getElementById('onboardingScreen').style.opacity = '1';
    document.getElementById('onboardingInput').focus();
  }
})();

renderHabits();
renderCalendar();
updateStats();
