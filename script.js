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
 
  // ===== 4. Mensagem de sucesso =====
  const nome = document.getElementById('nome').value.trim();
  sucessoTitulo.textContent = `Agendamento recebido, ${nome}!`;
  form.hidden = true;
  sucesso.hidden = false;
  sucesso.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
 
document.getElementById('novoAgendamento').addEventListener('click', () => {
  form.reset();
  sucesso.hidden = true;
  form.hidden = false;
});
 
// ===== 5. Filtro da galeria =====
const botoesFiltro = document.querySelectorAll('.filtro');
const fotos = document.querySelectorAll('.foto');
 
botoesFiltro.forEach((botao) => {
  botao.addEventListener('click', () => {
    botoesFiltro.forEach((b) => b.classList.remove('ativo'));
    botao.classList.add('ativo');
 
    const filtro = botao.dataset.filtro;
    fotos.forEach((foto) => {
      const mostrar = filtro === 'todos' || foto.dataset.categoria === filtro;
      foto.classList.toggle('escondida', !mostrar);
    });
  });
});
 
// ===== 6. Ano automático no rodapé =====
document.getElementById('ano').textContent = new Date().getFullYear();
 