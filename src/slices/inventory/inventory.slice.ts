import { createSlice } from "@reduxjs/toolkit";
import { GoldtypeModel, InventoryModel, ProductTypeModel } from "../../model";
import { ActionSliceState } from "../state";
import { InventoryService } from "../../services/Inventory.service";
import { commonCreateAsyncThunk } from "../thunk";
import { errorMessage } from "../../utils/util";

interface InventoryState extends ActionSliceState{
    list:InventoryModel[]
    filteredList:InventoryModel[]
    goldTypes:GoldtypeModel[]
    productTypes:ProductTypeModel[]
    counters:string[]
    item:InventoryModel
    statusInventory:'idle' | 'loading' | 'completed' | 'failed'
}
const initialState:InventoryState={
    list: [],
    filteredList:[],
    goldTypes:[],
    productTypes:[],
    counters:[],
    item: InventoryModel.initial(),
    status: "idle",
    statusAction: "idle",
    statusInventory:"idle",
    action: "INS"
}
export const fetchAllReceipt:any=commonCreateAsyncThunk({type:'inventory/fetchAll',action:InventoryService.fetchAll})
export const addReceipt:any=commonCreateAsyncThunk({type:'inventory/addReceipt',action:InventoryService.addReceipt})
export const deleteReceipt:any=commonCreateAsyncThunk({type:'inventory/deleteReceipt',action:InventoryService.deleteReceipt})
export const inventoryProduct:any=commonCreateAsyncThunk({type:'inventory/inventoryProduct',action:InventoryService.inventoryProduct})
export const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=InventoryService.activeIfSelectAndDeactiveOthers(action.payload.id,state.filteredList);
            state.item=action.payload
        },
        setFilteredList: (state, action) => {
            state.filteredList=action.payload
        },
        setGoldTypes: (state, action) => {
            state.goldTypes=action.payload
        },
        setProductTypes: (state, action) => {
            state.productTypes=action.payload
        },
        setCounters: (state, action) => {
            state.counters=action.payload
        },
        clearSelected:(state)=>{
            state.item=InventoryModel.initial()
        },
        resetActionState: (state, _action) => {
            state.statusAction='idle';
        },
        resetInventoryState: (state, _action) => {
            state.statusInventory='idle';
        },
        changeAction:(state, action)=>{
            state.action=action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(addReceipt.fulfilled, (state, action) => {
            state.item=InventoryService.itemFromJson(action.payload.data!=''?action.payload.data:{})
            state.action="UPD"
            state.statusAction="completed"
        })
        .addCase(addReceipt.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(addReceipt.rejected, (state, _action) => {
            state.statusAction="failed"
            
        })
        .addCase(fetchAllReceipt.fulfilled, (state, action) => {
            const list=InventoryService.listFromJson(action.payload.data!=''?action.payload.data.inventoryProducts:[])
            state.list=list
            state.filteredList=state.list
            state.status="completed"
        })
        .addCase(fetchAllReceipt.pending, (state, _action) => {
            state.status="loading"
        })
        .addCase(fetchAllReceipt.rejected, (state, action) => {
            const error=Object(action.payload)
            state.status="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(inventoryProduct.fulfilled, (state, action) => {
            const item=InventoryService.inventoriedItemFromJson(action.payload.data)
            state.item.inventoried= InventoryService.updateInventorieds(state.item.inventoried,item)
            state.item.remain=InventoryService.reduceRemains(state.item.remain,state.item.inventoried)
            state.statusInventory="completed"
        })
        .addCase(inventoryProduct.pending, (state, _action) => {
            state.statusInventory="loading"
        })
        .addCase(inventoryProduct.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusInventory="failed"
            state.error=errorMessage(error,false)
            
        })
    }
})
export const { 
    selectItem,
    changeAction,
    clearSelected,
    setFilteredList,
    setGoldTypes,
    setProductTypes,
    setCounters,
    resetActionState,
    resetInventoryState
} = inventorySlice.actions
export default inventorySlice.reducer