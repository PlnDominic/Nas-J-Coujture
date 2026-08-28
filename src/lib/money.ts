export function formatMoney(cents: number, currency: string = "GHS") {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).format(cents / 100);
}
