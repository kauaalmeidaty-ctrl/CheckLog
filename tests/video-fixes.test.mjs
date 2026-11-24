import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const meu = readFileSync(new URL('../pages/meu-checklog.html', import.meta.url), 'utf8');

test('busca do cabeçalho fica contida no próprio card', () => {
  assert.match(index, /class="cl-header-search"/);
  assert.match(css, /\.cl-header-search[\s\S]*overflow:\s*hidden/);
  assert.match(css, /\.cl-header-search input[\s\S]*max-width:\s*100%/);
  assert.match(css, /\.cl-header-search input[\s\S]*padding:\s*0\s*!important/);
});

test('hover de ações rápidas usa fundo suave por tema', () => {
  assert.match(css, /\[data-theme="light"\] \.neon-action-grid button:hover/);
  assert.match(css, /\[data-theme="dark"\] \.neon-action-grid button:hover/);
  assert.match(css, /#10b981 5%/);
  assert.match(css, /#34d399 7%/);
});

test('Meu CheckLog coloca espelho e acompanhamento na mesma coluna', () => {
  assert.match(meu, /class="personal-main-column"/);
  const main = meu.indexOf('class="personal-main-column"');
  const records = meu.indexOf('personal-records-panel', main);
  const requests = meu.indexOf('personal-requests-panel', main);
  const aside = meu.indexOf('class="personal-side"', main);
  assert.ok(records > main && requests > records && aside > requests);
});

test('páginas internas recebem ilustrações contextuais', () => {
  for (const file of ['meu-checklog.html','justificativas.html','gerenciamento-ponto.html','dashboard.html','relatorios.html']) {
    const html = readFileSync(new URL(`../pages/${file}`, import.meta.url), 'utf8');
    assert.match(html, /cl-module-visual/);
    assert.match(html, /img\/illustrations\/(?:ponto|estoque)\.svg/);
  }
});
