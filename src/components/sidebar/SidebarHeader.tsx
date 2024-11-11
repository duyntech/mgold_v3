import { Link } from "react-router-dom";
import Assets from "../../assets";
import SidebarToggler from "../commons/SidebarToggler";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { minimumSidebar, sidebarChangeLocale } from "../../slices/sidebar/sidebar.slice";
import { isMobile } from "../../utils/util";

export default function SideBarHeader() {
    const minimum = useAppSelector((state) => state.sidebar.minimum)
    const dispatch = useAppDispatch()
    const mobile=isMobile()
    
    useEffect(() => {
        minimum ? document.body.classList.remove('sidebar-main') : document.body.classList.add('sidebar-main')
    }, [minimum])
    useEffect(() => {
        dispatch(sidebarChangeLocale(''))
    }, [])
    
    return (
        <div className='iq-sidebar-logo d-flex justify-content-between'>
            <Link to='/home' className="d-flex">
                {!minimum&&!mobile?<img src={Assets.images.logoIcon} style={{width:45}} className='img-fluid' alt='' />:<img src={Assets.images.logoWhite} className='img-fluid' alt='' />}
            </Link>
            <div className='iq-menu-bt-sidebar' onClick={() => dispatch(minimumSidebar())}>
                <div className='iq-menu-bt align-self-center'>
                <SidebarToggler className={`wrapper-menu ${minimum ? 'open' : ''}`} />
                </div>
            </div>
        </div>
        )
    }