export type Category = 'food' | 'drink' | 'fruit' | 'snacks' | 'household' | 'other';

export function normalizeCategory(input?: string | null): Category {
  const raw = (input ?? '').trim().toLowerCase();

  if (!raw) return 'other';

  // Common variants
  if (raw === 'foods') return 'food';
  if (raw === 'drinks') return 'drink';

  if (raw === 'food') return 'food';
  if (raw === 'drink') return 'drink';
  if (raw === 'fruit') return 'fruit';
  if (raw === 'snack' || raw === 'snacks') return 'snacks';
  if (raw === 'household' || raw === 'home') return 'household';
  if (raw === 'other' || raw === 'others') return 'other';

  return 'other';
}

export type Unit =
  | 'pcs'
  | 'pack'
  | 'botol'
  | 'kaleng'
  | 'dus'
  | 'ikat'
  | 'porsi'
  | 'kg'
  | 'gr'
  | 'l'
  | 'ml';

export function normalizeUnit(input?: string | null): Unit {
  const raw = (input ?? '').trim().toLowerCase();
  if (!raw || raw === 'unit') return 'pcs';

  // Weight / volume
  if (raw === 'kg' || raw === 'kilo' || raw === 'kilogram') return 'kg';
  if (raw === 'gr' || raw === 'gram' || raw === 'g') return 'gr';
  if (raw === 'l' || raw === 'liter' || raw === 'litre') return 'l';
  if (raw === 'ml' || raw === 'milliliter' || raw === 'mililiter') return 'ml';

  // Count-ish
  if (raw === 'pcs' || raw === 'piece' || raw === 'buah' || raw === 'biji' || raw === 'butir' || raw === 'batang') return 'pcs';
  if (raw === 'pack' || raw === 'bungkus' || raw === 'bks' || raw === 'sachet' || raw === 'cup' || raw === 'kotak' || raw === 'box') return 'pack';

  // Explicit Indonesian units you already use
  if (raw === 'botol') return 'botol';
  if (raw === 'kaleng') return 'kaleng';
  if (raw === 'dus' || raw === 'kardus' || raw === 'karton') return 'dus';
  if (raw === 'ikat') return 'ikat';
  if (raw === 'porsi') return 'porsi';

  // Default
  return 'pcs';
}

export function normalizeQty(input: unknown): number {
  const n = typeof input === 'number' ? input : Number(input);
  if (!Number.isFinite(n)) return 1;
  return Math.max(1, Math.floor(n));
}

export function normalizeMoney(input: unknown): number {
  const n = typeof input === 'number' ? input : Number(input);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.round(n));
}
