import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation resources
import enCommon from '../public/locales/en/common.json'
import frCommon from '../public/locales/fr/common.json'

const resources = {
  en: {
    common: enCommon,
  },
  fr: {
    common: frCommon,
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common'],
    
    // Language detection configuration
    detection: {
      order: ['navigator', 'localStorage', 'htmlTag', 'path', 'subdomain'],
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
      caches: ['localStorage'],
      excludeCacheFor: ['cimode'],
      convertDetectedLanguage: (lng: string) => {
        // Clean language codes and map to supported languages
        const cleanLng = lng.split('-')[0].toLowerCase()
        
        // Return supported languages or fallback to English
        if (cleanLng === 'fr') return 'fr'
        if (cleanLng === 'en') return 'en'
        
        return 'en' // Default fallback
      },
    },
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
    },
  })

export default i18n 