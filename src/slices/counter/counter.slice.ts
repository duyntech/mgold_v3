import { createSlice } from "@reduxjs/toolkit"
import { ActionSliceState } from "../state"
import { CounterService } from "../../services/Counter.service"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage } from "../../utils/util"
import { CounterModel } from "../../model/Counter.model"

interface CounterState extends ActionSliceState{
    list:CounterModel[]
    filteredList:CounterModel[]
    item:CounterModel
}

const initialState:CounterState={
    list: [],
    filteredList:[],
    item: CounterModel.initial(),
    status: 'idle',
    statusAction: 'idle',
    action: "INS"
}
export const fetchAll:any=commonCreateAsyncThunk({type:'counter/fetchAll',action:CounterService.fetchAll})
export const addItem:any=commonCreateAsyncThunk({type:'counter/addItem',action:CounterService.addItem})
export const editItem:any=commonCreateAsyncThunk({type:'counter/editItem',action:CounterService.editItem})
export const deleteItem:any=commonCreateAsyncThunk({type:'counter/deleteItem',action:CounterService.deleteItem})
export const restoreItem:any=commonCreateAsyncThunk({type:'counter/restoreItem',action:CounterService.restoreItem})

export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=CounterService.activeIfSelectAndDeactiveOthers(action.payload.id,state.filteredList);
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
            // const item=CounterService.itemFromJson(action.payload.data.counter)
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
            // const item=CounterService.itemFromJson(action.payload.data.counter)
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
            // const item=CounterService.itemFromJson(action.payload.data.counter)
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
            // const item=CounterService.itemFromJson(action.payload.data.counter)
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
            const list=CounterService.listFromJson(action.payload.data!==''?action.payload.data.data:[])
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
} = counterSlice.actions
export default counterSlice.reducer