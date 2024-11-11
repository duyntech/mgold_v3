import { FormikErrors, useFormik } from "formik";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import * as Alert from "../../utils/alert";
import {forceResetGA, resetForceGAState } from "../../slices/profile/profile.slice";
import EmptyHeight from "../../components/commons/EmptyHeight";
import Card from "../../components/commons/Card";
import { isFormFieldInvalid } from "../../utils/validate";
import { t } from "i18next";
export default function  ResetGA(){
    const profileState = useAppSelector((state) => state.profile);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const profile = profileState.item;
    const disableInput=!["INS","UPD"].includes(profileState.action)
    const formik = useFormik<{
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
            const submitData={
                id:profile.id,
                password:data.pass
            }
            //console.log(submitData);
            dispatch(forceResetGA(submitData));
        }
    });
    const handleCancel = () => {
        navigate(-1)
    }
    useEffect(() => {
        switch (profileState.statusForceResetGA) {
            case 'failed':
                Alert.failed(profileState.error);
                //dispatch(resetActionState(''));
                break;
            case "loading":
                Alert.processing();
                break;
            case 'completed':
                Alert.completed();
                dispatch(resetForceGAState(''));
                navigate(-1);
                break;
        }
    }, [profileState.statusForceResetGA])
    return (
        <Card 
            body={<form onSubmit={formik.handleSubmit} className="p-1">
                <div className="row pt-1 col-lg-12">
                    <div className='form-group col-sm-12'>
                        <label htmlFor="pass">Mật khẩu<b className="text-danger">*</b></label>
                        <Password
                            disabled={disableInput}
                            inputId="pass"
                            name="pass"
                            className={classNames({ 'p-invalid': isFormFieldInvalid('pass',formik) })}
                            value={formik.values.pass}
                            feedback={false}
                            onChange={(e) => {
                                formik.setFieldValue('pass', e.target.value);
                            } }
                            placeholder="Nhập Mật khẩu"
                            toggleMask
                            inputStyle={{ width: "100%", borderRadius: "10px" }} style={{ width: "100%" }} />
                    </div>
                    <div className='text-danger' style={{fontSize:11}}>Sau khi Reset thành công, Người dùng sẽ phải thực hiện lại bước thiết lập xác minh 2 lớp.</div>
                </div>
                <EmptyHeight height={20} />
                <div className='fixed-bottom'>
                    <div className='d-flex justify-content-end'>
                        <button type='button' className='btn btn-outline-danger me-2' onClick={handleCancel}><i className='ri-close-line'></i> {t("action.close")}</button>
                        {profileState.action==='UPD'?
                        <button type='submit' className='btn btn-primary me-2'><i className='ri-pencil-line'></i> Xác nhận</button>
                        :<></>}
                        
                    </div>
                </div>
            </form>}
            title={<><i className="ri-refresh-line me-1"></i>Reset Google Authenticate</>}
            tool={<></>}
            isPadding={true} className={""}       
         />
        
    );
}