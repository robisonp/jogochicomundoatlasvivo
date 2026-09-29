import type { LevelDef } from './types';
import { CAATINGA_1 } from './caatinga1';
import { CAATINGA_2 } from './caatinga2';
import { CAATINGA_3 } from './caatinga3';
import { CAATINGA_4 } from './caatinga4';
import { CAATINGA_5 } from './caatinga5';

/** Ordem da campanha: cada fase leva à próxima. */
export const CAMPANHA: LevelDef[] = [CAATINGA_1, CAATINGA_2, CAATINGA_3, CAATINGA_4, CAATINGA_5];

export const FASES: Record<string, LevelDef> = Object.fromEntries(CAMPANHA.map((f) => [f.id, f]));

export function proximaFase(id: string): LevelDef | undefined {
  const i = CAMPANHA.findIndex((f) => f.id === id);
  return i >= 0 ? CAMPANHA[i + 1] : undefined;
}
