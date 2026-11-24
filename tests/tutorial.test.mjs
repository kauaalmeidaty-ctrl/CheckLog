import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getTutorialItems, canShowTutorial } from '../js/tutorial-data.js';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = readFileSync(new URL('../js/tutorial.js', import.meta.url), 'utf8');
test('botão e modal existem e começam ocultos', () => {
  assert.match(html, /id="tutorial-toggle"[^>]*hidden/);
  assert.match(html, /id="tutorial-overlay"[^>]*hidden/);
});
test('usuário não autenticado não tem acesso ao tutorial', () => {
  assert.equal(canShowTutorial(false), false);
  assert.deepEqual(getTutorialItems(false, true), []);
});
test('colaborador não vê funções administrativas', () => {
  const items = getTutorialItems(true, false);
  assert.ok(items.length > 0);
  assert.ok(items.every(item => !item.admin));
});
test('administrador vê funções operacionais e de gestão', () => {
  assert.ok(getTutorialItems(true, true).some(item => item.admin));
});
test('há eventos para abrir, fechar e bloquear acesso', () => {
  assert.match(js, /button\.addEventListener\('click'/);
  assert.match(js, /close\.addEventListener\('click', hide\)/);
  assert.match(js, /event\.key === 'Escape'/);
  assert.match(js, /if \(!allowed\(\)\) return sync\(\)/);
});

test('tour navega por telas e oferece controles completos', () => {
  for (const id of ['tutorial-previous','tutorial-next','tutorial-skip','tutorial-counter']) assert.ok(html.includes(`id="${id}"`));
  assert.match(js, /window\.navigate\(item\.page\)/);
  assert.match(js, /getTutorialItems\(true, Boolean\(isAdmin\(\)\)\)/);
});

test('spotlight acompanha a tela e tem contraste nos dois temas', () => {
  const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
  assert.match(html, /class="tutorial-spotlight"/);
  assert.match(js, /positionSpotlight/);
  assert.match(js, /addEventListener\('resize', updateSpotlight\)/);
  assert.match(css, /\[data-theme="dark"\] \.tutorial-spotlight/);
  assert.match(css, /prefers-reduced-motion:reduce/);
});
