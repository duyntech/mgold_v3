import { GoldgroupModel } from "../model"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"

export const GoldgroupService = {
    activeIfSelectAndDeactiveOthers(id: string, list: GoldgroupModel[]){
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
        let types=[]
        for (let index = 0; index < data.gold_types.length; index++) {
            const e = data.gold_types[index];
            types.push(e.code)
        }
        const item={
                    id:data._id,
                    name:data.name,
                    goldtypes:types,
                    active:false,
                    disabled:data.status==="ACTIVE"?false:true
                }
        return item
    },
    listFromJson(data:any){
        let list:GoldgroupModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            let types=[]
            for (let index = 0; index < element.gold_types.length; index++) {
                const e = element.gold_types[index];
                types.push(e.code)
            }
            list.push(
                {
                    id:element._id,
                    name:element.name,
                    goldtypes:types,
                    active:false,
                    disabled:element.status==="ACTIVE"?false:true
                }
            )
        }
        return list
    },
    async restoreItem(data:any){
        const response = await HttpService.doPutRequest('v1/goldgroup/restore', data)
        return parseCommonHttpResult(response)
    },
    async deleteItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/goldgroup', data)
        return parseCommonHttpResult(response)
    },
    async editItem(data:any){
        const response = await HttpService.doPutRequest('v1/goldgroup', data)
        return parseCommonHttpResult(response)
    },
    async addItem(data:any){
        const response = await HttpService.doPostRequest('v1/goldgroup', data)
        return parseCommonHttpResult(response)
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/goldgroup', data)
        return parseCommonHttpResult(response)
    },
}