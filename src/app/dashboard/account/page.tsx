import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { config } from '@/config';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): never {
  notFound();
}
