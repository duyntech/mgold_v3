import { createSlice } from "@reduxjs/toolkit"
import { TagModel } from "../../model"
import { ActionSliceState } from "../state"
import { TagService } from "../../services/Tag.service"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage, onlyUnique } from "../../utils/util"

interface TagState extends ActionSliceState{
    list:TagModel[]
    filteredList:TagModel[]
    alphabets:string[]
    item:TagModel
}

const initialState:TagState={
    list: [],
    filteredList:[],
    alphabets:[],
    item: TagModel.initial(),
    status: 'idle',
    statusAction: 'idle',
    action: "INS"
}
export const fetchAll:any=commonCreateAsyncThunk({type:'tag/fetchAll',action:TagService.fetchAll})
export const addItem:any=commonCreateAsyncThunk({type:'tag/addItem',action:TagService.addItem})
export const editItem:any=commonCreateAsyncThunk({type:'tag/editItem',action:TagService.editItem})
export const deleteItem:any=commonCreateAsyncThunk({type:'tag/deleteItem',action:TagService.deleteItem})
export const restoreItem:any=commonCreateAsyncThunk({type:'tag/restoreItem',action:TagService.restoreItem})

export const tagSlice = createSlice({
    name: 'tag',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=TagService.activeIfSelectAndDeactiveOthers(action.payload,state.filteredList);
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
            // const item=TagService.itemFromJson(action.payload.data.tag)
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
            // const item=TagService.itemFromJson(action.payload.data.tag)
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
            // const item=TagService.itemFromJson(action.payload.data.tag)
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
            // const item=TagService.itemFromJson(action.payload.data.tag)
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
            const list=TagService.listFromJson(action.payload.data!==''?action.payload.data.tags:[])
            state.list=list
            let alphabets=list.map((e)=>e.name.charAt(0).toUpperCase())
            alphabets=alphabets.sort((a,b)=>a.localeCompare(b))
            state.alphabets=alphabets.filter(onlyUnique)
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
} = tagSlice.actions
export default tagSlice.reducer