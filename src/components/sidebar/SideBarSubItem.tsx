import { Link } from 'react-router-dom'
import { SidebarSubItemModel } from '../../model/Sidebar.model'
import { useAppDispatch } from '../../app/hooks'
import { searchChanged } from '../../slices/header/header.slice'
export default function SideBarSubItem(menu: SidebarSubItemModel) {
  const subKey = 'subMenu-' + menu.id
  const dispatch = useAppDispatch()
  return (
    <li
      key={subKey}
      className={menu.isActive ? 'active main-active' : ''}
      onClick={() => dispatch(searchChanged(''))}
    >
      <Link to={menu.target}>
        <i className={menu.icon}></i>
        {menu.title}
      </Link>
    </li>
  )
}
