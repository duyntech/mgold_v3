import { createSlice } from "@reduxjs/toolkit";
import { ActionSliceState } from "../state";

import { commonCreateAsyncThunk } from "../thunk";
import { deepCloneObject, errorMessage } from "../../utils/util";
import { SemiImportModel } from "../../model/SemiImport.model";
import { SemiImportService } from "../../services/SemiImport.service";

interface SemiImportState extends ActionSliceState{
    list:SemiImportModel[]
    filtereds:SemiImportModel[]
    item:SemiImportModel
    filters:{from:Date,to:Date}
}
const initialState:SemiImportState={
    list: [],
    item: SemiImportModel.initial(),
    status: "idle",
    action: "INS",
    filters: {
        from: new Date(),
        to: new Date()
    },
    statusAction: "idle",
    filtereds: []
}
export const fetchAllImport:any=commonCreateAsyncThunk({type:'semiimport/fetchAllImport',action:SemiImportService.fetchAll})
export const addSemiImport:any=commonCreateAsyncThunk({type:'semiimport/addImport',action:SemiImportService.addItem})
export const updateSemiImport:any=commonCreateAsyncThunk({type:'semiimport/updateImport',action:SemiImportService.updateItem})
export const deleteSemiImport:any=commonCreateAsyncThunk({type:'semiimport/deleteImport',action:SemiImportService.deleteItem})
export const restoreSemiImport:any=commonCreateAsyncThunk({type:'semiimport/restoreImport',action:SemiImportService.restoreItem})
export const semiImportSlice = createSlice({
    name: 'semiimport',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.item=action.payload;
        },
        changeAction:(state, action)=>{
            state.action=action.payload;
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
        },
        doDeleteImportListItem(state,action){
            state.item=SemiImportService.doDeleteImportListItem(state.item,action.payload)
        },
        doNewImportListItem(state){
            state.item.imports=SemiImportService.doNewImportListItem(state.item.imports)
        },
        doImportChanging(state,action){
            state.item.imports=SemiImportService.doImportChanging(state.item.imports,action.payload)
        },
        clearSemiImportState(state){
            state.status="idle"
        },
        clearImportActionState(state){
            state.statusAction="idle"
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAllImport.fulfilled, (state, action) => {
            state.list=SemiImportService.listFromJson(action.payload.data??[])
            state.status="completed"
        })
        .addCase(fetchAllImport.pending, (state, _action) => {
            state.status="loading"
        })
        .addCase(fetchAllImport.rejected, (state, action) => {
            const error=Object(action.payload)
            state.status="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(addSemiImport.fulfilled, (state) => {
            state.statusAction="completed"
        })
        .addCase(addSemiImport.pending, (state) => {
            state.statusAction="loading"
        })
        .addCase(addSemiImport.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(updateSemiImport.fulfilled, (state) => {
            state.statusAction="completed"
        })
        .addCase(updateSemiImport.pending, (state) => {
            state.statusAction="loading"
        })
        .addCase(updateSemiImport.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(deleteSemiImport.fulfilled, (state) => {
            state.statusAction="completed"
        })
        .addCase(deleteSemiImport.pending, (state) => {
            state.statusAction="loading"
        })
        .addCase(deleteSemiImport.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(restoreSemiImport.fulfilled, (state) => {
            state.statusAction="completed"
        })
        .addCase(restoreSemiImport.pending, (state) => {
            state.statusAction="loading"
        })
        .addCase(restoreSemiImport.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
    }
})
export const { 
    changeAction,
    selectItem,
    setFilters,
    setFiltereds,
    setFieldItemValue,
    doDeleteImportListItem,
    doNewImportListItem,
    doImportChanging,
    clearSemiImportState,
    clearImportActionState
} = semiImportSlice.actions
export default semiImportSlice.reducer