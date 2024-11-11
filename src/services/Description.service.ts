
import { DescriptionModel } from "../model/Description.model"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"

export const DescriptionService = {
    activeIfSelectAndDeactiveOthers(id: string, list: DescriptionModel[]){
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
                    id:data._id,
                    code:data.code,
                    name:data.name,
                    numberic:data.numberic,
                    active:false,
                    disabled:data.status==="ACTIVE"?false:true
                }
        return item
    },
    listFromJson(data:any){
        let list:DescriptionModel[]=[]
        if(data){
            for (let index = 0; index < data.length; index++) {
                const element = data[index]
                list.push(
                    {
                        id:element._id,
                        code:element.code,
                        name:element.name,
                        numberic:element.numberic,
                        active:false,
                        disabled:element.status==="ACTIVE"?false:true
                    }
                )
            }
        }
        
        return list
    },
    async restoreItem(data:any){
        const response = await HttpService.doPutRequest('v1/description/restore', data)
        return parseCommonHttpResult(response)
    },
    async deleteItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/description', data)
        return parseCommonHttpResult(response)
    },
    async editItem(data:any){
        const response = await HttpService.doPutRequest('v1/description', data)
        return parseCommonHttpResult(response)
    },
    async addItem(data:any){
        const response = await HttpService.doPostRequest('v1/description', data)
        return parseCommonHttpResult(response)
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/description', data)
        return parseCommonHttpResult(response)
    },
}