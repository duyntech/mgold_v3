import { createSlice } from "@reduxjs/toolkit"

import { BasicSliceState } from "../state"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage } from "../../utils/util"
import { CashSummaryService } from "../../services/CashSummary.service"
import { CashSummaryModel } from "../../model/CashSummary.model"
interface CashSummaryState extends BasicSliceState{
    data:CashSummaryModel[]
    item:CashSummaryModel
    firstValue:number
    lastValue:number
    pageFilters:{from:Date,to:Date}
}

const initialState:CashSummaryState={
    status: 'idle',
    action: "INS",
    data: [],
    item:CashSummaryModel.initial(),
    firstValue: 0,
    lastValue: 0,
    pageFilters: {
        from: new Date(),
        to: new Date()
    }
}
export const fetchAll:any=commonCreateAsyncThunk({type:'cashsummary/fetchAll',action:CashSummaryService.fetchAll})

export const cashsummarySlice = createSlice({
    name: 'cashsummary',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.data=CashSummaryService.activeIfSelectAndDeactiveOthers(action.payload.employee.id,state.data)
            state.item=action.payload
        },
        
        setPageFilters:(state,action)=>{
            state.pageFilters=action.payload
        }
    },
    extraReducers: (builder) => {
        builder
        
        .addCase(fetchAll.fulfilled, (state, action) => {
            //console.log(action.payload.data.data)
            state.data=action.payload.data!==''?action.payload.data.data:[]
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
    selectItem,setPageFilters
} = cashsummarySlice.actions
export default cashsummarySlice.reducer