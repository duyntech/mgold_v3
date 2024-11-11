import { ProfileModel } from '../model/Profile.model'
import { HttpService } from './http/HttpService'
import { parseCommonHttpResult } from './http/parseCommonResult'

export const ProfileService = {
    activeIfSelectAndDeactiveOthers(id: string, list: ProfileModel[]){
        list.forEach((item, idx) => {
            if (item.id !==id ) {
            list[idx].active = false
            }
            else{
                list[idx].active = true
                }
            })
        return list
    },
    itemFromJson(data:any){
        //console.log(data)
        const fullName=data.full_name!==null&&data.full_name!==undefined?data.full_name: data.last_name+' '+data.first_name
        const item={
            id:data._id,
            username:data.username,
            firstName:data.first_name,
            lastName:data.last_name,
            fullName:fullName,
            filterName:data.phone!==undefined&&data.phone!==null?data.phone + ' - '+fullName :fullName,
            role:data.role??{_id:'',code:'',name:''},
            birthDate:data.birthday,
            phone:data.phone,
            email:data.email,
            address:data.address,
            isAdmin:data.is_admin,
            personalCard:data.personal_card,
            personalCardImage:data.personal_card_image,
            active:false,
            disabled:!data.is_active,
            isOnline:data.is_online,
            ipAddress:data.ip_address,
            province: data.province,
            district: data.district,
            ward: data.ward,
            expireTime:data.expire_time,
            accessTime:data.access_time,
            status:data.status
        }
        return item
    },
    listFromJson(data:any){
        //console.log(data)
        let list:ProfileModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            //console.log(element)
            const fullName=element.full_name!==null&&element.full_name!==undefined?element.full_name: element.last_name+' '+element.first_name
            list.push(
                {
                    id: element._id,
                    username: element.username,
                    firstName: element.first_name,
                    lastName: element.last_name,
                    fullName: fullName,
                    filterName: element.phone !== undefined && element.phone !== null ? (element.personal_card && element.personal_card !== '' ? element.personal_card + ' - ' : '') + element.phone + ' - ' + fullName : fullName,
                    role: element.role ?? { _id: '', code: '', name: '' },
                    birthDate: element.birthday,
                    phone: element.phone,
                    email: element.email,
                    address: element.address,
                    isAdmin: element.is_admin,
                    personalCard: element.personal_card,
                    personalCardImage: element.personal_card_image,
                    active: false,
                    disabled: !element.is_active,
                    isOnline: element.is_online,
                    ipAddress: element.ip_address,
                    province: element.province,
                    district: element.district,
                    ward: element.ward,
                    expireTime: element.expire_time,
                    accessTime:element.access_time,
                    status:element.status
                }
            )
        }
        //console.log(list)
        return list
    },
    async resetGA(data:any){
        const response = await HttpService.doPutRequest('v1/user/resetga', data)
        return parseCommonHttpResult(response)
    },
    async resetPassword(data:any){
        const response = await HttpService.doPutRequest('v1/user/resetpassword', data)
        return parseCommonHttpResult(response)
    },
    async changePassword(data:any){
        const response = await HttpService.doPutRequest('v1/user/changepassword', data)
        return parseCommonHttpResult(response)
    },
    async restoreItem(data:any){
        const response = await HttpService.doPutRequest('v1/user/restore', data)
        return parseCommonHttpResult(response)
    },
    async deleteItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/user', data)
        return parseCommonHttpResult(response)
    },
    async editItem(data:any){
        const response = await HttpService.doPutRequest('v1/user', data)
        return parseCommonHttpResult(response)
    },
    async addItem(data:any){
        const response = await HttpService.doPostRequest('v1/user', data)
        return parseCommonHttpResult(response)
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/user', data)
        return parseCommonHttpResult(response)
    },

}
