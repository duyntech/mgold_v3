import { t } from "i18next"
import { TransactionModel, HistoryModel, DataDiffModel } from "../model"
import { datetimeToConvert, deepCloneObject, formatDateToFormatString } from "../utils/util"
import { HttpService } from "./http/HttpService"
import { parseCommonHttpResult } from "./http/parseCommonResult"
import { revenuesEffectKeys } from "../utils/constants/const"

export const HistoryService = {
    activeIfSelectAndDeactiveOthers(id: string, list: TransactionModel[]){
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
    activeHistoryIfSelectAndDeactiveOthers(id: string, list: HistoryModel[]){
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
    compareDataIfSelectAndDeactiveOthers(id: string, list: HistoryModel[]){
        let changeds=deepCloneObject(list.filter(e=>["INS","UPD"].includes(e.action))) as HistoryModel[]
        list.forEach((item, idx) => {
            if (item.id !==id ) {
            list[idx].more = false
            }
            else{
                if(item.action==="UPD"){
                    //console.log(Date.parse(datetimeToConvert(item.datetime)))
                    list[idx].more = !list[idx].more
                    const oldData=changeds.find(e=>["INS","UPD"].includes(e.action)&&e.id!==item.id&&Date.parse(datetimeToConvert(e.datetime))<Date.parse(datetimeToConvert(item.datetime)))
                    if(oldData&&['A_ACCOUNT'].includes(item.transaction)){
                        item.old_data=oldData.new_data
                    }
                    list[idx].differents=this.compareData(item)
                    }
                }
            })
        return list
    },
    compareData(item:HistoryModel){
        let differents:DataDiffModel[]=[]
        const oldData=Object.entries({...item.old_data})
        const newData=Object.entries({...item.new_data})
        //console.log(oldData)
        //console.log(newData)
        if(oldData.length>0&&item.transaction!=='T_IMPORT_PRODUCT'){
            for (const [key, oldValue] of oldData) {
                const newValue=newData.find(e=>e[0]===key)?.[1] as any
                if(typeof oldValue === 'object' && oldValue !== null){
                    switch (item.transaction) {
                        case "T_SELL":
                            switch (key) {
                                case "product_lists":
                                    const newValueEntries=Object.entries(newValue)
                                    const oldValueEntries=Object.entries(oldValue)
                                    for (const [lOldKey, lOldValue] of oldValueEntries) {
                                        if(lOldKey!=="ex_res_products"){
                                            const lNewValue=newValueEntries.find(e=>e[0]===lOldKey)?.[1] as any??[]
                                            if(lOldValue.length>=lNewValue.length){
                                                //console.log(lOldKey)
                                                //console.log("lOldValue.length>=lNewValue.length")
                                                for (let index = 0; index < lOldValue.length; index++) {
                                                    const eOld= lOldValue[index]
                                                    const newItem=lNewValue[index]
                                                    //console.log(eOld["code"])
                                                    let oldString=''
                                                    let newString=''
                                                    const eOldEntries=Object.entries(eOld)
                                                    if(eOld["code"]!==null){
                                                        const eNew=Object(lNewValue).find((e: { code: any })=>e.code===eOld["code"])
                                                        if(eNew!==undefined){
                                                            const keyCode='- '+eOld["code"]+': '
                                                            let eOldString=''
                                                            let eNewString=''
                                                            
                                                            for (const [eOldKey, eOldValue] of eOldEntries) {
                                                                const eNewValue=eNew[eOldKey]
                                                                if(String(eOldValue)!==String(eNewValue)){
                                                                    eOldString+='['+t(eOldKey)+': '+(eOldValue===null?'':eOldValue)+'],'
                                                                    eNewString+='['+t(eOldKey)+': '+(eNewValue===null?'':eNewValue)+'],'
                                                                }
                                                            }
                                                            if(eOldString!==''){
                                                                oldString=keyCode+eOldString+'\r\n'
                                                                newString=keyCode+eNewString+'\r\n'
                                                            }
                                                        }
                                                        else{
                                                            newString='- Xóa: '+eOld["code"]+'\r\n'
                                                        }
                                                    }
                                                    else{
                                                        if(String(eOld)===String(newItem)){
                                                            let eOldString=''
                                                            let eNewString=''
                                                            for (const [eOldKey, eOldValue] of eOldEntries) {
                                                                const eNewValue=newItem[eOldKey]
                                                                if(String(eOldValue)!==String(eNewValue)){
                                                                    eOldString+='['+t(eOldKey)+': '+(eOldValue===null?'':eOldValue)+'],'
                                                                    eNewString+='['+t(eOldKey)+': '+(eNewValue===null?'':eNewValue)+'],'
                                                                }
                                                            }
                                                            if(eOldString!==''){
                                                                oldString='- '+eOldString+'\r\n'
                                                                newString='- '+ eNewString+'\r\n'
                                                            }
                                                        }
                                                        else{
                                                            for (const [eOldKey, eOldValue] of eOldEntries) {
                                                                if(!["_id","code","supplier","counter","product_type","final_weight","age","root_wage","images","tags","unit","refund","invoice_checking","active","status","trading_type","trading_weight","trading_gold","trading_value","retail_code","is_new","is_hot","online","is_online"].includes(eOldKey))
                                                                 oldString+='['+t(eOldKey)+': '+(eOldValue===null?'':eOldValue)+'],'
                                                            }
                                                            if(newItem!==null&&newItem!==undefined){
                                                                newString+='- Thêm: '
                                                                for (const [eNewKey, eNewValue] of Object.entries(newItem)) {
                                                                    if(!["_id","code","supplier","counter","product_type","final_weight","age","root_wage","images","tags","unit","refund","invoice_checking","active","status","trading_type","trading_weight","trading_gold","trading_value","retail_code","is_new","is_hot","online","is_online"].includes(eNewKey))
                                                                     newString+='['+t(eNewKey)+': '+(eNewValue===null?'':eNewValue)+'],'
                                                                }
                                                            }
                                                            
                                                        }
                                                        
                                                    }
                                                    if(oldString!==''||newString!==''){
                                                        differents.push({
                                                            key: key+"."+lOldKey,
                                                            revenueEffect:revenuesEffectKeys.includes(lOldKey),
                                                            oldValue: oldString,
                                                            newValue: newString
                                                        })
                                                    }
                                                    
                                                }
                                            }
                                            else if(lNewValue.length>0){
                                                //console.log(lOldKey)
                                                //console.log("lOldValue.length<lNewValue.length")
                                                for (let index = 0; index < lNewValue.length; index++) {
                                                    const eNew= lNewValue[index]
                                                    const oldItem=lOldValue[index]
                                                    let oldString=''
                                                    let newString=''
                                                    const eNewEntries=Object.entries(eNew)
                                                    if(eNew["code"]!==null){
                                                        const eOld=Object(lOldValue).find((e: { code: any })=>e.code===eNew["code"])
                                                        if(eOld!==undefined){
                                                            const keyCode='- '+eOld["code"]+': '
                                                            let eOldString=''
                                                            let eNewString=''
                                                            
                                                            for (const [eNewKey, eNewValue] of eNewEntries) {
                                                                const eOldValue=eOld[eNewKey]
                                                                if(String(eNewValue)!==String(eOldValue)){
                                                                    eOldString+='['+t(eNewKey)+': '+(eOldValue===null?'':eOldValue)+'],'
                                                                    eNewString+='['+t(eNewKey)+': '+(eNewValue===null?'':eNewValue)+'],'
                                                                }
                                                            }
                                                            if(eOldString!==''){
                                                                oldString=keyCode+eOldString+'\r\n'
                                                                newString=keyCode+eNewString+'\r\n'
                                                            }
                                                        }
                                                        else{
                                                            newString='- Thêm: '+eNew["code"]+'\r\n'
                                                        }
                                                    }
                                                    else{
                                                        if(String(eNew)===String(oldItem)){
                                                            let eOldString=''
                                                            let eNewString=''
                                                            for (const [eNewKey, eNewValue] of eNewEntries) {
                                                                const eOldValue=oldItem[eNewKey]
                                                                if(String(eOldValue)!==String(eNewValue)){
                                                                    eOldString+='['+t(eNewKey)+': '+(eOldValue===null?'':eOldValue)+'],'
                                                                    eNewString+='['+t(eNewKey)+': '+(eNewValue===null?'':eNewValue)+'],'
                                                                }
                                                            }
                                                            if(eOldString!==''){
                                                                oldString='- '+eOldString+'\r\n'
                                                                newString='- '+ eNewString+'\r\n'
                                                            }
                                                        }
                                                        else{
                                                            for (const [eNewKey, eNewValue] of eNewEntries) {
                                                                if(!["_id","code","supplier","counter","product_type","final_weight","age","root_wage","images","tags","unit","refund","invoice_checking","active","status","trading_type","trading_weight","trading_gold","trading_value","retail_code","is_new","is_hot","online","is_online"].includes(eNewKey))
                                                                 newString+='['+t(eNewKey)+': '+(eNewValue===null?'':eNewValue)+'],'
                                                            }
                                                            
                                                        }
                                                        
                                                    }
                                                    if(oldString!==''||newString!==''){
                                                        differents.push({
                                                            key: key+"."+lOldKey,
                                                            revenueEffect:revenuesEffectKeys.includes(lOldKey),
                                                            oldValue: oldString,
                                                            newValue: newString
                                                        })
                                                    }
                                                }
                                            }

                                        }
                                    }
                                    break
                            }
                            break
                        default:
                            const oldValueObject=JSON.stringify(oldValue)
                            const newValueObject=JSON.stringify(newValue)
                            if(newValueObject!==oldValueObject){
                                differents.push({
                                    key: key,
                                    revenueEffect:revenuesEffectKeys.includes(key),
                                    oldValue: oldValueObject,
                                    newValue: newValueObject
                                })
                            }
                            break
                    }
                }
                else if(newValue!==oldValue&&newValue!==undefined){
                    differents.push({
                        key: key,
                        revenueEffect:revenuesEffectKeys.includes(key),
                        oldValue: oldValue as any,
                        newValue: newValue as any
                    })
                }
            }
        }
        else if(oldData.length>0&&item.transaction==='T_IMPORT_PRODUCT'){
            for (const [key, value] of newData) {
                if(key==="products"){
                    const news=[...Object(value)]
                    for (let index = 0; index < oldData.length; index++) {
                        const eOld = {...oldData[index][1] as Object}
                        const eNew={...news[index]}
                        const eOldEntries=Object.entries(eOld)
                        let oldString=''
                        let newString=''
                        //console.log(eOldEntries)
                        
                        const keyCode='- '+eNew["code"]+': '
                        let eOldString=''
                        let eNewString=''
                        let revenueEffect=false
                        for (const [eOldKey, eOldValue] of eOldEntries) {
                            const eNewValue=eNew[eOldKey]
                            revenueEffect=revenuesEffectKeys.includes(eOldKey)
                            const oldV=String(eOldValue)==='null'?'':String(eOldValue)
                            const newV=String(eNewValue)==='false'?'0':String(eNewValue)==='true'?'1':String(eNewValue)
                            if(oldV!==newV&&!["_id","code"].includes(eOldKey)){
                                eOldString+='['+t(eOldKey)+': '+oldV+'],'
                                eNewString+='['+t(eOldKey)+': '+newV+'],'
                            }
                        }
                        if(eOldString!==''){
                            oldString=keyCode+eOldString+'\r\n'
                            newString=keyCode+eNewString+'\r\n'
                        }
                        if(oldString!==''||newString!==''){
                            differents.push({
                                key: key,
                                revenueEffect:revenueEffect,
                                oldValue: oldString,
                                newValue: newString
                            })
                        }
                    }
                }
            }
        }
        return differents
    },
    historyItemFromJson(element:any){
        return element!==null&&element!==undefined?{
                    id:element._id,
                    transaction:element.type,
                    old_data:element.action==="UPD"?element.old_history!==null?element.type==="T_IMPORT_PRODUCT"?element.old_history.products:element.old_history.data:{}:null,
                    new_data:element.data,
                    action:element.action,
                    datetime:formatDateToFormatString(element.createdAt,"DD-MM-YYYY HH:mm"),
                    creator:element.create_user,
                    active:false,
                    more:false,
                    differents:[]
                }
            :HistoryModel.initial()
    },
    historyFromJson(data:any){
        //console.log(data)
        let list:HistoryModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            list.push(
                {
                    id:element._id,
                    transaction:element.type,
                    old_data:element.action==="UPD"?element.old_history!==null?element.type==="T_IMPORT_PRODUCT"?element.old_history.products:element.old_history.data:{}:null,
                    new_data:element.data,
                    action:element.action,
                    datetime:formatDateToFormatString(element.createdAt,"DD-MM-YYYY HH:mm"),
                    creator:element.create_user,
                    active:false,
                    more:false,
                    differents:[]
                }
            )
        }
        return list
    },
    transactionFromJson(data:any){
        //console.log(data)
        let list:TransactionModel[]=[]
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            const history=this.historyItemFromJson(element.last_action)
            const changeds=element.last_action!==null&&element.last_action!==undefined? this.compareData(history):[]
            list.push(
                {
                    id:element._id,
                    code:element.code??'',
                    name:element.name??'',
                    transaction:element.type,
                    date:formatDateToFormatString(element.createdAt,"DD-MM-YYYY HH:mm"),
                    last_action:element.last_action,
                    changed_keys:changeds,
                    active:false,
                    disabled:element.status==="ACTIVE"?false:true
                }
            )
        }
        //console.log(list)
        return list
    },
    async patchItem(data:any){
        const response = await HttpService.doPatchRequest('v1/history', data)
        return parseCommonHttpResult(response)
    },
    async fetchAll(data:any){
        const response = await HttpService.doGetRequest('v1/history', data)
        return parseCommonHttpResult(response)
    },
}