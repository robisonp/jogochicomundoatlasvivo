import type { LevelDef } from './types';
import { CAATINGA_1 } from './caatinga1';
import { CAATINGA_2 } from './caatinga2';
import { CAATINGA_3 } from './caatinga3';
import { CAATINGA_4 } from './caatinga4';
import { CAATINGA_5 } from './caatinga5';
import { AMAZONIA_1 } from './amazonia1';
import { AMAZONIA_2 } from './amazonia2';
import { AMAZONIA_3 } from './amazonia3';
import { AMAZONIA_4 } from './amazonia4';
import { AMAZONIA_5 } from './amazonia5';
import { SAVANA_1 } from './savana1';
import { SAVANA_2 } from './savana2';
import { SAVANA_3 } from './savana3';
import { SAVANA_4 } from './savana4';
import { SAVANA_5 } from './savana5';
import { AUSTRALIA_1 } from './australia1';
import { AUSTRALIA_2 } from './australia2';
import { AUSTRALIA_3 } from './australia3';
import { AUSTRALIA_4 } from './australia4';
import { AUSTRALIA_5 } from './australia5';
import { ARTICO_1 } from './artico1';
import { ARTICO_2 } from './artico2';
import { ARTICO_3 } from './artico3';
import { ARTICO_4 } from './artico4';
import { ARTICO_5 } from './artico5';
import { ANTARTICA_1 } from './antartica1';
import { ANTARTICA_2 } from './antartica2';
import { ANTARTICA_3 } from './antartica3';
import { ANTARTICA_4 } from './antartica4';
import { ANTARTICA_5 } from './antartica5';
import { PRAIA_1 } from './praia1';
import { PRAIA_2 } from './praia2';
import { PRAIA_3 } from './praia3';
import { PRAIA_4 } from './praia4';
import { PRAIA_5 } from './praia5';
import { DINOSSAUROS_1 } from './dinossauros1';
import { DINOSSAUROS_2 } from './dinossauros2';
import { DINOSSAUROS_3 } from './dinossauros3';
import { DINOSSAUROS_4 } from './dinossauros4';
import { DINOSSAUROS_5 } from './dinossauros5';

/** Ordem da campanha: cada fase leva à próxima. */
export const CAMPANHA: LevelDef[] = [
  CAATINGA_1,
  CAATINGA_2,
  CAATINGA_3,
  CAATINGA_4,
  CAATINGA_5,
  AMAZONIA_1,
  AMAZONIA_2,
  AMAZONIA_3,
  AMAZONIA_4,
  AMAZONIA_5,
  SAVANA_1,
  SAVANA_2,
  SAVANA_3,
  SAVANA_4,
  SAVANA_5,
  AUSTRALIA_1,
  AUSTRALIA_2,
  AUSTRALIA_3,
  AUSTRALIA_4,
  AUSTRALIA_5,
  ARTICO_1,
  ARTICO_2,
  ARTICO_3,
  ARTICO_4,
  ARTICO_5,
  ANTARTICA_1,
  ANTARTICA_2,
  ANTARTICA_3,
  ANTARTICA_4,
  ANTARTICA_5,
  PRAIA_1,
  PRAIA_2,
  PRAIA_3,
  PRAIA_4,
  PRAIA_5,
  DINOSSAUROS_1,
  DINOSSAUROS_2,
  DINOSSAUROS_3,
  DINOSSAUROS_4,
  DINOSSAUROS_5,
];

export const FASES: Record<string, LevelDef> = Object.fromEntries(CAMPANHA.map((f) => [f.id, f]));

export function proximaFase(id: string): LevelDef | undefined {
  const i = CAMPANHA.findIndex((f) => f.id === id);
  return i >= 0 ? CAMPANHA[i + 1] : undefined;
}
