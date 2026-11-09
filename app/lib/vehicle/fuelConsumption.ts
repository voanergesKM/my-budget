type FullTank = { id: string; odometer: number };
type ImportedFuelRecord = FullTank & { fullTank: boolean };

/** Find the new full fills and the first later full fill affected by each import. */
export function affectedFullTankIds(
  imported: ImportedFuelRecord[],
  fullTanks: FullTank[]
): string[] {
  const sorted = [...fullTanks].sort((a, b) => a.odometer - b.odometer);
  const affected = new Set<string>();
  for (const record of imported) {
    if (record.fullTank) affected.add(record.id);
    if (!Number.isFinite(record.odometer)) continue;
    let left = 0;
    let right = sorted.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (sorted[mid].odometer <= record.odometer) left = mid + 1;
      else right = mid;
    }
    if (left < sorted.length) affected.add(sorted[left].id);
  }
  return [...affected];
}
