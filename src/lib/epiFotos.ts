/**
 * Gerenciador e Presets de Fotos dos EPIs de Segurança na Pintura
 * Cadastrável via Painel Administrativo e persistido no LocalStorage / Supabase Nuvem
 */

export interface EpiFotoItem {
  id: number;
  slug: string;
  titulo: string;
  categoria: string;
  emoji: string;
  defaultImg: string;
}

export const LISTA_EPIS_CONFIG: EpiFotoItem[] = [
  {
    id: 1,
    slug: 'respirador_pff2',
    titulo: 'Respirador PFF2 / N95 (Poeira de Lixamento)',
    categoria: 'Poeira Fina & Partículas',
    emoji: '😷',
    defaultImg: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    slug: 'mascara_quimica',
    titulo: 'Semimáscara com Filtro para Vapores Orgânicos (VO)',
    categoria: 'Vapores Químicos & Solventes',
    emoji: '☣️',
    defaultImg: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    slug: 'oculos_protecao',
    titulo: 'Óculos de Ampla Visão Antiembaçante',
    categoria: 'Olhos & Visão',
    emoji: '🥽',
    defaultImg: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    slug: 'luvas_nitrilicas',
    titulo: 'Luvas Nitrílicas & Luvas de Tato (PU)',
    categoria: 'Mãos & Pele',
    emoji: '🧤',
    defaultImg: 'https://images.unsplash.com/photo-1584744982635-43a9b311fc91?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    slug: 'calcado_seguranca',
    titulo: 'Botina de Segurança Antiderrapante',
    categoria: 'Estabilidade & Quedas',
    emoji: '🥾',
    defaultImg: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    slug: 'protetor_auricular',
    titulo: 'Protetor Auricular (Plug de Silicone / Concha)',
    categoria: 'Audição & Ruído',
    emoji: '🎧',
    defaultImg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
  },
];

export const DEFAULT_EPI_FOTOS: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=800&q=80',
  2: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=800&q=80',
  3: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80',
  4: 'https://images.unsplash.com/photo-1584744982635-43a9b311fc91?auto=format&fit=crop&w=800&q=80',
  5: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  6: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
};

const STORAGE_KEY_EPIS = 'pintaaqui_epis_fotos';

export function carregarFotosEpisSalvas(): Record<number, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EPIS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return { ...DEFAULT_EPI_FOTOS, ...parsed };
      }
    }
  } catch (err) {
    console.error('Erro ao ler fotos de EPIs do localStorage:', err);
  }
  return { ...DEFAULT_EPI_FOTOS };
}

export function salvarFotosEpisLocal(fotos: Record<number, string>): void {
  try {
    localStorage.setItem(STORAGE_KEY_EPIS, JSON.stringify(fotos));
  } catch (err) {
    console.error('Erro ao salvar fotos de EPIs no localStorage:', err);
  }
}
