import React from 'react';
import { Shield, ArrowLeft, CheckCircle2, Printer, EyeOff, X } from 'lucide-react';

interface TermosDeUsoProps {
  onVoltar: () => void;
}

export const TermosDeUso: React.FC<TermosDeUsoProps> = ({ onVoltar }) => {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Navegação de Retorno e Ocultação */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Botão Principal: Ocultar essa Tela */}
          <button
            type="button"
            onClick={onVoltar}
            className="inline-flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs sm:text-sm font-black transition cursor-pointer shadow-lg shadow-amber-500/25 transform hover:-translate-y-0.5 active:translate-y-0"
            title="Ocultar esta tela de termos de uso e voltar para a navegação principal"
          >
            <EyeOff className="w-4 h-4 shrink-0 stroke-[2.5]" />
            <span>Ocultar esta Tela</span>
          </button>

          <button
            type="button"
            onClick={onVoltar}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-amber-500/50 text-stone-300 hover:text-white text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden xs:inline">Voltar ao Início</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-850 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs transition border border-stone-750 cursor-pointer"
            title="Imprimir documento"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Termos</span>
          </button>

          <button
            type="button"
            onClick={onVoltar}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-850 hover:bg-red-950/40 text-stone-400 hover:text-red-300 text-xs font-medium transition border border-stone-750 hover:border-red-800/50 cursor-pointer flex items-center gap-1"
            title="Fechar / Ocultar"
            aria-label="Fechar e ocultar termos"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Fechar</span>
          </button>
        </div>
      </div>

      {/* Cartão Oficial dos Termos de Uso */}
      <article className="bg-stone-900/90 border border-stone-700/80 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 shadow-2xl space-y-6 sm:space-y-8 backdrop-blur-xs text-stone-200">
        
        {/* Cabeçalho do Documento */}
        <header className="border-b border-stone-800 pb-5 sm:pb-6 flex items-start justify-between gap-4">
          <div className="space-y-2.5 sm:space-y-3 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider font-mono">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              Documento Jurídico Institucional • Pinta Aqui
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Termos de Uso e Isenção de Responsabilidade
            </h2>

            <p className="text-xs text-stone-400 font-mono break-all sm:break-normal">
              URL Oficial: <span className="text-amber-400">www.pintaaqui.com.br/termos</span> • Versão Vigente 2026
            </p>
          </div>

          {/* Botão de Ação Rápida no Cabeçalho do Cartão */}
          <button
            type="button"
            onClick={onVoltar}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-950/90 hover:bg-stone-800 border border-stone-800 hover:border-amber-500/50 text-stone-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0 shadow-xs"
            title="Ocultar esta tela e voltar"
            aria-label="Ocultar esta tela de termos"
          >
            <EyeOff className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Ocultar Tela</span>
            <X className="w-4 h-4 sm:hidden text-stone-400" />
          </button>
        </header>

        {/* Preâmbulo Oficial */}
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-stone-950 border border-stone-800/90 shadow-inner">
          <p className="text-stone-200 leading-relaxed text-xs sm:text-sm md:text-base font-normal">
            Ao utilizar o site <strong>Pinta Aqui</strong> (www.pintaaqui.com.br), o usuário (cliente ou pintor) concorda expressamente com os seguintes termos:
          </p>
        </div>

        {/* Lista Ordenada Jurídica (Itens 1 a 4) */}
        <ol className="space-y-4 sm:space-y-6 text-xs sm:text-sm md:text-base text-stone-300">
          
          {/* Item 1 */}
          <li className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-stone-950/60 border border-stone-800/70 hover:border-amber-500/40 transition">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm font-mono">
              1
            </span>
            <div className="space-y-1">
              <strong className="text-white text-sm sm:text-base block font-bold">
                Natureza da Plataforma
              </strong>
              <p className="text-stone-300 leading-relaxed text-xs sm:text-sm">
                O Pinta Aqui é um portal informativo e um diretório de anúncios. O site <strong>NÃO</strong> é empresa de pintura, empreiteira, fornecedora ou intermediária financeira.
              </p>
            </div>
          </li>

          {/* Item 2 */}
          <li className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-stone-950/60 border border-stone-800/70 hover:border-amber-500/40 transition">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm font-mono">
              2
            </span>
            <div className="space-y-1">
              <strong className="text-white text-sm sm:text-base block font-bold">
                Autonomia das Negociações
              </strong>
              <p className="text-stone-300 leading-relaxed text-xs sm:text-sm">
                A escolha do profissional, a solicitação de orçamentos, os valores combinados, as formas de pagamento e a compra de materiais são decididos <strong>100% de forma direta e autônoma entre cliente e pintor</strong>.
              </p>
            </div>
          </li>

          {/* Item 3 */}
          <li className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-stone-950/60 border border-stone-800/70 hover:border-amber-500/40 transition">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm font-mono">
              3
            </span>
            <div className="space-y-1">
              <strong className="text-white text-sm sm:text-base block font-bold">
                Ausência de Garantia ou Vínculo
              </strong>
              <p className="text-stone-300 leading-relaxed text-xs sm:text-sm">
                O Pinta Aqui não possui vínculo empregatício com nenhum pintor cadastrado e não se responsabiliza por eventuais descumprimentos de prazos, vícios de execução, danos materiais, acidentes de trabalho ou inadimplência entre as partes.
              </p>
            </div>
          </li>

          {/* Item 4 */}
          <li className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-stone-950/60 border border-stone-800/70 hover:border-amber-500/40 transition">
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm font-mono">
              4
            </span>
            <div className="space-y-1">
              <strong className="text-white text-sm sm:text-base block font-bold">
                Recomendação ao Cliente
              </strong>
              <p className="text-stone-300 leading-relaxed text-xs sm:text-sm">
                Recomendamos sempre que o cliente solicite referências prévias, firme um contrato de prestação de serviços por escrito diretamente com o profissional e faça vistoria do trabalho ao final de cada etapa.
              </p>
            </div>
          </li>
        </ol>

        {/* Rodapé Interno do Documento */}
        <footer className="pt-5 sm:pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Documento oficial de diretrizes e isenção de responsabilidade civil.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onVoltar}
              className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2"
              title="Ocultar esta tela de Termos de Uso"
            >
              <EyeOff className="w-4 h-4 stroke-[2.5]" />
              <span>Ocultar esta Tela</span>
            </button>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default TermosDeUso;
