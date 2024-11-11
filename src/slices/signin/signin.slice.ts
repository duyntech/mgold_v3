import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { AuthService, AuthenManager } from '../../services/Auth.service'
import { BasicSliceState } from '../state'
import { t } from 'i18next'
const authenManager = new AuthenManager()
export const loginCall = createAsyncThunk('signin/login', async (data: any) => {
    const authenService = new AuthService()
    const response = authenService.login(data, authenManager)
    return response
})
export const verify2faCall = createAsyncThunk('signin/verify2fa', async (data: any) => {
    const authenService = new AuthService()
    const response = authenService.verify2fa(data)
    return response
})
interface SigninState extends BasicSliceState {
    remember: boolean
    twofa_qr:boolean,
    twofa_qr_image:string,
    twofa_otp:boolean,
    authoried:boolean,
}
const initialState: SigninState = {
    remember: false,
    twofa_qr:false,
    twofa_qr_image:'',
    twofa_otp:false,
    authoried:false,
    status: 'idle',
    error: '',
    action: 'VIE'
}

export const signinSlice = createSlice({
    name: 'signin',
    initialState,
    reducers: {
        setTwoOtp: (state, action) => {
            state.twofa_otp=action.payload
        },
        resetStatus: (state, _action) => {
            state.status="idle"
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginCall.pending, (state, _action) => {
            state.status = 'loading'
        })
        .addCase(loginCall.fulfilled, (state, action) => {
            state.status = 'completed'
            if(action.payload.two_fa_qr_url){
                state.twofa_qr=true
                state.twofa_qr_image=action.payload.two_fa_qr_url
            }
            else if(action.payload.two_fa_otp){
                state.twofa_otp=action.payload.two_fa_otp
            }
            else{
                state.authoried=true
            }
        })
        .addCase(loginCall.rejected, (state, action) => {
            //console.log("error:",action.error)
            state.status = 'failed'
            const code=action.error.code??'SYSTEM_ERROR'
            state.error =code==="ERR_BAD_REQUEST"?"Tài khoản hoặc mật khẩu không đúng!": t("response."+code)
        })
        .addCase(verify2faCall.pending, (state, _action) => {
            state.status = 'loading'
        })
        .addCase(verify2faCall.fulfilled, (state, _action) => {
            state.status = 'completed'
            state.authoried=true
        })
        .addCase(verify2faCall.rejected, (state, action) => {
            console.log("error:",action.error)
            state.status = 'failed'
            const code=action.error.code??'SYSTEM_ERROR'
            state.error =t("response."+code)
        })
    }
})
export const {setTwoOtp,resetStatus} = signinSlice.actions
export default signinSlice.reducer
