
import { ProfileModel } from "../model/Profile.model"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"

export const CustomerService = {
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
        const fullName=data.full_name?data.full_name: null
        const customer=data.customers
        const item={
            id:data._id,
            username:data.username,
            firstName:data.first_name,
            lastName:data.last_name,
            fullName:fullName,
            filterName:data.phone!==undefined&&data.phone!==null?data.phone + ' - '+fullName :fullName,
            role:data.role??{_id:'',code:'',name:''},
            birthDate:"",
            phone:data.phone,
            email:data.email,
            address:data.address,
            isAdmin:data.is_admin,
            active:false,
            disabled:!data.is_active,
            isOnline:data.is_online,
            ipAddress:data.ip_address,
            province: data.province,
            district: data.district,
            ward: data.ward,
            expireTime: 0,
            accessTime: 0,
            status:customer&&customer.status?customer.status:"VERIFY",
            customer:customer
        }
        return item
    },
    listFromJson(data:any){
        console.log(data)
        let list:ProfileModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            //console.log(element)
            const fullName=element.full_name?element.full_name: null
            const customer=element.customers
            list.push(
                {
                    id: element._id,
                    username: element.username,
                    firstName: element.first_name,
                    lastName: element.last_name,
                    fullName: fullName,
                    filterName: element.phone ? element.phone + ' - ' + fullName : fullName,
                    role: element.role ?? { _id: '', code: '', name: '' },
                    birthDate: element.birthday,
                    phone: element.phone,
                    email: element.email,
                    address: element.address,
                    personalCard: element.personal_card,
                    personalCardImage: element.personal_card_image,
                    isAdmin: element.is_admin,
                    active: false,
                    disabled: !element.is_active,
                    isOnline: element.is_online,
                    ipAddress: element.ip_address,
                    province: element.province,
                    district: element.district,
                    ward: element.ward,
                    expireTime: 0,
                    accessTime: 0,
                    status:customer&&customer.status?customer.status:"VERIFY",
                    customer:customer
                }
            )
        }
        //console.log(list)
        return list
    },
    async restoreItem(data:any){
        const response = await HttpService.doPutRequest('v1/customer/restore', data)
        return parseCommonHttpResult(response)
    },
    async deleteItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/customer', data)
        return parseCommonHttpResult(response)
    },
    async verifyItem(data:any){
        const response = await HttpService.doPutRequest('v1/customer/verify', data)
        return parseCommonHttpResult(response)
    },
    async denyItem(data:any){
        const response = await HttpService.doPutRequest('v1/customer/deny', data)
        return parseCommonHttpResult(response)
    },
    async unverifyItem(data:any){
        const response = await HttpService.doPutRequest('v1/customer/unverify', data)
        return parseCommonHttpResult(response)
    },
    async editItem(data:any){
        const response = await HttpService.doPutRequest('v1/customer', data)
        return parseCommonHttpResult(response)
    },
    async addItem(data:any){
        const response = await HttpService.doPostRequest('v1/customer', data)
        return parseCommonHttpResult(response)
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/customer', data)
        return parseCommonHttpResult(response)
    },
}