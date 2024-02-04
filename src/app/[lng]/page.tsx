import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslation } from "../i18n";
import { LanguageToggle } from "@/components/language-toggle";

export default async function Home(props: { params: { lng: string } }) {
  const { t } = await useTranslation(props.params.lng);

  return (
    <>
      <header className="container mx-auto py-3 flex items-center gap-2">
        <h1 className="font-bold text-xl mr-auto">Elementum</h1>

        <ThemeToggle
          i18n={{
            dark: t("dark-theme"),
            light: t("light-theme"),
            system: t("system-theme"),
            title: t("title-theme"),
          }}
        />

        <LanguageToggle />
      </header>
    </>
  );
}
