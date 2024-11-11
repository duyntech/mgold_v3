import { ProductModel } from "../model"
import { SemiLabelModel } from "../model/SemiLabel.model"
import { dateStringToDate, deepCloneObject } from "../utils/util"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"
export const SemiLabelService = {
    updateProductField(product:ProductModel,data:any){
        let update=deepCloneObject(product)
        //console.log(update)
        const {field,value}=data
        
        switch (field) {
            case "weight":
                //if(value-update["stone"]>=0){
                update["gold_weight"]=value-update["stone"]
                update[field]=value
                //}
                break
            case "stone":
                //if(update["weight"]-value>=0){
                update["gold_weight"]=update["weight"]-value
                update[field]=value
                //}
                break;
            case "root_wage":
                update["cost_wage"]=value;
                update[field]=value
                break;
            default:
                update[field]=value
                break;
        }
        return update
    },
    itemFromJson(remains:any[],item:SemiLabelModel,data:any){
        //console.log(data)
        let update=deepCloneObject(item)
        //console.log(remains)
        let imports=remains.filter(i=>!data.imports.find((e: { _id: any })=>e._id===i._id))
        imports=[...imports,...data.imports]
        let importeds=data.imports
        for (let index = 0; index < importeds.length; index++) {
            const element = importeds[index];
            const exported=data.exports.filter((i: { import_detail_id: any })=>i.import_detail_id===element._id)
            importeds[index]["remain_quantity"]=exported.length>0?element.quantity-exported.length:element.quantity
            importeds[index]["gold_weight"]=importeds[index]["weight"]-importeds[index]["stone"]
            importeds[index]["tick"]=true
        }
        imports=[...imports,...importeds]
        let exports=data.exports
        for (let index = 0; index < exports.length; index++) {
            const element = exports[index];
            exports[index]["product_name"]=element.name
            exports[index]["exchange"]=element.exchange_rate
            exports[index]["root_wage"]=element.cost_wage
        }
        //console.log(exports)
        update.exports=exports
        update.imports=imports
        return update
    },
    listFromJson(data:any){
        let list:SemiLabelModel[]=[]
        //console.log(data)
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            const item={
                _id: element._id,
                date:dateStringToDate(element.date),
                code:element.code,
                purchase:element.purchase,
                purchaseId:element.purchase?element.purchase._id:'',
                purchaseCode:element.purchase?element.purchase.code:'',
                imports:[],
                exports:[],
                note:element.note,
                creator:element.create_user,
                disabled:!(element.status === "ACTIVE"),
            }
            list.push(item)
            
        }
        return list
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/label/semi', data)
        return parseCommonHttpResult(response)
    },
    async addSemiLabel(data:any){
        const response = await HttpService.doPostRequest('v1/label/semi', data)
        return parseCommonHttpResult(response)
    },
    async patchSemiLabel(data:any){
        const response = await HttpService.doPatchRequest('v1/label/semi', data)
        return parseCommonHttpResult(response)
    },
    async addLabel(data:any){
        const response = await HttpService.doPostRequest('v1/label', data)
        return parseCommonHttpResult(response)
    },
    async updateLabel(data:any){
        const response = await HttpService.doPutRequest('v1/label', data)
        return parseCommonHttpResult(response)
    },
    async deleteLabel(data:any){
        const response = await HttpService.doDeleteRequest('v1/label', data)
        return parseCommonHttpResult(response)
    },
}