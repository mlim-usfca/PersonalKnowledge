import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import tranEn from './Files/en.json';
import tranDe from './Files/de.json';
import tranHi from './Files/hi.json';
import tranKo from './Files/ko.json';

const resources = {
  en: { translation: tranEn },
  de: { translation: tranDe },
  hi: { translation: tranHi },
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

export const languages = [ 'en', 'de', 'hi', 'ko' ] as const;

export type Languages = typeof languages[number]; // 'en' | 'de' | 'hi' | 'ko'

export const languageMap = {
  English: 'en',
  Deutsch: 'de',
  Hindi: 'hi',
  Korean: 'ko'
};

export default i18n;