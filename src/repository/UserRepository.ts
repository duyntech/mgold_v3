import { UserModel } from '../model/User.model';
export class UserRepo {
    static cachedUser: UserModel|undefined
    static clearCached() {
        this.cachedUser=undefined;
    }
    static getUser() {
        if (UserRepo.cachedUser) return UserRepo.cachedUser
        const x = localStorage.getItem('user')
        if (x) {
        UserRepo.cachedUser = JSON.parse(x) as UserModel
        }
        return undefined
    
    }
    static getDefaultUserStore(): any {
        const user = this.getUser()
        if (user) {
        if (user.stores) {
            return user.stores[0].code
        }
        }
        return ''
    }
    static getUserStores(): any {
        const user = this.getUser()
        if (user) {
        if (user.stores) {
            return user.stores
        }
        }
        return []
    }
    static getUserId(): any {
        const id= localStorage.getItem('userId')
        return id
    }
    static getUserFullname(): any {
        try {
        const x = localStorage.getItem('user')
        const user=JSON.parse(x!) as UserModel
        if (user) {
        if (user.information) {
            const information=Object(user.information)
            return information.last_name+' '+information.first_name
        }
        }
        } catch (error) {
        return 'FamiSoft'
        }
        
        
    }
}
