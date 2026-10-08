import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Droplet, 
  FileText, 
  ShieldAlert, 
  Award, 
  Check, 
  Copy, 
  Phone, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  RotateCcw, 
  Sliders, 
  HardHat, 
  ThumbsUp, 
  Eye, 
  Share2, 
  ClipboardCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

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

export const FerramentasProfissional: React.FC = () => {
  // Aba ativa nas 5 ferramentas
  const [abaAtiva, setAbaAtiva] = useState<'calculadora' | 'diluicao' | 'orcamento' | 'epis' | 'postura'>('calculadora');

  // --- ESTADOS DA CALCULADORA DE RENDIMENTO ---
  const [areaMetros, setAreaMetros] = useState<number>(65);
  const [superficie, setSuperficie] = useState<TipoSuperficie>('alvenaria_repintura');
  const [numeroDemaos, setNumeroDemaos] = useState<number>(2);
  const [incluirMargemPerda, setIncluirMargemPerda] = useState<boolean>(true); // 10% de margem técnica

  // Cálculo de consumo
  const calculoConsumo = useMemo(() => {
    const config = SUPERFICIES[superficie];
    const rendimentoLitro = config.rendimentoBaseM2PorLitro;
    
    // Cálculo por demão considerando o peso da 1ª demão
    let litrosTotais = 0;
    for (let d = 1; d <= numeroDemaos; d++) {
      const fatorDemao = d === 1 ? config.fatorPrimeiraDemao : 1.0;
      litrosTotais += (areaMetros / rendimentoLitro) * fatorDemao;
    }

    if (incluirMargemPerda) {
      litrosTotais *= 1.10; // +10% de margem para recortes e perdas de rolo
    }

    litrosTotais = Math.max(0.5, Math.round(litrosTotais * 10) / 10);

    // Sugestão de embalagens comerciais (Latas 18L, Galões 3.6L, Quartos 0.9L)
    let restante = litrosTotais;
    const latas18 = Math.floor(restante / 18);
    restante = restante % 18;

    // Se sobrou mais de 14L, compensa pegar 1 lata de 18L
    let latas18Final = latas18;
    let galoes36 = 0;
    let quartos09 = 0;

    if (restante >= 14) {
      latas18Final += 1;
      restante = 0;
    } else {
      galoes36 = Math.floor(restante / 3.6);
      restante = restante % 3.6;

      if (restante >= 2.8) {
        galoes36 += 1;
        restante = 0;
      } else {
        quartos09 = Math.ceil(restante / 0.9);
      }
    }

    return {
      litrosTotais,
      latas18: latas18Final,
      galoes36,
      quartos09,
      areaTotalAplicada: areaMetros * numeroDemaos
    };
  }, [areaMetros, superficie, numeroDemaos, incluirMargemPerda]);

  // --- ESTADOS DO GUIA DE DILUIÇÃO ---
  const [filtroDiluicao, setFiltroDiluicao] = useState<'todos' | 'agua' | 'solvente'>('todos');

  const tabelaDiluicao = useMemo(() => {
    const itens = [
      {
        produto: 'Tinta Acrílica Premium (Fosca)',
        categoria: 'agua',
        diluicao: '10% a 20%',
        diluente: 'Água potável limpa',
        ferramenta: 'Rolo de lã pelo baixo (9mm a 12mm)',
        detalhe: 'Para a 1ª demão em parede crua pode diluir até 20%; na 2ª demão reduza para 10% a 15% para garantir alta cobertura e lavabilidade.',
        alerta: 'Evite passar de 20% para não quebrar a resina.'
      },
      {
        produto: 'Tinta Acrílica Acetinada / Semibrilho',
        categoria: 'agua',
        diluicao: '10% a 15%',
        diluente: 'Água potável limpa',
        ferramenta: 'Rolo de microfibra ou antigota',
        detalhe: 'Produtos com brilho exigem diluição precisa e uniforme. Excesso de água gera estrias e manchas visíveis sob luz rasante.',
        alerta: 'Não aplique em dias com umidade acima de 85%.'
      },
      {
        produto: 'Tinta Acrílica Standard / Econômica',
        categoria: 'agua',
        diluicao: '10% a 20%',
        diluente: 'Água potável limpa',
        ferramenta: 'Rolo de lã pelo médio',
        detalhe: 'Homogeneize vigorosamente com régua limpa ou misturador mecânico até dissolver todo o pigmento assentado no fundo da lata.',
        alerta: 'Nunca use água de reuso ou contaminada.'
      },
      {
        produto: 'Esmalte Sintético Base Solvente',
        categoria: 'solvente',
        diluicao: '10% a 15% (Rolo/Trincha) | 25% (Pistola Airless/Pressão)',
        diluente: 'Aguarrás Mineral Pura',
        ferramenta: 'Trincha de cerdas macias ou rolo de espuma/epóxi',
        detalhe: 'A diluição adequada é o segredo do brilho espelhado e do alastramento. Se a tinta estiver pesada, a marca da cerda não some.',
        alerta: 'NUNCA use Thinner: talha a resina alquídica e tira o brilho.'
      },
      {
        produto: 'Esmalte Base Água',
        categoria: 'agua',
        diluicao: '10% a 15%',
        diluente: 'Água potável limpa',
        ferramenta: 'Rolo de microfibra veludo ou trincha sintética',
        detalhe: 'Secagem muito rápida ao toque (30 min). Não repasse o rolo em áreas já pintadas após 3 minutos para não arrebentar o filme.',
        alerta: 'Excelente para interiores sem cheiro e não amarela.'
      },
      {
        produto: 'Verniz Alquídico / Marítimo / Poliuretano',
        categoria: 'solvente',
        diluicao: '1ª demão: 10% a 15% | Demãos seguintes: 0% a 5%',
        diluente: 'Aguarrás Mineral',
        ferramenta: 'Trincha de cerdas naturais longas',
        detalhe: 'A primeira demão mais fina atua como selador nas fibras da madeira; as demãos seguintes devem ser encorpadas para criar película.',
        alerta: 'Lixe levemente com lixa 320 entre as demãos.'
      },
      {
        produto: 'Fundo Preparador de Paredes (Base Água)',
        categoria: 'agua',
        diluicao: 'Pronto para uso (máx. 10% se indicado na lata)',
        diluente: 'Água potável',
        ferramenta: 'Rolo de lã ou trincha larga',
        detalhe: 'Destinado a aglutinar partículas soltas em reboco fraco, gesso ou cal. A parede deve ficar fosca, sem criar película vitrificada.',
        alerta: 'Se a parede ficar brilhando como vidro, a tinta não vai colar.'
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
  const [orcTelefone, setOrcTelefone] = useState('11987654321');
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
  const [copiadoFeedback, setCopiadoFeedback] = useState(false);

  // Alternar etapa do orçamento
  const toggleEtapaOrcamento = (etapa: string) => {
    setOrcEtapas(prev => 
      prev.includes(etapa) ? prev.filter(e => e !== etapa) : [...prev, etapa]
    );
  };

  // Preencher modelo real com 1 clique
  const preencherExemploOrcamento = () => {
    setOrcNomeCliente('Doutor Marcelo Ramos');
    setOrcTelefone('11999887766');
    setOrcCidade('São Paulo - SP (Moema)');
    setOrcAmbientes('Apartamento 92m²: Living ampliado, cozinha americana, suíte master e varanda gourmet');
    setOrcPrazo('8 dias úteis');
    setOrcValorMaoDeObra('R$ 4.800,00');
    setOrcFormaPagamento('Pix: 30% no início da proteção, 40% no acabamento fino e 30% na entrega com vistoria técnica');
    setOrcValidade('15 dias');
  };

  // Texto formatado pronto para copiar ou enviar no WhatsApp
  const textoOrcamentoFormatado = useMemo(() => {
    return `*PROPOSTA COMERCIAL & ORÇAMENTO DE PINTURA PROFISSIONAL*
--------------------------------------------------
*Cliente:* ${orcNomeCliente}
*Local da Obra:* ${orcCidade}
*Validade da Proposta:* ${orcValidade}

*1. AMBIENTES CONTEMPLADOS:*
${orcAmbientes}

*2. ESCOPO TÉCNICO DE EXECUÇÃO:*
${orcEtapas.map((e, idx) => `${idx + 1}) ${e}`).join('\n')}

*3. PRAZO ESTIMADO DE EXECUÇÃO:*
${orcPrazo} (contados a partir do início da preparação e liberação do imóvel)

*4. INVESTIMENTO & FORMA DE PAGAMENTO:*
*Valor Total da Mão de Obra:* ${orcValorMaoDeObra}
*Condição:* ${orcFormaPagamento}

*5. DISPOSIÇÕES GERAIS:*
• Os materiais de pintura (tintas, massas, lixas e fitas) serão fornecidos pelo cliente conforme relação técnica fornecida pelo pintor.
• Ambiente será mantido isolado e limpo ao fim de cada expediente de trabalho.
• Vistoria final conjunta realizada sob iluminação antes da liberação e quitação.

_Elaborado através do Portal Pinta Aqui (www.pintaaqui.com.br) - Valorizando a Pintura Profissional._`;
  }, [orcNomeCliente, orcCidade, orcValidade, orcAmbientes, orcEtapas, orcPrazo, orcValorMaoDeObra, orcFormaPagamento]);

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

  return (
    <div className="space-y-8 text-stone-100">
      
      {/* Cabeçalho da Seção de Ferramentas */}
      <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 p-5 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              Ferramentas Práticas de Campo • Pinta Aqui Pro
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Arsenal do Pintor de Elite: Ferramentas & Conteúdo de Chão de Obra
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Conteúdo de profissional para profissional. Calcule consumo exato de latas e galões, consulte a diluição química ideal, gere orçamentos estruturados e eleve a postura que fecha contratos de alto padrão.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="hidden sm:inline-block text-xs font-mono text-amber-400/80 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
              5 Módulos Interativos
            </span>
          </div>
        </div>

        {/* Barra de Abas das 5 Ferramentas (Mobile First com Scroll Suave) */}
        <div className="mt-6 pt-5 border-t border-stone-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            type="button"
            onClick={() => setAbaAtiva('calculadora')}
            className={`py-2.5 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 transition cursor-pointer ${
              abaAtiva === 'calculadora'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-850 border border-stone-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
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
            <Droplet className="w-4 h-4" />
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
            <FileText className="w-4 h-4" />
            <span>3. Modelo de Orçamento</span>
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
            <HardHat className="w-4 h-4" />
            <span>4. Segurança & EPIs</span>
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
            <Award className="w-4 h-4" />
            <span>5. Postura & Dicas de Ouro</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CALCULADORA DE CONSUMO E RENDIMENTO */}
      {/* ========================================================================= */}
      {abaAtiva === 'calculadora' && (
        <div className="bg-stone-950 p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-stone-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
            <div>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Módulo 01 • Rendimento Técnico</span>
              <h4 className="text-lg sm:text-2xl font-extrabold text-white mt-0.5">
                Calculadora de Consumo de Tinta & Embalagens
              </h4>
            </div>
            <span className="text-xs text-stone-400 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
              Cálculo em Tempo Real
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Formulário de Parâmetros */}
            <div className="lg:col-span-7 space-y-5 text-xs sm:text-sm">
              
              {/* Metragem Quadrada */}
              <div>
                <label className="block text-stone-300 font-semibold mb-2">
                  Metragem Total das Paredes ou Tetos (m²) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={areaMetros}
                    onChange={(e) => setAreaMetros(Math.max(1, Number(e.target.value) || 0))}
                    className="w-full bg-stone-900 border-2 border-stone-700 focus:border-amber-500 rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-hidden transition"
                  />
                  <span className="absolute right-4 top-3.5 text-xs text-stone-400 font-bold">m²</span>
                </div>
                
                {/* Atalhos Rápidos */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-stone-400 mr-1">Atalhos:</span>
                  {[20, 45, 80, 120, 200, 350].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setAreaMetros(m)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        areaMetros === m
                          ? 'bg-amber-500 text-stone-950 font-black'
                          : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                      }`}
                    >
                      {m} m²
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo de Superfície */}
              <div>
                <label className="block text-stone-300 font-semibold mb-2">
                  Tipo de Superfície de Aplicação *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(SUPERFICIES) as TipoSuperficie[]).map((key) => {
                    const sup = SUPERFICIES[key];
                    const selecionado = superficie === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setSuperficie(key)}
                        className={`p-3 rounded-xl text-left border transition cursor-pointer ${
                          selecionado
                            ? 'bg-amber-500/15 border-amber-500 text-white'
                            : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <div className="font-bold text-xs flex items-center justify-between">
                          <span>{sup.nome}</span>
                          {selecionado && <Check className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <p className="text-[11px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                          {sup.descricao}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Número de Demãos */}
              <div>
                <label className="block text-stone-300 font-semibold mb-2">
                  Número de Demãos Planejadas *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((dem) => (
                    <button
                      key={dem}
                      type="button"
                      onClick={() => setNumeroDemaos(dem)}
                      className={`py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex flex-col items-center justify-center border ${
                        numeroDemaos === dem
                          ? 'bg-amber-500 text-stone-950 border-amber-400 font-black shadow-sm'
                          : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-850'
                      }`}
                    >
                      <span className="text-sm">{dem}</span>
                      <span className="text-[10px] uppercase font-normal">{dem === 1 ? 'Demão' : 'Demãos'}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Margem de Perda e Recortes */}
              <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">Adicionar 10% de Margem Técnica</span>
                  <p className="text-[11px] text-stone-400 leading-snug">
                    Compensa recortes de trincha, perda em fita crepe e resíduo no rolo/bandeja.
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
            <div className="lg:col-span-5 bg-stone-900/90 rounded-2xl border-2 border-amber-500/40 p-4 sm:p-6 space-y-5 shadow-2xl relative">
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
                  <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                    calculoConsumo.latas18 > 0
                      ? 'bg-amber-500/20 border-amber-500/60 text-white'
                      : 'bg-stone-950/70 border-stone-800 text-stone-400'
                  }`}>
                    <span className="text-2xl font-black text-amber-400">{calculoConsumo.latas18}</span>
                    <span className="text-[11px] font-bold mt-1">Lata 18L</span>
                    <span className="text-[10px] text-stone-400">Balde Maior</span>
                  </div>

                  {/* Galão 3.6L */}
                  <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                    calculoConsumo.galoes36 > 0
                      ? 'bg-amber-500/20 border-amber-500/60 text-white'
                      : 'bg-stone-950/70 border-stone-800 text-stone-400'
                  }`}>
                    <span className="text-2xl font-black text-amber-400">{calculoConsumo.galoes36}</span>
                    <span className="text-[11px] font-bold mt-1">Galão 3.6L</span>
                    <span className="text-[10px] text-stone-400">Padrão Médio</span>
                  </div>

                  {/* Quarto 0.9L */}
                  <div className={`p-3 rounded-xl border flex flex-col justify-between ${
                    calculoConsumo.quartos09 > 0
                      ? 'bg-amber-500/20 border-amber-500/60 text-white'
                      : 'bg-stone-950/70 border-stone-800 text-stone-400'
                  }`}>
                    <span className="text-2xl font-black text-amber-400">{calculoConsumo.quartos09}</span>
                    <span className="text-[11px] font-bold mt-1">Quarto 900ml</span>
                    <span className="text-[10px] text-stone-400">Latas Pequenas</span>
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
                  Se a parede for de reboco cru ou gesso, <strong>sempre aplique Fundo Preparador primeiro</strong>. Ele custa menos da metade de uma tinta Premium e evita que a parede "beba" tinta nobre na 1ª demão, garantindo que o galão renda exatamente o previsto no cálculo acima.
                </p>
              </div>

              <div className="pt-2 text-center">
                <span className="text-[10px] text-stone-400 block">
                  * Valores baseados em produtos das normas NBR 15079 / 11702. Sempre confira a litografia da marca escolhida.
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
        <div className="bg-stone-950 p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-stone-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
            <div>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Módulo 02 • Química Prática</span>
              <h4 className="text-lg sm:text-2xl font-extrabold text-white mt-0.5">
                Guia de Diluição "Zero Erro" (Tabela Rápida de Campo)
              </h4>
            </div>

            {/* Filtros da Tabela */}
            <div className="flex items-center gap-1.5 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
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

          {/* Tabela Responsiva em Desktop / Cards em Mobile */}
          <div className="space-y-3">
            {tabelaDiluicao.map((item, idx) => (
              <div 
                key={idx}
                className="bg-stone-900 rounded-2xl border border-stone-800 p-4 sm:p-5 hover:border-amber-500/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 md:max-w-md">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      item.categoria === 'agua'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                    }`}>
                      {item.categoria === 'agua' ? '💧 Base Água' : '🧪 Base Solvente'}
                    </span>
                    <h5 className="font-bold text-white text-sm sm:text-base leading-snug">{item.produto}</h5>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">{item.detalhe}</p>
                  <p className="text-[11px] text-amber-400/90 italic font-mono">⚠️ {item.alerta}</p>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-stone-800/80 shrink-0">
                  <div className="bg-stone-950 px-3.5 py-2.5 rounded-xl border border-stone-800 text-center min-w-[120px]">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Diluição Ideal</span>
                    <span className="text-sm font-black text-amber-400 font-mono">{item.diluicao}</span>
                  </div>

                  <div className="bg-stone-950 px-3.5 py-2.5 rounded-xl border border-stone-800 text-left min-w-[140px]">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Diluente Correto</span>
                    <span className="text-xs font-bold text-stone-200">{item.diluente}</span>
                  </div>

                  <div className="hidden lg:block bg-stone-950 px-3.5 py-2.5 rounded-xl border border-stone-800 text-left min-w-[160px]">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Ferramenta</span>
                    <span className="text-xs text-stone-300">{item.ferramenta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODELO DE ORÇAMENTO PROFISSIONAL (COPIÁVEL) */}
      {/* ========================================================================= */}
      {abaAtiva === 'orcamento' && (
        <div className="bg-stone-950 p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-stone-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
            <div>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Módulo 03 • Comercial & Gestão</span>
              <h4 className="text-lg sm:text-2xl font-extrabold text-white mt-0.5">
                Modelo de Orçamento Profissional (Estrutura Copiável)
              </h4>
            </div>

            <button
              type="button"
              onClick={preencherExemploOrcamento}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 border border-stone-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Carregar Exemplo Real</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Editor de Campos do Orçamento */}
            <div className="lg:col-span-6 space-y-4 text-xs">
              <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 space-y-3">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] block">
                  1. Dados do Cliente & Local
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Nome do Cliente *</label>
                    <input
                      type="text"
                      value={orcNomeCliente}
                      onChange={(e) => setOrcNomeCliente(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">WhatsApp de Envio *</label>
                    <input
                      type="text"
                      value={orcTelefone}
                      onChange={(e) => setOrcTelefone(e.target.value)}
                      placeholder="11999999999"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-300 font-medium mb-1">Local / Bairro / Cidade *</label>
                    <input
                      type="text"
                      value={orcCidade}
                      onChange={(e) => setOrcCidade(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Ambientes & Prazos */}
              <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 space-y-3">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] block">
                  2. Ambientes & Valores
                </span>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">Descrição dos Ambientes *</label>
                  <textarea
                    rows={2}
                    value={orcAmbientes}
                    onChange={(e) => setOrcAmbientes(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl p-2.5 text-white focus:border-amber-500 focus:outline-hidden leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Prazo de Entrega Estimado *</label>
                    <input
                      type="text"
                      value={orcPrazo}
                      onChange={(e) => setOrcPrazo(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Valor da Mão de Obra *</label>
                    <input
                      type="text"
                      value={orcValorMaoDeObra}
                      onChange={(e) => setOrcValorMaoDeObra(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-amber-400 font-bold focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-300 font-medium mb-1">Forma de Pagamento Combinada *</label>
                    <input
                      type="text"
                      value={orcFormaPagamento}
                      onChange={(e) => setOrcFormaPagamento(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Etapas de Preparação Selecionáveis */}
              <div className="bg-stone-900/60 p-4 rounded-2xl border border-stone-800 space-y-2.5">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px] block">
                  3. Etapas de Preparação e Execução (Marque as aplicáveis):
                </span>

                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {[
                    'Proteção completa do piso, rodapés, caixilhos e móveis com lona e fita crepe de precisão',
                    'Raspagem e remoção de partes soltas ou estufadas',
                    'Tratamento de trincas dinâmicas com selante elástico e tela de poliéster',
                    'Aplicação de Fundo Preparador de Paredes nas áreas frágeis',
                    'Emassamento com 2 demãos de massa corrida para nivelamento fino',
                    'Lixamento aspirado mecanizado com iluminação rasante para eliminar imperfeições',
                    'Aplicação de 2 a 3 demãos de tinta acrílica de acabamento até cobertura total',
                    'Pintura de portas de madeira e batentes com esmalte',
                    'Limpeza técnica diária e entrega final do ambiente impecável'
                  ].map((etapa, idx) => (
                    <label key={idx} className="flex items-start gap-2 p-1.5 rounded-lg hover:bg-stone-950 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={orcEtapas.includes(etapa)}
                        onChange={() => toggleEtapaOrcamento(etapa)}
                        className="mt-0.5 accent-amber-500 rounded cursor-pointer shrink-0"
                      />
                      <span className="text-stone-300 text-xs leading-snug">{etapa}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Prévia do Card Copiável & Ações de Envio */}
            <div className="lg:col-span-6 space-y-4">
              
              <div className="bg-stone-900 rounded-2xl border-2 border-stone-700 p-4 sm:p-6 space-y-4 shadow-2xl relative font-sans">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-amber-400" />
                    <span className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider">
                      Proposta Comercial Formatada
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
                    Pronto para Envio
                  </span>
                </div>

                <div className="bg-stone-950 p-4 rounded-xl border border-stone-850 font-mono text-[11px] sm:text-xs text-stone-300 whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto">
                  {textoOrcamentoFormatado}
                </div>

                {/* Botões de Ação Imediata */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="button"
                    onClick={copiarTextoOrcamento}
                    className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg ${
                      copiadoFeedback
                        ? 'bg-emerald-500 text-stone-950 shadow-emerald-500/20'
                        : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-amber-500/20'
                    }`}
                  >
                    {copiadoFeedback ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Copiado com Sucesso!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar Texto do Orçamento</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`https://wa.me/55${orcTelefone.replace(/\D/g, '')}?text=${encodeURIComponent(textoOrcamentoFormatado)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-600/20"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Enviar no WhatsApp</span>
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-900/60 border border-stone-800 text-stone-400 text-xs flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Por que orçamentos detalhados fecham mais?</strong> O cliente leigo tem medo de tomar prejuízo. Quando você entrega uma proposta discriminando cada etapa de lixamento, fundo e proteção de móveis, ele entende que você é um especialista e não chora por desconto.
                </span>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GUIA DE SEGURANÇA E EPIS NA PRÁTICA */}
      {/* ========================================================================= */}
      {abaAtiva === 'epis' && (
        <div className="bg-stone-950 p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-stone-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
            <div>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Módulo 04 • Saúde & Proteção</span>
              <h4 className="text-lg sm:text-2xl font-extrabold text-white mt-0.5">
                Guia de Segurança & EPIs na Pintura: A Sua Saúde é o Seu Maior Patrimônio
              </h4>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/60">
              Normas NR-06 & Boas Práticas
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
            Pintor profissional não é herói de cinema que lixa no peito e aguenta cheiro de solvente no dente. A química de tintas e o pó de lixamento cobram uma conta cara daqui a 10 ou 15 anos. Trabalhar equipado com EPI certo é sinal de sabedoria, postura profissional e longevidade na profissão.
          </p>

          {/* Grid de EPIs Essenciais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            
            {/* EPI 1: Respirador PFF2 */}
            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-5 space-y-3 hover:border-amber-500/50 transition flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold">
                    EPI 01 • Poeira Fina
                  </span>
                  <span className="text-xl">😷</span>
                </div>
                <h5 className="font-bold text-white text-base">
                  Respirador PFF2 / N95 (Poeira de Lixamento)
                </h5>
                <div className="space-y-1.5 text-xs text-stone-300">
                  <strong className="text-stone-100 block">Por que é inegociável:</strong>
                  <p className="leading-relaxed">
                    A poeira de massa corrida, gesso e reboco possui partículas microscópicas de carbonato e sílica que passam direto pelos pelos do nariz e se alojam no fundo dos alvéolos pulmonares, provocando rinite, sinusite crônica e silicose precoce.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-stone-800 text-[11px] text-amber-300/90 italic font-mono">
                💡 Troque assim que sentir a respiração pesada ou o interior úmido.
              </div>
            </div>

            {/* EPI 2: Máscara com Filtro Químico */}
            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-5 space-y-3 hover:border-amber-500/50 transition flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 font-mono text-[10px] font-bold">
                    EPI 02 • Vapores Químicos
                  </span>
                  <span className="text-xl">☣️</span>
                </div>
                <h5 className="font-bold text-white text-base">
                  Semimáscara com Filtro para Vapores Orgânicos (VO)
                </h5>
                <div className="space-y-1.5 text-xs text-stone-300">
                  <strong className="text-stone-100 block">Por que é inegociável:</strong>
                  <p className="leading-relaxed">
                    Esmaltes sintéticos, vernizes poliuretano, aguarrás e tintas epóxi liberam compostos orgânicos voláteis (VOC). A inalação contínua ataca o fígado, rins e o sistema nervoso central, causando dores de cabeça crônicas e perda de olfato.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-stone-800 text-[11px] text-amber-300/90 italic font-mono">
                💡 Guarde os cartuchos químicos em saco plástico lacrado quando não usar.
              </div>
            </div>

            {/* EPI 3: Óculos de Proteção */}
            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-5 space-y-3 hover:border-amber-500/50 transition flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 font-mono text-[10px] font-bold">
                    EPI 03 • Olhos & Visão
                  </span>
                  <span className="text-xl">🥽</span>
                </div>
                <h5 className="font-bold text-white text-base">
                  Óculos de Ampla Visão Antiembaçante
                </h5>
                <div className="space-y-1.5 text-xs text-stone-300">
                  <strong className="text-stone-100 block">Por que é inegociável:</strong>
                  <p className="leading-relaxed">
                    Ao pintar tetos, lixar acima da linha dos ombros ou pulverizar com Airless, respingos alcalinos de fundo preparador e solventes podem atingir a córnea em segundos, provocando queimaduras químicas dolorosas e lesões graves.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-stone-800 text-[11px] text-amber-300/90 italic font-mono">
                💡 Escolha modelos com vedação em silicone macio e tratamento antiembaçante.
              </div>
            </div>

            {/* EPI 4: Luvas Especiais */}
            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-5 space-y-3 hover:border-amber-500/50 transition flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold">
                    EPI 04 • Mãos & Pele
                  </span>
                  <span className="text-xl">🧤</span>
                </div>
                <h5 className="font-bold text-white text-base">
                  Luvas Nitrílicas & Luvas de Tato (PU)
                </h5>
                <div className="space-y-1.5 text-xs text-stone-300">
                  <strong className="text-stone-100 block">Por que é inegociável:</strong>
                  <p className="leading-relaxed">
                    Lavar as mãos com aguarrás ou thinner é a pior agressão que existe: o solvente dissolve a gordura natural da pele, entra na corrente sanguínea e gera dermatite severa com fissuras sangrentas nos dedos.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-stone-800 text-[11px] text-amber-300/90 italic font-mono">
                💡 Nitrílica para produtos com solvente; luva PU com tato para lixamento e recorte.
              </div>
            </div>

            {/* EPI 5: Calçado de Segurança */}
            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-5 space-y-3 hover:border-amber-500/50 transition flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 font-mono text-[10px] font-bold">
                    EPI 05 • Estabilidade & Quedas
                  </span>
                  <span className="text-xl">🥾</span>
                </div>
                <h5 className="font-bold text-white text-base">
                  Botina de Segurança Antiderrapante
                </h5>
                <div className="space-y-1.5 text-xs text-stone-300">
                  <strong className="text-stone-100 block">Por que é inegociável:</strong>
                  <p className="leading-relaxed">
                    Escadas metálicas, pisos com lona plástica lisa, andaimes e respingos de sabão são armadilhas diárias. Chinelo ou tênis velho com sola gasta é convite para torção e queda com fratura.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-stone-800 text-[11px] text-amber-300/90 italic font-mono">
                💡 Solado de poliuretano bidensidade dá firmeza até no degrau mais fino.
              </div>
            </div>

            {/* EPI 6: Protetor Auricular */}
            <div className="bg-stone-900 rounded-2xl border border-stone-800 p-5 space-y-3 hover:border-amber-500/50 transition flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 font-mono text-[10px] font-bold">
                    EPI 06 • Audição
                  </span>
                  <span className="text-xl">🎧</span>
                </div>
                <h5 className="font-bold text-white text-base">
                  Protetor Auricular (Plug de Silicone / Concha)
                </h5>
                <div className="space-y-1.5 text-xs text-stone-300">
                  <strong className="text-stone-100 block">Por que é inegociável:</strong>
                  <p className="leading-relaxed">
                    Lixadeiras roto-orbitais, aspiradores de pó contínuos e compressores ultrapassam facilmente 85 decibéis. A perda auditiva por ruído é lenta, silenciosa e irreversível.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-stone-800 text-[11px] text-amber-300/90 italic font-mono">
                💡 O modelo tipo plug é leve, lavável e não atrapalha o uso de boné e óculos.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. POSTURA E RELACIONAMENTO COM O CLIENTE (DICAS DE OURO) */}
      {/* ========================================================================= */}
      {abaAtiva === 'postura' && (
        <div className="bg-stone-950 p-4 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl border border-stone-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
            <div>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Módulo 05 • Etiqueta de Obra</span>
              <h4 className="text-lg sm:text-2xl font-extrabold text-white mt-0.5">
                Postura & Relacionamento: Como Conquistar o Respeito do Cliente e Cobrar Mais
              </h4>
            </div>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30">
              Inteligência Comercial
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Pilar 1: O Chão Fala Mais Que a Parede */}
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 hover:border-amber-500/50 transition">
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
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 hover:border-amber-500/50 transition">
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
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 hover:border-amber-500/50 transition">
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
            <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 hover:border-amber-500/50 transition">
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
            <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-stone-900 to-stone-900 border border-amber-500/40 space-y-3">
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

    </div>
  );
};
