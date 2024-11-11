import enTranslation from '../../locales/en.json'
import viTranslation from '../../locales/vi.json'
import Assets from '../../assets'

export const getLanguageData = (lang: string) =>
  lang === 'en'
    ? enTranslation
    : viTranslation

export const supportedLanguages = [
  { label: 'English', code: 'en', image: Assets.images.flagAmerica },
  { label: 'Việt Nam', code: 'vi', image: Assets.images.flagVietnam }
]
