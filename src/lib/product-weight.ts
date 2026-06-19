const CARAT_IN_DESCRIPTION_RE = /(\d+(?:[,.]\d+)?)\s*ct\b/i;

export function parseCaratWeightFromDescription(
  description: string,
): number | undefined {
  const match = description.match(CARAT_IN_DESCRIPTION_RE);
  if (!match) return undefined;

  const value = Number.parseFloat(match[1].replace(",", "."));
  return Number.isNaN(value) ? undefined : value;
}

export function formatCaratWeightFromDescription(
  description: string,
): string | undefined {
  const match = description.match(CARAT_IN_DESCRIPTION_RE);
  if (!match) return undefined;

  return match[1].replace(".", ",");
}

export function formatCaratWeight(value: number): string {
  return String(value).replace(".", ",");
}

export function getProductCaratWeightLabel(product: {
  description?: string;
  stoneWeight: number;
}): string {
  if (product.description) {
    const fromDescription = formatCaratWeightFromDescription(product.description);
    if (fromDescription) return fromDescription;
  }

  return formatCaratWeight(product.stoneWeight);
}
