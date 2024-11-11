import { t } from "i18next";
import { FuncTreeNodeModel } from "../model/FuncTreeNode.model";
import { RoleModel } from "../model/Role.model";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";
import { pawnFuncs } from "../utils/constants/const";

export const RoleService = {
    activeIfSelectAndDeactiveOthers(id: string, list: RoleModel[]) {
        list.forEach((item, idx) => {
        if (item.id !== id) {
            list[idx].active = false;
        } else {
            list[idx].active = true;
        }
        });
        return list;
    },
    funcsFromJson(data:any){
        //console.log("data funcs",data)
        let funcs:FuncTreeNodeModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            let actions:FuncTreeNodeModel[]=[]
            let partialChecked=false
            let allChecked=true
            for (let index = 0; index < element.actions.length; index++) {
                const e = element.actions[index]
                if(e.checked){partialChecked=true}
                if(!e.checked){allChecked=false}
                actions.push(
                    {
                        key:element.code+'#'+e.code,
                        label:t("action."+e.code),
                        partialChecked:false,
                        checked:e.checked,
                        data:e.code,
                        children:[],
                        sort:0
                    }
                )
            }
            funcs.push(
                {
                    key:element.code,
                    label:t("sidebar."+element.code)+(pawnFuncs.includes(element.code)?"(Cầm đồ)":""),
                    partialChecked:allChecked?false:partialChecked,
                    checked:allChecked,
                    data:element.code,
                    children:actions,
                    sort:pawnFuncs.includes(element.code)?1:0
                }
            )
        }
        funcs=funcs.sort((a,b)=>b.sort-a.sort)
        return funcs
    },
    itemFromJson(data:any){
        //console.log(data)
        const item={
            id: data._id,
            name: data.name,
            code: data.code,
            description: data.note,
            permissions: [], 
            active: false,
            disabled: data.status==='ACTIVE'?false:true,
            }
        return item
    },
    listFromJson(data:any){
        let list:RoleModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            if(element.code!=="SUPERROLE"){
                list.push({
                    id: element._id,
                    name: element.name,
                    code: element.code,
                    description: element.note,
                    permissions: [],
                    active: false,
                    disabled: element.status==="ACTIVE"?false:true
                })
            }
            
        }
        return list
    },
    async restoreItem(data:any){
        const response = await HttpService.doPutRequest('v1/role/restore', data)
        return parseCommonHttpResult(response)
    },
    async funcsByRole(data: any) {
        const response = await HttpService.doPatchRequest("v1/role", data);
        return parseCommonHttpResult(response);
    },
    async fetchAll(data: any) {
        const response = await HttpService.doGetRequest("v1/role", data);
        return parseCommonHttpResult(response);
    },
    async addItem(data: any) {
        const response = await HttpService.doPostRequest("v1/role", data);
        return parseCommonHttpResult(response);
    },

    async editItem(data: any) {
        const response = await HttpService.doPutRequest("v1/role", data);
        return parseCommonHttpResult(response);
    },

    async deleteItem(data: any) {
        const response = await HttpService.doDeleteRequest("v1/role", data);
        return parseCommonHttpResult(response);
    },
};
