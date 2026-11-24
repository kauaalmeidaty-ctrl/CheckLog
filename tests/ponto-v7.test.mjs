import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const app = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const rules = readFileSync(new URL('../database.rules.json', import.meta.url), 'utf8');
test('ponto V7 não depende de controles_ponto durante o submit', () => {
  const start = app.indexOf("const formPonto = document.getElementById('formCadastro');");
  const end = app.indexOf('// Gestão e auditoria de ponto.', start);
  const bloco = app.slice(start, end);
  assert.doesNotMatch(bloco, /adquirirControleRegistroPonto/);
  assert.doesNotMatch(bloco, /controleToken/);
});
test('chave do ponto V7 usa apenas caracteres ASCII seguros', () => {
  assert.match(app, /function chavePontoFirebaseSegura/);
});
test('regras V7 não exigem controleToken no registro de máquina', () => {
  const registroRules = rules.slice(rules.indexOf('"registros_ponto"'), rules.indexOf('"controles_ponto"'));
  assert.doesNotMatch(registroRules, /controleToken/);
  assert.doesNotMatch(registroRules, /root\.child\('controles_ponto'\)/);
});
