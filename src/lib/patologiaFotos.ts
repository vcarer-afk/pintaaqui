/**
 * Gerenciador e Presets de Fotos das Patologias da Pintura (Doutor Parede)
 */

export interface PatologiaFotoItem {
  id: number;
  titulo: string;
  tipo: string;
  defaultImg: string;
}

export const DEFAULT_PATOLOGIA_FOTOS: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=800&q=80", // Bolhas na Parede
  2: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80", // Descascamento ou Desplacamento
  3: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80", // Mofo e Bolor
  4: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=800&q=80", // Eflorescência
  5: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", // Saponificação
  6: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", // Calcinação ou Gizamento
  7: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80", // Manchas de Chuva
  8: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80", // Fissuras e Microtrincas
  9: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80", // Absorção Desigual
  10: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80", // Enrugamento
  11: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80", // Sangramento de Manchas
  12: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80", // Crateras e Olhos de Peixe
  13: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80", // Marcas de Rolo
  14: "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80", // Amarelamento
  15: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80", // Desbotamento Precoce
};

const STORAGE_KEY = 'pintaaqui_patologia_fotos';

export function carregarFotosPatologiasSalvas(): Record<number, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return { ...DEFAULT_PATOLOGIA_FOTOS, ...parsed };
      }
    }
  } catch (err) {
    console.error('Erro ao ler fotos de patologias do localStorage:', err);
  }
  return { ...DEFAULT_PATOLOGIA_FOTOS };
}

export function salvarFotosPatologiasLocal(fotos: Record<number, string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fotos));
  } catch (err) {
    console.error('Erro ao salvar fotos de patologias no localStorage:', err);
  }
}
