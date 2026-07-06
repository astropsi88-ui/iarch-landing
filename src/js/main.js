const PRICES = {
  companion: 'от 180 000 ₽',
  partner: 'от 240 000 ₽',
  coauthor: 'от 280 000 ₽',
  persona: 'от 340 000 ₽',
  start: '30 000 ₽',
  support: 'от 45 000 ₽/мес',
  transfer: 'по оценке'
};

const SITE_LINKS = {
  telegram: 'https://t.me/astropsi88',
  privacy: '#privacy'
};

const CHAT_QUICK_BUTTONS = [
  'Кем может быть мой ArchAI?',
  'Как устроена память?',
  'Можно ли сделать голос?',
  'Что с резервными копиями?'
];

const VIKA_REPLIES = [
  'Я могу быть спокойным собеседником, рабочим напарником или голосом проекта — роль проектируется под вашу реальность.',
  'Память собирается структурно: важные факты, предпочтения, контекст и границы, чтобы не начинать каждый разговор заново.',
  'Голос возможен как отдельный сценарий. Никакой звук не запускается автоматически — только по вашему действию.',
  'Мы закладываем регулярные резервные копии и возможность переноса на сервер владельца.'
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function setPrices() {
  $$('[data-price]').forEach((node) => {
    node.textContent = PRICES[node.dataset.price] || '';
  });
}

function setLinks() {
  $$('[data-site-link]').forEach((node) => {
    const href = SITE_LINKS[node.dataset.siteLink];
    if (href) node.setAttribute('href', href);
  });
}

function initMenu() {
  const toggle = $('[data-menu-toggle]');
  const menu = $('[data-menu]');
  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Открыть меню');
  };
  const openMenu = () => {
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Закрыть меню');
  };

  toggle.addEventListener('click', () => (menu.classList.contains('is-open') ? closeMenu() : openMenu()));
  menu.addEventListener('click', (event) => {
    if (event.target.matches('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

function initVideoFallback() {
  const video = $('[data-vika-video]');
  const fallback = $('[data-video-fallback]');
  if (!video || !fallback) return;

  const showFallback = () => {
    fallback.hidden = false;
    video.hidden = true;
  };
  const showVideo = () => {
    fallback.hidden = true;
    video.hidden = false;
  };

  video.addEventListener('loadedmetadata', showVideo, { once: true });
  video.addEventListener('error', showFallback, { once: true });
  window.setTimeout(() => {
    if (!video.readyState) showFallback();
  }, 700);
}

function initChat() {
  const messages = $('[data-chat-messages]');
  const quick = $('[data-chat-quick]');
  const form = $('[data-chat-form]');
  const input = $('[data-chat-input]');
  if (!messages || !quick || !form || !input) return;

  const addMessage = (text, type = 'vika') => {
    const bubble = document.createElement('div');
    bubble.className = `msg msg--${type}`;
    bubble.textContent = text;
    messages.append(bubble);
    messages.scrollTop = messages.scrollHeight;
  };
  const reply = (seed = '') => {
    const index = Math.max(0, CHAT_QUICK_BUTTONS.findIndex((item) => seed.includes(item)));
    addMessage(VIKA_REPLIES[index] || VIKA_REPLIES[0], 'vika');
  };

  addMessage('Привет. Я Вика — демонстрационный образ ArchAI. Можем мягко наметить, какая AI-личность нужна именно вам.', 'vika');
  CHAT_QUICK_BUTTONS.forEach((label) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', () => {
      addMessage(label, 'user');
      reply(label);
    });
    quick.append(button);
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    reply(text);
  });
}

function initAccordions() {
  $$('.build-card__toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const card = button.closest('.build-card');
      const isOpen = card.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(isOpen));
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    $$('.build-card.is-open').forEach((card) => {
      card.classList.remove('is-open');
      $('.build-card__toggle', card)?.setAttribute('aria-expanded', 'false');
    });
    $$('details[open]').forEach((detail) => detail.removeAttribute('open'));
  });
}

function initCookie() {
  const banner = $('[data-cookie]');
  const accept = $('[data-cookie-accept]');
  if (!banner || !accept) return;
  if (localStorage.getItem('archai_cookie_ok') !== 'yes') banner.hidden = false;
  accept.addEventListener('click', () => {
    localStorage.setItem('archai_cookie_ok', 'yes');
    banner.hidden = true;
  });
}

function init() {
  setPrices();
  setLinks();
  initMenu();
  initVideoFallback();
  initChat();
  initAccordions();
  initCookie();
  $('[data-year]').textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', init);
