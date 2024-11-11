import { ProductModel } from "../model"
import { ProductFilterProps, status } from "../types"
import { booleanRefactor, formatDateTimeToFormatString, roundNumber, sortProductImages, weightByUnit } from "../utils/util"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"
export const ProductStorageService = {
    activeIfSelectAndDeactiveOthers(id: string, list: ProductModel[]){
        list.forEach((item, idx) => {
            if (item._id !==id ) {
            list[idx].active = false
            }
            else{
                list[idx].active = true
                }
            })
        return list
    },
    changeFilter(filters:ProductFilterProps,data:any){
        const newFilters = { ...filters, [data.key]: data.value }
        return newFilters
    },
    itemFromJson(data:any){
        let item=ProductModel.initial()
        const goldType=Object(data.gold_type)
        const status=data.status
        if(["ACTIVE","BOOKED","WAITING"].indexOf(status)>=0){
            const weight=data.weight??0
            const stone=data.stone??0
            const goldWeight=weight-stone
            const stoneValue=data.stone_value??0
            const wage=data.wage??0
            const discount=data.discount??0
            const sellPrice=goldType.sell_price??0
            const fixedPrice=data.fixed_price??0
            const amount=fixedPrice>0?fixedPrice-discount:weightByUnit(goldWeight,goldType.unit)*sellPrice+wage+stoneValue-discount
            item={
                _id:data._id,
                code:data.code,
                name:data.name,
                counter:data.counter??'',
                product_type:data.product_type??'',
                supplier:data.supplier??'',
                gold_type:goldType.code,
                images:sortProductImages(data.images!==undefined&&data.images!==''?data.images:[]),
                tags:data.tags,
                unit:goldType.unit,
                weight:weight,
                stone:stone,
                gold_weight:goldWeight,
                ni_weight:0,
                final_weight:goldWeight,
                age:goldType.age??0,
                exchange_rate:sellPrice,
                wage:wage,
                root_wage:data.cost_wage??0,
                stone_value:stoneValue,
                discount:discount,
                amount:roundNumber(amount),
                active:false,
                is_online:booleanRefactor(data.online),
                is_new:booleanRefactor(data.new),
                is_hot:booleanRefactor(data.hot),
                fixed_price:fixedPrice,
                date:data.date,
                status:data.status as status,
                trading_rate:goldType.change_rate??100,
                buyin_rate:goldType.buy_rate??100,
                import_detail_id:'',
                purchase_order_id:'',
                symbol:'',
                ni:'',
                note:'',
                descriptions:data.descriptions??[]
            }
        }
        else if(["SOLD"].indexOf(status)>=0){
            let weight=data.weight??0
            let stone=data.stone??0
            let goldWeight=weight-stone
            let niWeight=0
            let finalWeight=goldWeight
            let stoneValue=data.stone_value??0
            let wage=data.wage??0
            let discount=data.discount??0
            let sellPrice=goldType.sell_price??0
            let fixedPrice=data.fixed_price??0
            let amount=fixedPrice>0?fixedPrice-discount:weightByUnit(goldWeight,goldType.unit)*sellPrice+wage+stoneValue-discount
            let tradingRate=goldType.change_rate??100
            let buyinRate=goldType.buy_rate??100
            const soldProduct= data.product_sold!==undefined?Object(data.product_sold):undefined
            
            if(soldProduct!==undefined){
                weight=soldProduct.weight
                stone=soldProduct.stone
                niWeight=soldProduct.ni_weight
                finalWeight=soldProduct.final_weight
                stoneValue=soldProduct.stone_value
                wage=soldProduct.wage
                discount=soldProduct.discount
                sellPrice=soldProduct.exchange_rate
                fixedPrice=soldProduct.fixed_price
                amount=soldProduct.amount
                tradingRate=soldProduct.trading_rate
                buyinRate=soldProduct.buyin_rate
            }

            item={
                _id:data._id,
                code:data.code,
                name:data.name,
                counter:data.counter??'',
                product_type:data.product_type??'',
                supplier:data.supplier??'',
                gold_type:goldType.code,
                images:sortProductImages(data.images!==undefined&&data.images!==''?data.images:[]),
                tags:data.tags,
                unit:goldType.unit,
                weight:weight,
                stone:stone,
                gold_weight:goldWeight,
                ni_weight:niWeight,
                final_weight:finalWeight,
                age:goldType.age??0,
                exchange_rate:sellPrice,
                wage:wage,
                root_wage:data.cost_wage??0,
                stone_value:stoneValue,
                discount:discount,
                amount:roundNumber(amount),
                active:false,
                is_online:booleanRefactor(data.online),
                is_new:booleanRefactor(data.new),
                is_hot:booleanRefactor(data.hot),
                fixed_price:fixedPrice,
                date:data.date,
                status:data.status as status,
                trading_rate:tradingRate,
                buyin_rate:buyinRate,
                import_detail_id:'',
                purchase_order_id:'',
                symbol:'',
                ni:'',
                note:'',
                descriptions:data.descriptions??[]
            }
        }    
        return item
    },
    listFromJson(data:any){
        let list:ProductModel[]=[]
        //console.log(data)
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            //console.log(element.images)
            list.push(
                {
                    _id:element._id,
                    code:element.code,
                    name:element.name,
                    counter:element.counter??'',
                    product_type:element.product_type??'',
                    supplier:element.supplier??'',
                    gold_type:element.gold_type,
                    images:sortProductImages(element.images!==undefined&&element.images!==''?element.images:[]),
                    tags:element.tags!==undefined&&element.tags!==''?element.tags:[],
                    unit:element.unit,
                    weight:element.weight,
                    stone:element.stone,
                    gold_weight:element.gold_weight,
                    ni_weight:0,
                    final_weight:0,
                    age:0,
                    exchange_rate:0,
                    wage:element.wage,
                    root_wage:element.cost_wage,
                    stone_value:element.stone_value,
                    discount:element.discount,
                    amount:0,
                    active:false,
                    is_online:booleanRefactor(element.online),
                    is_new:booleanRefactor(element.new),
                    is_hot:booleanRefactor(element.hot),
                    fixed_price:element.fixed_price,
                    date:formatDateTimeToFormatString(element.date,"YYYY-MM-DD"),
                    status:element.status as status,
                    trading_rate:element.trading_rate??100,
                    buyin_rate:element.buyin_rate??100,
                    descriptions:element.descriptions??[]
                }
            )
        }
        return list
    },
    async printItem(data:any){
        const response = await HttpService.doPrintRequest(data.url, data.data)
        return parseCommonHttpResult(response)
    },
    async addItem(data:any){
        const response = await HttpService.doPostRequest('v1/product', data)
        return parseCommonHttpResult(response)
    },
    async editItem(data:any){
        const response = await HttpService.doPutRequest('v1/product', data)
        return parseCommonHttpResult(response)
    },
    async deleteItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/product', data)
        return parseCommonHttpResult(response)
    },
    async restoreItem(data:any){
        const response = await HttpService.doPutRequest('v1/product/restore', data)
        return parseCommonHttpResult(response)
    },
    async patchItem(data:any){
        const response = await HttpService.doPatchRequest('v1/product', data)
        return parseCommonHttpResult(response)
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/product', data)
        return parseCommonHttpResult(response)
    },
}