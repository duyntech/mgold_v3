import Assets from "../../assets";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import Spinner from 'react-bootstrap/Spinner'
import { useState,useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { classNames } from 'primereact/utils';
import { FormikErrors, useFormik } from 'formik';
import * as Alert from "../../utils/alert"
import { addItem, changeAction, deleteItem, editItem, resetActionState, restoreItem } from "../../slices/profile/profile.slice";
import Card from "../../components/commons/Card";
import { EmptyHeight } from "../../components/commons";
import { ProfileModel } from "../../model/Profile.model";
import FormAction from "../../components/commons/FormAction";
import { isFormFieldInvalid } from "../../utils/validate";
import { InputSwitch } from "primereact/inputswitch";
import ActionButton from "../../components/action/ActionButton";
import { fetchCategories } from "../../slices/category/category.slice";
import { t } from "i18next";
import { warningWithConfirm } from "../../utils/alert";
import { InputNumber } from "primereact/inputnumber";

export default function AddProfile() {
    const uploadState = useAppSelector((state) => state.upload);
    const profileState = useAppSelector((state) => state.profile);
    const categoryState = useAppSelector((state) => state.category);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const fileRef = useRef<HTMLInputElement>(null);
    const [imageUrl, _setImageUrl] = useState(null);
    const disableInput=!["INS","UPD"].includes(profileState.action)
    const formik = useFormik<ProfileModel>({
        initialValues: profileState.item,
        validate: (data) => {
            //console.log("validata data",data)
            const errors:FormikErrors<ProfileModel> = {};
            if (!data.role) {
                errors.role!.code = 'Vui lòng chọn vai trò';
            }
            if (!data.username) {
                errors.username = 'Vui lòng nhập tên tài khoản';
            }
            if (!data.fullName) {
                errors.fullName = 'Vui lòng nhập Họ và Tên';
            }
            if (!data.expireTime||data.expireTime===0) {
                errors.expireTime = 'Vui lòng nhập số phút của phiên đăng nhập lớn hơn 0!';
            }
            if (!data.accessTime||data.accessTime===0) {
                errors.accessTime = 'Vui lòng nhập số phút truy xuất dữ liệu lớn hơn 0!';
            }
            return errors;
        },
        onSubmit: (data) => {
            let submitData={
                id:data.id,
                username:data.username,
                first_name:data.firstName,
                last_name:data.lastName,
                full_name:data.fullName,
                code:"",
                phone:data.phone,
                email:data.email,
                address:data.address,
                is_online:data.isOnline,
                ip_address:data.ipAddress,
                role:data.role._id,
                expire_time:data.expireTime,
                access_time:data.accessTime,
                type:"EMPLOYEE"
            }
            switch (profileState.action) {
                case "INS":
                    dispatch(addItem(submitData));
                break
                case "UPD":
                    dispatch(editItem(submitData));
                break
                case "DEL":
                    dispatch(deleteItem(submitData));
                break
            }
        }
    });    
    const handleCancel = () => {
        navigate(-1)
      }
    const handleRestore = () => {
        dispatch(restoreItem({id:profileState.item.id}));
    }
    const handleDelete = () => {
        warningWithConfirm({
            title: "Xóa",
            text: "Bạn muốn xóa Tài khoản "+profileState.item.username +" ?",
            confirmButtonText: "Đồng ý",
            confirm: ()=>{
                dispatch(deleteItem({id:profileState.item.id}))
            }
        })
        
    }
    useEffect(() => {
        switch (categoryState.status) {
            case 'failed':
                Alert.failed(categoryState.error);
                break;
            case 'completed':
                setRoles(categoryState.data.roles??[]);
                break;
        }
    }, [categoryState])
    useEffect(() => {
        switch (profileState.statusAction) {
            case 'failed':
                Alert.failed(profileState.error);
                break;
            case "loading":
                Alert.processing();
                break;
            case 'completed':
                Alert.completed();
                dispatch(resetActionState(''));
                break;
        }
    }, [profileState,dispatch])
    
    useEffect(() => {
        dispatch(fetchCategories({ categories: ['roles']}))
      }, [])
    return (
        <>
            <div className='row'>
                <div className='col-lg-3'>
                    <Card  
                        title={<>Tài khoản mới</>}
                        tool={<></>}
                        isPadding={true}
                        body={<div>
                            <div className="form-group text-center pt-3">
                                <div className="add-img-user profile-img-edit">
                                    <div className="rounded-circle box-150 position-relative">
                                        <img className="profile-pic img-fluid" src={imageUrl ?? Assets.images.user08} alt="profile-pic" />
                                        {uploadState.status === 'loading' ? <Spinner animation="border" variant="info" className="absolulte-center" /> : <></>}
                                    </div>
                                    <div className="p-image text-center">
                                        {/* <a onClick={uploadClick} className="upload-button btn iq-bg-primary">Chọn hình</a> */}
                                        <input className="file-upload" 
                                        type="file" ref={fileRef} 
                                        accept="image/*" 
                                        onChange={()=>{}} />
                                    </div>
                                </div>
                                <div className="img-extension mt-3">
                                    <div className="d-inline-block align-items-center">
                                        <span>Hỗ trợ</span>
                                        <a>.jpg</a>
                                        <a>.jpeg</a>
                                        <a>.png</a>
                                        {/* <span>allowed</span> */}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Vai trò<b className="text-danger">*</b></label>
                                <Dropdown
                                    value={roles.find((e)=> Object(e)._id===formik.values.role._id)}
                                    options={roles}
                                    optionLabel="name"
                                    disabled={disableInput}
                                    onChange={(e) => {
                                        //console.log(e.value)
                                        formik.setFieldValue('role', e.value);
                                    } }
                                    placeholder='Chọn vai trò'
                                    className={classNames({ 'p-invalid': isFormFieldInvalid('role', formik) })}
                                    style={{ width: '100%' }} />
                            </div>

                        </div>} className={""}
                    />
                </div>
                <div className='col-lg-9'>
                    <Card  
                        title={<>Thông tin tài khoản</>}
                        tool={<></>}
                        isPadding={true}
                        body={<div className="mt-2">
                            <div className="row mb-2">
                                <div className="form-group col-md-12">
                                    <label htmlFor="username">Tài khoản<b className="text-danger">*</b></label>
                                    <InputText
                                        id="username"
                                        name="username"
                                        disabled={disableInput}
                                        value={formik.values.username}
                                        onChange={(e) => {
                                            formik.setFieldValue('username', e.target.value);
                                        } }
                                        className={classNames({ 'p-invalid': isFormFieldInvalid('username', formik) })}
                                        placeholder="Tên tài khoản"
                                        style={{ width: "100%", borderRadius: "10px",textTransform:'lowercase' }} />
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="form-group col-md-12">
                                    <label htmlFor="fullName">Họ và Tên<b className="text-danger">*</b></label>
                                    <InputText
                                        id="fullName"
                                        name="fullName"
                                        disabled={disableInput}
                                        value={formik.values.fullName}
                                        onChange={(e) => {
                                            formik.setFieldValue('fullName', e.target.value);
                                        } }
                                        className={classNames({ 'p-invalid': isFormFieldInvalid('fullName', formik) })}
                                        placeholder="Họ và tên"
                                        style={{ width: "100%", borderRadius: "10px" }} />
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="form-group col-md-6">
                                    <label htmlFor="mobno">Số điện thoại</label>
                                    <InputText
                                        id="phone"
                                        name="phone"
                                        disabled={disableInput}
                                        value={formik.values.phone}
                                        onChange={(e) => {
                                            formik.setFieldValue('phone', e.target.value);
                                        } }
                                        placeholder="Số điện thoại"
                                        style={{ width: "100%", borderRadius: "10px" }} />

                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="email">Email</label>
                                    <InputText
                                        type="email"
                                        id="email"
                                        name="email"
                                        disabled={disableInput}
                                        value={formik.values.email}
                                        onChange={(e) => {
                                            formik.setFieldValue('email', e.target.value);
                                        } }
                                        placeholder="Email"
                                        style={{ width: "100%", borderRadius: "10px" }} />
                                </div>
                            </div>
                            
                            <div>
                                <div className="form-group col-md-12">
                                    <label htmlFor="address">Địa chỉ</label>
                                    <InputText
                                        id="address"
                                        name="address"
                                        disabled={disableInput}
                                        value={formik.values.address}
                                        onChange={(e) => {
                                            formik.setFieldValue('address', e.target.value);
                                        } }
                                        placeholder="Địa chỉ"
                                        style={{ width: "100%", borderRadius: "10px" }} />
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="form-group col-md-6">
                                    <label htmlFor="expire-time">Phiên đăng nhập(phút)<b className="text-danger">*</b></label>
                                    <InputNumber
                                        id="expire-time"
                                        name="expire-time"
                                        disabled={disableInput}
                                        value={formik.values.expireTime}
                                        onChange={(e) => {
                                            console.log(e.value)
                                            formik.setFieldValue('expireTime', e.value);
                                        } }
                                        className={classNames({ 'p-invalid': isFormFieldInvalid('expireTime', formik) })}
                                        style={{ width: "100%", borderRadius: "10px" }} />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="access-time">Thời gian truy xuất dữ liệu(phút)<b className="text-danger">*</b></label>
                                    <InputNumber
                                        id="access-time"
                                        name="access-time"
                                        disabled={disableInput}
                                        value={formik.values.accessTime}
                                        onChange={(e) => {
                                            console.log(e.value)
                                            formik.setFieldValue('accessTime', e.value);
                                        } }
                                        className={classNames({ 'p-invalid': isFormFieldInvalid('accessTime', formik) })}
                                        style={{ width: "100%", borderRadius: "10px" }} />
                                </div>
                                
                            </div>
                            <div className="row mb-2">
                                
                                <div className="form-group col-md-6 d-flex justify-content-between p-3">
                                    <label htmlFor="mobno">Truy cập từ xa</label>
                                    <InputSwitch
                                        id="online"
                                        name="online"
                                        checked={formik.values.isOnline}
                                        onChange={(e) => {
                                            formik.setFieldValue('isOnline', e.value);
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="ip-address">Địa chỉ Ip</label>
                                    <InputText
                                        id="ip-address"
                                        name="ip-address"
                                        disabled={disableInput||!formik.values.isOnline}
                                        value={formik.values.ipAddress}
                                        onChange={(e) => {
                                            formik.setFieldValue('ipAddress', e.target.value);
                                        } }
                                        placeholder="123.123.123.123,10.10.10.10"
                                        style={{ width: "100%", borderRadius: "10px" }} />
                                </div>
                            </div>
                        </div>} 
                        className={""}
                    />
                </div>
            </div>
            <EmptyHeight height={48}/>
            <div className='fixed-bottom'>
                <div className='d-flex justify-content-end'>
                    <button type='button' className='btn btn-outline-danger me-2' onClick={()=>handleCancel()}><i className='ri-close-line'></i> <span className="list-action-label">{t("action.close")}</span></button>
                    {profileState.action==='VIE'?
                        profileState.item.disabled?
                        <ActionButton action={"UND"} className={"me-2"} minimumEnable={true} label={"Phục hồi"} onClick={()=>handleRestore()}/>
                        :<>
                            <ActionButton action={"UPD"} className={"me-2"} minimumEnable={true} label={"Sửa"} onClick={()=>dispatch(changeAction("UPD"))}/>
                            <ActionButton action={"DEL"} className={"me-2"} minimumEnable={true} label={"Xóa"} onClick={()=>handleDelete()}/>
                        </>
                        
                    :<></>}
                    <FormAction action={profileState.action} onClick={()=>formik.handleSubmit()}/>
                </div>
            </div>
        </>
        );
}