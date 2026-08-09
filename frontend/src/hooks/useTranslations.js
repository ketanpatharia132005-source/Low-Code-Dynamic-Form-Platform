import { useTranslation } from "react-i18next";

export function useLandingTranslation() {
  const { t } = useTranslation();

  const lt = (key, options) => t(`landing.${key}`, options);

  return { lt };
}

export function useAuthTranslation() {
  const { t } = useTranslation();

  const at = (key, options) => t(`auth.${key}`, options);

  return { at };
}

export function useDashboardTranslation() {
  const { t } = useTranslation();

  const dt = (key, options) => t(`dashboard.${key}`, options);

  return { dt };
}

export function useBuilderTranslation() {
  const { t } = useTranslation();

  const bt = (key, options) => t(`builder.${key}`, options);

  return { bt };
}

export function useAnalyticsTranslation() {
  const { t } = useTranslation();

  const ant = (key, options) => t(`analytics.${key}`, options);

  return { ant };
}

export function useFormsTranslation() {
  const { t } = useTranslation();

  const ft = (key, options) => t(`forms.${key}`, options);

  return { ft };
}