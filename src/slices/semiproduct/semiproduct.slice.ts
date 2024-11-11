import { createSlice } from "@reduxjs/toolkit";
import { OldProductModel } from "../../model";
import { BasicSliceState } from "../state";

import { SemiProductStorageService } from "../../services/SemiProductStorage.service";
import { commonCreateAsyncThunk } from "../thunk";
import { errorMessage } from "../../utils/util";

interface SemiProductStorageState extends BasicSliceState{
    rawData:any
    details:any[]
    list:OldProductModel[]
    filteredList:OldProductModel[]
}
const initialState:SemiProductStorageState={
    rawData:false,
    details:[],
    list: [],
    filteredList:[],
    status: "idle",
    action: "INS"
}
export const fetchSemiDetails:any=commonCreateAsyncThunk({type:'semiproduct/fetchSemiDetails',action:SemiProductStorageService.fetchDetails})
export const fetchAll:any=commonCreateAsyncThunk({type:'semiproduct/fetchAll',action:SemiProductStorageService.fetchAll})
export const semiProductStorageSlice = createSlice({
    name: 'semiproduct',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=SemiProductStorageService.activeIfSelectAndDeactiveOthers(action.payload,state.filteredList);
        },
        setFilteredList: (state, action) => {
            state.filteredList=action.payload
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAll.fulfilled, (state, action) => {
            state.list=SemiProductStorageService.listFromJson(action.payload.data!==''?action.payload.data:[])
            state.filteredList=state.list
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
        .addCase(fetchSemiDetails.fulfilled, (state, action) => {
            state.details=SemiProductStorageService.detailFromJson(action.payload.data!==''?action.payload.data.data:[])
            state.status="completed"
        })
        .addCase(fetchSemiDetails.pending, (state, _action) => {
            state.status="loading"
        })
        .addCase(fetchSemiDetails.rejected, (state, action) => {
            const error=Object(action.payload)
            state.status="failed"
            state.error=errorMessage(error,false)
        })
    }
})
export const { 
    selectItem,
    setFilteredList
} = semiProductStorageSlice.actions
export default semiProductStorageSlice.reducer