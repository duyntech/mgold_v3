import { GoldtypeModel, OldProductModel, ProductModel, RetailModel } from "../model"
import { status } from "../types"
import { formatDateToFormatString, roundNumber, toFixedRefactor, weightByUnit } from "../utils/util"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"
export const RetailService = {
    activeIfSelectAndDeactiveOthers(id: string, list: RetailModel[]){
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
        //console.log(data)
        const fullName=data.customer!==undefined?(data.customer["full_name"]!==null&&data.customer["full_name"]!==undefined?data.customer["full_name"]: data.customer["last_name"]+' '+data.customer["first_name"]):''
        const item={
            id:data._id,
            code:data.code,
            customer:{
                id:data.customer["_id"],
                username:"",
                firstName:data.customer["first_name"],
                lastName:data.customer["last_name"],
                fullName:fullName,
                filterName:data.customer["phone"]!==undefined&&data.customer["phone"]!==null?data.customer["phone"] + ' - '+fullName :fullName,
                role:{_id:'',code:'',name:''},
                birthDate:"",
                phone:data.customer["phone"],
                email:data.customer["email"],
                address:data.customer["address"],
                isAdmin:false,
                active:false,
                disabled:false,
                isOnline:false,
                personalCard:data.customer["personal_card"],
                personalCardImage:data.customer["personal_card_image"],
                ipAddress:'',
                province: data.customer["province"],
                district: data.customer["district"],
                ward: data.customer["ward"],
                expireTime: 0,
                accessTime: 0,
                status:"VERIRY"
            },
            orderDatetime:formatDateToFormatString(data.createdAt,"DD-MM-YYYY HH:mm"),
            newProduct:data.new_value,
            exchangeProduct:data.exchange_value,
            oldProduct:data.old_value,
            discount:data.discount_value,
            amount:data.final_value,
            active:false,
            newList:data.new_products,
            newTradingDetails:data.newTradingDetails??[],
            oldList:data.old_products,
            exchangeNewList:data.ex_new_products,
            exchangeOldList:data.ex_old_products,
            exchangeResList:data.ex_res_products,
            paymentType:data.payment,
            hasInvoice:data.invoice_exchange,
            createUser:data.create_user,
            disabled:data.status==="ACTIVE"?false:true
        }
        return item
    },
    listFromJson(data:any){
        //console.log(data)
        let list:RetailModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            const fullName=element.customer!==undefined?(element.customer["full_name"]!==null&&element.customer["full_name"]!==undefined?element.customer["full_name"]: element.customer["last_name"]+' '+element.customer["first_name"]):''
            list.push({
                id:element._id,
                code:element.code,
                customer:{
                    id: element.customer["_id"],
                    username: "",
                    firstName: element.customer["first_name"],
                    lastName: element.customer["last_name"],
                    fullName: fullName,
                    filterName: element.customer["phone"] !== undefined && element.customer["phone"] !== null ? element.customer["phone"] + ' - ' + fullName : fullName,
                    role: { _id: '', code: '', name: '' },
                    birthDate: "",
                    phone: element.customer["phone"],
                    email: element.customer["email"],
                    address: element.customer["address"],
                    personalCard: element.customer["personal_card"],
                    personalCardImage: element.customer["personal_card_image"],
                    isAdmin: false,
                    active: false,
                    disabled: false,
                    isOnline: false,
                    ipAddress: '',
                    province: element.customer["province"],
                    district: element.customer["district"],
                    ward: element.customer["ward"],
                    expireTime: 0,
                    accessTime: 0,
                    status:"VERIRY"
                },
                orderDatetime:formatDateToFormatString(element.createdAt,"DD-MM-YYYY HH:mm"),
                newProduct:element.new_value,
                exchangeProduct:element.exchange_value,
                oldProduct:element.old_value,
                discount:element.discount_value,
                amount:element.final_value,
                active:false,
                newList:element.new_products,
                newTradingDetails:element.newTradingDetails??[],
                oldList:element.old_products,
                exchangeNewList:element.ex_new_products,
                exchangeOldList:element.ex_old_products,
                exchangeResList:element.ex_res_products,
                paymentType:element.payment,
                hasInvoice:element.invoice_exchange,
                createUser:element.create_user,
                disabled:element.status==="ACTIVE"?false:true
            })
            
        }
        return list
    },
    summaryNew(list:ProductModel[]){
        let refactorList:any[]=[]
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            const f=refactorList.findIndex((type)=>type.key===element.gold_type)
            f>=0?
            refactorList[f].values.push({value_1:element.final_weight,value_1_unit:element.unit,value_2:element.amount,value_2_unit:"đ"})
            :refactorList.push({key:element.gold_type,values:[{value_1:element.final_weight,value_1_unit:element.unit,value_2:element.amount,value_2_unit:"đ"}]})
        }
        let summaryList:any[]=[]
        for (let index = 0; index < refactorList.length; index++) {
            const item = refactorList[index];
            summaryList.push({
                key:item.key,
                value_1:item.values.reduce((sum: number,el: { value_1: number; value_2:number })=>sum+=el.value_1,0),
                value_1_unit:item.values[0].value_1_unit,
                value_2:item.values.reduce((sum: number,el: { value_1: number; value_2:number })=>sum+=el.value_2,0),
                value_2_unit:item.values[0].value_2_unit
            })
        }
        return summaryList
    },
    summaryOld(list:OldProductModel[]){
        let refactorList:any[]=[]
        for (let index = 0; index < list.length; index++) {
            const element = list[index];
            const f=refactorList.findIndex((type)=>type.key===element.gold_type)
            f>=0?
            refactorList[f].values.push({value_1:element.final_weight,value_1_unit:element.unit,value_2:element.amount,value_2_unit:"đ"})
            :refactorList.push({key:element.gold_type,values:[{value_1:element.final_weight,value_1_unit:element.unit,value_2:element.amount,value_2_unit:"đ"}]})
        }
        let summaryList:any[]=[]
        for (let index = 0; index < refactorList.length; index++) {
            const item = refactorList[index];
            summaryList.push({
                key:item.key,
                value_1:item.values.reduce((sum: number,el: { value_1: number; value_2:number })=>sum+=el.value_1,0),
                value_1_unit:item.values[0].value_1_unit,
                value_2:item.values.reduce((sum: number,el: { value_1: number; value_2:number })=>sum+=el.value_2,0),
                value_2_unit:item.values[0].value_2_unit
            })
        }
        return summaryList
    },
    summaryOldExchange(list:OldProductModel[]){
        let refactorList:any[]=[]
        for (let index = 0; index < list.length; index++) {
            const element = list[index]
            const finalWeight=toFixedRefactor(element.final_weight,3)
            const f=refactorList.findIndex((type)=>type.key===element.gold_type)
            f>=0?
            refactorList[f].values.push({value_1:finalWeight,value_1_unit:element.unit,value_2:element.amount,value_2_unit:"đ"})
            :refactorList.push({key:element.gold_type,values:[{value_1:finalWeight,value_1_unit:element.unit,value_2:element.amount,value_2_unit:"đ"}]})
        }
        let summaryList:any[]=[]
        for (let index = 0; index < refactorList.length; index++) {
            const item = refactorList[index];
            summaryList.push({
                key:item.key,
                value_1:item.values.reduce((sum: number,el: { value_1: number; value_2:number })=>sum+=el.value_1,0),
                value_1_unit:item.values[0].value_1_unit,
                value_2:item.values.reduce((sum: number,el: { value_1: number; value_2:number })=>sum+=el.value_2,0),
                value_2_unit:item.values[0].value_2_unit
            })
        }
        return summaryList
    },
    resetValueOfExchangeOldItems(item:RetailModel){
        let oldList=item.exchangeOldList
        for (let index = 0; index < oldList.length; index++) {
            const element = oldList[index];
            if(item.hasInvoice){
                oldList[index].value=weightByUnit(element.final_weight,element.unit)*element.exchange_rate
                }
            else{
                oldList[index].value=weightByUnit(element.final_weight,element.unit)*element.buyin_price
            }
            oldList[index].amount=oldList[index].value*element.buyin_rate/100+element.discount
        }
        return oldList
    },
    computingOrderValue(item:RetailModel){
        return item.newProduct+item.exchangeProduct-item.oldProduct;
    },
    isMultiGoldExchange(item:RetailModel){
        const summaryNew=this.summaryNew(item.exchangeNewList)
        const summaryOld=this.summaryNew(item.exchangeOldList)
        const summaryList = summaryNew.concat(summaryOld.filter( ({key}) => !summaryNew.find(f => f.key == key) ))
        const filteredList=summaryList.filter((item)=>item.key!=='')
        return filteredList.length>1
    },
    processProductTrading(item:RetailModel,goldTypes:GoldtypeModel[]){
        const hasInvoice=item.hasInvoice
        let oldList=item.exchangeOldList
        const newList=item.exchangeNewList
        if(newList.length===0) return oldList
        if(hasInvoice){
            oldList= this.processInvoiceTrading(item)
        }
        else{
            const isMultiGoldExchange=this.isMultiGoldExchange(item)
            if(isMultiGoldExchange){
                oldList=this.processMultiGoldWithoutInvoiceTrading(item,goldTypes)
            }
            else{
                oldList=this.processWithoutInvoiceTrading(item)
            }
        }
        return oldList;
    },
    processInvoiceTrading(data:RetailModel){
        let oldList=data.exchangeOldList
        let resList=data.exchangeResList
        const newList=data.exchangeNewList
        const newTotalValue=newList.reduce((sum, el) => sum += el.amount, 0)
        let currentNewValue=newTotalValue;
        for (let index = 0; index < oldList.length; index++) {
            const item = oldList[index];
                //oldList[index].exchange_rate=newList[0].exchange_rate
                const realValue=item.value===0?0:item.value*item.trading_rate/100
                //console.log(realValue)
                const diffValue=currentNewValue-realValue
                const tradingValue=diffValue>=0?realValue:currentNewValue
                currentNewValue=diffValue
                oldList[index].trading_value=tradingValue
                //console.log("tradingValue",tradingValue)
                if(tradingValue>0){
                    //console.log("tradingValue >0",tradingValue)
                    const buyValue=oldList[index].value-oldList[index].trading_value/oldList[index].trading_rate*100;
                    //console.log("buyValue:",buyValue)
                    if(buyValue>0){
                        //console.log("buyValue >0",buyValue)
                        const idx=resList.findIndex((item)=>item.trading_type==='BUY')
                        if(idx>=0){
                            //console.log("buyValue idx>=0:",buyValue)
                            resList[idx].name=oldList[index].name+' đổi dư'
                            resList[idx].value=buyValue
                            resList[idx].amount=buyValue*resList[idx].buyin_rate/100
                        }
                        else{
                            //console.log("buyValue idx<0:",buyValue)
                            const buyItem={
                                _id:"",
                                code:'',
                                name:oldList[index].name+' đổi dư',
                                counter:'',
                                product_type:'',
                                supplier:'',
                                gold_type:oldList[index].gold_type,
                                images:[],
                                tags:[],
                                unit:oldList[index].unit,
                                weight:0,
                                stone:0,
                                gold_weight:0,
                                ni_weight:0,
                                final_weight:0,
                                age:0,
                                exchange_rate:0,
                                wage:0,
                                root_wage:0,
                                stone_value:0,
                                value:buyValue,
                                amount:buyValue*oldList[index].buyin_rate/100,
                                refund:0,
                                makeup:0,
                                buyin_rate:item.buyin_rate,
                                buyin_price:item.buyin_price,
                                has_invoice:false,
                                invoice_checking:false,
                                active:false,
                                is_online:false,
                                is_new:false,
                                is_hot:false,
                                discount:0,
                                retail_code:'',
                                trading_type:'BUY',
                                date:'',
                                trading_rate:item.trading_rate,
                                trading_weight:0,
                                trading_gold:'',
                                trading_value:0,
                                fixed_price:0,
                                status:"ACTIVE" as status
                            }
                            resList.push(buyItem)
                        }
                    }
                    else{
                        //console.log("buyValue <=0",buyValue)
                        const idx=resList.findIndex((item)=>item.trading_type==='BUY')
                        if(idx>=0){
                            resList.splice(idx,1)
                        }
                    }
                }
                else{
                    //console.log("tradingValue <=0",tradingValue)
                    oldList[index].trading_value=0
                }
            //}
        }
        //console.log("currentNewValue",currentNewValue)
        if(currentNewValue>0){
            const idx=resList.findIndex((item)=>item.trading_type==='SELL')
            //console.log("currentNewValue idx",idx)
            if(idx>=0){
                resList[idx].value=currentNewValue
                resList[idx].amount=currentNewValue
            }
            else{
                const buyItem={
                    _id:"",
                    code:'',
                    name:'Khách mua vàng',
                    counter:'',
                    product_type:'',
                    supplier:'',
                    gold_type:newList[0].gold_type,
                    images:[],
                    tags:[],
                    unit:newList[0].unit,
                    weight:0,
                    stone:0,
                    gold_weight:0,
                    ni_weight:0,
                    final_weight:0,
                    age:0,
                    exchange_rate:newList[0].exchange_rate,
                    wage:0,
                    root_wage:0,
                    stone_value:0,
                    value:currentNewValue,
                    amount:currentNewValue,
                    refund:0,
                    makeup:0,
                    buyin_rate:100,
                    buyin_price:0,
                    has_invoice:false,
                    invoice_checking:false,
                    active:false,
                    is_online:false,
                    is_new:false,
                    is_hot:false,
                    discount:0,
                    retail_code:'',
                    trading_type:'SELL',
                    date:'',
                    trading_rate:100,
                    trading_weight:0,
                    trading_gold:'',
                    trading_value:0,
                    fixed_price:0,
                    status:"ACTIVE" as status
                }
                resList.push(buyItem)
            }
        }
        else{
            const idx=resList.findIndex((item)=>item.trading_type==='SELL')
            if(idx>=0){
                resList.splice(idx,1)
            }
        }
        return oldList;
    },
    processWithoutInvoiceTrading(data:RetailModel){
        let oldList=data.exchangeOldList
        let resList=data.exchangeResList
        const newList=data.exchangeNewList
        const newTotalWeight=newList.reduce((sum, el) => sum += el.final_weight, 0)
        let currentNewWeight=newTotalWeight;
        for (let index = 0; index < oldList.length; index++) {
            const item = oldList[index];
                const realWeight=item.final_weight===0?0:item.final_weight*item.trading_rate/100
                //console.log("realWeight:",realWeight)
                const diffWeight=toFixedRefactor(currentNewWeight-realWeight,3)
                //console.log("diffWeight:",diffWeight)
                const tradingWeight=diffWeight>=0?realWeight:currentNewWeight
                //console.log("tradingWeight:",tradingWeight)
                currentNewWeight=diffWeight
                //console.log("currentNewWeight:",currentNewWeight)
                oldList[index].trading_weight=tradingWeight
                let weight=0
                let makeupValue=0
                if(tradingWeight>0){
                    //console.log("tradingWeight>0")
                    weight=weightByUnit(oldList[index].trading_weight,item.unit)
                    const buyWeight=oldList[index].final_weight-oldList[index].trading_weight/oldList[index].trading_rate*100;
                    const convertedBuyWeight=weightByUnit(buyWeight,item.unit)
                    //console.log("buyWeight:",buyWeight)
                    if(buyWeight>0){
                        const idx=resList.findIndex((item)=>item.trading_type==='BUY')
                        if(idx>=0){
                            //console.log("buyWeight idx>=0:",buyWeight)
                            resList[idx].name=oldList[index].name+' đổi dư'
                            resList[idx].weight=buyWeight
                            resList[idx].gold_weight=buyWeight
                            resList[idx].final_weight=buyWeight
                            resList[idx].value=convertedBuyWeight*resList[idx].buyin_price
                            resList[idx].amount=convertedBuyWeight*resList[idx].buyin_price
                        }
                        else{
                            //console.log("buyWeight idx<0:",buyWeight)
                            const buyItem={
                                _id:"",
                                code:'',
                                name:oldList[index].name+' đổi dư',
                                counter:'',
                                product_type:'',
                                supplier:'',
                                gold_type:oldList[index].gold_type,
                                images:[],
                                tags:[],
                                unit:oldList[index].unit,
                                weight:buyWeight,
                                stone:0,
                                gold_weight:buyWeight,
                                ni_weight:0,
                                final_weight:buyWeight,
                                age:0,
                                exchange_rate:0,
                                wage:0,
                                root_wage:0,
                                stone_value:0,
                                value:convertedBuyWeight*item.buyin_price,
                                amount:convertedBuyWeight*item.buyin_price,
                                refund:0,
                                makeup:0,
                                buyin_rate:100,
                                buyin_price:item.buyin_price,
                                has_invoice:false,
                                invoice_checking:false,
                                active:false,
                                is_online:false,
                                is_new:false,
                                is_hot:false,
                                discount:0,
                                retail_code:'',
                                trading_type:'BUY',
                                date:'',
                                trading_rate:item.trading_rate,
                                trading_weight:0,
                                trading_gold:'',
                                trading_value:0,
                                fixed_price:0,
                                status:"ACTIVE" as status
                            }
                            resList.push(buyItem)
                        }
                        
                    }
                    else{
                        const idx=resList.findIndex((item)=>item.trading_type==='BUY')
                        if(idx>=0){
                            resList.splice(idx,1)
                        }
                    }
                    oldList[index].value=weight*item.exchange_rate+convertedBuyWeight*item.buyin_price
                    //console.log(oldList[index].value)
                    makeupValue=weight*item.makeup
                    //console.log(makeupValue)
                }
                else{
                    //console.log("tradingWeight<=0")
                    //console.log(oldList[index].exchange_rate)
                    oldList[index].trading_weight=0
                    //oldList[index].exchange_rate=item.buyin_price
                    weight=weightByUnit(oldList[index].final_weight,item.unit)
                    oldList[index].value=weight*item.exchange_rate
                }
                oldList[index].amount=oldList[index].value-makeupValue
            //}
        }
        //console.log("currentNewWeight:",currentNewWeight)
        if(currentNewWeight>0){
            const weight=weightByUnit(currentNewWeight,newList[0].unit)
            const idx=resList.findIndex((item)=>item.trading_type==='SELL')
            //console.log("currentNewWeight idx",idx)
            if(idx>=0){
                resList[idx].weight=currentNewWeight
                resList[idx].gold_weight=currentNewWeight
                resList[idx].final_weight=currentNewWeight
                resList[idx].value=weight*newList[idx].exchange_rate
                resList[idx].amount=weight*newList[idx].exchange_rate

            }
            else{
                const buyItem={
                    _id:"",
                    code:'',
                    name:'Khách mua vàng',
                    counter:'',
                    product_type:'',
                    supplier:'',
                    gold_type:newList[0].gold_type,
                    images:[],
                    tags:[],
                    unit:newList[0].unit,
                    weight:currentNewWeight,
                    stone:0,
                    gold_weight:currentNewWeight,
                    ni_weight:0,
                    final_weight:currentNewWeight,
                    age:0,
                    exchange_rate:newList[0].exchange_rate,
                    wage:0,
                    root_wage:0,
                    stone_value:0,
                    value:weight*newList[0].exchange_rate,
                    amount:weight*newList[0].exchange_rate,
                    refund:0,
                    makeup:0,
                    buyin_rate:100,
                    buyin_price:0,
                    has_invoice:false,
                    invoice_checking:false,
                    active:false,
                    is_online:false,
                    is_new:false,
                    is_hot:false,
                    discount:0,
                    retail_code:'',
                    trading_type:'SELL',
                    date:'',
                    trading_rate:100,
                    trading_weight:0,
                    trading_gold:'',
                    trading_value:0,
                    fixed_price:0,
                    status:"ACTIVE" as status
                }
                resList.push(buyItem)
            }
        }
        else{
            const idx=resList.findIndex((item)=>item.trading_type==='SELL')
            if(idx>=0){
                resList.splice(idx,1)
            }
        }
        return oldList;
    },
    processMultiGoldWithoutInvoiceTrading(data:RetailModel,goldTypes:GoldtypeModel[]){
        const oldList=data.exchangeOldList
        const newList=data.exchangeNewList
        //let resList=data.exchangeResList
        let newTradingDetails=data.newTradingDetails
        let newSummaryGolds=this.summaryNew(newList)
        let oldSummaryGolds=this.summaryOldExchange(oldList)
        //console.log("newSummaryGolds",newSummaryGolds)
        //console.log("oldSummaryGolds",oldSummaryGolds)
        //Exchange p2p gold
        for (let oIdx = 0; oIdx < oldSummaryGolds.length; oIdx++) {
            const oldItem = oldSummaryGolds[oIdx];
            for (let nIdx = 0; nIdx < newSummaryGolds.length; nIdx++) {
                const newItem = newSummaryGolds[nIdx];
                const finalWeight=toFixedRefactor(newItem.value_1,3)
                if(newItem.key===oldItem.key){
                    const goldType=goldTypes.find((e)=>e.code===oldItem.key)
                    const diffWeight=toFixedRefactor(oldItem.value_1-newItem.value_1,3)
                    //console.log("diffWeight "+oldItem.key,diffWeight)
                    const tradingWeight=toFixedRefactor(diffWeight>=0?newItem.value_1:oldItem.value_1,3)
                    //console.log("tradingWeight "+oldItem.key,tradingWeight)
                    const dIdx=newTradingDetails.findIndex((e)=>e.gold_type===oldItem.key)
                    if(dIdx!==undefined&&dIdx>=0){
                        if(tradingWeight>0){
                            newTradingDetails[dIdx].final_weight=finalWeight
                            newTradingDetails[dIdx].trading_weight=tradingWeight
                            newTradingDetails[dIdx].trading_rest=diffWeight>0?diffWeight:0
                            newTradingDetails[dIdx].remain_weight=diffWeight<0?Math.abs(diffWeight):0
                            newTradingDetails[dIdx].trading_type='EQUAL'
                            newTradingDetails[dIdx].trading_gold=oldItem.key
                            newTradingDetails[dIdx].trading_age=goldType!==undefined?goldType.age:0
                        }
                        else{
                            newTradingDetails.splice(dIdx,1)
                        }
                    }
                    else{
                        if(tradingWeight>0){
                            newTradingDetails.push({
                                gold_age:goldType!==undefined?goldType.age:0,
                                gold_type:newItem.key,
                                final_weight:finalWeight,
                                trading_gold:newItem.key,
                                trading_age:goldType!==undefined?goldType.age:0,
                                trading_weight:tradingWeight,
                                trading_rest:diffWeight>0?diffWeight:0,
                                remain_weight:diffWeight<0?Math.abs(diffWeight):0,
                                trading_type:'EQUAL'   
                            })
                        }
                        
                    }
                }
            }   
        }
        //Remove gold not in oldList anymore
        for (let index = 0; index < newTradingDetails.length; index++) {
            const element = newTradingDetails[index];
            const exist=oldList.findIndex((item)=>item.gold_type===element.gold_type)
            if(exist<0){
                newTradingDetails.splice(index,1)
            }
        }
        //Remove gold not in newList anymore
        for (let index = 0; index < newTradingDetails.length; index++) {
            const element = newTradingDetails[index];
            const exist=newList.findIndex((item)=>item.gold_type===element.gold_type)
            if(exist<0){
                newTradingDetails.splice(index,1)
            }
        }
        //console.log("newTradingDetails")
        //newTradingDetails.forEach((e)=>console.log({...e}))
        //Add untrade golds from new asif
        for (let index = 0; index < newSummaryGolds.length; index++) {
            const element = newSummaryGolds[index];
            const traded=newTradingDetails.findIndex((item)=>item.gold_type===element.key||item.trading_gold===element.key)
            if(traded<0){
                const goldType=goldTypes.find((e)=>e.code===element.key)
                const weight=toFixedRefactor(element.value_1,3)
                newTradingDetails.push({
                    gold_age:goldType!==undefined?goldType.age:0,
                    gold_type:element.key,
                    final_weight:weight,
                    trading_gold:element.key,
                    trading_age:0,
                    trading_weight:0,
                    trading_rest:0,
                    remain_weight:weight,
                    trading_type:''   
                })
            }
        }
        //console.log("newTradingDetails after Add new untrade")
        //newTradingDetails.forEach((e)=>console.log({...e}))
        //Add untrade golds from old asif
        for (let index = 0; index < oldSummaryGolds.length; index++) {
            const element = oldSummaryGolds[index];
            const traded=newTradingDetails.findIndex((item)=>item.gold_type===element.key||item.trading_gold===element.key)
            if(traded<0){
                const weight=toFixedRefactor(element.value_1,3)
                const goldType=goldTypes.find((e)=>e.code===element.key)
                newTradingDetails.push({
                    gold_age:goldType!==undefined?goldType.age:0,
                    gold_type:element.key,
                    final_weight:0,
                    trading_gold:element.key,
                    trading_age:goldType!==undefined?goldType.age:0,
                    trading_weight:0,
                    trading_rest:weight,
                    remain_weight:0,
                    trading_type:''   
                })
            }
        }
        //console.log("newTradingDetails after Add old untrade")
        //newTradingDetails.forEach((e,i)=>console.log("newTradingDetails final "+i,{...e}))
        //Exchange to difference golds
        const remainGolds=newTradingDetails.filter((item)=>item.remain_weight>0)
        //remainGolds.forEach((e)=>console.log("remainGold",{...e}))
        const restGolds=newTradingDetails.filter((item)=>item.trading_rest>0)
        //restGolds.forEach((e)=>console.log("restGolds",{...e}))
        if(remainGolds.length==0||restGolds.length==0){
            console.log("No Exchange difference")
            this.handleNoDiffGoldExchangeRest(data)
        }
        else if(remainGolds.length==1&&restGolds.length==1){
            console.log("Exchange difference one old to one new")
            //newTradingDetails.forEach((e,i)=>console.log("newTradingDetails old-new begin "+i,{...e}))
            const diffWeight=toFixedRefactor(restGolds[0].trading_rest-remainGolds[0].remain_weight,3)
            const tradingWeight=diffWeight>=0?remainGolds[0].remain_weight:restGolds[0].trading_rest
            if(tradingWeight>0){
                newTradingDetails.push({
                    gold_age:remainGolds[0].gold_age,
                    gold_type:remainGolds[0].gold_type,
                    final_weight:remainGolds[0].remain_weight,
                    trading_gold:restGolds[0].gold_type,
                    trading_age:restGolds[0].gold_age,
                    trading_weight:tradingWeight,
                    trading_rest:diffWeight>0?diffWeight:0,
                    remain_weight:diffWeight<0?Math.abs(diffWeight):0,
                    trading_type:'DIFF'   
                })
                const remainIdx=newTradingDetails.findIndex((e)=>e.trading_type===""&&e.gold_type===remainGolds[0].gold_type)
                if(remainIdx>=0){
                    newTradingDetails.splice(remainIdx,1)
                }
                const restIdx=newTradingDetails.findIndex((e)=>e.trading_type===""&&e.gold_type===restGolds[0].gold_type)
                if(restIdx>=0){
                    newTradingDetails.splice(restIdx,1)
                }
                
            }
            //newTradingDetails.forEach((e,i)=>console.log("Exchange difference old-new end "+i,{...e}))
            this.handleDiffGoldExchangeRest(data)
        }
        else if(remainGolds.length>1&&restGolds.length==1){
            console.log("Exchange difference one old to many new")
            let restWeight=restGolds[0].trading_rest
            //newTradingDetails.forEach((e,i)=>console.log("Exchange difference old-manynew start "+i,{...e}))
            for (let index = 0; index < remainGolds.length; index++) {
                const remainItem = remainGolds[index];
                const diffWeight=toFixedRefactor(restWeight-remainItem.remain_weight,3)
                const tradingWeight=diffWeight>=0?remainItem.remain_weight:restWeight
                restWeight=diffWeight
                if(tradingWeight>0){
                    newTradingDetails.push({
                        gold_age:remainGolds[index].gold_age,
                        gold_type:remainGolds[index].gold_type,
                        final_weight:remainGolds[index].remain_weight,
                        trading_gold:restGolds[0].gold_type,
                        trading_age:restGolds[0].gold_age,
                        trading_weight:tradingWeight,
                        trading_rest:diffWeight>0?diffWeight:0,
                        remain_weight:diffWeight<0?Math.abs(diffWeight):0,
                        trading_type:'DIFF'   
                    })
                    const remainIdx=newTradingDetails.findIndex((e)=>e.trading_type===""&&e.gold_type===remainGolds[index].gold_type)
                    if(remainIdx>=0){
                        newTradingDetails.splice(remainIdx,1)
                    }
                    const restIdx=newTradingDetails.findIndex((e)=>e.trading_type===""&&e.gold_type===restGolds[0].gold_type)
                    if(restIdx>=0){
                        newTradingDetails.splice(restIdx,1)
                    }
                }
            }
            newTradingDetails.forEach((e,i)=>console.log("Exchange difference old-manynew end "+i,{...e}))
            this.handleDiffGoldExchangeRest(data)
        }
        else if(remainGolds.length==1&&restGolds.length>1){
            console.log("Exchange difference many old to one new")
            let remainWeight=remainGolds[0].remain_weight
            //newTradingDetails.forEach((e,i)=>console.log("Exchange difference manyold-new start "+i,{...e}))
            for (let index = 0; index < restGolds.length; index++) {
                const restItem = restGolds[index];
                const diffWeight=toFixedRefactor(remainWeight-restItem.trading_rest,3)
                const tradingWeight=diffWeight>=0?restItem.trading_rest:remainWeight
                remainWeight=diffWeight
                if(tradingWeight>0){
                    newTradingDetails.push({
                        gold_age:remainGolds[0].gold_age,
                        gold_type:remainGolds[0].gold_type,
                        final_weight:remainWeight,
                        trading_gold:restGolds[index].gold_type,
                        trading_age:restGolds[index].gold_age,
                        trading_weight:tradingWeight,
                        trading_rest:diffWeight<0?Math.abs(diffWeight):0,
                        remain_weight:diffWeight>0?diffWeight:0,
                        trading_type:'DIFF'   
                    })
                    const remainIdx=newTradingDetails.findIndex((e)=>e.trading_type===""&&e.gold_type===remainGolds[0].gold_type)
                    if(remainIdx>=0){
                        newTradingDetails.splice(remainIdx,1)
                    }
                    const restIdx=newTradingDetails.findIndex((e)=>e.trading_type===""&&e.gold_type===restGolds[index].gold_type)
                    if(restIdx>=0){
                        newTradingDetails.splice(restIdx,1)
                    }
                }
            }
            //newTradingDetails.forEach((e,i)=>console.log("Exchange difference manyold-new end "+i,{...e}))
            this.handleDiffGoldExchangeRest(data)
        }
        else{
            console.log("Exchange difference many old to many new")
            this.handleDiffGoldExchangeRest(data)
        }
        return oldList;
    },
    handleDiffGoldExchangeRest(item:RetailModel){
        const newList=item.exchangeNewList
        const oldList=item.exchangeOldList
        let newTradingDetails=item.newTradingDetails
        let resList=item.exchangeResList
        for (let index = 0; index < newTradingDetails.length; index++) {
            const element = newTradingDetails[index];
            const newItem=newList.find((item)=>item.gold_type===element.gold_type)
            const oldItem=oldList.find((item)=>item.gold_type===element.trading_gold)
            const tradingWeight=toFixedRefactor(element.trading_weight,3)
            const remainWeight=toFixedRefactor(element.remain_weight,3)
            const restWeight=toFixedRefactor(element.trading_rest,3)
            const newUnit=newItem!==undefined?newItem.unit:'CHI'
            const oldUnit=oldItem!==undefined?oldItem.unit:'CHI'
            const convertedTradingWeight=weightByUnit(tradingWeight,newUnit)
            const convertedRemainWeight=weightByUnit(remainWeight,newUnit)
            const convertedRestWeight=weightByUnit(restWeight,newUnit)
            const newExchangeRate=newItem!==undefined?newItem.exchange_rate:0
            const oldBuyinPrice=oldItem!==undefined?oldItem.buyin_price:0
            switch (element.trading_type) {
                case "EQUAL":
                    const convertedWeight=weightByUnit(element.trading_weight,newUnit)
                    resList.push({
                        _id:"",
                        code:'',
                        name:'Đổi ngang '+element.gold_type,
                        counter:'',
                        product_type:'',
                        supplier:'',
                        gold_type:element.gold_type,
                        images:[],
                        tags:[],
                        unit:newUnit,
                        weight:element.trading_weight,
                        stone:0,
                        gold_weight:element.trading_weight,
                        ni_weight:0,
                        final_weight:element.trading_weight,
                        age:0,
                        exchange_rate:newExchangeRate,
                        wage:0,
                        root_wage:0,
                        stone_value:0,
                        value:convertedWeight*newExchangeRate,
                        amount:convertedWeight*newExchangeRate,
                        refund:0,
                        makeup:0,
                        buyin_rate:100,
                        buyin_price:0,
                        has_invoice:false,
                        invoice_checking:false,
                        active:false,
                        is_online:false,
                        is_new:false,
                        is_hot:false,
                        discount:0,
                        retail_code:'',
                        trading_type:'TRADE',
                        date:'',
                        trading_rate:100,
                        trading_weight:0,
                        trading_gold:'',
                        trading_value:0,
                        fixed_price:0,
                        status:"ACTIVE" as status
                    })
                    break;
                case "DIFF":
                    if(element.trading_age>element.gold_age){
                        resList.push({
                            _id:"",
                            code:'',
                            name:'Đổi hoàn '+element.trading_gold+'->'+element.gold_type,
                            counter:'',
                            product_type:'',
                            supplier:'',
                            gold_type:element.trading_gold,
                            images:[],
                            tags:[],
                            unit:oldUnit,
                            weight:tradingWeight,
                            stone:0,
                            gold_weight:tradingWeight,
                            ni_weight:0,
                            final_weight:tradingWeight,
                            age:0,
                            exchange_rate:newExchangeRate,
                            wage:0,
                            root_wage:0,
                            stone_value:0,
                            value:convertedTradingWeight*newExchangeRate,
                            amount:convertedTradingWeight*newExchangeRate,
                            refund:0,
                            makeup:-1*(oldItem!==undefined?oldItem.makeup:0),
                            buyin_rate:100,
                            buyin_price:0,
                            has_invoice:false,
                            invoice_checking:false,
                            active:false,
                            is_online:false,
                            is_new:false,
                            is_hot:false,
                            discount:0,
                            retail_code:'',
                            trading_type:'TRADE',
                            date:'',
                            trading_rate:100,
                            trading_weight:0,
                            trading_gold:'',
                            trading_value:0,
                            fixed_price:0,
                            status:"ACTIVE" as status
                        })
                    }
                    else{
                        resList.push({
                            _id:"",
                            code:'',
                            name:'Đổi bù '+element.trading_gold+'->'+element.gold_type,
                            counter:'',
                            product_type:'',
                            supplier:'',
                            gold_type:element.trading_gold,
                            images:[],
                            tags:[],
                            unit:oldUnit,
                            weight:tradingWeight,
                            stone:0,
                            gold_weight:tradingWeight,
                            ni_weight:0,
                            final_weight:tradingWeight,
                            age:0,
                            exchange_rate:newExchangeRate,
                            wage:0,
                            root_wage:0,
                            stone_value:0,
                            value:convertedTradingWeight*newExchangeRate,
                            amount:convertedTradingWeight*newExchangeRate,
                            refund:0,
                            makeup:oldItem!==undefined?oldItem.makeup:0,
                            buyin_rate:100,
                            buyin_price:0,
                            has_invoice:false,
                            invoice_checking:false,
                            active:false,
                            is_online:false,
                            is_new:false,
                            is_hot:false,
                            discount:0,
                            retail_code:'',
                            trading_type:'TRADE',
                            date:'',
                            trading_rate:100,
                            trading_weight:0,
                            trading_gold:'',
                            trading_value:0,
                            fixed_price:0,
                            status:"ACTIVE" as status
                        })
                    }
                    if(remainWeight>0){
                        if(index>0){
                            const preIdx=resList.findIndex((e)=>e.gold_type===element.gold_type&&e.trading_type==='SELL')
                            if(preIdx>=0){
                                resList.splice(preIdx,1)
                            }
                        }
                        resList.push({
                            _id:"",
                            code:'',
                            name:'Cửa hàng bán vàng '+element.gold_type,
                            counter:'',
                            product_type:'',
                            supplier:'',
                            gold_type:element.gold_type,
                            images:[],
                            tags:[],
                            unit:newUnit,
                            weight:remainWeight,
                            stone:0,
                            gold_weight:remainWeight,
                            ni_weight:0,
                            final_weight:remainWeight,
                            age:0,
                            exchange_rate:newExchangeRate,
                            wage:0,
                            root_wage:0,
                            stone_value:0,
                            value:convertedRemainWeight*newExchangeRate,
                            amount:convertedRemainWeight*newExchangeRate,
                            refund:0,
                            makeup:0,
                            buyin_rate:100,
                            buyin_price:0,
                            has_invoice:false,
                            invoice_checking:false,
                            active:false,
                            is_online:false,
                            is_new:false,
                            is_hot:false,
                            discount:0,
                            retail_code:'',
                            trading_type:'SELL',
                            date:'',
                            trading_rate:100,
                            trading_weight:0,
                            trading_gold:'',
                            trading_value:0,
                            fixed_price:0,
                            status:"ACTIVE" as status
                        })
                    }
                    if(restWeight>0){
                        if(index>0){
                            const preIdx=resList.findIndex((e)=>e.gold_type===element.trading_gold&&e.trading_type==='BUY')
                            //console.log(preIdx)
                            if(preIdx>=0){
                                resList.splice(preIdx,1)
                            }
                        }
                        resList.push({
                            _id:"",
                            code:'',
                            name:'Cửa hàng mua vàng '+element.trading_gold,
                            counter:'',
                            product_type:'',
                            supplier:'',
                            gold_type:element.trading_gold,
                            images:[],
                            tags:[],
                            unit:newUnit,
                            weight:restWeight,
                            stone:0,
                            gold_weight:restWeight,
                            ni_weight:0,
                            final_weight:restWeight,
                            age:0,
                            exchange_rate:oldBuyinPrice,
                            wage:0,
                            root_wage:0,
                            stone_value:0,
                            value:convertedRestWeight*oldBuyinPrice,
                            amount:convertedRestWeight*oldBuyinPrice,
                            refund:0,
                            makeup:0,
                            buyin_rate:oldItem!==undefined?oldItem.buyin_rate:100,
                            buyin_price:oldBuyinPrice,
                            has_invoice:false,
                            invoice_checking:false,
                            active:false,
                            is_online:false,
                            is_new:false,
                            is_hot:false,
                            discount:0,
                            retail_code:'',
                            trading_type:'BUY',
                            date:'',
                            trading_rate:oldItem!==undefined?oldItem.trading_rate:100,
                            trading_weight:0,
                            trading_gold:'',
                            trading_value:0,
                            fixed_price:0,
                            status:"ACTIVE" as status
                        })
                    }
                    break;
                default:
                    if(remainWeight>0){
                        resList.push({
                            _id:"",
                            code:'',
                            name:'Cửa hàng bán vàng '+element.gold_type,
                            counter:'',
                            product_type:'',
                            supplier:'',
                            gold_type:element.gold_type,
                            images:[],
                            tags:[],
                            unit:newUnit,
                            weight:remainWeight,
                            stone:0,
                            gold_weight:remainWeight,
                            ni_weight:0,
                            final_weight:remainWeight,
                            age:0,
                            exchange_rate:newExchangeRate,
                            wage:0,
                            root_wage:0,
                            stone_value:0,
                            value:convertedRemainWeight*newExchangeRate,
                            amount:convertedRemainWeight*newExchangeRate,
                            refund:0,
                            makeup:0,
                            buyin_rate:100,
                            buyin_price:0,
                            has_invoice:false,
                            invoice_checking:false,
                            active:false,
                            is_online:false,
                            is_new:false,
                            is_hot:false,
                            discount:0,
                            retail_code:'',
                            trading_type:'SELL',
                            date:'',
                            trading_rate:100,
                            trading_weight:0,
                            trading_gold:'',
                            trading_value:0,
                            fixed_price:0,
                            status:"ACTIVE" as status
                        })
                    }
                    if(restWeight>0){
                        resList.push({
                            _id:"",
                            code:'',
                            name:'Cửa hàng mua vàng '+element.trading_gold,
                            counter:'',
                            product_type:'',
                            supplier:'',
                            gold_type:element.trading_gold,
                            images:[],
                            tags:[],
                            unit:newUnit,
                            weight:restWeight,
                            stone:0,
                            gold_weight:restWeight,
                            ni_weight:0,
                            final_weight:restWeight,
                            age:0,
                            exchange_rate:oldBuyinPrice,
                            wage:0,
                            root_wage:0,
                            stone_value:0,
                            value:convertedRestWeight*oldBuyinPrice,
                            amount:convertedRestWeight*oldBuyinPrice,
                            refund:0,
                            makeup:0,
                            buyin_rate:oldItem!==undefined?oldItem.buyin_rate:100,
                            buyin_price:oldBuyinPrice,
                            has_invoice:false,
                            invoice_checking:false,
                            active:false,
                            is_online:false,
                            is_new:false,
                            is_hot:false,
                            discount:0,
                            retail_code:'',
                            trading_type:'BUY',
                            date:'',
                            trading_rate:oldItem!==undefined?oldItem.trading_rate:100,
                            trading_weight:0,
                            trading_gold:'',
                            trading_value:0,
                            fixed_price:0,
                            status:"ACTIVE" as status
                        })
                    }
                break;
            }
        }
        //resList.forEach((e,i)=>console.log("resList diff gold Exchange "+i,{...e}))
    },
    handleNoDiffGoldExchangeRest(item:RetailModel){
        const newList=item.exchangeNewList
        const oldList=item.exchangeOldList
        let newTradingDetails=item.newTradingDetails
        let resList=item.exchangeResList
        for (let index = 0; index < newTradingDetails.length; index++) {
            const element = newTradingDetails[index];
            const newItem=newList.find((item)=>item.gold_type===element.gold_type)
            const oldItem=oldList.find((item)=>item.gold_type===element.trading_gold)
            const remainWeight=toFixedRefactor(element.remain_weight,3)
            const restWeight=toFixedRefactor(element.trading_rest,3)
            const newUnit=newItem!==undefined?newItem.unit:'CHI'
            const convertedRemainWeight=weightByUnit(remainWeight,newUnit)
            const convertedRestWeight=weightByUnit(restWeight,newUnit)
            const newExchangeRate=newItem!==undefined?newItem.exchange_rate:0
            const oldBuyinPrice=oldItem!==undefined?oldItem.buyin_price:0
            switch (element.trading_type) {
                case "EQUAL":
                    const convertedWeight=weightByUnit(element.trading_weight,newUnit)
                    resList.push({
                        _id:"",
                        code:'',
                        name:'Đổi ngang '+element.gold_type,
                        counter:'',
                        product_type:'',
                        supplier:'',
                        gold_type:element.gold_type,
                        images:[],
                        tags:[],
                        unit:newUnit,
                        weight:element.trading_weight,
                        stone:0,
                        gold_weight:element.trading_weight,
                        ni_weight:0,
                        final_weight:element.trading_weight,
                        age:0,
                        exchange_rate:newExchangeRate,
                        wage:0,
                        root_wage:0,
                        stone_value:0,
                        value:convertedWeight*newExchangeRate,
                        amount:convertedWeight*newExchangeRate,
                        refund:0,
                        makeup:0,
                        buyin_rate:100,
                        buyin_price:0,
                        has_invoice:false,
                        invoice_checking:false,
                        active:false,
                        is_online:false,
                        is_new:false,
                        is_hot:false,
                        discount:0,
                        retail_code:'',
                        trading_type:'TRADE',
                        date:'',
                        trading_rate:100,
                        trading_weight:0,
                        trading_gold:'',
                        trading_value:0,
                        fixed_price:0,
                        status:"ACTIVE" as status
                    })
                    if(remainWeight>0){
                        resList.push({
                            _id:"",
                            code:'',
                            name:'Khách mua vàng '+element.gold_type,
                            counter:'',
                            product_type:'',
                            supplier:'',
                            gold_type:element.gold_type,
                            images:[],
                            tags:[],
                            unit:newUnit,
                            weight:remainWeight,
                            stone:0,
                            gold_weight:remainWeight,
                            ni_weight:0,
                            final_weight:remainWeight,
                            age:0,
                            exchange_rate:newExchangeRate,
                            wage:0,
                            root_wage:0,
                            stone_value:0,
                            value:convertedRemainWeight*newExchangeRate,
                            amount:convertedRemainWeight*newExchangeRate,
                            refund:0,
                            makeup:0,
                            buyin_rate:100,
                            buyin_price:0,
                            has_invoice:false,
                            invoice_checking:false,
                            active:false,
                            is_online:false,
                            is_new:false,
                            is_hot:false,
                            discount:0,
                            retail_code:'',
                            trading_type:'SELL',
                            date:'',
                            trading_rate:100,
                            trading_weight:0,
                            trading_gold:'',
                            trading_value:0,
                            fixed_price:0,
                            status:"ACTIVE" as status
                        })
                    }
                    if(restWeight>0){
                        resList.push({
                            _id:"",
                            code:'',
                            name:'Cửa hàng mua '+element.trading_gold,
                            counter:'',
                            product_type:'',
                            supplier:'',
                            gold_type:element.trading_gold,
                            images:[],
                            tags:[],
                            unit:newUnit,
                            weight:restWeight,
                            stone:0,
                            gold_weight:restWeight,
                            ni_weight:0,
                            final_weight:restWeight,
                            age:0,
                            exchange_rate:oldBuyinPrice,
                            wage:0,
                            root_wage:0,
                            stone_value:0,
                            value:convertedRestWeight*oldBuyinPrice,
                            amount:convertedRestWeight*oldBuyinPrice,
                            refund:0,
                            makeup:0,
                            buyin_rate:oldItem!==undefined?oldItem.buyin_rate:100,
                            buyin_price:oldBuyinPrice,
                            has_invoice:false,
                            invoice_checking:false,
                            active:false,
                            is_online:false,
                            is_new:false,
                            is_hot:false,
                            discount:0,
                            retail_code:'',
                            trading_type:'BUY',
                            date:'',
                            trading_rate:oldItem!==undefined?oldItem.trading_rate:100,
                            trading_weight:0,
                            trading_gold:'',
                            trading_value:0,
                            fixed_price:0,
                            status:"ACTIVE" as status
                        })
                    }
                    break;
                
                default:
                    if(remainWeight>0){
                        resList.push({
                            _id:"",
                            code:'',
                            name:'Khách mua vàng '+element.gold_type,
                            counter:'',
                            product_type:'',
                            supplier:'',
                            gold_type:element.gold_type,
                            images:[],
                            tags:[],
                            unit:newUnit,
                            weight:remainWeight,
                            stone:0,
                            gold_weight:remainWeight,
                            ni_weight:0,
                            final_weight:remainWeight,
                            age:0,
                            exchange_rate:newExchangeRate,
                            wage:0,
                            root_wage:0,
                            stone_value:0,
                            value:convertedRemainWeight*newExchangeRate,
                            amount:convertedRemainWeight*newExchangeRate,
                            refund:0,
                            makeup:0,
                            buyin_rate:100,
                            buyin_price:0,
                            has_invoice:false,
                            invoice_checking:false,
                            active:false,
                            is_online:false,
                            is_new:false,
                            is_hot:false,
                            discount:0,
                            retail_code:'',
                            trading_type:'SELL',
                            date:'',
                            trading_rate:100,
                            trading_weight:0,
                            trading_gold:'',
                            trading_value:0,
                            fixed_price:0,
                            status:"ACTIVE" as status
                        })
                    }
                    if(restWeight>0){
                        resList.push({
                            _id:"",
                            code:'',
                            name:'Cửa hàng mua '+element.trading_gold,
                            counter:'',
                            product_type:'',
                            supplier:'',
                            gold_type:element.trading_gold,
                            images:[],
                            tags:[],
                            unit:newUnit,
                            weight:restWeight,
                            stone:0,
                            gold_weight:restWeight,
                            ni_weight:0,
                            final_weight:restWeight,
                            age:0,
                            exchange_rate:oldBuyinPrice,
                            wage:0,
                            root_wage:0,
                            stone_value:0,
                            value:convertedRestWeight*oldBuyinPrice,
                            amount:convertedRestWeight*oldBuyinPrice,
                            refund:0,
                            makeup:0,
                            buyin_rate:oldItem!==undefined?oldItem.buyin_rate:100,
                            buyin_price:oldBuyinPrice,
                            has_invoice:false,
                            invoice_checking:false,
                            active:false,
                            is_online:false,
                            is_new:false,
                            is_hot:false,
                            discount:0,
                            retail_code:'',
                            trading_type:'BUY',
                            date:'',
                            trading_rate:oldItem!==undefined?oldItem.trading_rate:100,
                            trading_weight:0,
                            trading_gold:'',
                            trading_value:0,
                            fixed_price:0,
                            status:"ACTIVE" as status
                        })
                    }
                break;
            }
        }
        //resList.forEach((e,i)=>console.log("resList No Diff exchange "+i,{...e}))
    },
    computingExchangeProductValue(item:RetailModel){
        const isMultiGoldExchange=this.isMultiGoldExchange(item)
        return item.hasInvoice?this.computingExchangeInvoiceValue(item):isMultiGoldExchange?this.computingMultiGoldExchangeWithoutInvoiceValue(item):this.computingExchangeWithoutInvoiceValue(item)
    },
    computingExchangeInvoiceValue(item:RetailModel){
        let summaryValue=0
        let buyValue=0
        item.exchangeResList.map((item)=>{
            if(item.trading_type==='BUY'){
                buyValue+=item.amount
            }
        })
        
        item.exchangeOldList.map((item)=>{
            if(item.trading_value===0){
                if(item.value>0){
                    const value=item.value*item.buyin_rate/100
                    buyValue+=value+item.discount
                }
                
            }
        })
        if(buyValue>0){
            summaryValue-=buyValue
        }
        item.exchangeResList.map((item)=>{
            if(item.trading_type==='SELL'){
                summaryValue+=item.amount
            }
        })
        summaryValue-=item.discount??0
        return roundNumber(summaryValue)
    },
    computingMultiGoldExchangeWithoutInvoiceValue(item:RetailModel){
        let summaryValue=0
        let buyValue=0
        let sellValue=0
        item.exchangeResList.map((item)=>{
            switch (item.trading_type) {
                
                case 'BUY':
                    const _buyValue=roundNumber(item.amount)
                    buyValue+=_buyValue
                    
                    break;
                case 'SELL':
                    const _sellValue=roundNumber(item.amount)
                    sellValue+=_sellValue
                    break;
            }
            
        })
        summaryValue-=buyValue
        summaryValue+=sellValue
        item.exchangeNewList.map((item)=>{
            if(item.wage>0){
                summaryValue+=item.wage
            }
            if(item.stone_value>0){
                summaryValue+=Number(item.stone_value)
            }
        })
        item.exchangeResList.map((item)=>{
            if(item.makeup!==0&&item.trading_type==='TRADE'){
                const value=item.makeup*weightByUnit(item.final_weight,item.unit)
                if(value!==0){
                    const _value=roundNumber(value)
                    summaryValue+=_value
                }
                
            }
        })
        summaryValue-=item.discount??0
        return summaryValue
    },
    computingExchangeWithoutInvoiceValue(item:RetailModel){
        let summaryValue=0
        let buyValue=0
        item.exchangeResList.map((item)=>{
            if(item.trading_type==='BUY'){
                buyValue+=roundNumber(item.amount)
            }
        })
        
        item.exchangeOldList.map((item)=>{
            if(item.trading_weight===0){
                if(item.final_weight>0){
                    const weight=item.final_weight
                    const value=weightByUnit(weight,item.unit)*item.buyin_price
                    buyValue+=roundNumber(value+item.discount)
                }
                
            }
        })
        if(buyValue>0){
            summaryValue-=buyValue
        }
        item.exchangeResList.map((item)=>{
            if(item.trading_type==='SELL'){
                summaryValue+=roundNumber(item.amount)
            }
        })
        item.exchangeNewList.map((item)=>{
            if(item.wage>0){
                summaryValue+=item.wage
                
            }
            if(item.stone_value>0){
                summaryValue+=Number(item.stone_value)                
            }
            
        })
        item.exchangeOldList.map((item)=>{
            if(item.makeup>0){
                const value=item.makeup*weightByUnit(item.trading_weight,item.unit)
                if(value>0){
                    summaryValue+=roundNumber(value)
                }
            }
        })
        summaryValue-=item.discount??0
        return summaryValue;
    },
    async restoreItem(data:any){
        const response = await HttpService.doPutRequest('v1/retail/restore', data)
        return parseCommonHttpResult(response)
    },
    async pacthItem(data:any){
        const response = await HttpService.doPatchRequest('v1/retail', data)
        return parseCommonHttpResult(response)
    },
    async deleteItem(data:any){
        const response = await HttpService.doDeleteRequest('v1/retail', data)
        return parseCommonHttpResult(response)
    },
    async editItem(data:any){
        const response = await HttpService.doPutRequest('v1/retail', data)
        return parseCommonHttpResult(response)
    },
    async addItem(data:any){
        const response = await HttpService.doPostRequest('v1/retail', data)
        return parseCommonHttpResult(response)
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/retail', data)
        return parseCommonHttpResult(response)
    },
}