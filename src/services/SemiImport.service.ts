import { SemiImportModel } from "../model/SemiImport.model"
import { dateStringToDate, deepCloneObject, formatDateTimeToFormatString } from "../utils/util"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"
export const SemiImportService = {
    doNewImportListItem(imports:any[]){
        let update:any[]=deepCloneObject(imports)
        
        update.push({
                _id: null,
                delete:false,
                product_name:null,
                quantity:1,
                age: 0,
                unit:"LY",
                weight: 0,
                stone: 0,
                gold_weight:0,
                exchange: 0,
                wage:0,
                gold_value:0,
                value:0,
                note: null
        })
        return update
    },
    doDeleteImportListItem(item:SemiImportModel,data:any){
        let update:SemiImportModel=deepCloneObject(item)
        const {index}=data
        let imports=update.imports
        switch (index) {
            case 0:
                imports.shift()
                break;
            case imports.length-1:
                imports.pop()
                break;
            default:
                imports.splice(index,1)
            break;
        }
        update.imports=imports
        return update
    },
    doImportChanging(imports:any[],data:any){
        //console.log(data)
        let update=deepCloneObject(imports)
        update[data.index][data.field]=data.value
        switch (data.field) {
            case "unit":
                if(data.value==="GRAM"){
                    update[data.index]["gold_value"]=update[data.index]["gold_weight"]*update[data.index]["exchange"]
                    update[data.index]["value"]=update[data.index]["gold_value"]+update[data.index]["wage"]
                }
                else{
                    update[data.index]["gold_value"]=update[data.index]["gold_weight"]/100*update[data.index]["exchange"]
                    update[data.index]["value"]=update[data.index]["gold_value"]+update[data.index]["wage"]
                }
                break;
            case "exchange":
                if(update[data.index]["unit"]==='GRAM'){
                    update[data.index]["gold_value"]=update[data.index]["gold_weight"]*data.value
                    update[data.index]["value"]=update[data.index]["gold_value"]+update[data.index]["wage"]
                }
                else{
                    update[data.index]["gold_value"]=update[data.index]["gold_weight"]/100*data.value
                    update[data.index]["value"]=update[data.index]["gold_value"]+update[data.index]["wage"]
                }
                break;
            case "wage":
                update[data.index]["value"]=update[data.index]["gold_value"]+data.value
                break;
            case "weight":
            case "stone":
                update[data.index]["gold_weight"]=update[data.index]["weight"]-update[data.index]["stone"]
                if(update[data.index]["unit"]==='GRAM'){
                    update[data.index]["gold_value"]=update[data.index]["gold_weight"]*update[data.index]["exchange"]
                }
                else{
                    update[data.index]["gold_value"]=update[data.index]["gold_weight"]/100*update[data.index]["exchange"]
                }
                update[data.index]["value"]=update[data.index]["gold_value"]+update[data.index]["wage"]
                break;
        }
        return update
    },
    listFromJson(data:any){
        let list:SemiImportModel[]=[]
        //console.log(data)
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            const ages=[... new Set((element.imports as any[]).map((e=>e.age)))].join(",")
            const quantity=(element.imports as any[]).reduce((sum,el)=>sum+=el.quantity,0)
            const weight=(element.imports as any[]).reduce((sum,el)=>sum+=el.weight,0)
            const stone=(element.imports as any[]).reduce((sum,el)=>sum+=el.stone,0)
            const goldWeight=(element.imports as any[]).reduce((sum,el)=>sum+=el.gold_weight,0)
            const goldValue=(element.imports as any[]).reduce((sum,el)=>sum+=el.gold_value,0)
            const wage=(element.imports as any[]).reduce((sum,el)=>sum+=el.wage,0)
            const value=(element.imports as any[]).reduce((sum,el)=>sum+=el.value,0)
            const item={
                _id: element._id,
                date:dateStringToDate(element.date),
                code:element.code,
                time:formatDateTimeToFormatString(element.createdAt,"HH:mm"),
                imports:element.imports,
                ages:ages,
                quantity:quantity,
                weight:weight,
                stone:stone,
                gold_weight:goldWeight,
                wage:wage,
                gold_value:goldValue,
                value:value,
                to_stock:element.to_stock,
                partner:element.partner,
                note:element.note,
                creator:element.create_user,
                disabled:!(element.status==="ACTIVE")
            }
            list.push(item)
            
        }
        return list
    },
    
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/import/receipt', data)
        return parseCommonHttpResult(response)
    },
    async addItem(data:any){
        const response = await HttpService.doPostRequest('v1/import/receipt', data)
        return parseCommonHttpResult(response)
    },
    async updateItem(data:any){
        const response = await HttpService.doPutRequest('v1/import/receipt', data)
        return parseCommonHttpResult(response)
    },
    async deleteItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/import/receipt', data)
        return parseCommonHttpResult(response)
    },
    async restoreItem(data:any){
        const response = await HttpService.doPutRequest('v1/import/receipt/restore', data)
        return parseCommonHttpResult(response)
    },
}