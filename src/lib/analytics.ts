export function getGaMeasurementId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

  return id || undefined;
}
