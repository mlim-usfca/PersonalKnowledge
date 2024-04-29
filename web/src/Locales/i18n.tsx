import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import tranEn from './Files/en.json';
import tranKo from './Files/ko.json';

const resources = {
  en: { translation: tranEn },
  ko: { translation: tranKo },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  keySeparator: false,
  interpolation: {
    escapeValue: false
  }
})

export const languages = [ 'en', 'ko' ] as const;

export type Languages = typeof languages[number]; // 'en' | 'ko'

export default i18n;