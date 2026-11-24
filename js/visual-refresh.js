/* Melhorias progressivas: sem escrita no Firebase ou mudanças de autenticação. */
(() => {
 'use strict';
 const init = () => {
   const host=document.getElementById('page-module-host') || document.getElementById('app-content');
   if(!host) return;
   const decorate=() => {
     host.querySelectorAll('.page').forEach(page => {
       if(page.dataset.clDecorated==='true') return;
       page.dataset.clDecorated='true';
       page.querySelectorAll('form').forEach(form => {
         if(form.id==='formCadastro') {
           const fields=form.querySelector('.campos');
           if(fields && !form.querySelector('.cl-form-tip')) {
             const note=document.createElement('p');note.className='cl-form-tip';
             note.textContent='Etapa 1: informe a matrícula e busque os dados. Etapa 2: confira o movimento e confirme com sua senha.';
             fields.before(note);
           }
         }
         form.querySelectorAll('input,select,textarea').forEach(field=>{
           if(field.hasAttribute('required')) field.closest('.field,.input-caixa,.field-span-2')?.classList.add('cl-required-field');
         });
       });
       const emptyTables=page.querySelectorAll('tbody');
       emptyTables.forEach(tbody=>{
         if(tbody.dataset.clEmptyReady) return;
         tbody.dataset.clEmptyReady='true';
         const table=tbody.closest('table');
         if(!table) return;
         const wrap=table.closest('.table-wrapper') || table.parentElement;
         if(!wrap) return;
         const message=document.createElement('div');message.className='cl-table-empty';message.hidden=true;
         message.innerHTML='<img src="img/illustrations/vazio.svg" alt="" width="110" height="80"><strong>Nenhum registro para mostrar</strong><span>Os dados aparecerão aqui quando estiverem disponíveis.</span>';
         wrap.append(message);
         const check=()=>{const hasData=[...tbody.children].some(row=>row.querySelectorAll('td').length && !row.querySelector('[colspan]'));message.hidden=hasData || !!tbody.textContent.trim() && tbody.querySelector('tr')?.querySelectorAll('td').length===0;};
         new MutationObserver(check).observe(tbody,{childList:true,subtree:true,characterData:true});check();
       });
     });
   };
   decorate();new MutationObserver(decorate).observe(host,{childList:true,subtree:true});
   const updateClock=()=>{document.querySelectorAll('#cl-live-clock').forEach(clock=>{clock.textContent=new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date());});};updateClock();setInterval(updateClock,1000);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
