export const fallbackLng = "pt-BR";
export const languages = [fallbackLng, "en"];
export const defaultNS = "translation";
export const cookieName = "elementum:language";

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}
