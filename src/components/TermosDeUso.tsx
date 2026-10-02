import React from 'react';
import { Shield, ArrowLeft, CheckCircle2, FileText, ExternalLink, Printer } from 'lucide-react';

interface TermosDeUsoProps {
  onVoltar: () => void;
}

export const TermosDeUso: React.FC<TermosDeUsoProps> = ({ onVoltar }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn">
      {/* Navegação de Retorno */}
      <div className="flex items-center justify-between">
        <button
          onClick={onVoltar}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 border border-stone-700 hover:border-amber-500/50 text-stone-300 hover:text-white text-xs font-semibold transition cursor-pointer shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Voltar para a Página Inicial</span>
        </button>

        <button
          onClick={() => window.print()}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-850 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs transition border border-stone-750 cursor-pointer"
          title="Imprimir documento"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Imprimir Termos</span>
        </button>
      </div>

      {/* Cartão Oficial dos Termos de Uso */}
      <article className="bg-stone-900/90 border border-stone-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 backdrop-blur-xs text-stone-200">
        
        {/* Cabeçalho do Documento */}
        <header className="border-b border-stone-800 pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider font-mono">
            <Shield className="w-3.5 h-3.5" />
            Documento Jurídico Institucional • Pinta Aqui
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Termos de Uso e Isenção de Responsabilidade
          </h2>

          <p className="text-xs text-stone-400 font-mono">
            URL Oficial: <span className="text-amber-400">www.pintaaqui.com.br/termos</span> • Versão Vigente 2026
          </p>
        </header>

        {/* Preâmbulo Oficial */}
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-950 border border-stone-800/90 shadow-inner">
          <p className="text-stone-200 leading-relaxed text-sm sm:text-base font-normal">
            Ao utilizar o site <strong>Pinta Aqui</strong> (www.pintaaqui.com.br), o usuário (cliente ou pintor) concorda expressamente com os seguintes termos:
          </p>
        </div>

        {/* Lista Ordenada Jurídica (Itens 1 a 4) */}
        <ol className="space-y-6 text-sm sm:text-base text-stone-300">
          
          {/* Item 1 */}
          <li className="flex items-start gap-4 p-5 rounded-2xl bg-stone-950/60 border border-stone-800/70 hover:border-amber-500/40 transition">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 font-bold text-sm font-mono">
              1
            </span>
            <div className="space-y-1">
              <strong className="text-white text-base block font-bold">
                Natureza da Plataforma
              </strong>
              <p className="text-stone-300 leading-relaxed text-sm">
                O Pinta Aqui é um portal informativo e um diretório de anúncios. O site <strong>NÃO</strong> é empresa de pintura, empreiteira, fornecedora ou intermediária financeira.
              </p>
            </div>
          </li>

          {/* Item 2 */}
          <li className="flex items-start gap-4 p-5 rounded-2xl bg-stone-950/60 border border-stone-800/70 hover:border-amber-500/40 transition">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 font-bold text-sm font-mono">
              2
            </span>
            <div className="space-y-1">
              <strong className="text-white text-base block font-bold">
                Autonomia das Negociações
              </strong>
              <p className="text-stone-300 leading-relaxed text-sm">
                A escolha do profissional, a solicitação de orçamentos, os valores combinados, as formas de pagamento e a compra de materiais são decididos <strong>100% de forma direta e autônoma entre cliente e pintor</strong>.
              </p>
            </div>
          </li>

          {/* Item 3 */}
          <li className="flex items-start gap-4 p-5 rounded-2xl bg-stone-950/60 border border-stone-800/70 hover:border-amber-500/40 transition">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 font-bold text-sm font-mono">
              3
            </span>
            <div className="space-y-1">
              <strong className="text-white text-base block font-bold">
                Ausência de Garantia ou Vínculo
              </strong>
              <p className="text-stone-300 leading-relaxed text-sm">
                O Pinta Aqui não possui vínculo empregatício com nenhum pintor cadastrado e não se responsabiliza por eventuais descumprimentos de prazos, vícios de execução, danos materiais, acidentes de trabalho ou inadimplência entre as partes.
              </p>
            </div>
          </li>

          {/* Item 4 */}
          <li className="flex items-start gap-4 p-5 rounded-2xl bg-stone-950/60 border border-stone-800/70 hover:border-amber-500/40 transition">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 font-bold text-sm font-mono">
              4
            </span>
            <div className="space-y-1">
              <strong className="text-white text-base block font-bold">
                Recomendação ao Cliente
              </strong>
              <p className="text-stone-300 leading-relaxed text-sm">
                Recomendamos sempre que o cliente solicite referências prévias, firme um contrato de prestação de serviços por escrito diretamente com o profissional e faça vistoria do trabalho ao final de cada etapa.
              </p>
            </div>
          </li>

        </ol>

        {/* Rodapé Interno do Documento */}
        <footer className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Documento oficial de diretrizes e isenção de responsabilidade civil.</span>
          </div>

          <button
            onClick={onVoltar}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition shadow-md shadow-amber-500/20 cursor-pointer"
          >
            Entendido • Voltar ao Início
          </button>
        </footer>

      </article>
    </div>
  );
};

export default TermosDeUso;
