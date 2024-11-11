import { EmailModel } from "../model/Email.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
import { formatDateToFormatString } from "../utils/util";

export const EmailService = {
    activeIfSelectAndDeactiveOthers(id: string, list: EmailModel[]) {
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
            id: data._id,
            email: data.email,
            datetime: formatDateToFormatString(data.createdAt,"DD/MM/YYYY HH:mm"), 
            active: false
            }
        return item
    },
    listFromJson(data:any){
        //console.log(data)
        let list:EmailModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            list.push({
                id: element._id,
                email: element.email,
                datetime: formatDateToFormatString(element.createdAt,"DD/MM/YYYY HH:mm"), 
                active: false
            })
            
        }
        return list
    },
    async fetchAll(data: any) {
        const response = await HttpService.doGetRequest("v1/email", data);
        return parseCommonHttpResult(response);
    },
    
};
