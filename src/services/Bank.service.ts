
import { BankModel } from "../model/Bank.model"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"

export const BankService = {
    activeIfSelectAndDeactiveOthers(id: string, list: BankModel[]){
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
        const item={
            id:data._id,
            account_number:data.account_number,
            bank_name:data.bank_name,
            bank_branch:data.bank_branch??'',
            date_format:data.date_format,
            for_module:data.for_module,
            rate_fee:data.rate_fee,
            status:data.status,
            for_method:data.type,
            active:false,
            disabled:data.status==="ACTIVE"?false:true
        }
        return item
    },
    listFromJson(data:any){
        //console.log(data)
        let list:BankModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            list.push(
                {
                    id:element._id,
                    account_number:element.account_number,
                    bank_name:element.bank_name,
                    bank_branch:element.bank_branch??'',
                    date_format:element.date_format,
                    for_module:element.for_module,
                    rate_fee:element.rate_fee,
                    status:element.status,
                    for_method:element.type,
                    active:false,
                    disabled:element.status==="ACTIVE"?false:true
                }
            )
        }
        //console.log(list)
        return list
    },
    async restoreItem(data:any){
        const response = await HttpService.doPutRequest('v1/bank/restore', data)
        return parseCommonHttpResult(response)
    },
    async deleteItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/bank', data)
        return parseCommonHttpResult(response)
    },
    async editItem(data:any){
        const response = await HttpService.doPutRequest('v1/bank', data)
        return parseCommonHttpResult(response)
    },
    async addItem(data:any){
        const response = await HttpService.doPostRequest('v1/bank', data)
        return parseCommonHttpResult(response)
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/bank', data)
        return parseCommonHttpResult(response)
    },
}