'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { isAnalyticsDebugMode } from '@/lib/analytics';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { YandexMetrika } from '@/components/analytics/YandexMetrika';

function AnalyticsContent() {
  const searchParams = useSearchParams();

  if (isAnalyticsDebugMode(searchParams)) {
    return null;
  }

  return (
    <>
      <GoogleAnalytics />
      <YandexMetrika />
    </>
  );
}

export function Analytics() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  );
}
