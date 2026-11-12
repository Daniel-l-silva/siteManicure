// =====================================================
// CONFIGURAÇÃO: coloque aqui o número do WhatsApp da Bella Mãos
// Formato: 55 + DDD + número, só dígitos. Exemplo: '5511999998888'
// =====================================================
const WHATSAPP = '5516996469913';

const numeroConfigurado = () => /^\d{12,13}$/.test(WHATSAPP);

// Abre o WhatsApp com a mensagem pronta. Devolve true se abriu.
function abrirWhatsapp(texto, elementoErro) {
  if (!numeroConfigurado()) {
    elementoErro.textContent = 'Falta configurar o número do WhatsApp no arquivo script.js.';
    return false;
  }
  elementoErro.textContent = '';
  const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank', 'noopener');
  return true;
}

// Botão flutuante do WhatsApp usa o mesmo número
if (numeroConfigurado()) {
  document.querySelector('.whats').href =
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá! Quero agendar um horário.')}`;
}

// ===== 1. Menu mobile (hambúrguer) =====
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', () => {
  const aberto = menu.classList.toggle('aberto');
  menuBtn.setAttribute('aria-expanded', aberto);
});

// ===== 2. Rolagem suave + fechar menu ao clicar =====
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (evento) => {
    const destino = document.querySelector(link.getAttribute('href'));
    if (!destino) return;
    evento.preventDefault();
    destino.scrollIntoView({ behavior: 'smooth' });
    menu.classList.remove('aberto');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

// ===== 3. Validação do formulário =====
const form = document.getElementById('formAgenda');
const sucesso = document.getElementById('sucesso');
const sucessoTitulo = document.getElementById('sucessoTitulo');

// Não permite escolher datas passadas
const campoData = document.getElementById('data');
const hoje = new Date();
const hojeTexto = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
campoData.min = hojeTexto;

function mostrarErro(idCampo, mensagem) {
  const campo = document.getElementById(idCampo);
  const erro = document.getElementById('erro-' + idCampo);
  erro.textContent = mensagem;
  campo.classList.toggle('invalido', mensagem !== '');
  return mensagem === '';
}

function validarFormulario() {
  const nome = document.getElementById('nome').value.trim();
  const telefone = document.getElementById('telefone').value.replace(/\D/g, '');
  const data = campoData.value;
  const horario = document.getElementById('horario').value;

  const nomeOk = mostrarErro('nome', nome.length >= 3 ? '' : 'Digite seu nome (mínimo 3 letras).');
  const telOk = mostrarErro('telefone', telefone.length === 10 || telefone.length === 11 ? '' : 'Telefone com DDD (10 ou 11 dígitos).');

  let dataMsg = '';
  if (!data) dataMsg = 'Escolha uma data.';
  else if (data < hojeTexto) dataMsg = 'A data não pode ser no passado.';
  const dataOk = mostrarErro('data', dataMsg);

  const horarioOk = mostrarErro('horario', horario ? '' : 'Escolha um horário.');

  return nomeOk && telOk && dataOk && horarioOk;
}

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  if (!validarFormulario()) return;

  const nome = document.getElementById('nome').value.trim();
  const [ano, mes, dia] = campoData.value.split('-');
  const obs = document.getElementById('obs').value.trim();

  // ===== 4. Envio para o WhatsApp =====
  const mensagem = [
    'Olá! Quero agendar um horário na Bella Mãos.',
    '',
    `Nome: ${nome}`,
    `Telefone: ${document.getElementById('telefone').value.trim()}`,
    `Serviço: ${document.getElementById('servico').value}`,
    `Data: ${dia}/${mes}/${ano}`,
    `Horário: ${document.getElementById('horario').value}`,
    obs ? `Observações: ${obs}` : ''
  ].filter((linha, i) => linha !== '' || i === 1).join('\n');

  if (!abrirWhatsapp(mensagem, document.getElementById('erro-envio'))) return;

  // Mensagem de sucesso
  sucessoTitulo.textContent = `Pedido pronto, ${nome}!`;
  form.hidden = true;
  sucesso.hidden = false;
  sucesso.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

document.getElementById('novoAgendamento').addEventListener('click', () => {
  form.reset();
  sucesso.hidden = true;
  form.hidden = false;
});



// ===== 5. Galeria (fotos vêm das pastas) =====
// COMO ADICIONAR FOTOS:
// 1) Coloque a imagem na pasta da categoria:  img/francesinha/  img/nailart/  img/gel/
// 2) Escreva o nome do arquivo na lista da categoria abaixo (com a extensão).
// Exemplo:  francesinha: ['foto1.jpg', 'foto2.jpg'],
// Enquanto uma lista estiver vazia, aparecem blocos coloridos no lugar das fotos.
const FOTOS= {
  francesinha: ['fibra1.jpg', 'fibra2.jpg'],
  nailart: ['nail art/nailart2.jpg', 'nailart3.jpg'],
  gel: ['gel1.jpg']
};
 
const NOMES = { francesinha: 'Francesinha', nailart: 'Nail art', gel: 'Gel' };
const CORES = { francesinha: 'f1', nailart: 'f2', gel: 'f3' };
const galeriaGrid = document.getElementById('galeriaGrid');
 
function criarFoto(categoria, arquivo, numero) {
  const figura = document.createElement('figure');
  figura.className = 'foto';
  figura.dataset.categoria = categoria;
 
  if (arquivo) {
    const img = document.createElement('img');
    img.src = `img/${categoria}/${arquivo}`;
    img.alt = `${NOMES[categoria]} - foto ${numero}`;
    img.loading = 'lazy';
    figura.appendChild(img);
  } else {
    figura.classList.add(CORES[categoria]);
    figura.setAttribute('role', 'img');
    figura.setAttribute('aria-label', `Espaço para foto de ${NOMES[categoria]}`);
  }
 
  const legenda = document.createElement('figcaption');
  legenda.textContent = NOMES[categoria];
  figura.appendChild(legenda);
  return figura;
}
 
Object.keys(FOTOS).forEach((categoria) => {
  const lista = FOTOS[categoria];
  if (lista.length === 0) {
    // sem fotos ainda: mostra 2 blocos de exemplo
    galeriaGrid.appendChild(criarFoto(categoria, null, 1));
    galeriaGrid.appendChild(criarFoto(categoria, null, 2));
  } else {
    lista.forEach((arquivo, i) => galeriaGrid.appendChild(criarFoto(categoria, arquivo, i + 1)));
  }
});
 
// Filtro da galeria
const botoesFiltro = document.querySelectorAll('.filtro');
 
botoesFiltro.forEach((botao) => {
  botao.addEventListener('click', () => {
    botoesFiltro.forEach((b) => b.classList.remove('ativo'));
    botao.classList.add('ativo');
 
    const filtro = botao.dataset.filtro;
    galeriaGrid.querySelectorAll('.foto').forEach((foto) => {
      const mostrar = filtro === 'todos' || foto.dataset.categoria === filtro;
      foto.classList.toggle('escondida', !mostrar);
    });
  });
});
 
// Abrir e fechar a galeria (só no celular; no computador ela já fica aberta)
const galeriaSecao = document.getElementById('galeria');
const galeriaToggle = document.getElementById('galeriaToggle');
const ehCelular = () => window.matchMedia('(max-width: 768px)').matches;
 
function abrirGaleria(abrir) {
  galeriaSecao.classList.toggle('aberta', abrir);
  galeriaToggle.setAttribute('aria-expanded', abrir);
  galeriaToggle.textContent = abrir ? 'Fechar fotos' : 'Ver fotos';
}
 
galeriaToggle.addEventListener('click', () => {
  abrirGaleria(!galeriaSecao.classList.contains('aberta'));
});
 
// Tocar em "Galeria" no menu também abre as fotos no celular
document.querySelectorAll('a[href="#galeria"]').forEach((link) => {
  link.addEventListener('click', () => { if (ehCelular()) abrirGaleria(true); });
});
// ===== 6. Calculadora de orçamento =====
const itensOrcamento = document.querySelectorAll('#orcamento input[type="checkbox"]');
const totalEl = document.getElementById('total');
const orcMsg = document.getElementById('orcMsg');
const moeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const marcados = () => [...itensOrcamento].filter((item) => item.checked);

function atualizarTotal() {
  const total = marcados().reduce((soma, item) => soma + Number(item.dataset.preco), 0);
  totalEl.textContent = moeda(total);
  orcMsg.textContent = '';
}
itensOrcamento.forEach((item) => item.addEventListener('change', atualizarTotal));

document.getElementById('orcamentoBtn').addEventListener('click', () => {
  const escolhidos = marcados();
  if (escolhidos.length === 0) {
    orcMsg.textContent = 'Marque pelo menos um serviço.';
    return;
  }
  const linhas = escolhidos.map((item) => `- ${item.dataset.nome} (${moeda(Number(item.dataset.preco))})`);
  abrirWhatsapp(
    `Olá! Quero um orçamento na Bella Mãos:\n${linhas.join('\n')}\n\nTotal estimado: ${totalEl.textContent}`,
    orcMsg
  );
});

// ===== 7. Modo escuro (lembra a escolha) =====
const temaBtn = document.getElementById('temaBtn');

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-tema', tema);
  temaBtn.textContent = tema === 'escuro' ? 'Modo claro' : 'Modo escuro';
  temaBtn.setAttribute('aria-pressed', tema === 'escuro');
}

aplicarTema(document.documentElement.getAttribute('data-tema') || 'claro');

temaBtn.addEventListener('click', () => {
  const novo = document.documentElement.getAttribute('data-tema') === 'escuro' ? 'claro' : 'escuro';
  aplicarTema(novo);
  try { localStorage.setItem('tema', novo); } catch (e) {}
});

// ===== 8. Ano automático no rodapé =====
document.getElementById('ano').textContent = new Date().getFullYear();