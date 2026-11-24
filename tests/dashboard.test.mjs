import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../pages/dashboard.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
test('indicadores do painel são preenchidos pela função existente', () => {
  for (const id of ['dash-total-produtos','dash-categorias','dash-estoque-baixo','dash-revenue','dash-margin','dash-quantidade-highlight']) {
    assert.match(html, new RegExp(`id="${id}"`));
    assert.ok(app.includes(`'${id}'`));
  }
});
test('gráficos e tabelas usam os dados existentes sem dados fictícios', () => {
  for (const id of ['dash-category-bars','dash-status-donut','dash-low-stock-body','dash-recent-body']) assert.ok(html.includes(`id="${id}"`));
  assert.match(app, /products\.forEach\(produto/);
  assert.match(app, /\[\.\.\.movimentosEstoque\]/);
});
test('estilos responsivos e escuros estão presentes', () => {
  assert.match(css, /\.cl-dash-metrics/);
  assert.match(css, /\[data-theme="dark"\] #page-dashboard/);
  assert.match(css, /prefers-reduced-motion/);
});
