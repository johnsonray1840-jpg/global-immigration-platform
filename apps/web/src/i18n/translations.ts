export type Language =
  | 'en' | 'fr' | 'es' | 'de' | 'zh' | 'ar' | 'pt' | 'ru' | 'ja' | 'ko'
  | 'it' | 'nl' | 'pl' | 'tr' | 'vi' | 'th' | 'hi' | 'id' | 'ms' | 'fil'
  | 'sw' | 'am' | 'ha' | 'yo' | 'ig' | 'zu' | 'af' | 'ur' | 'bn' | 'fa'
  | 'he' | 'el' | 'cs' | 'sk' | 'hu' | 'ro' | 'bg' | 'uk' | 'sr' | 'hr'
  | 'sv' | 'no' | 'da' | 'fi' | 'is';

type TranslationDictionary = {
  [key: string]: string;
};

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    'nav.home': 'Home',
    'nav.countries': 'Countries',
    'nav.programs': 'Programs',
    'nav.eligibility': 'Eligibility',
    'nav.packages': 'Packages',
    'nav.about': 'About',
    'nav.faq': 'FAQ',
    'nav.signin': 'Sign In',
    'nav.getstarted': 'Get Started',
    'hero.badge': 'Government-Approved Immigration Services',
    'hero.title': 'Your Gateway to Global Freedom',
    'hero.subtitle': 'Expert guidance for visas, permanent residence, citizenship, and investment immigration.',
    'hero.from': 'From',
    'hero.to': 'To',
    'stats.countries': 'Countries Served',
    'stats.cases': 'Successful Cases',
    'stats.approval': 'Approval Rate',
    'stats.years': 'Years Experience',
    // Add more keys as needed
  },
  fr: {
    // French translations
  },
  es: {
    // Spanish translations
  },
  de: {
    // German translations
  },
  zh: {
    // Chinese translations
  },
  ar: {
    // Arabic translations
  },
  pt: {
    // Portuguese translations
  },
  ru: {
    // Russian translations
  },
  ja: {
    // Japanese translations
  },
  ko: {
    // Korean translations
  },
  it: {
    // Italian translations
  },
  nl: {
    // Dutch translations
  },
  pl: {
    // Polish translations
  },
  tr: {
    // Turkish translations
  },
  vi: {
    // Vietnamese translations
  },
  th: {
    // Thai translations
  },
  hi: {
    // Hindi translations
  },
  id: {
    // Indonesian translations
  },
  ms: {
    // Malay translations
  },
  fil: {
    // Filipino translations
  },
  sw: {
    // Swahili translations
  },
  am: {
    // Amharic translations
  },
  ha: {
    // Hausa translations
  },
  yo: {
    // Yoruba translations
  },
  ig: {
    // Igbo translations
  },
  zu: {
    // Zulu translations
  },
  af: {
    // Afrikaans translations
  },
  ur: {
    // Urdu translations
  },
  bn: {
    // Bengali translations
  },
  fa: {
    // Persian translations
  },
  he: {
    // Hebrew translations
  },
  el: {
    // Greek translations
  },
  cs: {
    // Czech translations
  },
  sk: {
    // Slovak translations
  },
  hu: {
    // Hungarian translations
  },
  ro: {
    // Romanian translations
  },
  bg: {
    // Bulgarian translations
  },
  uk: {
    // Ukrainian translations
  },
  sr: {
    // Serbian translations
  },
  hr: {
    // Croatian translations
  },
  sv: {
    // Swedish translations
  },
  no: {
    // Norwegian translations
  },
  da: {
    // Danish translations
  },
  fi: {
    // Finnish translations
  },
  is: {
    // Icelandic translations
  },
};