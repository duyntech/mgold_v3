import AuthenContainer from "../../components/commons/AuthenContainer";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { AuthService } from "../../services/Auth.service";
import TwoFaQr from "../../components/authen/TwoFaQr";
import TwoFaVerify from "../../components/authen/TwoFaVerify";
import SignInPage from "../../components/authen/SignIn";
export default function SignIn() {
    const signinState = useAppSelector((state) => state.signin)
    const authService = new AuthService()
    const user = authService.getCurrentUser()
    return(
    user===null?
        <AuthenContainer>
            {signinState.twofa_qr?
                <TwoFaQr/>
            :signinState.twofa_otp?
                <TwoFaVerify/>
                :<SignInPage/>
            }
        </AuthenContainer>
        :<Navigate to='/' />
    )
}