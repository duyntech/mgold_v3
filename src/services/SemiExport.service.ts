import { SemiExportModel } from "../model/SemiExport.model"
import { dateStringToDate, deepCloneObject, formatDateTimeToFormatString, toFixedRefactor } from "../utils/util"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"
export const SemiExportService = {
    doNewExportListItem(exports:any[]){
        let update:any[]=deepCloneObject(exports)
        if(exports.length>0){
            update.push({
                _id: null,
                delete:false,
                import_detail_id:exports[0].import_detail_id,
                to_stock: null,
                partner:null,
                object:null,
                product_name:null,
                quantity:1,
                age: exports[0].age,
                weight: 0,
                stone: 0,
                gold_weight:0,
                exchange: exports[0].exchange,
                note: null
            })
        }
        return update
    },
    doDeleteExportListItem(item:SemiExportModel,data:any){
        let update:SemiExportModel=deepCloneObject(item)
        const {row,index}=data
        let imports=update.imports
        let exports=update.exports
        switch (item.type) {
            case "XK":
                const iItem=imports.findIndex(i=>i._id===row.import_detail_id)
                if(iItem>=0){
                    imports[iItem].tick=false
                }
                break;
        }
        switch (index) {
            case 0:
                exports.shift()
                break;
            case exports.length-1:
                exports.pop()
                break;
            default:
                exports.splice(index,1)
            break;
        }
        update.exports=exports
        update.imports=imports
        return update
    },
    doExportChanging(exports:any[],data:any){
        //console.log(data)
        let update=deepCloneObject(exports)
        update[data.index][data.field]=data.value
        switch (data.field) {
            case "weight":
            case "stone":
                update[data.index]["gold_weight"]=update[data.index]["weight"]-update[data.index]["stone"]
                break;
        }
        return update
    },
    doTypeChanging(item:SemiExportModel){
        let update:SemiExportModel=deepCloneObject(item)
        let imports=update.imports
        for (let index = 0; index < imports.length; index++) {
            imports[index].tick=false;
            
        }
        update.exports=[]
        update.imports=imports
        return update
    },
    doRemainChanging(item:SemiExportModel,data:any){
        let update:SemiExportModel=deepCloneObject(item)
        let imports=update.imports
        let exports=update.exports
        const iItem=imports.findIndex(i=>i._id===data._id)
        const eItem=exports.findIndex(i=>i.import_detail_id===data._id)
        imports[iItem].tick=data.tick
        //console.log(item.type)
        switch (item.type) {
            case "XT":
                if(data.tick&&eItem<0){
                    exports.push(
                        {
                            _id: null,
                            delete:false,
                            import_detail_id:data._id,
                            to_stock: null,
                            partner:null,
                            object: data.object,
                            product_name: data.product_name,
                            quantity: data.quantity,
                            age: data.age,
                            weight: data.weight,
                            stone: data.stone,
                            gold_weight:data.gold_weight,
                            exchange: data.exchange,
                            note: data.note
                        }
                    )
                }
                else if(!data.tick){
                    exports=[]
                }
                break;
            case "XG":
                if(data.tick&&eItem<0&&exports.length===0){
                    exports.push(
                        {
                            _id: null,
                            delete:false,
                            import_detail_id:data._id,
                            to_stock: null,
                            partner:null,
                            object: data.object,
                            product_name: data.product_name,
                            quantity: data.quantity,
                            age: data.age,
                            weight: data.weight,
                            stone: data.stone,
                            gold_weight:data.gold_weight,
                            exchange: data.exchange,
                            note: data.note
                        }
                    )
                }
                const tickeds=imports.filter(i=>i.tick)
                if(tickeds.length>0){
                    const totalWeight=tickeds.reduce((sum,el)=>sum+=el.weight,0)
                    const totalStone=tickeds.reduce((sum,el)=>sum+=el.stone,0)
                    const totalGold=tickeds.reduce((sum,el)=>sum+=el.gold_weight,0)
                    const totalValue=tickeds.reduce((sum,el)=>sum+=el.gold_weight*el.exchange,0)
                    const newExchange=toFixedRefactor(totalValue/totalGold,0)
                    exports[0].weight=totalWeight
                    exports[0].stone=totalStone
                    exports[0].gold_weight=totalGold
                    exports[0].exchange=newExchange
                }
                else{
                    exports=[]
                }
                break;
            default:
                if(data.tick&&eItem<0){
                    exports.push(
                        {
                            _id: null,
                            delete:false,
                            import_detail_id:data._id,
                            to_stock: null,
                            partner:null,
                            object: data.object,
                            product_name: data.product_name,
                            quantity: data.quantity,
                            age: data.age,
                            weight: data.weight,
                            stone: data.stone,
                            gold_weight:data.gold_weight,
                            exchange: data.exchange,
                            note: data.note
                        }
                    )
                }
                if(!data.tick&&eItem>=0){
                    switch (eItem) {
                        case 0:
                            exports.shift()
                            break;
                        case exports.length-1:
                            exports.pop()
                            break;
                        default:
                            exports.splice(eItem,1)
                            break;
                    }
                }
                break;
        }
        
        update.imports=imports
        update.exports=exports
        return update
    },
    listFromJson(data:any){
        let list:SemiExportModel[]=[]
        console.log(data)
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            const productNames=(element.imports as any[]).map((e=>e.product_name)).join(",")
            const ages=[... new Set((element.imports as any[]).map((e=>e.age)))].join(",")
            const importWeight=(element.imports as any[]).reduce((sum,el)=>sum+=el.weight,0)
            const importStone=(element.imports as any[]).reduce((sum,el)=>sum+=el.stone,0)
            const importGoldWeight=(element.imports as any[]).reduce((sum,el)=>sum+=el.gold_weight,0)
            const toStocks=[... new Set((element.exports as any[]).map((e=>e.to_stock)))].join(",")
            const exportWeight=(element.exports as any[]).reduce((sum,el)=>sum+=el.weight,0)
            const exportStone=(element.exports as any[]).reduce((sum,el)=>sum+=el.stone,0)
            const exportGoldWeight=(element.exports as any[]).reduce((sum,el)=>sum+=el.gold_weight,0)
            const item={
                _id: element._id,
                date:dateStringToDate(element.date),
                code:element.code,
                time:formatDateTimeToFormatString(element.createdAt,"HH:mm"),
                type:element.type,
                products:productNames,
                ages:ages,
                import_weight:importWeight,
                import_stone:importStone,
                import_gold:importGoldWeight,
                export_weight:exportWeight,
                export_stone:exportStone,
                export_gold:exportGoldWeight,
                diff_weight:importWeight-exportWeight,
                diff_stone:importStone-exportStone,
                diff_gold:importGoldWeight-exportGoldWeight,
                imports:element.imports,
                exports:element.exports,
                to_stocks:toStocks,
                note:element.note,
                creator:element.create_user,
                disabled:!(element.status==="ACTIVE")
            }
            list.push(item)
            
        }
        return list
    },
    remainFromJson(data:any){
        let list:any[]=[]
        //console.log(data)
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            const item={
                tick:element.status==='EXPORTED',
                _id: element._id,
                date: dateStringToDate(element.date),
                stock: element.stock,
                from_stock: element.from_stock,
                object: element.object,
                product_name: element.product_name,
                quantity: element.quantity,
                remain_quantity:element.quantity,
                age: element.age,
                weight: element.weight,
                stone: element.stone,
                gold_weight:element.weight-element.stone,
                exchange: element.exchange,
                wage: element.wage,
                note: element.note
            }
            list.push(item)
            
        }
        return list
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/export/semi', data)
        return parseCommonHttpResult(response)
    },
    async fetchRemain(data:any){
        const response = await HttpService.doGetRequest('v1/export/semi/remain', data)
        return parseCommonHttpResult(response)
    },
    async addItem(data:any){
        const response = await HttpService.doPostRequest('v1/export/semi', data)
        return parseCommonHttpResult(response)
    },
    async updateItem(data:any){
        const response = await HttpService.doPutRequest('v1/export/semi', data)
        return parseCommonHttpResult(response)
    },
    async deleteItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/export/semi', data)
        return parseCommonHttpResult(response)
    },
    async restoreItem(data:any){
        const response = await HttpService.doPutRequest('v1/export/semi/restore', data)
        return parseCommonHttpResult(response)
    },
}