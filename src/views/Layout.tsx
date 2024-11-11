import { Header } from '../components/header'
import { Footer } from '../components/footer'
import SideBar from '../components/sidebar/Sidebar'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import '../index.css'
import { GoToTop } from '../components/commons'
import { AuthService } from '../services/Auth.service'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setActions, setActivedTarget, setSidebar } from '../slices/sidebar/sidebar.slice'
import { SidebarItemModel } from '../model'
import { resetActionState, updateCategories } from '../slices/category/category.slice'
import { Toast } from 'primereact/toast';
type Props = {
  children: JSX.Element
  target:string
}
export default function Layout(props: Props) {
    const authService = new AuthService()
    const user = authService.getCurrentUser()
    const toast = useRef<any>(null);
    const dispatch = useAppDispatch()
    const appState=useAppSelector(state=>state.app)
    const goldtypeState=useAppSelector(state=>state.goldtype)
    const retailState=useAppSelector(state=>state.retail)
    const productState=useAppSelector(state=>state.productstorage)
    const productTypeState=useAppSelector(state=>state.producttype)
    const tagState=useAppSelector(state=>state.tag)
    const importState=useAppSelector(state=>state.import)
    const weborderState=useAppSelector(state=>state.weborder)
    const categoryState=useAppSelector(state=>state.category)
    const descriptionState=useAppSelector(state=>state.description)
    const [isLoggedIn,setIsLoggedIn]=useState(false)
    const [isSetAction,setIsSetActive]=useState(false)
    const sidebars=useAppSelector((state)=>state.sidebar.items)
    const activeSidebar=(items:SidebarItemModel[]|undefined)=>{
        const validated=items!==undefined?items.find((e)=>e.target===props.target):undefined
        if(validated){
            dispatch(setActions(validated.actions))
            dispatch(setActivedTarget(validated.target))
        }
        
    }
    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'Đã cập nhật dữ liệu Website ', life: 3000});
    }
    const showError = () => {
        toast.current.show({severity:'error', summary: 'Error', detail:'Cập nhật dữ liệu Website thất bại. Vui lòng thử lại!', life: 3000});
    }
    const showInfo = () => {
        toast.current.show({severity:'info', summary: 'Info', detail:'Đang cập nhật dữ liệu Website', life: 9000});
    }
    useMemo(() => {
        if(!user||!appState.logined){
            authService.logout()
        }
        else if (user&&user.sidebars&&!isLoggedIn) {
            const storageSidebars=user.sidebars as SidebarItemModel[]
            activeSidebar(storageSidebars)
            dispatch(setSidebar(user.sidebars))
            setIsLoggedIn(true)
        }
    }, [user,isLoggedIn,appState.logined])
    useEffect(() => {
        if(!isSetAction){
            activeSidebar(sidebars)
            setIsSetActive(true)
        }
    }, [sidebars,isSetAction])
    useEffect(()=>{
        switch (categoryState.statusAction) {
            case "loading":
                showInfo()
                break;
            case "failed":
                showError()
                dispatch(resetActionState(''))
                break;
            case "completed":
                showSuccess()
                dispatch(resetActionState(''))
                break;
        
            
        }
    },[categoryState.statusAction])
    useEffect(()=>{
        if(goldtypeState.statusAction){
            if(goldtypeState.statusAction==="completed"){
                dispatch(updateCategories())
            } 
        }
    },[goldtypeState.statusAction])
    useEffect(()=>{
        if(productState.statusAction){
            if(productState.statusAction==="completed"){
                dispatch(updateCategories())
            } 
        }
    },[productState.statusAction])
    useEffect(()=>{
        if(retailState.statusAction){
            if(retailState.statusAction==="completed"){
                dispatch(updateCategories())
            } 
        }
    },[retailState.statusAction])
    useEffect(()=>{
        if(productTypeState.statusAction){
            if(productTypeState.statusAction==="completed"){
                dispatch(updateCategories())
            } 
        }
    },[productTypeState.statusAction])
    useEffect(()=>{
        if(tagState.statusAction){
            if(tagState.statusAction==="completed"){
                dispatch(updateCategories())
            } 
        }
    },[tagState.statusAction])
    useEffect(()=>{
        if(importState.statusAction){
            if(importState.statusAction==="completed"){
                dispatch(updateCategories())
            } 
        }
    },[importState.statusAction])
    useEffect(()=>{
        if(weborderState.statusAction){
            if(weborderState.statusAction==="completed"){
                dispatch(updateCategories())
            } 
        }
    },[weborderState.statusAction])
    useEffect(()=>{
        if(descriptionState.statusAction){
            if(descriptionState.statusAction==="completed"){
                dispatch(updateCategories())
            } 
        }
    },[descriptionState.statusAction])
    return (
        <div className='wrapper'>
        {isLoggedIn ?
            //validatedMenu?
            <>
                <Toast ref={toast} />
                <SideBar />
                <div id='content-page' className='content-page box'>
                    <Header />
                    <div className='body-content'>
                        <Suspense fallback={<></>}>{props.children}</Suspense>
                    </div>
                    <Footer />
                </div>
                <GoToTop/>
            </>
            //:firstMenu?<Navigate to={firstMenu.target} />:<Navigate to={"/"} />
        :<Navigate to='/signin' />
        }
        </div>
    )
}
