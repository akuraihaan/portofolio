import { supabase } from './supabase.js'
const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const themeToggle = document.querySelector('[data-theme-toggle]');
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'light') root.dataset.theme = 'light';

function updateThemeLabel() {
  const isLight = root.dataset.theme === 'light';
  themeToggle?.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
}
updateThemeLabel();
themeToggle?.addEventListener('click', () => {
  const isLight = root.dataset.theme === 'light';
  root.dataset.theme = isLight ? 'dark' : 'light';
  localStorage.setItem('portfolio-theme', isLight ? 'dark' : 'light');
  updateThemeLabel();
});

const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');
function closeMenu() {
  menuToggle?.classList.remove('is-open');
  mobileNav?.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open menu');
}
menuToggle?.addEventListener('click', () => {
  const isOpen = mobileNav?.classList.toggle('is-open');
  menuToggle.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});
mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const header = document.querySelector('[data-header]');
const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 30);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const reveals = document.querySelectorAll('[data-reveal]');
if (reduceMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = entry.target.dataset.revealDelay;
      if (delay) entry.target.style.transitionDelay = `${delay}ms`;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  reveals.forEach((element) => revealObserver.observe(element));
}

const roleElement = document.querySelector('[data-role]');
let roles = [];
try {
  roles = roleElement?.dataset.roles ? JSON.parse(roleElement.dataset.roles) : [];
} catch {
  roles = [];
}
if (roleElement && roles.length) {
  let roleIndex = 0;
  let characterIndex = 0;
  let deleting = false;
  const typeRole = () => {
    const role = roles[roleIndex];
    if (!deleting) {
      characterIndex += 1;
      roleElement.textContent = role.slice(0, characterIndex);
      if (characterIndex === role.length) {
        deleting = true;
        window.setTimeout(typeRole, 1700);
        return;
      }
    } else {
      characterIndex -= 1;
      roleElement.textContent = role.slice(0, characterIndex);
      if (characterIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    window.setTimeout(typeRole, deleting ? 45 : 80);
  };
  if (!reduceMotion) typeRole();
}

const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('[data-project]');
filterButtons.forEach((button) => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  projectCards.forEach((card) => {
    const matches = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('is-hidden', !matches);
  });
}));

const dialog = document.querySelector('[data-project-dialog]');
const dialogTitle = document.querySelector('[data-dialog-title]');
const dialogType = document.querySelector('[data-dialog-type]');
const dialogDescription = document.querySelector('[data-dialog-description]');
const dialogReel = document.querySelector('[data-dialog-reel]');
const toast = document.querySelector('[data-toast]');
let toastTimer;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
}
projectCards.forEach((card) => card.addEventListener('click', () => {
  if (!dialog) return;
  dialogTitle.textContent = card.dataset.title;
  dialogType.textContent = card.dataset.type;
  dialogDescription.textContent = card.dataset.description;
  dialogReel.textContent = card.dataset.reel;
  dialog.showModal();
}));
document.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog?.close());
document.querySelector('[data-dialog-contact]')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

const form = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    formStatus.textContent = 'Please complete the required fields.';
    form.reportValidity();
    return;
  }
  formStatus.textContent = 'Thanks — your note is ready to send. I’ll be in touch soon.';
  showToast('Message captured locally for this demo.');
  form.reset();
});

document.querySelector('[data-copy-email]')?.addEventListener('click', async (event) => {
  const email = event.currentTarget.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    showToast('Email copied to clipboard.');
  } catch {
    showToast(email);
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
  const targetId = link.getAttribute('href');
  if (!targetId || targetId === '#') return;
  const target = document.querySelector(targetId);
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}));

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
async function checkCurrentSession() {
  const {
    data: { session },
    error
  } = await supabase.auth.getSession()

  if (error) {
    console.error('Gagal membaca sesi:', error)
    return
  }

  console.log('Sesi Supabase:', session)
}

checkCurrentSession()