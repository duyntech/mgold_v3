import { FormikErrors, useFormik } from "formik";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import * as Alert from "../../utils/alert";
import { resetPassword, resetActionState } from "../../slices/profile/profile.slice";
import EmptyHeight from "../../components/commons/EmptyHeight";
import Card from "../../components/commons/Card";
import { isFormFieldInvalid } from "../../utils/validate";
import { t } from "i18next";
export default function  ResetPassword(){
    const profileState = useAppSelector((state) => state.profile);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const profile = profileState.item;
    const disableInput=!["INS","UPD"].includes(profileState.action)
    const formik = useFormik<{
        npass:'',
        rpass:''
    }>({
        initialValues: {
            npass:'',
            rpass:''
        },
        validate: (data) => {
            const errors:FormikErrors<{
                npass:'',
                rpass:''
            }> = {};
            if (!data.npass) {
                errors.npass = 'Vui lòng nhập mật khẩu mới';
            }
            if (!data.rpass) {
                errors.rpass = 'Vui lòng nhập lại mật khẩu mới';
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
            const submitData={
                id:profile.id,
                new:data.npass,
                confirm:data.rpass
            }
            //console.log(submitData);
            dispatch(resetPassword(submitData));
        }
    });
    const handleCancel = () => {
        navigate(-1)
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
    }, [profileState,dispatch])
    return (
        <Card 
            body={<form onSubmit={formik.handleSubmit} className="p-1">
                <div className="row pt-1 col-lg-12">
                    <div className="form-group col-sm-6">
                        <label htmlFor="npass">Mật khẩu mới<b className="text-danger">*</b></label>
                        <Password
                            disabled={disableInput}
                            inputId="npass"
                            name="npass"
                            className={classNames({ 'p-invalid': isFormFieldInvalid('npass',formik) })}
                            value={formik.values.npass}
                            feedback={false}
                            onChange={(e) => {
                                formik.setFieldValue('npass', e.target.value);
                            } }
                            placeholder="Mật khẩu mới"
                            toggleMask
                            inputStyle={{ width: "100%", borderRadius: "10px" }} style={{ width: "100%" }} />
                    </div>
                    <div className="form-group col-sm-6">
                        <label htmlFor="rpass">Nhập lại mật khẩu<b className="text-danger">*</b></label>
                        <Password
                            disabled={disableInput}
                            inputId="rpass"
                            name="rpass"
                            className={classNames({ 'p-invalid': isFormFieldInvalid('rpass',formik) })}
                            value={formik.values.rpass}
                            feedback={false}
                            onChange={(e) => {
                                formik.setFieldValue('rpass', e.target.value);
                            } }
                            placeholder="Nhập lại mật khẩu mới"
                            toggleMask
                            inputStyle={{ width: "100%", borderRadius: "10px" }} style={{ width: "100%" }} />
                    </div>
                </div>
                <EmptyHeight height={20} />
                <div className='fixed-bottom'>
                    <div className='d-flex justify-content-end'>
                        <button type='button' className='btn btn-outline-danger me-2' onClick={handleCancel}><i className='ri-close-line'></i> {t("action.close")}</button>
                        {profileState.action==='UPD'?
                        <button type='submit' className='btn btn-primary me-2'><i className='ri-pencil-line'></i> Làm mới</button>
                        :<></>}
                        
                    </div>
                </div>
            </form>}
            title={<><i className="ri-refresh-line me-1"></i> Làm mới mật khẩu</>}
            tool={<></>}
            isPadding={true} className={""}       
         />
        
    );
}