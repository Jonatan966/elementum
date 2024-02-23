import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslation } from "../i18n";
import { LanguageToggle } from "@/components/language-toggle";
import { ElementsZone } from "@/components/elements-zone";

export default async function Home(props: { params: { lng: string } }) {
  const { t } = await useTranslation(props.params.lng);

  return (
    <>
      <header className="absolute top-0 left-0 right-0 container flex items-center gap-2 p-3">
        <h1 className="font-bold text-xl mr-auto">Elementum</h1>

        <ThemeToggle
          i18n={{
            dark: t("dark-theme"),
            light: t("light-theme"),
            system: t("system-theme"),
            title: t("title-theme"),
          }}
        />

        <LanguageToggle currentLanguage={props.params.lng} />
      </header>

      <ElementsZone language={props.params.lng} />
    </>
  );
}
