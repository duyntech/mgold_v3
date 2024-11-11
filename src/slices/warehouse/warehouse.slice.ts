import { createSlice } from "@reduxjs/toolkit"
import { WarehouseModel } from "../../model"
import { ActionSliceState } from "../state"
import { WarehouseService } from "../../services/Warehouse.service"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage } from "../../utils/util"

interface WarehouseState extends ActionSliceState{
    list:WarehouseModel[]
    filteredList:WarehouseModel[]
    item:WarehouseModel
}

const initialState:WarehouseState={
    list: [],
    filteredList:[],
    item: WarehouseModel.initial(),
    status: 'idle',
    statusAction: 'idle',
    action: "INS"
}
export const fetchAll:any=commonCreateAsyncThunk({type:'warehouse/fetchAll',action:WarehouseService.fetchAll})
export const addItem:any=commonCreateAsyncThunk({type:'warehouse/addItem',action:WarehouseService.addItem})
export const editItem:any=commonCreateAsyncThunk({type:'warehouse/editItem',action:WarehouseService.editItem})
export const deleteItem:any=commonCreateAsyncThunk({type:'warehouse/deleteItem',action:WarehouseService.deleteItem})
export const restoreItem:any=commonCreateAsyncThunk({type:'warehouse/restoreItem',action:WarehouseService.restoreItem})
export const warehouseSlice = createSlice({
    name: 'warehouse',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=WarehouseService.activeIfSelectAndDeactiveOthers(action.payload.id,state.filteredList);
            state.item=action.payload
        },
        setFilteredList: (state, action) => {
            state.filteredList=action.payload
        },
        resetActionState: (state, _action) => {
            state.statusAction='idle'
        },
        changeAction:(state, action)=>{
            console.log("action.payload:" + action.payload);
            state.action=action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(restoreItem.fulfilled, (state, _action) => {
            // const item=WarehouseService.itemFromJson(action.payload.data.warehouse)
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
            // const item=WarehouseService.itemFromJson(action.payload.data.warehouse)
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
            // const item=WarehouseService.itemFromJson(action.payload.data.warehouse)
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
            // const item=WarehouseService.itemFromJson(action.payload.data.warehouse)
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
            const list=WarehouseService.listFromJson(action.payload.data!==''?action.payload.data.warehouses:[])
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
} = warehouseSlice.actions
export default warehouseSlice.reducer