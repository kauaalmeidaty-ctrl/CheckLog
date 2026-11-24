import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
const management = readFileSync(new URL('../pages/gerenciamento-ponto.html', import.meta.url), 'utf8');

test('dashboard atualiza diretamente os quatro indicadores novos', () => {
  for (const id of ['neon-products','cl-summary-critical','cl-summary-orders','cl-summary-suppliers']) {
    assert.match(app, new RegExp(`'${id}'`));
  }
  assert.match(app, /atualizarDashboardNeon\(\);/);
});

test('registro de ponto usa chave segura no fluxo V7', () => {
  assert.match(app, /function chavePontoFirebaseSegura/);
  assert.match(app, /const pontoKey = chavePontoFirebaseSegura\(uid, dataRegistro, momento\)/);
});

test('registro de ponto usa timestamp numérico sincronizado e não placeholder .sv na transação', () => {
  assert.match(app, /timestampMs:\s*instanteRegistro\.getTime\(\)/);
  const submit = app.slice(app.indexOf("formPonto.addEventListener('submit'"), app.indexOf('// Gestão e auditoria de ponto.'));
  assert.doesNotMatch(submit, /timestampMs:\s*serverTimestamp\(\)/);
});

test('Painel de Gestão coloca Espelho e Auditoria na mesma coluna', () => {
  const main = management.indexOf('management-main-column');
  const mirror = management.indexOf('ponto-detalhado data-panel', main);
  const audit = management.indexOf('point-audit-panel', main);
  const rail = management.indexOf('management-rail', main);
  assert.ok(main >= 0 && mirror > main && audit > mirror && rail > audit);
  assert.match(css, /\.management-main-column[\s\S]*display:\s*grid/);
});

test('Justificativas usa grid nivelado e responsivo', () => {
  assert.match(css, /#page-justificativas \.request-grid:not\(\.list-view\)/);
  assert.match(css, /grid-auto-rows:\s*1fr/);
  assert.match(css, /@media \(max-width: 720px\)[\s\S]*#page-justificativas \.request-grid:not\(\.list-view\)/);
});
