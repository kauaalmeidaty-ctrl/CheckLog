import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = path => readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('menu lateral preserva rotas e controle de acesso',()=>{const html=read('index.html'); assert.match(html,/id="header-menu"/);assert.match(html,/data-admin-only="true"/);assert.match(read('css/style.css'),/body\.has-sidebar \.header-menu/);});
test('indicadores refletem IDs existentes do Firebase sem escrita',()=>{const js=read('js/layout-enhancements.js');assert.match(js,/home-critical-count/);assert.match(js,/MutationObserver/);assert.doesNotMatch(js,/setDoc|addDoc|updateDoc|deleteDoc/);});
test('tour e preferências permanecem no layout',()=>{const html=read('index.html');assert.match(html,/id="tutorial-toggle"/);assert.match(html,/id="settings-toggle"/);});
