import { createSlice } from "@reduxjs/toolkit"
import { SearchModel } from "../../model"
import { ActionSliceState } from "../state"
import { SearchService } from "../../services/Search.service"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage } from "../../utils/util"

interface SearchState extends ActionSliceState{
    list:SearchModel[]
    filteredList:SearchModel[]
}

const initialState:SearchState={
    list: [],
    filteredList: [],
    status: "idle",
    action: "VIE",
    statusAction: "idle"
}
export const fetchAll:any=commonCreateAsyncThunk({type:'search/fetchAll',action:SearchService.fetchAll})
export const deleteKey:any=commonCreateAsyncThunk({type:'search/deleteKey',action:SearchService.deleteKey})
export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=SearchService.activeIfSelectAndDeactiveOthers(action.payload,state.filteredList);
        },
        setFilteredList: (state, action) => {
            state.filteredList=action.payload
        },
        resetActionState:(state, _action)=>{
            state.statusAction="idle";
        },
        changeAction:(state, action)=>{
            state.action=action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAll.fulfilled, (state, action) => {
            const list=SearchService.listFromJson(action.payload.data!==''?action.payload.data.keys:[])
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
        .addCase(deleteKey.fulfilled, (state, _action) => {
            state.statusAction="completed"
        })
        .addCase(deleteKey.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(deleteKey.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
    },
})
export const { 
    changeAction,setFilteredList,selectItem,resetActionState
} = searchSlice.actions
export default searchSlice.reducer