import { Link, useLocation } from 'react-router-dom'
import SideBarSubItem from './SideBarSubItem'
import { SidebarItemModel } from '../../model/Sidebar.model'
import { useAppDispatch } from '../../app/hooks';
import { searchChanged } from '../../slices/header/header.slice';
import { setActions } from '../../slices/sidebar/sidebar.slice';

export default function SideBarItem(item: SidebarItemModel) {
    const menuKey = 'menu-' + item.id
    const location = useLocation();
    const splitUrl = location.pathname.split('-');
    const dispatch = useAppDispatch()
    const isExpanded = item.isExpanded || splitUrl.length > 1;
    return item.isGroup ? (
        <li key={menuKey} className='iq-menu-title'>
            <i className='ri-subtract-line'></i>
            <span style={{ color: "#FFCC18" }}>{item.title}</span>
        </li>
    ) : item.submenus.length > 0 ? (
        <li key={menuKey} className={(item.target === splitUrl[0] && splitUrl.length === 1) ? 'active' : ''}>
            <Link
                to={item.target}
                className={`iq-waves-effect ${isExpanded ? '' : 'collapsed'}`}
                data-toggle='collapse'
                aria-expanded={isExpanded}
                onClick={() => dispatch(searchChanged(''))}
            >
                <i className={item.icon}></i>
                <span>{item.title}</span>
                <i className='ri-arrow-right-s-line iq-arrow-right'></i>
            </Link>
            <ul className={`iq-submenu collapse ${isExpanded ? 'show' : ''}`} data-parent='#iq-sidebar-toggle'>
                {item.submenus.map((menu: any, index: number) => {
                    return (
                        <SideBarSubItem
                            key={`subbar-${index}`}
                            parentId={menu.parentId}
                            id={menu.id}
                            title={menu.title}
                            target={menu.target}
                            icon={menu.icon}
                            isActive={splitUrl.length > 1 || location.pathname === menu.target}
                            actions={menu.actions} module={menu.module} />
                    )
                })}
            </ul>
        </li>
    ) : (
        <li key={menuKey} className={(item.target === splitUrl[0] && splitUrl.length === 1) || (item.target === splitUrl[0] && splitUrl.length > 1) ? 'active' : ''} onClick={() => { dispatch(setActions(item.actions)); dispatch(searchChanged('')) }}>
            <Link to={item.target} className='iq-waves-effect '>
                <i className={item.icon}></i>
                <span>{item.title}</span>
            </Link>
        </li>
    )
}
