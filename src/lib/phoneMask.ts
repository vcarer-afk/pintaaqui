/**
 * Utilitário de máscara e formatação de telefone e WhatsApp para o Pinta Aqui
 * Formato solicitado: ( ) . .
 * Celulares: (11) 9.8765.4321
 * Fixos: (11) 3456.7890
 */

export function aplicarMascaraTelefone(valor: string): string {
  if (!valor) return '';
  const digits = valor.replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';

  if (digits.length <= 2) {
    return `(${digits}`;
  }
  if (digits.length === 3) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)}.${digits.slice(3)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}.${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)}.${digits.slice(3, 7)}.${digits.slice(7, 11)}`;
}

export function limparTelefone(valor: string): string {
  if (!valor) return '';
  return valor.replace(/\D/g, '');
}
