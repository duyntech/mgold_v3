import { InputMask } from "primereact/inputmask";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { failed, warning } from "../../utils/alert";
import { resetStatus, verify2faCall } from "../../slices/signin/signin.slice";
//import { setSidebar } from "../../slices/sidebar/sidebar.slice";
//import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { setLogined } from "../../slices/app.slice";
export default function TwoFaVerify() {
    const dispatch = useAppDispatch()
    //const navigate=useNavigate()
    const signinState = useAppSelector((state) => state.signin)
    const [value, setValue] = useState<any>('')
    const handleVerify = (pin: string) => {
        const username = localStorage.getItem('username')
        const deviceId = localStorage.getItem('userDeviceId')
        if (pin.length === 6) {
            dispatch(verify2faCall({
                username: username,
                token: pin,
                device: deviceId
            }))
        }
        else {
            warning({ title: "Mã không hợp lệ", onClose: () => { } })
        }
    }
    useEffect(() => {
        switch (signinState.status) {
            case "completed":
                dispatch(setLogined(true))
                dispatch(resetStatus(''))
                break
            case "failed":
                failed(signinState.error)
                dispatch(resetStatus(''))
                break
        }
    }, [signinState])
    return (
        <div className='sign-in-from text-center'>
            <h2 className='mb-0' style={{ textAlign: "center" }}><>XÁC THỰC LỚP 2</></h2>
            <p>Vui lòng nhập 6 ký tự từ ứng đụng <b>Google Authenticator</b> để xác thực.</p>
            {signinState.status === "loading" ?
                <Spinner />
                : <InputMask
                    autoFocus={true}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value)

                    }}
                    onComplete={(e) => {
                        const code = e.value!.toString().replace(/\-/g, '').replace(/\_/g, '')
                        handleVerify(code)
                    }}
                    mask="9-9-9-9-9-9"
                    placeholder="9-9-9-9-9-9"
                    style={{ width: 120, textAlign: "center" }}
                />}


        </div>
    )
}