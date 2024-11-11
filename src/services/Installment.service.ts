import { InstallmentModel } from "../model/Installment.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";


export const InstallmentService = {
    activeIfSelectAndDeactiveOthers(id: string, list: InstallmentModel[]) {
        list.forEach((item, idx) => {
        if (item.id !== id) {
            list[idx].active = false;
        } else {
            list[idx].active = true;
        }
        });
        return list;
    },
    itemFromJson(data:any){
        //console.log(data)
        const item={
            id:data._id,
            bank:data.bank,
            bank_name:data.bank_name,
            limited_value:data.limited_value,
            other_value:data.other_value??0,
            periods:data.periods,
            is_default:data.is_default,
            active:false,
            disabled:data.status==="ACTIVE"?false:true
            }
        return item
    },
    listFromJson(data:any){
        //console.log(data)
        let list:InstallmentModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            list.push({
                id:element._id,
                bank:element.bank,
                bank_name:element.bank_name,
                limited_value:element.limited_value,
                other_value:element.other_value??0,
                periods:element.periods,
                is_default:element.is_default,
                active:false,
                disabled:element.status==="ACTIVE"?false:true
            })
            
        }
        return list
    },
    async updateItem(data: any) {
        const response = await HttpService.doPutRequest("v1/installment", data);
        return parseCommonHttpResult(response);
    },
    async patchItem(data: any) {
        const response = await HttpService.doPatchRequest("v1/installment", data);
        return parseCommonHttpResult(response);
    },
};
