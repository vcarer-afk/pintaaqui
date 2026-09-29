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
    // 1. Testa os endpoints de saúde e de tabelas da API REST do Supabase Cloud
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
        details: `Servidores da Supabase Cloud responderam em ${latencyMs}ms. A tabela 'pintores_profissionais' e as chaves estão ativas na nuvem!`,
      };
    }

    if (authRes && authRes.ok) {
      return {
        success: true,
        message: 'Conexão 100% em Nuvem estabelecida com sucesso!',
        latencyMs,
        statusCode: 200,
        details: `Servidores da Supabase Cloud responderam em ${latencyMs}ms. O projeto está ativo e pronto para operações em nuvem.`,
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

    // Se respondeu qualquer outro status do servidor Supabase
    return {
      success: true,
      message: 'Conexão de rede alcançada na Nuvem Supabase.',
      latencyMs,
      statusCode: response.status,
      details: `Servidor retornou status ${response.status} em ${latencyMs}ms.`,
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
