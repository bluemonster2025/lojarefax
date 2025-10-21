export const parsePrice = (price?: string): number => {
  if (!price) return 0;

  // Remove tudo que não for número, vírgula ou ponto
  let cleaned = price.replace(/[^0-9.,]+/g, "");

  // Se existir vírgula, ela é o separador decimal → remove todos os pontos de milhar
  if (cleaned.includes(",")) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  }

  // Se não tiver vírgula, assume formato com ponto decimal (ex: 3199.99)
  return parseFloat(cleaned) || 0;
};
