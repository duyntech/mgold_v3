import { createSlice } from "@reduxjs/toolkit"

import { ActionSliceState } from "../state"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage } from "../../utils/util"
import { BankModel } from "../../model/Bank.model"
import { BankService } from "../../services/Bank.service"

interface BankState extends ActionSliceState{
    list:BankModel[]
    filteredList:BankModel[]
    item:BankModel
}

const initialState:BankState={
    list: [],
    filteredList:[],
    item: BankModel.initial(),
    status: 'idle',
    statusAction: 'idle',
    action: "INS"
}
export const fetchAll:any=commonCreateAsyncThunk({type:'bank/fetchAll',action:BankService.fetchAll})
export const addItem:any=commonCreateAsyncThunk({type:'bank/addItem',action:BankService.addItem})
export const editItem:any=commonCreateAsyncThunk({type:'bank/editItem',action:BankService.editItem})
export const deleteItem:any=commonCreateAsyncThunk({type:'bank/deleteItem',action:BankService.deleteItem})
export const restoreItem:any=commonCreateAsyncThunk({type:'bank/restoreItem',action:BankService.restoreItem})

export const bankSlice = createSlice({
    name: 'bank',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=BankService.activeIfSelectAndDeactiveOthers(action.payload.id,state.filteredList);
            state.item=action.payload
        },
        setFilteredList: (state, action) => {
            state.filteredList=action.payload
        },
        resetActionState: (state, _action) => {
            state.statusAction='idle';
        },
        changeAction:(state, action)=>{
            state.action=action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(restoreItem.fulfilled, (state, _action) => {
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
        .addCase(deleteItem.fulfilled, (state, _action) => {
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
        .addCase(addItem.fulfilled, (state, _action) => {
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
            //console.log("fetch Bank ",action.payload)
            const list=BankService.listFromJson(action.payload.data!==''?action.payload.data.data:[])
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
export const { 
    selectItem,resetActionState,changeAction,setFilteredList
} = bankSlice.actions
export default bankSlice.reducer