import { Link } from 'react-router-dom'
import { DropdownItemModel } from '../../model/Dropdown.model'
type DropdownItemProps = {
  item: DropdownItemModel
}
export default function HeaderDropdownItem(props: DropdownItemProps) {
  return (
    <Link to={props.item.url} className='iq-sub-card'>
      <div className='media align-items-center'>
        <div className={props.item.className}>
          {props.item.image !== '' ? (
            <img className='avatar-40 rounded' src={props.item.image} alt='' />
          ) : (
            <i className={props.item.icon}></i>
          )}
        </div>
        <div className='media-body ms-3'>
          <h6 className='mb-0 '>{props.item.title}</h6>
          <p className='mb-0 font-size-12'>{props.item.subtitle}</p>
          {props.item.time !== '' ? <small className='float-end font-size-12'>{props.item.time}</small> : <></>}
        </div>
      </div>
    </Link>
  )
}
