//import { useNavigate } from "react-router-dom";
import SideBarItem from "./SideBarItem";
import SideBarHeader from "./SidebarHeader";
import { t } from "i18next";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { minimumSidebar } from "../../slices/sidebar/sidebar.slice";
import { isMobile } from "../../utils/util";

export default function SideBar() {
    const sidebarState = useAppSelector((state) => state.sidebar)
    const myRef = useRef<HTMLDivElement>(null)
    const dispatch = useAppDispatch()
    const mobile = isMobile()
    const handleClickOutside = (e: any) => {
        if (!myRef.current!.contains(e.target)) {
            if (!sidebarState.minimum && mobile) {
                dispatch(minimumSidebar())
            }
        }
    };
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    });
    return (
        <div className='iq-sidebar' ref={myRef}>
            <SideBarHeader />
            <div id='sidebar-scrollbar'>
                <nav className='iq-sidebar-menu'>
                    <ul id='iq-sidebar-toggle' className='iq-menu'>
                        {
                            sidebarState.menues && sidebarState.menues.map((item, index) => {
                                return (
                                    <SideBarItem
                                        key={`bar-${index}`}
                                        isExpanded={item.isExpanded}
                                        isGroup={item.isGroup}
                                        submenus={item.submenus}
                                        id={item.id}
                                        title={t(`sidebar.${item.id}`)}
                                        target={item.target}
                                        icon={item.icon}
                                        isActive={item.isActive}
                                        actions={item.actions}
                                        module={item.module} />
                                )
                            })
                        }
                    </ul>
                </nav>
            </div>
        </div>
    )
}