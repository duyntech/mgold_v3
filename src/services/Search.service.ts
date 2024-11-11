import { SearchModel } from "../model"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"

export const SearchService = {
    activeIfSelectAndDeactiveOthers(key: string, list: SearchModel[]){
        list.forEach((item, idx) => {
            if (item.key !==key ) {
            list[idx].active = false
            }
            else{
                list[idx].active = true
                }
            })
        return list
    },
    listFromJson(data:any){
        let list:SearchModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            list.push(
                {
                    key:element.key,
                    quantity:element.quantity,
                    active:false
                }
            )
        }
        return list
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/search', data)
        return parseCommonHttpResult(response)
    },
    async deleteKey(data:any){
        const response = await HttpService.doDeleteRequest('v1/search', data)
        return parseCommonHttpResult(response)
    },
}