import { createSlice } from "@reduxjs/toolkit";
import { ImportModel } from "../../model";
import { ActionSliceState } from "../state";
import { ImportService } from "../../services/Import.service";
import { commonCreateAsyncThunk } from "../thunk";
import { errorMessage } from "../../utils/util";

interface ImportState extends ActionSliceState{
    list:ImportModel[]
    filteredList:ImportModel[]
    item:ImportModel
    statusPatch: 'idle' | 'loading' | 'completed' | 'failed',
}
const initialState:ImportState={
    list: [],
    filteredList:[],
    item: ImportModel.initial(),
    status: "idle",
    statusAction: "idle",
    statusPatch: 'idle',
    action: "INS"
}

export const fetchAllImport:any=commonCreateAsyncThunk({type:'import/fetchAllImport',action:ImportService.fetchAll})
export const addImport:any=commonCreateAsyncThunk({type:'import/addImport',action:ImportService.addItem})
export const updateImport:any=commonCreateAsyncThunk({type:'import/updateImport',action:ImportService.updateItem})
export const deleteImport:any=commonCreateAsyncThunk({type:'import/deleteImport',action:ImportService.deleteItem})
export const patchImport:any=commonCreateAsyncThunk({type:'import/patchImport',action:ImportService.patchItem})
export const restoreImport:any=commonCreateAsyncThunk({type:'import/restoreImport',action:ImportService.restoreItem})
export const syncImages:any=commonCreateAsyncThunk({type:'import/syncImage',action:ImportService.syncImages})
export const importSlice = createSlice({
    name: 'import',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=ImportService.activeIfSelectAndDeactiveOthers(action.payload._id,state.filteredList);
            state.item=action.payload
            //console.log(action.payload)
        },
        setFilteredList: (state, action) => {
            state.filteredList=action.payload
        },
        resetActionState: (state, _action) => {
            state.statusAction='idle';
            state.statusPatch='idle';
        },
        clearSelected:(state)=>{
            state.item=ImportModel.initial()
        },
        selectProductItem:(state, action)=>{
            state.item.products=ImportService.activeProductIfSelectAndDeactiveOthers(action.payload,state.item.products);
        },
        addProducts:(state, action)=>{
            state.item.products=action.payload.products;
            state.item.images=action.payload.images;
            state.item.tags=action.payload.tags;
        },
        changeAction:(state, action)=>{
            state.action=action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAllImport.fulfilled, (state, action) => {
            const list=ImportService.listFromJson(action.payload.data.importProducts)
            state.list=list
            state.filteredList=list
            state.status="completed"
        })
        .addCase(fetchAllImport.pending, (state, _action) => {
            state.status="loading"
        })
        .addCase(fetchAllImport.rejected, (state, action) => {
            //console.log(action.payload)
            const error=Object(action.payload)
            state.status="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(addImport.fulfilled, (state, _action) => {
            //console.log("INS success", action.payload.data.importProduct)
            //state.item=action.payload.data.importProduct
            state.statusAction="completed"
        })
        .addCase(addImport.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(addImport.rejected, (state, action) => {
            const error=Object(action.payload)
            //console.log(error)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(updateImport.fulfilled, (state, _action) => {
            //console.log(" success", action.payload.data)
            //state.item=action.payload.data.importProduct
            state.statusAction="completed"
        })
        .addCase(updateImport.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(updateImport.rejected, (state, action) => {
            const error=Object(action.payload)
            //console.log(error)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(deleteImport.fulfilled, (state, _action) => {
            //console.log("UPD success", action.payload.data.importProduct)
            //state.item=action.payload.data.importProduct
            state.statusAction="completed"
        })
        .addCase(deleteImport.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(deleteImport.rejected, (state, action) => {
            const error=Object(action.payload)
            //console.log(error)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(restoreImport.fulfilled, (state, _action) => {
            //console.log("UPD success", action.payload.data.importProduct)
            //state.item=action.payload.data.importProduct
            state.statusAction="completed"
        })
        .addCase(restoreImport.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(restoreImport.rejected, (state, action) => {
            const error=Object(action.payload)
            //console.log(error)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(patchImport.fulfilled, (state, action) => {
            state.item=ImportService.itemFromJson(action.payload.data.importProduct)
            state.statusPatch="completed"
        })
        .addCase(patchImport.pending, (state, _action) => {
            state.statusPatch="loading"
        })
        .addCase(patchImport.rejected, (state, action) => {
            const error=Object(action.payload)
            //console.log(error)
            state.statusPatch="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(syncImages.fulfilled, (state, _action) => {
            //console.log("UPD success", action.payload.data.importProduct)
            //state.item=action.payload.data.importProduct
            //console.log(action.payload)
            state.statusAction="completed"
        })
        .addCase(syncImages.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(syncImages.rejected, (state, action) => {
            const error=Object(action.payload)
            //console.log(error)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
    }
})
export const { 
    selectItem,
    clearSelected,
    addProducts,
    selectProductItem,
    changeAction,
    resetActionState,
    setFilteredList
} = importSlice.actions
export default importSlice.reducer