import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Locale, i18n } from "../i18n/settings";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { getDictionary } from "../i18n";
import { ElementsProvider } from "@/contexts/elements-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elementum",
  description: "Combine elements ad infinitum",
};

export async function generateStaticParams() {
  return i18n.locales.map((lng) => ({ lng }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: {
    lng: Locale;
  };
}>) {
  const { initialElements } = await getDictionary(params.lng);

  return (
    <html lang={params.lng}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ElementsProvider {...{ initialElements, language: params.lng }}>
            {children}
          </ElementsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
