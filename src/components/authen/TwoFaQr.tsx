import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { setTwoOtp } from "../../slices/signin/signin.slice"
import TwoFaVerify from "./TwoFaVerify"

export default function TwoFaQr(){
    const dispatch=useAppDispatch()
    const signinState = useAppSelector((state) => state.signin)
    return (
        <>
            {signinState.twofa_otp?
            <TwoFaVerify/>
            :<div className='sign-in-from text-center'>
                <h2 className='mb-0' style={{textAlign:"center"}}><>XÁC THỰC LỚP 2</></h2>
                <p>Vui lòng tải ứng dụng <b>Google Authenticator</b> hoặc cài tiện ích này trên trình duyệt và scan mã QR dưới đây. Nhấn Tiếp tục để thực hiện xác thực.</p>
                <img src={signinState.twofa_qr_image} alt="QR"/>
                <div><button type="button" className={`btn btn-outline-primary `} onClick={()=>dispatch(setTwoOtp(true))}>Tiếp tục</button></div>
            </div>}
        </>
    )
}