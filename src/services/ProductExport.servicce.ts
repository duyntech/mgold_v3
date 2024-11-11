
import { ProductExportModel } from "../model/ProductExport.model";
import { dateStringToDate } from "../utils/util";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";


export const ProductExportService = {
    listFromJson(data:any){
        //console.log(data)
        let list:ProductExportModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            list.push({
                _id: element._id,
                date: dateStringToDate(element.date),
                code: element.code,
                type: element.type,
                to_object: element.to_object,
                refund: element.refund,
                products: element.products,
                note: element.note,
                status: element.status,
                create_user: element.create_user,
                disabled: !(element.status === "ACTIVE"),
                quantity: element.products.length,
                weight: (element.products as any[]).reduce((sum,el)=>sum+=el.weight,0),
                stone: (element.products as any[]).reduce((sum,el)=>sum+=el.weight,0),
                gold_weight: (element.products as any[]).reduce((sum,el)=>sum+=(el.weight-el.stone),0),
                q10:(element.products as any[]).reduce((sum,el)=>sum+=(el.weight-el.stone)*el.age/100,0)
            })
            
        }
        return list
    },
    async fetchAll(data: any) {
        const response = await HttpService.doGetRequest("v1/export/product", data);
        return parseCommonHttpResult(response);
    },
    async addExport(data: any) {
        const response = await HttpService.doPostRequest("v1/export/product", data);
        return parseCommonHttpResult(response);
    },
    async editExport(data: any) {
        const response = await HttpService.doPutRequest("v1/export/product", data);
        return parseCommonHttpResult(response);
    },
    async deleteExport(data: any) {
        const response = await HttpService.doDeleteRequest("v1/export/product", data);
        return parseCommonHttpResult(response);
    },
    async restoreExport(data: any) {
        const response = await HttpService.doPutRequest("v1/export/product/restore", data);
        return parseCommonHttpResult(response);
    },
};
