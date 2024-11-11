import { supportedLanguages } from '../../utils/constants/languages'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { sidebarChangeLocale } from '../../slices/sidebar/sidebar.slice'
import { toggleLanguage } from '../../slices/header/header.slice'
import { Link } from 'react-router-dom'
import LanguageDropdown from './LanguageDropdown'

export default function LanguageSelect() {
  const { i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const toggleStates = useAppSelector((state) => state.header)
  const onChangeLang = (lang_code: string) => {
    console.log('change ', lang_code)
    localStorage.setItem('language', lang_code)
    i18n.changeLanguage(lang_code)
    dispatch(sidebarChangeLocale(lang_code))
    dispatch(toggleLanguage())
  }
  const currentLanguage = supportedLanguages.find((e) => e.code === i18n.language)

  return (
    <li className={`nav-item dropdown ${toggleStates.showLanguageDrop ? 'iq-show' : ''}`}>
      <Link to='#' className='search-toggle iq-waves-effect language-title' onClick={() => dispatch(toggleLanguage())}>
        <img src={currentLanguage?.image} alt='img-flaf' className='img-fluid mr-1' style={{ height: 16, width: 16 }} />{' '}
        {currentLanguage?.label} <i className='ri-arrow-down-s-line'></i>
      </Link>
      <div className='iq-sub-dropdown'>
        {supportedLanguages.map((e) =>
          LanguageDropdown({
            title: e.label,
            image: e.image,
            code: e.code,
            onChangeLang: onChangeLang
          })
        )}
      </div>
    </li>
  )
}
