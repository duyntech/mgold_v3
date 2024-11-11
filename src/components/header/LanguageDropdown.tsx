import { Link } from 'react-router-dom'

type LanguageDropdownProps = {
  title: string
  code: string
  image: any
  onChangeLang: any
}
export default function LanguageDropdown(props: LanguageDropdownProps) {
  return (
    <Link key={props.code} to='#' className='iq-sub-card' onClick={() => props.onChangeLang(props.code)}>
      <img src={props.image} alt='img-flaf' className='img-fluid mr-2' /> {' ' + props.title}
    </Link>
  )
}
