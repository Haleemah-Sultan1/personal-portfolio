/**
 * Haleemah Malik Portfolio — Editor UI
 * All editable content lives in content.json
 */
function runBootSequence(onDone) {
  const log = document.getElementById('splashLog');
  const nameEl = document.getElementById('splashName');
  const cursor = document.getElementById('splashCursor');
  const splash = document.getElementById('splash-screen');

  const lines = [
    'booting portfolio.exe...',
    'mounting /projects /blogs /book...',
    'compiling personality.cpp... done'
  ];
  let li = 0;

  function typeLine() {
    if (li >= lines.length) { setTimeout(typeName, 500); return; }
    const p = document.createElement('div');
    p.textContent = lines[li++];
    log.appendChild(p);
    setTimeout(typeLine, 550);
  }

  function typeName() {
    const name = ' حليمة ملک';
    let i = 0;
    const iv = setInterval(() => {
      nameEl.textContent = name.slice(0, ++i);
      if (i >= name.length) {
        clearInterval(iv);
        setTimeout(() => {
          cursor.style.display = 'none';
          setTimeout(fadeOut, 1600);
        }, 500);
      }
    }, 260);
  }

  function fadeOut() {
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.classList.add('splash-hidden');
      if (onDone) onDone();
    }, 1000);
  }

  typeLine();
}

document.addEventListener('DOMContentLoaded', () => {
  runBootSequence(() => {
    // your existing init code (file tree, tabs, etc.) can go here,
    // or just leave this empty if your app already inits on DOMContentLoaded separately
  });
});

const ICONS = {
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  article: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
};

const FILE_ICONS = {
  '.txt': '📄',
  '.md': '📝',
  '.cpp': '⚙️',
  '.ms': '📜',
  default: '📄',
};

const MOBILE_BREAKPOINT = 560;

let data = null;
let activeSection = 'about';
let openTabs = [];
let activeFileId = null;

async function init() {
  const res = await fetch('content.json');
  data = await res.json();
  applyMeta();
  renderActivityBar();
  renderExplorer();
  openFile('welcome');
  setupMobileSidebarDismiss();
}

function isMobile() {
  return window.innerWidth <= MOBILE_BREAKPOINT;
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
}

function setupMobileSidebarDismiss() {
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const activityBar = document.getElementById('activityBar');
    if (
      isMobile() &&
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !activityBar.contains(e.target)
    ) {
      closeSidebar();
    }
  });
}

function applyMeta() {
  document.getElementById('titleBar').textContent = data.meta.titleBar;
  document.getElementById('statusBranch').textContent = `⎇ ${data.statusBar.branch}`;
  document.getElementById('statusErrors').textContent = `⊘ ${data.statusBar.errors}`;
  document.getElementById('statusWarnings').textContent = `△ ${data.statusBar.warnings}`;
  document.getElementById('statusIndent').textContent = data.statusBar.indent;
  document.getElementById('statusEncoding').textContent = data.statusBar.encoding;
}

function getSection(id) {
  return data.sections.find((s) => s.id === id);
}

function getFileById(fileId) {
  for (const section of data.sections) {
    const file = section.files.find((f) => f.id === fileId);
    if (file) return { file, section };
  }
  return null;
}

function getFileIcon(name) {
  const ext = name.slice(name.lastIndexOf('.'));
  return FILE_ICONS[ext] || FILE_ICONS.default;
}

function renderActivityBar() {
  const bar = document.getElementById('activityBar');
  bar.innerHTML = '';

  data.sections.forEach((section) => {
    const btn = document.createElement('button');
    btn.className = `activity-btn${section.id === activeSection ? ' active' : ''}`;
    btn.title = section.label;
    btn.innerHTML = ICONS[section.icon] || ICONS.user;
    btn.addEventListener('click', () => switchSection(section.id));
    bar.appendChild(btn);
  });

  const spacer = document.createElement('div');
  spacer.className = 'activity-spacer';
  bar.appendChild(spacer);

  const settingsBtn = document.createElement('button');
  settingsBtn.className = 'activity-btn';
  settingsBtn.title = 'Settings';
  settingsBtn.innerHTML = ICONS.settings;
  settingsBtn.addEventListener('click', () => {
    switchSection('contact');
    openFile('contact');
  });
  bar.appendChild(settingsBtn);
}

function switchSection(sectionId) {
  activeSection = sectionId;
  renderActivityBar();
  renderExplorer();

  const section = getSection(sectionId);
  if (section?.files.length) {
    const alreadyOpen = section.files.find((f) => openTabs.includes(f.id));
    openFile(alreadyOpen ? alreadyOpen.id : section.files[0].id);
  }

  // Reveal the sidebar on mobile when a section is picked from the activity bar,
  // since it's off-canvas by default below the 560px breakpoint.
  if (isMobile()) {
    openSidebar();
  }
}

function renderExplorer() {
  const section = getSection(activeSection);
  if (!section) return;

  document.getElementById('explorerTitle').textContent = section.explorerTitle;
  document.getElementById('folderName').textContent = section.folder;

  const tree = document.getElementById('fileTree');
  tree.innerHTML = '';

  section.files.forEach((file) => {
    const li = document.createElement('li');
    li.className = `tree-file${file.id === activeFileId ? ' active' : ''}`;
    li.innerHTML = `<span class="file-icon">${getFileIcon(file.name)}</span><span>${file.name}</span>`;
    li.addEventListener('click', () => openFile(file.id));
    tree.appendChild(li);
  });
}

function openFile(fileId) {
  const found = getFileById(fileId);
  if (!found) return;

  activeFileId = fileId;
  activeSection = found.section.id;

  if (!openTabs.includes(fileId)) {
    openTabs.push(fileId);
  }

  renderActivityBar();
  renderExplorer();
  renderTabs();
  renderEditor(found.file);
  updatePrompt(found.file.name);

  // Auto-close the sidebar on mobile once a file is picked, so it doesn't
  // sit on top of the editor with no way to dismiss it.
  if (isMobile()) {
    closeSidebar();
  }
}

function closeTab(fileId, e) {
  e.stopPropagation();
  openTabs = openTabs.filter((id) => id !== fileId);

  if (activeFileId === fileId) {
    const next = openTabs[openTabs.length - 1] || 'welcome';
    openFile(next);
  } else {
    renderTabs();
  }
}

function renderTabs() {
  const tabsEl = document.getElementById('tabs');
  tabsEl.innerHTML = '';

  openTabs.forEach((fileId) => {
    const found = getFileById(fileId);
    if (!found) return;

    const tab = document.createElement('div');
    tab.className = `tab${fileId === activeFileId ? ' active' : ''}`;
    tab.innerHTML = `
      <span class="tab-icon">${getFileIcon(found.file.name)}</span>
      <span class="tab-name">${found.file.name}</span>
      <span class="tab-close">×</span>
    `;
    tab.addEventListener('click', () => openFile(fileId));
    tab.querySelector('.tab-close').addEventListener('click', (e) => closeTab(fileId, e));
    tabsEl.appendChild(tab);
  });
}

function classifyLine(line) {
  if (!line.trim()) return 'empty';
  if (/^=+$/.test(line.trim()) || /^-+$/.test(line.trim())) return 'divider';
  if (/^[A-Z\u0600-\u06FF\s—\-'":]+:?\s*$/.test(line.trim()) && line.trim().length < 60 && !line.includes('http')) return 'heading';
  if (/^https?:\/\//.test(line.trim())) return 'url';
  if (line.trim().startsWith('•') || line.trim().startsWith('-') || /^\d+\./.test(line.trim())) return 'bullet';
  if (line.includes('@') && line.includes('.com')) return 'url';
  if (line.startsWith('[') && line.endsWith(']')) return 'meta';
  return 'text';
}

function linkifyLine(line) {
  const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
  if (urlMatch) {
    const url = urlMatch[1];
    return line.replace(url, `<a href="${url}" target="_blank" rel="noopener">${url}</a>`);
  }
  const emailMatch = line.match(/([\w.-]+@[\w.-]+\.\w+)/);
  if (emailMatch) {
    const email = emailMatch[1];
    return line.replace(email, `<a href="mailto:${email}">${email}</a>`);
  }
  return escapeHtml(line);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function injectBookOrder(lines) {
  const googleForm = data.bookOrder?.googleForm?.trim();
  return lines.map((line) => {
    if (line.includes('[ Your Google Form link goes here')) {
      return googleForm
        ? `Google Form: ${googleForm}`
        : '[ Your Google Form link goes here — edit content.json → bookOrder.googleForm ]';
    }
    return line;
  });
}

function renderEditor(file) {
  let lines = injectBookOrder([...file.lines]);
  const lineNumbersEl = document.getElementById('lineNumbers');
  const contentEl = document.getElementById('editorContent');
  const minimapEl = document.getElementById('minimap');

  lineNumbersEl.innerHTML = '';
  contentEl.innerHTML = '';
  minimapEl.innerHTML = '';

  if (file.image) {
    const imgWrap = document.createElement('div');
    imgWrap.className = 'editor-image';
    const img = document.createElement('img');
    img.src = file.image;
    img.alt = file.name;
    img.onerror = () => {
      imgWrap.className = 'editor-image placeholder';
      imgWrap.innerHTML = `📷 Drop your image at <strong>${file.image}</strong>`;
    };
    imgWrap.appendChild(img);
    contentEl.appendChild(imgWrap);
  }

  lines.forEach((line, i) => {
    const num = i + 1;
    const numSpan = document.createElement('span');
    numSpan.textContent = num;
    lineNumbersEl.appendChild(numSpan);

    // Line 1 of every file is ALWAYS styled as a heading (yellow),
    // no matter what classifyLine would normally guess from casing/digits.
    const type = i === 0 && line.trim() ? 'heading' : classifyLine(line);
    const lineDiv = document.createElement('div');
    lineDiv.className = `editor-line ${type}`;
    lineDiv.innerHTML = line ? linkifyLine(line) : '&nbsp;';
    contentEl.appendChild(lineDiv);

    const miniLine = document.createElement('div');
    miniLine.className = `minimap-line ${type === 'empty' ? 'empty' : type === 'heading' ? 'heading' : 'content'}`;
    minimapEl.appendChild(miniLine);
  });

  const mode = file.name.endsWith('.md') ? 'Markdown' : file.name.endsWith('.cpp') ? 'C++' : 'Plain Text';
  document.getElementById('statusMode').textContent = mode;
  document.getElementById('statusCursor').textContent = `Ln ${lines.length}, Col 1`;
}

function updatePrompt(fileName) {
  document.getElementById('promptCmd').textContent = `cat ${fileName}`;
}

init();
