import { GoldtypeModel } from "../model"
import { goldtypeOperators } from "../types"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"

export const GoldtypeService = {
    activeIfSelectAndDeactiveOthers(id: string, list: GoldtypeModel[]){
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
    itemFromJson(data:any){
        const item={
                id:data._id,
                code:data.code,
                name:data.name,
                unit:data.unit,
                age:data.age,
                buyRate:data.buy_rate,
                changeRate:data.change_rate,
                buyPriceRecipe:data.buy_price_recipe,
                buyPriceFromType:data.buy_price_from_type,
                buyPriceOperator:data.buy_price_operator as goldtypeOperators,
                buyPriceRate:data.buy_price_rate,
                buyPrice:data.buy_price,
                sellPriceRecipe:data.sell_price_recipe,
                sellPriceFromType:data.sell_price_from_type,
                sellPriceOperator:data.sell_price_operator as goldtypeOperators,
                sellPriceRate:data.sell_price_rate,
                sellPrice:data.sell_price,
                compensation: data.compensation,
                invoice:data.invoice,
                online:data.is_online,
                screen:data.is_screen??false,
                tags:data.tags??[],
                weightCustomName:data.weight_custom_name,
                active:false,
                disabled:data.status==="ACTIVE"?false:true
        }
        return item
    },
    listFromJson(data:any){
        //console.log(data)
        let list:GoldtypeModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            list.push(
                {
                    id:element._id,
                    code:element.code,
                    name:element.name,
                    unit:element.unit,
                    age:element.age,
                    buyRate:element.buy_rate,
                    changeRate:element.change_rate,
                    buyPriceRecipe:element.buy_price_recipe,
                    buyPriceFromType:element.buy_price_from_type,
                    buyPriceOperator:element.buy_price_operator as goldtypeOperators,
                    buyPriceRate:element.buy_price_rate,
                    buyPrice:element.buy_price,
                    sellPriceRecipe:element.sell_price_recipe,
                    sellPriceFromType:element.sell_price_from_type,
                    sellPriceOperator:element.sell_price_operator as goldtypeOperators,
                    sellPriceRate:element.sell_price_rate,
                    sellPrice:element.sell_price,
                    compensation: element.compensation,
                    invoice:element.invoice,
                    online:element.is_online,
                    screen:element.is_screen??false,
                    tags:element.tags??[],
                    weightCustomName:element.weight_custom_name,
                    active:false,
                    disabled:element.status==="ACTIVE"?false:true
                }
            )
        }
        return list
    },
    async restoreItem(data:any){
        const response = await HttpService.doPutRequest('v1/goldtype/restore', data)
        return parseCommonHttpResult(response)
    },
    async deleteItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/goldtype', data)
        return parseCommonHttpResult(response)
    },
    async editItem(data:any){
        const response = await HttpService.doPutRequest('v1/goldtype', data)
        return parseCommonHttpResult(response)
    },
    async addItem(data:any){
        const response = await HttpService.doPostRequest('v1/goldtype', data)
        return parseCommonHttpResult(response)
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/goldtype', data)
        return parseCommonHttpResult(response)
    },
}