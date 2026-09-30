/**
 * Presets de Cores e Fontes Oficiais do Pinta Aqui
 * Permite personalização visual completa do site pelo painel administrativo
 * e gravação direta no banco de dados na nuvem (Supabase).
 */

export interface ThemePreset {
  id: string;
  nome: string;
  tag: string;
  descricao: string;
  isDefault?: boolean;
  
  // Fontes
  fontHeading: string;
  fontHeadingName: string;
  fontBody: string;
  fontBodyName: string;

  // Cores principais
  primaryColor: string;      // Cor de botões e destaques principais (ex: #EA580C)
  primaryHover: string;      // Cor de hover do botão primário
  primaryLight: string;      // Fundo suave de badge (ex: #FFF7ED)
  primaryDark: string;       // Texto de badge (ex: #C2410C)
  
  secondaryColor: string;    // Cor secundária/técnica (ex: #004B8D)
  secondaryHover: string;
  secondaryLight: string;
  
  bgColor: string;           // Fundo neutro do portal (ex: #F8FAFC)
  bgCard: string;            // Fundo dos cartões (ex: #FFFFFF)
  textColor: string;         // Cor do texto principal (ex: #1E293B)
  textMuted: string;         // Cor do texto de apoio (ex: #64748B)
  
  headerBg: string;          // Fundo do cabeçalho
  footerBg: string;          // Fundo do rodapé
  borderColor: string;       // Borda sutil de cartões
  
  // Cores para exibição de mostruário no painel
  swatches: string[];
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'padrao-pinta-aqui',
    nome: 'Padrão Pinta Aqui (Parede Emassada & Obra)',
    tag: 'Padrão Oficial',
    descricao: 'A identidade visual original e equilibrada: fundo suave que valoriza fotos, laranja vibrante de obra (#EA580C) e azul técnico de engenharia (#004B8D).',
    isDefault: true,
    fontHeading: "'Poppins', sans-serif",
    fontHeadingName: 'Poppins',
    fontBody: "'Plus Jakarta Sans', sans-serif",
    fontBodyName: 'Plus Jakarta Sans',
    primaryColor: '#EA580C',
    primaryHover: '#C2410C',
    primaryLight: '#FFF7ED',
    primaryDark: '#9A3412',
    secondaryColor: '#004B8D',
    secondaryHover: '#003B6F',
    secondaryLight: '#EFF6FF',
    bgColor: '#F8FAFC',
    bgCard: '#FFFFFF',
    textColor: '#1E293B',
    textMuted: '#64748B',
    headerBg: 'rgba(255, 255, 255, 0.95)',
    footerBg: '#0F172A',
    borderColor: '#E2E8F0',
    swatches: ['#EA580C', '#004B8D', '#F8FAFC', '#1E293B']
  },
  {
    id: 'azul-engenharia',
    nome: 'Azul Técnico & Confiança (Engenharia & Indústria)',
    tag: 'Corporativo & Técnico',
    descricao: 'Tom sóbrio e imponente de azul marinho com azul céu técnico, ideal para orçamentos de engenharia, laudos prediais e obras corporativas.',
    fontHeading: "'Montserrat', sans-serif",
    fontHeadingName: 'Montserrat',
    fontBody: "'Inter', sans-serif",
    fontBodyName: 'Inter',
    primaryColor: '#1D4ED8',
    primaryHover: '#1E40AF',
    primaryLight: '#EFF6FF',
    primaryDark: '#1E3A8A',
    secondaryColor: '#0284C7',
    secondaryHover: '#0369A1',
    secondaryLight: '#F0F9FF',
    bgColor: '#F8FAFC',
    bgCard: '#FFFFFF',
    textColor: '#0F172A',
    textMuted: '#64748B',
    headerBg: 'rgba(255, 255, 255, 0.96)',
    footerBg: '#0F172A',
    borderColor: '#E2E8F0',
    swatches: ['#1D4ED8', '#0284C7', '#F0F9FF', '#0F172A']
  },
  {
    id: 'terracota-argila',
    nome: 'Terracota Artesanal & Areia Natural',
    tag: 'Ambientes Acolhedores',
    descricao: 'Inspirado em pigmentos naturais de terra, argila cozida e paredes de cal mediterrâneas, criando um ambiente quente e convidativo.',
    fontHeading: "'Outfit', sans-serif",
    fontHeadingName: 'Outfit',
    fontBody: "'Plus Jakarta Sans', sans-serif",
    fontBodyName: 'Plus Jakarta Sans',
    primaryColor: '#C2410C',
    primaryHover: '#9A3412',
    primaryLight: '#FFF7ED',
    primaryDark: '#7C2D12',
    secondaryColor: '#B45309',
    secondaryHover: '#92400E',
    secondaryLight: '#FEF3C7',
    bgColor: '#FAF8F5',
    bgCard: '#FFFFFF',
    textColor: '#292524',
    textMuted: '#78716C',
    headerBg: 'rgba(255, 255, 255, 0.96)',
    footerBg: '#1C1917',
    borderColor: '#E7E5E4',
    swatches: ['#C2410C', '#B45309', '#FAF8F5', '#292524']
  },
  {
    id: 'verde-botanico',
    nome: 'Verde Botânico & Linha Ecológica',
    tag: 'Sustentabilidade & Frescor',
    descricao: 'Focado em tintas ecológicas sem cheiro (Zero VOC), bem-estar para famílias e crianças, com notas de verde esmeralda e sálvia suave.',
    fontHeading: "'Outfit', sans-serif",
    fontHeadingName: 'Outfit',
    fontBody: "'Inter', sans-serif",
    fontBodyName: 'Inter',
    primaryColor: '#059669',
    primaryHover: '#047857',
    primaryLight: '#ECFDF5',
    primaryDark: '#065F46',
    secondaryColor: '#0D9488',
    secondaryHover: '#0F766E',
    secondaryLight: '#F0FDFA',
    bgColor: '#F4F9F6',
    bgCard: '#FFFFFF',
    textColor: '#134E4A',
    textMuted: '#52796F',
    headerBg: 'rgba(255, 255, 255, 0.96)',
    footerBg: '#064E3B',
    borderColor: '#D1FAE5',
    swatches: ['#059669', '#0D9488', '#F4F9F6', '#134E4A']
  },
  {
    id: 'cimento-urbano',
    nome: 'Cimento Queimado & Loft Industrial',
    tag: 'Minimalismo Urbano',
    descricao: 'Inspirado no estilo brutalista contemporâneo: acabamento cimento queimado, aço escovado e laranja de segurança para contraste moderno.',
    fontHeading: "'Space Grotesk', sans-serif",
    fontHeadingName: 'Space Grotesk',
    fontBody: "'Inter', sans-serif",
    fontBodyName: 'Inter',
    primaryColor: '#334155',
    primaryHover: '#1E293B',
    primaryLight: '#F1F5F9',
    primaryDark: '#0F172A',
    secondaryColor: '#EA580C',
    secondaryHover: '#C2410C',
    secondaryLight: '#FFF7ED',
    bgColor: '#F1F5F9',
    bgCard: '#FFFFFF',
    textColor: '#0F172A',
    textMuted: '#64748B',
    headerBg: 'rgba(255, 255, 255, 0.95)',
    footerBg: '#0F172A',
    borderColor: '#CBD5E1',
    swatches: ['#334155', '#EA580C', '#F1F5F9', '#0F172A']
  },
  {
    id: 'marmorato-nobre',
    nome: 'Marmorato Imperial & Palácio Clássico',
    tag: 'Alto Padrão & Boiserie',
    descricao: 'Estética clássica de alto padrão para ambientes com sancas, boiserie e marmorato polido com brilho vitrificado e detalhes em âmbar dourado.',
    fontHeading: "'Playfair Display', serif",
    fontHeadingName: 'Playfair Display',
    fontBody: "'Plus Jakarta Sans', sans-serif",
    fontBodyName: 'Plus Jakarta Sans',
    primaryColor: '#0F172A',
    primaryHover: '#020617',
    primaryLight: '#F8FAFC',
    primaryDark: '#020617',
    secondaryColor: '#D97706',
    secondaryHover: '#B45309',
    secondaryLight: '#FEF3C7',
    bgColor: '#FAFAF9',
    bgCard: '#FFFFFF',
    textColor: '#1C1917',
    textMuted: '#78716C',
    headerBg: 'rgba(255, 255, 255, 0.97)',
    footerBg: '#0F172A',
    borderColor: '#E7E5E4',
    swatches: ['#0F172A', '#D97706', '#FAFAF9', '#1C1917']
  },
  {
    id: 'solar-arquitetura',
    nome: 'Ocre Solar & Iluminação Natural',
    tag: 'Luz & Vivacidade',
    descricao: 'Inspirado na luz do meio-dia sobre fachadas texturizadas, com tons calorosos de ocre solar e coral para ambientes radiantes e alegres.',
    fontHeading: "'Poppins', sans-serif",
    fontHeadingName: 'Poppins',
    fontBody: "'Plus Jakarta Sans', sans-serif",
    fontBodyName: 'Plus Jakarta Sans',
    primaryColor: '#D97706',
    primaryHover: '#B45309',
    primaryLight: '#FFFBEB',
    primaryDark: '#92400E',
    secondaryColor: '#E11D48',
    secondaryHover: '#BE123C',
    secondaryLight: '#FFF1F2',
    bgColor: '#FFFDF5',
    bgCard: '#FFFFFF',
    textColor: '#1E293B',
    textMuted: '#64748B',
    headerBg: 'rgba(255, 255, 255, 0.96)',
    footerBg: '#1E1B4B',
    borderColor: '#FEF3C7',
    swatches: ['#D97706', '#E11D48', '#FFFDF5', '#1E293B']
  },
  {
    id: 'minimalista-clean',
    nome: 'Minimalista Puro & Alto Contraste',
    tag: 'Pureza & Foco Total',
    descricao: 'Preto puro sobre branco límpido com toques de azul cobalto: estética editorial ultra limpa com foco absoluto na leitura e portfólio.',
    fontHeading: "'Inter', sans-serif",
    fontHeadingName: 'Inter',
    fontBody: "'Inter', sans-serif",
    fontBodyName: 'Inter',
    primaryColor: '#09090B',
    primaryHover: '#27272A',
    primaryLight: '#F4F4F5',
    primaryDark: '#09090B',
    secondaryColor: '#2563EB',
    secondaryHover: '#1D4ED8',
    secondaryLight: '#EFF6FF',
    bgColor: '#FFFFFF',
    bgCard: '#FFFFFF',
    textColor: '#09090B',
    textMuted: '#71717A',
    headerBg: 'rgba(255, 255, 255, 0.98)',
    footerBg: '#09090B',
    borderColor: '#E4E4E7',
    swatches: ['#09090B', '#2563EB', '#FFFFFF', '#71717A']
  }
];

export function getPresetById(id?: string): ThemePreset {
  if (!id) return THEME_PRESETS[0];
  const found = THEME_PRESETS.find(p => p.id === id);
  return found || THEME_PRESETS[0];
}

/**
 * Aplica as propriedades CSS personalizadas do tema diretamente no elemento raiz do documento.
 */
export function applyThemeToDom(preset: ThemePreset): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.style.setProperty('--color-theme-primary', preset.primaryColor);
  root.style.setProperty('--color-theme-primary-hover', preset.primaryHover);
  root.style.setProperty('--color-theme-primary-light', preset.primaryLight);
  root.style.setProperty('--color-theme-primary-dark', preset.primaryDark);

  root.style.setProperty('--color-theme-secondary', preset.secondaryColor);
  root.style.setProperty('--color-theme-secondary-hover', preset.secondaryHover);
  root.style.setProperty('--color-theme-secondary-light', preset.secondaryLight);

  root.style.setProperty('--color-theme-bg', preset.bgColor);
  root.style.setProperty('--color-theme-card', preset.bgCard);
  root.style.setProperty('--color-theme-text', preset.textColor);
  root.style.setProperty('--color-theme-text-muted', preset.textMuted);
  root.style.setProperty('--color-theme-border', preset.borderColor);

  root.style.setProperty('--font-theme-heading', preset.fontHeading);
  root.style.setProperty('--font-theme-body', preset.fontBody);

  // Também ajusta o body diretamente
  document.body.style.backgroundColor = preset.bgColor;
  document.body.style.color = preset.textColor;
  document.body.style.fontFamily = preset.fontBody;
}
