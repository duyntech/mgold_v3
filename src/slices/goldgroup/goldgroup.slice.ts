import { createSlice } from "@reduxjs/toolkit"
import { ActionSliceState } from "../state"
import { GoldgroupModel, GoldtypeModel } from "../../model"
import { GoldgroupService } from "../../services/Goldgroup.service"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage } from "../../utils/util"

interface GoldgroupState extends ActionSliceState{
    list:GoldgroupModel[]
    filteredList:GoldgroupModel[]
    item:GoldgroupModel
    goldTypes:GoldtypeModel[]
}
const initialState:GoldgroupState={
    list: [],
    filteredList:[],
    item:GoldgroupModel.initial(),
    goldTypes:[],
    status: 'idle',
    statusAction: 'idle', 
    action: 'INS'
}
export const fetchAll:any=commonCreateAsyncThunk({type:'goldgroup/fetchAll',action:GoldgroupService.fetchAll})
export const addItem:any=commonCreateAsyncThunk({type:'goldgroup/addItem',action:GoldgroupService.addItem})
export const editItem:any=commonCreateAsyncThunk({type:'goldgroup/editItem',action:GoldgroupService.editItem})
export const deleteItem:any=commonCreateAsyncThunk({type:'goldgroup/deleteItem',action:GoldgroupService.deleteItem})
export const restoreItem:any=commonCreateAsyncThunk({type:'goldgroup/restoreItem',action:GoldgroupService.restoreItem})
export const goldgroupSlice = createSlice({
    name: 'goldgroup',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=GoldgroupService.activeIfSelectAndDeactiveOthers(action.payload.id,state.filteredList);
            state.item = action.payload;
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
            // const item=GoldgroupService.itemFromJson(action.payload.data.goldGroup)
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
            // const item=GoldgroupService.itemFromJson(action.payload.data.goldGroup)
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
            // const item=GoldgroupService.itemFromJson(action.payload.data.goldGroup)
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
            // const item=GoldgroupService.itemFromJson(action.payload.data.goldGroup)
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
            const list=GoldgroupService.listFromJson(action.payload.data!==''?action.payload.data.goldGroups:[])
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
    }
})
export const { 
    selectItem,resetActionState, changeAction,setFilteredList
} = goldgroupSlice.actions
export default goldgroupSlice.reducer