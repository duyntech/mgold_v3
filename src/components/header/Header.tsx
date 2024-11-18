import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { minimumSidebar, setMenues } from "../../slices/sidebar/sidebar.slice"
import HeaderSearchBox from './HeaderSearchBox'
import { SidebarToggler } from '../commons'
import HeaderProfile from "./HeaderProfile"

import { SelectButton } from 'primereact/selectbutton';
import { setModule } from "../../slices/app.slice"
import { useNavigate } from "react-router-dom"

export default function Header() {
    const navigate = useNavigate()
    const sidebarState = useAppSelector(state => state.sidebar)
    const appState = useAppSelector(state => state.app)
    const [stick, setStick] = useState(false)
    const options = [{ code: 'RETAIL', name: 'Bán lẻ' }, { code: 'WHOLESALE', name: 'Bán sỉ' }, { code: 'PAWN', name: 'Cầm đồ' }];
    const [value, setValue] = useState(appState.module ?? 'RETAIL');
    const dispatch = useAppDispatch()
    const handleStick = () => {
        setStick(window.scrollY > 30)
    }
    useEffect(() => {
        if (appState.module !== value || appState.module === '') {
            dispatch(setModule(value === '' ? 'RETAIL' : value))
            const sidebarByModule = sidebarState.items.filter(e => e.module === (value === '' ? 'RETAIL' : value))
            dispatch(setMenues(sidebarByModule))
            navigate("/")
        }

    }, [value, appState.module])
    useEffect(() => {
        window.addEventListener('scroll', handleStick)
    }, [])
    return (
        <div className={`iq-top-navbar ${stick ? 'fixed-header' : ''}`}>
            <div className='iq-navbar-custom'>
                <nav className='navbar navbar-expand-lg navbar-light p-0'>
                    <HeaderSearchBox />
                    <SelectButton className="align-self-center ms-3 module" optionValue="code" optionLabel="name" value={value === '' ? 'RETAIL' : value} onChange={(e) => { setValue(e.value) }} options={options} />
                    <div className="d-flex flex-row-reverse" style={{ flexGrow: 1 }}>
                        <HeaderProfile />

                        <div className="align-self-center" onClick={() => dispatch(minimumSidebar())}>
                            <SidebarToggler className={'wrapper-menu'} />
                        </div>

                    </div>

                </nav>
            </div>
        </div>
    )
}