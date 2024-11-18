import { Link } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { toggleProfile } from '../../slices/header/header.slice'
import HeaderDropdown from './HeaderDropdown'
// import { headerProfileActions } from '../../utils/constants/headers'
import Assets from '../../assets'
import { useEffect, useRef } from 'react'
import { UserRepo } from '../../repository/UserRepository'
//import { UserRepo } from '../../repository/UserRepository'
export default function HeaderProfile() {
  const toggleStates = useAppSelector((state) => state.header)
  const dispatch = useAppDispatch()
  const myRef = useRef<HTMLLIElement>(null);
  const handleClickOutside = (e: any) => {
    if (!myRef.current!.contains(e.target)) {
      if (toggleStates.showProfileDrop) {
        dispatch(toggleProfile())
      }
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
  // const profileActions = headerProfileActions
  // const userProfileImage=UserRepo.getUserProfileImage();
  const userFullname = UserRepo.getUserFullname();
  const userProfileImage = Assets.images.user01;
  //const userFullname='Fami Soft';
  return (
    <ul className='navbar-list align-items-right'>
      <li className={toggleStates.showProfileDrop ? 'iq-show' : ''} ref={myRef}>
        <Link
          to='#'
          className='search-toggle iq-waves-effect d-flex align-items-center'
          onClick={() => dispatch(toggleProfile())}

        >
          <img src={userProfileImage} className='img-fluid rounded-circle mr-3' alt='user' />
          <div className='caption ms-1'>
            <h6 className='mb-0 line-height'>{userFullname}</h6>
            <span className='font-size-12'>Trực tuyến</span>
          </div>
        </Link>
        <div className='iq-sub-dropdown iq-user-dropdown'>
          <HeaderDropdown
            title={'Xin chào ' + userFullname}
            bagde={0}
            status={'Trực tuyến'}
            items={[]}
            isProfile={true}
          />
        </div>
      </li>
    </ul>
  )
}
