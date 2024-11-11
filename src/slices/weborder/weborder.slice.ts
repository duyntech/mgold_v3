import { createSlice } from "@reduxjs/toolkit"
import { WeborderModel } from "../../model"
import { ActionSliceState } from "../state"
import { WeborderService } from "../../services/Weborder.service"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage, roundNumber, stringNumberToFloat, stringNumberToInt, weightByUnit } from "../../utils/util"

interface WeborderState extends ActionSliceState{
    list:WeborderModel[]
    filteredList:WeborderModel[]
    item:WeborderModel
    reload:boolean,
    filters:{from:Date|undefined,to:Date,tab:number}
}

const initialState:WeborderState={
    list: [],
    filteredList:[],
    item: WeborderModel.initial(),
    filters:{from:undefined,to:new Date(),tab:0},
    reload:false,
    status: 'idle',
    statusAction: 'idle',
    action: "VIE"
}
export const fetchAll:any=commonCreateAsyncThunk({type:'weborder/fetchAll',action:WeborderService.fetchAll})
export const addItem:any=commonCreateAsyncThunk({type:'weborder/addItem',action:WeborderService.addItem})
export const editItem:any=commonCreateAsyncThunk({type:'weborder/editItem',action:WeborderService.editItem})
export const confirmItem:any=commonCreateAsyncThunk({type:'weborder/confirmItem',action:WeborderService.confirmItem})
export const cancelItem:any=commonCreateAsyncThunk({type:'weborder/cancelItem',action:WeborderService.cancelItem})
export const deliveringItem:any=commonCreateAsyncThunk({type:'weborder/deliveringItem',action:WeborderService.deliveringItem})
export const completeItem:any=commonCreateAsyncThunk({type:'weborder/completeItem',action:WeborderService.completeItem})
export const weborderSlice = createSlice({
    name: 'weborder',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=WeborderService.activeIfSelectAndDeactiveOthers(action.payload.id,state.filteredList);
            state.item=action.payload
        },
        setReload: (state, action) => {
            state.reload=action.payload
        },
        setFilteredList: (state, action) => {
            state.filteredList=action.payload
        },
        setReceiverInfos: (state, action) => {
            state.item.receiverInfos=action.payload
        },
        setCustomer: (state, action) => {
            state.item.customer=action.payload
        },
        setFilters: (state, action) => {
            state.filters=action.payload
        },
        setFiltersTab: (state, action) => {
            state.filters.tab=action.payload
        },
        setFiltersDates: (state, action) => {
            state.filters.from=action.payload.from
            state.filters.to=action.payload.to
        },
        resetActionState: (state, _action) => {
            state.statusAction='idle'
        },
        changeAction:(state, action)=>{
            state.action=action.payload;
        },
        updateCancelReason:(state, action)=>{
            state.item.cancelReason=action.payload;
        },
        updateCancelInfos:(state, action)=>{
            state.item.cancelInfos=action.payload;
        },
        updateDeliveryFee:(state, action) => {
            state.item.deliveryFee=action.payload
            state.item.amount=state.item.value+state.item.deliveryFee
        },
        updateDeliveryCode: (state, action) => {
            state.item.deliveryCode=action.payload
        },
        addPaymentItem:(state,action)=>{
            state.item.paymentDetail.push(action.payload)
        },
        updatePaymentItem:(state,action)=>{
            const {index,data}=action.payload
            state.item.paymentDetail[index]=data
        },
        deletePaymentItem:(state,action)=>{
            switch (action.payload) {
                case 0:
                    state.item.paymentDetail.shift()
                    break;
                case state.item.paymentDetail.length-1:
                    state.item.paymentDetail.pop()
                    break;
                default:
                    state.item.paymentDetail.splice(action.payload,1)
                    break;
            }
        },
        addProductItem:(state,action)=>{
            state.item.products.push(action.payload)
            state.item.value=state.item.products.reduce((sum, el) => sum += el.amount, 0)
            state.item.amount=state.item.value+state.item.deliveryFee
        },
        updateProductItem:(state,action)=>{
            const {index,keyName,keyValue}=action.payload;
            let currentItem=JSON.parse(JSON.stringify(state.item.products[index]))
            currentItem[keyName]=keyValue;
            currentItem["final_weight"]=currentItem["gold_weight"]
            if(["ni_weight"].indexOf(keyName)>=0){
                currentItem["ni_weight"]=stringNumberToFloat(keyValue.split('.').join('').split(',').join('.'))
                currentItem["final_weight"]=stringNumberToFloat(currentItem["gold_weight"])+currentItem["ni_weight"]
            }
            const goldWeight=weightByUnit(stringNumberToFloat(currentItem["final_weight"]),currentItem["unit"]) 
            currentItem["amount"]=roundNumber(goldWeight*stringNumberToInt(currentItem["exchange_rate"])+stringNumberToInt(currentItem["wage"])+stringNumberToInt(currentItem["stone_value"])-stringNumberToInt(currentItem["discount"]))
            state.item.products[index]=currentItem;
            state.item.value=state.item.products.reduce((sum, el) => sum += el.amount, 0)
            state.item.amount=state.item.value+state.item.deliveryFee
        },
        deleteProductItem:(state,action)=>{
            //console.log(action.payload);
            switch (action.payload) {
                case 0:
                    state.item.products.shift()
                    break;
                case state.item.products.length-1:
                    state.item.products.pop()
                    break;
                default:
                    state.item.products.splice(action.payload,1)
                    break;
            }
            state.item.value=state.item.products.reduce((sum, el) => sum += el.amount, 0)
            state.item.amount=state.item.value+state.item.deliveryFee
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(completeItem.fulfilled, (state, _action) => {
            state.action="VIE"
            state.item.status="COMPLETE"
            state.statusAction="completed"
        })
        .addCase(completeItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(completeItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(deliveringItem.fulfilled, (state, _action) => {
            state.action="VIE"
            state.item.status="DELIVERING"
            state.statusAction="completed"
        })
        .addCase(deliveringItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(deliveringItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(cancelItem.fulfilled, (state, _action) => {
            state.action="VIE"
            state.item.status="CANCEL"
            state.statusAction="completed"
        })
        .addCase(cancelItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(cancelItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(confirmItem.fulfilled, (state, _action) => {
            state.action="VIE"
            state.item.status="CONFIRM"
            state.statusAction="completed"
        })
        .addCase(confirmItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(confirmItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(addItem.fulfilled, (state, action) => {
            const item=WeborderService.itemFromJson(action.payload.data)
            state.item=item
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
        .addCase(editItem.fulfilled, (state, _action) => {
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
        .addCase(fetchAll.fulfilled, (state, action) => {
            const list=WeborderService.listFromJson(action.payload.data!==''?action.payload.data:[])
            state.list=list
            state.filteredList=list
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
    },
})

// eslint-disable-next-line no-empty-pattern
export const { 
    selectItem,
    resetActionState,
    changeAction,
    setFilteredList,
    addProductItem,
    updateProductItem,
    deleteProductItem,
    updateDeliveryFee,
    updateDeliveryCode,
    addPaymentItem,
    deletePaymentItem,
    updatePaymentItem,
    updateCancelReason,
    updateCancelInfos,
    setCustomer,
    setFilters,
    setFiltersTab,
    setFiltersDates,
    setReceiverInfos,
    setReload
} = weborderSlice.actions
export default weborderSlice.reducer