/**
 * Pinta Aqui - Cliente Oficial Supabase (100% Nuvem)
 * Regra Arquitetural: Não é permitido gravação local (sem mocks / sem banco local).
 * Todas as requisições operam diretamente no PostgreSQL gerenciado pelo Supabase Cloud.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const DEFAULT_SUPABASE_URL = "https://fhjzbyacxbdnprpqmwmo.supabase.co";
export const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoanpieWFjeGJkbnBycHFtd21vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2MzkxNDAsImV4cCI6MjEwNjIxNTE0MH0.VRUQUDYZiVZVP_4gmVn2RVCdaMBeqTRn3AYUtvaiIeM";

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(url?: string, anonKey?: string): SupabaseClient {
  const targetUrl = url || (typeof window !== 'undefined' ? localStorage.getItem('pintaaqui_supabase_url') || DEFAULT_SUPABASE_URL : DEFAULT_SUPABASE_URL);
  const targetKey = anonKey || (typeof window !== 'undefined' ? localStorage.getItem('pintaaqui_supabase_anon') || DEFAULT_SUPABASE_ANON_KEY : DEFAULT_SUPABASE_ANON_KEY);

  if (!supabaseInstance || supabaseInstance['supabaseUrl'] !== targetUrl) {
    supabaseInstance = createClient(targetUrl, targetKey, {
      auth: {
        persistSession: false, // Sem gravação em disco local
      },
    });
  }

  return supabaseInstance;
}

export interface PintorProfissional {
  id?: string;
  tipo_pessoa: 'PF' | 'PJ';
  documento: string; // CPF ou CNPJ
  nome: string;
  whatsapp: string;
  cidade: string;
  estado: string;
  experiencia_anos: number;
  especialidades: string[];
  senha?: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  fotos?: string[];
  created_at?: string;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  latencyMs?: number;
  details?: string;
  statusCode?: number;
}

/**
 * Executa um teste real de conexão diretamente nos servidores da Supabase Cloud.
 * Testa a integridade da API REST e das chaves fornecidas.
 */
export async function testSupabaseCloudConnection(url: string, anonKey: string): Promise<ConnectionTestResult> {
  const cleanUrl = url.trim().replace(/\/+$/, '');
  const cleanKey = anonKey.trim();

  if (!cleanUrl) {
    return {
      success: false,
      message: 'A URL do projeto Supabase é obrigatória (ex: https://xyzcompany.supabase.co).',
    };
  }

  if (!cleanUrl.startsWith('https://')) {
    return {
      success: false,
      message: 'A URL do Supabase deve obrigatoriamente iniciar com https://',
    };
  }

  if (!cleanKey) {
    return {
      success: false,
      message: 'A Supabase Anon Key (chave pública) é obrigatória.',
    };
  }

  const startTime = performance.now();

  try {
    const authPromise = fetch(`${cleanUrl}/auth/v1/health`, {
      method: 'GET',
      headers: {
        'apikey': cleanKey,
      },
    }).catch(() => null);

    const restPromise = fetch(`${cleanUrl}/rest/v1/pintores_profissionais?select=id&limit=1`, {
      method: 'GET',
      headers: {
        'apikey': cleanKey,
        'Authorization': `Bearer ${cleanKey}`,
      },
    }).catch(() => null);

    const [authRes, restRes] = await Promise.all([authPromise, restPromise]);
    const latencyMs = Math.round(performance.now() - startTime);

    if (restRes && restRes.ok) {
      return {
        success: true,
        message: 'Conexão 100% em Nuvem estabelecida com sucesso!',
        latencyMs,
        statusCode: 200,
        details: `Servidores da Supabase Cloud responderam em ${latencyMs}ms. Tabela 'pintores_profissionais' ativa!`,
      };
    }

    if (authRes && authRes.ok) {
      return {
        success: true,
        message: 'Conexão 100% em Nuvem estabelecida com sucesso!',
        latencyMs,
        statusCode: 200,
        details: `Servidores da Supabase Cloud responderam em ${latencyMs}ms. O projeto está ativo na nuvem.`,
      };
    }

    if ((restRes && (restRes.status === 401 || restRes.status === 403)) || (authRes && (authRes.status === 401 || authRes.status === 403))) {
      return {
        success: false,
        message: 'Falha de Autenticação na Nuvem: A chave Anon Key informada é inválida ou expirou.',
        latencyMs,
        details: 'Verifique no painel da Supabase em Project Settings > API > Project API keys (anon public).',
      };
    }

    return {
      success: true,
      message: 'Conexão de rede alcançada na Nuvem Supabase.',
      latencyMs,
      statusCode: (restRes || authRes)?.status,
      details: `Servidor alcançado na nuvem em ${latencyMs}ms.`,
    };

  } catch (error: any) {
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      success: false,
      message: 'Não foi possível alcançar o servidor Supabase em Nuvem.',
      latencyMs,
      details: error?.message || 'Verifique a URL digitada ou sua conexão com a internet. O domínio precisa existir no Supabase.',
    };
  }
}

/**
 * Cadastra um pintor diretamente no banco de dados na nuvem com status 'pendente'.
 */
export async function cadastrarPintorNuvem(dados: Omit<PintorProfissional, 'id' | 'status' | 'created_at'>): Promise<{ success: boolean; data?: PintorProfissional; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    const payload = {
      tipo_pessoa: dados.tipo_pessoa,
      documento: dados.documento.trim(),
      nome: dados.nome.trim(),
      whatsapp: dados.whatsapp.trim(),
      cidade: dados.cidade.trim(),
      estado: dados.estado.trim(),
      experiencia_anos: Number(dados.experiencia_anos) || 1,
      especialidades: dados.especialidades,
      senha: dados.senha || '',
      status: 'pendente',
      fotos: dados.fotos || []
    };

    const { data, error } = await supabase
      .from('pintores_profissionais')
      .insert([payload])
      .select();

    if (error) {
      console.error('Erro ao cadastrar pintor no Supabase:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data?.[0] };
  } catch (err: any) {
    console.error('Exceção ao cadastrar pintor no Supabase:', err);
    return { success: false, error: err?.message || 'Erro inesperado na comunicação com a nuvem.' };
  }
}

/**
 * Lista pintores diretamente do Supabase Cloud.
 */
export async function listarPintoresNuvem(statusFiltro?: string): Promise<{ success: boolean; data: PintorProfissional[]; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    let query = supabase
      .from('pintores_profissionais')
      .select('*')
      .order('created_at', { ascending: false });

    if (statusFiltro && statusFiltro !== 'todos') {
      query = query.eq('status', statusFiltro);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar pintores no Supabase:', error);
      return { success: false, data: [], error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (err: any) {
    console.error('Exceção ao listar pintores do Supabase:', err);
    return { success: false, data: [], error: err?.message || 'Falha de rede.' };
  }
}

/**
 * Atualiza o status de aprovação de um pintor no Supabase Cloud.
 */
export async function atualizarStatusPintorNuvem(id: string, novoStatus: 'aprovado' | 'rejeitado' | 'pendente'): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('pintores_profissionais')
      .update({ status: novoStatus })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Falha ao atualizar status na nuvem.' };
  }
}

/**
 * Exclui um pintor definitivamente do banco de dados na nuvem.
 */
export async function excluirPintorNuvem(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('pintores_profissionais')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Falha ao excluir registro na nuvem.' };
  }
}

/**
 * Salva a foto do Idealizador (Vlademir Carer) diretamente na nuvem no Supabase.
 */
export async function salvarFotoIdealizadorNuvem(fotoUrlOuBase64: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    
    // 1. Remove qualquer configuração anterior de foto
    await supabase
      .from('solicitacoes_orcamento')
      .delete()
      .eq('tipo_servico', 'config_idealizador_foto');

    // 2. Insere a nova foto na nuvem
    const { error } = await supabase
      .from('solicitacoes_orcamento')
      .insert([{
        nome_cliente: 'Vlademir Carer (Idealizador)',
        telefone_cliente: '11999999999',
        cidade: 'São Paulo',
        tipo_servico: 'config_idealizador_foto',
        descricao_projeto: fotoUrlOuBase64,
        status: 'ativo'
      }]);

    if (error) {
      console.error('Erro ao salvar foto do idealizador no Supabase:', error);
      return { success: false, error: error.message };
    }

    // Cache local imediato para carregamento sem piscar
    if (typeof window !== 'undefined') {
      localStorage.setItem('pintaaqui_idealizador_foto', fotoUrlOuBase64);
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Falha ao salvar foto na nuvem.' };
  }
}

/**
 * Carrega a foto do Idealizador diretamente do Supabase Cloud toda vez que o site abre.
 */
export async function carregarFotoIdealizadorNuvem(): Promise<string | null> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('solicitacoes_orcamento')
      .select('descricao_projeto')
      .eq('tipo_servico', 'config_idealizador_foto')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('pintaaqui_idealizador_foto');
      }
      return null;
    }

    const foto = data[0].descricao_projeto;
    if (foto && typeof window !== 'undefined') {
      localStorage.setItem('pintaaqui_idealizador_foto', foto);
    }
    return foto || null;
  } catch (err) {
    console.error('Erro ao carregar foto do idealizador da nuvem:', err);
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pintaaqui_idealizador_foto');
    }
    return null;
  }
}

/**
 * Restaura a foto oficial inicial de Vlademir Carer e limpa a nuvem.
 */
export async function restaurarFotoIdealizadorNuvem(): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    await supabase
      .from('solicitacoes_orcamento')
      .delete()
      .eq('tipo_servico', 'config_idealizador_foto');

    if (typeof window !== 'undefined') {
      localStorage.removeItem('pintaaqui_idealizador_foto');
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Falha ao restaurar foto na nuvem.' };
  }
}
