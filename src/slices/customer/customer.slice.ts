import { createSlice } from "@reduxjs/toolkit"

import { ActionSliceState } from "../state"
import { CustomerService } from "../../services/Customer.service"
import { commonCreateAsyncThunk } from "../thunk"
import { deepCloneObject, errorMessage } from "../../utils/util"
import { ProfileModel } from "../../model/Profile.model"

interface CustomerState extends ActionSliceState{
    list:ProfileModel[]
    filteredList:ProfileModel[]
    filters:{tab:number}
    item:ProfileModel
}

const initialState:CustomerState={
    list: [],
    filteredList:[],
    item: ProfileModel.initial(),
    filters:{tab:0},
    status: 'idle',
    statusAction: 'idle',
    action: "INS"
}
export const fetchAll:any=commonCreateAsyncThunk({type:'customer/fetchAll',action:CustomerService.fetchAll})
export const addItem:any=commonCreateAsyncThunk({type:'customer/addItem',action:CustomerService.addItem})
export const verifyItem:any=commonCreateAsyncThunk({type:'customer/verifyItem',action:CustomerService.verifyItem})
export const denyItem:any=commonCreateAsyncThunk({type:'customer/denyItem',action:CustomerService.denyItem})
export const unverifyItem:any=commonCreateAsyncThunk({type:'customer/unverifyItem',action:CustomerService.unverifyItem})
export const editItem:any=commonCreateAsyncThunk({type:'customer/editItem',action:CustomerService.editItem})
export const deleteItem:any=commonCreateAsyncThunk({type:'customer/deleteItem',action:CustomerService.deleteItem})
export const restoreItem:any=commonCreateAsyncThunk({type:'customer/restoreItem',action:CustomerService.restoreItem})

export const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=CustomerService.activeIfSelectAndDeactiveOthers(action.payload,state.filteredList);
            state.item=action.payload
        },
        setFilteredList: (state, action) => {
            state.filteredList=action.payload
        },
        setFiltersByKey: (state, action) => {
            const update=deepCloneObject(state.filters)
            update[action.payload.key]=action.payload.value
            state.filters=update
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
            // const item=CustomerService.itemFromJson(action.payload.data.customer)
            // state.item=item
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
            // const item=CustomerService.itemFromJson(action.payload.data.customer)
            // state.item=item
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
        .addCase(unverifyItem.fulfilled, (state, _action) => {
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(unverifyItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(unverifyItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(verifyItem.fulfilled, (state, _action) => {
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(verifyItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(verifyItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(denyItem.fulfilled, (state, _action) => {
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(denyItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(denyItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(addItem.fulfilled, (state, _action) => {
            // const item=CustomerService.itemFromJson(action.payload.data.customer)
            // state.item=item
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
            const list=CustomerService.listFromJson(action.payload.data!==''?action.payload.data.customers:[])
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
    selectItem,resetActionState,changeAction,setFilteredList,setFiltersByKey
} = customerSlice.actions
export default customerSlice.reducer