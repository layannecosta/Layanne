// ─── ESCAPE HTML (previne XSS) ───
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── DATA ATUAL ───
const today = new Date().toISOString().split('T')[0];
document.getElementById('propDate').value = today;

// ─── ADICIONAR ITEM ───
function addItem() {
  const list = document.getElementById('itemsList');
  const row = document.createElement('div');
  row.className = 'item-row';
  row.innerHTML = `
    <input type="text" placeholder="Descrição do serviço" class="item-desc" />
    <input type="text" placeholder="R$ 0,00" class="item-value" />
    <button class="btn-remove" onclick="this.parentElement.remove()">×</button>
  `;
  list.appendChild(row);
}

// 3 itens padrão ao carregar
addItem(); addItem(); addItem();

// ─── UTILITÁRIOS ───
function calcTotal(items) {
  let total = 0;
  items.forEach(item => {
    const clean = item.val.replace(/[^\d,\.]/g, '').replace(/,/g, '.');
    const num = parseFloat(clean);
    if (!isNaN(num)) total += num;
  });
  return total;
}

function formatCurrency(val) {
  const num = parseFloat(val.replace(/[^\d,]/g, '').replace(',', '.'));
  if (isNaN(num)) return val;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function genNumber() {
  const d = new Date();
  return `${String(d.getFullYear()).slice(2)}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(Math.floor(Math.random()*99)+1).padStart(2,'0')}`;
}

function calcValidity(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + parseInt(days || 7));
  return date.toLocaleDateString('pt-BR');
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

// ─── GERAR PROPOSTA ───
function generateProposal() {
  const clientName  = escapeHtml(document.getElementById('clientName').value || 'Cliente');
  const projectName = escapeHtml(document.getElementById('projectName').value || 'Projeto');
  const propDate    = document.getElementById('propDate').value;
  const validity    = escapeHtml(document.getElementById('validity').value || '7');
  const projectDesc = escapeHtml(document.getElementById('projectDesc').value).replace(/\n/g, '<br>');
  const obs         = escapeHtml(document.getElementById('obs').value).replace(/\n/g, '<br>');

  const rows = document.querySelectorAll('.item-row');
  const items = [];
  rows.forEach(row => {
    const desc = escapeHtml(row.querySelector('.item-desc').value.trim());
    const val  = escapeHtml(row.querySelector('.item-value').value.trim());
    if (desc) items.push({ desc, val });
  });

  let tableRows = '';
  items.forEach((item, i) => {
    tableRows += `
      <tr>
        <td style="color:#888; font-size:0.75rem; width:40px;">${String(i+1).padStart(2,'0')}</td>
        <td>${item.desc}</td>
        <td>${item.val ? formatCurrency(item.val) : '—'}</td>
      </tr>`;
  });

  if (!tableRows) {
    tableRows = `<tr><td colspan="3" style="text-align:center; color:#aaa; padding:2rem;">Nenhum item adicionado</td></tr>`;
  }

  const descBlock = projectDesc ? `
    <div class="proposal__description">
      <p>${projectDesc}</p>
    </div>` : '';

  const obsBlock = obs ? `
    <div class="proposal__obs">
      <p>${obs}</p>
    </div>` : '';

  const total = calcTotal(items);
  const totalDisplay = total > 0
    ? total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : '—';

  const html = `
    <div class="proposal">
      <div class="proposal__accent-bar"></div>
      <div class="proposal__header">
        <div>
          <div class="proposal__brand">Layanne<span>.</span></div>
          <div class="proposal__brand-sub">Diretora de Arte</div>
        </div>
        <div>
          <div class="proposal__label">Proposta Comercial</div>
          <div class="proposal__number">#${genNumber()}</div>
        </div>
      </div>

      <div class="proposal__body">
        <div class="proposal__client-block">
          <div>
            <div class="proposal__field-label">Cliente</div>
            <div class="proposal__field-value large">${clientName}</div>
          </div>
          <div>
            <div class="proposal__field-label">Projeto</div>
            <div class="proposal__field-value large">${projectName}</div>
          </div>
          <div>
            <div class="proposal__field-label">Data</div>
            <div class="proposal__field-value">${formatDate(propDate)}</div>
          </div>
          <div>
            <div class="proposal__field-label">Válida até</div>
            <div class="proposal__field-value">${calcValidity(propDate, validity)}</div>
          </div>
        </div>

        ${descBlock}

        <div class="proposal__items-title">Escopo de serviços</div>
        <table class="proposal__table">
          <thead>
            <tr>
              <th style="width:40px;">#</th>
              <th>Serviço</th>
              <th style="text-align:right;">Valor</th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>

        <div class="proposal__total-block">
          <div class="proposal__total">
            <div class="proposal__total-label">Total do projeto</div>
            <div class="proposal__total-value">${totalDisplay}</div>
          </div>
        </div>

        ${obsBlock}

        <div class="proposal__footer">
          <div class="proposal__footer-contact">
            contato@layannecosta.com.br<br>
            linkedin.com/in/layannecosta<br>
            layannecosta.com.br
          </div>
          <div class="proposal__footer-validity">
            Proposta válida por ${validity} dias
            <span>até ${calcValidity(propDate, validity)}</span>
          </div>
        </div>
      </div>
      <div class="proposal__accent-bar"></div>
    </div>`;

  document.getElementById('proposalOutput').innerHTML = html;
  document.getElementById('previewActions').style.display = 'flex';
}

// ─── LIMPAR ───
function clearProposal() {
  document.getElementById('proposalOutput').innerHTML = `
    <div class="empty-state">
      <div class="empty-state__icon">📄</div>
      <p>Preencha os dados ao lado e clique em <strong>Gerar proposta</strong> para visualizar.</p>
    </div>`;
  document.getElementById('previewActions').style.display = 'none';
}
