export const formatDateTime = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("pt-BR").format(value);

export const formatPercent = (value: number) =>
  `${value.toFixed(2).replace(".", ",")}%`;

export const formatLatency = (value?: number | null) =>
  value === null || value === undefined ? "-" : `${value} ms`;
