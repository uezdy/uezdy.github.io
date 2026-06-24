export const YM_COUNTER_ID = 110108425;

export function getGaMeasurementId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

  return id || undefined;
}

export function getYmCounterId(): number | undefined {
  const id = process.env.NEXT_PUBLIC_YM_COUNTER_ID?.trim();

  if (id) {
    return Number(id);
  }

  return YM_COUNTER_ID;
}
