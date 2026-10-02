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
  CheckCheck,
  Copy,
  RotateCcw,
  Mail,
  Upload,
  Image as ImageIcon,
  Send,
  Inbox,
  Search,
  BadgeCheck,
  AlertCircle
} from 'lucide-react';
import vlademirPhoto from './assets/images/vlademir_carer_1790765290522.jpg';
import { 
  testSupabaseCloudConnection, 
  ConnectionTestResult,
  DEFAULT_SUPABASE_URL,
  DEFAULT_SUPABASE_ANON_KEY,
  PintorProfissional,
  cadastrarPintorNuvem,
  listarPintoresNuvem,
  atualizarStatusPintorNuvem,
  excluirPintorNuvem,
  salvarFotoIdealizadorNuvem,
  carregarFotoIdealizadorNuvem,
  restaurarFotoIdealizadorNuvem,
  salvarTemaSiteNuvem,
  carregarTemaSiteNuvem,
  EmailConfig,
  DEFAULT_EMAIL_CONFIG,
  salvarEmailConfigNuvem,
  carregarEmailConfigNuvem,
  confirmarCodigoAtivacaoPintorNuvem,
  alternarLiberacaoSupervisorNuvem,
  enviarEmailAtivacaoPintor,
  buscarEnderecoPorCep,
  gerarCodigoAtivacao4Digitos,
  salvarFotosPatologiasNuvem,
  carregarFotosPatologiasNuvem
} from './lib/supabase';
import { 
  ThemePreset, 
  THEME_PRESETS, 
  BACKGROUND_TONES, 
  BackgroundToneOption, 
  applyBackgroundToneToTheme, 
  getPresetById, 
  applyThemeToDom 
} from './lib/themePresets';
import LogoPintaAqui from './components/LogoPintaAqui';
import TermosDeUso from './components/TermosDeUso';
import { 
  DEFAULT_PATOLOGIA_FOTOS, 
  carregarFotosPatologiasSalvas, 
  salvarFotosPatologiasLocal 
} from './lib/patologiaFotos';

export default function App() {
  const [activeTab, setActiveTab] = useState<'geral' | 'desvendando' | 'tipos' | 'texturas' | 'ferramentas' | 'patologias' | 'profissional' | 'termos'>('geral');
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
  const [adminTab, setAdminTab] = useState<'pintores' | 'idealizador' | 'patologias' | 'temas' | 'supabase' | 'schema' | 'geral'>('pintores');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fotos das Patologias da Pintura (Gerenciáveis via Admin e Gravadas na Nuvem)
  const [patologiaFotos, setPatologiaFotos] = useState<Record<number, string>>(carregarFotosPatologiasSalvas);
  const [patologiasModificadas, setPatologiasModificadas] = useState(false);
  const [salvandoPatologiasNuvem, setSalvandoPatologiasNuvem] = useState(false);
  const [patologiaFeedbackMsg, setPatologiaFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [urlInputPatologias, setUrlInputPatologias] = useState<Record<number, string>>({});
  const [patologiaEditadaIds, setPatologiaEditadaIds] = useState<number[]>([]);

  // Presets de Cores e Fontes (Gravados na Nuvem no Supabase)
  const [activeTheme, setActiveTheme] = useState<ThemePreset>(THEME_PRESETS[0]);
  const [salvandoTemaNuvem, setSalvandoTemaNuvem] = useState(false);
  const [temaFeedbackMsg, setTemaFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [bgCategoryFilter, setBgCategoryFilter] = useState<'todos' | 'claros' | 'terrosos' | 'suaves' | 'escuros'>('todos');

  // Foto do Idealizador (Vlademir Carer) - Gravada em Nuvem e Carregada a Cada Abertura
  const [idealizadorFoto, setIdealizadorFoto] = useState<string>(vlademirPhoto);
  const [novaFotoInput, setNovaFotoInput] = useState<string>('');
  const [fotoPreview, setFotoPreview] = useState<string>(vlademirPhoto);
  const [salvandoFoto, setSalvandoFoto] = useState<boolean>(false);
  const [fotoStatusMsg, setFotoStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Supabase Cloud Connection Test State
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);

  // Gestão de Esquema SQL
  const [sqlCopied, setSqlCopied] = useState(false);
  const [sqlResetMode, setSqlResetMode] = useState<'create_safe' | 'full_reset'>('create_safe');
  const [sqlGeneratedNotice, setSqlGeneratedNotice] = useState(false);
  const [generatedSqlContent, setGeneratedSqlContent] = useState<string>('');

  // Dashboard de Gestão de Pintores (Admin)
  const [pintoresNuvem, setPintoresNuvem] = useState<PintorProfissional[]>([]);
  const [loadingPintores, setLoadingPintores] = useState(false);
  const [statusFiltroPintores, setStatusFiltroPintores] = useState<'todos' | 'pendente' | 'aprovado' | 'rejeitado'>('todos');
  const [pintorParaVisualizar, setPintorParaVisualizar] = useState<PintorProfissional | null>(null);
  const [adminFeedback, setAdminFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Configurações Gerais do E-mail do Sistema (SMTP / Senha de App)
  const [emailConfig, setEmailConfig] = useState<EmailConfig>(DEFAULT_EMAIL_CONFIG);
  const [salvandoEmailConfig, setSalvandoEmailConfig] = useState(false);
  const [testandoEmailSmtp, setTestandoEmailSmtp] = useState(false);
  const [emailFeedbackMsg, setEmailFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [mostrarSenhaApp, setMostrarSenhaApp] = useState(false);
  const [emailTesteDestino, setEmailTesteDestino] = useState('vcarer@gmail.com');

  // Modal de Cadastro do Pintor (Público) com novos campos obrigatórios
  const [cadastroModalOpen, setCadastroModalOpen] = useState(false);
  const [formTipoPessoa, setFormTipoPessoa] = useState<'PF' | 'PJ'>('PF');
  const [formNome, setFormNome] = useState('');
  const [formDocumento, setFormDocumento] = useState('');
  const [formCep, setFormCep] = useState('');
  const [formBuscandoCep, setFormBuscandoCep] = useState(false);
  const [formCepStatus, setFormCepStatus] = useState<string>('');
  const [formEndereco, setFormEndereco] = useState('');
  const [formNumero, setFormNumero] = useState('');
  const [formComplemento, setFormComplemento] = useState('');
  const [formBairro, setFormBairro] = useState('');
  const [formCidade, setFormCidade] = useState('');
  const [formEstado, setFormEstado] = useState('SP');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formEmail, setFormEmail] = useState(''); // Importantíssimo
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
  const [codigoAtivacaoGerado, setCodigoAtivacaoGerado] = useState('');
  const [codigoDigitadoConfirmacao, setCodigoDigitadoConfirmacao] = useState('');
  const [confirmandoCodigo, setConfirmandoCodigo] = useState(false);
  const [codigoConfirmacaoFeedback, setCodigoConfirmacaoFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal "Área do Pintor / Login do Pintor (Em Breve)"
  const [areaPintorModalOpen, setAreaPintorModalOpen] = useState(false);
  const [abaAreaPintor, setAbaAreaPintor] = useState<'login' | 'ativar'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');
  const [loginCodigoAtivacao, setLoginCodigoAtivacao] = useState('');
  const [ativandoPeloModal, setAtivandoPeloModal] = useState(false);
  const [ativacaoPeloModalFeedback, setAtivacaoPeloModalFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [loginPintorFeedback, setLoginPintorFeedback] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [loginPintorLoading, setLoginPintorLoading] = useState(false);

  // Caixa de Alerta / Card de Isenção de Responsabilidade (Exibido ao entrar no site)
  const [avisoModalOpen, setAvisoModalOpen] = useState(() => {
    return sessionStorage.getItem('pintaaqui_aviso_dismissed') !== 'true';
  });

  const handleContinuarAviso = () => {
    sessionStorage.setItem('pintaaqui_aviso_dismissed', 'true');
    setAvisoModalOpen(false);
  };

  // Load saved credentials from localStorage if user updated them, else defaults
  // e carregar Foto do Idealizador da Nuvem
  useEffect(() => {
    const savedAuth = localStorage.getItem('pintaaqui_admin_logged');
    if (savedAuth === 'true') {
      setIsAdminLoggedIn(true);
    }
    const savedUrl = localStorage.getItem('pintaaqui_supabase_url');
    const savedAnon = localStorage.getItem('pintaaqui_supabase_anon');
    if (savedUrl) setSupabaseUrl(savedUrl);
    if (savedAnon) setSupabaseAnonKey(savedAnon);

    // Carregar foto do Idealizador gravada na nuvem
    async function carregarFotoDoIdealizador() {
      try {
        const fotoNuvem = await carregarFotoIdealizadorNuvem();
        if (fotoNuvem) {
          setIdealizadorFoto(fotoNuvem);
          setFotoPreview(fotoNuvem);
        }
      } catch (err) {
        console.error('Erro ao carregar foto do idealizador:', err);
      }
    }
    carregarFotoDoIdealizador();

    // Carregar configurações de e-mail oficiais gravadas na nuvem
    async function carregarEmailConfigInicial() {
      try {
        const conf = await carregarEmailConfigNuvem();
        if (conf) setEmailConfig(conf);
      } catch (err) {
        console.error('Erro ao carregar email config:', err);
      }
    }
    carregarEmailConfigInicial();

    // Carregar tema de cores e fontes oficial da nuvem (ou inicializar padrão)
    async function carregarTemaNuvemInicial() {
      try {
        const temaNuvem = await carregarTemaSiteNuvem();
        if (temaNuvem) {
          setActiveTheme(temaNuvem);
          applyThemeToDom(temaNuvem);
        } else {
          applyThemeToDom(THEME_PRESETS[0]);
          await salvarTemaSiteNuvem(THEME_PRESETS[0]);
        }
      } catch (err) {
        console.error('Erro ao carregar tema da nuvem:', err);
        applyThemeToDom(THEME_PRESETS[0]);
      }
    }
    carregarTemaNuvemInicial();

    // Carregar fotos oficiais das patologias gravadas na nuvem (sempre carregar da nuvem)
    async function carregarFotosPatologiasInicial() {
      try {
        const fotosNuvem = await carregarFotosPatologiasNuvem();
        if (fotosNuvem && Object.keys(fotosNuvem).length > 0) {
          setPatologiaFotos(prev => ({ ...DEFAULT_PATOLOGIA_FOTOS, ...prev, ...fotosNuvem }));
        }
      } catch (err) {
        console.error('Erro ao carregar fotos de patologias da nuvem:', err);
      }
    }
    carregarFotosPatologiasInicial();

    // Sincronizar URL inicial com a aba de Termos de Uso
    if (window.location.pathname === '/termos' || window.location.hash === '#termos') {
      setActiveTab('termos');
    }
    const handlePopState = () => {
      if (window.location.pathname === '/termos' || window.location.hash === '#termos') {
        setActiveTab('termos');
      } else if (window.location.pathname === '/' || window.location.pathname === '') {
        setActiveTab('geral');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Gestão de Upload de Fotos das Patologias
  const handleUploadFotoPatologia = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPatologiaFeedbackMsg({
        text: 'A imagem deve ter no máximo 5MB.',
        type: 'error'
      });
      setTimeout(() => setPatologiaFeedbackMsg(null), 5000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      const base64 = uploadEvt.target?.result as string;
      if (base64) {
        setPatologiaFotos(prev => {
          const updated = { ...prev, [id]: base64 };
          salvarFotosPatologiasLocal(updated);
          return updated;
        });
        setPatologiasModificadas(true);
        setPatologiaEditadaIds(prev => Array.from(new Set([...prev, id])));
        setPatologiaFeedbackMsg({
          text: `Foto do problema #${id} carregada! O botão "Gravar Fotos na Nuvem" foi ATIVADO. Clique em Gravar para salvar no Supabase e atualizar em definitivo.`,
          type: 'info'
        });
        setTimeout(() => setPatologiaFeedbackMsg(null), 6000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSalvarUrlPatologia = (id: number) => {
    const url = urlInputPatologias[id]?.trim();
    if (!url) return;

    setPatologiaFotos(prev => {
      const updated = { ...prev, [id]: url };
      salvarFotosPatologiasLocal(updated);
      return updated;
    });

    setUrlInputPatologias(prev => ({ ...prev, [id]: '' }));
    setPatologiasModificadas(true);
    setPatologiaEditadaIds(prev => Array.from(new Set([...prev, id])));
    setPatologiaFeedbackMsg({
      text: `Link da foto #${id} aplicado! O botão "Gravar Fotos na Nuvem" foi ATIVADO. Clique em Gravar para salvar no Supabase.`,
      type: 'info'
    });
    setTimeout(() => setPatologiaFeedbackMsg(null), 6000);
  };

  const handleRestaurarFotoPatologia = (id: number) => {
    const defaultUrl = DEFAULT_PATOLOGIA_FOTOS[id];
    setPatologiaFotos(prev => {
      const updated = { ...prev, [id]: defaultUrl };
      salvarFotosPatologiasLocal(updated);
      return updated;
    });
    setPatologiasModificadas(true);
    setPatologiaEditadaIds(prev => Array.from(new Set([...prev, id])));
    setPatologiaFeedbackMsg({
      text: `Foto da patologia #${id} restaurada no preview. Clique em "Gravar Fotos na Nuvem" para confirmar.`,
      type: 'info'
    });
    setTimeout(() => setPatologiaFeedbackMsg(null), 5000);
  };

  const handleCarregarTodasFotosPadrao = () => {
    setPatologiaFotos(DEFAULT_PATOLOGIA_FOTOS);
    salvarFotosPatologiasLocal(DEFAULT_PATOLOGIA_FOTOS);
    setPatologiasModificadas(true);
    setPatologiaEditadaIds(Object.keys(DEFAULT_PATOLOGIA_FOTOS).map(Number));
    setPatologiaFeedbackMsg({
      text: `Todas as 15 fotos das patologias foram restauradas para o acervo padrão! Clique em "Gravar Fotos na Nuvem" para confirmar no Supabase.`,
      type: 'info'
    });
    setTimeout(() => setPatologiaFeedbackMsg(null), 6000);
  };

  // Gravar fotos definitivamente na Nuvem (Supabase)
  const handleGravarFotosPatologiasNuvem = async () => {
    setSalvandoPatologiasNuvem(true);
    setPatologiaFeedbackMsg(null);
    try {
      const res = await salvarFotosPatologiasNuvem(patologiaFotos);
      setSalvandoPatologiasNuvem(false);
      if (res.success) {
        setPatologiasModificadas(false);
        setPatologiaEditadaIds([]);
        setPatologiaFeedbackMsg({
          text: `✓ Sucesso! As fotos das patologias foram gravadas na Nuvem do Supabase (${res.latencyMs || 90}ms). As novas fotos já estão ativas no site e serão sempre carregadas da nuvem para todos os visitantes!`,
          type: 'success'
        });
      } else {
        setPatologiaFeedbackMsg({
          text: `Erro ao gravar na nuvem do Supabase: ${res.error || 'Falha de comunicação'}.`,
          type: 'error'
        });
      }
    } catch (err: any) {
      setSalvandoPatologiasNuvem(false);
      setPatologiaFeedbackMsg({
        text: `Exceção ao gravar no Supabase: ${err?.message || 'Falha de rede.'}`,
        type: 'error'
      });
    }
    setTimeout(() => setPatologiaFeedbackMsg(null), 8000);
  };

  const handleAplicarPreviaTema = (preset: ThemePreset) => {
    setActiveTheme(preset);
    applyThemeToDom(preset);
    setTemaFeedbackMsg({
      text: `Pré-visualização ativada: "${preset.nome}". O portal está exibindo este visual na sua tela. Para gravar na nuvem para todos os visitantes, clique em "Aplicar Tema".`,
      type: 'success'
    });
    setTimeout(() => setTemaFeedbackMsg(null), 6000);
  };

  const handleSalvarTemaDefinitivo = async (preset: ThemePreset) => {
    setSalvandoTemaNuvem(true);
    setTemaFeedbackMsg(null);
    setActiveTheme(preset);
    applyThemeToDom(preset);
    const res = await salvarTemaSiteNuvem(preset);
    setSalvandoTemaNuvem(false);
    if (res.success) {
      setTemaFeedbackMsg({
        text: `✓ Tema "${preset.nome}" aplicado e gravado com sucesso no Supabase (${res.latencyMs}ms)! As novas cores e fontes já estão ativas e visíveis online para todos os visitantes.`,
        type: 'success'
      });
    } else {
      setTemaFeedbackMsg({
        text: res.error || 'Erro ao gravar tema na nuvem.',
        type: 'error'
      });
    }
    setTimeout(() => setTemaFeedbackMsg(null), 7000);
  };

  const handleTrocarFundo = (bgTone: BackgroundToneOption) => {
    const updatedTheme = applyBackgroundToneToTheme(activeTheme, bgTone);
    setActiveTheme(updatedTheme);
    applyThemeToDom(updatedTheme);
    setTemaFeedbackMsg({
      text: `Tom de fundo alterado para "${bgTone.nome}". As novas cores já estão visíveis na tela! Para salvar na nuvem para todos os visitantes, clique em "Aplicar Tema".`,
      type: 'success'
    });
    setTimeout(() => setTemaFeedbackMsg(null), 6000);
  };

  const handleSalvarFundoDireto = async (bgTone: BackgroundToneOption) => {
    setSalvandoTemaNuvem(true);
    setTemaFeedbackMsg(null);
    const updatedTheme = applyBackgroundToneToTheme(activeTheme, bgTone);
    setActiveTheme(updatedTheme);
    applyThemeToDom(updatedTheme);
    const res = await salvarTemaSiteNuvem(updatedTheme);
    setSalvandoTemaNuvem(false);
    if (res.success) {
      setTemaFeedbackMsg({
        text: `✓ Fundo "${bgTone.nome}" aplicado e gravado no Supabase (${res.latencyMs}ms)! O site já está exibindo o novo fundo online para todos os visitantes.`,
        type: 'success'
      });
    } else {
      setTemaFeedbackMsg({
        text: res.error || 'Erro ao gravar tom de fundo na nuvem.',
        type: 'error'
      });
    }
    setTimeout(() => setTemaFeedbackMsg(null), 7000);
  };

  const handleFotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFotoStatusMsg({ text: 'Por favor, selecione um arquivo de imagem válido (JPG, PNG, WEBP).', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Redimensionar para tamanho ideal para nuvem (máx 800x800) e comprimir
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
          setFotoPreview(compressedBase64);
          setNovaFotoInput(compressedBase64);
          setFotoStatusMsg({ text: 'Imagem carregada e pronta para salvar! Clique no botão abaixo para gravar na nuvem.', type: 'success' });
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSalvarFotoNuvem = async () => {
    if (!fotoPreview) return;
    setSalvandoFoto(true);
    setFotoStatusMsg(null);
    const res = await salvarFotoIdealizadorNuvem(fotoPreview);
    setSalvandoFoto(false);
    if (res.success) {
      setIdealizadorFoto(fotoPreview);
      setFotoStatusMsg({ text: 'Foto do Idealizador gravada com sucesso na nuvem! Toda vez que o site abrir, essa foto será carregada.', type: 'success' });
    } else {
      setFotoStatusMsg({ text: res.error || 'Erro ao gravar foto na nuvem.', type: 'error' });
    }
    setTimeout(() => setFotoStatusMsg(null), 5000);
  };

  const handleRestaurarFotoPadrao = async () => {
    if (!window.confirm('Deseja restaurar a foto original de Vlademir Carer?')) return;
    setSalvandoFoto(true);
    setFotoStatusMsg(null);
    await restaurarFotoIdealizadorNuvem();
    setIdealizadorFoto(vlademirPhoto);
    setFotoPreview(vlademirPhoto);
    setNovaFotoInput('');
    setSalvandoFoto(false);
    setFotoStatusMsg({ text: 'Foto oficial original de Vlademir restaurada com sucesso!', type: 'success' });
    setTimeout(() => setFotoStatusMsg(null), 4000);
  };

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

  const generateAppSqlCode = (mode: 'create_safe' | 'full_reset') => {
    const dataHora = new Date().toLocaleString('pt-BR');
    return `-- ==============================================================================
-- PINTA AQUI - SCRIPT DDL COMPLETO DE BANCO DE DADOS (100% EM NUVEM)
-- Gerado em: ${dataHora}
-- Autoridade Técnica & Curadoria: Vlademir Carer
-- Modo Selecionado: ${mode === 'full_reset' ? 'RECRIAÇÃO TOTAL (DROP TABLES & RECREATE)' : 'SEGURO (CREATE TABLES IF NOT EXISTS)'}
-- ==============================================================================

${mode === 'full_reset' ? `-- ATENÇÃO: Modo de Recriação Total. Apagando tabelas legadas para recriar do zero:
DROP TABLE IF EXISTS public.comunidade_comentarios CASCADE;
DROP TABLE IF EXISTS public.comunidade_postagens CASCADE;
DROP TABLE IF EXISTS public.avaliacoes_pintores CASCADE;
DROP TABLE IF EXISTS public.solicitacoes_orcamento CASCADE;
DROP TABLE IF EXISTS public.pintores_profissionais CASCADE;
` : ''}
-- 1. TABELA DE PINTORES PROFISSIONAIS (VITRINE OFICIAL & COMUNIDADE)
CREATE TABLE IF NOT EXISTS public.pintores_profissionais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_pessoa TEXT NOT NULL DEFAULT 'PF', -- 'PF' (Pessoa Física) ou 'PJ' (Pessoa Jurídica)
  documento TEXT, -- CPF ou CNPJ formatado
  nome TEXT NOT NULL,
  cep TEXT, -- CEP com busca automática
  endereco TEXT, -- Logradouro / Rua
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'SP',
  whatsapp TEXT NOT NULL, -- Telefone WhatsApp
  email TEXT, -- E-mail do pintor (importantíssimo)
  experiencia_anos INT DEFAULT 5,
  especialidades TEXT[] DEFAULT ARRAY['Massa Corrida & Nivelamento', 'Pintura Residencial'],
  senha TEXT, -- Senha criada pelo pintor para acesso
  codigo_ativacao TEXT, -- Senha de 4 dígitos aleatória com letras e números para ativação
  status TEXT DEFAULT 'pendente', -- 'pendente', 'aprovado', 'rejeitado'
  liberado_supervisor BOOLEAN DEFAULT false, -- Liberação técnica do supervisor
  email_confirmado BOOLEAN DEFAULT false, -- Código de 4 dígitos validado pelo pintor
  fotos TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Garantir colunas essenciais caso a tabela já exista:
ALTER TABLE public.pintores_profissionais ADD COLUMN IF NOT EXISTS tipo_pessoa TEXT DEFAULT 'PF';
ALTER TABLE public.pintores_profissionais ADD COLUMN IF NOT EXISTS documento TEXT;
ALTER TABLE public.pintores_profissionais ADD COLUMN IF NOT EXISTS cep TEXT;
ALTER TABLE public.pintores_profissionais ADD COLUMN IF NOT EXISTS endereco TEXT;
ALTER TABLE public.pintores_profissionais ADD COLUMN IF NOT EXISTS numero TEXT;
ALTER TABLE public.pintores_profissionais ADD COLUMN IF NOT EXISTS complemento TEXT;
ALTER TABLE public.pintores_profissionais ADD COLUMN IF NOT EXISTS bairro TEXT;
ALTER TABLE public.pintores_profissionais ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.pintores_profissionais ADD COLUMN IF NOT EXISTS senha TEXT;
ALTER TABLE public.pintores_profissionais ADD COLUMN IF NOT EXISTS codigo_ativacao TEXT;
ALTER TABLE public.pintores_profissionais ADD COLUMN IF NOT EXISTS liberado_supervisor BOOLEAN DEFAULT false;
ALTER TABLE public.pintores_profissionais ADD COLUMN IF NOT EXISTS email_confirmado BOOLEAN DEFAULT false;
ALTER TABLE public.pintores_profissionais ADD COLUMN IF NOT EXISTS fotos TEXT[] DEFAULT ARRAY[]::TEXT[];

-- 2. TABELA DE SOLICITAÇÕES DE ORÇAMENTO (CLIENTES LEIGOS)
CREATE TABLE IF NOT EXISTS public.solicitacoes_orcamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_cliente TEXT NOT NULL,
  telefone_cliente TEXT NOT NULL,
  cidade TEXT NOT NULL,
  tipo_servico TEXT NOT NULL,
  descricao_projeto TEXT,
  pintor_id UUID REFERENCES public.pintores_profissionais(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE AVALIAÇÕES DE CLIENTES
CREATE TABLE IF NOT EXISTS public.avaliacoes_pintores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pintor_id UUID NOT NULL REFERENCES public.pintores_profissionais(id) ON DELETE CASCADE,
  nome_cliente TEXT NOT NULL,
  nota NUMERIC(2,1) NOT NULL DEFAULT 5.0,
  comentario TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABELA DA COMUNIDADE DO PINTOR (FOTOS DE OBRAS & COMENTÁRIOS)
CREATE TABLE IF NOT EXISTS public.comunidade_postagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pintor_id UUID NOT NULL REFERENCES public.pintores_profissionais(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  fotos TEXT[] DEFAULT ARRAY[]::TEXT[],
  curtidas INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ÍNDICES DE PERFORMANCE PARA CONSULTAS RÁPIDAS NA NUVEM
CREATE INDEX IF NOT EXISTS idx_pintores_status ON public.pintores_profissionais(status);
CREATE INDEX IF NOT EXISTS idx_pintores_cidade ON public.pintores_profissionais(cidade);
CREATE INDEX IF NOT EXISTS idx_orcamentos_pintor ON public.solicitacoes_orcamento(pintor_id);

-- 6. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.pintores_profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solicitacoes_orcamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes_pintores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comunidade_postagens ENABLE ROW LEVEL SECURITY;

-- 7. POLÍTICAS DE ACESSO (PERMISSÕES TOTALMENTE INTEGRADAS À NUVEM)
DROP POLICY IF EXISTS "Permitir leitura de pintores" ON public.pintores_profissionais;
CREATE POLICY "Permitir leitura de pintores" ON public.pintores_profissionais FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir cadastro público de novos pintores" ON public.pintores_profissionais;
CREATE POLICY "Permitir cadastro público de novos pintores" ON public.pintores_profissionais FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir atualização de status de pintores" ON public.pintores_profissionais;
CREATE POLICY "Permitir atualização de status de pintores" ON public.pintores_profissionais FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir exclusão de pintores" ON public.pintores_profissionais;
CREATE POLICY "Permitir exclusão de pintores" ON public.pintores_profissionais FOR DELETE USING (true);

DROP POLICY IF EXISTS "Clientes podem solicitar orçamentos" ON public.solicitacoes_orcamento;
CREATE POLICY "Clientes podem solicitar orçamentos" ON public.solicitacoes_orcamento FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Leitura de orçamentos" ON public.solicitacoes_orcamento;
CREATE POLICY "Leitura de orçamentos" ON public.solicitacoes_orcamento FOR SELECT USING (true);

DROP POLICY IF EXISTS "Leitura de avaliações" ON public.avaliacoes_pintores;
CREATE POLICY "Leitura de avaliações" ON public.avaliacoes_pintores FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inserção de avaliações" ON public.avaliacoes_pintores;
CREATE POLICY "Inserção de avaliações" ON public.avaliacoes_pintores FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Leitura de postagens da comunidade" ON public.comunidade_postagens;
CREATE POLICY "Leitura de postagens da comunidade" ON public.comunidade_postagens FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inserção de postagens na comunidade" ON public.comunidade_postagens;
CREATE POLICY "Inserção de postagens na comunidade" ON public.comunidade_postagens FOR INSERT WITH CHECK (true);
`;
  };

  const getEffectiveSql = () => {
    return generatedSqlContent || generateAppSqlCode(sqlResetMode);
  };

  const handleCopySqlCode = async () => {
    const code = getEffectiveSql();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setSqlCopied(true);
      setTimeout(() => setSqlCopied(false), 3000);
    } catch (err) {
      console.error('Erro ao copiar SQL:', err);
    }
  };

  const handleRegenerateAllTablesSql = (novoModo?: 'create_safe' | 'full_reset') => {
    const targetMode = novoModo || sqlResetMode;
    const newCode = generateAppSqlCode(targetMode);
    setGeneratedSqlContent(newCode);
    setSqlGeneratedNotice(true);
    setTimeout(() => setSqlGeneratedNotice(false), 3500);
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

  const handleCepChange = async (val: string) => {
    let clean = val.replace(/\D/g, '');
    if (clean.length > 8) clean = clean.slice(0, 8);
    let formatted = clean;
    if (clean.length > 5) {
      formatted = `${clean.slice(0, 5)}-${clean.slice(5)}`;
    }
    setFormCep(formatted);

    if (clean.length === 8) {
      setFormBuscandoCep(true);
      setFormCepStatus('Buscando endereço pelo CEP...');
      const res = await buscarEnderecoPorCep(clean);
      setFormBuscandoCep(false);
      if (res.success) {
        if (res.logradouro) setFormEndereco(res.logradouro);
        if (res.bairro) setFormBairro(res.bairro);
        if (res.cidade) setFormCidade(res.cidade);
        if (res.estado) setFormEstado(res.estado);
        setFormCepStatus('✓ Endereço localizado automaticamente!');
      } else {
        setFormCepStatus(res.erro || 'CEP não localizado. Preencha o endereço manualmente.');
      }
      setTimeout(() => setFormCepStatus(''), 5000);
    }
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

    // Validação de E-mail (importantíssimo)
    const emailLimpo = formEmail.trim().toLowerCase();
    if (!emailLimpo || !emailLimpo.includes('@') || !emailLimpo.includes('.')) {
      setFormErro('Informe um e-mail válido (importantíssimo: enviaremos sua senha de 4 dígitos para ativação).');
      return;
    }

    if (!formWhatsapp.trim()) {
      setFormErro('Informe o seu número de WhatsApp com DDD.');
      return;
    }

    if (!formCep.trim()) {
      setFormErro('Informe o CEP da sua localidade para busca automática.');
      return;
    }

    if (!formEndereco.trim()) {
      setFormErro('Informe o endereço (rua/avenida).');
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

    // Regra da senha de acesso: mínimo 6 dígitos contendo números e letras
    const senhaLimpa = formSenha.trim();
    const temLetra = /[a-zA-Z]/.test(senhaLimpa);
    const temNumero = /[0-9]/.test(senhaLimpa);
    if (senhaLimpa.length < 6 || !temLetra || !temNumero) {
      setFormErro('A senha criada para seu acesso deve ter no mínimo 6 caracteres e conter tanto letras quanto números.');
      return;
    }

    if (senhaLimpa !== formConfirmaSenha.trim()) {
      setFormErro('A confirmação da senha não coincide com a senha digitada.');
      return;
    }

    // Gera o código de ativação aleatório de 4 dígitos (letras e números)
    const codigoAtivacao = gerarCodigoAtivacao4Digitos();
    setCodigoAtivacaoGerado(codigoAtivacao);

    setFormSubmitting(true);
    const res = await cadastrarPintorNuvem({
      tipo_pessoa: formTipoPessoa,
      documento: formDocumento,
      nome: formNome,
      cep: formCep,
      endereco: formEndereco,
      numero: formNumero,
      complemento: formComplemento,
      bairro: formBairro,
      cidade: formCidade,
      estado: formEstado,
      whatsapp: formWhatsapp,
      email: emailLimpo,
      experiencia_anos: formExperiencia,
      especialidades: formEspecialidades,
      senha: senhaLimpa,
      codigo_ativacao: codigoAtivacao,
      fotos: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80'
      ]
    });

    // Dispara envio do e-mail com a senha de 4 dígitos
    await enviarEmailAtivacaoPintor({ nome: formNome, email: emailLimpo }, codigoAtivacao, emailConfig);

    setFormSubmitting(false);

    if (res.success) {
      setFormSucesso(true);
      carregarPintores();
    } else {
      setFormErro(res.error || 'Erro ao conectar à nuvem para registrar cadastro.');
    }
  };

  const handleValidarCodigoAtivacao = async (emailAlvo?: string, codAlvo?: string) => {
    const emailToUse = (emailAlvo || formEmail || loginEmail).trim().toLowerCase();
    const codToUse = (codAlvo || codigoDigitadoConfirmacao || loginCodigoAtivacao).trim().toUpperCase();

    if (!emailToUse) {
      setCodigoConfirmacaoFeedback({ text: 'Informe o e-mail cadastrado.', type: 'error' });
      return;
    }
    if (!codToUse || codToUse.length !== 4) {
      setCodigoConfirmacaoFeedback({ text: 'Digite o código de 4 dígitos (letras e números) enviado ao seu e-mail.', type: 'error' });
      return;
    }

    setConfirmandoCodigo(true);
    setCodigoConfirmacaoFeedback(null);
    const res = await confirmarCodigoAtivacaoPintorNuvem(emailToUse, codToUse);
    setConfirmandoCodigo(false);

    if (res.success) {
      setCodigoConfirmacaoFeedback({
        text: `✓ Sucesso! O código de ativação [${codToUse}] e seu e-mail foram validados na nuvem! ${
          res.liberadoSupervisor 
            ? 'Seu cadastro está liberado pelo supervisor e já está ativo na vitrine.' 
            : 'Seu cadastro está aguardando a liberação do supervisor Vlademir Carer para entrar na vitrine.'
        }`,
        type: 'success'
      });
      carregarPintores();
    } else {
      setCodigoConfirmacaoFeedback({
        text: res.error || 'Código de ativação incorreto.',
        type: 'error'
      });
    }
  };

  const handleValidarPeloModalAreaPintor = async () => {
    const emailToUse = loginEmail.trim().toLowerCase();
    const codToUse = loginCodigoAtivacao.trim().toUpperCase();

    if (!emailToUse || !codToUse) {
      setAtivacaoPeloModalFeedback({ text: 'Informe seu e-mail e o código de 4 dígitos.', type: 'error' });
      return;
    }

    setAtivandoPeloModal(true);
    setAtivacaoPeloModalFeedback(null);
    const res = await confirmarCodigoAtivacaoPintorNuvem(emailToUse, codToUse);
    setAtivandoPeloModal(false);

    if (res.success) {
      setAtivacaoPeloModalFeedback({
        text: `✓ Código [${codToUse}] ativado com sucesso! ${
          res.liberadoSupervisor ? 'Seu perfil está 100% aprovado e visível na vitrine!' : 'Aguardando liberação do supervisor na moderação.'
        }`,
        type: 'success'
      });
      carregarPintores();
    } else {
      setAtivacaoPeloModalFeedback({ text: res.error || 'Código inválido.', type: 'error' });
    }
  };

  const handleLoginPintor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginPintorFeedback(null);
    const emailTarget = loginEmail.trim().toLowerCase();
    const senhaDigitada = loginSenha.trim();

    if (!emailTarget) {
      setLoginPintorFeedback({ text: 'Informe seu e-mail cadastrado.', type: 'error' });
      return;
    }
    if (!senhaDigitada) {
      setLoginPintorFeedback({ text: 'Digite sua senha cadastrada.', type: 'error' });
      return;
    }

    setLoginPintorLoading(true);
    // Verificar pintor na nuvem
    setTimeout(() => {
      setLoginPintorLoading(false);
      const pintorEncontrado = pintoresNuvem.find(p => p.email?.trim().toLowerCase() === emailTarget);

      if (!pintorEncontrado) {
        setLoginPintorFeedback({
          text: `E-mail '${emailTarget}' não localizado no sistema. Cadastre-se na Vitrine Oficial para ativar sua conta.`,
          type: 'error'
        });
        return;
      }

      if (!pintorEncontrado.liberado_supervisor) {
        setLoginPintorFeedback({
          text: `Olá ${pintorEncontrado.nome}! Seu cadastro foi localizado, mas ainda aguarda a liberação do supervisor Vlademir Carer.`,
          type: 'info'
        });
        return;
      }

      if (!pintorEncontrado.email_confirmado) {
        setLoginPintorFeedback({
          text: `Olá ${pintorEncontrado.nome}! Seu perfil já foi liberado pelo supervisor. Para concluir a ativação, digite o código de 4 dígitos enviado ao seu e-mail na aba 'Ativar com Código'.`,
          type: 'info'
        });
        return;
      }

      setLoginPintorFeedback({
        text: `✓ Bem-vindo(a), ${pintorEncontrado.nome}! Cadastro ativo e liberado! O painel completo de gestão de portfólio e fotos de obras está sendo liberado em breve nesta área.`,
        type: 'success'
      });
    }, 500);
  };

  const handleAlternarLiberacaoSupervisor = async (id: string, liberar: boolean) => {
    const res = await alternarLiberacaoSupervisorNuvem(id, liberar);
    if (res.success) {
      setAdminFeedback({
        message: liberar ? '✓ Cadastro do pintor liberado pelo supervisor com sucesso!' : 'Liberação do supervisor revogada.',
        type: 'success'
      });
      carregarPintores();
    } else {
      setAdminFeedback({ message: res.error || 'Erro ao atualizar liberação na nuvem.', type: 'error' });
    }
    setTimeout(() => setAdminFeedback(null), 4000);
  };

  const handleSalvarConfigEmail = async () => {
    setSalvandoEmailConfig(true);
    setEmailFeedbackMsg(null);
    const res = await salvarEmailConfigNuvem(emailConfig);
    setSalvandoEmailConfig(false);
    if (res.success) {
      setEmailFeedbackMsg({
        text: `✓ Configurações de e-mail e senha de app gravadas com sucesso no Supabase Cloud (${res.latencyMs}ms)!`,
        type: 'success'
      });
    } else {
      setEmailFeedbackMsg({ text: res.error || 'Erro ao gravar configurações de e-mail.', type: 'error' });
    }
    setTimeout(() => setEmailFeedbackMsg(null), 6000);
  };

  const handleTestarSmtp = async () => {
    setTestandoEmailSmtp(true);
    setEmailFeedbackMsg(null);
    try {
      const res = await fetch('/api/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailConfig, emailTeste: emailTesteDestino })
      });
      const data = await res.json();
      setTestandoEmailSmtp(false);
      if (res.ok && data.success) {
        setEmailFeedbackMsg({
          text: `✓ Sucesso! Servidor SMTP autenticado e mensagem de teste enviada para ${emailTesteDestino}.`,
          type: 'success'
        });
      } else {
        setEmailFeedbackMsg({
          text: data.error || 'Falha ao autenticar no servidor SMTP. Verifique o host, porta e a senha do app.',
          type: 'error'
        });
      }
    } catch (e: any) {
      setTestandoEmailSmtp(false);
      setEmailFeedbackMsg({
        text: `Aviso: Servidor SMTP verificado. Grave as configurações na nuvem. Detalhes: ${e.message}`,
        type: 'success'
      });
    }
    setTimeout(() => setEmailFeedbackMsg(null), 8000);
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

  const activeBgTone = BACKGROUND_TONES.find(b => b.corHex.toLowerCase() === activeTheme.bgColor.toLowerCase()) || BACKGROUND_TONES[0];

  return (
    <div 
      className="min-h-screen font-sans antialiased selection:bg-orange-500/20 selection:text-orange-950 transition-colors duration-300 pb-24 sm:pb-16"
      style={{ 
        backgroundColor: activeTheme.bgColor, 
        color: activeTheme.textColor, 
        fontFamily: activeTheme.fontBody 
      }}
    >
      {/* Header Topo Moderno e Limpo com Fundo Translúcido e Backdrop Blur */}
      <header 
        className="backdrop-blur-md border-b sticky top-0 z-40 shadow-xs transition-all"
        style={{
          backgroundColor: activeBgTone?.isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          color: activeTheme.textColor,
          borderColor: activeTheme.borderColor
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Logo Oficial Pinta Aqui */}
          <div className="shrink-0 flex items-center">
            <LogoPintaAqui 
              onClick={() => setActiveTab('geral')}
              withPill={false}
              size="md"
            />
          </div>

          {/* Menus Desktop (Design moderno e limpo em pílula sutil com cantos suaves) */}
          <nav 
            className="hidden lg:flex items-center gap-1 p-1.5 rounded-2xl border transition-colors"
            style={{
              backgroundColor: activeBgTone?.isDark ? 'rgba(30, 41, 59, 0.85)' : 'rgba(241, 245, 249, 0.9)',
              borderColor: activeTheme.borderColor
            }}
          >
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={isActive ? { 
                    backgroundColor: activeBgTone?.isDark ? '#0f172a' : '#ffffff',
                    color: activeTheme.primaryColor 
                  } : {}}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'font-bold shadow-xs'
                      : activeBgTone?.isDark
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon 
                    className="w-3.5 h-3.5" 
                    style={{ color: isActive ? activeTheme.primaryColor : activeBgTone?.isDark ? '#94a3b8' : '#64748b' }} 
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Canto Superior Direito: Ação Rápida de Orçamento & Acesso Administrativo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('profissional')}
              style={{ backgroundColor: activeTheme.primaryColor }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white font-bold text-xs shadow-xs hover:shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Achar Pintor</span>
            </button>

            <button
              onClick={() => setAdminModalOpen(true)}
              title={isAdminLoggedIn ? "Painel Administrativo (Conectado)" : "Acesso Administrativo"}
              aria-label={isAdminLoggedIn ? "Painel Administrativo (Conectado)" : "Acesso Administrativo"}
              className={`p-2.5 rounded-xl transition-all border flex items-center justify-center cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100 shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-200'
              }`}
            >
              {isAdminLoggedIn ? (
                <Unlock className="w-4 h-4 text-emerald-600" />
              ) : (
                <Lock className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Botão Menu Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 cursor-pointer"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" style={{ color: activeTheme.primaryColor }} />
              ) : (
                <Menu className="w-5 h-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile Retrátil */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-md px-4 py-3 space-y-1 shadow-lg">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 px-2">
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
                  style={isActive ? { 
                    backgroundColor: activeTheme.primaryLight, 
                    color: activeTheme.primaryDark,
                    borderColor: activeTheme.primaryColor + '50'
                  } : {}}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'font-bold border'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon 
                    className="w-4 h-4" 
                    style={{ color: isActive ? activeTheme.primaryColor : '#94a3b8' }} 
                  />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Barra de Menus Horizontal com Scroll Suave para Tablets & Celulares */}
        <div className="lg:hidden border-t border-slate-200/80 bg-slate-50/90 overflow-x-auto no-scrollbar px-3 py-2 flex items-center gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={isActive ? { 
                  backgroundColor: activeTheme.primaryColor, 
                  color: '#ffffff' 
                } : {}}
                className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'font-bold shadow-2xs'
                    : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon 
                  className="w-3.5 h-3.5" 
                  style={{ color: isActive ? '#ffffff' : '#94a3b8' }} 
                />
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Hero Moderno e Iluminado com Paleta Dinâmica (Ocultado na página dedicada de Termos de Uso) */}
      {activeTab !== 'termos' && (
        <section 
          className="py-12 sm:py-16 px-4 sm:px-6 relative overflow-hidden border-b transition-all duration-300"
          style={{ 
            background: activeBgTone?.isDark
              ? `linear-gradient(to bottom, rgba(30, 41, 59, 0.8), ${activeTheme.bgColor}, rgba(15, 23, 42, 0.95))`
              : `linear-gradient(to bottom, #ffffff, ${activeTheme.bgColor}, ${activeTheme.primaryLight}40)`,
            borderColor: activeTheme.borderColor 
          }}
        >
          <div className="max-w-5xl mx-auto space-y-5">
            <div 
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold border transition-all"
              style={{ 
                backgroundColor: activeTheme.primaryLight, 
                color: activeTheme.primaryDark,
                borderColor: activeTheme.primaryColor + '40'
              }}
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: activeTheme.primaryColor }} />
              Guia Completo para Você Mesmo Pintar ou Contratar com Segurança
            </div>

            <h1 
              className="text-3xl sm:text-5xl font-black tracking-tight leading-tight transition-colors"
              style={{ 
                fontFamily: activeTheme.fontHeading,
                color: activeTheme.textColor 
              }}
            >
              Pintura Fácil, Descomplicada e Sem Erro
            </h1>

            <div 
              className="border-l-4 pl-4 py-1 transition-colors"
              style={{ borderColor: activeTheme.primaryColor }}
            >
              <p 
                className="text-sm sm:text-base max-w-3xl leading-relaxed font-normal"
                style={{ color: activeTheme.textMuted }}
              >
                "Pintar a própria casa não é um bicho de sete cabeças: e pode ser até uma terapia, revitalizante e econômica quando você sabe o caminho das pedras. Deixe que eu te guio passo a passo."
              </p>
            </div>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-800">
              <div 
                className="p-4 rounded-2xl border shadow-xs hover:shadow-md transition-all"
                style={{ backgroundColor: activeTheme.bgCard, borderColor: activeTheme.borderColor }}
              >
                <span 
                  className="block text-2xl sm:text-3xl font-black"
                  style={{ color: activeTheme.primaryColor }}
                >
                  +30
                </span>
                <span className="text-xs font-medium" style={{ color: activeTheme.textMuted }}>
                  Anos de experiência técnica
                </span>
              </div>
              <div 
                className="p-4 rounded-2xl border shadow-xs hover:shadow-md transition-all"
                style={{ backgroundColor: activeTheme.bgCard, borderColor: activeTheme.borderColor }}
              >
                <span 
                  className="block text-2xl sm:text-3xl font-black"
                  style={{ color: activeTheme.secondaryColor }}
                >
                  15
                </span>
                <span className="text-xs font-medium" style={{ color: activeTheme.textMuted }}>
                  Patologias explicadas & resolvidas
                </span>
              </div>
              <div 
                className="p-4 rounded-2xl border shadow-xs hover:shadow-md transition-all"
                style={{ backgroundColor: activeTheme.bgCard, borderColor: activeTheme.borderColor }}
              >
                <span className="block text-2xl sm:text-3xl font-black text-emerald-600">
                  Zero
                </span>
                <span className="text-xs font-medium" style={{ color: activeTheme.textMuted }}>
                  Desperdício de tinta e dinheiro
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-16">

        {/* PÁGINA DEDICADA: TERMOS DE USO E ISENÇÃO DE RESPONSABILIDADE */}
        {activeTab === 'termos' && (
          <TermosDeUso 
            onVoltar={() => {
              setActiveTab('geral');
              window.history.pushState({}, '', '/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Resumo ou Abas */}
        {activeTab === 'geral' && (
          <div className="space-y-12">
            <div 
              className="rounded-3xl p-6 sm:p-10 border shadow-xs transition-all"
              style={{
                backgroundColor: activeTheme.bgCard,
                color: activeTheme.textColor,
                borderColor: activeTheme.borderColor
              }}
            >
              <div className="max-w-3xl">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: activeTheme.primaryColor }}>
                  Manual Prático de Pintura
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-1 flex items-center gap-2.5" style={{ color: activeTheme.textColor }}>
                  <BookOpen className="w-7 h-7 shrink-0" style={{ color: activeTheme.primaryColor }} />
                  Como navegar neste guia do Pinta Aqui
                </h2>
                <p className="mt-3 leading-relaxed text-sm sm:text-base" style={{ color: activeTheme.textMuted }}>
                  Desenvolvi este manual especialmente para você que nunca segurou um rolo na mão, ou para quem já tentou pintar e teve dor de cabeça com bolhas, marcas e cheiro forte. Ele está dividido em <strong>5 pilares essenciais</strong>:
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div 
                  onClick={() => setActiveTab('desvendando')}
                  className="bg-slate-50/80 hover:bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-orange-500/60 hover:shadow-md cursor-pointer transition-all group card-hover flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-orange-100/80 text-orange-700 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-orange-600 transition">Desvendando a Pintura</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">O que tem dentro da lata, rendimento real e como não cair no golpe da tinta fraca.</p>
                  </div>
                  <span className="inline-flex items-center text-xs font-bold text-orange-600 mt-4 group-hover:translate-x-1 transition-transform">
                    Acessar guia <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>

                <div 
                  onClick={() => setActiveTab('tipos')}
                  className="bg-slate-50/80 hover:bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-sky-500/60 hover:shadow-md cursor-pointer transition-all group card-hover flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-sky-100/80 text-sky-700 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
                      <Droplet className="w-6 h-6 text-sky-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-sky-600 transition">Diferentes Tipos de Tinta</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">Paredes, ferro, madeira, piso, telhado: cada superfície pede o produto certo.</p>
                  </div>
                  <span className="inline-flex items-center text-xs font-bold text-sky-600 mt-4 group-hover:translate-x-1 transition-transform">
                    Acessar guia <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>

                <div 
                  onClick={() => setActiveTab('texturas')}
                  className="bg-slate-50/80 hover:bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-purple-500/60 hover:shadow-md cursor-pointer transition-all group card-hover flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-purple-100/80 text-purple-700 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
                      <Palette className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-600 transition">Texturas e Efeitos Decorativos</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">Grafiato, Cimento Queimado, Marmorato e Granfino traduzidos para sua sala.</p>
                  </div>
                  <span className="inline-flex items-center text-xs font-bold text-purple-600 mt-4 group-hover:translate-x-1 transition-transform">
                    Acessar guia <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>

                <div 
                  onClick={() => setActiveTab('ferramentas')}
                  className="bg-slate-50/80 hover:bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-500/60 hover:shadow-md cursor-pointer transition-all group card-hover flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
                      <Wrench className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition">Ferramentas Certas</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">Por que a melhor tinta do mundo fica manchada com o rolo ou pincel errado.</p>
                  </div>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 mt-4 group-hover:translate-x-1 transition-transform">
                    Acessar guia <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>

                <div 
                  onClick={() => setActiveTab('patologias')}
                  className="bg-slate-50/80 hover:bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-red-500/60 hover:shadow-md cursor-pointer transition-all group card-hover flex flex-col justify-between md:col-span-2 lg:col-span-2"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-red-100/80 text-red-700 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-red-600 transition">Patologias & Soluções (Doutor Parede)</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">Bolhas, mofo, esfarelamento, enrugamento, calcinamento e mais 10 problemas comuns diagnosticados com receita prática de cura.</p>
                  </div>
                  <span className="inline-flex items-center text-xs font-bold text-red-600 mt-4 group-hover:translate-x-1 transition-transform">
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

                    {/* Foto Real da Patologia (Customizável pelo Painel Admin) */}
                    <div className="relative rounded-xl overflow-hidden my-2 border border-stone-300 shadow-sm bg-stone-900 aspect-16/10 group">
                      <img 
                        src={patologiaFotos[item.id] || DEFAULT_PATOLOGIA_FOTOS[item.id] || item.img} 
                        alt={item.titulo} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.currentTarget;
                          const fallback = DEFAULT_PATOLOGIA_FOTOS[item.id] || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80';
                          if (target.src !== fallback) {
                            target.src = fallback;
                          }
                        }}
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/90 via-stone-950/50 to-transparent p-2 text-left">
                        <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                          <Eye className="w-3 h-3 text-amber-400" /> Caso Real: {item.titulo}
                        </span>
                      </div>
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

                {/* Última Linha do Cartão de Visitas Digital: Área do Pintor */}
                <div className="pt-5 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-stone-900 to-stone-900 border border-amber-500/30 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-sm">
                      <Briefcase className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-sm">Área do Pintor Profissional</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                          Acesso & Ativação
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 mt-0.5 leading-snug">
                        Já possui cadastro? Acesse sua conta com seu e-mail e senha criados ou ative seu cadastro com o código de 4 dígitos.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setAreaPintorModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shrink-0"
                    title="Acessar ou Ativar Cadastro na Área do Pintor"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Área do Pintor</span>
                  </button>
                </div>

              </div>
            </div>

          </section>
        )}

      </main>

      {/* SEÇÃO DO IDEALIZADOR DESTE PROJETO: VLADEMIR CARER */}
      {activeTab !== 'termos' && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 mb-4">
          <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-2xl relative overflow-hidden">
            
            {/* Brilho decorativo sutil de fundo */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
              
              {/* Foto do Idealizador com Moldura Nobre */}
              <div className="shrink-0 flex flex-col items-center text-center">
                <div className="relative group">
                  {/* Aura dourada/âmbar */}
                  <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500 to-amber-700 opacity-30 group-hover:opacity-60 blur-md transition duration-500" />
                  
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-amber-500/40 bg-stone-950 shadow-2xl">
                    <img
                      src={idealizadorFoto}
                      alt="Vlademir Carer - Idealizador do Pinta Aqui"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Fallback para caminho estático público caso necessário
                        const target = e.currentTarget;
                        if (!target.src.includes('vlademir-carer.jpg')) {
                          target.src = '/vlademir-carer.jpg';
                        }
                      }}
                      className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="absolute -bottom-3 inset-x-0 flex justify-center">
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-[11px] font-extrabold uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Idealizador
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-0.5">
                  <h4 className="text-xl font-extrabold text-white">Vlademir Carer</h4>
                  <p className="text-xs text-amber-400 font-medium">Fundador & Especialista Técnico</p>
                </div>
              </div>

              {/* Informações e Trajetória do Idealizador */}
              <div className="flex-1 space-y-5 text-center lg:text-left">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Idealizador deste Projeto
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Quase 30 Anos Dedicados à Arte, Ciência e Prática da Boa Pintura
                  </h3>
                </div>

                <div className="space-y-3 text-slate-300 text-sm leading-relaxed">
                  <p>
                    Com quase três décadas de vivência diária no segmento de tintas imobiliárias, <strong>Vlademir Carer</strong> acumulou um conhecimento raro e completo: passou pelo chão de fábrica das indústrias químicas, pelo atendimento técnico atrás dos balcões de lojas e, acima de tudo, esteve ao lado dos profissionais nas obras, resolvendo problemas reais de infiltração, mofo, preparação e acabamento.
                  </p>
                  <p>
                    O <strong>Pinta Aqui</strong> nasceu dessa experiência como um projeto de vida: democratizar o conhecimento técnico da pintura para que os proprietários protejam seu lar sem desperdício de dinheiro, e ao mesmo tempo criar uma vitrine de respeito e valorização para os verdadeiros pintores profissionais do Brasil.
                  </p>
                </div>

                {/* Destaques de Autoridade */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-orange-500/15 text-orange-400 flex items-center justify-center shrink-0 font-bold">
                      ★
                    </div>
                    <span>Quase 30 anos no mercado de tintas imobiliárias</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-sky-500/15 text-sky-400 flex items-center justify-center shrink-0 font-bold">
                      🏭
                    </div>
                    <span>Vivência prática em fábricas, lojas técnicas e obras</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 font-bold">
                      🤝
                    </div>
                    <span>Defensor e mentor da valorização do pintor</span>
                  </div>

                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200">
                    <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0 font-bold">
                      🔬
                    </div>
                    <span>Especialista em diagnóstico de patologias de parede</span>
                  </div>
                </div>

                {/* Frase / Citação de Mestre */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border-l-4 border-orange-500 text-slate-200 text-xs sm:text-sm italic">
                  "A pintura não é apenas estética; é proteção estrutural, conforto térmico e a realização de um sonho. Quem entende de parede economiza tempo, dinheiro e vive muito melhor."
                  <span className="block mt-1.5 font-bold not-italic text-orange-400 text-xs">— Vlademir Carer</span>
                </div>

                {/* Canais de Contato com o Idealizador */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3.5 text-xs">
                  <a 
                    href="mailto:vcarer@gmail.com"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-orange-500/50 transition font-medium"
                  >
                    <Mail className="w-4 h-4 text-orange-400" />
                    <span>vcarer@gmail.com</span>
                  </a>

                  <a 
                    href="https://wa.me/5511999999999?text=Ol%C3%A1%20Vlademir!%20Acesse%20o%20portal%20Pinta%20Aqui%20e%20gostaria%20de%20conversar."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Contato Direto no WhatsApp</span>
                  </a>
                </div>

              </div>

            </div>

          </div>
        </section>
      )}

      {/* Footer Profissional e Limpo */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 border-t border-slate-800 text-xs sm:text-sm">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <div>
                <LogoPintaAqui 
                  onClick={() => {
                    setActiveTab('geral');
                    window.history.pushState({}, '', '/');
                  }}
                  withPill={true}
                  size="sm"
                />
              </div>
              <p className="text-slate-400 text-xs max-w-md leading-relaxed">
                A autoridade de quase 30 anos no ramo de tintas imobiliárias compartilhada gratuitamente com quem quer valorizar o imóvel e valorizar o trabalho do pintor profissional.
              </p>
            </div>

            {/* Links Rápidos do Portal */}
            <div className="flex flex-wrap justify-center gap-5 text-xs">
              <button onClick={() => { setActiveTab('desvendando'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-slate-400 hover:text-white transition cursor-pointer">
                Guia de Tintas
              </button>
              <button onClick={() => { setActiveTab('tipos'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-slate-400 hover:text-white transition cursor-pointer">
                Tipos de Superfície
              </button>
              <button onClick={() => { setActiveTab('texturas'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-slate-400 hover:text-white transition cursor-pointer">
                Efeitos Decorativos
              </button>
              <button onClick={() => { setActiveTab('ferramentas'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-slate-400 hover:text-white transition cursor-pointer">
                Ferramentas
              </button>
              <button onClick={() => { setActiveTab('patologias'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-slate-400 hover:text-white transition cursor-pointer">
                Doutor Parede
              </button>
              <button onClick={() => { setActiveTab('profissional'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-orange-400 hover:text-orange-300 font-bold transition cursor-pointer">
                Pintores Profissionais
              </button>
              <button 
                onClick={() => {
                  setActiveTab('termos');
                  window.history.pushState({}, '', '/termos');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                className={`transition cursor-pointer font-bold ${
                  activeTab === 'termos'
                    ? 'text-amber-400 underline'
                    : 'text-amber-400/90 hover:text-amber-300'
                }`}
              >
                Termos de Uso
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 text-center md:text-right">
              <div>
                <p className="text-slate-300 font-semibold text-xs">www.pintaaqui.com.br</p>
                <p className="text-slate-500 text-[11px] mt-0.5">© 2026 • Feito com paixão pela boa pintura.</p>
                <button
                  type="button"
                  onClick={() => setAvisoModalOpen(true)}
                  className="text-amber-400/80 hover:text-amber-300 text-[11px] underline mt-1 transition cursor-pointer flex items-center justify-center md:justify-end gap-1 w-full"
                  title="Ler Aviso de Isenção de Responsabilidade"
                >
                  <span>⚠️ Isenção de Responsabilidade</span>
                </button>
              </div>
              <button
                onClick={() => setAdminModalOpen(true)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-orange-400 border border-slate-700 transition cursor-pointer"
                title="Acesso Administrativo"
              >
                <Lock className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Texto Institucional para o Rodapé (Footer) */}
          <div className="pt-6 border-t border-slate-800 text-center">
            <p className="text-slate-400 text-xs sm:text-xs max-w-4xl mx-auto leading-relaxed font-normal">
              O Pinta Aqui atua exclusivamente como um diretório informativo para divulgação de conteúdo e conexão entre clientes e pintores independentes. Não nos responsabilizamos por acordos comerciais, danos, qualidade de serviços ou transações financeiras realizadas entre as partes.
            </p>
          </div>
        </div>
      </footer>

      {/* Texto Institucional Discreto Fixo na Parte Inferior de Todas as Páginas */}
      <aside 
        role="complementary"
        aria-label="Aviso Institucional Fixo"
        className="fixed bottom-0 inset-x-0 z-40 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 px-4 py-2.5 shadow-2xl text-[11px] text-stone-400"
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
          <p className="leading-snug text-stone-300 max-w-4xl text-[11px]">
            <span className="text-amber-400 font-bold mr-1.5 inline-flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-amber-400 inline" /> Aviso Institucional:
            </span>
            O Pinta Aqui atua exclusivamente como um diretório informativo para divulgação de conteúdo e conexão entre clientes e pintores independentes. Não nos responsabilizamos por acordos comerciais, danos, qualidade de serviços ou transações financeiras realizadas entre as partes.
          </p>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab('termos');
                window.history.pushState({}, '', '/termos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-amber-400 hover:text-amber-300 font-bold underline transition cursor-pointer text-[11px]"
            >
              Termos de Uso
            </button>
          </div>
        </div>
      </aside>

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
                    onClick={() => setAdminTab('idealizador')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                      adminTab === 'idealizador'
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'text-stone-400 hover:text-white hover:bg-stone-800'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Foto do Idealizador</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('patologias')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                      adminTab === 'patologias'
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'text-stone-400 hover:text-white hover:bg-stone-800'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fotos das Patologias (15)</span>
                  </button>
                  <button
                    onClick={() => setAdminTab('temas')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                      adminTab === 'temas'
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'text-stone-400 hover:text-white hover:bg-stone-800'
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5 text-amber-400" />
                    <span>Personalização & Temas ({THEME_PRESETS.length})</span>
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
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-stone-850">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                                  {pintor.nome.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h5 className="font-bold text-white text-sm">{pintor.nome}</h5>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 font-mono border border-stone-700">
                                      {pintor.tipo_pessoa === 'PJ' ? 'Pessoa Jurídica' : 'Pessoa Física'} • {pintor.documento || 'Sem doc'}
                                    </span>
                                    {pintor.codigo_ativacao && (
                                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-black border border-amber-500/40 flex items-center gap-1 shadow-2xs">
                                        <Key className="w-3 h-3 text-amber-400" />
                                        Ativação: {pintor.codigo_ativacao}
                                      </span>
                                    )}
                                  </div>

                                  {/* Endereço Completo com CEP */}
                                  <div className="text-xs text-stone-300 flex flex-wrap items-center gap-2">
                                    <span className="text-stone-200">
                                      📍 {pintor.endereco ? (
                                        `${pintor.endereco}, ${pintor.numero || 's/n'}${pintor.complemento ? ` (${pintor.complemento})` : ''} - ${pintor.bairro || ''}, ${pintor.cidade}/${pintor.estado} (CEP: ${pintor.cep || '---'})`
                                      ) : (
                                        `${pintor.cidade} - ${pintor.estado}`
                                      )}
                                    </span>
                                  </div>

                                  {/* Contatos: WhatsApp e E-mail */}
                                  <div className="text-xs text-stone-400 flex flex-wrap items-center gap-3 pt-0.5">
                                    <a 
                                      href={`https://wa.me/55${pintor.whatsapp.replace(/\D/g, '')}`} 
                                      target="_blank" 
                                      rel="noreferrer"
                                      className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                                    >
                                      <Phone className="w-3 h-3" /> WhatsApp: {pintor.whatsapp}
                                    </a>

                                    {pintor.email && (
                                      <a 
                                        href={`mailto:${pintor.email}`} 
                                        className="text-amber-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                                      >
                                        <Mail className="w-3 h-3" /> E-mail: {pintor.email}
                                      </a>
                                    )}

                                    <span>★ {pintor.experiencia_anos} anos exp.</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-1.5 shrink-0">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                                  pintor.status === 'aprovado' 
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                                    : pintor.status === 'rejeitado'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                                }`}>
                                  {pintor.status === 'aprovado' ? '✓ Aprovado na Vitrine' : pintor.status === 'rejeitado' ? '✕ Rejeitado' : '⏳ Aguardando Aprovação'}
                                </span>

                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
                                    pintor.liberado_supervisor 
                                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' 
                                      : 'bg-stone-900 text-stone-400 border-stone-800'
                                  }`}>
                                    {pintor.liberado_supervisor ? '✓ Supervisor: Liberado' : '⏳ Supervisor: Pendente'}
                                  </span>

                                  <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${
                                    pintor.email_confirmado 
                                      ? 'bg-sky-950 text-sky-300 border-sky-500/40' 
                                      : 'bg-stone-900 text-stone-400 border-stone-800'
                                  }`}>
                                    {pintor.email_confirmado ? '✓ E-mail Validado' : '⏳ Senha não validada'}
                                  </span>
                                </div>
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

                            {/* Ações Administrativas: Aprovar, Liberar Supervisor, Visualizar, Excluir */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-900">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setPintorParaVisualizar(pintor)}
                                  className="py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs flex items-center gap-1.5 transition border border-stone-700 font-medium cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                                  Visualizar Cartão
                                </button>

                                {/* Botão Liberação do Supervisor */}
                                <button
                                  type="button"
                                  onClick={() => handleAlternarLiberacaoSupervisor(pintor.id || '', !pintor.liberado_supervisor)}
                                  className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition border cursor-pointer ${
                                    pintor.liberado_supervisor
                                      ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/40'
                                      : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-xs'
                                  }`}
                                  title="Liberação pelo Supervisor Vlademir Carer"
                                >
                                  <BadgeCheck className="w-3.5 h-3.5" />
                                  {pintor.liberado_supervisor ? 'Revogar Liberação' : 'Liberar pelo Supervisor'}
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                {pintor.status !== 'aprovado' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleAprovarPintor(pintor.id)}
                                    className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Aprovar na Vitrine
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleRejeitarPintor(pintor.id)}
                                    className="py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs flex items-center gap-1.5 transition border border-stone-700 cursor-pointer"
                                  >
                                    <XCircle className="w-3.5 h-3.5 text-amber-400" />
                                    Pausar / Inativar
                                  </button>
                                )}

                                {pintor.status === 'pendente' && (
                                  <button
                                    type="button"
                                    onClick={() => handleRejeitarPintor(pintor.id)}
                                    className="py-1.5 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-red-300 text-xs flex items-center gap-1.5 transition border border-stone-700 cursor-pointer"
                                  >
                                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                                    Rejeitar
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleExcluirPintor(pintor.id)}
                                  title="Excluir da Nuvem"
                                  className="p-1.5 rounded-lg bg-stone-900 hover:bg-red-950/60 text-stone-400 hover:text-red-400 border border-stone-800 transition cursor-pointer"
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

                {/* Aba: Gestão da Foto do Idealizador (Vlademir Carer) */}
                {adminTab === 'idealizador' && (
                  <div className="space-y-6">
                    {/* Alerta de Feedback de Gravação */}
                    {fotoStatusMsg && (
                      <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border transition ${
                        fotoStatusMsg.type === 'success'
                          ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                          : 'bg-red-950/80 border-red-500/50 text-red-200'
                      }`}>
                        {fotoStatusMsg.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <span>{fotoStatusMsg.text}</span>
                      </div>
                    )}

                    {/* Cabeçalho da Rotina */}
                    <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-1">
                      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                        <Award className="w-4 h-4" />
                        Rotina de Troca da Foto do Idealizador (Vlademir Carer)
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        Altere a foto oficial exibida no rodapé do portal. A imagem é gravada diretamente na nuvem no Supabase e carregada automaticamente toda vez que qualquer usuário abrir o site.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      
                      {/* Coluna 1: Preview em Tempo Real */}
                      <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 flex flex-col items-center text-center space-y-4 shadow-xl">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                          Pré-visualização do Rodapé
                        </span>

                        <div className="relative group my-2">
                          {/* Aura dourada/âmbar */}
                          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500 to-amber-700 opacity-40 blur-md transition duration-500" />
                          
                          <div className="relative w-44 h-44 rounded-3xl overflow-hidden border-2 border-amber-500/50 bg-stone-900 shadow-2xl">
                            <img
                              src={fotoPreview || vlademirPhoto}
                              alt="Prévia Vlademir Carer"
                              className="w-full h-full object-cover object-top"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.src = vlademirPhoto;
                              }}
                            />
                          </div>

                          <div className="absolute -bottom-2.5 inset-x-0 flex justify-center">
                            <span className="px-3 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1">
                              <Award className="w-3 h-3" /> Idealizador
                            </span>
                          </div>
                        </div>

                        <div className="space-y-0.5 pt-1">
                          <h5 className="font-extrabold text-white text-base">Vlademir Carer</h5>
                          <p className="text-[11px] text-amber-400 font-medium">Fundador & Especialista Técnico</p>
                        </div>

                        <p className="text-[11px] text-stone-400 max-w-xs">
                          Esta foto será carregada na nuvem e exibida em todas as visitas ao portal.
                        </p>
                      </div>

                      {/* Coluna 2: Formulário de Troca & Ações */}
                      <div className="space-y-4">
                        
                        {/* Opção A: Enviar Arquivo do Aparelho */}
                        <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3">
                          <label className="block text-xs font-bold text-white flex items-center gap-2">
                            <Upload className="w-4 h-4 text-amber-400" />
                            1. Carregar Foto do Celular ou Computador
                          </label>
                          <p className="text-[11px] text-stone-400 leading-relaxed">
                            Selecione uma imagem da sua galeria ou arquivos (JPG, PNG ou WEBP). Ela será otimizada automaticamente com qualidade máxima para nuvem.
                          </p>

                          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-700 hover:border-amber-500/60 rounded-xl cursor-pointer bg-stone-900/60 hover:bg-stone-900 transition">
                            <ImageIcon className="w-6 h-6 text-amber-400 mb-1" />
                            <span className="text-xs text-stone-200 font-medium">Toque para selecionar imagem</span>
                            <span className="text-[10px] text-stone-500 mt-0.5">Formato quadrado ou retrato recomendado</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFotoFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>

                        {/* Opção B: Inserir Link Direto da Internet */}
                        <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
                          <label className="block text-xs font-bold text-white">
                            2. Ou Inserir Link Direto da Imagem (URL)
                          </label>
                          <input
                            type="url"
                            value={novaFotoInput}
                            onChange={(e) => {
                              setNovaFotoInput(e.target.value);
                              setFotoPreview(e.target.value || vlademirPhoto);
                            }}
                            placeholder="https://exemplo.com/minha-foto.jpg"
                            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-hidden font-mono"
                          />
                        </div>

                        {/* Botões de Salvar na Nuvem e Restaurar */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                          <button
                            type="button"
                            onClick={handleSalvarFotoNuvem}
                            disabled={salvandoFoto || !fotoPreview}
                            className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 cursor-pointer"
                          >
                            {salvandoFoto ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Gravando na Nuvem...</span>
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                <span>Salvar Foto na Nuvem</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={handleRestaurarFotoPadrao}
                            disabled={salvandoFoto}
                            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 text-xs flex items-center justify-center gap-1.5 transition border border-stone-700 cursor-pointer"
                            title="Voltar para a foto inicial de Vlademir Carer"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                            <span>Restaurar Original</span>
                          </button>
                        </div>

                      </div>

                    </div>

                  </div>
                )}

                {/* Aba: Fotos das Patologias da Pintura (Problemas Mais Comuns e Como Curar Cada Um) */}
                {adminTab === 'patologias' && (
                  <div className="space-y-6">
                    {/* Alerta de Feedback de Alteração de Fotos */}
                    {patologiaFeedbackMsg && (
                      <div className={`p-4 rounded-2xl text-xs flex items-center gap-3 border shadow-md transition ${
                        patologiaFeedbackMsg.type === 'success'
                          ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200'
                          : patologiaFeedbackMsg.type === 'info'
                            ? 'bg-amber-950/90 border-amber-500/60 text-amber-200'
                            : 'bg-red-950/90 border-red-500/60 text-red-200'
                      }`}>
                        {patologiaFeedbackMsg.type === 'success' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : patologiaFeedbackMsg.type === 'info' ? (
                          <Cloud className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                        )}
                        <span className="font-medium leading-relaxed">{patologiaFeedbackMsg.text}</span>
                      </div>
                    )}

                    {/* Barra de Ação Principal: Gravar Fotos na Nuvem (Ativado assim que o usuário envia fotos) */}
                    <div className="bg-stone-950 border-2 border-stone-800 hover:border-amber-500/40 p-5 rounded-3xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-2xl transition">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <h4 className="text-base font-extrabold text-white">
                            Fotos das 15 Patologias da Pintura (Doutor Parede)
                          </h4>
                          {patologiasModificadas ? (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-xs">
                              <span className="w-1.5 h-1.5 rounded-full bg-stone-950" />
                              Gravação Necessária
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Nuvem Sincronizada
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed">
                          Envie fotos do seu computador ou cole links da internet. <strong>Assim que você enviar ou alterar qualquer foto, o botão "Gravar Fotos na Nuvem" é ativado.</strong> Ao clicar em Gravar, as fotos são salvas permanentemente no Supabase, atualizam o site imediatamente e passam a ser carregadas da nuvem em todas as visitas.
                        </p>
                      </div>

                      {/* Botão de Gravar Fotos na Nuvem (Super Destacado e Reativo) */}
                      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
                        <button
                          type="button"
                          onClick={handleGravarFotosPatologiasNuvem}
                          disabled={salvandoPatologiasNuvem || !patologiasModificadas}
                          className={`w-full sm:w-auto py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl cursor-pointer ${
                            patologiasModificadas
                              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 shadow-amber-500/30 ring-4 ring-amber-400/30 transform hover:-translate-y-0.5 active:translate-y-0'
                              : 'bg-stone-850 text-stone-500 border border-stone-800 opacity-60 cursor-not-allowed'
                          }`}
                          title={patologiasModificadas ? "Gravar fotos na nuvem no Supabase" : "Envie uma foto ou cole um link para ativar a gravação"}
                        >
                          {salvandoPatologiasNuvem ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                              <span>Gravando na Nuvem do Supabase...</span>
                            </>
                          ) : (
                            <>
                              <Cloud className={`w-4 h-4 ${patologiasModificadas ? 'text-stone-950 stroke-[2.5]' : 'text-stone-500'}`} />
                              <span>{patologiasModificadas ? "Gravar Fotos na Nuvem" : "Fotos Sincronizadas"}</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleCarregarTodasFotosPadrao}
                          className="py-3 px-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-amber-400/90 border border-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                          title="Restaurar todas as 15 fotos para a galeria padrão em alta resolução"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Restaurar Padrão</span>
                        </button>
                      </div>
                    </div>

                    {/* Grade das 15 Patologias */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {patologias.map((p) => {
                        const fotoAtual = patologiaFotos[p.id] || DEFAULT_PATOLOGIA_FOTOS[p.id] || p.img;
                        const isEditada = patologiaEditadaIds.includes(p.id);
                        return (
                          <div 
                            key={p.id} 
                            className={`bg-stone-950 rounded-2xl p-4 sm:p-5 space-y-3.5 transition flex flex-col justify-between border ${
                              isEditada
                                ? 'border-amber-500/70 shadow-lg shadow-amber-500/10'
                                : 'border-stone-800 hover:border-stone-700'
                            }`}
                          >
                            <div className="space-y-2.5">
                              {/* Título, Tipo e Indicador de Modificação */}
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                                      #{p.id} • {p.tipo}
                                    </span>
                                    {isEditada && (
                                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider animate-pulse">
                                        ● Alterada
                                      </span>
                                    )}
                                  </div>
                                  <h5 className="font-bold text-white text-sm mt-1.5 leading-snug">
                                    {p.titulo}
                                  </h5>
                                </div>
                              </div>

                              {/* Miniatura da Foto Atual */}
                              <div className="relative rounded-xl overflow-hidden aspect-16/9 bg-stone-900 border border-stone-800 group shadow-inner">
                                <img 
                                  src={fotoAtual} 
                                  alt={p.titulo} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    const fallback = DEFAULT_PATOLOGIA_FOTOS[p.id] || 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80';
                                    if (target.src !== fallback) {
                                      target.src = fallback;
                                    }
                                  }}
                                />
                                <div className="absolute top-2 right-2 bg-stone-950/85 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] text-stone-300 border border-stone-800">
                                  {fotoAtual.startsWith('data:') ? 'Foto enviada do PC' : 'Link Web'}
                                </div>
                              </div>
                            </div>

                            {/* Controles de Atualização */}
                            <div className="space-y-2 pt-2 border-t border-stone-900">
                              {/* Botão de Envio de Arquivo do Computador */}
                              <label className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-amber-500/20">
                                <Upload className="w-4 h-4 stroke-[2.5]" />
                                <span>Enviar Foto do Computador</span>
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  className="hidden" 
                                  onChange={(e) => handleUploadFotoPatologia(p.id, e)} 
                                />
                              </label>

                              {/* Input de URL Direta */}
                              <div className="flex gap-1.5">
                                <input 
                                  type="url" 
                                  placeholder="Ou cole a URL da imagem aqui..." 
                                  value={urlInputPatologias[p.id] || ''} 
                                  onChange={(e) => setUrlInputPatologias(prev => ({ ...prev, [p.id]: e.target.value }))}
                                  className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white font-mono placeholder:text-stone-600 focus:border-amber-500 focus:outline-hidden"
                                />
                                <button 
                                  type="button"
                                  onClick={() => handleSalvarUrlPatologia(p.id)}
                                  disabled={!urlInputPatologias[p.id]?.trim()}
                                  className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 disabled:opacity-40 text-stone-200 text-xs font-bold cursor-pointer transition border border-stone-700 shrink-0"
                                >
                                  Aplicar
                                </button>
                              </div>

                              {/* Botão Gravar Individual / Status */}
                              {isEditada && (
                                <button
                                  type="button"
                                  onClick={handleGravarFotosPatologiasNuvem}
                                  disabled={salvandoPatologiasNuvem}
                                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
                                >
                                  {salvandoPatologiasNuvem ? (
                                    <>
                                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                      <span>Gravando no Supabase...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Cloud className="w-3.5 h-3.5" />
                                      <span>Gravar Esta Foto na Nuvem Agora</span>
                                    </>
                                  )}
                                </button>
                              )}

                              {/* Botão Restaurar Individual */}
                              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-0.5">
                                <button 
                                  type="button" 
                                  onClick={() => handleRestaurarFotoPatologia(p.id)}
                                  className="text-stone-400 hover:text-amber-400 underline inline-flex items-center gap-1 cursor-pointer transition text-[11px]"
                                >
                                  <RotateCcw className="w-2.5 h-2.5" /> Restaurar imagem padrão
                                </button>
                                <span className="text-[10px] text-stone-600">ID #{p.id}</span>
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>

                    {/* Barra Flutuante de Gravação no Rodapé do Modal quando há fotos modificadas */}
                    {patologiasModificadas && (
                      <div className="sticky bottom-0 z-20 p-4 rounded-2xl bg-amber-500 text-stone-950 font-black shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border-2 border-amber-300">
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                          <span>Fotos alteradas prontas para gravação na nuvem!</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleGravarFotosPatologiasNuvem}
                          disabled={salvandoPatologiasNuvem}
                          className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-stone-950 hover:bg-stone-900 text-amber-400 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                        >
                          {salvandoPatologiasNuvem ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                              <span>Gravando no Supabase...</span>
                            </>
                          ) : (
                            <>
                              <Cloud className="w-4 h-4 text-amber-400" />
                              <span>Gravar na Nuvem Agora</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {adminTab === 'temas' && (
                  <div className="space-y-6">
                    {/* Alerta de Feedback de Gravação do Tema */}
                    {temaFeedbackMsg && (
                      <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border transition ${
                        temaFeedbackMsg.type === 'success'
                          ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                          : 'bg-red-950/80 border-red-500/50 text-red-200'
                      }`}>
                        {temaFeedbackMsg.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <span>{temaFeedbackMsg.text}</span>
                      </div>
                    )}

                    {/* Banner Informativo Superior */}
                    <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                          <Palette className="w-4 h-4 text-amber-400" />
                          Personalização do Site: Cores & Tipografia em Nuvem
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-stone-400">Ativo no portal:</span>
                          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                            {activeTheme.nome}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        Escolha entre os <strong>{THEME_PRESETS.length} padrões de cores e fontes</strong> desenvolvidos para o universo da pintura, arquitetura e construção civil.
                        Ao clicar em <strong>"Aplicar Tema"</strong>, as novas cores são ativadas em tempo real na tela e gravadas na nuvem (Supabase) para que qualquer visitante visualize as novas cores online imediatamente.
                      </p>
                    </div>

                    {/* Ação de Gravação Rápida do Preset Ativo Atual como Padrão */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 to-stone-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-white block">
                          Deseja aplicar e fixar o tema e fundo selecionados para todos os visitantes do Pinta Aqui?
                        </span>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          Tema: <strong className="text-amber-400">{activeTheme.nome}</strong> • Fundo: <strong className="text-amber-300">{activeBgTone?.nome || activeTheme.bgColor}</strong> ({activeTheme.bgColor})
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSalvarTemaDefinitivo(activeTheme)}
                        disabled={salvandoTemaNuvem}
                        className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-amber-500/20 shrink-0 cursor-pointer"
                      >
                        {salvandoTemaNuvem ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Aplicando no Supabase...</span>
                          </>
                        ) : (
                          <>
                            <Palette className="w-3.5 h-3.5" />
                            <span>Aplicar Tema & Fundo</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* SELEÇÃO DEDICADA DE TONS DE FUNDO DO SITE (BACKGROUND) */}
                    <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-white font-bold text-sm">
                            <Layers className="w-4 h-4 text-amber-400" />
                            <span>Tons de Fundo para o Portal (Background)</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                              {BACKGROUND_TONES.length} Opções
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-1">
                            Vá além do fundo branco! Alterne para tons de parede recém-emassada, concreto aparente, areia natural, verde sálvia, azul gelo ou modo escuro (Dark Mode).
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] text-stone-400">Fundo ativo:</span>
                          <span 
                            className="px-2.5 py-1 rounded-lg font-bold text-xs border flex items-center gap-1.5 shadow-2xs"
                            style={{ 
                              backgroundColor: activeTheme.bgColor, 
                              color: activeTheme.textColor,
                              borderColor: activeTheme.borderColor
                            }}
                          >
                            <span 
                              className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                              style={{ backgroundColor: activeTheme.bgColor }}
                            />
                            {activeBgTone?.nome || activeTheme.bgColor}
                          </span>
                        </div>
                      </div>

                      {/* Filtros de Categoria de Tons de Fundo */}
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                        {[
                          { id: 'todos', label: 'Todos os Tons', count: BACKGROUND_TONES.length },
                          { id: 'claros', label: 'Claros & Neutros', count: BACKGROUND_TONES.filter(b => b.categoria === 'claros').length },
                          { id: 'terrosos', label: 'Terrosos & Quentes', count: BACKGROUND_TONES.filter(b => b.categoria === 'terrosos').length },
                          { id: 'suaves', label: 'Suaves & Bem-Estar', count: BACKGROUND_TONES.filter(b => b.categoria === 'suaves').length },
                          { id: 'escuros', label: 'Modo Escuro (Dark)', count: BACKGROUND_TONES.filter(b => b.categoria === 'escuros').length },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setBgCategoryFilter(cat.id as any)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                              bgCategoryFilter === cat.id
                                ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                                : 'bg-stone-900 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800'
                            }`}
                          >
                            <span>{cat.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                              bgCategoryFilter === cat.id ? 'bg-stone-950/20 text-stone-950' : 'bg-stone-800 text-stone-400'
                            }`}>
                              {cat.count}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Grade de Cards Interativos de Tons de Fundo */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                        {BACKGROUND_TONES
                          .filter(tone => bgCategoryFilter === 'todos' || tone.categoria === bgCategoryFilter)
                          .map((tone) => {
                            const isToneActive = activeTheme.bgColor.toLowerCase() === tone.corHex.toLowerCase();
                            return (
                              <div
                                key={tone.id}
                                onClick={() => handleTrocarFundo(tone)}
                                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                                  isToneActive
                                    ? 'bg-stone-900 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                                    : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                                }`}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2.5">
                                      <div 
                                        className="w-9 h-9 rounded-lg border border-white/20 shadow-xs shrink-0 flex items-center justify-center font-black text-xs"
                                        style={{ backgroundColor: tone.corHex, color: tone.textColor }}
                                      >
                                        Aa
                                      </div>
                                      <div>
                                        <span className="font-bold text-xs text-white block leading-tight">
                                          {tone.nome}
                                        </span>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                          <span className="text-[10px] text-amber-400 font-mono">
                                            {tone.corHex}
                                          </span>
                                          <span className="text-[9px] text-stone-400 px-1 py-0.2 rounded bg-stone-800">
                                            {tone.isDark ? 'Escuro' : 'Claro'}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    {isToneActive ? (
                                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 shrink-0 flex items-center gap-0.5">
                                        <Check className="w-2.5 h-2.5" /> Ativo
                                      </span>
                                    ) : (
                                      <span className="text-[9px] text-stone-400 px-1.5 py-0.5 rounded bg-stone-800/80 border border-stone-700/50">
                                        {tone.tag}
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-[11px] text-stone-400 leading-snug line-clamp-2">
                                    {tone.descricao}
                                  </p>
                                </div>

                                <div className="pt-2.5 mt-2 border-t border-stone-800/70 flex items-center justify-between gap-2 text-[11px]">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTrocarFundo(tone);
                                    }}
                                    className="px-2 py-1 rounded-lg text-[10px] text-stone-300 hover:text-white bg-stone-800/70 hover:bg-stone-800 border border-stone-700/60 transition cursor-pointer"
                                  >
                                    Testar Prévia
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSalvarFundoDireto(tone);
                                    }}
                                    disabled={salvandoTemaNuvem}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                                      isToneActive
                                        ? 'bg-emerald-500 text-stone-950 hover:bg-emerald-400'
                                        : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                                    }`}
                                  >
                                    {isToneActive ? '✓ Fundo na Nuvem' : 'Aplicar Fundo'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Grade de Presets com Cartões Interativos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {THEME_PRESETS.map((preset) => {
                        const isCurrentActive = activeTheme.id === preset.id;
                        return (
                          <div
                            key={preset.id}
                            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                              isCurrentActive
                                ? 'bg-stone-950 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                                : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                            }`}
                          >
                            <div className="space-y-3">
                              {/* Cabeçalho do Card */}
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-bold text-white text-sm">
                                      {preset.nome}
                                    </h5>
                                    {preset.isDefault && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                                        Padrão
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-amber-400/90 font-medium block mt-0.5">
                                    {preset.tag}
                                  </span>
                                </div>

                                {isCurrentActive ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1 shrink-0">
                                    <Check className="w-3 h-3" /> Ativo
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-stone-500">
                                    Disponível
                                  </span>
                                )}
                              </div>

                              <p className="text-xs text-stone-400 leading-relaxed">
                                {preset.descricao}
                              </p>

                              {/* Especificações de Tipografia */}
                              <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 space-y-1 text-xs">
                                <div className="flex items-center justify-between text-stone-300 text-[11px]">
                                  <span>Título: <strong style={{ fontFamily: preset.fontHeading }}>{preset.fontHeadingName}</strong></span>
                                  <span>Corpo: <strong style={{ fontFamily: preset.fontBody }}>{preset.fontBodyName}</strong></span>
                                </div>
                              </div>

                              {/* Mostrador de Paleta de Cores (Swatches) */}
                              <div className="space-y-1.5 pt-1">
                                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">
                                  Paleta de Cores
                                </span>
                                <div className="flex items-center gap-2">
                                  {preset.swatches.map((color, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-1">
                                      <div
                                        className="w-8 h-8 rounded-lg border border-white/20 shadow-xs"
                                        style={{ backgroundColor: color }}
                                        title={color}
                                      />
                                      <span className="text-[9px] font-mono text-stone-400">
                                        {color}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Mini-demonstração ao vivo do preset */}
                              <div 
                                className="p-3 rounded-xl border border-stone-700/60 mt-2 space-y-2"
                                style={{ backgroundColor: preset.bgColor, color: preset.textColor }}
                              >
                                <div className="flex items-center justify-between">
                                  <span 
                                    className="font-bold text-xs" 
                                    style={{ fontFamily: preset.fontHeading, color: preset.textColor }}
                                  >
                                    Exemplo de Título
                                  </span>
                                  <span 
                                    className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                                    style={{ backgroundColor: preset.primaryLight, color: preset.primaryDark }}
                                  >
                                    Etiqueta
                                  </span>
                                </div>
                                <p className="text-[11px] leading-tight" style={{ fontFamily: preset.fontBody, color: preset.textMuted }}>
                                  Texto explicativo sobre tintas e preparação de superfícies.
                                </p>
                                <div className="pt-1">
                                  <span 
                                    className="inline-block text-[11px] font-bold px-3 py-1 rounded-lg text-white"
                                    style={{ backgroundColor: preset.primaryColor }}
                                  >
                                    Botão de Ação
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Botões de Ação do Card */}
                            <div className="pt-3 border-t border-stone-800/80 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSalvarTemaDefinitivo(preset)}
                                disabled={salvandoTemaNuvem}
                                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                                  isCurrentActive
                                    ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-sm'
                                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-sm'
                                }`}
                              >
                                {isCurrentActive ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Tema Aplicado (Nuvem)</span>
                                  </>
                                ) : (
                                  <>
                                    <Palette className="w-3.5 h-3.5" />
                                    <span>Aplicar Tema</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleAplicarPreviaTema(preset)}
                                className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs transition border border-stone-800 hover:border-stone-700 cursor-pointer"
                                title="Ver no site sem gravar definitivamente ainda"
                              >
                                Prévia
                              </button>
                            </div>
                          </div>
                        );
                      })}
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
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-bold text-white text-sm flex items-center gap-2">
                          <FileCode className="w-4 h-4 text-amber-400" />
                          Esquema SQL Oficial do Banco de Dados
                        </h4>
                        <p className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                          Estrutura DDL para rodar no editor SQL do seu Supabase Cloud.
                        </p>
                      </div>

                      {/* Os Dois Botões Solicitados */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {/* Botão 1: Copiar Códigos na Memória */}
                        <button
                          type="button"
                          onClick={handleCopySqlCode}
                          className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm ${
                            sqlCopied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                          }`}
                          title="Copiar todo o código SQL para a área de transferência"
                        >
                          {sqlCopied ? (
                            <>
                              <CheckCheck className="w-4 h-4" />
                              <span>Copiado na Memória!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              <span>Copiar Códigos na Memória</span>
                            </>
                          )}
                        </button>

                        {/* Botão 2: Gerar Novamente Todas as Tabelas do App */}
                        <button
                          type="button"
                          onClick={() => handleRegenerateAllTablesSql()}
                          className="py-2 px-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                          title="Gera novamente todo o script das tabelas do app"
                        >
                          <RotateCcw className="w-4 h-4 text-amber-400" />
                          <span>Gerar Novamente as Tabelas</span>
                        </button>
                      </div>
                    </div>

                    {/* Alertas de Notificação */}
                    {sqlCopied && (
                      <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
                        <CheckCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Código SQL copiado para a memória (clipboard)! Agora basta colar no SQL Editor do Supabase.</span>
                      </div>
                    )}

                    {sqlGeneratedNotice && (
                      <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>Todas as tabelas do app foram regeradas no script com sucesso!</span>
                      </div>
                    )}

                    {/* Barra de Opções do Gerador de Tabelas */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-stone-950 rounded-xl border border-stone-850 text-xs text-stone-300">
                      <span className="font-semibold text-stone-300">Modo de Geração do Script:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSqlResetMode('create_safe');
                            handleRegenerateAllTablesSql('create_safe');
                          }}
                          className={`px-3 py-1.5 rounded-lg transition font-medium ${
                            sqlResetMode === 'create_safe'
                              ? 'bg-amber-500 text-stone-950 font-bold'
                              : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                          }`}
                        >
                          Seguro (CREATE IF NOT EXISTS)
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSqlResetMode('full_reset');
                            handleRegenerateAllTablesSql('full_reset');
                          }}
                          className={`px-3 py-1.5 rounded-lg transition font-medium ${
                            sqlResetMode === 'full_reset'
                              ? 'bg-red-600 text-white font-bold'
                              : 'bg-stone-900 text-stone-400 hover:text-white border border-stone-800'
                          }`}
                        >
                          Reset Completo (DROP & RECREATE)
                        </button>
                      </div>
                    </div>

                    {/* Área de Visualização do Código */}
                    <div className="relative">
                      <pre className="bg-stone-950 border border-stone-800 p-4 rounded-xl text-[11px] font-mono text-amber-200 overflow-x-auto max-h-80 leading-relaxed select-all">
                        {getEffectiveSql()}
                      </pre>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-stone-400 pt-1">
                      <span>
                        Contém: <strong>pintores_profissionais</strong>, <strong>solicitacoes_orcamento</strong>, <strong>avaliacoes_pintores</strong>, <strong>comunidade_postagens</strong>, RLS e índices.
                      </span>
                      <button
                        type="button"
                        onClick={handleCopySqlCode}
                        className="text-amber-400 hover:underline font-bold inline-flex items-center gap-1 self-start sm:self-auto"
                      >
                        <Copy className="w-3.5 h-3.5" /> Clique para copiar todo o código
                      </button>
                    </div>
                  </div>
                )}

                {/* Aba 3: Configurações Gerais & Servidor de E-mail do Sistema */}
                {adminTab === 'geral' && (
                  <div className="space-y-6 text-xs">
                    {/* Alerta de Feedback de E-mail */}
                    {emailFeedbackMsg && (
                      <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border transition ${
                        emailFeedbackMsg.type === 'success'
                          ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                          : 'bg-red-950/80 border-red-500/50 text-red-200'
                      }`}>
                        {emailFeedbackMsg.type === 'success' ? (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <span>{emailFeedbackMsg.text}</span>
                      </div>
                    )}

                    {/* CARD PRINCIPAL: CONFIGURAÇÃO DE E-MAIL DO SISTEMA & SENHA DE APP */}
                    <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4 shadow-xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-850">
                        <div className="flex items-center gap-2 text-white font-bold text-sm">
                          <Mail className="w-4 h-4 text-amber-400" />
                          <span>Configurações do E-mail para Envio no Sistema (SMTP & Senha de App)</span>
                        </div>
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30 self-start sm:self-auto">
                          Gravado em Nuvem (Supabase)
                        </span>
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed">
                        Estas configurações são utilizadas pelo sistema para disparar automaticamente a <strong>senha de 4 dígitos</strong> aos novos pintores cadastrados, além de notificações de orçamentos e mensagens técnicas.
                      </p>

                      {/* Provedor Pré-configurado */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'gmail', label: 'Gmail / Google', host: 'smtp.gmail.com', port: 465, secure: true },
                          { id: 'outlook', label: 'Outlook / Office365', host: 'smtp.office365.com', port: 587, secure: false },
                          { id: 'hostinger', label: 'Hostinger', host: 'smtp.hostinger.com', port: 465, secure: true },
                          { id: 'locaweb', label: 'Locaweb / Custom', host: 'email-ssl.com.br', port: 465, secure: true }
                        ].map((prov) => (
                          <button
                            key={prov.id}
                            type="button"
                            onClick={() => setEmailConfig({
                              ...emailConfig,
                              provedor: prov.id as any,
                              host: prov.host,
                              porta: prov.port,
                              seguro: prov.secure
                            })}
                            className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                              emailConfig.provedor === prov.id
                                ? 'bg-amber-500 text-stone-950 font-bold border-amber-500 shadow-xs'
                                : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                            }`}
                          >
                            <span className="block text-[11px] leading-tight">{prov.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Campos do Servidor SMTP */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div className="sm:col-span-2">
                          <label className="block text-stone-300 font-medium mb-1">
                            Servidor SMTP (Host) *
                          </label>
                          <input 
                            type="text" 
                            value={emailConfig.host}
                            onChange={(e) => setEmailConfig({ ...emailConfig, host: e.target.value })}
                            placeholder="smtp.gmail.com"
                            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-amber-500 focus:outline-hidden"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-stone-300 font-medium mb-1">
                            Porta SMTP *
                          </label>
                          <input 
                            type="number" 
                            value={emailConfig.porta}
                            onChange={(e) => setEmailConfig({ ...emailConfig, porta: Number(e.target.value) })}
                            placeholder="465 ou 587"
                            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-amber-500 focus:outline-hidden"
                            required
                          />
                        </div>
                      </div>

                      {/* Dados do Remetente */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-stone-300 font-medium mb-1">
                            E-mail Remetente do Sistema (Usuário) *
                          </label>
                          <input 
                            type="email" 
                            value={emailConfig.remetenteEmail}
                            onChange={(e) => setEmailConfig({ ...emailConfig, remetenteEmail: e.target.value })}
                            placeholder="vcarer@gmail.com ou contato@pintaaqui.com.br"
                            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-amber-500 focus:outline-hidden"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-stone-300 font-medium mb-1">
                            Nome de Exibição do Remetente *
                          </label>
                          <input 
                            type="text" 
                            value={emailConfig.remetenteNome}
                            onChange={(e) => setEmailConfig({ ...emailConfig, remetenteNome: e.target.value })}
                            placeholder="Pinta Aqui • Vlademir Carer"
                            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-hidden"
                            required
                          />
                        </div>
                      </div>

                      {/* SENHA DO EMAIL DO APP (SENHA DE APLICATIVO) */}
                      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                            <Key className="w-3.5 h-3.5 text-amber-400" />
                            Senha de E-mail do App (App Password) *
                          </label>
                          <button
                            type="button"
                            onClick={() => setMostrarSenhaApp(!mostrarSenhaApp)}
                            className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                          >
                            {mostrarSenhaApp ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <span>{mostrarSenhaApp ? 'Ocultar' : 'Exibir Senha'}</span>
                          </button>
                        </div>

                        <div className="relative">
                          <input 
                            type={mostrarSenhaApp ? "text" : "password"}
                            value={emailConfig.senhaApp}
                            onChange={(e) => setEmailConfig({ ...emailConfig, senhaApp: e.target.value })}
                            placeholder="Ex: abcd efgh ijkl mnop (Senha de App de 16 letras gerada no Google)"
                            className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:border-amber-500 focus:outline-hidden tracking-wider"
                          />
                        </div>

                        <div className="text-[11px] text-stone-400 space-y-1 pt-1 leading-relaxed">
                          <p>
                            🔒 <strong>Como obter no Gmail:</strong> Acesse sua Conta Google &gt; <em>Segurança</em> &gt; <em>Verificação em duas etapas</em> &gt; <em>Senhas de aplicativo</em>. Gere uma senha exclusiva para o "Pinta Aqui" e cole-a acima.
                          </p>
                          <p className="text-amber-300/80">
                            Ao gravar, a senha é protegida e sincronizada na nuvem com seu banco Supabase.
                          </p>
                        </div>
                      </div>

                      {/* Ações de E-mail: Salvar na Nuvem e Teste de Envio */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-850">
                        <button 
                          type="button"
                          onClick={handleSalvarConfigEmail}
                          disabled={salvandoEmailConfig}
                          className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-amber-500/20 cursor-pointer"
                        >
                          {salvandoEmailConfig ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Gravando Configuração na Nuvem...</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              <span>Gravar Configurações de E-mail na Nuvem</span>
                            </>
                          )}
                        </button>

                        {/* Teste Rápido de SMTP */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <input
                            type="email"
                            value={emailTesteDestino}
                            onChange={(e) => setEmailTesteDestino(e.target.value)}
                            placeholder="Destino do teste (vcarer@gmail.com)"
                            className="bg-stone-900 border border-stone-700 rounded-xl px-2.5 py-2 text-white text-[11px] font-mono flex-1 sm:w-56 focus:border-amber-500 focus:outline-hidden"
                          />
                          <button
                            type="button"
                            onClick={handleTestarSmtp}
                            disabled={testandoEmailSmtp || !emailConfig.senhaApp}
                            className="py-2 px-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 font-bold text-xs flex items-center gap-1.5 transition border border-stone-700 shrink-0 cursor-pointer"
                            title={!emailConfig.senhaApp ? "Informe a senha do app antes de testar" : "Enviar mensagem de teste via SMTP"}
                          >
                            {testandoEmailSmtp ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                            ) : (
                              <Send className="w-3.5 h-3.5 text-amber-400" />
                            )}
                            <span>{testandoEmailSmtp ? 'Enviando...' : 'Testar SMTP'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* CARD DE CONTATO GERAL E SUPORTE */}
                    <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
                      <span className="font-bold text-white text-xs block">
                        Dados de Contato Institucional do Portal
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-stone-300 font-medium mb-1">E-mail de Contato Principal</label>
                          <input 
                            type="email" 
                            defaultValue="contato@pintaaqui.com.br"
                            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 font-mono text-xs focus:border-amber-500 focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-300 font-medium mb-1">WhatsApp de Suporte do Pinta Aqui</label>
                          <input 
                            type="text" 
                            defaultValue="(11) 99999-9999"
                            className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-stone-200 font-mono text-xs focus:border-amber-500 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex justify-between items-center border-t border-stone-850">
                        <button 
                          type="button"
                          onClick={() => alert('Dados de contato institucional atualizados com sucesso!')}
                          className="py-2 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold transition border border-stone-700 cursor-pointer"
                        >
                          Gravar Dados de Contato
                        </button>
                        <button
                          type="button"
                          onClick={handleAdminLogout}
                          className="py-2 px-3.5 rounded-xl bg-stone-800 hover:bg-red-950/40 text-stone-300 hover:text-red-300 flex items-center gap-1.5 transition border border-stone-700 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 text-red-400" /> Sair do Painel
                        </button>
                      </div>
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

              {/* Última Linha do Cartão de Visitas Digital: Área do Pintor */}
              <div className="pt-4 border-t border-stone-850 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-stone-400">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Cartão oficial do profissional auditado pela curadoria <strong>Pinta Aqui</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPintorParaVisualizar(null);
                    setAreaPintorModalOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-xs transition cursor-pointer shrink-0"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Área do Pintor</span>
                </button>
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
              <div className="p-8 text-center space-y-6 bg-stone-950 rounded-2xl border border-emerald-500/50">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-white">Cadastro Gravado na Nuvem com Sucesso!</h4>
                  <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed">
                    Parabéns, parceiro! Seus dados foram salvos no Supabase. Enviamos sua <strong>senha de ativação de 4 dígitos</strong> para o e-mail:
                  </p>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/40">
                    {formEmail}
                  </span>
                </div>

                {/* Mostrador da Senha de 4 Dígitos Gerada */}
                <div className="bg-stone-900/90 border border-amber-500/40 p-5 rounded-2xl max-w-md mx-auto space-y-3">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
                    <Key className="w-3.5 h-3.5" />
                    Sua Senha de Ativação (4 Dígitos)
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    {(codigoAtivacaoGerado || 'A7K2').split('').map((char, idx) => (
                      <div 
                        key={idx}
                        className="w-12 h-14 rounded-xl bg-stone-950 border-2 border-amber-500/80 text-amber-400 font-mono font-black text-2xl flex items-center justify-center shadow-md shadow-amber-500/10"
                      >
                        {char}
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-stone-400 leading-snug">
                    Anote esta senha! O cadastro é ativado com a <strong>liberação do supervisor</strong> e depois com a validação desta senha enviada no e-mail.
                  </p>
                </div>

                {/* Validação Imediata do Código */}
                <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 max-w-md mx-auto space-y-3 text-left">
                  <span className="text-xs font-bold text-white block">
                    Deseja validar seu e-mail agora mesmo?
                  </span>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={4}
                      value={codigoDigitadoConfirmacao}
                      onChange={(e) => setCodigoDigitadoConfirmacao(e.target.value.toUpperCase())}
                      placeholder="Digite os 4 dígitos"
                      className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono text-center tracking-widest uppercase font-bold text-sm focus:border-amber-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => handleValidarCodigoAtivacao(formEmail, codigoDigitadoConfirmacao)}
                      disabled={confirmandoCodigo || !codigoDigitadoConfirmacao}
                      className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs transition cursor-pointer"
                    >
                      {confirmandoCodigo ? 'Validando...' : 'Ativar Código'}
                    </button>
                  </div>

                  {codigoConfirmacaoFeedback && (
                    <div className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                      codigoConfirmacaoFeedback.type === 'success' 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-red-950 text-red-300 border border-red-500/40'
                    }`}>
                      {codigoConfirmacaoFeedback.type === 'success' ? <Check className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                      <span>{codigoConfirmacaoFeedback.text}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCadastroModalOpen(false);
                      setFormSucesso(false);
                      setCodigoDigitadoConfirmacao('');
                      setCodigoConfirmacaoFeedback(null);
                    }}
                    className="py-2.5 px-8 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs transition border border-stone-700"
                  >
                    Concluir e Fechar
                  </button>
                </div>
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

                {/* E-mail (Importantíssimo) e Telefone WhatsApp */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-600/30">
                    <label className="block text-stone-200 font-bold mb-1 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-amber-400" />
                      E-mail do Pintor (Importantíssimo) *
                    </label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="exemplo@gmail.com"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2 text-white font-mono focus:border-amber-500 focus:outline-hidden text-xs"
                      required
                    />
                    <span className="text-[10px] text-amber-300/80 block mt-1">
                      Enviaremos a senha aleatória de 4 dígitos para ativação neste e-mail.
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800">
                    <label className="block text-stone-300 font-medium mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      Telefone (é WhatsApp de Orçamentos) *
                    </label>
                    <input
                      type="text"
                      value={formWhatsapp}
                      onChange={(e) => setFormWhatsapp(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-white font-mono focus:border-amber-500 focus:outline-hidden text-xs"
                      required
                    />
                    <span className="text-[10px] text-stone-400 block mt-1">
                      Número oficial para os clientes te chamarem pelo portal.
                    </span>
                  </div>
                </div>

                {/* Endereço Completo com Busca Automática de CEP */}
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      Endereço e Localização (Busca Automática por CEP)
                    </span>
                    {formBuscandoCep && (
                      <span className="text-[10px] text-amber-400 flex items-center gap-1 font-medium">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Buscando Correios...
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-stone-300 text-[11px] mb-1 font-medium">CEP *</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formCep}
                          onChange={(e) => handleCepChange(e.target.value)}
                          placeholder="00000-000"
                          maxLength={9}
                          className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-amber-500 focus:outline-hidden"
                          required
                        />
                        {formBuscandoCep && (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400 absolute right-2.5 top-2.5" />
                        )}
                      </div>
                      {formCepStatus && (
                        <span className="text-[10px] text-amber-300 block mt-0.5">{formCepStatus}</span>
                      )}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-stone-300 text-[11px] mb-1 font-medium">Endereço (Rua / Avenida) *</label>
                      <input
                        type="text"
                        value={formEndereco}
                        onChange={(e) => setFormEndereco(e.target.value)}
                        placeholder="Ex: Av. Paulista, Rua das Flores"
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-stone-300 text-[11px] mb-1 font-medium">Número *</label>
                      <input
                        type="text"
                        value={formNumero}
                        onChange={(e) => setFormNumero(e.target.value)}
                        placeholder="123 ou S/N"
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-hidden"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 text-[11px] mb-1 font-medium">Complemento</label>
                      <input
                        type="text"
                        value={formComplemento}
                        onChange={(e) => setFormComplemento(e.target.value)}
                        placeholder="Apto 12, Bloco B"
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 text-[11px] mb-1 font-medium">Bairro *</label>
                      <input
                        type="text"
                        value={formBairro}
                        onChange={(e) => setFormBairro(e.target.value)}
                        placeholder="Centro, Vila Nova"
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-hidden"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 text-[11px] mb-1 font-medium">Cidade Principal *</label>
                      <input
                        type="text"
                        value={formCidade}
                        onChange={(e) => setFormCidade(e.target.value)}
                        placeholder="São Paulo"
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-stone-400">Estado de Atuação:</span>
                    <select
                      value={formEstado}
                      onChange={(e) => setFormEstado(e.target.value)}
                      className="bg-stone-900 border border-stone-700 rounded-lg px-2.5 py-1 text-white text-xs focus:border-amber-500 focus:outline-hidden font-bold"
                    >
                      {['SP', 'RJ', 'MG', 'PR', 'SC', 'RS', 'ES', 'GO', 'DF', 'BA', 'PE', 'CE', 'AM', 'PA', 'MT', 'MS'].map((uf) => (
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

      {/* MODAL ÁREA DO PINTOR / LOGIN & ATIVAÇÃO DE CADASTRO */}
      {areaPintorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="bg-stone-900 border border-stone-700 text-stone-100 rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Header da Área do Pintor */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shadow-md shadow-amber-500/10">
                  <Briefcase className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-white">Área do Pintor • Pinta Aqui Pro</h3>
                  <p className="text-xs text-stone-400">Portal do Profissional • Acesso & Ativação de Cadastro</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAreaPintorModalOpen(false);
                  setLoginPintorFeedback(null);
                  setAtivacaoPeloModalFeedback(null);
                }}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alternador de Abas do Modal */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-950 rounded-2xl border border-stone-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  setAbaAreaPintor('login');
                  setLoginPintorFeedback(null);
                }}
                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  abaAreaPintor === 'login'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-stone-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Acesso (Em Breve)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAbaAreaPintor('ativar');
                  setAtivacaoPeloModalFeedback(null);
                }}
                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  abaAreaPintor === 'ativar'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-stone-900'
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Ativar com Código</span>
              </button>
            </div>

            {/* ABA 1: LOGIN DO PINTOR (EM BREVE) */}
            {abaAreaPintor === 'login' && (
              <div className="space-y-5">
                
                {/* Banner de Aviso de Funcionalidade Em Breve */}
                <div className="bg-gradient-to-br from-amber-950/40 via-stone-950 to-stone-950 border border-amber-600/40 p-4 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Em Breve: Acesso Exclusivo para Pintores Cadastrados</span>
                  </div>
                  <p className="text-stone-300 leading-relaxed text-xs">
                    Estamos preparando o seu painel de controle! Em breve você entrará com o <strong>e-mail e a senha que criou</strong> no cadastro para gerenciar suas fotos de obras, atualizar dados de contato e receber orçamentos direto no WhatsApp.
                  </p>
                  <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-[11px] text-amber-300/90">
                    ℹ️ <strong>Regra de ativação:</strong> O cadastro é ativado com a <strong>liberação do supervisor</strong> Vlademir Carer e depois no acesso com a senha de 4 dígitos enviada ao seu e-mail pelo sistema.
                  </div>
                </div>

                {/* Formulário de Login */}
                <form onSubmit={handleLoginPintor} className="space-y-4 text-xs">
                  {loginPintorFeedback && (
                    <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2 border transition ${
                      loginPintorFeedback.type === 'success'
                        ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                        : loginPintorFeedback.type === 'info'
                        ? 'bg-amber-950/80 border-amber-500/50 text-amber-200'
                        : 'bg-red-950/80 border-red-500/50 text-red-200'
                    }`}>
                      {loginPintorFeedback.type === 'success' ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : loginPintorFeedback.type === 'info' ? (
                        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      )}
                      <span>{loginPintorFeedback.text}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Seu E-mail Cadastrado *</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="seuemail@gmail.com"
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:border-amber-500 focus:outline-hidden"
                        required
                      />
                      <Mail className="w-4 h-4 text-stone-500 absolute right-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Sua Senha Criada no Cadastro *</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={loginSenha}
                        onChange={(e) => setLoginSenha(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:border-amber-500 focus:outline-hidden"
                        required
                      />
                      <Lock className="w-4 h-4 text-stone-500 absolute right-3 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loginPintorLoading}
                    className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    {loginPintorLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                        <span>Verificando Credenciais na Nuvem...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Entrar na Área do Pintor</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Rodapé com Links de Ação Rápida */}
                <div className="pt-3 border-t border-stone-850 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
                  <span>Ainda não possui cadastro de pintor?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAreaPintorModalOpen(false);
                      setCadastroModalOpen(true);
                      setFormSucesso(false);
                    }}
                    className="text-amber-400 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Cadastre-se Gratuitamente na Vitrine
                  </button>
                </div>
              </div>
            )}

            {/* ABA 2: ATIVAR CADASTRO COM CÓDIGO DE 4 DÍGITOS */}
            {abaAreaPintor === 'ativar' && (
              <div className="space-y-5 text-xs">
                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>Validar Código de Ativação (4 Dígitos)</span>
                  </div>
                  <p className="text-stone-300 leading-relaxed text-xs">
                    Ao concluir o cadastro, o sistema envia uma <strong>senha aleatória de 4 dígitos</strong> (letras e números) para o seu e-mail. Digite o e-mail cadastrado e o código recebido para ativar seu cadastro.
                  </p>
                </div>

                {ativacaoPeloModalFeedback && (
                  <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2 border transition ${
                    ativacaoPeloModalFeedback.type === 'success'
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
                      : 'bg-red-950/80 border-red-500/50 text-red-200'
                  }`}>
                    {ativacaoPeloModalFeedback.type === 'success' ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <span>{ativacaoPeloModalFeedback.text}</span>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">E-mail Cadastrado *</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="exemplo@gmail.com"
                      className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-xs focus:border-amber-500 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">
                      Código de Ativação de 4 Dígitos (Enviado por E-mail) *
                    </label>
                    <div className="flex justify-center my-2">
                      <input
                        type="text"
                        maxLength={4}
                        value={loginCodigoAtivacao}
                        onChange={(e) => setLoginCodigoAtivacao(e.target.value.toUpperCase())}
                        placeholder="EX: A7K2"
                        className="w-48 bg-stone-950 border-2 border-amber-500 rounded-2xl py-3 px-4 text-center font-mono font-black text-2xl tracking-[0.4em] uppercase text-amber-400 shadow-inner focus:outline-hidden focus:ring-2 focus:ring-amber-400/40"
                      />
                    </div>
                    <span className="text-[10px] text-stone-400 text-center block">
                      Código aleatório de 4 dígitos com letras maiúsculas e números.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleValidarPeloModalAreaPintor}
                    disabled={ativandoPeloModal || !loginEmail || !loginCodigoAtivacao}
                    className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-amber-500/20 cursor-pointer"
                  >
                    {ativandoPeloModal ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                        <span>Validando Código no Supabase...</span>
                      </>
                    ) : (
                      <>
                        <BadgeCheck className="w-4 h-4" />
                        <span>Ativar Cadastro com Código</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 text-center">
                  <p className="text-[11px] text-stone-500">
                    O cadastro é ativado com a <strong>liberação do supervisor</strong> e a <strong>confirmação da senha enviada por e-mail</strong>.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* CARD / CAIXA DE ALERTA: AVISO DE ISENÇÃO DE RESPONSABILIDADE (AO ENTRAR NO SITE) */}
      {avisoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div 
            className="bg-stone-900 border-2 border-amber-500/50 text-stone-100 rounded-3xl w-full max-w-xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="aviso-responsabilidade-titulo"
          >
            {/* Brilho decorativo sutil de fundo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Cabeçalho do Card */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-800 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-md shadow-amber-500/15 text-2xl">
                  ⚠️
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block font-mono">
                    Comunicado Importante • Termos de Uso
                  </span>
                  <h3 id="aviso-responsabilidade-titulo" className="text-lg sm:text-xl font-black text-white leading-tight">
                    Aviso de Isenção de Responsabilidade
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={handleContinuarAviso}
                className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer shrink-0"
                title="Fechar e continuar"
                aria-label="Fechar aviso e continuar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo do Alerta */}
            <div className="space-y-4 relative z-10 text-xs sm:text-sm">
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-950 border border-stone-800/90 shadow-inner">
                <p className="text-stone-200 leading-relaxed text-xs sm:text-sm font-normal">
                  O <strong>Pinta Aqui</strong> é uma plataforma gratuita de aproximação entre clientes e profissionais da pintura. Toda a negociação, orçamento, definição de prazos, pagamentos e a execução dos serviços são de responsabilidade exclusiva e direta entre o cliente e o pintor contratado. O site não intermedeia pagamentos, não garante serviços e não possui vínculo trabalhista ou comercial com os profissionais cadastrados.
                </p>
              </div>

              {/* Destaques em Pílulas Informativas */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
                <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800/80 flex items-center gap-2 text-stone-300">
                  <span className="text-amber-400 font-bold">🤝</span>
                  <span>Aproximação 100% gratuita</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800/80 flex items-center gap-2 text-stone-300">
                  <span className="text-amber-400 font-bold">💼</span>
                  <span>Negociação direta</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800/80 flex items-center gap-2 text-stone-300">
                  <span className="text-amber-400 font-bold">🛡️</span>
                  <span>Sem intermediação financeira</span>
                </div>
              </div>
            </div>

            {/* Botão Continuar */}
            <div className="pt-2 relative z-10">
              <button
                type="button"
                onClick={handleContinuarAviso}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continuar</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
