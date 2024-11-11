import { ConsultingModel } from "../model/Consulting.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
import { formatDateToFormatString } from "../utils/util";

export const ConsultingService = {
    activeIfSelectAndDeactiveOthers(id: string, list: ConsultingModel[]) {
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
                full_name: data.full_name,
                phone:data.phone,
                requirement:data.requirement,
                consultant:data.consultant,
                consultant_name:data.consultant_name??'',
                consulting_note:data.consulting_note,
                datetime:formatDateToFormatString(data.createdAt,"DD/MM/YYYY HH:mm"),
            active: false
            }
        return item
    },
    listFromJson(data:any){
        //console.log(data)
        let list:ConsultingModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            list.push({
                id:element._id,
                full_name: element.full_name,
                phone:element.phone,
                requirement:element.requirement,
                consultant:element.consultant,
                consultant_name:element.consultant_name??'',
                consulting_note:element.consulting_note,
                datetime:formatDateToFormatString(element.createdAt,"DD/MM/YYYY HH:mm"),
                active:false
            })
            
        }
        return list
    },
    async fetchAll(data: any) {
        const response = await HttpService.doGetRequest("v1/consulting", data);
        return parseCommonHttpResult(response);
    },
    async editItem(data:any){
        const response = await HttpService.doPutRequest('v1/consulting', data)
        return parseCommonHttpResult(response)
    },
    
};
