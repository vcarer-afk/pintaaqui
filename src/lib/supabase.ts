/**
 * Pinta Aqui - Cliente Oficial Supabase (100% Nuvem)
 * Regra Arquitetural: Não é permitido gravação local (sem mocks / sem banco local).
 * Todas as requisições operam diretamente no PostgreSQL gerenciado pelo Supabase Cloud.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(url?: string, anonKey?: string): SupabaseClient | null {
  const targetUrl = url || (typeof window !== 'undefined' ? sessionStorage.getItem('pintaaqui_supabase_url') || '' : '');
  const targetKey = anonKey || (typeof window !== 'undefined' ? sessionStorage.getItem('pintaaqui_supabase_anon') || '' : '');

  if (!targetUrl || !targetKey) {
    return null;
  }

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
    // 1. Testa o endpoint de saúde e status da API REST do Supabase Cloud
    const response = await fetch(`${cleanUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': cleanKey,
        'Authorization': `Bearer ${cleanKey}`,
      },
    });

    const latencyMs = Math.round(performance.now() - startTime);

    if (response.ok || response.status === 200 || response.status === 404 || response.status === 400) {
      // No Supabase, /rest/v1/ retorna 200 com OpenAPI spec quando a chave e URL são válidas.
      if (response.status === 200) {
        return {
          success: true,
          message: 'Conexão 100% em Nuvem estabelecida com sucesso!',
          latencyMs,
          statusCode: response.status,
          details: `Servidores da Supabase Cloud responderam em ${latencyMs}ms. Autenticação e chaves aprovadas.`,
        };
      }
    }

    if (response.status === 401 || response.status === 403) {
      return {
        success: false,
        message: 'Falha de Autenticação na Nuvem: A chave Anon Key informada é inválida ou expirou.',
        latencyMs,
        statusCode: response.status,
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
