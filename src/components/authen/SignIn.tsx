import { FormikErrors, useFormik } from "formik";
import { LoginProps } from "../../types";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loginCall } from "../../slices/signin/signin.slice";
import { LocalLoginInfo } from "../../model/LoginInfo.model";
import { setSidebar, unActiveMenues } from "../../slices/sidebar/sidebar.slice";
import { InputText } from "primereact/inputtext";
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { classNames } from "primereact/utils";
import { getFormErrorMessage, isFormFieldInvalid } from "../../utils/validate";
import { Spinner } from "react-bootstrap";
import { failed } from "../../utils/alert";
import { setModule } from "../../slices/app.slice";
export default function SignInPage(){
    const dispatch=useAppDispatch()
    const signinState = useAppSelector((state) => state.signin)
    const [rememberChecked, setRememberChecked] = useState(localStorage.getItem('remember_username') !== null)
    const [deviceId, setDeviceId] = useState('')
    const formik = useFormik<LoginProps>({
        initialValues: {
            username:rememberChecked?localStorage.getItem('remember_username')??'':'',
            password:rememberChecked?localStorage.getItem('remember_password')??'':''
          },
        validate: (data) => {
            let errors:FormikErrors<LoginProps>={};
            if (!data.username) {
                errors.username = 'Yêu cầu tên nhập tài khoản.';
            }
            if (!data.password) {
                errors.password = 'Yêu cầu nhập mật khẩu.';
            }
            return errors;
        },
        onSubmit: (data) => {
            dispatch(setModule(''))
            dispatch(loginCall(new LocalLoginInfo(data.username, data.password, rememberChecked, deviceId)))
            dispatch(unActiveMenues())
        }
    });
    useEffect(() => {
        switch (signinState.status) {
            case "completed":
                if(signinState.authoried){
                    const localUser = localStorage.getItem('user')
                    const user = JSON.parse(localUser ?? '{}')
                    dispatch(setSidebar(user.sidebars))
                }
                
                break
            case "failed":
                failed(signinState.error);
                break
        }
      }, [signinState])
    useEffect(() => {
        let deviceId = localStorage.getItem('deviceId')
        if (!deviceId) {
          deviceId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
          localStorage.setItem('deviceId', deviceId)
        }
        setDeviceId(deviceId)
    }, [])
    return (<form onSubmit={formik.handleSubmit}>
        <div className='sign-in-from' style={{pointerEvents:signinState.status == 'loading'?"none":"unset"}}>
            <h2 className='mb-0' style={{textAlign:"center"}}><>ĐĂNG NHẬP</></h2>
            <p style={{textAlign:"center"}}>Nhập tên tài khoản và mật khẩu để truy cập trình quản lý.</p>
            <div className="form-group">
                <label htmlFor="uname">Tên tài khoản:</label>
                <InputText
                    id="username"
                    name="username"
                    autoFocus={true}
                    value={formik.values.username}
                    onChange={(e) => {
                        formik.setFieldValue('username', e.target.value);
                        }}
                    className={classNames({ 'p-invalid': isFormFieldInvalid('username',formik) })}
                    placeholder="Tên tài khoản"
                    style={{width: "100%",borderRadius: "10px"}}
                />
                {getFormErrorMessage("username",formik)}
            </div>
            <div className="form-group mt-2">
                <label htmlFor="password">Mật khẩu:</label>
                <Password
                    inputId="password"
                    name="password"
                    className={classNames({ 'p-invalid': isFormFieldInvalid('password',formik)})}
                    value={formik.values.password}
                    feedback={false}
                    onChange={(e) => {
                        formik.setFieldValue('password', e.target.value);
                    }}
                    placeholder="Mật khẩu"
                    toggleMask
                    inputStyle={{width: "100%",borderRadius: "10px"}} style={{width: "100%"}}
                />
                {getFormErrorMessage("password",formik)}
            </div>
            <div className="form-group pt-2 mt-2">
                <div className="row">
                    <div className="d-flex col-md-6">
                        <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={rememberChecked}
                                    onChange={(e) => setRememberChecked(e.checked ?? false)}
                                ></Checkbox>
                                <label className="ms-1" htmlFor="remember">Ghi nhớ đăng nhập</label>
                            </div>
                            <div className="col-md-6">
                                {signinState.status == 'loading' ? (
                                    <Spinner className='float-end' />
                                ) : (<button type='submit' className='btn btn-primary float-end'>Đăng nhập</button>)}
                            </div>
                        </div>

                    </div>
                </div>

            </form>)
}