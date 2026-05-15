const state = {
  extensions: [],
  filter: 'all',
  theme: localStorage.getItem('theme') || 'light'
};

const dom = {
  list: document.querySelector('#extensions-list'),
  filterBtns: document.querySelectorAll('.filter-btn'),
  themeToggle: document.querySelector('#theme-toggle')
};

async function init() {
  applyTheme();
  await loadData();
  updateFilterUI();
  render();
  setupEventListeners();
}

async function loadData() {
  try {
    const res = await fetch('./data.json');
    state.extensions = await res.json();
  } catch (err) {
    console.error('Failed to load extensions:', err);
  }
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
}

function updateFilterUI() {
  dom.filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === state.filter);
  });
}

function render() {
  const filtered = state.extensions.filter(ext => {
    if (state.filter === 'active') return ext.isActive;
    if (state.filter === 'inactive') return !ext.isActive;
    return true;
  });

  dom.list.innerHTML = filtered.map(ext => `
    <li class="extension-card" data-id="${ext.name}">
      <div class="card-header">
        <img src="${ext.logo}" alt="${ext.name}" class="logo">
        <div class="card-info">
          <h3 class="tp-2">${ext.name}</h3>
          <p class="tp-5">${ext.description}</p>
        </div>
      </div>
      <div class="card-actions">
        <button class="remove-btn tp-6">Remove</button>
        <label class="switch">
          <input type="checkbox" ${ext.isActive ? 'checked' : ''}>
          <span class="slider round"></span>
        </label>
      </div>
    </li>
  `).join('');
}

function setupEventListeners() {
  dom.themeToggle?.addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', state.theme);
    applyTheme();
  });

  dom.filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      state.filter = btn.dataset.filter;
      updateFilterUI();
      render();
    });
  });

  dom.list.addEventListener('click', (e) => {
    const card = e.target.closest('.extension-card');
    if (!card) return;

    const name = card.dataset.id;
    const index = state.extensions.findIndex(ext => ext.name === name);

    if (e.target.classList.contains('remove-btn')) {
      state.extensions.splice(index, 1);
      render();
    }
  });

  dom.list.addEventListener('change', (e) => {
    if (e.target.type === 'checkbox') {
      const card = e.target.closest('.extension-card');
      const name = card.dataset.id;
      const extension = state.extensions.find(ext => ext.name === name);
      if (extension) {
        extension.isActive = e.target.checked;
        if (state.filter !== 'all') render();
      }
    }
  });
}

init();
