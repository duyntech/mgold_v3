import { createSlice } from "@reduxjs/toolkit";
import { ActionSliceState } from "../state";
import { commonCreateAsyncThunk } from "../thunk";
import { deepCloneObject, errorMessage } from "../../utils/util";
import { SemiExportService } from "../../services/SemiExport.service";
import { SemiExportModel } from "../../model/SemiExport.model";

interface SemiExportState extends ActionSliceState{
    list:SemiExportModel[]
    filtereds:SemiExportModel[]
    item:SemiExportModel
    filters:{from:Date,to:Date,stock:string}
    statusRemain: 'idle' | 'loading' | 'completed' | 'failed'
}
const initialState:SemiExportState={
    list: [],
    filtereds:[],
    filters:{from:new Date(),to: new Date(),stock:'MHC'},
    item: SemiExportModel.initial(),
    status: "idle",
    action: "INS",
    statusAction: "idle",
    statusRemain: "idle"
}
export const fetchAllExport:any=commonCreateAsyncThunk({type:'semiexport/fetchAllExport',action:SemiExportService.fetchAll})
export const fetchRemain:any=commonCreateAsyncThunk({type:'semiexport/fetchRemain',action:SemiExportService.fetchRemain})
export const addSemiExport:any=commonCreateAsyncThunk({type:'semiexport/addSemiExport',action:SemiExportService.addItem})
export const updateSemiExport:any=commonCreateAsyncThunk({type:'semiexport/updateSemiExport',action:SemiExportService.updateItem})
export const deleteSemiExport:any=commonCreateAsyncThunk({type:'semiexport/deleteSemiExport',action:SemiExportService.deleteItem})
export const restoreSemiExport:any=commonCreateAsyncThunk({type:'semiexport/restoreSemiExport',action:SemiExportService.restoreItem})
export const semiexportSlice = createSlice({
    name: 'semiexport',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.item=action.payload;
        },
        setFilters(state,action){
            state.filters=action.payload
        },
        setFiltereds(state,action){
            state.filtereds=action.payload
        },
        setFieldItemValue(state,action){
            let item=deepCloneObject(state.item)
            item[action.payload.field]=action.payload.value
            state.item=item
            if(action.payload.field==="type"){
                state.item=SemiExportService.doTypeChanging(state.item)
            }
        },
        changeAction:(state, action)=>{
            state.action=action.payload;
        },
        doRemainChanging(state,action){
            state.item=SemiExportService.doRemainChanging(state.item,action.payload)
        },
        doExportChanging(state,action){
            state.item.exports=SemiExportService.doExportChanging(state.item.exports,action.payload)
        },
        doDeleteExportListItem(state,action){
            state.item=SemiExportService.doDeleteExportListItem(state.item,action.payload)
        },
        doNewExportListItem(state){
            state.item.exports=SemiExportService.doNewExportListItem(state.item.exports)
        },
        clearActionState(state){
            state.statusAction="idle"
        },
        clearState(state){
            state.status="idle"
        },
        clearRemainState(state){
            state.statusRemain="idle"
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAllExport.fulfilled, (state, action) => {
            state.list=SemiExportService.listFromJson(action.payload.data.data??[])
            state.status="completed"
        })
        .addCase(fetchAllExport.pending, (state, _action) => {
            state.status="loading"
        })
        .addCase(fetchAllExport.rejected, (state, action) => {
            const error=Object(action.payload)
            state.status="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(fetchRemain.fulfilled, (state, action) => {
            state.item.imports=SemiExportService.remainFromJson(action.payload.data.data??[])
            state.statusRemain="completed"
        })
        .addCase(fetchRemain.pending, (state, _action) => {
            state.statusRemain="loading"
        })
        .addCase(fetchRemain.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusRemain="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(addSemiExport.fulfilled, (state) => {
            state.statusAction="completed"
        })
        .addCase(addSemiExport.pending, (state) => {
            state.statusAction="loading"
        })
        .addCase(addSemiExport.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(updateSemiExport.fulfilled, (state) => {
            state.statusAction="completed"
        })
        .addCase(updateSemiExport.pending, (state) => {
            state.statusAction="loading"
        })
        .addCase(updateSemiExport.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(deleteSemiExport.fulfilled, (state) => {
            state.statusAction="completed"
        })
        .addCase(deleteSemiExport.pending, (state) => {
            state.statusAction="loading"
        })
        .addCase(deleteSemiExport.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(restoreSemiExport.fulfilled, (state) => {
            state.statusAction="completed"
        })
        .addCase(restoreSemiExport.pending, (state) => {
            state.statusAction="loading"
        })
        .addCase(restoreSemiExport.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
    }
})
export const { 
    selectItem,
    setFilters,
    setFieldItemValue,
    changeAction,
    doRemainChanging,
    doExportChanging,
    clearActionState,
    clearState,
    setFiltereds,
    doDeleteExportListItem,
    doNewExportListItem,
    clearRemainState
} = semiexportSlice.actions
export default semiexportSlice.reducer