import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { toggleMessage } from '../../slices/header/header.slice'
import HeaderDropdown from './HeaderDropdown'
export default function HeaderMessage() {
  const toggleStates = useAppSelector((state) => state.header)
  // const msgList = useAppSelector((state) => state.messages)
  const dispatch = useAppDispatch()
  return (
    <li className={`nav-item dropdown ${toggleStates.showMessageDrop ? 'iq-show' : ''}`}>
      <Link to='#' className='search-toggle iq-waves-effect' onClick={() => dispatch(toggleMessage())}>
        <i className='ri-mail-open-fill'></i>
        <span className='bg-primary count-mail'></span>
      </Link>
      <HeaderDropdown title={'All Messages'} bagde={0} status={''} items={[]} isProfile={false} />
    </li>
  )
}
