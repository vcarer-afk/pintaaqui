import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  Droplet, 
  FileText, 
  Check, 
  Copy, 
  Phone, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  RotateCcw, 
  ClipboardCheck,
  Zap,
  Download,
  Printer,
  Shield,
  Eye,
  X,
  Share2,
  Cloud,
  History,
  Trash2,
  LogIn,
  Save,
  Plus,
  Calendar,
  DollarSign,
  User,
  MapPin,
  RefreshCw,
  ExternalLink,
  Code,
  Key,
  Lock,
  Mail,
  UserCheck
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { aplicarMascaraTelefone } from '../lib/phoneMask';
import { LISTA_EPIS_CONFIG, DEFAULT_EPI_FOTOS, carregarFotosEpisSalvas } from '../lib/epiFotos';
import { 
  obterUsuarioLogadoSupabase, 
  salvarOrcamentoNuvem, 
  salvarOrcamento,
  consultarHistoricoOrcamentosNuvem, 
  consultarHistorico,
  excluirOrcamentoNuvem, 
  loginSupabaseAuth,
  cadastrarSupabaseAuth,
  OrcamentoCompleto, 
  ItemOrcamento 
} from '../lib/supabase';

// Tipos de superfícies para o cálculo
type TipoSuperficie = 'alvenaria_reboco' | 'alvenaria_repintura' | 'gesso_drywall' | 'madeira' | 'metal';

interface SuperficieConfig {
  nome: string;
  descricao: string;
  rendimentoBaseM2PorLitro: number; // m² por litro por demão
  fatorPrimeiraDemao: number; // multiplicador de consumo para 1ª demão
}

const SUPERFICIES: Record<TipoSuperficie, SuperficieConfig> = {
  alvenaria_reboco: {
    nome: 'Alvenaria / Reboco Novo (Poroso)',
    descricao: 'Superfície crua com alta absorção; puxa mais produto na primeira demão.',
    rendimentoBaseM2PorLitro: 8.5,
    fatorPrimeiraDemao: 1.25,
  },
  alvenaria_repintura: {
    nome: 'Repintura / Parede com Massa / Selada',
    descricao: 'Parede já preparada, lisa ou repintura; excelente rendimento.',
    rendimentoBaseM2PorLitro: 12.0,
    fatorPrimeiraDemao: 1.0,
  },
  gesso_drywall: {
    nome: 'Gesso Corrido / Placas de Drywall',
    descricao: 'Absorção moderada a alta; requer fundo preparador para uniformizar.',
    rendimentoBaseM2PorLitro: 10.0,
    fatorPrimeiraDemao: 1.15,
  },
  madeira: {
    nome: 'Madeira (Lixada e Aparelhada)',
    descricao: 'Para esmaltes e vernizes; absorção nas fibras da madeira.',
    rendimentoBaseM2PorLitro: 11.0,
    fatorPrimeiraDemao: 1.1,
  },
  metal: {
    nome: 'Metal / Aço / Portões e Grades',
    descricao: 'Sem absorção na superfície; rendimento alto com foco em cobertura.',
    rendimentoBaseM2PorLitro: 13.0,
    fatorPrimeiraDemao: 1.0,
  },
};

interface FerramentasProfissionalProps {
  epiFotosCustom?: Record<number, string>;
  onAbrirLoginPintor?: () => void;
  onAbrirCadastroPintor?: () => void;
}

export const FerramentasProfissional: React.FC<FerramentasProfissionalProps> = ({ 
  epiFotosCustom,
  onAbrirLoginPintor,
  onAbrirCadastroPintor
}) => {
  // Aba ativa nas 5 ferramentas
  const [abaAtiva, setAbaAtiva] = useState<'calculadora' | 'diluicao' | 'orcamento' | 'epis' | 'postura'>('calculadora');

  // Fotos de EPIs sincronizadas
  const [fotosEpis, setFotosEpis] = useState<Record<number, string>>(epiFotosCustom || carregarFotosEpisSalvas());
  const [modalFotoEpiZoom, setModalFotoEpiZoom] = useState<{ url: string; titulo: string; desc: string } | null>(null);

  // Sincroniza fotos se prop mudar ou via evento local
  useEffect(() => {
    if (epiFotosCustom && Object.keys(epiFotosCustom).length > 0) {
      setFotosEpis(epiFotosCustom);
    }
  }, [epiFotosCustom]);

  useEffect(() => {
    const handleStorage = () => {
      setFotosEpis(carregarFotosEpisSalvas());
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('pintaaqui_epis_updated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('pintaaqui_epis_updated', handleStorage);
    };
  }, []);

  // --- ESTADOS DA CALCULADORA DE RENDIMENTO ---
  const [areaMetros, setAreaMetros] = useState<number>(65);
  const [superficie, setSuperficie] = useState<TipoSuperficie>('alvenaria_repintura');
  const [numeroDemaos, setNumeroDemaos] = useState<number>(2);
  const [incluirMargemPerda, setIncluirMargemPerda] = useState<boolean>(true); // 10% de margem técnica

  // Cálculo de consumo
  const calculoConsumo = useMemo(() => {
    const config = SUPERFICIES[superficie];
    const rendimentoLitro = config.rendimentoBaseM2PorLitro;
    
    let litrosTotais = 0;
    for (let d = 1; d <= numeroDemaos; d++) {
      const fatorDemao = d === 1 ? config.fatorPrimeiraDemao : 1.0;
      litrosTotais += (areaMetros / rendimentoLitro) * fatorDemao;
    }

    if (incluirMargemPerda) {
      litrosTotais *= 1.10; // +10% de margem para recortes e perdas de rolo
    }

    litrosTotais = Math.max(0.5, Math.round(litrosTotais * 10) / 10);

    let restante = litrosTotais;
    const latas18 = Math.floor(restante / 18);
    restante = restante % 18;

    const galoes36 = Math.floor(restante / 3.6);
    restante = restante % 3.6;

    const quartos09 = Math.ceil(restante / 0.9);

    return {
      litrosTotais,
      areaTotalAplicada: areaMetros * numeroDemaos,
      latas18,
      galoes36,
      quartos09,
    };
  }, [areaMetros, superficie, numeroDemaos, incluirMargemPerda]);

  // --- ESTADOS DO GUIA DE DILUIÇÃO ---
  const [filtroDiluicao, setFiltroDiluicao] = useState<'todos' | 'agua' | 'solvente'>('todos');

  const tabelaDiluicao = useMemo(() => {
    const itens = [
      {
        produto: 'Tinta Acrílica Premium (Fosco, Semibrilho ou Acetinado)',
        categoria: 'agua',
        diluicao: '10% a 20%',
        diluente: 'Água potável limpa',
        ferramenta: 'Rolo de lã baixa (9mm a 12mm)',
        detalhe: 'Diluir a 20% na 1ª demão sobre parede selada para boa penetração; diluir a 10% a 15% nas demãos de acabamento para máxima cobertura e lavabilidade.',
        alerta: 'Nunca use água de poço com excesso de cloro ou ferro; pode alterar a tonalidade de cores claras.'
      },
      {
        produto: 'Tinta Acrílica Standard',
        categoria: 'agua',
        diluicao: '10% a 15%',
        diluente: 'Água potável limpa',
        ferramenta: 'Rolo de microfibra ou lã média',
        detalhe: 'Possui menor teor de sólidos que a Premium. Excesso de água corta o filme e gera manchas translúcidas e sombra de rolo.',
        alerta: 'Não ultrapasse 15%; diluição excessiva exige uma demão extra para cobrir.'
      },
      {
        produto: 'Fundo Preparador de Paredes (Base Água)',
        categoria: 'agua',
        diluicao: '10% a 20% (ou pronto para uso)',
        diluente: 'Água potável limpa',
        ferramenta: 'Trincha larga ou rolo antigota',
        detalhe: 'Imprescindível em reboco esfarelado, gesso cru e cal. Ele agrega as partículas soltas e uniformiza a absorção.',
        alerta: 'Não deixe formar filme vitrificado/brilhante. Se a parede ficar com aspecto envernizado, lixe antes de pintar.'
      },
      {
        produto: 'Esmalte Sintético Convencional',
        categoria: 'solvente',
        diluicao: '10% (Pincel/Rolo) | até 20% (Pistola)',
        diluente: 'Aguarrás Mineral Pura',
        ferramenta: 'Rolo de espuma densa / Trincha cerda macia',
        detalhe: 'Para portas, janelas e ferragens. A aguarrás garante o nivelamento das marcas de pincel antes da secagem ao toque.',
        alerta: 'JAMAIS use Thinner em esmalte sintético tradicional! O thinner enruga, queima a resina e tira o brilho do esmalte.'
      },
      {
        produto: 'Verniz Marítimo / Copal / Poliuretano',
        categoria: 'solvente',
        diluicao: '1ª demão: 20% a 30% | Demãos seguintes: 10%',
        diluente: 'Aguarrás Mineral',
        ferramenta: 'Trincha de cerdas naturais especiais',
        detalhe: 'A 1ª demão bem diluída entra profundamente nos veios da madeira crua, ancorando o acabamento definitivo.',
        alerta: 'Madeira deve estar com umidade abaixo de 15% e livre de ceras antigas.'
      },
      {
        produto: 'Selador Acrílico',
        categoria: 'agua',
        diluicao: '10% a 15%',
        diluente: 'Água potável',
        ferramenta: 'Rolo de lã alta (19mm a 22mm)',
        detalhe: 'Uso exclusivo em reboco novo e totalmente curado (mínimo 28 dias). Serve para selar os poros e economizar na tinta de acabamento.',
        alerta: 'Não use sobre gesso ou massa corrida.'
      }
    ];

    if (filtroDiluicao === 'todos') return itens;
    return itens.filter(i => i.categoria === filtroDiluicao);
  }, [filtroDiluicao]);

  // --- ESTADOS DO GERADOR DE ORÇAMENTO ---
  const [orcNomeCliente, setOrcNomeCliente] = useState('Dona Helena Ribeiro');
  const [orcTelefone, setOrcTelefone] = useState('(11) 9.8765.4321');
  const [orcCidade, setOrcCidade] = useState('São Paulo - SP (Bairro Pinheiros)');
  const [orcAmbientes, setOrcAmbientes] = useState('Sala de estar integrada, corredor de circulação e 2 dormitórios');
  const [orcPrazo, setOrcPrazo] = useState('6 dias úteis');
  const [orcValorMaoDeObra, setOrcValorMaoDeObra] = useState('R$ 3.400,00');
  const [orcFormaPagamento, setOrcFormaPagamento] = useState('30% de entrada no início dos trabalhos, 40% na etapa de lixamento e 30% na entrega e vistoria final');
  const [orcValidade, setOrcValidade] = useState('15 dias corridos');
  const [orcEtapas, setOrcEtapas] = useState<string[]>([
    'Proteção completa do piso, rodapés, caixilhos e móveis com lona e fita crepe de precisão',
    'Raspagem e remoção de partes soltas ou estufadas',
    'Aplicação de Fundo Preparador de Paredes nas áreas frágeis',
    'Emassamento com 2 demãos de massa corrida para nivelamento fino',
    'Lixamento aspirado mecanizado com iluminação rasante para eliminar imperfeições',
    'Aplicação de 2 a 3 demãos de tinta acrílica de acabamento até cobertura total',
    'Limpeza técnica diária e entrega final do ambiente impecável'
  ]);
  const [novaEtapaInput, setNovaEtapaInput] = useState('');
  const [copiadoFeedback, setCopiadoFeedback] = useState(false);
  const [pdfFeedback, setPdfFeedback] = useState(false);

  // --- ESTADOS DA INTEGRAÇÃO SUPABASE (NUVEM & AUTH) ---
  const [salvandoNuvem, setSalvandoNuvem] = useState(false);
  const [orcFeedbackMsg, setOrcFeedbackMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [modalLoginAvisoAberto, setModalLoginAvisoAberto] = useState(false);
  const [modalHistoricoAberto, setModalHistoricoAberto] = useState(false);
  const [historicoOrcamentos, setHistoricoOrcamentos] = useState<OrcamentoCompleto[]>([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState<{ autenticado: boolean; userId?: string; nome?: string; email?: string }>({ autenticado: false });

  // Estados do Modal Rápido de Login/Cadastro do Pintor
  const [modalLoginTab, setModalLoginTab] = useState<'entrar' | 'cadastrar'>('entrar');
  const [modalLoginEmail, setModalLoginEmail] = useState('');
  const [modalLoginSenha, setModalLoginSenha] = useState('');
  const [modalLoginNome, setModalLoginNome] = useState('');
  const [modalLoginLoading, setModalLoginLoading] = useState(false);
  const [modalLoginFeedback, setModalLoginFeedback] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Estados do Modal de Visualização do Código do Script Supabase (<script>)
  const [modalVerCodigoAberto, setModalVerCodigoAberto] = useState(false);
  const [codigoJsCopiado, setCodigoJsCopiado] = useState(false);

  // Código JavaScript limpo e comentado para inserção na tag <script>
  const codigoScriptSupabaseCompleto = `<!-- ======================================================== -->
<!-- INTEGRAÇÃO DO GERADOR DE ORÇAMENTOS COM O SUPABASE (JS) -->
<!-- PINTA AQUI (www.pintaaqui.com.br) • Módulo Profissional  -->
<!-- ======================================================== -->

<!-- 1. Importação da biblioteca oficial do Supabase -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"><\\/script>

<script>
  // Inicialização do cliente Supabase
  const SUPABASE_URL = "https://fhjzbyacxbdnprpqmwmo.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  /**
   * 1. VERIFICAÇÃO DE SESSÃO (LOGIN)
   * Verifica se o pintor está autenticado via Supabase Auth.
   * Se não estiver, exibe um aviso amigável ou o modal rápido de login/cadastro.
   */
  async function verificarSessaoPintor() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      console.warn("Nenhum usuário logado no momento.");
      // Exibe modal de identificação antes de salvar
      abrirModalLoginCadastro();
      return null;
    }

    return session.user; // Retorna o usuário com user.id para RLS
  }

  /**
   * 2. FUNÇÃO DE SALVAR NA NUVEM (salvarOrcamento)
   * - Captura os dados do cabeçalho (nome do cliente, telefone, endereço, totais).
   * - Insere na tabela 'orcamentos' recuperando o ID gerado.
   * - Percorre a lista de itens locais ('itens_orcamento') e insere vinculando ao ID.
   * - Trata erros com mensagens claras para o usuário.
   */
  async function salvarOrcamento() {
    try {
      // 1. Verifica se o pintor está conectado
      const usuario = await verificarSessaoPintor();
      if (!usuario) return;

      // 2. Captura os dados do cabeçalho do formulário
      const cabecalho = {
        user_id: usuario.id, // RLS: auth.uid() = user_id
        nome_cliente: document.getElementById('orcNomeCliente').value.trim(),
        telefone_cliente: document.getElementById('orcTelefone').value.trim(),
        endereco_cliente: document.getElementById('orcEndereco').value.trim(),
        cidade_cliente: document.getElementById('orcCidade').value.trim(),
        prazo_dias: document.getElementById('orcPrazo').value.trim(),
        valor_total: document.getElementById('orcValorTotal').value.trim(),
        forma_pagamento: document.getElementById('orcFormaPagamento').value.trim(),
        validade_proposta: document.getElementById('orcValidade').value.trim() || '15 dias corridos',
        status: 'ativo'
      };

      if (!cabecalho.nome_cliente) {
        alert("Atenção: Por favor, informe o nome do cliente.");
        return;
      }

      // 3. Insere na tabela 'orcamentos' recuperando o ID gerado
      const { data: orcamentoCriado, error: erroCabecalho } = await supabase
        .from('orcamentos')
        .insert([cabecalho])
        .select('id')
        .single();

      if (erroCabecalho) {
        throw new Error("Erro ao salvar cabeçalho: " + erroCabecalho.message);
      }

      const orcamentoId = orcamentoCriado.id;

      // 4. Captura os itens locais (itens_orcamento)
      const itensLocais = window.itensOrcamentoAtuais || [];

      if (itensLocais.length > 0) {
        const payloadItens = itensLocais.map((item, index) => ({
          orcamento_id: orcamentoId, // Vinculação com o ID gerado
          descricao: item.descricao || item,
          tipo: item.tipo || 'etapa_preparacao',
          valor: item.valor || '',
          ordem: index + 1
        }));

        // 5. Insere os itens vinculados na tabela 'itens_orcamento'
        const { error: erroItens } = await supabase
          .from('itens_orcamento')
          .insert(payloadItens);

        if (erroItens) {
          console.warn("Aviso ao salvar itens vinculados:", erroItens.message);
        }
      }

      // Notificação clara de sucesso
      alert("Orçamento salvo com sucesso na nuvem!");
      console.log("Orçamento gravado com ID:", orcamentoId);

    } catch (erro) {
      console.error("Falha ao salvar orçamento:", erro);
      alert("Erro ao salvar orçamento: " + erro.message);
    }
  }

  /**
   * 3. CONSULTA DE HISTÓRICO (BÔNUS)
   * Busca no Supabase todos os orçamentos salvos pelo pintor logado (user_id),
   * permitindo consultar propostas antigas e seus itens.
   */
  async function consultarHistorico() {
    try {
      const usuario = await verificarSessaoPintor();
      if (!usuario) return [];

      const { data: orcamentos, error } = await supabase
        .from('orcamentos')
        .select(\`
          *,
          itens:itens_orcamento(*)
        \`)
        .eq('user_id', usuario.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      console.log("Histórico carregado:", orcamentos);
      return orcamentos;

    } catch (erro) {
      console.error("Erro ao consultar histórico:", erro);
      return [];
    }
  }
<\\/script>`;

  // Verifica sessão ao inicializar
  useEffect(() => {
    checarSessaoSupabase();
  }, []);

  const checarSessaoSupabase = async () => {
    const sessao = await obterUsuarioLogadoSupabase();
    setUsuarioLogado(sessao);
    return sessao;
  };

  // Alternar etapa do orçamento
  const toggleEtapaOrcamento = (etapa: string) => {
    setOrcEtapas(prev => 
      prev.includes(etapa) ? prev.filter(e => e !== etapa) : [...prev, etapa]
    );
  };

  // Adicionar etapa customizada
  const handleAdicionarEtapaCustom = () => {
    if (!novaEtapaInput.trim()) return;
    if (!orcEtapas.includes(novaEtapaInput.trim())) {
      setOrcEtapas(prev => [...prev, novaEtapaInput.trim()]);
    }
    setNovaEtapaInput('');
  };

  // Preencher modelo real com 1 clique
  const preencherExemploOrcamento = () => {
    setOrcNomeCliente('Doutor Marcelo Ramos');
    setOrcTelefone('(11) 9.9988.7766');
    setOrcCidade('São Paulo - SP (Moema)');
    setOrcAmbientes('Apartamento 92m²: Living ampliado, cozinha americana, suíte master e varanda gourmet');
    setOrcPrazo('8 dias úteis');
    setOrcValorMaoDeObra('R$ 4.800,00');
    setOrcFormaPagamento('Pix: 30% no início da proteção, 40% no acabamento fino e 30% na entrega com vistoria técnica');
    setOrcValidade('15 dias');
    setOrcEtapas([
      'Proteção completa do piso, rodapés, caixilhos e móveis com lona e fita crepe de precisão',
      'Raspagem e remoção de partes soltas ou estufadas',
      'Tratamento de trincas dinâmicas com selante elástico e tela de poliéster',
      'Aplicação de Fundo Preparador de Paredes nas áreas frágeis',
      'Emassamento com 2 demãos de massa corrida para nivelamento fino',
      'Lixamento aspirado mecanizado com iluminação rasante para eliminar imperfeições',
      'Aplicação de 2 a 3 demãos de tinta acrílica de acabamento até cobertura total',
      'Pintura de portas de madeira e batentes com esmalte',
      'Limpeza técnica diária e entrega final do ambiente impecável'
    ]);
  };

  // Texto formatado pronto para copiar ou WhatsApp
  const textoOrcamentoFormatado = useMemo(() => {
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const etapasFormatadas = orcEtapas.map((e, idx) => `  ${idx + 1}. [OK] ${e}`).join('\n');

    return `*=============================================*
*PROPOSTA TÉCNICA E ORÇAMENTO DE PINTURA*
*PINTA AQUI PRO • PADRÃO PROFISSIONAL*
*=============================================*

*Data de Emissão:* ${dataAtual}
*Validade da Proposta:* ${orcValidade}

*1. DADOS DO CLIENTE & LOCAL DA OBRA:*
*Cliente:* ${orcNomeCliente}
*Telefone/WhatsApp:* ${orcTelefone}
*Localidade:* ${orcCidade}

*2. ESCOPO DOS AMBIENTES:*
${orcAmbientes}

*3. ETAPAS DE PREPARAÇÃO & EXECUÇÃO TÉCNICA:*
${etapasFormatadas}

*Prazo Estimado de Execução:* ${orcPrazo}

*4. INVESTIMENTO & FORMA DE PAGAMENTO:*
*Valor Total da Mão de Obra:* ${orcValorMaoDeObra}
*Condição:* ${orcFormaPagamento}

*5. DISPOSIÇÕES GERAIS:*
• Os materiais de pintura (tintas, massas, lixas e fitas) serão fornecidos pelo cliente conforme relação técnica fornecida pelo pintor.
• Ambiente será mantido isolado e limpo ao fim de cada expediente de trabalho.
• Vistoria final conjunta realizada sob iluminação antes da liberação e quitação.

_Elaborado através do Portal Pinta Aqui (www.pintaaqui.com.br) - Valorizando a Pintura Profissional._`;
  }, [orcNomeCliente, orcTelefone, orcCidade, orcValidade, orcAmbientes, orcEtapas, orcPrazo, orcValorMaoDeObra, orcFormaPagamento]);

  // Copiar para a área de transferência
  const copiarTextoOrcamento = async () => {
    try {
      await navigator.clipboard.writeText(textoOrcamentoFormatado);
      setCopiadoFeedback(true);
      setTimeout(() => setCopiadoFeedback(false), 3500);
    } catch {
      setCopiadoFeedback(false);
    }
  };

  // Copiar código do script Supabase
  const copiarCodigoScript = async () => {
    try {
      await navigator.clipboard.writeText(codigoScriptSupabaseCompleto);
      setCodigoJsCopiado(true);
      setTimeout(() => setCodigoJsCopiado(false), 3000);
    } catch {
      setCodigoJsCopiado(false);
    }
  };

  // =========================================================================
  // 1. VERIFICAÇÃO DE SESSÃO & 2. SALVAR NA NUVEM (SUPABASE)
  // =========================================================================
  const executarSalvarOrcamento = async (userIdInformado?: string) => {
    // 1. Verificação de Sessão (Login):
    let sessao = await checarSessaoSupabase();
    const userId = userIdInformado || sessao.userId;

    if (!sessao.autenticado && !userId) {
      setModalLoginAvisoAberto(true);
      return;
    }

    setSalvandoNuvem(true);
    setOrcFeedbackMsg(null);

    // 2. Monta o cabeçalho do orçamento (dados do cliente, prazos e totais)
    const orcamentoCabecalho: OrcamentoCompleto = {
      user_id: userId,
      nome_cliente: orcNomeCliente.trim() || 'Cliente sem nome',
      telefone_cliente: orcTelefone,
      endereco_cliente: orcCidade,
      cidade_cliente: orcCidade,
      ambientes: orcAmbientes,
      prazo_dias: orcPrazo,
      valor_total: orcValorMaoDeObra,
      forma_pagamento: orcFormaPagamento,
      validade_proposta: orcValidade,
      status: 'ativo'
    };

    // 3. Monta os itens locais do orçamento (tabela 'itens_orcamento')
    const itensOrcamento: ItemOrcamento[] = orcEtapas.map((etapa, idx) => ({
      descricao: etapa,
      tipo: 'etapa_preparacao',
      ordem: idx + 1
    }));

    // 4. Executa a gravação nas tabelas 'orcamentos' e 'itens_orcamento' vinculando ao ID
    const res = await salvarOrcamento(orcamentoCabecalho, itensOrcamento);
    setSalvandoNuvem(false);

    if (res.success) {
      setOrcFeedbackMsg({
        type: 'success',
        text: 'Orçamento salvo com sucesso na nuvem! O cabeçalho e os itens vinculados foram salvos no Supabase.'
      });
      // Atualiza a lista de histórico em background
      consultarHistorico(userId).then(h => {
        if (h.data) setHistoricoOrcamentos(h.data);
      });
    } else {
      setOrcFeedbackMsg({
        type: 'info',
        text: res.error || 'Aviso: Cópia de segurança salva em seu navegador.'
      });
    }

    setTimeout(() => setOrcFeedbackMsg(null), 8000);
  };

  const handleSalvarOrcamentoNuvem = () => executarSalvarOrcamento();

  // Handler de Login Rápido / Cadastro pelo Modal
  const handleSubmeterModalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoginFeedback(null);

    if (!modalLoginEmail.trim()) {
      setModalLoginFeedback({ text: 'Informe seu e-mail cadastrado.', type: 'error' });
      return;
    }
    if (!modalLoginSenha.trim()) {
      setModalLoginFeedback({ text: 'Digite sua senha.', type: 'error' });
      return;
    }

    setModalLoginLoading(true);

    if (modalLoginTab === 'entrar') {
      const res = await loginSupabaseAuth(modalLoginEmail, modalLoginSenha);
      setModalLoginLoading(false);

      if (res.success && res.user) {
        setModalLoginFeedback({ 
          text: `✓ Bem-vindo(a), ${res.user.nome || res.user.email}! Salvando orçamento na nuvem...`, 
          type: 'success' 
        });
        await checarSessaoSupabase();
        setTimeout(() => {
          setModalLoginAvisoAberto(false);
          setModalLoginFeedback(null);
          executarSalvarOrcamento(res.user.id);
        }, 600);
      } else {
        setModalLoginFeedback({ text: res.error || 'E-mail ou senha inválidos.', type: 'error' });
      }
    } else {
      const res = await cadastrarSupabaseAuth(modalLoginEmail, modalLoginSenha, modalLoginNome);
      setModalLoginLoading(false);

      if (res.success && res.user) {
        setModalLoginFeedback({ 
          text: '✓ Cadastro criado com sucesso no Supabase! Gravando orçamento...', 
          type: 'success' 
        });
        await checarSessaoSupabase();
        setTimeout(() => {
          setModalLoginAvisoAberto(false);
          setModalLoginFeedback(null);
          executarSalvarOrcamento(res.user.id);
        }, 600);
      } else {
        setModalLoginFeedback({ text: res.error || 'Falha ao realizar cadastro.', type: 'error' });
      }
    }
  };

  // Login Instantâneo de Teste / Demonstração (1 clique)
  const handleLoginDemoRapido = async () => {
    setModalLoginLoading(true);
    setModalLoginFeedback(null);
    const res = await loginSupabaseAuth('admin@pintaaqui.com.br', 'dndigqol');
    setModalLoginLoading(false);

    if (res.success && res.user) {
      setModalLoginFeedback({ 
        text: '✓ Conectado como Pintor Master / Demonstração! Salvando orçamento...', 
        type: 'success' 
      });
      await checarSessaoSupabase();
      setTimeout(() => {
        setModalLoginAvisoAberto(false);
        setModalLoginFeedback(null);
        executarSalvarOrcamento(res.user.id);
      }, 500);
    }
  };

  // =========================================================================
  // 3. CONSULTA DE HISTÓRICO DE ORÇAMENTOS (BÔNUS)
  // =========================================================================
  const handleAbrirHistorico = async () => {
    setModalHistoricoAberto(true);
    setCarregandoHistorico(true);
    const sessao = await checarSessaoSupabase();
    const res = await consultarHistoricoOrcamentosNuvem(sessao.userId);
    setHistoricoOrcamentos(res.data);
    setCarregandoHistorico(false);
  };

  const handleCarregarOrcamentoAntigo = (antigo: OrcamentoCompleto) => {
    if (antigo.nome_cliente) setOrcNomeCliente(antigo.nome_cliente);
    if (antigo.telefone_cliente) setOrcTelefone(antigo.telefone_cliente);
    if (antigo.cidade_cliente) setOrcCidade(antigo.cidade_cliente);
    if (antigo.ambientes) setOrcAmbientes(antigo.ambientes);
    if (antigo.prazo_dias) setOrcPrazo(antigo.prazo_dias);
    if (antigo.valor_total) setOrcValorMaoDeObra(antigo.valor_total);
    if (antigo.forma_pagamento) setOrcFormaPagamento(antigo.forma_pagamento);
    if (antigo.validade_proposta) setOrcValidade(antigo.validade_proposta);

    // Se tiver itens vinculados na tabela itens_orcamento, carrega
    if (antigo.itens && antigo.itens.length > 0) {
      setOrcEtapas(antigo.itens.map(i => i.descricao));
    }

    setModalHistoricoAberto(false);
    setOrcFeedbackMsg({
      type: 'success',
      text: `✓ Orçamento do cliente "${antigo.nome_cliente}" carregado no formulário com sucesso!`
    });
    setTimeout(() => setOrcFeedbackMsg(null), 5000);
  };

  const handleExcluirOrcamento = async (id?: string) => {
    if (!id) return;
    if (!confirm('Deseja realmente remover este orçamento do seu histórico?')) return;
    
    await excluirOrcamentoNuvem(id);
    setHistoricoOrcamentos(prev => prev.filter(o => o.id !== id));
  };

  // EXPORTAR ORÇAMENTO PARA PDF PROFISSIONAL COM JSPDF
  const exportarOrcamentoPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const dataAtual = new Date().toLocaleDateString('pt-BR');
      const cleanCliente = orcNomeCliente || 'Cliente';

      // 1. Cabeçalho Superior Estilizado
      doc.setFillColor(28, 25, 23); // stone-900
      doc.rect(0, 0, 210, 32, 'F');

      doc.setFillColor(245, 158, 11); // amber-500
      doc.rect(0, 32, 210, 2, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('PINTA AQUI PRO', 14, 13);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(245, 158, 11);
      doc.text('PROPOSTA COMERCIAL & ORÇAMENTO TÉCNICO DE PINTURA', 14, 19);

      doc.setFontSize(8);
      doc.setTextColor(168, 162, 158);
      doc.text('www.pintaaqui.com.br • Curadoria Técnica de Obras', 14, 25);

      // Data e Validade no topo direito
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text(`Emissão: ${dataAtual}`, 196, 13, { align: 'right' });
      doc.text(`Validade: ${orcValidade}`, 196, 19, { align: 'right' });

      let currentY = 42;

      // 2. Caixa: Dados do Cliente e Local
      doc.setFillColor(245, 245, 244); // stone-100
      doc.setDrawColor(214, 211, 209);
      doc.roundedRect(14, currentY, 182, 24, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(28, 25, 23);
      doc.text('DADOS DO CLIENTE & LOCAL DA OBRA', 18, currentY + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(68, 64, 60);
      doc.text(`Cliente: ${cleanCliente}`, 18, currentY + 12);
      doc.text(`Telefone / WhatsApp: ${orcTelefone}`, 110, currentY + 12);
      doc.text(`Localidade: ${orcCidade}`, 18, currentY + 18);
      doc.text(`Prazo de Execução: ${orcPrazo}`, 110, currentY + 18);

      currentY += 30;

      // 3. Ambientes e Descrição
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(217, 119, 6); // amber-600
      doc.text('1. ESCOPO DOS AMBIENTES', 14, currentY);

      currentY += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(41, 37, 36);

      const ambientesLinhas = doc.splitTextToSize(orcAmbientes || 'Conforme especificado em visita.', 180);
      doc.text(ambientesLinhas, 14, currentY);
      currentY += (ambientesLinhas.length * 4.5) + 6;

      // 4. Etapas Técnicas de Preparação e Execução
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(217, 119, 6);
      doc.text('2. ETAPAS DE PREPARAÇÃO & PINTURA TÉCNICA', 14, currentY);

      currentY += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(41, 37, 36);

      orcEtapas.forEach((etapa, idx) => {
        if (currentY > 250) {
          doc.addPage();
          currentY = 20;
        }
        // Marcador visual
        doc.setFillColor(245, 158, 11);
        doc.circle(16, currentY - 1, 1, 'F');
        const etapaLinhas = doc.splitTextToSize(`${idx + 1}. ${etapa}`, 174);
        doc.text(etapaLinhas, 19, currentY);
        currentY += (etapaLinhas.length * 4) + 1.5;
      });

      currentY += 4;

      // 5. Investimento e Condições Comerciais
      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFillColor(254, 243, 199); // amber-100
      doc.setDrawColor(245, 158, 11);
      doc.roundedRect(14, currentY, 182, 22, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(146, 64, 14); // amber-800
      doc.text('3. INVESTIMENTO & CONDIÇÕES DE PAGAMENTO', 18, currentY + 6);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(28, 25, 23);
      doc.text(`Valor Total da Mão de Obra: ${orcValorMaoDeObra}`, 18, currentY + 13);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(68, 64, 60);
      const pagtoLinhas = doc.splitTextToSize(`Forma de Pagamento: ${orcFormaPagamento}`, 174);
      doc.text(pagtoLinhas, 18, currentY + 18);

      currentY += 28;

      // 6. Disposições Gerais
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(120, 113, 108);
      doc.text('4. DISPOSIÇÕES GERAIS & GARANTIA TÉCNICA', 14, currentY);

      currentY += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(87, 83, 78);
      const termos = [
        '• Os materiais de pintura (tintas, massas e fitas) serão fornecidos pelo contratante conforme relação técnica.',
        '• O ambiente de trabalho será mantido limpo e organizado ao término de cada expediente.',
        '• A vistoria técnica final conjunta será realizada sob iluminação rasante antes da quitação final.'
      ];
      termos.forEach(t => {
        doc.text(t, 14, currentY);
        currentY += 4;
      });

      // 7. Linhas de Assinatura
      currentY += 12;
      if (currentY > 270) {
        doc.addPage();
        currentY = 30;
      }

      doc.setDrawColor(168, 162, 158);
      doc.line(20, currentY, 90, currentY);
      doc.line(120, currentY, 190, currentY);

      doc.setFontSize(7.5);
      doc.setTextColor(120, 113, 108);
      doc.text('Assinatura do Cliente / Contratante', 55, currentY + 4, { align: 'center' });
      doc.text('Assinatura do Pintor Profissional', 155, currentY + 4, { align: 'center' });

      // Salva arquivo com nome limpo
      const fileName = `Orcamento_Pintura_${cleanCliente.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      doc.save(fileName);

      setPdfFeedback(true);
      setTimeout(() => setPdfFeedback(false), 4000);
    } catch (err) {
      console.error('Erro ao gerar PDF do orçamento:', err);
      window.print();
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 text-stone-100 w-full max-w-full overflow-hidden">
      
      {/* Cabeçalho da Seção de Ferramentas (Design Mobile-First sem Estourar Viewport) */}
      <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-amber-500/30 shadow-xl relative overflow-hidden w-full max-w-full">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 shrink-0" />
              <span>Ferramentas Práticas de Campo • Pinta Aqui Pro</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight break-words">
              Arsenal do Pintor de Elite: Ferramentas & Conteúdo de Chão de Obra
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Conteúdo de profissional para profissional. Calcule consumo exato de latas e galões, consulte a diluição química ideal, gere orçamentos integrados ao Supabase com exportação em PDF e domine a etiqueta que fecha contratos de alto padrão.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-mono text-amber-400/90 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              5 Módulos Interativos
            </span>
          </div>
        </div>

        {/* Barra de Abas das 5 Ferramentas (Com Scroll Suave e Zero Quebra Lateral) */}
        <div className="mt-5 pt-4 border-t border-stone-800/80 flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 scroll-smooth w-full max-w-full no-scrollbar">
          <button
            type="button"
            onClick={() => setAbaAtiva('calculadora')}
            className={`py-2.5 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition cursor-pointer ${
              abaAtiva === 'calculadora'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-850 border border-stone-800'
            }`}
          >
            <Calculator className="w-4 h-4 shrink-0" />
            <span>1. Calculadora de Rendimento</span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('diluicao')}
            className={`py-2.5 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition cursor-pointer ${
              abaAtiva === 'diluicao'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-850 border border-stone-800'
            }`}
          >
            <Droplet className="w-4 h-4 shrink-0" />
            <span>2. Guia de Diluição Zero Erro</span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('orcamento')}
            className={`py-2.5 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition cursor-pointer ${
              abaAtiva === 'orcamento'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-850 border border-stone-800'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>3. Modelo de Orçamento (Nuvem & PDF)</span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('epis')}
            className={`py-2.5 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition cursor-pointer ${
              abaAtiva === 'epis'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-850 border border-stone-800'
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span>4. Guia de Segurança & EPIs</span>
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('postura')}
            className={`py-2.5 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition cursor-pointer ${
              abaAtiva === 'postura'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-850 border border-stone-800'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>5. Postura & Dicas de Ouro</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CALCULADORA DE CONSUMO E RENDIMENTO */}
      {/* ========================================================================= */}
      {abaAtiva === 'calculadora' && (
        <div className="bg-stone-950 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-stone-800 shadow-xl space-y-6 w-full max-w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-800">
            <div>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Módulo 01 • Engenharia de Consumo</span>
              <h4 className="text-lg sm:text-2xl font-extrabold text-white mt-0.5">
                Calculadora de Consumo e Rendimento de Tinta
              </h4>
            </div>
            <span className="text-xs text-stone-400 font-mono">
              Base técnica NBR 15079 / 11702
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
            
            {/* Formulário Interativo do Pintor */}
            <div className="lg:col-span-7 space-y-5 w-full min-w-0">
              
              {/* Metragem Quadrada */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <label className="font-bold text-stone-200">
                    Área Total da Parede ou Teto a Pintar:
                  </label>
                  <span className="font-mono text-amber-400 font-bold text-base sm:text-lg">
                    {areaMetros} m²
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={areaMetros}
                    onChange={(e) => setAreaMetros(Number(e.target.value))}
                    className="flex-1 accent-amber-500 h-2 bg-stone-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex items-center gap-1 bg-stone-900 border border-stone-700 rounded-xl px-2.5 py-1.5 shrink-0">
                    <input
                      type="number"
                      min="1"
                      max="2000"
                      value={areaMetros}
                      onChange={(e) => setAreaMetros(Math.max(1, Number(e.target.value)))}
                      className="w-16 bg-transparent text-right font-bold text-amber-400 text-sm focus:outline-hidden"
                    />
                    <span className="text-xs text-stone-400 font-bold">m²</span>
                  </div>
                </div>

                {/* Atalhos Rápidos de Cômodos Comuns */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-stone-400 mr-1">Atalhos rápidos:</span>
                  {[
                    { label: 'Quarto Peq. (30m²)', val: 30 },
                    { label: 'Sala Média (65m²)', val: 65 },
                    { label: 'Apto 2 Qts (160m²)', val: 160 },
                    { label: 'Casa (280m²)', val: 280 }
                  ].map((at, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAreaMetros(at.val)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 font-medium transition cursor-pointer"
                    >
                      {at.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo de Superfície */}
              <div className="space-y-2">
                <label className="font-bold text-stone-200 text-xs sm:text-sm block">
                  Tipo de Superfície (Impacta na absorção e ancoragem):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(SUPERFICIES) as TipoSuperficie[]).map((key) => {
                    const item = SUPERFICIES[key];
                    const selecionado = superficie === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSuperficie(key)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          selecionado
                            ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                            : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:bg-stone-850 hover:border-stone-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs sm:text-sm">{item.nome}</span>
                            {selecionado && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                          </div>
                          <p className="text-[11px] text-stone-400 mt-1 leading-snug line-clamp-2">
                            {item.descricao}
                          </p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-stone-800/80 text-[10px] text-amber-400/90 font-mono">
                          Rendimento: ~{item.rendimentoBaseM2PorLitro} m²/litro
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Número de Demãos */}
              <div className="space-y-2">
                <label className="font-bold text-stone-200 text-xs sm:text-sm block">
                  Número de Demãos Planejadas:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((dem) => (
                    <button
                      key={dem}
                      type="button"
                      onClick={() => setNumeroDemaos(dem)}
                      className={`py-2.5 rounded-xl border font-bold text-xs sm:text-sm flex flex-col items-center justify-center transition cursor-pointer ${
                        numeroDemaos === dem
                          ? 'bg-amber-500 border-amber-400 text-stone-950 font-black shadow-md'
                          : 'bg-stone-900 border-stone-800 text-stone-300 hover:bg-stone-850'
                      }`}
                    >
                      <span>{dem} {dem === 1 ? 'Demão' : 'Demãos'}</span>
                      <span className="text-[10px] uppercase font-normal opacity-80">{dem === 1 ? 'Cobertura prévia' : dem === 2 ? 'Padrão mercado' : 'Mudança de cor'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Margem de Perda e Recortes */}
              <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-xs font-bold text-white block">Adicionar 10% de Margem Técnica</span>
                  <p className="text-[11px] text-stone-400 leading-snug">
                    Compensa recortes de trincha, fita crepe e resíduo retido no rolo e na bandeja.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={incluirMargemPerda}
                  onChange={(e) => setIncluirMargemPerda(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer shrink-0"
                />
              </div>

            </div>

            {/* Painel de Resultados (Cartões Comerciais) */}
            <div className="lg:col-span-5 bg-stone-900/90 rounded-2xl border-2 border-amber-500/40 p-4 sm:p-6 space-y-5 shadow-2xl relative w-full min-w-0">
              <div className="border-b border-stone-800 pb-4">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Resultado Estimado
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">
                    {calculoConsumo.litrosTotais}
                  </span>
                  <span className="text-base text-stone-300 font-bold">Litros de Tinta</span>
                </div>
                <p className="text-xs text-stone-400 mt-1">
                  Para cobrir <strong>{calculoConsumo.areaTotalAplicada} m²</strong> aplicados ({areaMetros}m² × {numeroDemaos} demãos).
                </p>
              </div>

              {/* Recomendação de Latas Comerciais */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-stone-200 block">
                  Embalagens Comerciais Sugeridas para Compra:
                </span>

                <div className="grid grid-cols-3 gap-2 text-center">
                  {/* Lata 18L */}
                  <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col justify-between ${
                    calculoConsumo.latas18 > 0
                      ? 'bg-amber-500/20 border-amber-500/60 text-white'
                      : 'bg-stone-950/70 border-stone-800 text-stone-400'
                  }`}>
                    <span className="text-xl sm:text-2xl font-black text-amber-400">{calculoConsumo.latas18}</span>
                    <span className="text-[11px] font-bold mt-1">Lata 18L</span>
                    <span className="text-[9px] text-stone-400">Balde Maior</span>
                  </div>

                  {/* Galão 3.6L */}
                  <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col justify-between ${
                    calculoConsumo.galoes36 > 0
                      ? 'bg-amber-500/20 border-amber-500/60 text-white'
                      : 'bg-stone-950/70 border-stone-800 text-stone-400'
                  }`}>
                    <span className="text-xl sm:text-2xl font-black text-amber-400">{calculoConsumo.galoes36}</span>
                    <span className="text-[11px] font-bold mt-1">Galão 3.6L</span>
                    <span className="text-[9px] text-stone-400">Padrão Médio</span>
                  </div>

                  {/* Quarto 0.9L */}
                  <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col justify-between ${
                    calculoConsumo.quartos09 > 0
                      ? 'bg-amber-500/20 border-amber-500/60 text-white'
                      : 'bg-stone-950/70 border-stone-800 text-stone-400'
                  }`}>
                    <span className="text-xl sm:text-2xl font-black text-amber-400">{calculoConsumo.quartos09}</span>
                    <span className="text-[11px] font-bold mt-1">Quarto 900ml</span>
                    <span className="text-[9px] text-stone-400">Latas Pequenas</span>
                  </div>
                </div>
              </div>

              {/* Dica de Mestre de Vlademir Carer */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-stone-300 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Pulo do Gato do Vlademir:</span>
                </div>
                <p className="leading-relaxed text-[11px] sm:text-xs">
                  Se a parede for de reboco cru ou gesso, <strong>sempre aplique Fundo Preparador primeiro</strong>. Ele custa menos da metade de uma tinta Premium e evita que a parede "beba" tinta nobre na 1ª demão.
                </p>
              </div>

              <div className="pt-1 text-center">
                <span className="text-[10px] text-stone-400 block">
                  * Valores baseados em produtos das normas NBR 15079 / 11702.
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. GUIA DE DILUIÇÃO "ZERO ERRO" */}
      {/* ========================================================================= */}
      {abaAtiva === 'diluicao' && (
        <div className="bg-stone-950 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-stone-800 shadow-xl space-y-6 w-full max-w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
            <div>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Módulo 02 • Química Prática</span>
              <h4 className="text-lg sm:text-2xl font-extrabold text-white mt-0.5">
                Guia de Diluição "Zero Erro" (Tabela Rápida de Campo)
              </h4>
            </div>

            {/* Filtros da Tabela */}
            <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFiltroDiluicao('todos')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  filtroDiluicao === 'todos' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-white'
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setFiltroDiluicao('agua')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  filtroDiluicao === 'agua' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-white'
                }`}
              >
                Base Água
              </button>
              <button
                type="button"
                onClick={() => setFiltroDiluicao('solvente')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  filtroDiluicao === 'solvente' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-white'
                }`}
              >
                Base Solvente
              </button>
            </div>
          </div>

          {/* Alerta da Regra de Ouro */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 flex items-start gap-3 text-xs sm:text-sm text-stone-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-amber-300 block">REGRA DE OURO DA DILUIÇÃO:</strong>
              <p className="leading-relaxed">
                Água ou aguarrás servem para <strong>ajustar a viscosidade e facilitar o espalhamento do filme</strong>, e nunca para "fazer a tinta render o dobro". Diluir além do limite quebra a cadeia de polímeros da resina, diminui o teor de sólidos e provoca esbranquiçamento (gizamento) prematuro. Na dúvida, consulte sempre a litografia na lata.
              </p>
            </div>
          </div>

          {/* Lista Responsiva sem Quebra de Tela */}
          <div className="space-y-3 w-full">
            {tabelaDiluicao.map((item, idx) => (
              <div 
                key={idx}
                className="bg-stone-900 rounded-2xl border border-stone-800 p-4 sm:p-5 hover:border-amber-500/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4 w-full"
              >
                <div className="space-y-1.5 md:max-w-md min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.categoria === 'agua'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                    }`}>
                      {item.categoria === 'agua' ? '💧 Base Água' : '🧪 Base Solvente'}
                    </span>
                    <h5 className="font-bold text-white text-sm sm:text-base leading-snug break-words">{item.produto}</h5>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">{item.detalhe}</p>
                  <p className="text-[11px] text-amber-400/90 italic font-mono">⚠️ {item.alerta}</p>
                </div>

                {/* Blocos de Informação de Diluição Flexíveis */}
                <div className="grid grid-cols-2 sm:flex sm:flex-nowrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-stone-800/80 w-full md:w-auto">
                  <div className="bg-stone-950 px-3 py-2.5 rounded-xl border border-stone-800 text-center min-w-0 flex-1 sm:min-w-[110px]">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block truncate">Diluição</span>
                    <span className="text-xs sm:text-sm font-black text-amber-400 font-mono">{item.diluicao}</span>
                  </div>

                  <div className="bg-stone-950 px-3 py-2.5 rounded-xl border border-stone-800 text-left min-w-0 flex-1 sm:min-w-[130px]">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block truncate">Diluente</span>
                    <span className="text-xs font-bold text-stone-200 truncate block">{item.diluente}</span>
                  </div>

                  <div className="col-span-2 sm:col-span-1 bg-stone-950 px-3 py-2.5 rounded-xl border border-stone-800 text-left min-w-0 flex-1 sm:min-w-[140px]">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block truncate">Ferramenta</span>
                    <span className="text-xs text-stone-300 truncate block">{item.ferramenta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODELO DE ORÇAMENTO PROFISSIONAL (INTEGRAÇÃO SUPABASE + PDF) */}
      {/* ========================================================================= */}
      {abaAtiva === 'orcamento' && (
        <div className="bg-stone-950 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-stone-800 shadow-xl space-y-6 w-full max-w-full">
          
          {/* Header do Módulo com Botões de Ação */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
            <div>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Módulo 03 • Comercial & Gestão</span>
              <h4 className="text-lg sm:text-2xl font-extrabold text-white mt-0.5">
                Modelo de Orçamento Profissional (Integrado ao Supabase)
              </h4>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={preencherExemploOrcamento}
                className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Carregar exemplo prático de orçamento"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>Exemplo Real</span>
              </button>

              <button
                type="button"
                onClick={handleAbrirHistorico}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 border border-stone-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Consultar orçamentos antigos salvos na nuvem"
              >
                <History className="w-3.5 h-3.5 shrink-0" />
                <span>Histórico na Nuvem</span>
              </button>

              <button
                type="button"
                onClick={() => setModalVerCodigoAberto(true)}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Visualizar código JavaScript limpo com @supabase/supabase-js para tag <script>"
              >
                <Code className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                <span>Código &lt;script&gt;</span>
              </button>

              <button
                type="button"
                onClick={handleSalvarOrcamentoNuvem}
                disabled={salvandoNuvem}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-600/20"
                title="Salvar cabeçalho e itens vinculados no banco de dados do Supabase"
              >
                {salvandoNuvem ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Cloud className="w-4 h-4" />
                )}
                <span>{salvandoNuvem ? "Salvando..." : "Salvar no Supabase"}</span>
              </button>

              <button
                type="button"
                onClick={exportarOrcamentoPDF}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-black flex items-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Exportar PDF</span>
              </button>
            </div>
          </div>

          {/* Feedback de Ação (Salvo na Nuvem / Sucesso / Informação) */}
          {orcFeedbackMsg && (
            <div className={`p-3.5 sm:p-4 rounded-xl border text-xs flex items-center gap-2.5 transition animate-pulse ${
              orcFeedbackMsg.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200'
                : orcFeedbackMsg.type === 'info'
                  ? 'bg-amber-950/90 border-amber-500/60 text-amber-200'
                  : 'bg-red-950/90 border-red-500/60 text-red-200'
            }`}>
              {orcFeedbackMsg.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Cloud className="w-5 h-5 text-amber-400 shrink-0" />
              )}
              <span className="leading-relaxed font-medium">{orcFeedbackMsg.text}</span>
            </div>
          )}

          {pdfFeedback && (
            <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2 animate-pulse">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Proposta comercial gerada e baixada com sucesso em PDF! Arquivo pronto para impressão ou envio por WhatsApp/E-mail.</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
            
            {/* Editor de Campos do Orçamento */}
            <div className="lg:col-span-6 space-y-4 text-xs w-full min-w-0">
              
              <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 space-y-3">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] block">
                  1. Dados do Cliente e Local da Obra (Tabela 'orcamentos'):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Nome do Cliente *</label>
                    <input
                      type="text"
                      value={orcNomeCliente}
                      onChange={(e) => setOrcNomeCliente(e.target.value)}
                      placeholder="Ex: Dra. Mariana Costa"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Telefone / WhatsApp (com máscara) *</label>
                    <input
                      type="text"
                      value={orcTelefone}
                      onChange={(e) => setOrcTelefone(aplicarMascaraTelefone(e.target.value))}
                      placeholder="(11) 9.8765.4321"
                      maxLength={17}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-300 font-medium mb-1">Cidade e Bairro / Endereço Completo *</label>
                    <input
                      type="text"
                      value={orcCidade}
                      onChange={(e) => setOrcCidade(e.target.value)}
                      placeholder="Ex: São Paulo - SP (Jardins)"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 space-y-3">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] block">
                  2. Escopo dos Ambientes e Prazos:
                </span>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Descrição Detalhada dos Cômodos *</label>
                  <textarea
                    rows={2}
                    value={orcAmbientes}
                    onChange={(e) => setOrcAmbientes(e.target.value)}
                    placeholder="Ex: Sala de jantar, corredor, 3 quartos e teto dos banheiros"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-hidden resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Prazo Estimado de Obra *</label>
                    <input
                      type="text"
                      value={orcPrazo}
                      onChange={(e) => setOrcPrazo(e.target.value)}
                      placeholder="Ex: 5 dias úteis"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Valor Total da Mão de Obra (R$) *</label>
                    <input
                      type="text"
                      value={orcValorMaoDeObra}
                      onChange={(e) => setOrcValorMaoDeObra(e.target.value)}
                      placeholder="Ex: R$ 2.800,00"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-amber-400 font-bold focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-300 font-medium mb-1">Forma de Pagamento Combinada *</label>
                    <input
                      type="text"
                      value={orcFormaPagamento}
                      onChange={(e) => setOrcFormaPagamento(e.target.value)}
                      placeholder="Ex: 30% de entrada, 40% no lixamento e 30% na entrega"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Etapas de Preparação & Itens (Tabela 'itens_orcamento') */}
              <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] block">
                    3. Itens do Orçamento ({orcEtapas.length} vinculados a 'itens_orcamento'):
                  </span>
                  <span className="text-[10px] text-stone-400">Marque para incluir</span>
                </div>

                {/* Input para Adicionar Novo Item / Etapa */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={novaEtapaInput}
                    onChange={(e) => setNovaEtapaInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdicionarEtapaCustom()}
                    placeholder="Adicionar serviço ou etapa personalizada..."
                    className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-white text-xs focus:border-amber-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAdicionarEtapaCustom}
                    disabled={!novaEtapaInput.trim()}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Adicionar</span>
                  </button>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {orcEtapas.map((etapa, idx) => (
                    <label key={idx} className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-stone-950 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={orcEtapas.includes(etapa)}
                        onChange={() => toggleEtapaOrcamento(etapa)}
                        className="mt-0.5 accent-amber-500 rounded cursor-pointer shrink-0"
                      />
                      <span className="text-stone-300 text-xs leading-snug flex-1">{etapa}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setOrcEtapas(prev => prev.filter(item => item !== etapa));
                        }}
                        className="text-stone-500 hover:text-red-400 p-0.5"
                        title="Remover item da lista"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Prévia do Card Copiável & Ações de Envio, Nuvem e PDF */}
            <div className="lg:col-span-6 space-y-4 w-full min-w-0">
              
              <div className="bg-stone-900 rounded-2xl border-2 border-stone-700 p-4 sm:p-6 space-y-4 shadow-2xl relative font-sans w-full min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider">
                      Proposta Comercial Formatada
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                    Nuvem & PDF Pronto
                  </span>
                </div>

                <div className="bg-stone-950 p-3 sm:p-4 rounded-xl border border-stone-850 font-mono text-[11px] sm:text-xs text-stone-300 whitespace-pre-wrap leading-relaxed max-h-[380px] sm:max-h-[420px] overflow-y-auto overflow-x-hidden break-words">
                  {textoOrcamentoFormatado}
                </div>

                {/* Botões de Ação Imediata (Salvar no Supabase, PDF, Copiar, WhatsApp) */}
                <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSalvarOrcamentoNuvem}
                    disabled={salvandoNuvem}
                    className="w-full sm:flex-1 py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-lg shadow-emerald-600/20"
                  >
                    {salvandoNuvem ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Cloud className="w-4 h-4" />
                    )}
                    <span>{salvandoNuvem ? "Gravando..." : "Salvar no Supabase"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={exportarOrcamentoPDF}
                    className="w-full sm:flex-1 py-3 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <Download className="w-4 h-4 shrink-0" />
                    <span>Baixar PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={copiarTextoOrcamento}
                    className={`w-full sm:w-auto py-3 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                      copiadoFeedback
                        ? 'bg-emerald-500 text-stone-950 border-emerald-400'
                        : 'bg-stone-950 hover:bg-stone-800 text-stone-200 border-stone-700'
                    }`}
                  >
                    {copiadoFeedback ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3] text-stone-950" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://wa.me/55${orcTelefone.replace(/\D/g, '')}?text=${encodeURIComponent(textoOrcamentoFormatado)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-700/20"
                  >
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-900/60 border border-stone-800 text-stone-400 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Banco de Dados Seguro:</strong> Os orçamentos salvos ficam protegidos por <em>Row Level Security (RLS)</em> no Supabase com <code>auth.uid() = user_id</code>. Apenas o seu usuário tem acesso aos orçamentos gerados e ao histórico de seus clientes.
                </span>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GUIA DE SEGURANÇA E EPIS NA PRÁTICA (COM FOTOS GERENCIÁVEIS NO ADMIN) */}
      {/* ========================================================================= */}
      {abaAtiva === 'epis' && (
        <div className="bg-stone-950 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-stone-800 shadow-xl space-y-6 w-full max-w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
            <div>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Módulo 04 • Saúde & Proteção do Pintor</span>
              <h4 className="text-lg sm:text-2xl font-extrabold text-white mt-0.5">
                Guia de Segurança & EPIs na Pintura: A Sua Saúde é o Seu Maior Patrimônio
              </h4>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/60 self-start sm:self-auto">
              Normas NR-06 & Boas Práticas
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
            Pintor profissional não é herói de cinema que lixa no peito e aguenta cheiro de solvente no dente. A química de tintas e o pó de lixamento cobram uma conta cara daqui a 10 ou 15 anos. Trabalhar equipado com o EPI certo é sinal de sabedoria, postura profissional e longevidade na profissão.
          </p>

          {/* Grid de EPIs Essenciais com Fotos Reais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full">
            {LISTA_EPIS_CONFIG.map((epi) => {
              const fotoAtual = fotosEpis[epi.id] || DEFAULT_EPI_FOTOS[epi.id] || epi.defaultImg;
              
              const detalhesMap: Record<number, { porQue: string; dica: string }> = {
                1: {
                  porQue: 'A poeira de massa corrida, gesso e reboco possui partículas microscópicas de carbonato e sílica que passam direto pelos pelos do nariz e se alojam nos alvéolos pulmonares, provocando rinite, sinusite crônica e silicose precoce.',
                  dica: 'Troque assim que sentir a respiração pesada ou o interior úmido.'
                },
                2: {
                  porQue: 'Esmaltes sintéticos, vernizes poliuretano, aguarrás e tintas epóxi liberam compostos orgânicos voláteis (VOC). A inalação contínua ataca o fígado, rins e o sistema nervoso central, causando dores de cabeça crônicas e perda de olfato.',
                  dica: 'Guarde os cartuchos químicos em saco plástico lacrado quando não usar.'
                },
                3: {
                  porQue: 'Ao pintar tetos, lixar acima dos ombros ou pulverizar com Airless, respingos alcalinos de fundo preparador e solventes podem atingir a córnea em segundos, provocando queimaduras químicas dolorosas e lesões graves.',
                  dica: 'Escolha modelos com vedação em silicone macio e tratamento antiembaçante.'
                },
                4: {
                  porQue: 'Lavar as mãos com aguarrás ou thinner é a pior agressão: o solvente dissolve a gordura natural da pele, entra na corrente sanguínea e gera dermatite severa com fissuras sangrentas nos dedos.',
                  dica: 'Nitrílica para produtos com solvente; luva PU com tato para lixamento e recorte.'
                },
                5: {
                  porQue: 'Escadas metálicas, pisos com lona plástica lisa, andaimes e respingos de sabão são armadilhas diárias. Chinelo ou tênis velho com sola gasta é convite para torção e queda com fratura.',
                  dica: 'Solado de poliuretano bidensidade dá firmeza até no degrau mais fino.'
                },
                6: {
                  porQue: 'Lixadeiras roto-orbitais, aspiradores de pó contínuos e compressores ultrapassam facilmente 85 decibéis. A perda auditiva por ruído é lenta, silenciosa e irreversível.',
                  dica: 'O modelo tipo plug é leve, lavável e não atrapalha o uso de boné e óculos.'
                }
              };

              const info = detalhesMap[epi.id] || { porQue: 'Proteção indispensável no dia a dia da obra.', dica: 'Sempre use equipamento certificado CA.' };

              return (
                <div 
                  key={epi.id}
                  className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden hover:border-amber-500/50 transition flex flex-col justify-between shadow-lg group"
                >
                  <div className="space-y-3">
                    {/* Imagem do EPI com Zoom */}
                    <div 
                      className="relative aspect-16/10 bg-stone-950 overflow-hidden cursor-pointer"
                      onClick={() => setModalFotoEpiZoom({ url: fotoAtual, titulo: epi.titulo, desc: info.porQue })}
                      title="Clique para ampliar foto do EPI"
                    >
                      <img 
                        src={fotoAtual} 
                        alt={epi.titulo} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (target.src !== epi.defaultImg) {
                            target.src = epi.defaultImg;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30 pointer-events-none" />

                      {/* Selo do EPI */}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-stone-950/85 backdrop-blur-xs text-amber-400 font-mono text-[10px] font-bold border border-stone-800 flex items-center gap-1.5">
                        <span>{epi.emoji}</span>
                        <span>EPI 0{epi.id} • {epi.categoria}</span>
                      </div>

                      <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-stone-950/80 text-stone-300 hover:text-white text-xs flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[10px]">Ver foto</span>
                      </div>
                    </div>

                    {/* Conteúdo Técnico */}
                    <div className="p-4 sm:p-5 pt-1 space-y-3">
                      <h5 className="font-extrabold text-white text-base leading-snug">
                        {epi.titulo}
                      </h5>

                      <div className="space-y-1.5 text-xs text-stone-300">
                        <strong className="text-stone-100 block text-[11px] uppercase tracking-wider text-amber-400">
                          Por que é inegociável:
                        </strong>
                        <p className="leading-relaxed text-[11px] sm:text-xs">
                          {info.porQue}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-3 border-t border-stone-800 text-[11px] text-amber-300/90 italic font-mono bg-stone-950/40">
                    💡 {info.dica}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. POSTURA E RELACIONAMENTO COM O CLIENTE (DICAS DE OURO) */}
      {/* ========================================================================= */}
      {abaAtiva === 'postura' && (
        <div className="bg-stone-950 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-stone-800 shadow-xl space-y-6 w-full max-w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
            <div>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Módulo 05 • Etiqueta de Obra</span>
              <h4 className="text-lg sm:text-2xl font-extrabold text-white mt-0.5">
                Postura & Relacionamento: Como Conquistar o Respeito do Cliente e Cobrar Mais
              </h4>
            </div>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 self-start sm:self-auto">
              Inteligência Comercial
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full">
            
            {/* Pilar 1: O Chão Fala Mais Que a Parede */}
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 hover:border-amber-500/50 transition w-full min-w-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 border border-amber-500/40">
                  01
                </div>
                <h5 className="font-extrabold text-white text-base">
                  O Chão Fala Mais Que a Parede (Limpeza Diária)
                </h5>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                O cliente leigo não entende se a resina tem 40% de sólidos ou se o recorte está a 90 graus. Mas ele entende <strong>perfeitamente</strong> se o piso da casa dele estiver manchado de gota de tinta ou com poeira nos móveis.
              </p>
              <div className="p-3 rounded-xl bg-stone-950 text-xs text-amber-300/95 font-medium border border-stone-800">
                ⭐ <strong>Atitude de Ouro:</strong> Guarde os últimos 20 minutos do dia para recolher latinhas, varrer ou aspirar o pó e dobrar as lonas. Deixar a obra em ordem no fim de tarde transforma qualquer pintor no queridinho dos proprietários.
              </div>
            </div>

            {/* Pilar 2: Pontualidade & Comunicação */}
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 hover:border-amber-500/50 transition w-full min-w-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 border border-amber-500/40">
                  02
                </div>
                <h5 className="font-extrabold text-white text-base">
                  Pontualidade & Comunicação Proativa
                </h5>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                O maior trauma do cliente de reforma é o profissional que "some sem dar sinal". Se combinou de chegar às 8h, chegue às 7h55. Se o pneu furou ou o trânsito travou, mande mensagem às 7h30 avisando a nova previsão.
              </p>
              <div className="p-3 rounded-xl bg-stone-950 text-xs text-amber-300/95 font-medium border border-stone-800">
                ⭐ <strong>Atitude de Ouro:</strong> O cliente perdoa um imprevisto comunicado com antecedência, mas nunca perdoa ficar esperando feito bobo sem resposta no WhatsApp.
              </div>
            </div>

            {/* Pilar 3: Proteção de Patrimônio */}
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 hover:border-amber-500/50 transition w-full min-w-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 border border-amber-500/40">
                  03
                </div>
                <h5 className="font-extrabold text-white text-base">
                  Proteção Impecável de Rodapés e Móveis
                </h5>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Nunca encoste o pincel sem antes isolar espelhos de tomada, maçanetas, rodapés de madeira e luminárias. O custo de 2 rolos de fita crepe de boa qualidade é irrisório perto do prejuízo de manchar um mármore caríssimo.
              </p>
              <div className="p-3 rounded-xl bg-stone-950 text-xs text-amber-300/95 font-medium border border-stone-800">
                ⭐ <strong>Atitude de Ouro:</strong> O cliente se apaixona pelo trabalho no exato instante em que vê o zelo com que você embalou as coisas dele com plástico bolha e fita de precisão.
              </div>
            </div>

            {/* Pilar 4: Transparência em Serviços Extras */}
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 hover:border-amber-500/50 transition w-full min-w-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center shrink-0 border border-amber-500/40">
                  04
                </div>
                <h5 className="font-extrabold text-white text-base">
                  Transparência nos Serviços Extras (Sem Surpresas)
                </h5>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Durante a pintura, o cliente sempre pede: <em>"Pintor, já que você tá com o rolo na mão, dá pra dar uma mãozinha naquela paredinha da lavanderia?"</em>. Nunca faça de graça amargurado, nem cobre no susto no final.
              </p>
              <div className="p-3 rounded-xl bg-stone-950 text-xs text-amber-300/95 font-medium border border-stone-800">
                ⭐ <strong>Atitude de Ouro:</strong> Responda na hora com simpatia: <em>"Faço com prazer, dona Maria! Como esse espaço não estava na nossa proposta inicial, fica R$ 120 adicionais de mão de obra. Posso incluir?"</em>. Tudo combinado antes evita briga depois.
              </div>
            </div>

            {/* Pilar 5: Entrega Técnica & Vistoria Final */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-stone-900 to-stone-900 border border-amber-500/40 space-y-3 w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 font-black flex items-center justify-center shrink-0 shadow-md">
                  05
                </div>
                <h5 className="font-extrabold text-white text-base">
                  Vistoria Técnica com Luz Acesa & Entrega das Latinhas
                </h5>
              </div>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Ao terminar o serviço, não saia correndo com o cheque no bolso. Convide o proprietário para uma <strong>vistoria oficial conjunta</strong>. Ande pelos cômodos com a luz acesa, trincha fina na mão para eventuais retoques imediatos e mostre o capricho de cada recorte.
              </p>
              <div className="p-3.5 rounded-xl bg-stone-950/80 text-xs text-amber-300 font-medium border border-stone-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>O Toque Final do Mestre:</strong> Guarde as latinhas com as sobras de tinta organizadas em um cantinho, limpas por fora e com uma fita crepe indicando o nome da cor e de qual ambiente ela é. Esse cliente nunca mais vai procurar outro pintor na vida!
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: LOGIN / CADASTRO RÁPIDO DO PINTOR (SUPABASE AUTH & SESSÃO) */}
      {/* ========================================================================= */}
      {modalLoginAvisoAberto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs"
          onClick={() => setModalLoginAvisoAberto(false)}
        >
          <div 
            className="bg-stone-900 border-2 border-amber-500/50 rounded-2xl sm:rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2.5 text-amber-400">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base">Identificação do Pintor</h4>
                  <span className="text-[11px] text-stone-400 font-mono">Supabase Auth • RLS Protegido</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setModalLoginAvisoAberto(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aviso Amigável */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-stone-300 text-xs leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-300">
                <Cloud className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Salvar Orçamento na Nuvem</span>
              </div>
              <p>
                Para salvar seu orçamento na tabela <code>orcamentos</code> e seus itens em <code>itens_orcamento</code>, identifique-se abaixo. Seus orçamentos ficam associados exclusivamente ao seu <code>auth.uid() = user_id</code>.
              </p>
            </div>

            {/* Abas: Entrar vs Criar Conta */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-stone-950 border border-stone-800 gap-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setModalLoginTab('entrar');
                  setModalLoginFeedback(null);
                }}
                className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalLoginTab === 'entrar'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Entrar (Login)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setModalLoginTab('cadastrar');
                  setModalLoginFeedback(null);
                }}
                className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  modalLoginTab === 'cadastrar'
                    ? 'bg-amber-500 text-stone-950 shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Criar Conta Rápida</span>
              </button>
            </div>

            {/* Feedback do Formulário */}
            {modalLoginFeedback && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border transition ${
                modalLoginFeedback.type === 'success'
                  ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200'
                  : modalLoginFeedback.type === 'info'
                    ? 'bg-amber-950/90 border-amber-500/60 text-amber-200'
                    : 'bg-red-950/90 border-red-500/60 text-red-200'
              }`}>
                {modalLoginFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <span className="font-medium leading-relaxed">{modalLoginFeedback.text}</span>
              </div>
            )}

            {/* Formulário Rápido */}
            <form onSubmit={handleSubmeterModalLogin} className="space-y-3 text-xs">
              {modalLoginTab === 'cadastrar' && (
                <div>
                  <label className="block text-stone-300 font-medium mb-1">Nome Completo / Empresa *</label>
                  <input
                    type="text"
                    value={modalLoginNome}
                    onChange={(e) => setModalLoginNome(e.target.value)}
                    placeholder="Ex: Carlos Oliveira Pinturas"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block text-stone-300 font-medium mb-1">E-mail Cadastrado *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={modalLoginEmail}
                    onChange={(e) => setModalLoginEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    required
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-white focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Senha de Acesso *</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={modalLoginSenha}
                    onChange={(e) => setModalLoginSenha(e.target.value)}
                    placeholder="Digite sua senha..."
                    required
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-9 pr-3 py-2 text-white focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={modalLoginLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-amber-500/20"
              >
                {modalLoginLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Conectando ao Supabase...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>{modalLoginTab === 'entrar' ? 'Entrar e Salvar Orçamento' : 'Cadastrar e Salvar Orçamento'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Teste Rápido de 1 Clique (Demonstração / Master) */}
            <div className="pt-2 border-t border-stone-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-500 block text-center">
                Opção de Teste Rápido de Desenvolvimento
              </span>
              <button
                type="button"
                onClick={handleLoginDemoRapido}
                disabled={modalLoginLoading}
                className="w-full py-2.5 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>⚡ Conectar como Pintor Master / Demonstração (1 Clique)</span>
              </button>
            </div>

            {/* Botões de Navegação Externa */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-stone-400">
              <button
                type="button"
                onClick={() => {
                  setModalLoginAvisoAberto(false);
                  if (onAbrirCadastroPintor) onAbrirCadastroPintor();
                }}
                className="hover:text-amber-400 underline cursor-pointer"
              >
                Ir para Cadastro Completo na Vitrine
              </button>

              <button
                type="button"
                onClick={() => setModalLoginAvisoAberto(false)}
                className="hover:text-stone-200 cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CÓDIGO JAVASCRIPT DA INTEGRAÇÃO SUPABASE (<script>) */}
      {/* ========================================================================= */}
      {modalVerCodigoAberto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setModalVerCodigoAberto(false)}
        >
          <div 
            className="bg-stone-900 border-2 border-stone-700 rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-stone-800 flex items-center justify-between gap-3 shrink-0 bg-stone-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base sm:text-lg">
                    Código JavaScript de Integração Supabase
                  </h4>
                  <p className="text-[11px] sm:text-xs text-stone-400">
                    Funções <code>verificarSessaoPintor</code>, <code>salvarOrcamento</code> e <code>consultarHistorico</code> para tag &lt;script&gt;.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copiarCodigoScript}
                  className={`py-2 px-3.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md ${
                    codigoJsCopiado
                      ? 'bg-emerald-500 text-stone-950'
                      : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                  }`}
                >
                  {codigoJsCopiado ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Código</span>
                    </>
                  )}
                </button>

                <button 
                  type="button" 
                  onClick={() => setModalVerCodigoAberto(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Código com Syntax Style */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 font-mono text-[11px] sm:text-xs bg-stone-950 text-stone-200">
              <pre className="whitespace-pre-wrap leading-relaxed select-all">
                {codigoScriptSupabaseCompleto}
              </pre>
            </div>

            {/* Footer do Modal */}
            <div className="p-3.5 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400 shrink-0 bg-stone-950/80">
              <span>Biblioteca compatível: <code>@supabase/supabase-js@2</code> • Tabelas: <code>orcamentos</code> & <code>itens_orcamento</code></span>
              <button
                type="button"
                onClick={() => setModalVerCodigoAberto(false)}
                className="px-4 py-1.5 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-200 font-bold text-xs"
              >
                Fechar Janela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: HISTÓRICO DE ORÇAMENTOS SALVOS NA NUVEM (CONSULTA COMPLETA) */}
      {/* ========================================================================= */}
      {modalHistoricoAberto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs"
          onClick={() => setModalHistoricoAberto(false)}
        >
          <div 
            className="bg-stone-900 border border-stone-700 rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="p-4 sm:p-6 border-b border-stone-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base sm:text-lg">Meus Orçamentos na Nuvem (Supabase)</h4>
                  <p className="text-[11px] sm:text-xs text-stone-400">
                    Histórico pessoal sincronizado com a tabela 'orcamentos' e 'itens_orcamento'.
                  </p>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => setModalHistoricoAberto(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo do Histórico com Scroll */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
              {carregandoHistorico ? (
                <div className="py-12 text-center text-stone-400 space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-400" />
                  <p className="text-xs">Consultando orçamentos no Supabase Cloud...</p>
                </div>
              ) : historicoOrcamentos.length === 0 ? (
                <div className="py-12 text-center text-stone-500 space-y-2">
                  <FileText className="w-10 h-10 mx-auto text-stone-600 opacity-60" />
                  <p className="text-sm font-bold text-stone-400">Nenhum orçamento encontrado</p>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Preencha o formulário e clique em "Salvar no Supabase" para criar seu primeiro orçamento na nuvem.
                  </p>
                </div>
              ) : (
                historicoOrcamentos.map((orc, idx) => (
                  <div 
                    key={orc.id || idx}
                    className="p-4 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white text-sm sm:text-base">
                          {orc.nome_cliente}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {orc.valor_total || 'Sob Consulta'}
                        </span>
                        {orc.created_at && (
                          <span className="text-[10px] text-stone-500 flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3" />
                            {new Date(orc.created_at).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-stone-400 flex flex-wrap items-center gap-3">
                        <span>📍 {orc.cidade_cliente || orc.endereco_cliente}</span>
                        <span>•</span>
                        <span>📱 {orc.telefone_cliente}</span>
                        <span>•</span>
                        <span>⏱️ Prazo: {orc.prazo_dias}</span>
                      </div>

                      {orc.itens && orc.itens.length > 0 && (
                        <p className="text-[11px] text-stone-400 pt-1 line-clamp-1">
                          📋 <strong>Itens ({orc.itens.length}):</strong> {orc.itens.map(i => i.descricao).join(', ')}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-850">
                      <button
                        type="button"
                        onClick={() => handleCarregarOrcamentoAntigo(orc)}
                        className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer"
                        title="Carregar este orçamento de volta para o formulário"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Carregar</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExcluirOrcamento(orc.id)}
                        className="p-2 rounded-xl bg-stone-900 hover:bg-red-950 text-stone-400 hover:text-red-400 border border-stone-800 transition cursor-pointer"
                        title="Excluir orçamento da nuvem"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer do Modal */}
            <div className="p-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 shrink-0 bg-stone-950/60">
              <span>Total de {historicoOrcamentos.length} orçamento(s) cadastrado(s)</span>
              <button
                type="button"
                onClick={() => setModalHistoricoAberto(false)}
                className="px-4 py-1.5 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-200 text-xs font-bold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE ZOOM NA FOTO DO EPI */}
      {modalFotoEpiZoom && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs"
          onClick={() => setModalFotoEpiZoom(null)}
        >
          <div 
            className="bg-stone-900 border border-stone-700 rounded-2xl sm:rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4 p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400 shrink-0" />
                <h4 className="font-extrabold text-white text-sm sm:text-base">{modalFotoEpiZoom.titulo}</h4>
              </div>
              <button 
                type="button" 
                onClick={() => setModalFotoEpiZoom(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden aspect-16/10 bg-black border border-stone-800 max-h-[60vh]">
              <img 
                src={modalFotoEpiZoom.url} 
                alt={modalFotoEpiZoom.titulo} 
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              {modalFotoEpiZoom.desc}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
