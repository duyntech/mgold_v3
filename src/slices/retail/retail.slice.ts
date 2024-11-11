import { createSlice } from '@reduxjs/toolkit'
import { ActionSliceState } from '../state'
import { GoldgroupModel, GoldtypeModel, RetailModel } from '../../model'
import { RetailService } from '../../services/Retail.service'
import { deepCloneObject, errorMessage, roundNumber, stringNumberToFloat, stringNumberToInt, weightByUnit } from '../../utils/util'
import { GoldtypeService } from '../../services/Goldtype.service'
import { commonCreateAsyncThunk } from '../thunk'
import { GoldgroupService } from '../../services/Goldgroup.service'

interface RetailState extends ActionSliceState{
    list:RetailModel[]
    filteredList:RetailModel[]
    item:RetailModel
    oldScanItem:RetailModel
    exOldScanItem:RetailModel
    goldTypes:GoldtypeModel[]
    goldGroups:GoldgroupModel[]
    summaryNewList:any[]
    summaryOldList:any[]
    reload:boolean
    currentPage:number
    currentRows:number
    statusScan:'idle' | 'loading' | 'completed' | 'failed'
    statusOldScan:'idle' | 'loading' | 'completed' | 'failed'
    statusExScan:'idle' | 'loading' | 'completed' | 'failed'
}
const initialState:RetailState={
    goldGroups:[],
    goldTypes:[],
    list: [],
    filteredList:[],
    summaryNewList:[],
    summaryOldList:[],
    item: RetailModel.initial(),
    oldScanItem: RetailModel.initial(),
    exOldScanItem: RetailModel.initial(),
    reload:false,
    currentPage:1,
    currentRows:10,
    status: 'idle',
    statusAction: 'idle',
    statusScan:'idle',
    statusOldScan:'idle',
    statusExScan:'idle',
    action: 'INS'
}
export const fetchAll:any= commonCreateAsyncThunk({type:'retail/fetchAll',action:RetailService.fetchAll})
export const addItem:any=commonCreateAsyncThunk({type:'retail/addItem',action:RetailService.addItem})
export const editItem:any=commonCreateAsyncThunk({type:'retail/editItem',action:RetailService.editItem})
export const deleteItem:any=commonCreateAsyncThunk({type:'retail/deleteItem',action:RetailService.deleteItem})
export const patchItem:any=commonCreateAsyncThunk({type:'retail/patchItem',action:RetailService.pacthItem})
export const restoreItem:any=commonCreateAsyncThunk({type:'retail/restoreItem',action:RetailService.restoreItem})
export const scanOldItem:any=commonCreateAsyncThunk({type:'retail/scanOldItem',action:RetailService.pacthItem})
export const scanExOldItem:any=commonCreateAsyncThunk({type:'retail/scanExOldItem',action:RetailService.pacthItem})
export const retailSlice = createSlice({
    name: 'retail',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.list=RetailService.activeIfSelectAndDeactiveOthers(action.payload.id,state.list)
            state.filteredList=RetailService.activeIfSelectAndDeactiveOthers(action.payload.id,state.filteredList)
            state.item=action.payload
            state.summaryNewList=RetailService.summaryNew(state.item.newList)
            state.summaryOldList=RetailService.summaryOld(state.item.oldList) 
        },
        clearRetailItem:(state)=>{
            state.item=deepCloneObject(RetailModel.initial())
        },
        resetActionState: (state, _action) => {
            state.statusAction='idle';
        },
        resetScanState: (state, _action) => {
            state.statusScan='idle';
        },
        resetScanOldState: (state, _action) => {
            state.statusOldScan='idle';
        },
        resetScanExState: (state, _action) => {
            state.statusExScan='idle';
        },
        setPaymentType: (state, action) => {
            state.item.paymentType=action.payload
        },
        setFilteredList: (state, action) => {
            state.filteredList=action.payload
        },
        setCustomer: (state, action) => {
            state.item.customer=action.payload
        },
        setCurrentPage: (state, action) => {
            state.currentPage=action.payload
        },
        setCurrentRows: (state, action) => {
            state.currentRows=action.payload
        },
        setReload: (state, action) => {
            state.reload=action.payload
        },
        changeAction:(state, action)=>{
            state.action=action.payload
            if(action.payload==="INS"){
                state.item=deepCloneObject(RetailModel.initial())
            }
        },
        setGoldTypes:(state, action)=>{
            state.goldTypes=GoldtypeService.listFromJson(action.payload)
        },
        setGoldGroups:(state, action)=>{
            state.goldGroups=GoldgroupService.listFromJson(action.payload)
        },
        setDiscount:(state,action)=>{
            state.item.discount=action.payload
            state.item.exchangeProduct=RetailService.computingExchangeProductValue(state.item)
            state.item.amount=RetailService.computingOrderValue(state.item)
        },
        addNewListItem:(state,action)=>{
            let item=deepCloneObject(action.payload)
            if(!action.payload.unit){
                item.unit="CHI"
            }
            state.item.newList.push(item)
            state.item.newProduct=state.item.newList.reduce((sum, el) => sum += el.amount, 0)
            state.item.amount=RetailService.computingOrderValue(state.item)
            state.summaryNewList=RetailService.summaryNew(state.item.newList) 
        },
        updateNewListItem:(state,action)=>{
            const {index,keyName,keyValue}=action.payload;
            let currentItem=JSON.parse(JSON.stringify(state.item.newList[index]))
            currentItem[keyName]=keyValue;
            if(["ni_weight"].indexOf(keyName)>=0){
                currentItem["ni_weight"]=stringNumberToFloat(keyValue.split('.').join('').split(',').join('.'))
                currentItem["final_weight"]=stringNumberToFloat(currentItem["gold_weight"])+currentItem["ni_weight"]
            }
            const goldWeight=weightByUnit(stringNumberToFloat(currentItem["final_weight"]),currentItem["unit"]) 
            currentItem["amount"]=roundNumber(goldWeight*stringNumberToInt(currentItem["exchange_rate"])+stringNumberToInt(currentItem["wage"])+stringNumberToInt(currentItem["stone_value"])-stringNumberToInt(currentItem["discount"]))
            state.item.newList[index]=currentItem;
            state.item.newProduct=state.item.newList.reduce((sum, el) => sum += el.amount, 0)
            state.item.amount=RetailService.computingOrderValue(state.item)
            state.summaryNewList=RetailService.summaryNew(state.item.newList)
        },
        deleteNewListItem:(state,action)=>{
            //console.log(action.payload);
            switch (action.payload) {
                case 0:
                    state.item.newList.shift()
                    break;
                case state.item.newList.length-1:
                    state.item.newList.pop()
                    break;
                default:
                    state.item.newList.splice(action.payload,1)
                    break;
            }
            state.item.exchangeResList=[]
            state.item.newTradingDetails=[]
            state.item.newProduct=state.item.newList.reduce((sum, el) => sum += el.amount, 0)
            state.item.amount=RetailService.computingOrderValue(state.item)
            state.summaryNewList=RetailService.summaryNew(state.item.newList)
        },
        changeTradingInvoice:(state, action)=>{
            state.item.hasInvoice=action.payload
            state.item.exchangeResList=[]
            state.item.newTradingDetails=[]
            state.item.exchangeOldList=RetailService.resetValueOfExchangeOldItems(state.item)
            state.item.exchangeOldList=RetailService.processProductTrading(state.item,state.goldTypes)
            state.item.exchangeProduct=RetailService.computingExchangeProductValue(state.item);
            state.item.amount=RetailService.computingOrderValue(state.item);
        },
        addOldListItem:(state,action)=>{
            state.item.oldList.push(action.payload);
            if(action.payload.code!=''){
                state.item.oldProduct=state.item.oldList.reduce((sum, el) => sum += el.amount, 0);
                state.item.amount=RetailService.computingOrderValue(state.item);
            }
            state.summaryOldList=RetailService.summaryOld(state.item.oldList)
        },
        updateOldListItem:(state,action)=>{
            const {index,keyName,keyValue}=action.payload;
            let currentItem=JSON.parse(JSON.stringify(state.item.oldList[index]));
            currentItem[keyName]=keyValue;
            switch (keyName) {
                case "weight":
                    currentItem["weight"]=stringNumberToFloat(currentItem["weight"].toString().split('.').join('').split(',').join('.'))
                    currentItem["gold_weight"]=currentItem["weight"]-currentItem["stone"];
                    currentItem["final_weight"]=currentItem["gold_weight"]+currentItem['ni_weight']
                    currentItem["value"]=weightByUnit(currentItem["final_weight"],currentItem["unit"])*stringNumberToInt(currentItem["buyin_price"])+stringNumberToInt(currentItem["wage"])+stringNumberToInt(currentItem["stone_value"]);
                    break;
                case "stone":
                    currentItem["stone"]=stringNumberToFloat(currentItem["stone"].toString().split('.').join('').split(',').join('.'))
                    currentItem["gold_weight"]=currentItem["weight"]-currentItem["stone"];
                    currentItem["final_weight"]=currentItem["gold_weight"]+currentItem['ni_weight']
                    currentItem["value"]=weightByUnit(currentItem["final_weight"],currentItem["unit"])*stringNumberToInt(currentItem["buyin_price"])+stringNumberToInt(currentItem["wage"])+stringNumberToInt(currentItem["stone_value"]);
                    break;
                case "ni_weight":
                    currentItem["ni_weight"]=stringNumberToFloat(currentItem["ni_weight"].toString().split('.').join('').split(',').join('.'))
                    currentItem["gold_weight"]=currentItem["weight"]-currentItem["stone"];
                    currentItem["final_weight"]=currentItem["gold_weight"]+currentItem['ni_weight']
                    //console.log(currentItem["buyin_price"])
                    currentItem["value"]=weightByUnit(currentItem["final_weight"],currentItem["unit"])*stringNumberToInt(currentItem["buyin_price"])+stringNumberToInt(currentItem["wage"])+stringNumberToInt(currentItem["stone_value"]);
                    break;
                case "buyin_price":
                    currentItem["value"]=weightByUnit(currentItem["final_weight"],currentItem["unit"])*stringNumberToInt(currentItem["buyin_price"])+stringNumberToInt(currentItem["wage"])+stringNumberToInt(currentItem["stone_value"]);
                    break;
            }
            if(keyName==="gold_type"){
                const goldType=state.goldTypes.find((item)=>item.code===keyValue);
                currentItem["age"]=goldType!.age
                currentItem["unit"]=goldType!.unit
                currentItem["exchange_rate"]=goldType!.sellPrice
                currentItem["buyin_price"]=goldType!.buyPrice
                currentItem["buyin_rate"]=goldType!.buyRate
                currentItem["value"]=weightByUnit(currentItem["final_weight"],currentItem["unit"])*stringNumberToInt(currentItem["buyin_price"])+stringNumberToInt(currentItem["wage"]);
            }
            currentItem["amount"]=roundNumber(currentItem["value"]*currentItem["buyin_rate"]/100+stringNumberToFloat(currentItem["discount"]));
            state.item.oldList[index]=currentItem;
            state.item.oldProduct=state.item.oldList.reduce((sum, el) => sum += el.amount, 0);
            state.item.amount=RetailService.computingOrderValue(state.item);
            state.summaryOldList=RetailService.summaryOld(state.item.oldList)
        },
        deleteOldListItem:(state,action)=>{
            //console.log(action.payload);
            switch (action.payload) {
                case 0:
                    state.item.oldList.shift()
                    break;
                case state.item.oldList.length-1:
                    state.item.oldList.pop()
                    break;
                default:
                    state.item.oldList.splice(action.payload,1)
                    break;
            }
            state.item.oldProduct=state.item.oldList.reduce((sum, el) => sum += el.amount, 0);
            state.item.amount=RetailService.computingOrderValue(state.item);
            state.summaryOldList=RetailService.summaryOld(state.item.oldList)
        },
        addExchangeNewListItem:(state,action)=>{
            state.item.exchangeNewList.push(action.payload)
            state.item.exchangeResList=[]
            state.item.newTradingDetails=[]
            state.item.exchangeOldList=RetailService.processProductTrading(state.item,state.goldTypes)
            state.item.exchangeProduct=RetailService.computingExchangeProductValue(state.item)
            state.item.amount=RetailService.computingOrderValue(state.item)
        },
        updateExchangeNewListItem:(state,action)=>{
            const {index,keyName,keyValue}=action.payload;
            let currentItem=JSON.parse(JSON.stringify(state.item.exchangeNewList[index]));
            currentItem[keyName]=keyValue;
            if(["ni_weight"].indexOf(keyName)>=0){
                currentItem["ni_weight"]=stringNumberToFloat(keyValue.split('.').join('').split(',').join('.'));
                currentItem["final_weight"]=stringNumberToFloat(currentItem["gold_weight"])+currentItem["ni_weight"];
            }
            const goldWeight=weightByUnit(stringNumberToFloat(currentItem["final_weight"]),currentItem["unit"])
            
            currentItem["amount"]=roundNumber(goldWeight*stringNumberToInt(currentItem["exchange_rate"])+stringNumberToInt(currentItem["wage"])+stringNumberToInt(currentItem["stone_value"]));
            state.item.exchangeNewList[index]=currentItem;
            state.item.exchangeResList=[]
            state.item.newTradingDetails=[]
            state.item.exchangeOldList=RetailService.processProductTrading(state.item,state.goldTypes)
            state.item.exchangeProduct=RetailService.computingExchangeProductValue(state.item);
            state.item.amount=RetailService.computingOrderValue(state.item);
        },
        deleteExchangeNewListItem:(state,action)=>{
            //console.log(action.payload);
            switch (action.payload) {
                case 0:
                    state.item.exchangeNewList.shift()
                    break;
                case state.item.exchangeNewList.length-1:
                    state.item.exchangeNewList.pop()
                    break;
                default:
                    state.item.exchangeNewList.splice(action.payload,1)
                    break;
            }
            state.item.exchangeResList=[]
            state.item.newTradingDetails=[]
            state.item.exchangeOldList=RetailService.processProductTrading(state.item,state.goldTypes)
            state.item.exchangeProduct=RetailService.computingExchangeProductValue(state.item);
            state.item.amount=RetailService.computingOrderValue(state.item);
        },
        addExchangeOldListItem:(state,action)=>{
            state.item.exchangeOldList.push(action.payload)
            state.item.exchangeResList=[]
            state.item.newTradingDetails=[]
            state.item.exchangeOldList=RetailService.processProductTrading(state.item,state.goldTypes)
            state.item.exchangeProduct=RetailService.computingExchangeProductValue(state.item)
            state.item.amount=RetailService.computingOrderValue(state.item)
        },
        updateExchangeOldListItem:(state,action)=>{
            const {index,keyName,keyValue}=action.payload;
            let currentItem=JSON.parse(JSON.stringify(state.item.exchangeOldList[index]));
            currentItem[keyName]=keyValue;
            switch (keyName) {
                case "weight":
                    currentItem["weight"]=stringNumberToFloat(currentItem["weight"].toString().split('.').join('').split(',').join('.'))
                    currentItem["gold_weight"]=currentItem["weight"]-currentItem["stone"]
                    //currentItem["value"]=weightByUnit(currentItem["final_weight"],currentItem["unit"])*currentItem["exchange_rate"]
                    if(state.item.hasInvoice){
                        currentItem["ni_weight"]=0
                        const goldWeight=currentItem["unit"]==="GRAM"?currentItem["gold_weight"]:currentItem["gold_weight"]/100
                        if(goldWeight>0){
                            currentItem["exchange_rate"]=currentItem["value"]/goldWeight
                        }
                        // else{
                        //     currentItem["exchange_rate"]=0
                        // }
                    }
                    currentItem["final_weight"]=currentItem["gold_weight"]+currentItem['ni_weight']
                    break;
                case "stone":
                    currentItem["stone"]=stringNumberToFloat(currentItem["stone"].toString().split('.').join('').split(',').join('.'))
                    currentItem["gold_weight"]=currentItem["weight"]-currentItem["stone"]
                    //currentItem["value"]=weightByUnit(currentItem["final_weight"],currentItem["unit"])*currentItem["exchange_rate"]
                    if(state.item.hasInvoice){
                        currentItem["ni_weight"]=0
                        const goldWeight=currentItem["unit"]==="GRAM"?currentItem["gold_weight"]:currentItem["gold_weight"]/100
                        if(goldWeight>0){
                            currentItem["exchange_rate"]=currentItem["value"]/goldWeight
                        }
                        // else{
                        //     currentItem["exchange_rate"]=0
                        // }
                    }
                    currentItem["final_weight"]=currentItem["gold_weight"]+currentItem['ni_weight']
                    break;
                case "ni_weight":
                    currentItem["ni_weight"]=stringNumberToFloat(currentItem["ni_weight"].toString().split('.').join('').split(',').join('.'))
                    currentItem["gold_weight"]=currentItem["weight"]-currentItem["stone"]
                    currentItem["final_weight"]=currentItem["gold_weight"]+currentItem['ni_weight']
                    currentItem["value"]=weightByUnit(currentItem["final_weight"],currentItem["unit"])*currentItem["exchange_rate"]
                    break;
            }
            if(["discount","makeup","buyin_price"].indexOf(keyName)>=0){
                currentItem[keyName]=Number(keyValue);
            }
            if(keyName==="gold_type"){
                const goldType=state.goldTypes.find((item)=>item.code===keyValue);
                currentItem["unit"]=goldType!.unit
                currentItem["age"]=goldType!.age
                currentItem["exchange_rate"]=goldType!.sellPrice
                currentItem["buyin_price"]=goldType!.buyPrice
                currentItem["buyin_rate"]=goldType!.buyRate
                currentItem["trading_rate"]=goldType!.changeRate
                currentItem["makeup"]=goldType!.compensation
            }
            if(keyName==="value"&&state.item.hasInvoice){
                currentItem["ni_weight"]=0
                const goldWeight=currentItem["unit"]==="GRAM"?currentItem["gold_weight"]:currentItem["gold_weight"]/100
                if(goldWeight>0){
                    currentItem["exchange_rate"]=currentItem["value"]/goldWeight
                }
            }
            currentItem["amount"]=roundNumber(currentItem["value"]*currentItem["buyin_rate"]/100+stringNumberToFloat(currentItem["discount"]));
            state.item.exchangeResList=[]
            state.item.newTradingDetails=[]
            state.item.exchangeOldList[index]=currentItem;
            state.item.exchangeOldList=RetailService.processProductTrading(state.item,state.goldTypes)
            state.item.exchangeProduct=RetailService.computingExchangeProductValue(state.item)
            state.item.amount=RetailService.computingOrderValue(state.item);
        },
        deleteExchangeOldListItem:(state,action)=>{
            //console.log(action.payload);
            switch (action.payload) {
                case 0:
                    state.item.exchangeOldList.shift()
                    break;
                case state.item.exchangeOldList.length-1:
                    state.item.exchangeOldList.pop()
                    break;
                default:
                    state.item.exchangeOldList.splice(action.payload,1)
                    break;
            }
            state.item.exchangeResList=[]
            state.item.newTradingDetails=[]
            state.item.exchangeOldList=RetailService.processProductTrading(state.item,state.goldTypes)
            state.item.exchangeProduct=RetailService.computingExchangeProductValue(state.item);
            state.item.amount=RetailService.computingOrderValue(state.item);
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(patchItem.fulfilled, (state, action) => {
            //console.log(action.payload.data)
            const item=RetailService.itemFromJson(action.payload.data)
            state.item=item
            state.summaryNewList=RetailService.summaryNew(state.item.newList)
            state.summaryOldList=RetailService.summaryOld(state.item.oldList)
            state.filteredList=[]
            state.filteredList.push(item)
            state.action="VIE"
            state.statusScan="completed"
        })
        .addCase(patchItem.pending, (state, _action) => {
            state.statusScan="loading"
        })
        .addCase(patchItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusScan="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(scanExOldItem.fulfilled, (state, action) => {
            //console.log(action.payload.data)
            const item=RetailService.itemFromJson(action.payload.data)
            state.exOldScanItem=item
            state.statusExScan="completed"
        })
        .addCase(scanExOldItem.pending, (state, _action) => {
            state.statusExScan="loading"
        })
        .addCase(scanExOldItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusExScan="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(scanOldItem.fulfilled, (state, action) => {
            const item=RetailService.itemFromJson(action.payload.data)
            state.oldScanItem=item
            state.statusOldScan="completed"
        })
        .addCase(scanOldItem.pending, (state, _action) => {
            state.statusOldScan="loading"
        })
        .addCase(scanOldItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusOldScan="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(restoreItem.fulfilled, (state, action) => {
            const item=RetailService.itemFromJson(action.payload.data)
            state.item=item
            state.summaryNewList=RetailService.summaryNew(state.item.newList)
            state.summaryOldList=RetailService.summaryOld(state.item.oldList)
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(restoreItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(restoreItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(deleteItem.fulfilled, (state, action) => {
            const item=RetailService.itemFromJson(action.payload.data)
            state.item=item
            state.summaryNewList=RetailService.summaryNew(state.item.newList)
            state.summaryOldList=RetailService.summaryOld(state.item.oldList)
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(deleteItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(deleteItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(editItem.fulfilled, (state, action) => {
            const item=RetailService.itemFromJson(action.payload.data)
            state.item=item
            state.summaryNewList=RetailService.summaryNew(state.item.newList)
            state.summaryOldList=RetailService.summaryOld(state.item.oldList)
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(editItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(editItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(addItem.fulfilled, (state, action) => {
            const item=RetailService.itemFromJson(action.payload.data)
            state.item=item
            state.summaryNewList=RetailService.summaryNew(state.item.newList)
            state.summaryOldList=RetailService.summaryOld(state.item.oldList)
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(addItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(addItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(fetchAll.fulfilled, (state, action) => {
            const list=RetailService.listFromJson(action.payload.data!==''?action.payload.data:[])
            state.list=list
            state.filteredList=list
            state.reload=false
            state.status="completed"
        })
        .addCase(fetchAll.pending, (state, _action) => {
            state.status="loading"
        })
        .addCase(fetchAll.rejected, (state, action) => {
            const error=Object(action.payload)
            state.status="failed"
            state.error=errorMessage(error,false)
        })
    }
})
export const checkMultiGoldExchange = (state: RetailState) => {
    return RetailService.isMultiGoldExchange(state.item)
}
export const { 
        selectItem,
        resetActionState,
        resetScanState,
        resetScanOldState,
        resetScanExState,
        setPaymentType,
        setGoldTypes,
        setGoldGroups,
        setFilteredList,
        setCustomer,
        setCurrentPage,
        setReload,
        setCurrentRows,
        changeAction,
        setDiscount,
        addNewListItem,
        deleteNewListItem,
        changeTradingInvoice,
        addOldListItem,
        deleteOldListItem,
        addExchangeNewListItem,
        deleteExchangeNewListItem,
        addExchangeOldListItem,
        deleteExchangeOldListItem,
        updateNewListItem,
        updateOldListItem,
        updateExchangeNewListItem,
        updateExchangeOldListItem,
        clearRetailItem
    } = retailSlice.actions
export default retailSlice.reducer