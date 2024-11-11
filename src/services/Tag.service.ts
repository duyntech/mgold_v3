import { TagModel } from "../model"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"

export const TagService = {
    activeIfSelectAndDeactiveOthers(id: string, list: TagModel[]){
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
                    description:data.description,
                    is_hot:data.is_hot,
                    active:false,
                    disabled:data.status==="ACTIVE"?false:true
                }
        return item
    },
    listFromJson(data:any){
        let list:TagModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            list.push(
                {
                    id:element._id,
                    code:element.code,
                    name:element.name,
                    description:element.description,
                    is_hot:element.is_hot,
                    active:false,
                    disabled:element.status==="ACTIVE"?false:true
                }
            )
        }
        return list
    },
    async restoreItem(data:any){
        const response = await HttpService.doPutRequest('v1/tag/restore', data)
        return parseCommonHttpResult(response)
    },
    async deleteItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/tag', data)
        return parseCommonHttpResult(response)
    },
    async editItem(data:any){
        const response = await HttpService.doPutRequest('v1/tag', data)
        return parseCommonHttpResult(response)
    },
    async addItem(data:any){
        const response = await HttpService.doPostRequest('v1/tag', data)
        return parseCommonHttpResult(response)
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/tag', data)
        return parseCommonHttpResult(response)
    },
}