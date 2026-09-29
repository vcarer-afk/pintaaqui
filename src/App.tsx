/**
 * Pinta Aqui - Plataforma Oficial por Vlademir Carer
 * Conteúdo Completo: "Pintura Fácil e Descomplicada"
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Layers, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Droplet, 
  ShieldCheck, 
  Sun, 
  Brush, 
  BookOpen,
  ArrowRight,
  Info,
  Lock,
  Unlock,
  Key,
  Database,
  Settings,
  X,
  LogOut,
  Save,
  Check,
  Eye,
  EyeOff,
  Menu,
  FileCode,
  Shield,
  Palette,
  Cloud,
  Zap,
  Activity,
  RefreshCw,
  Briefcase,
  Phone,
  ExternalLink,
  Star,
  Award,
  Clock,
  MapPin,
  CheckCircle,
  Users,
  UserPlus,
  Trash2,
  XCircle,
  Building2,
  User,
  Filter,
  CheckCheck
} from 'lucide-react';
import { 
  testSupabaseCloudConnection, 
  ConnectionTestResult,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_ANON_KEY,
  PintorProfissional,
  cadastrarPintorNuvem,
  listarPintoresNuvem,
  atualizarStatusPintorNuvem,
  excluirPintorNuvem
} from './lib/supabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'geral' | 'desvendando' | 'tipos' | 'texturas' | 'ferramentas' | 'patologias' | 'profissional'>('geral');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Admin Modal & Auth States
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Supabase & Site Settings (Com credenciais padrão em nuvem)
  const [supabaseUrl, setSupabaseUrl] = useState(DEFAULT_SUPABASE_URL);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(DEFAULT_SUPABASE_ANON_KEY);
  const [adminTab, setAdminTab] = useState<'pintores' | 'supabase' | 'schema' | 'geral'>('pintores');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Supabase Cloud Connection Test State
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);

  // Dashboard de Gestão de Pintores (Admin)
  const [pintoresNuvem, setPintoresNuvem] = useState<PintorProfissional[]>([]);
  const [loadingPintores, setLoadingPintores] = useState(false);
  const [statusFiltroPintores, setStatusFiltroPintores] = useState<'todos' | 'pendente' | 'aprovado' | 'rejeitado'>('todos');
  const [pintorParaVisualizar, setPintorParaVisualizar] = useState<PintorProfissional | null>(null);
  const [adminFeedback, setAdminFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal de Cadastro do Pintor (Público)
  const [cadastroModalOpen, setCadastroModalOpen] = useState(false);
  const [formTipoPessoa, setFormTipoPessoa] = useState<'PF' | 'PJ'>('PF');
  const [formNome, setFormNome] = useState('');
  const [formDocumento, setFormDocumento] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formCidade, setFormCidade] = useState('');
  const [formEstado, setFormEstado] = useState('SP');
  const [formExperiencia, setFormExperiencia] = useState(5);
  const [formEspecialidades, setFormEspecialidades] = useState<string[]>([
    'Massa Corrida & Nivelamento',
    'Cimento Queimado & Texturas'
  ]);
  const [formSenha, setFormSenha] = useState('');
  const [formConfirmaSenha, setFormConfirmaSenha] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formErro, setFormErro] = useState('');
  const [formSucesso, setFormSucesso] = useState(false);

  // Load saved credentials from localStorage if user updated them, else defaults
  useEffect(() => {
    const savedAuth = localStorage.getItem('pintaaqui_admin_logged');
    if (savedAuth === 'true') {
      setIsAdminLoggedIn(true);
    }
    const savedUrl = localStorage.getItem('pintaaqui_supabase_url');
    const savedAnon = localStorage.getItem('pintaaqui_supabase_anon');
    if (savedUrl) setSupabaseUrl(savedUrl);
    if (savedAnon) setSupabaseAnonKey(savedAnon);
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    // Login solicitado: admim | senha: dndigqol (aceitando também 'admin' para evitar bloqueios acidentais por digitação)
    const validUser = adminUser.trim().toLowerCase() === 'admim' || adminUser.trim().toLowerCase() === 'admin';
    const validPass = adminPassword.trim() === 'dndigqol';

    if (validUser && validPass) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('pintaaqui_admin_logged', 'true');
      setAdminUser('');
      setAdminPassword('');
      setAuthError('');
    } else {
      setAuthError('Usuário ou senha incorretos. Verifique suas credenciais.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('pintaaqui_admin_logged');
    setAdminModalOpen(false);
    setTestResult(null);
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pintaaqui_supabase_url', supabaseUrl.trim());
    localStorage.setItem('pintaaqui_supabase_anon', supabaseAnonKey.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const carregarPintores = async () => {
    setLoadingPintores(true);
    try {
      const res = await listarPintoresNuvem();
      if (res.success) {
        setPintoresNuvem(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPintores(false);
    }
  };

  useEffect(() => {
    carregarPintores();
  }, []);

  const handleAprovarPintor = async (id?: string) => {
    if (!id) return;
    const res = await atualizarStatusPintorNuvem(id, 'aprovado');
    if (res.success) {
      setAdminFeedback({ message: 'Pintor aprovado com sucesso! Já está visível na vitrine.', type: 'success' });
      carregarPintores();
    } else {
      setAdminFeedback({ message: res.error || 'Erro ao aprovar pintor na nuvem.', type: 'error' });
    }
    setTimeout(() => setAdminFeedback(null), 4000);
  };

  const handleRejeitarPintor = async (id?: string) => {
    if (!id) return;
    const res = await atualizarStatusPintorNuvem(id, 'rejeitado');
    if (res.success) {
      setAdminFeedback({ message: 'Status alterado para rejeitado.', type: 'success' });
      carregarPintores();
    } else {
      setAdminFeedback({ message: res.error || 'Erro ao atualizar status na nuvem.', type: 'error' });
    }
    setTimeout(() => setAdminFeedback(null), 4000);
  };

  const handleExcluirPintor = async (id?: string) => {
    if (!id) return;
    if (!window.confirm('Tem certeza que deseja excluir este pintor definitivamente da nuvem? Esta ação não pode ser desfeita.')) {
      return;
    }
    const res = await excluirPintorNuvem(id);
    if (res.success) {
      setAdminFeedback({ message: 'Registro do pintor excluído da nuvem com sucesso.', type: 'success' });
      carregarPintores();
    } else {
      setAdminFeedback({ message: res.error || 'Erro ao excluir da nuvem.', type: 'error' });
    }
    setTimeout(() => setAdminFeedback(null), 4000);
  };

  const handleCadastroPintor = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErro('');

    if (!formNome.trim()) {
      setFormErro('Informe o seu nome completo ou razão social.');
      return;
    }

    if (!formDocumento.trim()) {
      setFormErro(`Informe o ${formTipoPessoa === 'PF' ? 'CPF' : 'CNPJ'}.`);
      return;
    }

    if (!formWhatsapp.trim()) {
      setFormErro('Informe o seu número de WhatsApp com DDD.');
      return;
    }

    if (!formCidade.trim()) {
      setFormErro('Informe a sua cidade.');
      return;
    }

    if (formEspecialidades.length === 0) {
      setFormErro('Selecione pelo menos uma especialidade.');
      return;
    }

    // Regra da senha: 6 dígitos contendo números e letras
    const senhaLimpa = formSenha.trim();
    const temLetra = /[a-zA-Z]/.test(senhaLimpa);
    const temNumero = /[0-9]/.test(senhaLimpa);
    if (senhaLimpa.length < 6 || !temLetra || !temNumero) {
      setFormErro('A senha deve ter no mínimo 6 caracteres e conter tanto letras quanto números.');
      return;
    }

    if (senhaLimpa !== formConfirmaSenha.trim()) {
      setFormErro('A confirmação da senha não coincide com a senha digitada.');
      return;
    }

    setFormSubmitting(true);
    const res = await cadastrarPintorNuvem({
      tipo_pessoa: formTipoPessoa,
      documento: formDocumento,
      nome: formNome,
      whatsapp: formWhatsapp,
      cidade: formCidade,
      estado: formEstado,
      experiencia_anos: formExperiencia,
      especialidades: formEspecialidades,
      senha: senhaLimpa,
      fotos: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80'
      ]
    });

    setFormSubmitting(false);

    if (res.success) {
      setFormSucesso(true);
      carregarPintores();
    } else {
      setFormErro(res.error || 'Erro ao conectar à nuvem para registrar cadastro.');
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setTestResult(null);
    try {
      const result = await testSupabaseCloudConnection(supabaseUrl, supabaseAnonKey);
      setTestResult(result);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Erro inesperado ao tentar conectar com a nuvem.',
        details: err?.message || 'Falha de rede.',
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const menuItems = [
    { id: 'geral', label: 'Visão Geral', icon: Sparkles },
    { id: 'desvendando', label: 'Desvendando a Pintura', icon: BookOpen },
    { id: 'tipos', label: 'Tipos de Tinta', icon: Droplet },
    { id: 'texturas', label: 'Texturas & Efeitos', icon: Palette },
    { id: 'ferramentas', label: 'Ferramentas Certas', icon: Wrench },
    { id: 'patologias', label: 'Patologias & Soluções', icon: AlertTriangle },
    { id: 'profissional', label: 'Área do Profissional', icon: Briefcase },
  ] as const;

  const patologias = [
    {
      id: 1,
      titulo: "1. Bolhas na Parede",
      img: "foto-patologia-1-bolhas.jpg",
      tipo: "Umidade ou Aderência",
      resumo: "Formação de bolsas de ar ou água sob a película de tinta.",
      porQue: "Acontece por dois motivos principais: ou há umidade vindo de dentro da parede querendo evaporar (empurrando a tinta para fora), ou a tinta foi aplicada sobre poeira, pó de lixamento ou sobre uma parede antiga caiada sem a devida limpeza e aplicação de Fundo Preparador.",
      solucao: "Primeiro, identifique e conserte o vazamento ou infiltração. Depois, raspe toda a área que estiver solta até chegar ao reboco firme. Lixe bem, remova todo o pó com pano úmido, aplique 1 demão de Fundo Preparador de Paredes (ele vai aglutinar a base), nivele com massa acrílica (se for fora) ou corrida (se for dentro) e repinte com tinta de qualidade."
    },
    {
      id: 2,
      titulo: "2. Descascamento ou Desplacamento",
      img: "foto-patologia-2-descascamento.jpg",
      tipo: "Falta de Aderência",
      resumo: "A tinta solta em folhas ou placas inteiras, como casca de cebola.",
      porQue: "A tinta nova não colou na parede. Isso acontece quase sempre quando pintamos direto sobre pó solto de lixa, reboco esfarelado, ou quando se tenta pintar sobre tinta a óleo/brilhante sem lixar antes para quebrar o brilho e dar ancoragem.",
      solucao: "Não adianta passar tinta por cima, senão vai cair tudo junto. Raspe com espátula de aço tudo o que estiver solto. Lixe profundamente a parede. Aplique uma demão generosa de Fundo Preparador de Paredes Base Água. Espere secar, faça as correções com massa e aplique as demãos da tinta de acabamento."
    },
    {
      id: 3,
      titulo: "3. Mofo e Bolor (Manchas Pretas ou Esverdeadas)",
      img: "foto-patologia-3-mofo.jpg",
      tipo: "Proliferação Biológica",
      resumo: "Pontos escuros e cheiro característico de umidade em tetos e cantos.",
      porQue: "Fungos adoram três coisas: escuridão, umidade e calor. Ambientes com pouca circulação de ar, como banheiros, armários embutidos e quartos fechados durante o inverno, são pratos cheios para o fungo se alimentar do composto orgânico da tinta.",
      solucao: "Lavar a parede com uma solução de água e água sanitária (na proporção 1:1) ou alvejante clorado. Deixe agir por 30 minutos para matar os esporos e enxágue com pano limpo e úmido. Deixe secar 100%. Ao repintar, utilize uma tinta Acrílica Premium antimofo ou adicione um aditivo bactericida/fungicida na tinta nova."
    },
    {
      id: 4,
      titulo: "4. Eflorescência (O 'Pó Branco' que brota do reboco)",
      img: "foto-patologia-4-eflorescencia.jpg",
      tipo: "Reboco e Umidade",
      resumo: "Pó branco cristalino que parece sal acumulado sobre a tinta.",
      porQue: "A água entrou no reboco ou o reboco foi pintado antes do tempo de cura (menos de 28 dias). Quando essa água evapora pela parede, ela traz consigo os sais minerais do cimento e da cal. Ao chegar na superfície e ter contato com o ar, esses sais se cristalizam, estufando a tinta.",
      solucao: "Elimine a fonte de umidade interna. Raspe toda a camada de tinta e salitre com escova de cerdas de aço. Deixe secar bem. Aplique uma demão de Fundo Preparador de Paredes (ou Fundo Bloqueador de Umidade) para impermeabilizar os poros do reboco antes de aplicar a massa e a nova pintura."
    },
    {
      id: 5,
      titulo: "5. Saponificação (A Tinta vira uma pasta 'melada')",
      img: "foto-patologia-5-saponificacao.jpg",
      tipo: "Reação Química de Alcalinidade",
      resumo: "A tinta fica mole, grudenta, descascando e com aspecto ensaboado.",
      porQue: "Ocorre quando tintas à base de resina alquídica (esmaltes sintéticos e tintas a óleo) ou tintas comuns são aplicadas sobre reboco novo que ainda contém cal livre e umidade. A alcalinidade reage com os óleos da resina e literalmente fabrica sabão na parede!",
      solucao: "Aguarde os 28 dias obrigatórios de cura para reboco novo. Se a saponificação já aconteceu, remova completamente toda a tinta viscosa com espátula e pano com solvente/água. Lixe a superfície. Aplique um Fundo Preparador de Paredes resistente à alcalinidade e só então repinte, de preferência com Tinta Acrílica."
    },
    {
      id: 6,
      titulo: "6. Calcinação ou Gizamento (A parede solta pó na mão)",
      img: "foto-patologia-6-calcinacao.jpg",
      tipo: "Degradação por Sol / Qualidade Baixa",
      resumo: "Ao passar a mão na parede seca, ela fica branca e cheia de pó fino.",
      porQue: "A resina (cola da tinta) foi destruída pelos raios solares UV ou pela ação do tempo. É comum em tintas econômicas aplicadas em fachadas externas que não aguentam sol forte, deixando os pigmentos soltos na superfície.",
      solucao: "Lave a parede com jato d'água ou pano úmido para tirar todo o pó solto superficial. Deixe secar. Aplique Fundo Preparador de Paredes para 'colar' as micropartículas soltas que restaram. Por fim, aplique pelo menos duas demãos de Tinta Acrílica Standard ou Premium com alta resistência aos raios UV."
    },
    {
      id: 7,
      titulo: "7. Manchas de Pingos de Chuva (Gotas e Escorridos)",
      img: "foto-patologia-7-pingos-chuva.jpg",
      tipo: "Secagem Interrompida",
      resumo: "Manchas claras ou brilhosas com formato de respingo d'água.",
      porQue: "Choveu ou deu orvalho pesado logo após pintar, antes da tinta curar completamente. A água puxou as substâncias solúveis da tinta (surfactantes e aditivos) para a superfície. Ao secar, fica aquela mancha manchada.",
      solucao: "Na maioria das vezes é muito fácil resolver: basta lavar a parede inteira com uma mangueira de baixa pressão ou esponja macia com água limpa, sem esfregar forte, assim que o tempo firmar. As manchas saem sem danificar a tinta. Se persistir, aplique mais uma demão fina da mesma tinta em dia de sol estável."
    },
    {
      id: 8,
      titulo: "8. Fissuras e Microtrincas Superficiais",
      img: "foto-patologia-8-fissuras.jpg",
      tipo: "Movimentação Térmica",
      resumo: "Linhas finas como teias de aranha que quebram a película da tinta.",
      porQue: "Paredes se expandem no calor e encolhem no frio. Se a tinta ou a massa não tiverem elasticidade, elas racham. Também acontece quando se aplica massa corrida em camadas muito grossas de uma só vez.",
      solucao: "Diferencie fissura rasa de trinca estrutural (trincas profundas que cortam o tijolo exigem pedreiro!). Para fissuras rasas na pintura externa, abra levemente a fissura em V, limpe o pó, aplique um selante acrílico elastomérico ou veda-trinca e use uma Tinta Emborrachada / Elastomérica Premium que acompanha a dilatação da parede."
    },
    {
      id: 9,
      titulo: "9. Absorção Desigual e Efeito 'Sombra'",
      img: "foto-patologia-9-absorcao-desigual.jpg",
      tipo: "Falta de Selador",
      resumo: "Paredes manchadas com partes foscas e partes mais claras ou brilhantes.",
      porQue: "Partes da parede puxam mais tinta que outras (por exemplo, onde foi feito um remendo de reboco ou massa corrida recente ao lado de uma pintura antiga). Como a parede 'bebe' a tinta desigualmente, a cor fica com manchas sombreadas.",
      solucao: "O segredo de 30 anos: nunca passe tinta direto em remendo! Em paredes novas ou com remendos, aplique sempre 1 demão de Selador Acrílico (em reboco uniforme) ou Fundo Preparador (em superfícies porosas ou fracas). Isso equaliza a absorção da parede inteira."
    },
    {
      id: 10,
      titulo: "10. Enrugamento da Película",
      img: "foto-patologia-10-enrugamento.jpg",
      tipo: "Aplicação Incorreta de Demãos",
      resumo: "A tinta fica com aspecto de pele enrugada ou casca de laranja grossa.",
      porQue: "Acontece principalmente com esmaltes sintéticos quando a camada aplicada foi grossa demais, ou quando o pintor aplicou a 2ª demão sem esperar a 1ª secar por completo. A camada superficial seca no ar enquanto a de baixo ainda está líquida, enrugando tudo.",
      solucao: "Aguarde a tinta secar bem. Raspe toda a área enrugada com espátula até nivelar. Lixe com lixa fina (grão 220). Limpe a poeira e repinte com demãos finas e uniformes, respeitando religiosamente o tempo de secagem entre demãos indicado na lata."
    },
    {
      id: 11,
      titulo: "11. Sangramento de Manchas (Graxa, Ferrugem ou Fumaça)",
      img: "foto-patologia-11-sangramento.jpg",
      tipo: "Contaminação Química",
      resumo: "Manchas amarelas, escuras ou avermelhadas que continuam reaparecendo.",
      porQue: "Você passa 3, 4, 5 demãos de tinta branca, mas a mancha de fumaça de cigarro, gordura de fogão ou fuligem continua brotando por cima da tinta. Isso porque essas substâncias são solúveis na água ou no solvente da tinta nova e migram para a superfície.",
      solucao: "Lave a parede com detergente neutro e desengordurante. Enxágue e seque. O pulo do gato profissional: aplique uma demão de Fundo Isolante de Manchas ou até mesmo um Esmalte Sintético Fosco base solvente sobre a mancha. Ele cria uma blindagem impermeável que não deixa a sujeira sangrar para a tinta acrílica."
    },
    {
      id: 12,
      titulo: "12. Crateras e 'Olhos de Peixe'",
      img: "foto-patologia-12-crateras.jpg",
      tipo: "Contaminação por Óleo ou Silicone",
      resumo: "Pequenos furinhos circulares onde a tinta se afasta como se tivesse medo.",
      porQue: "Presença de silicone, cera de carro, desmoldante ou gotículas de óleo na superfície. A tinta não consegue molhar esses pontos por causa da tensão superficial e se afasta, criando uma covinha circular.",
      solucao: "Deixe a tinta secar. Lixe toda a área afetada até eliminar os pontos. Desengordure o local passando pano embebido em solvente thinner ou aguarrás. Seque com pano limpo e repinte com a ferramenta limpa."
    },
    {
      id: 13,
      titulo: "13. Marcas de Rolo e Emendas Visíveis",
      img: "foto-patologia-13-marcas-rolo.jpg",
      tipo: "Técnica e Condição Climática",
      resumo: "Faixas verticais e linhas sobrepostas visíveis contra a luz da janela.",
      porQue: "Pintar em dia de vento forte ou muito quente faz a tinta secar antes de você conseguir espalhar. Quando o rolo passa por cima da faixa anterior que já começou a secar, ele puxa a tinta semi-seca e cria uma sobreposição de espessura.",
      solucao: "Dica de mestre: trabalhe com a técnica da 'borda úmida' (nunca deixe a faixa anterior secar antes de emendar a próxima). Dilua a tinta com a porcentagem máxima recomendada pelo fabricante em dias quentes. Use rolo de microfibra ou lã baixa e mantenha o mesmo sentido na demão final (de cima para baixo suavemente)."
    },
    {
      id: 14,
      titulo: "14. Amarelamento de Esmalte Branco",
      img: "foto-patologia-14-amarelamento.jpg",
      tipo: "Oxidação da Resina Alquídica",
      resumo: "Portas e rodapés pintados de branco que com o tempo ficam amarelados.",
      porQue: "Esmaltes sintéticos tradicionais (base solvente) usam óleos vegetais na sua composição. Em locais internos e escuros (sem luz solar direta), esses óleos oxidam naturalmente e amarelam o filme de tinta. Ironicamente, o sol clareia e a escuridão amarela o esmalte sintético!",
      solucao: "Se for pintar áreas internas (portas, janelas, batentes e rodapés de madeira ou metal), use exclusivamente Esmalte Base Água. O esmalte base água não amarela nunca, não tem cheiro forte e seca em minutos."
    },
    {
      id: 15,
      titulo: "15. Desbotamento Precoce da Cor",
      img: "foto-patologia-15-desbotamento.jpg",
      tipo: "Degradação de Pigmento por Sol",
      resumo: "Cores vivas (como vermelho, azul ou amarelo) que perdem a força rapidamente.",
      porQue: "Uso de corantes de baixa resistência ao sol ou tintas preparadas para interior sendo usadas na fachada externa. Pigmentos orgânicos baratos não resistem à radiação ultravioleta contínua do sol brasileiro.",
      solucao: "Para áreas externas com muito sol, escolha tintas preparadas em sistema tintométrico com pigmentos inorgânicos de alta solidez à luz, ou tintas prontas de linha Premium para fachadas. Lave a superfície e aplique 2 a 3 demãos de Tinta Acrílica Premium ou Emborrachada."
    }
  ];

  const filteredPatologias = patologias.filter(p => 
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.resumo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.porQue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      {/* Header Topo com Autoridade de Vlademir Carer e Acesso Administrativo */}
      <header className="bg-stone-900 text-stone-100 border-b border-amber-600/30 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo e Nome */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center font-bold text-white shadow-md text-xl tracking-wider">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">Pinta Aqui</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30">
                  Por Vlademir Carer
                </span>
              </div>
            </div>
          </div>

          {/* Menus Desktop (Sem números, design moderno e limpo) */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-stone-950/60 p-1.5 rounded-2xl border border-stone-800/80">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Canto Superior Direito: Acesso Administrativo (Cadeado) + Menu Mobile */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAdminModalOpen(true)}
              title={isAdminLoggedIn ? "Painel Administrativo (Conectado)" : "Acesso Administrativo"}
              className={`p-2 rounded-xl transition-all border flex items-center gap-1.5 text-xs font-medium ${
                isAdminLoggedIn
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60 shadow-xs'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border-stone-700 hover:border-amber-500/50'
              }`}
            >
              {isAdminLoggedIn ? (
                <>
                  <Unlock className="w-4 h-4 text-emerald-400" />
                  <span className="hidden sm:inline text-xs text-emerald-300">Admin</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline text-xs text-stone-300">Painel</span>
                </>
              )}
            </button>

            {/* Botão Menu Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5 text-stone-300" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Retrátil */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-800 bg-stone-950/95 backdrop-blur-md px-4 py-3 space-y-1">
            <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2 px-2">
              Seções do Pinta Aqui
            </p>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Barra de Menus Horizontal com Scroll Suave para Tablets & Celulares */}
        <div className="lg:hidden border-t border-stone-800/80 bg-stone-900/90 overflow-x-auto no-scrollbar px-3 py-2 flex items-center gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                    : 'text-stone-300 bg-stone-800/60 hover:bg-stone-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Hero da Seção Leigos */}
      <section className="bg-gradient-to-b from-stone-900 via-stone-850 to-stone-900 text-stone-100 py-8 sm:py-9 px-4 sm:px-6 relative overflow-hidden border-b border-stone-800">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Guia Completo para Você Mesmo Pintar Sem Mistério
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Pintura Fácil e Descomplicada
          </h1>

          <div className="border-l-2 border-amber-500/60 pl-3.5 py-0.5">
            <p className="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed font-normal">
              "Pintar a própria casa não é um bicho de sete cabeças: e pode ser ate uma terapia, revitalizante e econômica quando você sabe o caminho das pedras. Deixe que eu te guio passo a passo."
            </p>
          </div>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-stone-200">
            <div className="bg-stone-900/80 backdrop-blur px-4 py-3 rounded-xl border border-stone-800 hover:border-stone-700 transition">
              <span className="block text-xl sm:text-2xl font-bold text-amber-400">+30</span>
              <span className="text-xs text-stone-400">Anos de experiência prática</span>
            </div>
            <div className="bg-stone-900/80 backdrop-blur px-4 py-3 rounded-xl border border-stone-800 hover:border-stone-700 transition">
              <span className="block text-xl sm:text-2xl font-bold text-amber-400">15</span>
              <span className="text-xs text-stone-400">Patologias explicadas & resolvidas</span>
            </div>
            <div className="bg-stone-900/80 backdrop-blur px-4 py-3 rounded-xl border border-stone-800 hover:border-stone-700 transition">
              <span className="block text-xl sm:text-2xl font-bold text-amber-400">Zero</span>
              <span className="text-xs text-stone-400">Desperdício de tinta e dinheiro</span>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-16">

        {/* Resumo ou Abas */}
        {activeTab === 'geral' && (
          <div className="space-y-12">
            <div className="bg-amber-50 rounded-2xl p-6 sm:p-8 border border-amber-200 text-stone-800 shadow-sm">
              <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-amber-700" />
                Como navegar neste guia do Pinta Aqui
              </h2>
              <p className="mt-3 text-stone-700 leading-relaxed text-sm sm:text-base">
                Desenvolvi este manual especialmente para você que nunca segurou um rolo na mão, ou para quem já tentou pintar e teve dor de cabeça com bolhas, marcas e cheiro forte. Ele está dividido em <strong>5 pilares essenciais</strong>:
              </p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  onClick={() => setActiveTab('desvendando')}
                  className="bg-white p-5 rounded-xl border border-stone-200 hover:border-amber-500 hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
                    <BookOpen className="w-5 h-5 text-amber-700" />
                  </div>
                  <h3 className="font-bold text-stone-900 group-hover:text-amber-700 transition">Desvendando a Pintura</h3>
                  <p className="text-xs text-stone-600 mt-1">O que tem dentro da lata, rendimento real e como não cair no golpe da tinta fraca.</p>
                  <span className="inline-flex items-center text-xs font-semibold text-amber-600 mt-3 group-hover:translate-x-1 transition-transform">
                    Acessar guia <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>

                <div 
                  onClick={() => setActiveTab('tipos')}
                  className="bg-white p-5 rounded-xl border border-stone-200 hover:border-amber-500 hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
                    <Droplet className="w-5 h-5 text-amber-700" />
                  </div>
                  <h3 className="font-bold text-stone-900 group-hover:text-amber-700 transition">Diferentes Tipos de Tinta</h3>
                  <p className="text-xs text-stone-600 mt-1">Paredes, ferro, madeira, piso, telhado: cada superfície pede um casamento certo.</p>
                  <span className="inline-flex items-center text-xs font-semibold text-amber-600 mt-3 group-hover:translate-x-1 transition-transform">
                    Acessar guia <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>

                <div 
                  onClick={() => setActiveTab('texturas')}
                  className="bg-white p-5 rounded-xl border border-stone-200 hover:border-amber-500 hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
                    <Palette className="w-5 h-5 text-amber-700" />
                  </div>
                  <h3 className="font-bold text-stone-900 group-hover:text-amber-700 transition">Texturas e Efeitos Decorativos</h3>
                  <p className="text-xs text-stone-600 mt-1">Grafiato, Cimento Queimado, Marmorato e Granfino traduzidos para sua sala.</p>
                  <span className="inline-flex items-center text-xs font-semibold text-amber-600 mt-3 group-hover:translate-x-1 transition-transform">
                    Acessar guia <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>

                <div 
                  onClick={() => setActiveTab('ferramentas')}
                  className="bg-white p-5 rounded-xl border border-stone-200 hover:border-amber-500 hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold mb-3">
                    <Wrench className="w-5 h-5 text-amber-700" />
                  </div>
                  <h3 className="font-bold text-stone-900 group-hover:text-amber-700 transition">Ferramentas Certas</h3>
                  <p className="text-xs text-stone-600 mt-1">Por que a melhor tinta do mundo fica horrível com o rolo ou pincel errado.</p>
                  <span className="inline-flex items-center text-xs font-semibold text-amber-600 mt-3 group-hover:translate-x-1 transition-transform">
                    Acessar guia <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>

                <div 
                  onClick={() => setActiveTab('patologias')}
                  className="bg-white p-5 rounded-xl border border-stone-200 hover:border-amber-500 hover:shadow-md cursor-pointer transition-all group md:col-span-2 lg:col-span-2"
                >
                  <div className="w-10 h-10 rounded-lg bg-red-100 text-red-800 flex items-center justify-center font-bold mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-700" />
                  </div>
                  <h3 className="font-bold text-stone-900 group-hover:text-red-700 transition">Patologias & Soluções (Doutor Parede)</h3>
                  <p className="text-xs text-stone-600 mt-1">Bolhas, mofo, esfarelamento, enrugamento, calcinamento e mais 10 problemas comuns explicados e resolvidos.</p>
                  <span className="inline-flex items-center text-xs font-semibold text-red-600 mt-3 group-hover:translate-x-1 transition-transform">
                    Consultar o Doutor Parede <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DESVENDANDO A PINTURA */}
        {(activeTab === 'geral' || activeTab === 'desvendando') && (
          <section id="desvendando" className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8 scroll-mt-24">
            <div className="border-b border-stone-100 pb-5">
              <span className="text-amber-600 font-bold text-xs uppercase tracking-wider">Fundamentos da Pintura</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                Desvendando a Pintura Sem Segredos
              </h2>
              <p className="text-stone-600 mt-2 text-sm sm:text-base">
                Pense na tinta como uma receita culinária de família: se você souber o que vai dentro da panela, nunca mais compra gato por lebre.
              </p>
            </div>

            {/* Anatomia da Tinta */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                O que realmente compõe uma lata de tinta?
              </h3>
              <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
                Para quem olha de fora, tinta parece só um líquido colorido. Mas nesses quase 30 anos no setor, gosto de explicar que toda boa tinta é formada por 4 ingredientes fundamentais:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> 1. A Resina (A "Cola" da Tinta)
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
                    É a alma da tinta! É a resina que cola o pigmento na parede, dá resistência contra chuva, sol e esfregação, e garante que a tinta não saia quando você passar pano. Quanto mais e melhor for a resina, mais cara e durável é a tinta.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> 2. Os Pigmentos (A "Cor" e o "Esconderijo")
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
                    São pós microscópicos responsáveis por dar a tonalidade e cobrir a cor antiga da parede. O famoso dióxido de titânio, por exemplo, é o pigmento branco nobre que faz uma parede preta sumir com poucas demãos.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span> 3. O Solvente / Água (O "Veículo de Transporte")
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
                    Serve unicamente para deixar a tinta líquida para que você consiga espalhar com o rolo. Depois que você aplica na parede, ele evapora 100% no ar. Nas tintas base água, o solvente é água pura; nas sintéticas, é a aguarrás.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span> 4. Cargas e Aditivos (O "Tempero Especial")
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
                    São pequenas poções que dão superpoderes: aditivo antimofo para banheiro, bactericida para quartos de crianças, antiespumante para não criar bolhas no rolo e niveladores para deixar a parede lisinha.
                  </p>
                </div>
              </div>
            </div>

            {/* Cobertura, Rendimento e Demãos */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <h3 className="text-xl font-bold text-stone-900">
                Cobertura, Rendimento e Demãos: O trio que decide o seu bolso
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-stone-200 rounded-xl p-4 bg-amber-50/40">
                  <span className="font-bold text-amber-800 text-sm block">O que é "Cobertura"?</span>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    É a capacidade da tinta em esconder a cor anterior ou o reboco. Tinta com boa cobertura seca escura e não deixa o fundo transparecer.
                  </p>
                </div>
                <div className="border border-stone-200 rounded-xl p-4 bg-amber-50/40">
                  <span className="font-bold text-amber-800 text-sm block">O que é "Rendimento"?</span>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Quantos metros quadrados aquela lata consegue pintar depois de diluída. Atenção: sempre confira o <strong>rendimento acabado</strong> (com todas as demãos aplicadas), e não apenas a primeira passada.
                  </p>
                </div>
                <div className="border border-stone-200 rounded-xl p-4 bg-amber-50/40">
                  <span className="font-bold text-amber-800 text-sm block">O que é "Demão"?</span>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Cada camada de tinta que você aplica e deixa secar. Uma pintura saudável e resistente precisa de 2 a 3 demãos cruzadas e com intervalo de secagem respeitado.
                  </p>
                </div>
              </div>
            </div>

            {/* Classificação Honestíssima */}
            <div className="space-y-4 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-stone-900">
                  Classificação das Tintas: Como não ser enganado na loja
                </h3>
                <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">Norma ABNT NBR 11702</span>
              </div>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                No balcão, o vendedor sempre tem meta para bater. Mas como seu consultor amigo, aqui está a verdade nua e crua sobre as três categorias oficiais do mercado brasileiro:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                {/* Econômica */}
                <div className="rounded-xl border border-stone-200 p-5 bg-stone-50/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-stone-500 uppercase">Categoria 1</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-semibold">Básica</span>
                    </div>
                    <h4 className="text-lg font-bold text-stone-800">Tinta Econômica</h4>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      Possui pouca resina e mais carga mineral. Não aguenta água nem esfregação: se passar pano molhado, ela solta na mão. O acabamento é sempre fosco rústico.
                    </p>
                    <div className="mt-3 text-xs bg-white p-2.5 rounded border border-stone-200 text-stone-700">
                      <strong>Para onde serve:</strong> Tetos de gesso (onde ninguém toca), despensas, garagens internas secas ou imóveis de aluguel para entrega rápida. Nunca use em fachada externa!
                    </div>
                  </div>
                </div>

                {/* Standard */}
                <div className="rounded-xl border border-amber-300 p-5 bg-amber-50/30 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-600 uppercase">Categoria 2</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-semibold">Custo-Benefício</span>
                    </div>
                    <h4 className="text-lg font-bold text-stone-900">Tinta Standard</h4>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      O equilíbrio honesto para a maioria das casas. Tem boa cobertura, resistência moderada à limpeza leve com pano úmido e detergente neutro, e rende muito bem.
                    </p>
                    <div className="mt-3 text-xs bg-white p-2.5 rounded border border-amber-200 text-stone-700">
                      <strong>Para onde serve:</strong> Quartos, salas, corredores e paredes internas sem umidade crônica. Excelente escolha quando a grana está contada mas você quer dignidade e cor bonita por anos.
                    </div>
                  </div>
                </div>

                {/* Premium */}
                <div className="rounded-xl border border-amber-500 p-5 bg-amber-50/80 flex flex-col justify-between shadow-sm relative">
                  <div className="absolute -top-3 right-4 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Recomendação de Mestre
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-700 uppercase">Categoria 3</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-600 text-white font-semibold">Alta Performance</span>
                    </div>
                    <h4 className="text-lg font-bold text-stone-950">Tinta Premium</h4>
                    <p className="text-xs text-stone-700 mt-2 leading-relaxed">
                      O melhor que a química das tintas pode oferecer. Carga altíssima de resina e pigmentos nobres. É verdadeiramente lavável (sujou de café, molho ou giz de cera, limpa fácil), dura de 5 a 8 anos e resiste a sol e chuva fortes.
                    </p>
                    <div className="mt-3 text-xs bg-white p-2.5 rounded border border-amber-300 text-stone-800">
                      <strong>Para onde serve:</strong> Fachadas de rua, muros externos, cozinhas, lavabos, corredores movimentados com crianças e pets, e para quem não quer refazer a pintura tão cedo.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Imagem Placeholder */}
            <div className="p-4 bg-stone-100 rounded-xl border border-dashed border-stone-300 text-center">
              <img 
                src="caminho-da-imagem-desvendando-tintas.jpg" 
                alt="Vlademir Carer comparando latas de tinta Econômica, Standard e Premium na bancada de testes" 
                className="w-full max-h-72 object-cover rounded-lg mx-auto bg-stone-200 text-xs text-stone-400 italic flex items-center justify-center p-8"
              />
              <span className="text-xs text-stone-500 mt-2 block font-mono">
                [Placeholder de Foto: Comparativo real de acabamento Premium x Standard x Econômico]
              </span>
            </div>
          </section>
        )}

        {/* DIFERENTES TIPOS DE TINTA */}
        {(activeTab === 'geral' || activeTab === 'tipos') && (
          <section id="tipos" className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8 scroll-mt-24">
            <div className="border-b border-stone-100 pb-5">
              <span className="text-amber-600 font-bold text-xs uppercase tracking-wider">Guia de Aplicação</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                Diferentes Tipos de Tinta: Para Que Serve Cada Uma e Onde Usar
              </h2>
              <p className="text-stone-600 mt-2 text-sm sm:text-base">
                Pintar a porta de madeira com a mesma tinta da parede da sala é o erro clássico que dá dor de cabeça. Conheça a ferramenta certa para cada material da sua casa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tinta de Parede Acrílica e Látex PVA */}
              <div className="border border-stone-200 rounded-xl p-5 hover:border-amber-400 transition bg-stone-50/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                    01
                  </div>
                  <h3 className="font-bold text-stone-900 text-base">Tinta de Parede (Acrílica e Látex PVA)</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  <strong>Látex PVA:</strong> Feita à base de acetato de polivinila. É mais frágil e só serve para paredes internas secas e tetos. Dilui com água e não tem cheiro.
                </p>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-2">
                  <strong>Acrílica:</strong> Contém resina 100% acrílica impermeabilizante. Pode ser usada dentro e fora de casa, suporta sereno e sol, e existe em três acabamentos clássicos: <em>Fosco</em> (esconde imperfeições da parede), <em>Acetinado</em> (toque macio de seda, fácil de limpar) e <em>Semibrilho</em> (brilho vivo, altíssima lavabilidade).
                </p>
                <div className="mt-3 text-xs bg-amber-100/60 text-amber-900 p-2 rounded font-medium">
                  Ideal para: Alvenaria, reboco curado, blocos, gesso acartonado e massa corrida.
                </div>
              </div>

              {/* Tinta para Metal */}
              <div className="border border-stone-200 rounded-xl p-5 hover:border-amber-400 transition bg-stone-50/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                    02
                  </div>
                  <h3 className="font-bold text-stone-900 text-base">Tinta para Metal e Portões</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  O ferro precisa de proteção dupla: contra a ferrugem (oxidação) e acabamento estético. Hoje existem as modernas tintas "Direto no Metal" ou "Direto na Ferrugem" (que funcionam como fundo convertedor e acabamento ao mesmo tempo).
                </p>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-2">
                  Se usar a tinta tradicional, a regra de ouro do Vlademir é: lixar para tirar a ferrugem solta, aplicar 1 demão de <em>Zarcão</em> ou <em>Fundo Cromato/Sintético</em>, e só depois finalizar com o esmalte.
                </p>
                <div className="mt-3 text-xs bg-amber-100/60 text-amber-900 p-2 rounded font-medium">
                  Ideal para: Portões, grades, janelas de ferro, estruturas metálicas e tubulações.
                </div>
              </div>

              {/* Vernizes Tradicionais */}
              <div className="border border-stone-200 rounded-xl p-5 hover:border-amber-400 transition bg-stone-50/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                    03
                  </div>
                  <h3 className="font-bold text-stone-900 text-base">Vernizes para Madeira</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  O verniz cria uma <strong>película protetora transparente ou tonalizada sobre a madeira</strong> (como se fosse um vidro ou plástico por cima). Dá brilho alto ou acetinado, realça os veios naturais da madeira e protege contra chuva.
                </p>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-2">
                  <em>Atenção do Vlademir:</em> Para portas externas com sol forte, escolha sempre verniz com filtro solar duplo ou triplo (tipo Marítimo ou Copal nobre).
                </p>
                <div className="mt-3 text-xs bg-amber-100/60 text-amber-900 p-2 rounded font-medium">
                  Ideal para: Portas de entrada, móveis de madeira de lei, corrimãos e forros internos.
                </div>
              </div>

              {/* Impregnantes (Stain) */}
              <div className="border border-stone-200 rounded-xl p-5 hover:border-amber-400 transition bg-amber-50/40 border-amber-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
                    04
                  </div>
                  <h3 className="font-bold text-stone-900 text-base">Impregnantes (Stain) vs. Verniz: A Diferença Crucial</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  <strong>O segredo que quase ninguém conta:</strong> Enquanto o verniz cria uma película dura por cima da madeira que com o tempo racha e descasca em cascas difíceis de lixar, o <strong>Stain penetra profundamente nos poros da madeira</strong>.
                </p>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mt-2">
                  O Stain não cria película superficial! Ele nutre a fibra, tem ação fungicida, hidro-repelente e proteção UV. Na hora de renovar depois de 2 anos, não precisa lixar até arrancar a pele: basta limpar a poeira e dar outra demão direta.
                </p>
                <div className="mt-3 text-xs bg-amber-200/70 text-amber-950 p-2 rounded font-medium">
                  Ideal para: Decks de piscina, pergolados, cercas de madeira e móveis de jardim expostos ao tempo.
                </div>
              </div>

              {/* Esmalte Base Água */}
              <div className="border border-stone-200 rounded-xl p-5 hover:border-amber-400 transition bg-stone-50/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                    05
                  </div>
                  <h3 className="font-bold text-stone-900 text-base">Esmalte Sintético Base Água (A Revolução)</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Se você odeia aquele cheiro forte de tinta que dá dor de cabeça na família inteira, o esmalte base água é sua salvação. Seca em 30 a 45 minutos ao toque, a limpeza dos pincéis é feita na pia da cozinha apenas com água da torneira, e tem um detalhe mágico: <strong>o esmalte branco base água NUNCA amarela</strong> com os anos!
                </p>
                <div className="mt-3 text-xs bg-amber-100/60 text-amber-900 p-2 rounded font-medium">
                  Ideal para: Portas internas de madeira, batentes, rodapés, janelas e corrimãos de ferro.
                </div>
              </div>

              {/* Esmalte Base Solvente */}
              <div className="border border-stone-200 rounded-xl p-5 hover:border-amber-400 transition bg-stone-50/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                    06
                  </div>
                  <h3 className="font-bold text-stone-900 text-base">Esmalte Base Solvente (Tradicional)</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  É a tinta clássica a óleo com cheiro de aguarrás. O brilho dela é muito espelhado e a resistência contra atrito mecânico é consagrada. Porém, demora de 6 a 8 horas para secar entre demãos e, se usada na cor branca em quartos escuros, tende a amarelar naturalmente pela ausência de luz solar direta.
                </p>
                <div className="mt-3 text-xs bg-amber-100/60 text-amber-900 p-2 rounded font-medium">
                  Ideal para: Grades externas, portões pesados e quem busca o tradicional brilho espelhado a óleo.
                </div>
              </div>

              {/* Resinas Acrílicas para Telhados e Pedras */}
              <div className="border border-stone-200 rounded-xl p-5 hover:border-amber-400 transition bg-stone-50/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                    07
                  </div>
                  <h3 className="font-bold text-stone-900 text-base">Resinas para Telhados e Pedras</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Líquido impermeabilizante que pode ser transparente ou colorido (cerâmica, grafite, concreto). Cria um escudo hidrorrepelente que impede que telhas e pedras porosas absorvam água da chuva, evitando o acúmulo de limo preto, bolor e goteiras por infiltração de porosidade.
                </p>
                <div className="mt-3 text-xs bg-amber-100/60 text-amber-900 p-2 rounded font-medium">
                  Ideal para: Telhas de barro ou cimento, pedra mineira, pedra São Tomé, tijolos à vista e calçadas.
                </div>
              </div>

              {/* Tintas Epóxi */}
              <div className="border border-stone-200 rounded-xl p-5 hover:border-amber-400 transition bg-stone-50/30">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                    08
                  </div>
                  <h3 className="font-bold text-stone-900 text-base">Tintas Epóxi (Azulejos e Pisos)</h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  O tanque de guerra das tintas. Adere até sobre vidro e esmalte vitrificado de azulejos antigos sem precisar quebrar nada na obra! Suporta água quente de chuveiro, produtos químicos de limpeza e tráfego de pessoas e carros (versão piso bicomponente).
                </p>
                <div className="mt-3 text-xs bg-amber-100/60 text-amber-900 p-2 rounded font-medium">
                  Ideal para: Azulejos de banheiro e cozinha, lavanderias, pisos de garagem e bancadas.
                </div>
              </div>
            </div>

            {/* Placeholder de Imagem Tipos */}
            <div className="p-4 bg-stone-100 rounded-xl border border-dashed border-stone-300 text-center">
              <img 
                src="caminho-da-imagem-guia-tipos-tintas.jpg" 
                alt="Infográfico prático do Vlademir Carer mostrando cada lata de tinta e sua respectiva aplicação na casa" 
                className="w-full max-h-72 object-cover rounded-lg mx-auto bg-stone-200 text-xs text-stone-400 italic flex items-center justify-center p-8"
              />
              <span className="text-xs text-stone-500 mt-2 block font-mono">
                [Placeholder de Foto: Mostruário com superfícies reais pintadas: madeira, ferro, alvenaria e azulejo]
              </span>
            </div>
          </section>
        )}

        {/* TEXTURAS E EFEITOS DECORATIVOS */}
        {(activeTab === 'geral' || activeTab === 'texturas') && (
          <section id="texturas" className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8 scroll-mt-24">
            <div className="border-b border-stone-100 pb-5">
              <span className="text-amber-600 font-bold text-xs uppercase tracking-wider">Efeitos & Tendências</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                Texturas e Efeitos Decorativos: Vista a Sua Parede
              </h2>
              <p className="text-stone-600 mt-2 text-sm sm:text-base">
                A parede lisa é ótima, mas uma parede de destaque com efeito transforma uma casa comum em um ambiente de revista de arquitetura. Veja como cada efeito se parece na prática:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Textura Lisa / Rolada */}
              <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Efeito 1</span>
                  <h3 className="text-lg font-bold text-stone-900 mt-1">Textura Lisa / Rolada</h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                    Aplicada com rolo especial para textura de espuma dura. Cria relevos sutis e suaves, parecendo pequenos picos delicados de chantilly.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-700">
                  <strong>Onde brilha:</strong> Fachadas de sobrados e muros externos. Disfarça pequenas ondulações do reboco sem pesar visualmente.
                </div>
              </div>

              {/* Textura Design (Arenosa) */}
              <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Efeito 2</span>
                  <h3 className="text-lg font-bold text-stone-900 mt-1">Textura Design (Efeito Arenoso)</h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                    Lembra dunas de areia fina varridas pela brisa do mar. Tem microcristais de quartzo que, ao receberem iluminação indireta de spots ou arandelas, criam nuances de luz e sombra fascinantes.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-700">
                  <strong>Onde brilha:</strong> Parede atrás do painel da TV, halls de entrada e lavabos charmosos.
                </div>
              </div>

              {/* Rústica / Grafiato */}
              <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Efeito 3</span>
                  <h3 className="text-lg font-bold text-stone-900 mt-1">Textura Rústica (O Famoso Grafiato)</h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                    O campeão absoluto das fachadas do Brasil. Contém pedrinhas de dolomita selecionada. Ao passar a desempenadeira plástica especial, essas pedrinhas rolam e abrem riscos característicos (verticais, horizontais ou circulares).
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-700">
                  <strong>Onde brilha:</strong> Muros e fachadas expostas a chuva forte. É super resistente e cobre rebocos imperfeitos como mágica.
                </div>
              </div>

              {/* Granfino */}
              <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Efeito 4</span>
                  <h3 className="text-lg font-bold text-stone-900 mt-1">Granfino (Textura de Granulometria Fina)</h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                    É o "irmão elegante e discreto" do grafiato. Seus grãos minerais são muito menores. O resultado é um riscado uniforme, macio ao toque e muito mais sóbrio e moderno.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-700">
                  <strong>Onde brilha:</strong> Casas modernas com arquitetura minimalista, pilares e varandas gourmet.
                </div>
              </div>

              {/* Pedras Decorativas / Cristais Naturais */}
              <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Efeito 5</span>
                  <h3 className="text-lg font-bold text-stone-900 mt-1">Pedras Decorativas e Cristal</h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                    Massa composta por pedras minerais nobres moídas (como mica e quartzo puro) imersas em resina transparente hidro-repelente. Não leva corante sintético: a cor vem da própria pedra natural, brilhando discretamente à luz do sol.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-700">
                  <strong>Onde brilha:</strong> Entradas de condomínios, pórticos de fachada e áreas de lazer de alto padrão.
                </div>
              </div>

              {/* Cimento Queimado */}
              <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Efeito 6</span>
                  <h3 className="text-lg font-bold text-stone-900 mt-1">Cimento Queimado Moderno</h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                    O queridinho da decoração contemporânea e industrial. Aquela aparência rústica-chique de concreto aparente com nuances claras e escuras em degradê suave, feito com desempenadeira de cantos arredondados.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-700">
                  <strong>Onde brilha:</strong> Paredes da sala de estar, cabeceiras de cama, home office e estúdios modernos.
                </div>
              </div>

              {/* Marmorato */}
              <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 flex flex-col justify-between md:col-span-2 lg:col-span-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Efeito 7</span>
                    <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">Luxo & Alto Brilho</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mt-1">Marmorato (Efeito Mármore Vitrificado)</h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                    Inspirado na técnica italiana do <em>Stucco Veneziano</em>. É uma massa ultrafina aplicada em camadas quase transparentes e depois polida até atingir o brilho espelhado da pedra de mármore polida legítima. Você consegue literalmente ver o reflexo do ambiente na parede!
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-stone-700">
                  <strong>Onde brilha:</strong> Colunas clássicas, salas de jantar, lavabos de alto padrão e nichos decorativos bem iluminados.
                </div>
              </div>
            </div>

            {/* Placeholder de Imagem Texturas */}
            <div className="p-4 bg-stone-100 rounded-xl border border-dashed border-stone-300 text-center">
              <img 
                src="caminho-da-imagem-texturas-efeitos.jpg" 
                alt="Amostras reais lado a lado dos efeitos Cimento Queimado, Marmorato, Grafiato e Arenoso sob iluminação lateral quente" 
                className="w-full max-h-72 object-cover rounded-lg mx-auto bg-stone-200 text-xs text-stone-400 italic flex items-center justify-center p-8"
              />
              <span className="text-xs text-stone-500 mt-2 block font-mono">
                [Placeholder de Foto: Quadro demonstrativo dos 7 efeitos na parede sob iluminação real]
              </span>
            </div>
          </section>
        )}

        {/* CADA FERRAMENTA PARA A TINTA CERTA */}
        {(activeTab === 'geral' || activeTab === 'ferramentas') && (
          <section id="ferramentas" className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8 scroll-mt-24">
            <div className="border-b border-stone-100 pb-5">
              <span className="text-amber-600 font-bold text-xs uppercase tracking-wider">Equipamentos & Acessórios</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                A Ferramenta Certa para Cada Tinta: O Segredo do Bom Pintor
              </h2>
              <p className="text-stone-600 mt-2 text-sm sm:text-base">
                Nos meus quase 30 anos de profissão, já perdi a conta de quantas pessoas compraram a tinta mais cara da loja e depois voltaram reclamando que a parede ficou cheia de pelos, marcas ou casca de laranja. O motivo? <strong>A ferramenta errada destrói qualquer tinta boa.</strong>
              </p>
            </div>

            {/* Filosofia do Vlademir */}
            <div className="bg-amber-50/60 border-l-4 border-amber-500 p-5 rounded-r-xl">
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">O Teorema do Pinta Aqui: Ferramenta não é gasto, é garantia</h3>
              <p className="text-stone-700 text-xs sm:text-sm mt-1 leading-relaxed">
                Pense no pincel e no rolo como os sapatos de um maratonista: não adianta ter o melhor preparo físico se você correr descalço no cascalho. Economizar 10 reais comprando um rolo vagabundo que solta fios durante a pintura vai estragar uma lata de tinta de 400 reais.
              </p>
            </div>

            {/* Tabela Prática de Ferramentas */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-stone-900">
                Guia Prático de Combinação: Ferramenta x Produto
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-amber-600" />
                    <h4 className="font-bold text-stone-900 text-sm">Rolo de Lã Pelo Curto (Antigota - 9mm a 12mm)</h4>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    <strong>Para que serve:</strong> Tintas acrílicas e látex em paredes lisas, massa corrida e gesso.
                  </p>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    <strong>Por que usar:</strong> Não espirra tinta na sua cara nem no chão (sistema antigota) e deixa o acabamento bem lisinho, sem aspecto de casca de laranja grossa.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-amber-600" />
                    <h4 className="font-bold text-stone-900 text-sm">Rolo de Lã Pelo Alto / Médio (19mm a 25mm)</h4>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    <strong>Para que serve:</strong> Rebocos rústicos, tijolo aparente, muros externos e superfícies acidentadas.
                  </p>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    <strong>Por que usar:</strong> O pelo comprido consegue entrar nos buraquinhos e fendas do reboco que um rolo baixo jamais alcançaria.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-amber-600" />
                    <h4 className="font-bold text-stone-900 text-sm">Rolo de Espuma Poliéster ou Microfibra</h4>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    <strong>Para que serve:</strong> Esmaltes sintéticos, vernizes e tintas a óleo em portas de madeira e metais.
                  </p>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    <strong>Por que usar:</strong> Proporciona espalhamento ultrafino e espelhado. <em>Dica de mestre:</em> Para esmalte base água, use rolo de microfibra de 5mm para não encher de bolhinhas de ar.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-amber-600" />
                    <h4 className="font-bold text-stone-900 text-sm">Trinchas (Pincéis): Cerdas Claras vs. Gris/Pretas</h4>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    <strong>Cerdas Claras (Sintéticas macias):</strong> Para tintas base água, esmaltes acrílicos e vernizes à base de água. Não deixam riscos na pintura.
                  </p>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    <strong>Cerdas Pretas/Gris (Naturais mais firmes):</strong> Perfeitas para esmaltes sintéticos base solvente, zarcão e tintas a óleo pesadas.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-amber-600" />
                    <h4 className="font-bold text-stone-900 text-sm">Desempenadeira de Aço Inox com Cantos Arredondados</h4>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    <strong>Para que serve:</strong> Aplicação de Cimento Queimado e Marmorato.
                  </p>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    <strong>Por que usar:</strong> Não enferruja e seus cantos arredondados impedem que a lâmina risque a massa ao fazer os movimentos semicirculares característicos.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-amber-600" />
                    <h4 className="font-bold text-stone-900 text-sm">Fita Crepe Profissional (Azul ou Verde de Pintura)</h4>
                  </div>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    <strong>Para que serve:</strong> Recortes perfeitos em rodapés, marcos de portas e tetos.
                  </p>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    <strong>Por que usar:</strong> A fita comum de papelaria resseca com o sol e rasga ao puxar, arrancando a tinta de baixo junto. Fitas especiais para pintura vedam o sangramento e saem inteirinhas sem deixar cola.
                  </p>
                </div>
              </div>
            </div>

            {/* Placeholder de Imagem Ferramentas */}
            <div className="p-4 bg-stone-100 rounded-xl border border-dashed border-stone-300 text-center">
              <img 
                src="caminho-da-imagem-ferramentas-corretas.jpg" 
                alt="Kit de ferramentas essenciais do Vlademir Carer sobre a bancada: rolo antigota, rolo espuma, trinchas cerdas selecionadas e fita azul" 
                className="w-full max-h-72 object-cover rounded-lg mx-auto bg-stone-200 text-xs text-stone-400 italic flex items-center justify-center p-8"
              />
              <span className="text-xs text-stone-500 mt-2 block font-mono">
                [Placeholder de Foto: As ferramentas corretas organizadas por finalidade]
              </span>
            </div>
          </section>
        )}

        {/* PATOLOGIAS DA PINTURA */}
        {(activeTab === 'geral' || activeTab === 'patologias') && (
          <section id="patologias" className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8 scroll-mt-24">
            <div className="border-b border-stone-100 pb-5">
              <span className="text-red-600 font-bold text-xs uppercase tracking-wider">Consultório Técnico • O "Doutor Parede"</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                Patologias da Pintura: Problemas Mais Comuns e Como Curar Cada Um
              </h2>
              <p className="text-stone-600 mt-2 text-sm sm:text-base leading-relaxed">
                Na medicina da construção civil, chamamos os defeitos da parede de "patologias". Não se desespere se a sua parede está feia: quase 100% dos problemas têm conserto definitivo quando você ataca a <strong>causa raiz</strong>, e não apenas disfarça com mais tinta por cima.
              </p>

              {/* Barra de Busca de Patologias */}
              <div className="mt-5 relative">
                <input
                  type="text"
                  placeholder="Pesquise por nome do problema (ex: bolha, mofo, descascamento, mancha)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl border border-stone-300 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm bg-stone-50"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-3 text-xs text-stone-400 hover:text-stone-700"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>

            {/* Lista dos 15 Problemas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPatologias.map((item) => (
                <article 
                  key={item.id}
                  className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50/50 hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                          {item.tipo}
                        </span>
                        <h3 className="text-lg font-bold text-stone-900 mt-1.5">{item.titulo}</h3>
                      </div>
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
                    </div>

                    <p className="text-xs text-stone-500 font-medium italic">
                      "{item.resumo}"
                    </p>

                    {/* Placeholder da Foto da Patologia */}
                    <div className="bg-stone-200/70 border border-dashed border-stone-300 rounded-lg p-3 text-center my-2">
                      <img 
                        src={item.img} 
                        alt={item.titulo} 
                        className="w-full h-36 object-cover rounded bg-stone-300/80 text-[11px] text-stone-500 italic flex items-center justify-center"
                      />
                      <span className="text-[10px] text-stone-500 mt-1 block font-mono">
                        [Foto real: {item.img}]
                      </span>
                    </div>

                    <div className="space-y-3 pt-2 text-xs sm:text-sm text-stone-700">
                      <div>
                        <strong className="text-red-700 block text-xs uppercase tracking-wide">Por que isso aconteceu?</strong>
                        <p className="mt-1 text-stone-600 leading-relaxed text-xs sm:text-sm">
                          {item.porQue}
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-emerald-200 text-emerald-950">
                        <strong className="text-emerald-800 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Como resolver de vez:
                        </strong>
                        <p className="mt-1 text-stone-700 leading-relaxed text-xs">
                          {item.solucao}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-100 px-5 py-2.5 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
                    <span>Curadoria Vlademir Carer</span>
                    <span className="text-amber-700 font-medium">Solução prática testada em obra</span>
                  </div>
                </article>
              ))}
            </div>

            {filteredPatologias.length === 0 && (
              <div className="text-center py-12 text-stone-500">
                <HelpCircle className="w-12 h-12 mx-auto text-stone-300 mb-2" />
                Nenhuma patologia encontrada com o termo "{searchTerm}". Tente buscar por palavras como 'mofo', 'chuva' ou 'lixa'.
              </div>
            )}
          </section>
        )}

        {/* ÁREA DO PROFISSIONAL (ESPAÇO DO PINTOR, DICAS DE MESTRE & VITRINE DE PORTFÓLIO) */}
        {(activeTab === 'geral' || activeTab === 'profissional') && (
          <section id="profissional" className="bg-stone-900 rounded-3xl p-6 sm:p-10 border border-stone-700 shadow-xl space-y-10 scroll-mt-24 text-stone-100">
            
            {/* 1. Espaço do Pintor (Abertura) */}
            <div className="border-b border-stone-800 pb-8 relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Briefcase className="w-3.5 h-3.5" />
                Espaço do Pintor • Pinta Aqui Pro
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                De Profissional para Profissional: O Seu Trabalho Merece Reconhecimento e Valor Real
              </h2>
              <div className="mt-4 space-y-3 text-stone-300 text-sm sm:text-base leading-relaxed">
                <p>
                  Fala, parceiro de profissão! Aqui é o <strong>Vlademir Carer</strong>. Em quase 30 anos vivendo dentro de fábricas, atrás de balcões e no pé da obra, eu vi de perto a evolução da construção civil e aprendi uma verdade que ninguém tira de mim: <em className="text-amber-300">quem fecha a obra com chave de ouro e transforma tijolo e reboco no sonho de uma família é o pintor</em>.
                </p>
                <p>
                  Durante muito tempo, o nosso setor sofreu com a falta de valorização, brigas predatórias de preço e clientes que achavam que qualquer um com uma trincha faz pintura de verdade. O <strong>Pinta Aqui Pro</strong> nasceu para virar esse jogo: este é o seu espaço para aprimorar técnicas, blindar o seu negócio contra clientes descompromissados e colocar o seu nome em destaque em uma vitrine que valoriza quem tem capricho e pontualidade.
                </p>
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-stone-950/60 border-l-4 border-amber-500 text-stone-200 text-xs sm:text-sm">
                Aqui você não disputa leilão de centavos. Você mostra autoridade técnica, ganha o respeito do cliente e fecha serviços com a margem de lucro que o seu suor merece. Seja muito bem-vindo à nossa casa!
              </div>

              {/* Botão de Cadastro e Informação de Acesso */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-stone-950 to-stone-950 border border-amber-500/30">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <UserPlus className="w-4 h-4" />
                    Quer divulgar o seu trabalho na Vitrine Oficial?
                  </div>
                  <p className="text-xs text-stone-300">
                    Navegue livremente sem cadastro! O cadastro é obrigatório apenas para ter seu Cartão de Visitas na vitrine, postar fotos de obras e participar dos comentários da comunidade.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCadastroModalOpen(true);
                    setFormSucesso(false);
                    setFormErro('');
                  }}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  Cadastrar como Profissional
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between pt-2">
                <a 
                  href="/area-do-profissional.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Abrir versão standalone pura (area-do-profissional.html)
                </a>
              </div>
            </div>

            {/* 2. Dicas de Mestre (Conteúdo Avançado) */}
            <div className="space-y-6">
              <div>
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Conteúdo Avançado</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Dicas de Mestre: A Tríade da Valorização do Pintor
                </h3>
                <p className="text-stone-400 text-xs sm:text-sm mt-1">
                  Estratégias práticas de quem já viveu o chão da obra para fechar mais contratos e lucrar mais por metro quadrado.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Dica 1: Orçamento Profissional */}
                <div className="bg-stone-950/70 p-6 rounded-2xl border border-stone-800 flex flex-col justify-between hover:border-amber-500/50 transition">
                  <div className="space-y-3">
                    <span className="inline-block px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 text-[11px] font-bold font-mono">
                      Dica 01 • Orçamento & Credibilidade
                    </span>
                    <h4 className="text-base font-bold text-white leading-snug">
                      Nunca dê preço "de cabeça": O orçamento é a sua primeira demão
                    </h4>
                    <p className="text-stone-300 text-xs leading-relaxed">
                      Quando o cliente pergunta na calçada: <em>"Pintor, quanto você cobra pra pintar um cômodo?"</em> e você responde no susto, você assina atestado de amadorismo. Quem dá preço de boca abre margem para desconfiança ou toma prejuízo ao achar umidade escondida.
                    </p>
                    <p className="text-stone-300 text-xs leading-relaxed">
                      Apresente um <strong>orçamento detalhado por etapas</strong>: 1) Limpeza e descontaminação; 2) Fundo preparador; 3) Emassamento e cura; 4) Lixamento fino; 5) Duas a três demãos de acabamento. O cliente entende que está contratando engenharia decorativa, e não apenas rolo na parede.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-850 text-[11px] text-amber-400/90 italic">
                    "O cliente não chora desconto quando enxerga o tamanho da responsabilidade que você está assumindo."
                  </div>
                </div>

                {/* Dica 2: Relacionamento com o Cliente */}
                <div className="bg-stone-950/70 p-6 rounded-2xl border border-stone-800 flex flex-col justify-between hover:border-amber-500/50 transition">
                  <div className="space-y-3">
                    <span className="inline-block px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 text-[11px] font-bold font-mono">
                      Dica 02 • Relacionamento & Especificação
                    </span>
                    <h4 className="text-base font-bold text-white leading-snug">
                      Como vender material de qualidade sem parecer "gastão"
                    </h4>
                    <p className="text-stone-300 text-xs leading-relaxed">
                      Todo pintor já passou por isso: você pede uma tinta Premium e o cliente torce o nariz dizendo que achou uma Econômica pela metade do preço. Em vez de discutir, use a matemática a seu favor.
                    </p>
                    <p className="text-stone-300 text-xs leading-relaxed">
                      Explique a conta do <strong>Custo por Ano de Parede Feita</strong>: a econômica exige 4 demãos (dobro de mão de obra) e em 1 ano já desbota. A Premium cobre com 2 demãos, aguenta lavagens e dura 5 anos impecável. Mostre que o produto de ponta <strong>economiza o dinheiro dele</strong> no longo prazo.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-850 text-[11px] text-amber-400/90 italic">
                    "Quem defende material bom não é quem quer gastar o dinheiro do cliente; é quem se recusa a voltar daqui a 6 meses para consertar parede descascada."
                  </div>
                </div>

                {/* Dica 3: Produtividade e Mecanização */}
                <div className="bg-stone-950/70 p-6 rounded-2xl border border-stone-800 flex flex-col justify-between hover:border-amber-500/50 transition">
                  <div className="space-y-3">
                    <span className="inline-block px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 text-[11px] font-bold font-mono">
                      Dica 03 • Ferramentas & Mecanização
                    </span>
                    <h4 className="text-base font-bold text-white leading-snug">
                      Mecanização não é despesa, é máquina de multiplicar diárias
                    </h4>
                    <p className="text-stone-300 text-xs leading-relaxed">
                      O pintor que ainda lixa parede inteira na mão, respirando poeira e terminando o dia com o braço em frangalhos, perde duas coisas: <strong>saúde e dinheiro</strong>. A pintura moderna é mecânica e limpa.
                    </p>
                    <p className="text-stone-300 text-xs leading-relaxed">
                      Investir em uma <strong>lixadeira acoplada a aspirador de pó</strong> permite lixar um apartamento inteiro no mesmo dia, sem poeira nas coisas do cliente e com acabamento milimétrico. Na <strong>pintura Airless</strong>, a produtividade em grandes áreas triplica. O seu metro quadrado valoriza porque a entrega é cirúrgica.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-850 text-[11px] text-amber-400/90 italic">
                    "Ferramenta profissional não custa caro: caro é perder serviço para quem entrega a obra na metade do tempo sem deixar poeira no chão."
                  </div>
                </div>

              </div>
            </div>

            {/* 3. Estrutura do Portfólio (A "Vitrine" do Pintor) */}
            <div className="space-y-6 pt-4">
              <div>
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">A Vitrine Oficial</span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                  Cartão de Visitas Digital do Pintor
                </h3>
                <p className="text-stone-400 text-xs sm:text-sm mt-1">
                  É exatamente assim que os clientes leigos visualizam o seu perfil, tempo de estrada e galeria de fotos de obras no Pinta Aqui.
                </p>
              </div>

              {/* Card Interativo de Demonstração */}
              <div className="bg-stone-950 p-6 sm:p-8 rounded-2xl border border-stone-800 shadow-2xl space-y-8">
                
                {/* Cabeçalho do Perfil */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-800">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 text-2xl font-extrabold shadow-lg shrink-0">
                      CS
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xl font-bold text-white">Carlos Eduardo Silva</h4>
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" /> Profissional Qualificado
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400">
                        <span className="flex items-center gap-1 text-amber-400">
                          <Award className="w-3.5 h-3.5" /> 14 anos de experiência
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-stone-300">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" /> São Paulo - SP (Atende Capital e ABC)
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="px-2 py-0.5 rounded bg-stone-850 text-stone-300 text-[11px] border border-stone-750">Massa Corrida & Nivelamento</span>
                        <span className="px-2 py-0.5 rounded bg-stone-850 text-stone-300 text-[11px] border border-stone-750">Cimento Queimado & Texturas</span>
                        <span className="px-2 py-0.5 rounded bg-stone-850 text-stone-300 text-[11px] border border-stone-750">Pintura Airless</span>
                        <span className="px-2 py-0.5 rounded bg-stone-850 text-stone-300 text-[11px] border border-stone-750">Fachadas & Impermeabilização</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <a
                      href="https://wa.me/5511999999999?text=Ol%C3%A1%20Carlos!%20Vi%20o%20seu%20portf%C3%B3lio%20no%20Pinta%20Aqui%20e%20gostaria%20de%20um%20or%C3%A7amento."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/20"
                    >
                      <Phone className="w-4 h-4" />
                      Chamar no WhatsApp
                    </a>
                  </div>
                </div>

                {/* Grade de 6 Fotos do Portfólio */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span className="font-bold uppercase tracking-wider text-stone-300">Obras Realizadas (6 Trabalhos em Destaque)</span>
                    <span>Fotos reais de serviços executados</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Foto 1 */}
                    <div className="group relative rounded-xl overflow-hidden aspect-4/3 bg-stone-900 border border-stone-800">
                      <img 
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80" 
                        alt="Trabalho de pintura: Parede de cimento queimado em sala integrada"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent p-3">
                        <span className="text-xs font-semibold text-white block">Cimento Queimado Diamantado</span>
                        <span className="text-[10px] text-stone-400">Sala de estar integrada • 45m²</span>
                      </div>
                    </div>

                    {/* Foto 2 */}
                    <div className="group relative rounded-xl overflow-hidden aspect-4/3 bg-stone-900 border border-stone-800">
                      <img 
                        src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80" 
                        alt="Trabalho de pintura: Emassamento e pintura mecanizada Airless"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent p-3">
                        <span className="text-xs font-semibold text-white block">Pintura Mecanizada Airless</span>
                        <span className="text-[10px] text-stone-400">Teto e paredes em Drywall</span>
                      </div>
                    </div>

                    {/* Foto 3 */}
                    <div className="group relative rounded-xl overflow-hidden aspect-4/3 bg-stone-900 border border-stone-800">
                      <img 
                        src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80" 
                        alt="Trabalho de pintura: Fachada residencial protegida"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent p-3">
                        <span className="text-xs font-semibold text-white block">Impermeabilização de Fachada</span>
                        <span className="text-[10px] text-stone-400">Tinta emborrachada antimofo</span>
                      </div>
                    </div>

                    {/* Foto 4 */}
                    <div className="group relative rounded-xl overflow-hidden aspect-4/3 bg-stone-900 border border-stone-800">
                      <img 
                        src="https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=600&q=80" 
                        alt="Trabalho de pintura: Portas laqueadas com esmalte base água"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent p-3">
                        <span className="text-xs font-semibold text-white block">Laqueamento de Portas</span>
                        <span className="text-[10px] text-stone-400">Esmalte acetinado base água</span>
                      </div>
                    </div>

                    {/* Foto 5 */}
                    <div className="group relative rounded-xl overflow-hidden aspect-4/3 bg-stone-900 border border-stone-800">
                      <img 
                        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80" 
                        alt="Trabalho de pintura: Efeito Marmorato e Boiserie"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent p-3">
                        <span className="text-xs font-semibold text-white block">Marmorato & Boiserie Clássico</span>
                        <span className="text-[10px] text-stone-400">Parede de destaque para suite</span>
                      </div>
                    </div>

                    {/* Foto 6 */}
                    <div className="group relative rounded-xl overflow-hidden aspect-4/3 bg-stone-900 border border-stone-800">
                      <img 
                        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80" 
                        alt="Trabalho de pintura: Nivelamento com lixamento aspirado"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent p-3">
                        <span className="text-xs font-semibold text-white block">Lixamento Aspirado Sem Poeira</span>
                        <span className="text-[10px] text-stone-400">Preparação sob luz rasante</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Rodapé do Perfil */}
                <div className="pt-4 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-400">
                  <div className="flex items-center gap-1.5 text-stone-300">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>Avaliação dos clientes: <strong>4.9 de 5.0</strong> (42 avaliações reais)</span>
                  </div>
                  <div>
                    <span>Perfil verificado e auditado pela equipe <strong>Pinta Aqui</strong></span>
                  </div>
                </div>

              </div>
            </div>

          </section>
        )}

      </main>

      {/* Footer Assinado por Vlademir Carer */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-4 sm:px-6 border-t border-stone-800 mt-16 text-xs sm:text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-white tracking-tight">Pinta Aqui</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">
                Por Vlademir Carer
              </span>
            </div>
            <p className="text-stone-400 mt-1 text-xs max-w-md">
              A autoridade de quase 30 anos no ramo de tintas imobiliárias compartilhada gratuitamente com quem quer valorizar e cuidar do próprio lar.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-center md:text-right">
            <div>
              <p className="text-stone-300 font-medium">www.pintaaqui.com.br</p>
              <p className="text-stone-400 text-xs mt-0.5">Todos os direitos reservados • Feito com paixão pela boa pintura.</p>
            </div>
            <button
              onClick={() => setAdminModalOpen(true)}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-amber-400 border border-stone-700 transition"
              title="Acesso Administrativo"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* MODAL DO PAINEL ADMINISTRATIVO (SUPABASE & CONFIGURAÇÕES) */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-stone-900 border border-stone-700 text-stone-100 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            
            {/* Header do Modal */}
            <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/80 sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Painel Administrativo</h3>
                  <p className="text-[11px] text-stone-400">Pinta Aqui • Gestão do Banco de Dados & Sistema</p>
                </div>
              </div>
              <button 
                onClick={() => setAdminModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo do Modal: Login ou Painel */}
            {!isAdminLoggedIn ? (
              <form onSubmit={handleAdminLogin} className="p-6 sm:p-8 space-y-5">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-2">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Autenticação de Segurança</h4>
                  <p className="text-xs text-stone-400">
                    Insira as credenciais administrativas para gerenciar o Supabase e as configurações do site.
                  </p>
                </div>

                {authError && (
                  <div className="bg-red-950/80 border border-red-500/50 text-red-200 text-xs p-3 rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">
                      Usuário Administrador
                    </label>
                    <input 
                      type="text" 
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      placeholder="admim"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1.5">
                      Senha de Acesso
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-200"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <Key className="w-4 h-4" /> Acessar Painel
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 space-y-6">
                
                {/* Abas Internas do Admin */}
                <div className="flex items-center gap-2 border-b border-stone-800 pb-3 overflow-x-auto">
                  <button
                    onClick={() => setAdminTab('pintores')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                      adminTab === 'pintores'
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'text-stone-400 hover:text-white hover:bg-stone-800'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Dashboard de Pintores</span>
                    {pintoresNuvem.filter(p => p.status === 'pendente').length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-950 text-[10px] font-extrabold ml-1 animate-pulse">
                        {pintoresNuvem.filter(p => p.status === 'pendente').length} novo
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setAdminTab('supabase')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                      adminTab === 'supabase'
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'text-stone-400 hover:text-white hover:bg-stone-800'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    Supabase (Nuvem)
                  </button>
                  <button
                    onClick={() => setAdminTab('schema')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                      adminTab === 'schema'
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'text-stone-400 hover:text-white hover:bg-stone-800'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    Esquema SQL
                  </button>
                  <button
                    onClick={() => setAdminTab('geral')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                      adminTab === 'geral'
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'text-stone-400 hover:text-white hover:bg-stone-800'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Configurações Gerais
                  </button>
                </div>

                {/* Aba 0: Dashboard de Gestão de Pintores */}
                {adminTab === 'pintores' && (
                  <div className="space-y-5">
                    {/* Alerta de Feedback */}
                    {adminFeedback && (
                      <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border transition ${
                        adminFeedback.type === 'success'
                          ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                          : 'bg-red-950/80 border-red-500/50 text-red-200'
                      }`}>
                        {adminFeedback.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <span>{adminFeedback.message}</span>
                      </div>
                    )}

                    {/* Cards de Métricas em Nuvem */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Total na Nuvem</span>
                        <span className="text-xl font-extrabold text-white">{pintoresNuvem.length}</span>
                      </div>
                      <div className="bg-amber-950/30 p-3.5 rounded-xl border border-amber-600/40">
                        <span className="text-[10px] text-amber-300 uppercase tracking-wider block font-semibold">Pendentes</span>
                        <span className="text-xl font-extrabold text-amber-400">
                          {pintoresNuvem.filter(p => p.status === 'pendente').length}
                        </span>
                      </div>
                      <div className="bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-600/40">
                        <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-semibold">Aprovados</span>
                        <span className="text-xl font-extrabold text-emerald-400">
                          {pintoresNuvem.filter(p => p.status === 'aprovado').length}
                        </span>
                      </div>
                      <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800">
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Rejeitados</span>
                        <span className="text-xl font-extrabold text-stone-400">
                          {pintoresNuvem.filter(p => p.status === 'rejeitado').length}
                        </span>
                      </div>
                    </div>

                    {/* Barra de Filtros e Atualização */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-1.5 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
                        {(['todos', 'pendente', 'aprovado', 'rejeitado'] as const).map((filtro) => (
                          <button
                            key={filtro}
                            onClick={() => setStatusFiltroPintores(filtro)}
                            className={`px-3 py-1 rounded-lg capitalize transition ${
                              statusFiltroPintores === filtro
                                ? 'bg-amber-500 text-stone-950 font-bold'
                                : 'text-stone-400 hover:text-white'
                            }`}
                          >
                            {filtro === 'todos' ? 'Todos' : filtro === 'pendente' ? 'Pendentes' : filtro === 'aprovado' ? 'Aprovados' : 'Rejeitados'}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={carregarPintores}
                        disabled={loadingPintores}
                        className="py-1.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition border border-stone-700"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingPintores ? 'animate-spin text-amber-400' : 'text-stone-400'}`} />
                        <span>{loadingPintores ? 'Carregando...' : 'Atualizar Lista'}</span>
                      </button>
                    </div>

                    {/* Lista de Registros dos Pintores */}
                    <div className="space-y-3">
                      {pintoresNuvem
                        .filter(p => statusFiltroPintores === 'todos' ? true : p.status === statusFiltroPintores)
                        .map((pintor) => (
                          <div 
                            key={pintor.id || pintor.whatsapp}
                            className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-3 hover:border-stone-700 transition"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-850">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-sm shrink-0">
                                  {pintor.nome.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-bold text-white text-sm">{pintor.nome}</h5>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-mono border border-stone-700">
                                      {pintor.tipo_pessoa === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'} • {pintor.documento || 'Sem doc'}
                                    </span>
                                  </div>
                                  <div className="text-xs text-stone-400 flex flex-wrap items-center gap-2 mt-0.5">
                                    <span>📍 {pintor.cidade} - {pintor.estado}</span>
                                    <span>•</span>
                                    <span>★ {pintor.experiencia_anos} anos de experiência</span>
                                    <span>•</span>
                                    <a 
                                      href={`https://wa.me/55${pintor.whatsapp.replace(/\D/g, '')}`} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                                    >
                                      <Phone className="w-3 h-3" /> {pintor.whatsapp}
                                    </a>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                                  pintor.status === 'aprovado' 
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                                    : pintor.status === 'rejeitado'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                                }`}>
                                  {pintor.status === 'aprovado' ? '✓ Aprovado na Vitrine' : pintor.status === 'rejeitado' ? '✕ Rejeitado' : '⏳ Aguardando Aprovação'}
                                </span>
                              </div>
                            </div>

                            {/* Especialidades */}
                            <div className="flex flex-wrap gap-1.5">
                              {pintor.especialidades?.map((esp, i) => (
                                <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">
                                  {esp}
                                </span>
                              ))}
                            </div>

                            {/* Ações Administrativas: Aprovar, Visualizar Cartão, Rejeitar, Excluir */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-900">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setPintorParaVisualizar(pintor)}
                                  className="py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs flex items-center gap-1.5 transition border border-stone-700 font-medium"
                                >
                                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                                  Visualizar Cartão de Visitas
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                {pintor.status !== 'aprovado' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleAprovarPintor(pintor.id)}
                                    className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Aprovar Cadastro
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleRejeitarPintor(pintor.id)}
                                    className="py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs flex items-center gap-1.5 transition border border-stone-700"
                                  >
                                    <XCircle className="w-3.5 h-3.5 text-amber-400" />
                                    Pausar / Inativar
                                  </button>
                                )}

                                {pintor.status === 'pendente' && (
                                  <button
                                    type="button"
                                    onClick={() => handleRejeitarPintor(pintor.id)}
                                    className="py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-red-300 text-xs flex items-center gap-1.5 transition border border-stone-700"
                                  >
                                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                                    Rejeitar
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleExcluirPintor(pintor.id)}
                                  title="Excluir da Nuvem"
                                  className="p-1.5 rounded-lg bg-stone-900 hover:bg-red-950/60 text-stone-400 hover:text-red-400 border border-stone-800 transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}

                      {pintoresNuvem.filter(p => statusFiltroPintores === 'todos' ? true : p.status === statusFiltroPintores).length === 0 && !loadingPintores && (
                        <div className="text-center py-10 bg-stone-950 rounded-xl border border-stone-800 space-y-2">
                          <Users className="w-10 h-10 mx-auto text-stone-600" />
                          <p className="text-sm font-semibold text-stone-300">
                            Nenhum pintor encontrado {statusFiltroPintores !== 'todos' ? `com status '${statusFiltroPintores}'` : 'no banco de dados em nuvem'}.
                          </p>
                          <p className="text-xs text-stone-500 max-w-sm mx-auto">
                            Os novos cadastros feitos na página inicial aparecerão aqui automaticamente para a sua aprovação.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setCadastroModalOpen(true);
                              setFormSucesso(false);
                            }}
                            className="mt-2 py-1.5 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition inline-flex items-center gap-1.5"
                          >
                            <UserPlus className="w-3.5 h-3.5" /> Fazer Teste de Cadastro
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Aba 1: Supabase Configuration */}
                {adminTab === 'supabase' && (
                  <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
                    {/* Alerta de Diretriz Absoluta: 100% em Nuvem */}
                    <div className="bg-amber-950/40 border border-amber-600/40 p-4 rounded-xl text-xs text-amber-200 space-y-1.5">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                        <Cloud className="w-4 h-4 text-amber-400" />
                        Diretriz Arquitetural: 100% em Nuvem (Sem Gravação Local)
                      </div>
                      <p className="leading-relaxed text-stone-300">
                        O <strong>Pinta Aqui</strong> opera sob política estrita de persistência exclusivamente em nuvem. 
                        Nenhum dado de pintores, contatos ou solicitações de orçamento é gravado localmente ou em memória transitória; 
                        todas as transações vão direto para as tabelas do PostgreSQL gerenciado pelo Supabase.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">
                        Project URL do Supabase (Cloud)
                      </label>
                      <input 
                        type="url"
                        value={supabaseUrl}
                        onChange={(e) => {
                          setSupabaseUrl(e.target.value);
                          setTestResult(null);
                        }}
                        placeholder="https://xyzabcdefg.supabase.co"
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-hidden font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-300 mb-1">
                        Supabase Anon Key (Chave Pública / Client-Side)
                      </label>
                      <input 
                        type="password"
                        value={supabaseAnonKey}
                        onChange={(e) => {
                          setSupabaseAnonKey(e.target.value);
                          setTestResult(null);
                        }}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-hidden font-mono"
                        required
                      />
                    </div>

                    {/* Botão de Teste de Conexão em Nuvem */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={isTestingConnection || !supabaseUrl || !supabaseAnonKey}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-amber-600/20"
                      >
                        {isTestingConnection ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                            <span>Consultando servidores Supabase na nuvem...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 text-stone-950" />
                            <span>Testar Conexão do Banco de Dados (Nuvem)</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Resultado do Teste de Conexão */}
                    {testResult && (
                      <div className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                        testResult.success 
                          ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200' 
                          : 'bg-red-950/80 border-red-500/60 text-red-200'
                      }`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 font-bold">
                            {testResult.success ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                            )}
                            <span className="text-sm">{testResult.message}</span>
                          </div>
                          {testResult.latencyMs !== undefined && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-900/60 font-mono text-stone-300">
                              Latência: {testResult.latencyMs}ms
                            </span>
                          )}
                        </div>

                        {testResult.details && (
                          <p className="text-xs text-stone-300 pl-6 leading-relaxed">
                            {testResult.details}
                          </p>
                        )}
                      </div>
                    )}

                    {saveSuccess && (
                      <div className="bg-emerald-950 border border-emerald-500/50 text-emerald-200 text-xs p-3 rounded-xl flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Configurações do Supabase salvas para a aplicação em nuvem!</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                      <button
                        type="submit"
                        className="py-2 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-semibold text-xs flex items-center gap-1.5 transition border border-stone-700"
                      >
                        <Save className="w-4 h-4 text-amber-400" /> Salvar Credenciais
                      </button>

                      <button
                        type="button"
                        onClick={handleAdminLogout}
                        className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1.5 transition border border-stone-700"
                      >
                        <LogOut className="w-4 h-4 text-red-400" /> Encerrar Sessão
                      </button>
                    </div>
                  </form>
                )}

                {/* Aba 2: Esquema SQL */}
                {adminTab === 'schema' && (
                  <div className="space-y-3">
                    <p className="text-xs text-stone-300 leading-relaxed">
                      Aqui está o código SQL estruturado para criar as tabelas do <strong>Pinta Aqui</strong> no editor SQL do seu Supabase (Pintores Profissionais, Contatos/Orçamentos e Avaliações):
                    </p>
                    <div className="relative">
                      <pre className="bg-stone-950 border border-stone-800 p-3.5 rounded-xl text-[11px] font-mono text-amber-200 overflow-x-auto max-h-64 leading-relaxed">
{`-- 1. TABELA DE PINTORES PROFISSIONAIS (PINTA AQUI PRO)
CREATE TABLE IF NOT EXISTS public.pintores_profissionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_pessoa TEXT NOT NULL DEFAULT 'PF', -- 'PF' (Pessoa Física) ou 'PJ' (Pessoa Jurídica)
  documento TEXT, -- CPF ou CNPJ
  nome TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'SP',
  experiencia_anos INT DEFAULT 5,
  especialidades TEXT[] DEFAULT ARRAY['Residencial', 'Texturas'],
  senha TEXT, -- Senha alfanumérica de 6 dígitos para comunidade
  status TEXT DEFAULT 'pendente', -- 'pendente', 'aprovado', 'rejeitado'
  fotos TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CASO A TABELA JÁ TENHA SIDO CRIADA ANTES, ATUALIZAR COLUNAS:
ALTER TABLE public.pintores_profissionais ADD COLUMN IF NOT EXISTS tipo_pessoa TEXT DEFAULT 'PF';
ALTER TABLE public.pintores_profissionais ADD COLUMN IF NOT EXISTS documento TEXT;
ALTER TABLE public.pintores_profissionais ADD COLUMN IF NOT EXISTS senha TEXT;
ALTER TABLE public.pintores_profissionais ADD COLUMN IF NOT EXISTS fotos TEXT[] DEFAULT ARRAY[]::TEXT[];

-- 2. TABELA DE SOLICITAÇÃO DE ORÇAMENTOS (CLIENTES LEIGOS)
CREATE TABLE IF NOT EXISTS public.solicitacoes_orcamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_cliente TEXT NOT NULL,
  telefone_cliente TEXT NOT NULL,
  cidade TEXT NOT NULL,
  tipo_servico TEXT NOT NULL,
  descricao_projeto TEXT,
  pintor_id UUID REFERENCES public.pintores_profissionais(id),
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- HABILITAR RLS (Row Level Security)
ALTER TABLE public.pintores_profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes_orcamento ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE ACESSO (PERMITIR OPERAÇÕES SEGURAS EM NUVEM)
CREATE POLICY "Permitir leitura de pintores" ON public.pintores_profissionais FOR SELECT USING (true);
CREATE POLICY "Permitir cadastro público de novos pintores" ON public.pintores_profissionais FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir atualização de status de pintores" ON public.pintores_profissionais FOR UPDATE USING (true);
CREATE POLICY "Permitir exclusão de pintores" ON public.pintores_profissionais FOR DELETE USING (true);
CREATE POLICY "Clientes podem solicitar orçamentos" ON public.solicitacoes_orcamento FOR INSERT WITH CHECK (true);`}
                      </pre>
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Basta copiar o código acima e colar na aba <strong>SQL Editor</strong> dentro do painel do seu Supabase.
                    </p>
                  </div>
                )}

                {/* Aba 3: Configurações Gerais */}
                {adminTab === 'geral' && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">E-mail de Contato Principal</label>
                      <input 
                        type="email" 
                        defaultValue="contato@pintaaqui.com.br"
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-300 font-medium mb-1">WhatsApp de Suporte do Pinta Aqui</label>
                      <input 
                        type="text" 
                        defaultValue="(11) 99999-9999"
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 font-mono"
                      />
                    </div>
                    <div className="pt-2 flex justify-between items-center">
                      <button 
                        onClick={() => alert('Ajustes gerais gravados!')}
                        className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold transition"
                      >
                        Gravar Dados de Contato
                      </button>
                      <button
                        onClick={handleAdminLogout}
                        className="py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center gap-1.5 transition"
                      >
                        <LogOut className="w-4 h-4 text-red-400" /> Sair
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL DE VISUALIZAÇÃO DO CARTÃO DE VISITAS DIGITAL DO PINTOR (ADMIN OU VITRINE) */}
      {pintorParaVisualizar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-stone-900 border border-stone-700 text-stone-100 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-lg text-white">Cartão de Visitas Digital do Pintor</h4>
              </div>
              <button
                type="button"
                onClick={() => setPintorParaVisualizar(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cartão Oficial Renderizado */}
            <article className="bg-stone-950 border border-stone-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-stone-850">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 text-xl font-extrabold shadow-lg shrink-0">
                    {pintorParaVisualizar.nome.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xl font-bold text-white">{pintorParaVisualizar.nome}</h4>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-1 ${
                        pintorParaVisualizar.status === 'aprovado' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {pintorParaVisualizar.status === 'aprovado' ? '✓ Profissional Qualificado' : '⏳ Aguardando Aprovação'}
                      </span>
                    </div>
                    <div className="text-xs text-stone-400 flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-amber-400 font-medium">★ {pintorParaVisualizar.experiencia_anos} anos de experiência</span>
                      <span>•</span>
                      <span>📍 {pintorParaVisualizar.cidade} - {pintorParaVisualizar.estado}</span>
                      <span>•</span>
                      <span className="text-stone-300 font-mono text-[11px]">
                        {pintorParaVisualizar.tipo_pessoa === 'PJ' ? 'CNPJ' : 'CPF'}: {pintorParaVisualizar.documento}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {pintorParaVisualizar.especialidades?.map((esp, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-stone-900 border border-stone-800 text-stone-300">
                          {esp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <a
                    href={`https://wa.me/55${pintorParaVisualizar.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(pintorParaVisualizar.nome)}!%20Vi%20seu%20perfil%20no%20Pinta%20Aqui%20e%20gostaria%20de%20um%20or%C3%A7amento.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20"
                  >
                    <Phone className="w-3.5 h-3.5" /> Chamar no WhatsApp
                  </a>
                </div>
              </div>

              {/* Grade de 6 Fotos do Portfólio */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-300 block">
                  Galeria de Obras Recentes (6 Fotos Cadastradas)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { tit: 'Efeito Decorativo / Cimento', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
                    { tit: 'Emassamento & Nivelamento', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80' },
                    { tit: 'Impermeabilização & Fachada', url: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80' },
                    { tit: 'Esmaltação de Portas', url: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=600&q=80' },
                    { tit: 'Marmorato & Boiserie', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80' },
                    { tit: 'Pintura Mecanizada Airless', url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80' },
                  ].map((foto, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden aspect-4/3 bg-stone-900 border border-stone-800">
                      <img src={foto.url} alt={foto.tit} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-stone-950/80 p-2 text-[10px] text-white">
                        {foto.tit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* Ações do Modal de Visualização */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setPintorParaVisualizar(null)}
                className="py-2 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition"
              >
                Fechar Visualização
              </button>

              {isAdminLoggedIn && pintorParaVisualizar.status !== 'aprovado' && (
                <button
                  type="button"
                  onClick={() => {
                    handleAprovarPintor(pintorParaVisualizar.id);
                    setPintorParaVisualizar(null);
                  }}
                  className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <CheckCircle2 className="w-4 h-4" /> Aprovar e Publicar na Vitrine
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRO DO PINTOR PROFISSIONAL (PÚBLICO) */}
      {cadastroModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-stone-900 border border-stone-700 text-stone-100 rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Header do Cadastro */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">Cadastro de Pintor Profissional</h3>
                  <p className="text-xs text-stone-400">Pinta Aqui Pro • Vitrine Oficial de Especialistas</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCadastroModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aviso Arquitetural e Regras de Acesso */}
            <div className="bg-amber-950/40 border border-amber-600/40 p-4 rounded-2xl text-xs text-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Info className="w-4 h-4 shrink-0" />
                Acesso Livre na Área do Profissional
              </div>
              <p className="leading-relaxed text-stone-300">
                Você <strong>não precisa de cadastro para navegar</strong> e ler as Dicas de Mestre. 
                O cadastro e a senha servem exclusivamente para:
              </p>
              <ul className="list-disc list-inside space-y-1 text-stone-300 pl-1 text-[11px]">
                <li>Ter seu <strong>Cartão de Visitas Digital publicado na Vitrine</strong> para clientes da sua cidade te chamarem no WhatsApp.</li>
                <li>Enviar fotos reais de obras e comentar em nossa comunidade de profissionais.</li>
                <li><strong>Aprovação necessária:</strong> Todo cadastro é analisado e aprovado pela curadoria de Vlademir Carer antes de ir para a vitrine.</li>
              </ul>
            </div>

            {/* Mensagem de Sucesso */}
            {formSucesso ? (
              <div className="p-8 text-center space-y-4 bg-stone-950 rounded-2xl border border-emerald-500/50">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-white">Cadastro Enviado com Sucesso!</h4>
                  <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                    Parabéns, parceiro! Seus dados foram gravados diretamente na nuvem no Supabase. O <strong>Vlademir Carer</strong> irá analisar suas especialidades e ativar o seu Cartão de Visitas na vitrine em breve.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCadastroModalOpen(false)}
                  className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition"
                >
                  Fechar Janela
                </button>
              </div>
            ) : (
              <form onSubmit={handleCadastroPintor} className="space-y-5 text-xs">
                
                {formErro && (
                  <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{formErro}</span>
                  </div>
                )}

                {/* Seleção Pessoa Física ou Pessoa Jurídica */}
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-2">
                    Tipo de Cadastro Profissional
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormTipoPessoa('PF')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                        formTipoPessoa === 'PF'
                          ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md shadow-amber-500/20'
                          : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Pessoa Física (CPF)
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormTipoPessoa('PJ')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition ${
                        formTipoPessoa === 'PJ'
                          ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md shadow-amber-500/20'
                          : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      Pessoa Jurídica (CNPJ / MEI)
                    </button>
                  </div>
                </div>

                {/* Nome e Documento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">
                      {formTipoPessoa === 'PF' ? 'Nome Completo do Pintor *' : 'Razão Social / Nome Fantasia *'}
                    </label>
                    <input
                      type="text"
                      value={formNome}
                      onChange={(e) => setFormNome(e.target.value)}
                      placeholder={formTipoPessoa === 'PF' ? 'Ex: Carlos Eduardo Silva' : 'Ex: Pinturas Silva ME'}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white focus:border-amber-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">
                      {formTipoPessoa === 'PF' ? 'CPF do Profissional *' : 'CNPJ da Empresa *'}
                    </label>
                    <input
                      type="text"
                      value={formDocumento}
                      onChange={(e) => setFormDocumento(e.target.value)}
                      placeholder={formTipoPessoa === 'PF' ? '000.000.000-00' : '00.000.000/0001-00'}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-amber-500 focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                {/* WhatsApp e Localização */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">WhatsApp de Orçamentos *</label>
                    <input
                      type="text"
                      value={formWhatsapp}
                      onChange={(e) => setFormWhatsapp(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-amber-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Cidade Principal *</label>
                    <input
                      type="text"
                      value={formCidade}
                      onChange={(e) => setFormCidade(e.target.value)}
                      placeholder="Ex: São Paulo"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white focus:border-amber-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Estado (UF) *</label>
                    <select
                      value={formEstado}
                      onChange={(e) => setFormEstado(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white focus:border-amber-500 focus:outline-hidden"
                    >
                      {['SP', 'RJ', 'MG', 'PR', 'SC', 'RS', 'ES', 'GO', 'DF', 'BA', 'PE', 'CE'].map((uf) => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tempo de Experiência */}
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    Tempo de Estrada / Experiência: <strong className="text-amber-400">{formExperiencia} anos</strong>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={formExperiencia}
                    onChange={(e) => setFormExperiencia(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-stone-500">
                    <span>Iniciante (1 ano)</span>
                    <span>Experiente (15 anos)</span>
                    <span>Mestre de Obra (40 anos)</span>
                  </div>
                </div>

                {/* Especialidades */}
                <div>
                  <label className="block text-stone-300 font-medium mb-1.5">
                    Suas Especialidades Técnicas (Selecione as que você domina):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Massa Corrida & Nivelamento',
                      'Cimento Queimado & Texturas',
                      'Pintura Mecanizada Airless',
                      'Pintura Predial & Fachadas',
                      'Impermeabilização de Paredes',
                      'Esmaltação de Portas & Madeiras',
                      'Efeito Marmorato & Boiserie',
                      'Pintura Epóxi para Pisos',
                      'Pintura Residencial Fina'
                    ].map((esp) => {
                      const selecionado = formEspecialidades.includes(esp);
                      return (
                        <button
                          key={esp}
                          type="button"
                          onClick={() => {
                            if (selecionado) {
                              setFormEspecialidades(formEspecialidades.filter(e => e !== esp));
                            } else {
                              setFormEspecialidades([...formEspecialidades, esp]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs transition border ${
                            selecionado
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-semibold'
                              : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-white'
                          }`}
                        >
                          {selecionado ? '✓ ' : '+ '} {esp}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Senha e Confirmação de Senha (6 Dígitos com Letras e Números) */}
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <div className="flex items-center gap-2 text-stone-200 font-semibold">
                    <Lock className="w-4 h-4 text-amber-400" />
                    Senha de Acesso à Comunidade (6 dígitos com números e letras)
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Esta senha será usada futuramente para você atualizar seu portfólio, postar fotos de obras e participar dos comentários.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <label className="block text-stone-300 text-[11px] mb-1">Cadastrar Senha *</label>
                      <input
                        type="password"
                        value={formSenha}
                        onChange={(e) => setFormSenha(e.target.value)}
                        placeholder="Ex: pint88"
                        maxLength={12}
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-hidden"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 text-[11px] mb-1">Confirmar Senha *</label>
                      <input
                        type="password"
                        value={formConfirmaSenha}
                        onChange={(e) => setFormConfirmaSenha(e.target.value)}
                        placeholder="Repita a senha"
                        maxLength={12}
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  {formSenha && (
                    <div className="text-[11px] space-y-1 pt-1">
                      <span className={`block font-medium ${formSenha.length >= 6 ? 'text-emerald-400' : 'text-stone-500'}`}>
                        {formSenha.length >= 6 ? '✓' : '•'} Mínimo de 6 caracteres ({formSenha.length}/6)
                      </span>
                      <span className={`block font-medium ${/[a-zA-Z]/.test(formSenha) && /[0-9]/.test(formSenha) ? 'text-emerald-400' : 'text-stone-500'}`}>
                        {/[a-zA-Z]/.test(formSenha) && /[0-9]/.test(formSenha) ? '✓' : '•'} Contém letras e números
                      </span>
                      {formConfirmaSenha && (
                        <span className={`block font-medium ${formSenha === formConfirmaSenha ? 'text-emerald-400' : 'text-red-400'}`}>
                          {formSenha === formConfirmaSenha ? '✓ Senhas coincidem' : '✕ Senhas não coincidem'}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Botões do Formulário */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-[11px] text-stone-400">
                    Ao enviar, seus dados são salvos em nuvem para aprovação do Vlademir.
                  </span>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5"
                  >
                    {formSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Gravando na Nuvem...
                      </>
                    ) : (
                      <>
                        <CheckCheck className="w-4 h-4" /> Enviar Cadastro para Aprovação
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
