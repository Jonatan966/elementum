import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { ElementsZone } from "@/components/elements-zone";
import Image from "next/image";
import { getDictionary } from "../i18n";
import { Locale } from "../i18n/settings";

export default async function Home(props: { params: { lng: Locale } }) {
  const { darkTheme, lightTheme, systemTheme, titleTheme, initialElements } =
    await getDictionary(props.params.lng);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 container flex items-center gap-2 p-3">
        <Image
          src="/assets/app-icon.png"
          alt="Elementum"
          width={24}
          height={24}
        />
        <h1 className="font-bold text-xl mr-auto">Elementum</h1>

        <ThemeToggle
          i18n={{
            dark: darkTheme,
            light: lightTheme,
            system: systemTheme,
            title: titleTheme,
          }}
        />

        <LanguageToggle currentLanguage={props.params.lng} />
      </header>

      <ElementsZone
        language={props.params.lng}
        initialElements={initialElements}
      />
    </>
  );
}
