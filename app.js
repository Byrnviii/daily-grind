// ════════════════════════════════════════════════
// DAILY GRIND — app.js  v3 (i18n full fix)
// ════════════════════════════════════════════════

const STORAGE_VERSION      = 3;
const STORAGE_KEY_VERSION  = 'dg_version';
const STORAGE_KEY_DATA     = 'dailygrind_v2';
const STORAGE_KEY_HABITS   = 'dailygrind_habits_v2';
const STORAGE_KEY_USERNAME = 'dg_username';
const STORAGE_KEY_LANG     = 'dg_lang';

function checkStorageVersion() {
  const saved = parseInt(localStorage.getItem(STORAGE_KEY_VERSION) || '0', 10);
  if (saved !== STORAGE_VERSION) {
    localStorage.setItem(STORAGE_KEY_VERSION, String(STORAGE_VERSION));
  }
}
checkStorageVersion();

// ════════════════════════════════════════════════
// DEFAULTS — empty so each user starts fresh
// ════════════════════════════════════════════════
const DEFAULT_HABITS = [];

const PALETTE = ['#e74c3c','#c0392b','#ff6b5b','#c8cdd4','#a8c4b0','#8b2020','#d44c3e','#7a7a7a','#909090','#ff4444'];

// ════════════════════════════════════════════════
// MOTIVATIONS — bilingual
// ════════════════════════════════════════════════
const MOTIVATIONS = {
  es: [
    "El exito no es un accidente. Es <span>trabajo duro</span> todos los dias.",
    "Cada habito completado es un ladrillo en tu <span>fortaleza personal</span>.",
    "Los grandes triunfadores no tienen suerte. Tienen <span>disciplina brutal</span>.",
    "Hoy es el dia mas joven que tendras en el resto de tu vida. <span>Aprovechalo.</span>",
    "Tu version futura te agradecera cada dia que no <span>tiraste la toalla</span>.",
    "La consistencia es la diferencia entre el <span>sueno y la realidad</span>.",
    "No necesitas motivacion. Necesitas <span>disciplina</span>. La motivacion viene despues.",
    "Cada pagina leida es una inversion en <span>ti mismo</span>.",
    "Los que se preparan hoy <span>lideran manana</span>.",
    "Cada pequeno paso cuenta. <span>Sigue adelante.</span>",
    "Los ahorros de hoy son la <span>libertad de manana</span>.",
    "La meditacion no es un lujo. Es tu <span>arma mental secreta</span>.",
    "Un dia a la vez, un habito a la vez. <span>Eso es todo lo que se necesita.</span>",
    "Los que dominan sus habitos <span>dominan su destino</span>.",
    "Mientras otros duermen, tu <span>construyes tu futuro</span>.",
  ],
  en: [
    "Success is not an accident. It is <span>hard work</span> every single day.",
    "Every completed habit is a brick in your <span>personal fortress</span>.",
    "The greats don't have luck. They have <span>brutal discipline</span>.",
    "Today is the youngest you will ever be. <span>Make it count.</span>",
    "Your future self will thank you for every day you <span>didn't give up</span>.",
    "Consistency is the difference between <span>dreaming and doing</span>.",
    "You don't need motivation. You need <span>discipline</span>. Motivation follows.",
    "Every page you read is an investment <span>in yourself</span>.",
    "Those who prepare today <span>lead tomorrow</span>.",
    "Every small step counts. <span>Keep going.</span>",
    "Today's savings are <span>tomorrow's freedom</span>.",
    "Meditation is not a luxury. It is your <span>secret mental weapon</span>.",
    "One day at a time, one habit at a time. <span>That is all it takes.</span>",
    "Those who master their habits <span>master their destiny</span>.",
    "While others sleep, you are <span>building your future</span>.",
  ],
};

// ════════════════════════════════════════════════
// STATE & PERSISTENCE
// ════════════════════════════════════════════════
const TODAY_KEY = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

function loadData()    { try { return JSON.parse(localStorage.getItem(STORAGE_KEY_DATA) || '{}'); } catch { return {}; } }
function saveData(d)   { localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(d)); }
function loadHabits()  { try { const h = JSON.parse(localStorage.getItem(STORAGE_KEY_HABITS) || 'null'); return Array.isArray(h) ? h : DEFAULT_HABITS; } catch { return DEFAULT_HABITS; } }
function saveHabits(h) { localStorage.setItem(STORAGE_KEY_HABITS, JSON.stringify(h)); }

let appData = loadData();
let HABITS  = loadHabits();

const now0 = new Date();
let calViewYear  = now0.getFullYear();
let calViewMonth = now0.getMonth();
let selectedDay  = null;

let editingHabitId = null;
let selectedColor  = PALETTE[0];

// ════════════════════════════════════════════════
// I18N
// ════════════════════════════════════════════════
const TRANSLATIONS = {
  es: {
    logoSub:          'Tu rutina. Tu legado.',
    greeting:         'Bienvenido',
    streakLabel:      'Dias de racha',
    panelTitle:       'Habitos del dia',
    addBtn:           '+ Nuevo habito',
    progressSuffix:   'completados',
    allDoneTitle:     'Mision Completada',
    allDoneSub:       'Todos los habitos conquistados. Eres una leyenda.',
    statDays:         'Dias activo',
    statPerfect:      'Perfectos',
    statHabits:       'Habitos',
    exportBtn:        '⬇ Exportar',
    importBtn:        '⬆ Importar',
    closeBtn:         'Cerrar',
    newHabitTitle:    'Nuevo Habito',
    editHabitTitle:   'Editar Habito',
    nameLabel:        'Nombre del habito',
    descLabel:        'Descripcion breve',
    timeLabel:        'Tiempo estimado',
    iconLabel:        'Icono (1-2 letras)',
    colorLabel:       'Color',
    cancelBtn:        'Cancelar',
    saveBtn:          'Guardar Habito',
    calWeekdays:      ['L','M','X','J','V','S','D'],
    calMonths:        ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
    calDayNames:      ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
    dateFmt:          (day, date, month, year) => `${day}, ${date} de ${month} ${year}`,
    deleteConfirm:    '¿Eliminar este habito? Se borrara de todos los dias.',
    allDoneToast:     'Perfecto. Todos los habitos del dia. Eres una leyenda.',
    habitAddedToast:  'agregado a tus habitos.',
    habitNameError:   'Por favor escribe un nombre para el habito.',
    exportOk:         'Datos exportados correctamente.',
    importOk:         'Datos importados correctamente.',
    importError:      'Error al importar. Verifica el archivo.',
    obTagline:        'Tu rutina. Tu legado.',
    obLabel:          '¿Como te llamas?',
    obBtn:            'Comenzar',
    obPlaceholder:    'Tu nombre...',
    welcomePrefix:    'Bienvenido',
    done:             'listo',
    calLegendFull:    'Completo',
    calLegendPartial: 'Parcial',
    emptyTitle:       'Sin habitos aun',
    emptySub:         'Agrega tu primer habito con el boton de arriba.',
    habitDoneMsg:     'Habito completado. Sigue asi.',
    aboutTitle:       '¿Quien hay detras?',
    aboutP1:          'Sin titulo fancy, sin oficina en Silicon Valley, sin inversor millonario.',
    aboutP2:          'Solo alguien de <span class="about-highlight">Panama 🇵🇦</span> que un dia decidio que nunca es tarde para hacer lo que te gusta — y se lo tomo en serio.',
    aboutP3:          'Daily Grind nacio de una idea simple: <span class="about-highlight">si lo escribes, lo haces.</span> Si lo haces todos los dias, cambia tu vida.',
    aboutFooter:      'Sin excusas. Solo habitos. 🔥',
    aboutHighlight:   'The Founder.',
  },
  en: {
    logoSub:          'Your routine. Your legacy.',
    greeting:         'Welcome',
    streakLabel:      'Streak days',
    panelTitle:       "Today's habits",
    addBtn:           '+ New habit',
    progressSuffix:   'completed',
    allDoneTitle:     'Mission Complete',
    allDoneSub:       'All habits conquered. You are a legend.',
    statDays:         'Active days',
    statPerfect:      'Perfect',
    statHabits:       'Habits',
    exportBtn:        '⬇ Export',
    importBtn:        '⬆ Import',
    closeBtn:         'Close',
    newHabitTitle:    'New Habit',
    editHabitTitle:   'Edit Habit',
    nameLabel:        'Habit name',
    descLabel:        'Brief description',
    timeLabel:        'Estimated time',
    iconLabel:        'Icon (1-2 chars)',
    colorLabel:       'Color',
    cancelBtn:        'Cancel',
    saveBtn:          'Save Habit',
    calWeekdays:      ['M','T','W','T','F','S','S'],
    calMonths:        ['January','February','March','April','May','June','July','August','September','October','November','December'],
    calDayNames:      ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    dateFmt:          (day, date, month, year) => `${day}, ${month} ${date} ${year}`,
    deleteConfirm:    'Delete this habit? It will be removed from all days.',
    allDoneToast:     'Perfect. All habits done today. You are a legend.',
    habitAddedToast:  'added to your habits.',
    habitNameError:   'Please enter a name for the habit.',
    exportOk:         'Data exported successfully.',
    importOk:         'Data imported successfully.',
    importError:      'Import error. Please check the file.',
    obTagline:        'Your routine. Your legacy.',
    obLabel:          'What is your name?',
    obBtn:            'Get started',
    obPlaceholder:    'Your name...',
    welcomePrefix:    'Welcome',
    done:             'done',
    calLegendFull:    'Complete',
    calLegendPartial: 'Partial',
    emptyTitle:       'No habits yet',
    emptySub:         'Add your first habit using the button above.',
    habitDoneMsg:     'Habit completed. Keep going.',
    aboutTitle:       'Who is behind this?',
    aboutP1:          'No fancy title, no Silicon Valley office, no million-dollar investor.',
    aboutP2:          'Just someone from <span class="about-highlight">Panama 🇵🇦</span> who one day decided it\'s never too late to do what you love — and took it seriously.',
    aboutP3:          'Daily Grind was born from a simple idea: <span class="about-highlight">if you write it down, you do it.</span> Do it every day, and it changes your life.',
    aboutFooter:      'No excuses. Just habits. 🔥',
    aboutHighlight:   'The Founder.',
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
  updateMotivation();
  updateDateDisplay();
  applyLang();
  renderHabits();
  renderCalendar();
}

function applyLang() {
  const name = localStorage.getItem(STORAGE_KEY_USERNAME) || '';
  const qs   = (s) => document.querySelector(s);
  const qsa  = (s) => document.querySelectorAll(s);

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
  const statKeys   = ['statDays','statPerfect','statHabits'];
  statLabels.forEach((el, i) => { if (statKeys[i]) el.textContent = t(statKeys[i]); });

  const actBtns = qsa('.action-btn');
  if (actBtns[0]) actBtns[0].textContent = t('exportBtn');
  if (actBtns[1]) actBtns[1].textContent = t('importBtn');

  const wds  = qsa('.cal-wd');
  const days = t('calWeekdays');
  wds.forEach((el, i) => { if (days[i]) el.textContent = days[i]; });

  // Calendar legend
  const legendLabels = qsa('.legend-label');
  if (legendLabels[0]) legendLabels[0].textContent = t('calLegendFull');
  if (legendLabels[1]) legendLabels[1].textContent = t('calLegendPartial');

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

  // About section
  const aboutTitle = document.getElementById('aboutTitle');
  if (aboutTitle) aboutTitle.textContent = t('aboutTitle');
  const aboutBody = document.getElementById('aboutBody');
  if (aboutBody) {
    aboutBody.innerHTML = `
      <p><span class="about-highlight">${t('aboutHighlight')}</span> ${t('aboutP1')}</p>
      <p>${t('aboutP2')}</p>
      <p>${t('aboutP3')}</p>
      <p class="about-footer">${t('aboutFooter')}</p>
    `;
  }

  document.documentElement.lang = currentLang;
  updateProgress();
}

// ════════════════════════════════════════════════
// CLOCK & DATE — fully bilingual
// ════════════════════════════════════════════════
function updateClock() {
  const n = new Date();
  document.getElementById('clock').textContent =
    `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`;
}
setInterval(updateClock, 1000);
updateClock();

function updateDateDisplay() {
  const n      = new Date();
  const days   = t('calDayNames');
  const months = t('calMonths');
  const dayName   = days[n.getDay()];
  const monthName = months[n.getMonth()];
  document.getElementById('dateDisplay').textContent =
    t('dateFmt')(dayName, n.getDate(), monthName, n.getFullYear());
}
updateDateDisplay();

// ════════════════════════════════════════════════
// MOTIVATION — bilingual & reactive
// ════════════════════════════════════════════════
function updateMotivation() {
  const pool = MOTIVATIONS[currentLang] || MOTIVATIONS.es;
  const day  = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  document.getElementById('motivationText').innerHTML = pool[day % pool.length];
}
updateMotivation();

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

  if (HABITS.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-title">${t('emptyTitle')}</div>
        <div class="empty-sub">${t('emptySub')}</div>
      </div>`;
    updateProgress();
    updateStats();
    return;
  }

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
      <button class="habit-edit" title="${currentLang === 'es' ? 'Editar' : 'Edit'}" onclick="openEditModal(event,'${habit.id}')">✎</button>
      <button class="habit-delete" title="${currentLang === 'es' ? 'Eliminar habito' : 'Delete habit'}" onclick="deleteHabit(event,'${habit.id}')">×</button>
    `;
    card.addEventListener('click', e => {
      if (e.target.closest('.habit-delete') || e.target.closest('.habit-edit')) return;
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
    playHabitSound();
    showToast(habit ? `${habit.name}: ${t('habitDoneMsg')}` : t('habitDoneMsg'));
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

function openEditModal(e, habitId) {
  e.stopPropagation();
  const habit = HABITS.find(h => h.id === habitId);
  if (!habit) return;
  editingHabitId = habitId;
  selectedColor  = habit.color || PALETTE[0];
  document.getElementById('addModalTitle').textContent = t('editHabitTitle');
  document.getElementById('habitNameInput').value = habit.name;
  document.getElementById('habitDescInput').value = habit.desc;
  document.getElementById('habitTimeInput').value = habit.time !== '—' ? habit.time : '';
  document.getElementById('habitIconInput').value = habit.icon;
  buildColorSwatches();
  applyLang();
  document.getElementById('addModal').classList.add('open');
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
  if (total > 0 && done === total) {
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
    if (HABITS.length > 0 && count === HABITS.length) perfectDays++;
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
// CALENDAR — bilingual month label
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
// DAY MODAL — bilingual date
// ════════════════════════════════════════════════
function openDayModal(dateStr) {
  const modal   = document.getElementById('dayModal');
  const [y, m, d] = dateStr.split('-');
  const dateObj = new Date(+y, +m-1, +d);
  const dayName   = t('calDayNames')[dateObj.getDay()];
  const monthName = t('calMonths')[dateObj.getMonth()];
  document.getElementById('modalDate').textContent =
    t('dateFmt')(dayName, d, monthName, y);

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
  applyLang();
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
  const icon = document.getElementById('habitIconInput').value.trim().substring(0,3).toUpperCase() || name.substring(0,1).toUpperCase();
  if (!name) { showToast(t('habitNameError')); return; }

  const newHabit = { id: editingHabitId || 'habit_' + Date.now(), name, desc, icon, time, color: selectedColor };
  if (editingHabitId) HABITS = HABITS.map(h => h.id === editingHabitId ? newHabit : h);
  else HABITS.push(newHabit);

  saveHabits(HABITS);
  closeAddModal();
  renderHabits();
  renderCalendar();
  showToast(`"${name}" ${t('habitAddedToast')}`);
}

// ════════════════════════════════════════════════
// EXPORT / IMPORT
// ════════════════════════════════════════════════
function exportData() {
  const payload = { version: STORAGE_VERSION, exportedAt: new Date().toISOString(), habits: HABITS, data: appData };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `dailygrind_backup_${TODAY_KEY()}.json`; a.click();
  URL.revokeObjectURL(url);
  showToast(t('exportOk'));
}

function triggerImport() { document.getElementById('importFile').click(); }

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const payload = JSON.parse(ev.target.result);
      if (payload.habits) { HABITS = payload.habits; saveHabits(HABITS); }
      if (payload.data)   { appData = payload.data;  saveData(appData); }
      renderHabits(); renderCalendar();
      showToast(t('importOk'));
    } catch { showToast(t('importError')); }
  };
  reader.readAsText(file);
  e.target.value = '';
}

// ════════════════════════════════════════════════
// SOUNDS
// ════════════════════════════════════════════════
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
}
function playHabitSound() {
  try {
    const ctx = getAudioCtx(), osc = ctx.createOscillator(), gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1120, ctx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.16, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.32);
  } catch(e) {}
}
function playAllDoneSound() {
  try {
    const ctx = getAudioCtx();
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      const t0 = ctx.currentTime + i * 0.14;
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(0.15, t0 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.55);
      osc.start(t0); osc.stop(t0 + 0.55);
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
  setTimeout(() => { screen.style.display = 'none'; showWelcomeAnimation(name); }, 600);
}

document.getElementById('onboardingInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') submitOnboarding();
  document.getElementById('onboardingInput').style.borderColor = '';
});

// ════════════════════════════════════════════════
// WELCOME ANIMATION
// ════════════════════════════════════════════════
function showWelcomeAnimation(name) {
  const overlay  = document.getElementById('welcomeOverlay');
  const textEl   = document.getElementById('welcomeText');
  const cursor   = document.getElementById('welcomeCursor');
  const prefix   = t('welcomePrefix') + ', ';
  const fullText = prefix + name;

  overlay.classList.add('active');
  textEl.innerHTML = '';
  cursor.style.display = 'inline-block';

  let i = 0;
  const nameStart = prefix.length;
  function typeChar() {
    if (i < fullText.length) {
      if (i === nameStart) textEl.innerHTML = prefix + '<span class="welcome-name"></span>';
      if (i >= nameStart) { const s = textEl.querySelector('.welcome-name'); if (s) s.textContent = name.slice(0, i - nameStart + 1); }
      else textEl.textContent += fullText[i];
      i++;
      setTimeout(typeChar, 65);
    } else {
      setTimeout(() => {
        overlay.classList.add('fading');
        setTimeout(() => { overlay.classList.remove('active','fading'); cursor.style.display = 'none'; applyLang(); }, 550);
      }, 1100);
    }
  }
  typeChar();
}

// ════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════
(function initApp() {
  updateMotivation();
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
