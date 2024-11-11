import { createSlice } from "@reduxjs/toolkit"
import { ActionSliceState } from "../state"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage } from "../../utils/util"
import { PawnWarehouseModel } from "../../model/PawnWarehouse.model"
import { PawnWarehouseService } from "../../services/PawnWarehouse.service"

interface PawnWarehouseState extends ActionSliceState{
    list:PawnWarehouseModel[]
    filteredList:PawnWarehouseModel[]
    item:PawnWarehouseModel
}

const initialState:PawnWarehouseState={
    list: [],
    filteredList:[],
    item: PawnWarehouseModel.initial(),
    status: 'idle',
    statusAction: 'idle',
    action: "INS"
}
export const fetchAllPawnWarehouse:any=commonCreateAsyncThunk({type:'pawnwarehouse/fetchAll',action:PawnWarehouseService.fetchAll})
export const addPawnWarehouseItem:any=commonCreateAsyncThunk({type:'pawnwarehouse/addItem',action:PawnWarehouseService.addItem})
export const editPawnWarehouseItem:any=commonCreateAsyncThunk({type:'pawnwarehouse/editItem',action:PawnWarehouseService.editItem})
export const deletePawnWarehouseItem:any=commonCreateAsyncThunk({type:'pawnwarehouse/deleteItem',action:PawnWarehouseService.deleteItem})
export const restorePawnWarehouseItem:any=commonCreateAsyncThunk({type:'pawnwarehouse/restoreItem',action:PawnWarehouseService.restoreItem})

export const pawnwarehouseSlice = createSlice({
    name: 'pawnwarehouse',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=PawnWarehouseService.activeIfSelectAndDeactiveOthers(action.payload,state.filteredList);
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
        .addCase(restorePawnWarehouseItem.fulfilled, (state, _action) => {
            // const item=PawnWarehouseService.itemFromJson(action.payload.data.pawnwarehouse)
            // state.item=item
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(restorePawnWarehouseItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(restorePawnWarehouseItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(deletePawnWarehouseItem.fulfilled, (state, _action) => {
            // const item=PawnWarehouseService.itemFromJson(action.payload.data.pawnwarehouse)
            // state.item=item
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(deletePawnWarehouseItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(deletePawnWarehouseItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(editPawnWarehouseItem.fulfilled, (state, _action) => {
            // const item=PawnWarehouseService.itemFromJson(action.payload.data.pawnwarehouse)
            // state.item=item
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(editPawnWarehouseItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(editPawnWarehouseItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(addPawnWarehouseItem.fulfilled, (state, _action) => {
            // const item=PawnWarehouseService.itemFromJson(action.payload.data.pawnwarehouse)
            // state.item=item
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(addPawnWarehouseItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(addPawnWarehouseItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(fetchAllPawnWarehouse.fulfilled, (state, action) => {
            const list=PawnWarehouseService.listFromJson(action.payload.data.data)
            state.list=list
            state.filteredList=list
            state.status="completed"
        })
        .addCase(fetchAllPawnWarehouse.pending, (state, _action) => {
            state.status="loading"
        })
        .addCase(fetchAllPawnWarehouse.rejected, (state, action) => {
            const error=Object(action.payload)
            state.status="failed"
            state.error=errorMessage(error,false)
        })
    },
})

// eslint-disable-next-line no-empty-pattern
export const { 
    selectItem,resetActionState,changeAction,setFilteredList
} = pawnwarehouseSlice.actions
export default pawnwarehouseSlice.reducer