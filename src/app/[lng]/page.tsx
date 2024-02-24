/* eslint-disable @next/next/no-img-element */
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { ElementsZone } from "@/components/elements-zone";
import { getDictionary } from "../i18n";
import { Locale } from "../i18n/settings";
import { ClearDeckButton } from "@/components/clear-deck-button";

export default async function Home(props: { params: { lng: Locale } }) {
  const { darkTheme, lightTheme, systemTheme, titleTheme, clearDeckDialog } =
    await getDictionary(props.params.lng);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 container flex items-center gap-2 p-3">
        <img src="/assets/app-icon.png" alt="Elementum" className="h-6 w-6" />
        <h1 className="font-bold text-xl mr-auto">Elementum</h1>

        <LanguageToggle currentLanguage={props.params.lng} />

        <ThemeToggle
          i18n={{
            dark: darkTheme,
            light: lightTheme,
            system: systemTheme,
            title: titleTheme,
          }}
        />

        <ClearDeckButton i18n={clearDeckDialog} />
      </header>

      <ElementsZone />
    </>
  );
}
