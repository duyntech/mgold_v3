import { TempPawnModel } from "../model/TempPawn.model"
import { dateStringToDate } from "../utils/util"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"

export const TempPawnService = {
    activeIfSelectAndDeactiveOthers(id: string, list: TempPawnModel[]){
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
        const item={
            id: data._id,
            code: data.code,
            date: dateStringToDate(data.date),
            liquidDate: data.liquid_date?dateStringToDate(data.liquid_date):null,
            redeemDate: data.redeem_date?dateStringToDate(data.redeem_date):null,
            customer: data.customer,
            product: data.product,
            value: data.value,
            productType: data.product_type,
            note: data.note,
            extend_records: data.extends,
            status: data.status,
            createUser: data.createUser,
            active: false,
            disabled: data.status === "DEACTIVE"? true : false,
            personalId: data.personal_id,
            phone: data.phone,
            province: data.province,
            ward: data.ward,
            district: data.district,
            address: data.address,
            numbericalOrder: data.numberical_order,
            customerId: data.customer_id,
            tags: data.tags,
            warehouse: data.warehouse
            }
        return item
    },
    listFromJson(data:any){
        //console.log(data)
        let list:TempPawnModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            list.push(
                {
                    id: element._id,
                    code: element.code,
                    date: dateStringToDate(element.date),
                    liquidDate: element.liquid_date?dateStringToDate(element.liquid_date):null,
                    redeemDate: element.redeem_date?dateStringToDate(element.redeem_date):null,
                    customer: element.customer,
                    product: element.product,
                    value: element.value,
                    productType: element.product_type,
                    note: element.note,
                    extend_records: element.extends,
                    status: element.status,
                    createUser: element.createUser,
                    active: false,
                    disabled: element.status === "DEACTIVE" ? true : false,
                    personalId: element.personal_id,
                    phone: element.phone,
                    province: element.province,
                    ward: element.ward,
                    district: element.district,
                    address: element.address,
                    numbericalOrder: element.numberical_order,
                    customerId: element.customer_id,
                    tags: element.tags,
                    warehouse: element.warehouse
                }
            )
        }
        return list
    },
    async addExtendItem(data:any){
        const response = await HttpService.doPostRequest('v1/pawn/temp/extend', data)
        return parseCommonHttpResult(response)
    },
    async editExtendItem(data:any){
        const response = await HttpService.doPutRequest('v1/pawn/temp/extend', data)
        return parseCommonHttpResult(response)
    },
    async deleteExtendItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/pawn/temp/extend', data)
        return parseCommonHttpResult(response)
    },
    async patchItem(data:any){
        const response = await HttpService.doPatchRequest('v1/pawn/temp', data)
        return parseCommonHttpResult(response)
    },
    async restoreItem(data:any){
        const response = await HttpService.doPutRequest('v1/pawn/temp/restore', data)
        return parseCommonHttpResult(response)
    },
    async verifyItem(data:any){
        const response = await HttpService.doPutRequest('v1/pawn/temp/status', data)
        return parseCommonHttpResult(response)
    },
    async redeemItem(data:any){
        const response = await HttpService.doPutRequest('v1/pawn/temp/redeem', data)
        return parseCommonHttpResult(response)
    },
    async deleteItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/pawn/temp', data)
        return parseCommonHttpResult(response)
    },
    async editPawnTag(data:any){
        const response = await HttpService.doPutRequest('v1/pawn/temp/tag', data)
        return parseCommonHttpResult(response)
    },
    async editItem(data:any){
        const response = await HttpService.doPutRequest('v1/pawn/temp', data)
        return parseCommonHttpResult(response)
    },
    async addItem(data:any){
        const response = await HttpService.doPostRequest('v1/pawn/temp', data)
        return parseCommonHttpResult(response)
    },
    async importItem(data:any){
        const response = await HttpService.doPostRequest('v1/pawn/temp/import', data)
        return parseCommonHttpResult(response)
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/pawn/temp', data)
        return parseCommonHttpResult(response)
    },
}