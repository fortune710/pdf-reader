import type { Metadata } from 'next'
//import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import './globals.css'
import QueryProvider from '@/components/providers/query-provider'
import { ComponentType, ReactNode } from 'react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';

export const metadata: Metadata = {
  title: 'PDF Reader',
  description: 'Created by Fortune Alebiosu',
}

type ProviderComponent = ComponentType<{ children: ReactNode }>;


//Used composition to have multiple providers into single function
//improving scalability
export const composeProviders = (
  providers: ProviderComponent[],
  children: ReactNode
): React.ReactElement => {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children as React.ReactElement
  );
};

const providers = [QueryProvider, NuqsAdapter, ThemeProvider, TooltipProvider]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {composeProviders(providers, children)}
      </body>
    </html>
  )
}
