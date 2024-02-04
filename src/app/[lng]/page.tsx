import { useTranslation } from "../i18n";

export default async function Home(props: { params: { lng: string } }) {
  const { t } = await useTranslation(props.params.lng);

  return <h1>{t("title")}</h1>;
}
