import { getTutorialItems, canShowTutorial } from './tutorial-data.js';

export function setupTutorial({ button, overlay, content, close, isAuthenticated, isAdmin }) {
  if (!button || !overlay || !content || !close) return { sync() {}, close() {} };
  const dialog = overlay.querySelector('.tutorial-dialog');
  const title = overlay.querySelector('#tutorial-title');
  const next = document.getElementById('tutorial-next');
  const previous = document.getElementById('tutorial-previous');
  const skip = document.getElementById('tutorial-skip');
  const counter = document.getElementById('tutorial-counter');
  const spotlight = overlay.querySelector('.tutorial-spotlight');
  let index = 0, steps = [], highlighted = null, lastFocus = null;
  let frame = 0;
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  function positionSpotlight() {
    if (overlay.hidden || !spotlight || !highlighted?.isConnected) return;
    const r = highlighted.getBoundingClientRect();
    const pad = 9;
    spotlight.style.left = `${Math.max(4, r.left - pad)}px`;
    spotlight.style.top = `${Math.max(4, r.top - pad)}px`;
    spotlight.style.width = `${Math.max(0, Math.min(innerWidth - 8, r.right + pad) - Math.max(4, r.left - pad))}px`;
    spotlight.style.height = `${Math.max(0, Math.min(innerHeight - 8, r.bottom + pad) - Math.max(4, r.top - pad))}px`;
  }
  function updateSpotlight() { cancelAnimationFrame(frame); frame = requestAnimationFrame(positionSpotlight); }
  window.addEventListener('resize', updateSpotlight);
  window.addEventListener('scroll', updateSpotlight, true);
  const allowed = () => canShowTutorial(isAuthenticated());
  function clearHighlight() {
    if (highlighted) highlighted.classList.remove('tour-highlight');
    highlighted = null;
  }
  function hide() {
    if (overlay.hidden) return;
    clearHighlight();
    cancelAnimationFrame(frame);
    spotlight?.classList.remove('is-visible');
    overlay.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (lastFocus?.isConnected && !lastFocus.hidden) lastFocus.focus();
  }
  function sync() {
    button.hidden = !allowed();
    if (!allowed()) hide();
    else if (!overlay.hidden && !isAdmin() && steps.some(step => step.admin)) hide();
  }
  function render() {
    if (!allowed()) return hide();
    const item = steps[index];
    if (!item) return hide();
    clearHighlight();
    spotlight?.classList.remove('is-visible');
    // A navegação existente continua aplicando todas as regras de acesso.
    if (typeof window.navigate === 'function') window.navigate(item.page);
    title.textContent = item.title;
    content.replaceChildren();
    const location = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = 'Onde encontrar: ';
    location.append(strong, document.createTextNode(item.location));
    const list = document.createElement('ol');
    item.steps.forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      list.append(li);
    });
    content.append(location, list);
    counter.textContent = `Etapa ${index + 1} de ${steps.length}`;
    previous.disabled = index === 0;
    next.textContent = index === steps.length - 1 ? 'Concluir' : 'Próximo';
    // Destaque visual da área principal, sem capturar cliques ou executar ações.
    const page = document.getElementById(`page-${item.page}`);
    const target = page?.querySelector(item.target || 'h1, h2, .page-title, .section-title, .card') || page;
    if (target) {
      highlighted = target;
      highlighted.classList.add('tour-highlight');
      target.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'instant' : 'smooth' });
      updateSpotlight();
      requestAnimationFrame(() => spotlight?.classList.add('is-visible'));
      if (!reducedMotion) setTimeout(updateSpotlight, 360);
    }
    dialog?.classList.remove('tour-enter');
    void dialog?.offsetWidth;
    dialog?.classList.add('tour-enter');
    dialog?.focus();
  }
  function start() {
    if (!allowed()) return sync();
    steps = getTutorialItems(true, Boolean(isAdmin()));
    if (!steps.length) return;
    lastFocus = document.activeElement;
    index = 0;
    overlay.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    render();
  }
  button.addEventListener('click', start);
  close.addEventListener('click', hide);
  skip?.addEventListener('click', hide);
  next?.addEventListener('click', () => { if (index + 1 >= steps.length) hide(); else { index++; render(); } });
  previous?.addEventListener('click', () => { if (index > 0) { index--; render(); } });
  document.addEventListener('keydown', event => {
    if (overlay.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); hide(); }
    if (event.key === 'Tab') {
      const focusable = [...overlay.querySelectorAll('button:not([disabled])')].filter(el => !el.hidden);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  sync();
  return { sync, close: hide };
}
