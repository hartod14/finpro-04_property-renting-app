import PropertyPageSkeleton from '@/components/property/propertyPageSkeleton';
import { Suspense } from 'react';

export default function PropertyTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<PropertyPageSkeleton />}>{children}</Suspense>;
}
