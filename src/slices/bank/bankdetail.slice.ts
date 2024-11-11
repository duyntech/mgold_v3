import { createSlice } from "@reduxjs/toolkit"

import { ActionSliceState } from "../state"
// import { commonCreateAsyncThunk } from "../thunk"
// import { errorMessage } from "../../utils/util"
// import { CashDetailModel } from "../../model/CashDetail.model"
import { CashDetailService } from "../../services/CashDetail.service"
import { transactionCodes } from "../../utils/constants/const"
import { BankDetailModel } from "../../model/BankDetail.model"
interface BankdetailState extends ActionSliceState{
    //data:{verified:{arising:[],first:0,last:0},waiting:[],delete:{}}
    firstValue:number
    lastValue:number
    // verifiedList:CashDetailModel[]
    // waitingList:CashDetailModel[]
    // deleteList:CashDetailModel[]
    // filteredVerifiedList:CashDetailModel[]
    // filteredWaitingList:CashDetailModel[]
    // filteredDeleteList:CashDetailModel[]
    item:BankDetailModel
    pageFilters:{bank:string,from:Date,to:Date}
    currentTab:number
    //gridData:any[]
}

const initialState:BankdetailState={
    // verifiedList: [],
    // filteredVerifiedList: [],
    item: BankDetailModel.initial('IMPORT'),
    status: 'idle',
    statusAction: 'idle',
    action: "INS",
    //data: { verified: { arising: [], first: 0, last: 0 }, waiting: [],delete:[]},
    // waitingList: [],
    // deleteList:[],
    // filteredWaitingList: [],
    // filteredDeleteList:[],
    firstValue: 0,
    lastValue: 0,
    pageFilters: {
        bank: "",
        from: new Date(),
        to: new Date()
    },
    currentTab:0,
    //gridData:[]
}
// export const fetchAll:any=commonCreateAsyncThunk({type:'cashdetail/fetchAll',action:CashDetailService.fetchAll})
// export const addItem:any=commonCreateAsyncThunk({type:'cashdetail/addItem',action:CashDetailService.addItem})
// export const editItem:any=commonCreateAsyncThunk({type:'cashdetail/editItem',action:CashDetailService.editItem})
// export const deleteItem:any=commonCreateAsyncThunk({type:'cashdetail/deleteItem',action:CashDetailService.deleteItem})
// export const restoreItem:any=commonCreateAsyncThunk({type:'cashdetail/restoreItem',action:CashDetailService.restoreItem})

// export const denyItem:any=commonCreateAsyncThunk({type:'cashdetail/denyItem',action:CashDetailService.denyItem})
// export const confirmItem:any=commonCreateAsyncThunk({type:'cashdetail/confirmItem',action:CashDetailService.confirmItem})

export const bankdetailSlice = createSlice({
    name: 'bankdetail',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            const {item}=action.payload
            // switch (tabIndex) {
            //     case 0:
            //         state.filteredVerifiedList=CashDetailService.activeIfSelectAndDeactiveOthers(item.id,state.filteredVerifiedList)
            //         break;
            //     case 5:
            //         state.filteredDeleteList=CashDetailService.activeIfSelectAndDeactiveOthers(item.id,state.filteredDeleteList);
            //         break
            //     default:
            //         state.filteredWaitingList=CashDetailService.activeIfSelectAndDeactiveOthers(item.id,state.filteredWaitingList);
            //         break;
            // }
            state.item=item
        },
        
        resetActionState: (state, _action) => {
            state.statusAction='idle';
        },
        changeAction:(state, action)=>{
            state.action=action.payload;
        },
        setPageFilters:(state,action)=>{
            state.pageFilters=action.payload
        },
        setCurrentTab:(state,action)=>{
            state.currentTab=action.payload
        },
        setPayer:(state,action)=>{
            
            state.item.payer_id=action.payload._id
            state.item.payer_name=action.payload.full_name
            state.item.address=action.payload.address
            state.item.phone=action.payload.phone
            if(state.item.reason===transactionCodes.receiptEmployee){
                state.item.accountings=CashDetailService.udpateCreditObjectAccountings(state.item)
            }
        },
        clearPayer:(state)=>{
            state.item.payer_id=''
            state.item.payer_name=''
            state.item.address=''
            state.item.phone=''
            if(state.item.reason===transactionCodes.receiptEmployee){
                state.item.accountings=CashDetailService.clearCreditObjectAccountings(state.item)
            }
        },
        setReceiver:(state,action)=>{
            state.item.receiver_id=action.payload._id
            state.item.receiver_name=action.payload.full_name
            state.item.address=action.payload.address
            state.item.phone=action.payload.phone
            if(state.item.reason===transactionCodes.payslipEmployee){
                state.item.accountings=CashDetailService.udpateDebitObjectAccountings(state.item)
            }
        },
        clearReceiver:(state)=>{
            state.item.receiver_id=''
            state.item.receiver_name=''
            state.item.address=''
            state.item.phone=''
            if(state.item.reason===transactionCodes.payslipEmployee){
                state.item.accountings=CashDetailService.udpateDebitObjectAccountings(state.item)
            }
        },
        setKeyValue:(state,action)=>{
            //console.log(action.payload)
            const key=action.payload.key
            switch (key) {
                case "receiver_name":
                    state.item.receiver_name=action.payload.value
                    break
                case "payer_name":
                    state.item.payer_name=action.payload.value
                    break;
                case "address":
                    state.item.address==action.payload.value
                    break;
                case "phone":
                    state.item.phone==action.payload.value
                    break;
                case "description":
                    state.item.description==action.payload.value
                    break;
                case "date":
                    state.item.date==action.payload.value
                    break;
            }
        },
        setReason:(state,action)=>{
            //console.log(action.payload)
            state.item.reason=action.payload.reason.code
            state.item.description=action.payload.reason.name
            state.item.accountings=CashDetailService.parseTransactionAccountingToJounal(action.payload.reason.accountings)
            state.item.value=state.item.accountings.reduce((sum, el) => sum += el.value, 0)
        },
        setBank:(state,action)=>{
            if(action.payload){
                state.item.bank=action.payload._id
                state.item.method=action.payload.type
            }
            
        },
        clearAccoutings:(state)=>{
            state.item.accountings=[]
            state.item.value=0
        },
        setDate:(state,action)=>{
            state.item.date=action.payload
        },
        updateAccountingItem:(state,action)=>{
            state.item.accountings=CashDetailService.udpateAccountingByIndex(state.item,action.payload)
            state.item.value=state.item.accountings.reduce((sum, el) => sum += el.value, 0)
        },
        // setGridData:(state,action)=>{
        //     state.gridData=CashDetailService.convertVerifiedData2GridData(state.data.verified.first,state.filteredVerifiedList,action.payload,state.pageFilters)
        // },
    },
    extraReducers: (builder) => {
        builder
        // .addCase(denyItem.fulfilled, (state, _action) => {
        //     state.item.status="DENIED"
        //     state.action="VIE"
        //     state.statusAction="completed"
        // })
        // .addCase(denyItem.pending, (state, _action) => {
        //     state.statusAction="loading"
        // })
        // .addCase(denyItem.rejected, (state, action) => {
        //     const error=Object(action.payload)
        //     state.statusAction="failed"
        //     state.error=errorMessage(error,false)
        // })
        // .addCase(confirmItem.fulfilled, (state, _action) => {
        //     state.item.status="ACTIVE"
        //     state.action="VIE"
        //     state.statusAction="completed"
        // })
        // .addCase(confirmItem.pending, (state, _action) => {
        //     state.statusAction="loading"
        // })
        // .addCase(confirmItem.rejected, (state, action) => {
        //     const error=Object(action.payload)
        //     state.statusAction="failed"
        //     state.error=errorMessage(error,false)
        // })
        // .addCase(restoreItem.fulfilled, (state, action) => {
        //     state.item.status=CashDetailService.itemFromJson(action.payload.data.data).status
        //     state.item.disabled=false
        //     state.action="VIE"
        //     state.statusAction="completed"
        // })
        // .addCase(restoreItem.pending, (state, _action) => {
        //     state.statusAction="loading"
        // })
        // .addCase(restoreItem.rejected, (state, action) => {
        //     const error=Object(action.payload)
        //     state.statusAction="failed"
        //     state.error=errorMessage(error,false)
        // })
        // .addCase(deleteItem.fulfilled, (state, _action) => {
        //     state.item.status="DEACTIVE"
        //     state.item.disabled=true
        //     state.action="VIE"
        //     state.statusAction="completed"
        // })
        // .addCase(deleteItem.pending, (state, _action) => {
        //     state.statusAction="loading"
        // })
        // .addCase(deleteItem.rejected, (state, action) => {
        //     const error=Object(action.payload)
        //     state.statusAction="failed"
        //     state.error=errorMessage(error,false)
        // })
        // .addCase(editItem.fulfilled, (state, action) => {
        //     state.item=CashDetailService.itemFromJson(action.payload.data.data)
        //     state.action="VIE"
        //     state.statusAction="completed"
        // })
        // .addCase(editItem.pending, (state, _action) => {
        //     state.statusAction="loading"
        // })
        // .addCase(editItem.rejected, (state, action) => {
        //     const error=Object(action.payload)
        //     state.statusAction="failed"
        //     state.error=errorMessage(error,false)
        // })
        // .addCase(addItem.fulfilled, (state, action) => {
        //     state.item=CashDetailService.itemFromJson(action.payload.data.data)
        //     state.action="VIE"
        //     state.statusAction="completed"
        // })
        // .addCase(addItem.pending, (state, _action) => {
        //     state.statusAction="loading"
        // })
        // .addCase(addItem.rejected, (state, action) => {
        //     const error=Object(action.payload)
        //     state.statusAction="failed"
        //     state.error=errorMessage(error,false)
        // })
        // .addCase(fetchAll.fulfilled, (state, action) => {
        //     state.data=action.payload.data!==''?action.payload.data.data:{verified:{arising:[],first:0,last:0},waiting:[],delete:[]}
        //     //console.log(action.payload.data.data)
        //     state.verifiedList=CashDetailService.listFromJson(state.data.verified.arising)
        //     state.filteredVerifiedList=state.verifiedList
        //     state.waitingList=CashDetailService.listFromJson(state.data.waiting)
        //     state.filteredWaitingList=state.waitingList
        //     state.deleteList=CashDetailService.listFromJson(state.data.delete)
        //     state.filteredDeleteList=state.deleteList
        //     state.status="completed"
        // })
        // .addCase(fetchAll.pending, (state, _action) => {
        //     state.status="loading"
        // })
        // .addCase(fetchAll.rejected, (state, action) => {
        //     const error=Object(action.payload)
        //     state.status="failed"
        //     state.error=errorMessage(error,false)
        // })
    },
})
export const { 
    selectItem,resetActionState,changeAction,clearAccoutings,setPayer,clearPayer,setReason,setKeyValue,setDate,updateAccountingItem,setReceiver,clearReceiver,setPageFilters,setCurrentTab,setBank
} = bankdetailSlice.actions
export default bankdetailSlice.reducer