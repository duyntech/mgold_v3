import { InventoryModel, ProductModel } from "../model"
import { status } from "../types"
import { ProductStorageService } from "./ProductStorage.service"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"
export const InventoryService = {
    activeIfSelectAndDeactiveOthers(id: string, list: InventoryModel[]){
        list.forEach((item, idx) => {
            if (item.id !==id ) {
            list[idx].active = false
            }
            else{
                list[idx].active = true
                }
            })
        return list
    },
    updateInventorieds(inventorieds:ProductModel[],item:ProductModel){
        inventorieds.push(item)
        return inventorieds.reverse()
    },
    reduceRemains(remains:ProductModel[],inventorieds:ProductModel[]){
        let list=remains
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            const inventoried=inventorieds.find((e)=>e.code===element.code)
            if(inventoried!==undefined){
                list[index].active=true
            }
        }
        list=list.sort((a,b)=>{
            const aValue=a.active?1:0
            const bValue=b.active?1:0
            return aValue-bValue
        })
        return list
    },
    inventoriedItemFromJson(data:any){
        //console.log(data)
        const product=data.product
        const item={
                    _id:"",
                    code:product.code,
                    name:product.name,
                    counter:product.counter,
                    product_type:product.product_type,
                    supplier:product.supplier,
                    gold_type:product.gold_type,
                    images:product.images??[],
                    tags:product.tags??[],
                    unit:'LY',
                    weight:data.weight,
                    stone:data.stone,
                    gold_weight:data.gold_weight,
                    ni_weight:0,
                    final_weight:0,
                    age:0,
                    exchange_rate:0,
                    wage:0,
                    root_wage:0,
                    stone_value:0,
                    discount:0,
                    amount:0,
                    active:false,
                    is_online:false,
                    is_new:false,
                    is_hot:false,
                    fixed_price:0,
                    date:'',
                    status:data.status as status,
                    trading_rate:data.trading_rate??100,
                    buyin_rate:data.buyin_rate??100
                }
        return item
    },
    inventoriedListFromJson(data:any){
        //console.log(data)
        let list:ProductModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            const product=element.product
            list.push(
                {
                    _id:"",
                    code:product.code,
                    name:product.name,
                    counter:product.counter??'',
                    product_type:product.product_type??'',
                    supplier:product.supplier??'',
                    gold_type:product.gold_type,
                    images:product.images??[],
                    tags:product.tags??[],
                    unit:'LY',
                    weight:element.weight,
                    stone:element.stone,
                    gold_weight:element.gold_weight,
                    ni_weight:0,
                    final_weight:0,
                    age:0,
                    exchange_rate:0,
                    wage:0,
                    root_wage:0,
                    stone_value:0,
                    discount:0,
                    amount:0,
                    active:false,
                    is_online:false,
                    is_new:false,
                    is_hot:false,
                    fixed_price:0,
                    date:'',
                    status:data.status as status,
                    trading_rate:element.trading_rate??100,
                    buyin_rate:element.buyin_rate??100
                }
            )
        }
        return list
    },
    itemFromJson(data:any){
        //console.log(data)
        const item={
            id:data._id,
            code:data.code,
            creator:'',
            date:new Date(data.date),
            goldType:data.gold_type??'',
            counter:data.counter??'',
            productType:data.product_type??'',
            remain:ProductStorageService.listFromJson(data.products),
            inventoried:[],
            active:false,
            disabled:data.status==='ACTIVE'?false:true
        }
        return item
    },
    listFromJson(data:any){
        //console.log(data)
        let list:InventoryModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            const inventoriedList=this.inventoriedListFromJson(element.inventories)
            let remainList=ProductStorageService.listFromJson(element.products)
            remainList=this.reduceRemains(remainList,inventoriedList)
            list.push(
                {
                    id:element._id,
                    code:element.code,
                    creator:element.create_user,
                    date:new Date(element.date),
                    goldType:element.gold_type??'',
                    counter:element.counter??'',
                    productType:element.product_type??'',
                    remain:remainList,
                    inventoried:inventoriedList.reverse(),
                    active:false,
                    disabled:element.status==='ACTIVE'?false:true
                }
            )
        }
        return list
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/inventory/product', data)
        return parseCommonHttpResult(response)
    },
    async deleteReceipt(data:any){
        const response = await HttpService.doDeleteRequest('v1/inventory/product', data)
        return parseCommonHttpResult(response)
    },
    async addReceipt(data:any){
        const response = await HttpService.doPostRequest('v1/inventory/product', data)
        return parseCommonHttpResult(response)
    },
    async inventoryProduct(data:any){
        const response = await HttpService.doPostRequest('v1/inventory/product/item', data)
        return parseCommonHttpResult(response)
    }
}