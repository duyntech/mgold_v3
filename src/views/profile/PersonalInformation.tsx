import { ChangeEvent, useEffect, useRef, useState } from "react";
import Spinner from "react-bootstrap/esm/Spinner";
import Assets from "../../assets";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { FormikErrors, useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Alert from "../../utils/alert";
import { editItem, resetActionState } from "../../slices/profile/profile.slice";
import EmptyHeight from "../../components/commons/EmptyHeight";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { ProfileModel } from "../../model/Profile.model";
import { isFormFieldInvalid } from "../../utils/validate";

export default function  PersonalInformation(){
    const uploadState = useAppSelector((state) => state.upload);
    const profileState = useAppSelector((state) => state.profile);
    const fileRef = useRef<HTMLInputElement>(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [file, _setFile] = useState(null);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const profile = profileState.item;
    
    const handleFileSelect = (_e:ChangeEvent<HTMLInputElement>) => {
        /* if(e.target.files?.item(0).size > 1048075){
            alert.warning("File size must less than 1M!");
        }
        else{
            setFile(e.target.files?.item(0));
        } */
    }
    useEffect(() => {
        switch (profileState.statusAction) {
            case 'failed':
                Alert.failed(profileState.error);
                dispatch(resetActionState(''));
                break;
            case "loading":
                Alert.processing();
                break;
            case 'completed':
                Alert.completed();
                dispatch(resetActionState(''));
                navigate(-1);
                break;
        }
    }, [profileState.statusAction])
    useEffect(() => {
        uploadToS3()
    }, [file])
    useEffect(() => {
        switch (uploadState.status) {
            case 'failed':
                Alert.failed(uploadState.error);
                break;
            case 'completed':
                setImageUrl(uploadState.data.location);
                formik.setFieldValue('image', uploadState.data.location);
                break;
        }
    }, [uploadState])
    const uploadClick = () => {
        fileRef.current?.click();
    }
    const uploadToS3 = async () => {
        if (!file) {
          return;
        }
        const data = new FormData() 
        data.append('file', file);
        //dispatch(uploadImage(data));
    }
    const roleStates=["Chủ","Nhân viên bán hàng", "Kế toán"];
    const formik = useFormik<ProfileModel>({
        initialValues: profile,
        validate: (data) => {
            const errors:FormikErrors<any> = {};
            if (!data.username) {
                errors.username = 'Nhập thông tin.';
            }
            if (!data.role) {
                errors.role = 'Nhập thông tin.';
            }
            if (!data.firstName) {
                errors.firstName = 'Nhập thông tin.';
            }
            if (!data.lastName) {
                errors.lastName = 'Nhập thông tin.';
            }
            return errors;
        },
        onSubmit: (_data) => {
            console.log('submit');
            const submitData={}
            dispatch(editItem(submitData));
        }
    });
    const handleCancel = () => {
        navigate(-1)
    }
   
    return (
        <form onSubmit={formik.handleSubmit} className="p-3">
            <div className="row align-items-center">
                <div className="col-md-12">
                    <div className="rounded-circle box-150 position-relative">
                        <img className="profile-pic img-fluid" src={imageUrl??Assets.images.user08} alt="profile-pic"/>
                        {uploadState.status==='loading'?<Spinner animation="border" variant="info" className="absolulte-center"/>:<></>}
                        <div className="p-image text-center">
                            <i className="ri-pencil-line upload-button" onClick={uploadClick}></i>
                            <input className="file-upload" type="file" ref={fileRef} accept="image/*" onChange={e=>handleFileSelect(e)}/>
                        </div>
                    </div>
                </div>
            </div>
             <div>
                <div className="row pt-3">
                    <div className="col-sm-6">
                        <label htmlFor="username">Tên tài khoản</label>
                        <InputText
                            id="username"
                            name="username"
                            value={formik.values.username}
                            onChange={(e) => {
                                formik.setFieldValue('username', e.target.value);
                            }}
                            className={classNames({ 'p-invalid': isFormFieldInvalid('username', formik) })}
                            placeholder="Tên tài khoản"
                            style={{width: "100%",borderRadius: "10px"}}
                        />
                    </div>
                    <div className="col-sm-6">
                        <label>Vai trò:</label>
                        <Dropdown
                            value={formik.values.role}
                            options={roleStates}
                            onChange={(e) => {
                                formik.setFieldValue('role', e.value);
                            }}
                            placeholder='Chọn vai trò'
                            className={classNames({ 'p-invalid': isFormFieldInvalid('role', formik) })}
                            style={{ width: '100%' }}
                        />
                    </div>  
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="lastName">Họ</label>
                        <InputText
                            id="lastName"
                            name="lastName"
                            value={formik.values.lastName}
                            onChange={(e) => {
                                formik.setFieldValue('lastName', e.target.value);
                            }}
                            className={classNames({ 'p-invalid': isFormFieldInvalid('lname', formik)})}
                            placeholder="Họ"
                            style={{width: "100%",borderRadius: "10px"}}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="firstName">Tên</label>
                        <InputText
                            id="firstName"
                            name="firstName"
                            value={formik.values.firstName}
                            onChange={(e) => {
                                formik.setFieldValue('fname', e.target.value);
                            }}
                            className={classNames({ 'p-invalid': isFormFieldInvalid('firstName', formik)})}
                            placeholder="Tên"
                            style={{width: "100%",borderRadius: "10px"}}
                        />
                    
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="phone">Số điện thoại</label>
                        <InputText
                            id="phone"
                            name="phone"
                            value={formik.values.phone}
                            onChange={(e) => {
                                formik.setFieldValue('phone', e.target.value);
                            }}
                            placeholder="Số điện thoại"
                            style={{width: "100%",borderRadius: "10px"}}
                        />
                        
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="email">Email</label>
                        <InputText
                            type="email"
                            id="email"
                            name="email"
                            value={formik.values.email}
                            onChange={(e) => {
                                formik.setFieldValue('email', e.target.value);
                            }}
                            placeholder="Email"
                            style={{width: "100%",borderRadius: "10px"}}
                        />
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="address">Địa chỉ</label>
                        <InputText
                            id="address"
                            name="address"
                            value={formik.values.address}
                            onChange={(e) => {
                                formik.setFieldValue('address', e.target.value);
                            }}
                            placeholder="Địa chỉ"
                            style={{width: "100%",borderRadius: "10px"}}
                        />
                    </div>
                </div>
                
            </div>
            <EmptyHeight height={50}/>
            <div className='fixed-bottom'>
                <div className='d-flex justify-content-end'>
                <button type='button' className='btn btn-outline-danger' onClick={handleCancel}><i className='ri-close-line'></i> Hủy</button>
                <button type='submit' className='btn btn-primary ms-3'><i className='ri-add-line'></i> Cập nhật</button>
                </div>
            </div>
        </form>
    );
}