import { ValueTransformer } from "typeorm";
import { DateTime } from "luxon";

export const luxonTransformer: ValueTransformer = {
  from: (value: Date | null): DateTime | null => {
    return value ? DateTime.fromJSDate(value) : null;
  },
  to: (value: DateTime | null): Date | null => {
    return value ? value.toJSDate() : null;
  },
};
