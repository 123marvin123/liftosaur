import { TPlate, TBars, IBars, IPlate, TUnit } from "./weight";
import * as t from "io-ts";

export const TSettingsTimers = t.type(
  {
    warmup: t.union([t.number, t.null]),
    workout: t.union([t.number, t.null]),
  },
  "TSettingsTimers"
);
export type ISettingsTimers = t.TypeOf<typeof TSettingsTimers>;

export const TSettings = t.type(
  {
    timers: TSettingsTimers,
    plates: t.array(TPlate),
    bars: t.record(TUnit, TBars),
    units: TUnit,
  },
  "TSettings"
);

export type ISettings = t.TypeOf<typeof TSettings>;

export namespace Settings {
  export function plates(settings: ISettings): IPlate[] {
    return settings.plates.filter((p) => p.weight.unit === settings.units);
  }

  export function bars(settings: ISettings): IBars {
    return settings.bars[settings.units];
  }
}
