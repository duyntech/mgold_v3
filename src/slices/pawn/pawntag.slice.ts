import { createSlice } from "@reduxjs/toolkit"
import { ActionSliceState } from "../state"
import { PawnTagService } from "../../services/PawnTag.service"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage } from "../../utils/util"
import { PawnTagModel } from "../../model/PawnTag.model"

interface PawnTagState extends ActionSliceState{
    list:PawnTagModel[]
    filteredList:PawnTagModel[]
    item:PawnTagModel
}

const initialState:PawnTagState={
    list: [],
    filteredList:[],
    item: PawnTagModel.initial(),
    status: 'idle',
    statusAction: 'idle',
    action: "INS"
}
export const fetchAllPawnTag:any=commonCreateAsyncThunk({type:'pawntag/fetchAll',action:PawnTagService.fetchAll})
export const addPawnTagItem:any=commonCreateAsyncThunk({type:'pawntag/addItem',action:PawnTagService.addItem})
export const editPawnTagItem:any=commonCreateAsyncThunk({type:'pawntag/editItem',action:PawnTagService.editItem})
export const deletePawnTagItem:any=commonCreateAsyncThunk({type:'pawntag/deleteItem',action:PawnTagService.deleteItem})
export const restorePawnTagItem:any=commonCreateAsyncThunk({type:'pawntag/restoreItem',action:PawnTagService.restoreItem})

export const pawntagSlice = createSlice({
    name: 'pawntag',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=PawnTagService.activeIfSelectAndDeactiveOthers(action.payload,state.filteredList);
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
        .addCase(restorePawnTagItem.fulfilled, (state, _action) => {
            // const item=PawnTagService.itemFromJson(action.payload.data.pawntag)
            // state.item=item
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(restorePawnTagItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(restorePawnTagItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(deletePawnTagItem.fulfilled, (state, _action) => {
            // const item=PawnTagService.itemFromJson(action.payload.data.pawntag)
            // state.item=item
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(deletePawnTagItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(deletePawnTagItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(editPawnTagItem.fulfilled, (state, _action) => {
            // const item=PawnTagService.itemFromJson(action.payload.data.pawntag)
            // state.item=item
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(editPawnTagItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(editPawnTagItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(addPawnTagItem.fulfilled, (state, _action) => {
            // const item=PawnTagService.itemFromJson(action.payload.data.pawntag)
            // state.item=item
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(addPawnTagItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(addPawnTagItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(fetchAllPawnTag.fulfilled, (state, action) => {
            const list=PawnTagService.listFromJson(action.payload.data.data)
            state.list=list
            state.filteredList=list
            state.status="completed"
        })
        .addCase(fetchAllPawnTag.pending, (state, _action) => {
            state.status="loading"
        })
        .addCase(fetchAllPawnTag.rejected, (state, action) => {
            const error=Object(action.payload)
            state.status="failed"
            state.error=errorMessage(error,false)
        })
    },
})

// eslint-disable-next-line no-empty-pattern
export const { 
    selectItem,resetActionState,changeAction,setFilteredList
} = pawntagSlice.actions
export default pawntagSlice.reducer