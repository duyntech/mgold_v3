import { OldProductModel } from "../model"
import { status } from "../types"
import { dateStringToDate } from "../utils/util"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"
export const SemiProductStorageService = {
    activeIfSelectAndDeactiveOthers(id: string, list: OldProductModel[]){
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
    detailFromJson(data:any){
        let details:any[]=[]
        const {imports,exports,date}=data
        const exportedsInDate=(imports as any[]).filter(i=>i.status==="EXPORTED"&&i.export_date&&i.export_date===date)
        console.log("exportedsInDate",exportedsInDate)
        const exportedsAfterDate=(imports as any[]).filter(i=>i.status==="EXPORTED"&&i.export_date&&Date.parse(i.export_date)>Date.parse(date))
        console.log("exportedsAfterDate",exportedsAfterDate)
        const actives=(imports as any[]).filter(i=>i.status==="ACTIVE")
        const remaineds=[...actives,...exportedsAfterDate]
        //const exportedsInDate=(imports as any[]).filter(i=>i.status==="EXPORTED"&&exports.find((e: { import_detail_id: any })=>e.import_detail_id===i._id))
        for (let index = 0; index < remaineds.length; index++) {
            const element = remaineds[index];
            details.push({
                import_id:element._id,
                import_status:0,
                import_date:dateStringToDate(element.date),
                import_time:"",
                from_stock:element.from_stock,
                import_product:element.product_name,
                import_object:element.object,
                import_age:element.age,
                import_quantity:element.quantity,
                import_weight:element.weight,
                import_stone:element.stone,
                import_gold:element.weight-element.stone,
                import_exchange:element.exchange,
                import_note:element.note,
                to_stock:"",
                export_product:"",
                export_object:"",
                export_partner:"",
                export_age:0,
                export_quantity:0,
                export_weight:0,
                export_stone:0,
                export_gold:0,
                export_exchange:0,
                export_note:"",
                export_time:"",
                diff_weight:element.weight,
                diff_stone:element.stone,
                diff_gold:(element.weight-element.stone),
                diff_exchange:element.exchange,
            })
        }
        for (let index = 0; index < exportedsInDate.length; index++) {
            const element = exportedsInDate[index];
            const exItems=exports.filter((i: { import_detail_id: any })=>i.import_detail_id===element._id)
            console.log(exItems)
            const exportCode=exItems[0]?exItems[0].receipt["code"]:''
            const partners=[... new Set(exItems.map(((e: { partner: any })=>e.partner&&e.partner)))].join(",")
            const toStocks=[... new Set(exItems.map(((e: { to_stock: any })=>e.to_stock)))].join(",")
            const ages=[... new Set(exItems.map(((e: { age: any })=>e.age)))].join(",")
            const quantity=exItems.reduce((sum: any,el: { quantity: any })=>sum+=el.quantity,0)
            const weight=exItems.reduce((sum: any,el: { weight: any })=>sum+=el.weight,0)
            const stone=exItems.reduce((sum: any,el: { stone: any })=>sum+=el.stone,0)
            const exchange=exItems[0]?exItems[0]["exchange"]:0
            details.push({
                import_id:element._id,
                import_status:1,
                import_date:dateStringToDate(element.date),
                import_time:"",
                from_stock:element.from_stock,
                import_product:element.product_name,
                import_object:element.object,
                import_age:element.age,
                import_quantity:element.quantity,
                import_weight:element.weight,
                import_stone:element.stone,
                import_gold:element.weight-element.stone,
                import_exchange:element.exchange,
                import_note:element.note,
                export_code:exportCode,
                to_stock:toStocks,
                export_product:"",
                export_object:"",
                export_partner:partners,
                export_age:ages,
                export_quantity:quantity,
                export_weight:weight,
                export_stone:stone,
                export_gold:weight-stone,
                export_exchange:exchange,
                export_note:"",
                export_time:"",
                diff_weight:element.weight-weight,
                diff_stone:element.stone-stone,
                diff_gold:(element.weight-element.stone)-(weight-stone),
                diff_exchange:element.exchange-exchange,
            })
        }
        console.log(exports)
        return details
    },
    listFromJson(data:any){
        let list:OldProductModel[]=[]
        //console.log(data)
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            if(element.trading_type!=='SELL'){
                list.push(
                    {
                    _id:element._id,
                    code:element.code,
                    name:element.name,
                    counter:'',
                    product_type:'',
                    supplier:'',
                    gold_type:element.gold_type,
                    images:[],
                    tags:[],
                    unit:element.unit,
                    weight:element.weight,
                    stone:element.stone,
                    gold_weight:element.gold_weight,
                    ni_weight:element.ni_weight,
                    final_weight:element.final_weight,
                    age:0,
                    exchange_rate:element.exchange_rate,
                    wage:element.wage,
                    root_wage:0,
                    stone_value:element.stone_value,
                    value:element.value,
                    amount:element.amount,
                    refund:element.refund,
                    makeup:element.makeup,
                    buyin_rate:element.buyin_rate,
                    buyin_price:element.buyin_price,
                    has_invoice:element.has_invoice,
                    invoice_checking:false,
                    active:false,
                    is_online:false,
                    is_new:false,
                    is_hot:false,
                    discount:element.discount,
                    fixed_price:element.fixed_price,
                    trading_type:element.sell_type,
                    date:'',
                    status:"ACTIVE" as status,
                    trading_rate:element.trading_rate,
                    trading_weight:element.trading_weight,
                    trading_gold:'',
                    trading_value:element.trading_value,
                    retail_code:element.sell_code
                    }
                )
            }
            
        }
        return list
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/semi', data)
        return parseCommonHttpResult(response)
    },
    async fetchDetails(data:any){
        const response = await HttpService.doGetRequest('v1/semi/detail', data)
        return parseCommonHttpResult(response)
    },
}