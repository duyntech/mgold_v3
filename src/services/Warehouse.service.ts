import { WarehouseModel } from "../model"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"

export const WarehouseService = {
    activeIfSelectAndDeactiveOthers(id: string, list: WarehouseModel[]){
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
                    active:false,
                    disabled:data.status==="ACTIVE"?false:true
                }
        return item
    },
    listFromJson(data:any){
        let list:WarehouseModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            list.push(
                {
                    id:element._id,
                    code:element.code,
                    name:element.name,
                    description:element.description,
                    active:false,
                    disabled:element.status==="ACTIVE"?false:true
                }
            )
        }
        return list
    },
    async restoreItem(data:any){
        const response = await HttpService.doPutRequest('v1/warehouse/restore', data)
        return parseCommonHttpResult(response)
    },
    async deleteItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/warehouse', data)
        return parseCommonHttpResult(response)
    },
    async editItem(data:any){
        const response = await HttpService.doPutRequest('v1/warehouse', data)
        return parseCommonHttpResult(response)
    },
    async addItem(data:any){
        const response = await HttpService.doPostRequest('v1/warehouse', data)
        return parseCommonHttpResult(response)
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/warehouse', data)
        return parseCommonHttpResult(response)
    },
}