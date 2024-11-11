import { ProductTypeModel } from "../model";
import { TreeNodeModel } from "../model/TreeNode.model";
import { dropdownItem } from "../types";
import { HttpService } from "./http/HttpService";
import { parseCommonHttpResult } from "./http/parseCommonResult";

export const ProductTypeService = {
    itemFromJson(data:any){
        const item={
                    id:data._id,
                    code:data.code,
                    name:data.name,
                    image:data.image??'',
                    website_enable:data.website_enable??false,
                    id_parent:data.id_parent,
                    disabled:data.status==="ACTIVE"?false:true
                }
        return item
    },
    parentsFromJson(data:any){
        let list:dropdownItem[]=[]
        list.push({label:'Nhóm sản phẩm mới',value:'',parent:true})
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            if(element.id_parent===null||element.id_parent===''){
                list.push(
                    {
                        label:element.name,
                        value:element._id,
                        parent:true
                    }
                )
                for (let idx = 0; idx < data.length; idx++) {
                    const ele = data[idx]
                    if(ele.id_parent===element._id){
                        list.push(
                            {
                                label:ele.name,
                                value:ele._id,
                                parent:false
                            }
                        )
                    }
                }
                
                
            }
        }
        return list
    },
    listFromJson(data:any,status:any){

        let list:TreeNodeModel[]=[]
        switch (status) {
            case 'ALL':
                for (let index = 0; index < data.length; index++) {
                    const element = data[index]
                    if( element.id_parent===null||element.id_parent===''){
                        list.push(
                            {
                                key:element._id,
                                label:element.name,
                                data:{
                                    _id:element._id,
                                    code:element.code,
                                    name:element.name,
                                    image:element.image??'',
                                    website_enable:element.website_enable??false,
                                    id_parent:'',
                                    tags:element.tags??[],
                                    disabled:element.status==="ACTIVE"?false:true
                                },
                                children:[]
                            }
                        )
                    }
                }
                for (let index = 0; index < list.length; index++) {
                    const root = list[index];
                    let fathers:TreeNodeModel[]=[]
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index]
                        if(element.id_parent===root.data._id){
                            fathers.push(
                                {
                                    key:root.key+'-'+element._id,
                                    label:element.name,
                                    data:{
                                        _id:element._id,
                                        code:element.code,
                                        name:element.name,
                                        image:element.image??'',
                                        website_enable:element.website_enable??false,
                                        id_parent:element.id_parent,
                                        tags:element.tags??[],
                                        disabled:element.status==="ACTIVE"?false:true
                                    },
                                    children:[]
                                }
                            )
                        }
                    }
                    for (let index = 0; index < fathers.length; index++) {
                        const father = fathers[index];
                        let children:TreeNodeModel[]=[]
                        for (let index = 0; index < data.length; index++) {
                            const e = data[index]
                            if(e.id_parent===father.data._id){
                                children.push(
                                    {
                                        key:father.key+'-'+e._id,
                                        label:e.name,
                                        data:{
                                            _id:e._id,
                                            code:e.code,
                                            name:e.name,
                                            image:e.image??'',
                                            website_enable:e.website_enable??false,
                                            id_parent:e.id_parent,
                                            tags:e.tags??[],
                                            disabled:e.status==="ACTIVE"?false:true
                                        },
                                        children:[]
                                    }
                                )
                            }
                        }
                        fathers[index].children=children
                    }
                    list[index].children=fathers
                }
                break;
            case 'DEACTIVE':
                for (let index = 0; index < data.length; index++) {
                    const element = data[index]
                    if( element.id_parent===null||element.id_parent===''){
                        let root={
                                    key:element._id,
                                    label:element.name,
                                    data:{
                                        _id:element._id,
                                        code:element.code,
                                        name:element.name,
                                        image:element.image??'',
                                        website_enable:element.website_enable??false,
                                        id_parent:'',
                                        tags:element.tags??[],
                                        disabled:element.status==="ACTIVE"?false:true
                                    },
                                    children:[]
                                }
                        let seconds:TreeNodeModel[]=[]
                        for (let index = 0; index < data.length; index++) {
                                const elem = data[index]
                                if(elem.id_parent===element._id){
                                    let second={
                                        key:root.key+'-'+elem._id,
                                        label:elem.name,
                                        data:{
                                            _id:elem._id,
                                            code:elem.code,
                                            name:elem.name,
                                            image:elem.image??'',
                                            website_enable:elem.website_enable??false,
                                            id_parent:elem.id_parent,
                                            tags:elem.tags??[],
                                            disabled:elem.status==="ACTIVE"?false:true
                                        },
                                        children:[]
                                    }
                                    let thirds:TreeNodeModel[]=[]
                                    for (let index = 0; index < data.length; index++) {
                                        const e = data[index]
                                        if(e.id_parent===elem._id&&e.status==='DEACTIVE'){
                                            thirds.push(
                                                {
                                                    key:second.key+'-'+e._id,
                                                    label:e.name,
                                                    data:{
                                                        _id:e._id,
                                                        code:e.code,
                                                        name:e.name,
                                                        image:e.image??'',
                                                        website_enable:e.website_enable??false,
                                                        id_parent:e.id_parent,
                                                        tags:e.tags??[],
                                                        disabled:e.status==="ACTIVE"?false:true
                                                    },
                                                    children:[]
                                                }
                                            )
                                        }
                                    }
                                    if(thirds.length>0||second.data.disabled){
                                        second.children=second.data.disabled?[]:thirds as any
                                        seconds.push(second)
                                    }
                                }
                            }
                        if(seconds.length>0||root.data.disabled){
                            root.children=root.data.disabled?[]:seconds as any
                            list.push(root)
                        }
                    }
                }
                
                break;
            default:
                for (let index = 0; index < data.length; index++) {
                    const element = data[index]
                    if( (element.id_parent===null||element.id_parent==='')&&element.status===status){
                        list.push(
                            {
                                key:element._id,
                                label:element.name,
                                data:{
                                    _id:element._id,
                                    code:element.code,
                                    name:element.name,
                                    image:element.image??'',
                                    website_enable:element.website_enable??false,
                                    id_parent:'',
                                    tags:element.tags??[],
                                    disabled:element.status==="ACTIVE"?false:true
                                },
                                children:[]
                            }
                        )
                    }
                }
                for (let index = 0; index < list.length; index++) {
                    const root = list[index];
                    let fathers:TreeNodeModel[]=[]
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index]
                        if((element.id_parent===root.data._id)&&element.status===status){
                            fathers.push(
                                {
                                    key:root.key+'-'+element._id,
                                    label:element.name,
                                    data:{
                                        _id:element._id,
                                        code:element.code,
                                        name:element.name,
                                        image:element.image??'',
                                        website_enable:element.website_enable??false,
                                        id_parent:element.id_parent,
                                        tags:element.tags??[],
                                        disabled:element.status==="ACTIVE"?false:true
                                    },
                                    children:[]
                                }
                            )
                        }
                    }
                    for (let index = 0; index < fathers.length; index++) {
                        const father = fathers[index];
                        let children:TreeNodeModel[]=[]
                        for (let index = 0; index < data.length; index++) {
                            const e = data[index]
                            if((e.id_parent===father.data._id)&&e.status===status){
                                children.push(
                                    {
                                        key:father.key+'-'+e._id,
                                        label:e.name,
                                        data:{
                                            _id:e._id,
                                            code:e.code,
                                            name:e.name,
                                            image:e.image??'',
                                            website_enable:e.website_enable??false,
                                            id_parent:e.id_parent,
                                            tags:e.tags??[],
                                            disabled:e.status==="ACTIVE"?false:true
                                        },
                                        children:[]
                                    }
                                )
                            }
                        }
                        fathers[index].children=children
                    }
                    list[index].children=fathers
                }
                break;
        }
        
        return list
    },
    fromJson(data:any){
        let list:ProductTypeModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            if(element.id_parent===null||element.id_parent===''){
                list.push(
                    {
                        _id:element._id,
                        code:element.code,
                        name:element.name,
                        image:element.image??'',
                        website_enable:element.website_enable??false,
                        id_parent:element.id_parent,
                        level:0,
                        tags:element.tags??[],
                        disabled:element.status==="ACTIVE"?false:true
                    }
                )
                for (let idx = 0; idx < data.length; idx++) {
                    const elem = data[idx];
                    if(elem.id_parent===element._id){
                        list.push(
                            {
                                _id:elem._id,
                                code:elem.code,
                                name:elem.name,
                                image:elem.image??'',
                                website_enable:elem.website_enable??false,
                                id_parent:elem.id_parent,
                                level:1,
                                tags:elem.tags??[],
                                disabled:elem.status==="ACTIVE"?false:true
                            }
                        )
                        for (let i = 0; i < data.length; i++) {
                            const e = data[i];
                            if(e.id_parent===elem._id){
                                list.push(
                                    {
                                        _id:e._id,
                                        code:e.code,
                                        name:e.name,
                                        image:e.image??'',
                                        website_enable:e.website_enable??false,
                                        id_parent:e.id_parent,
                                        level:2,
                                        tags:e.tags??[],
                                        disabled:e.status==="ACTIVE"?false:true
                                    }
                                )
                            }
                        }
                    }
                }
            }
            
        }
        return list
    },
    async restoreItem(data:any){
        const response = await HttpService.doPutRequest('v1/producttype/restore', data)
        return parseCommonHttpResult(response)
    },
    async deleteItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/producttype', data)
        return parseCommonHttpResult(response)
    },
    async editItem(data:any){
        const response = await HttpService.doPutRequest('v1/producttype', data)
        return parseCommonHttpResult(response)
    },
    async addItem(data:any){
        const response = await HttpService.doPostRequest('v1/producttype', data)
        return parseCommonHttpResult(response)
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/producttype', data)
        return parseCommonHttpResult(response)
    },
}