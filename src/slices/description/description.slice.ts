import { createSlice } from "@reduxjs/toolkit"
import { ActionSliceState } from "../state"
import { DescriptionService } from "../../services/Description.service"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage } from "../../utils/util"
import { DescriptionModel } from "../../model/Description.model"

interface DescriptionState extends ActionSliceState{
    list:DescriptionModel[]
    filteredList:DescriptionModel[]
    item:DescriptionModel
}

const initialState:DescriptionState={
    list: [],
    filteredList:[],
    item: DescriptionModel.initial(),
    status: 'idle',
    statusAction: 'idle',
    action: "INS"
}
export const fetchAll:any=commonCreateAsyncThunk({type:'description/fetchAll',action:DescriptionService.fetchAll})
export const addItem:any=commonCreateAsyncThunk({type:'description/addItem',action:DescriptionService.addItem})
export const editItem:any=commonCreateAsyncThunk({type:'description/editItem',action:DescriptionService.editItem})
export const deleteItem:any=commonCreateAsyncThunk({type:'description/deleteItem',action:DescriptionService.deleteItem})
export const restoreItem:any=commonCreateAsyncThunk({type:'description/restoreItem',action:DescriptionService.restoreItem})

export const descriptionSlice = createSlice({
    name: 'description',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=DescriptionService.activeIfSelectAndDeactiveOthers(action.payload.id,state.filteredList);
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
            // const item=DescriptionService.itemFromJson(action.payload.data.description)
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
            // const item=DescriptionService.itemFromJson(action.payload.data.description)
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
            // const item=DescriptionService.itemFromJson(action.payload.data.description)
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
            // const item=DescriptionService.itemFromJson(action.payload.data.description)
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
            const list=DescriptionService.listFromJson(action.payload.data!==''?action.payload.data.data:[])
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
} = descriptionSlice.actions
export default descriptionSlice.reducer