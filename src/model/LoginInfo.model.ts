abstract class LoginInfo {
  deviceId: string
  constructor(deviceId: string) {
    this.deviceId = deviceId
  }
}

class LocalLoginInfo extends LoginInfo {
  username: string
  password: string
  remember: boolean
  constructor(username: string, password: string, remember: boolean, deviceId: string) {
    super(deviceId)
    this.username = username
    this.password = password
    this.remember = remember
  }
}

export { LoginInfo, LocalLoginInfo}