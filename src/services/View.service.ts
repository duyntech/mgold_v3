import { ViewModel } from "../model"
import { sortProductImages } from "../utils/util"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"

export const ViewService = {
    activeIfSelectAndDeactiveOthers(payload: any, list: ViewModel[]){
        list.forEach((item, idx) => {
            if (item.code ===payload.code&&item.type===payload.type ) {
            list[idx].active = true
            }
            else{
                list[idx].active = false
                }
            })
        return list
    },
    listFromJson(data:any){
        //console.log(data)
        let list:ViewModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            list.push(
                {
                    code:element.code,
                    type:element.type,
                    typeName:element.typeName,
                    productName:element.productName,
                    tagName:element.tagName,
                    viewed:element.viewed,
                    images:sortProductImages(element.images),
                    active:false
                }
            )
        }
        return list
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/view', data)
        return parseCommonHttpResult(response)
    },
}