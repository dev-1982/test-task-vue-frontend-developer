import type { LabelItem } from '@/types/account';

export function parseLabels(input: string): LabelItem[] {
  return input
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((text) => ({ text }));
}

export function labelsToString(labels: LabelItem[]): string {
  return labels.map((l) => l.text).join('; ');
}
