import { CashSummaryModel } from "../model/CashSummary.model"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"

export const CashSummaryService = {
    activeIfSelectAndDeactiveOthers(id: string, list: any[]){
        list.forEach((item, idx) => {
            if (item.employee.id !==id ) {
            list[idx].active = false
            }
            else{
                list[idx].active = true
                }
            })
        return list
    },
    listFromJson(data:any){
        let list:CashSummaryModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            list.push({...element,...{active:false}})
        }
        return list
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/cashbook/summary', data)
        return parseCommonHttpResult(response)
    },
}