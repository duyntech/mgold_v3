import { createSlice } from "@reduxjs/toolkit"
import { ActionSliceState } from "../state"
import { HistoryModel, TransactionModel } from "../../model"
import { HistoryService } from "../../services/History.service"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage } from "../../utils/util"

interface HistoryState extends ActionSliceState{
    list:TransactionModel[]
    filteredList:TransactionModel[]
    histories:HistoryModel[]
}
const initialState:HistoryState={
    list: [],
    filteredList:[],
    histories:[],
    status: 'idle',
    statusAction: 'idle', 
    action: 'VIE'
}
export const fetchAll:any=commonCreateAsyncThunk({type:'history/fetchAll',action:HistoryService.fetchAll})
export const patchItem:any=commonCreateAsyncThunk({type:'history/patchItem',action:HistoryService.patchItem})
export const historySlice = createSlice({
    name: 'history',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=HistoryService.activeIfSelectAndDeactiveOthers(action.payload.id,state.filteredList);
        },
        selectHistory:(state, action)=>{
            state.histories=HistoryService.activeHistoryIfSelectAndDeactiveOthers(action.payload.id,state.histories);  
        },
        viewHistory:(state, action)=>{
            state.histories=HistoryService.compareDataIfSelectAndDeactiveOthers(action.payload.id,state.histories);  
        },
        setFilteredList: (state, action) => {
            state.filteredList=action.payload
        },
        setHistories: (state, action) => {
            state.histories=action.payload
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
        .addCase(patchItem.fulfilled, (state, action) => {
            //console.log(action.payload.data)
            const list=HistoryService.historyFromJson(action.payload.data!==''?action.payload.data:[])
            state.histories=list
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(patchItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(patchItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        
        .addCase(fetchAll.fulfilled, (state, action) => {
            const list=HistoryService.transactionFromJson(action.payload.data!==''?action.payload.data:[])
            state.list=list
            state.filteredList=list
            state.histories=[]
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
    }
})
export const { 
    selectItem,resetActionState, changeAction,setFilteredList,setHistories,selectHistory,viewHistory
} = historySlice.actions
export default historySlice.reducer