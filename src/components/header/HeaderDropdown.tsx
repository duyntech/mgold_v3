import HeaderDropdownItem from './HeaderDropdownItem'
import { DropdownItemModel } from '../../model'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { toggleHideAll } from '../../slices/header/header.slice'
import { AuthService } from '../../services/Auth.service'
import { DynamicDialog } from '../commons'
import { useEffect, useState } from 'react'
import { Password } from 'primereact/password'
import { FormikErrors, useFormik } from "formik";
import { changePassword, resetChangePassState, resetGA } from '../../slices/profile/profile.slice'
import { classNames } from 'primereact/utils'
import { isFormFieldInvalid } from '../../utils/validate'
import { completed, failed, processing } from '../../utils/alert'
import { setLogined } from '../../slices/app.slice'
import { setSidebar } from '../../slices/sidebar/sidebar.slice'
type HeaderDropdownProps = {
    title: string
    bagde: number
    status: string
    items: DropdownItemModel[]
    isProfile: boolean
}
export default function HeaderDropdown(props: HeaderDropdownProps) {
    const dispatch = useAppDispatch()
    const profileState=useAppSelector((state)=>state.profile);
    const [isShowDialog, setIsShowDialog] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);
    const formik = useFormik<{
        opass:'',
        npass:'',
        rpass:''
    }>({
        initialValues: {
            opass:'',
            npass:'',
            rpass:''
        },
        validate: (data) => {
            const errors:FormikErrors<{
                opass:'',
                npass:'',
                rpass:''
            }> = {};
            
            if (!data.opass) {
                errors.opass = 'Vui lòng nhập mật khẩu cũ';
            }
            if (!data.npass) {
                errors.npass = 'Vui lòng nhập mật mới';
            }
            if (!data.rpass) {
                errors.rpass = 'Vui lòng nhập lại mật mới';
            }
            
            if (data.npass) {
                if(data.npass!==data.rpass){
                    errors.npass = 'Mật khẩu mới không khớp';
                    errors.rpass = 'Mật khẩu mới không khớp';
                    
                }
            }
            return errors;
        },
        onSubmit: (data) => {
            const user=localStorage.getItem("userId")
            const submitData={
                id:user,
                old:data.opass,
                new:data.npass,
                confirm:data.rpass
            }
            dispatch(changePassword(submitData));
        }
    });
    const formikReset = useFormik<{
        pass:''
    }>({
        initialValues: {
            pass:''
        },
        validate: (data) => {
            const errors:FormikErrors<{
                pass:''
            }> = {};
            
            if (!data.pass) {
                errors.pass = 'Vui lòng nhập mật khẩu';
            }
            
            return errors;
        },
        onSubmit: (data) => {
            const user=localStorage.getItem("userId")
            const submitData={
                id:user,
                password:data.pass
            }
            //console.log(submitData)
            dispatch(resetGA(submitData));
        }
    });
    const handleLogout = () => {
        dispatch(toggleHideAll());
        const authService = new AuthService();
        authService.logout(); 
        dispatch(setLogined(false))
        dispatch(setSidebar([]))
        window.location.replace('/signin')
    }
    useEffect(() => {
        switch (profileState.statusChangePass) {
            case 'failed':
                failed(profileState.error);
                dispatch(resetChangePassState(''))
                break;
            case "loading":
                processing()
                break;
            case 'completed':
                completed()
                dispatch(resetChangePassState(''))
                formik.resetForm()
                handleLogout()
                break;
        }
    }, [profileState.statusChangePass])
    useEffect(() => {
        switch (profileState.statusResetGA) {
            case 'failed':
                failed(profileState.error);
                //dispatch(resetGA(''))
                break;
            case "loading":
                processing()
                break;
            case 'completed':
                completed()
                dispatch(resetGA(''))
                formikReset.resetForm()
                handleLogout()
                break;
        }
    }, [profileState.statusResetGA])
    return (
        <div className='iq-sub-dropdown'>
            <div className='iq-card shadow-none m-0'>
                <div className='iq-card-body p-0 '>
                <div className='bg-primary p-3'>
                    <h5 className='mb-0 text-white'>
                    {props.title}
                    {props.bagde > 0 ? <small className='badge  badge-light float-end pt-1'>{props.bagde}</small> : <></>}
                    {props.status !== '' ? (
                        <span className='text-white font-size-12 d-block pt-1'>{props.status}</span>
                    ) : (
                        <></>
                    )}
                    </h5>
                </div>
                {props.items.length > 0 ? (
                    props.items.map((item, index) => {
                    return <HeaderDropdownItem key={`head-drop-${index}`} item={item} />
                    })
                ) : (
                    !props.isProfile ?<div className='p-3 text-center'>Không có dữ liệu</div>:<></>
                )}
                {props.isProfile ? (
                    <div className='p-3'>
                        <button type='button' className="btn btn-outline-primary w-100" onClick={()=>setShowResetDialog(true)}>
                            Reset Google Authenticate <i className='ri-refresh-line ml-2'></i>
                        </button>
                        <button type='button' className="btn btn-outline-primary w-100 my-3" onClick={()=>setIsShowDialog(true)}>
                            Đổi mật khẩu <i className='ri-key-line ml-2'></i>
                        </button>
                        <button type='button' className="btn btn-outline-danger w-100" onClick={handleLogout} >
                            Thoát <i className='ri-login-box-line ml-2'></i>
                        </button>
                        <DynamicDialog 
                            visible={isShowDialog} 
                            position={undefined} 
                            title={<i className='ri-key-line'> Đổi mật khẩu</i>} 
                            body={
                                <div className='row pb-2' style={{width:"300px"}}>
                                    <div className='form-group col-sm-12'>
                                        <label htmlFor="opass">Mật khẩu cũ<b className="text-danger">*</b></label>
                                        <Password
                                            inputId="opass"
                                            name="opass"
                                            className={classNames({ 'p-invalid': isFormFieldInvalid('opass',formik) })}
                                            value={formik.values.opass}
                                            feedback={false}
                                            onChange={(e) => {
                                                formik.setFieldValue('opass', e.target.value);
                                            } }
                                            placeholder="Nhập Mật khẩu cũ"
                                            toggleMask
                                            inputStyle={{ width: "100%", borderRadius: "10px" }} style={{ width: "100%" }} />
                                    </div>
                                    <div className='form-group col-sm-12'>
                                        <label htmlFor="npass">Mật khẩu mới<b className="text-danger">*</b></label>
                                        <Password
                                            inputId="npass"
                                            name="npass"
                                            className={classNames({ 'p-invalid': isFormFieldInvalid('npass',formik) })}
                                            value={formik.values.npass}
                                            feedback={false}
                                            onChange={(e) => {
                                                formik.setFieldValue('npass', e.target.value);
                                            } }
                                            placeholder="Nhập Mật khẩu mới"
                                            toggleMask
                                            inputStyle={{ width: "100%", borderRadius: "10px" }} style={{ width: "100%" }} />
                                    </div>
                                    <div className='form-group col-sm-12'>
                                        <label htmlFor="rpass">Nhập lại mật khẩu mới<b className="text-danger">*</b></label>
                                        <Password
                                            inputId="rpass"
                                            name="rpass"
                                            className={classNames({ 'p-invalid': isFormFieldInvalid('rpass',formik) })}
                                            value={formik.values.rpass}
                                            feedback={false}
                                            onChange={(e) => {
                                                formik.setFieldValue('rpass', e.target.value);
                                            } }
                                            placeholder="Nhập lại Mật khẩu mới"
                                            toggleMask
                                            inputStyle={{ width: "100%", borderRadius: "10px" }} style={{ width: "100%" }} />
                                    </div>
                                    <div className='text-danger' style={{fontSize:11}}>Sau khi Đổi thành công, bạn sẽ được chuyển hướng đến trang đăng nhập.</div>
                                </div>
                                
                            } 
                            footer={
                                <button type='button' className='btn btn-primary me-2' onClick={()=>formik.handleSubmit()}><i className='ri-check-line'></i> Thay đổi</button>
                            } 
                            draggable={false} 
                            resizeable={false} 
                            onClose={()=>setIsShowDialog(false)}
                            />
                            <DynamicDialog 
                            visible={showResetDialog} 
                            position={undefined} 
                            title={<i className='ri-refresh-line'> Reset Google Authenticate</i>} 
                            body={
                                <div className='row pb-2' style={{width:"300px"}}>
                                    <div className='form-group col-sm-12'>
                                        <label htmlFor="pass">Mật khẩu<b className="text-danger">*</b></label>
                                        <Password
                                            inputId="pass"
                                            name="pass"
                                            className={classNames({ 'p-invalid': isFormFieldInvalid('pass',formikReset) })}
                                            value={formikReset.values.pass}
                                            feedback={false}
                                            onChange={(e) => {
                                                formikReset.setFieldValue('pass', e.target.value);
                                            } }
                                            placeholder="Nhập Mật khẩu"
                                            toggleMask
                                            inputStyle={{ width: "100%", borderRadius: "10px" }} style={{ width: "100%" }} />
                                    </div>
                                    <div className='text-danger' style={{fontSize:11}}>Sau khi Reset thành công, bạn sẽ được chuyển hướng đến trang đăng nhập để thực hiện lại bước thiết lập xác minh 2 lớp.</div>
                                </div>
                            } 
                            footer={
                                <button type='button' className='btn btn-primary me-2' onClick={()=>formikReset.handleSubmit()}><i className='ri-check-line'></i> Xác nhận</button>
                            } 
                            draggable={false} 
                            resizeable={false} 
                            onClose={()=>setShowResetDialog(false)}
                            />
                        </div>
                        
                ) : (
                    <></>
                )}
                </div>
            </div>
        </div>
    )
}
