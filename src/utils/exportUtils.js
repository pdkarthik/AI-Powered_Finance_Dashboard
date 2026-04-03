const asArray = (data) => (Array.isArray(data) ? data : []);

const escapeCSVCell = (value) => {
  if (value === null || value === undefined) return '""';

  // Keep numbers unquoted so spreadsheets parse them as numbers.
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);

  const str = String(value)
    // Normalize newlines; they break CSV row structure.
    .replace(/\r?\n/g, ' ')
    // Escape quotes by doubling them.
    .replace(/"/g, '""');

  return `"${str}"`;
};

const triggerDownload = (blob, filename) => {
  // In SSR/tests there may be no DOM; fail safely.
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  link.rel = 'noopener';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Avoid leaking object URLs.
  window.setTimeout(() => URL.revokeObjectURL(href), 0);
};

export const exportToCSV = (data, filename = 'transactions.csv') => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = asArray(data).map((row) => {
    const amountNum = typeof row?.amount === 'number' ? row.amount : Number(row?.amount);
    const safeAmount = Number.isFinite(amountNum) ? amountNum : 0;

    // The UI displays `+` for income and `-` for expenses, so we export the signed amount too.
    const signedAmount = row?.type === 'expense' ? -Math.abs(safeAmount) : Math.abs(safeAmount);

    return [
      row?.date ?? '',
      row?.description ?? row?.category ?? '',
      row?.category ?? '',
      row?.type ?? '',
      signedAmount,
    ];
  });

  const csv = [
    headers.map(escapeCSVCell).join(','),
    ...rows.map((r) => r.map(escapeCSVCell).join(',')),
  ].join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  triggerDownload(blob, filename);
};

export const exportToJSON = (data, filename = 'transactions.json') => {
  const blob = new Blob([JSON.stringify(asArray(data), null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  triggerDownload(blob, filename);
};