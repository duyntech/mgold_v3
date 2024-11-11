import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { toggleNoti } from '../../slices/header/header.slice'
import HeaderDropdown from './HeaderDropdown'
import { useEffect, useRef } from 'react'
export default function HeaderNotification() {
  const toggleStates = useAppSelector((state) => state.header)
  const dispatch = useAppDispatch()
  const myRef = useRef<HTMLLIElement>(null);
  const handleClickOutside = (e:any) => {
    if (!myRef.current!.contains(e.target)) {
      if(toggleStates.showNotiDrop){
        dispatch(toggleNoti)
      }
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
  return (
    <li className={`nav-item ${toggleStates.showNotiDrop ? 'iq-show' : ''}`} ref={myRef}>
      <Link to='#' className='search-toggle iq-waves-effect' onClick={() => dispatch(toggleNoti())}>
        <i className='ri-notification-3-fill'></i>
        <span className='bg-danger dots'></span>
      </Link>
      <HeaderDropdown title={'All Notifications'} bagde={0} status={''} items={[]} isProfile={false} />
    </li>
  )
}
