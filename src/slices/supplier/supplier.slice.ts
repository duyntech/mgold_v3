import { createSlice } from "@reduxjs/toolkit"
import { ActionSliceState } from "../state"
import { SupplierService } from "../../services/Supplier.service"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage } from "../../utils/util"
import { SupplierModel } from "../../model/Supplier.model"

interface SupplierState extends ActionSliceState{
    list:SupplierModel[]
    filteredList:SupplierModel[]
    item:SupplierModel
}

const initialState:SupplierState={
    list: [],
    filteredList:[],
    item: SupplierModel.initial(),
    status: 'idle',
    statusAction: 'idle',
    action: "INS"
}
export const fetchAll:any=commonCreateAsyncThunk({type:'supplier/fetchAll',action:SupplierService.fetchAll})
export const addItem:any=commonCreateAsyncThunk({type:'supplier/addItem',action:SupplierService.addItem})
export const editItem:any=commonCreateAsyncThunk({type:'supplier/editItem',action:SupplierService.editItem})
export const deleteItem:any=commonCreateAsyncThunk({type:'supplier/deleteItem',action:SupplierService.deleteItem})
export const restoreItem:any=commonCreateAsyncThunk({type:'supplier/restoreItem',action:SupplierService.restoreItem})

export const supplierSlice = createSlice({
    name: 'supplier',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=SupplierService.activeIfSelectAndDeactiveOthers(action.payload,state.filteredList);
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
            // const item=SupplierService.itemFromJson(action.payload.data.supplier)
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
            // const item=SupplierService.itemFromJson(action.payload.data.supplier)
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
            // const item=SupplierService.itemFromJson(action.payload.data.supplier)
            // state.item=item
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
            // const item=SupplierService.itemFromJson(action.payload.data.supplier)
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
            //console.log()
            const list=SupplierService.listFromJson(action.payload.data.data)
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
    selectItem,resetActionState,changeAction,setFilteredList
} = supplierSlice.actions
export default supplierSlice.reducer