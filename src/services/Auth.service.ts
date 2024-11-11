import {  LocalLoginInfo, LoginInfo } from "../model/LoginInfo.model"
import { Verify2faProps } from "../types"
import { HttpService } from "./http/HttpService"

interface Authen {
    authenticate(args: LoginInfo): any
}
class LocalAuthen implements Authen {
    async authenticate(arg: LocalLoginInfo) {
        const response = await HttpService.doPostRequest(
            'login2fa',
            {
            username: arg.username,
            password: arg.password,
            device: arg.deviceId,
            loginType:'LOCAL'
            },
            false
        )
        if (response.status == 200) {
            const data = response.data
            localStorage.setItem('username', arg.username)
            localStorage.setItem('userDeviceId', arg.deviceId)
            if (arg.remember) {
                localStorage.setItem('remember_username', arg.username)
                localStorage.setItem('remember_password', arg.password)
            } else {
                localStorage.removeItem('remember_username')
                localStorage.removeItem('remember_password')
            }
            if(data.two_fa_qr_url||data.two_fa_otp){
                return data
            }
            else {
                localStorage.setItem('accessToken', data.accessToken)
                HttpService.setToken(data.accessToken)
                localStorage.setItem('refreshToken', data.refreshToken)
                HttpService.setLocalRefToken(data.refreshToken)
                localStorage.setItem('userRole', data.user.role)
                localStorage.setItem('userId', data.user.id)
                localStorage.setItem('user', JSON.stringify(data.user))
                localStorage.setItem('branch', data.user.stores[0].code??'')
                return data.user
            }
        }
        return { code: response.status, message: response.statusText }
    }
}
class AuthenManager {
    executeAuthenticate(arg: LoginInfo) {
        if (arg instanceof LocalLoginInfo) {
            return new LocalAuthen().authenticate(arg)
        }
    }
}
class AuthenEventHandler {
    constructor(public authenManager: AuthenManager) {}
    handleAuthen(arg: LoginInfo) {
      return this.authenManager.executeAuthenticate(arg)
    }
}
  
class AuthService {
    login(arg: LoginInfo, authenManager: AuthenManager) {
        const authenHandler = new AuthenEventHandler(authenManager)
        return authenHandler.handleAuthen(arg)
    }
    async verify2fa(arg:Verify2faProps){
        const response = await HttpService.doPostRequest(
            'verify2fa',
            {
            username: arg.username,
            token: arg.token,
            device: arg.device
            },
            false
        )
        if (response.status == 200) {
            const data = response.data
            //console.log('verify login data:',data)
            localStorage.setItem('username', arg.username)
            localStorage.setItem('accessToken', data.accessToken)
            HttpService.setToken(data.accessToken)
            localStorage.setItem('refreshToken', data.refreshToken)
            HttpService.setLocalRefToken(data.refreshToken)
            localStorage.setItem('userRole', data.user.role)
            localStorage.setItem('userId', data.user.id)
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('branch', data.user.stores[0].code??'')
            return data.user
        }
        return { code: response.status, message: response.statusText }
    }
    logout() {
      localStorage.removeItem('user');
      localStorage.removeItem('username');
      localStorage.removeItem('accessToken');
      HttpService.setToken('')
      localStorage.removeItem('refreshToken');
      HttpService.setLocalRefToken('')
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      localStorage.removeItem('branch');
    }
    register() {}
    getCurrentUser() {
        const userStr = localStorage.getItem('user')
        if (userStr) return JSON.parse(userStr)
        return null
    }
}
export { AuthService, AuthenManager, LocalAuthen, AuthenEventHandler }
  