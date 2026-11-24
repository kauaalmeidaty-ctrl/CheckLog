/* Melhorias visuais sem escrita no Firebase ou alteração das regras de acesso. */
(() => {
  'use strict';
  const links = () => [...document.querySelectorAll('#header-menu a[data-page]')];
  const search = document.getElementById('cl-menu-search');
  if (search) {
    search.addEventListener('input', () => {
      const query = search.value.trim().toLocaleLowerCase('pt-BR');
      links().forEach(link => {
        const matches = link.textContent.toLocaleLowerCase('pt-BR').includes(query);
        link.style.display = matches ? '' : 'none';
      });
    });
    search.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return;
      const first = links().find(link => link.style.display !== 'none' && !link.hidden && getComputedStyle(link).display !== 'none');
      if (first) { first.click(); search.value = ''; search.dispatchEvent(new Event('input')); }
    });
  }
  const sourceIds = ['home-critical-count','home-supplier-count','home-order-count','home-activity-count'];
  const targetIds = ['cl-summary-critical','cl-summary-suppliers','cl-summary-orders','cl-summary-activity'];
  const labels = ['Críticos','Fornecedores','Encomendas','Movimentos'];
  let lastValues = '';
  function update() {
    const source = sourceIds.map(id => document.getElementById(id));
    const target = targetIds.map(id => document.getElementById(id));
    if (source.some(el => !el) || target.some(el => !el)) return;
    const values = source.map(el => Math.max(0, Number(el.textContent.trim()) || 0));
    const signature = values.join(',');
    if (signature === lastValues) return;
    lastValues = signature;
    values.forEach((value, i) => { target[i].textContent = value.toLocaleString('pt-BR'); });
    const ring = document.getElementById('cl-health-number');
    if (ring) ring.textContent = values[0].toLocaleString('pt-BR');
    const chart = document.getElementById('cl-metric-chart');
    if (!chart) return;
    chart.replaceChildren();
    const max = Math.max(1,...values);
    values.forEach((value, i) => {
      const column = document.createElement('div'); column.className='cl-chart-column';
      const amount=document.createElement('strong'); amount.textContent=value.toLocaleString('pt-BR');
      const bar=document.createElement('div'); bar.className='cl-bar'; bar.style.height=`${Math.max(3,Math.round(value/max*125))}px`;
      const label=document.createElement('small'); label.textContent=labels[i];
      column.append(amount,bar,label); chart.append(column);
    });
  }
  // Observa somente os quatro números já calculados pelo aplicativo.
  const observer = new MutationObserver(update);
  function connect() {
    const source = sourceIds.map(id => document.getElementById(id));
    if (source.some(el => !el)) return false;
    source.forEach(el => observer.observe(el,{childList:true,characterData:true,subtree:true}));
    update(); return true;
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',connect,{once:true});
  else connect();
  // As páginas são carregadas dinamicamente; observa a inserção uma única vez.
  const loader = new MutationObserver(() => { if(connect()) loader.disconnect(); });
  if (!sourceIds.every(id=>document.getElementById(id))) loader.observe(document.getElementById('page-module-host') || document.body,{childList:true,subtree:true});
})();
