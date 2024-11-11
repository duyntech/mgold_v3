import { createSlice } from "@reduxjs/toolkit"
import { ViewModel } from "../../model"
import { BasicSliceState } from "../state"
import { ViewService } from "../../services/View.service"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage } from "../../utils/util"

interface ViewState extends BasicSliceState{
    list:ViewModel[]
    filteredList:ViewModel[]
    filters:{from:Date|undefined,to:Date,tab:number}
}

const initialState:ViewState={
    list: [],
    filteredList: [],
    filters:{from:undefined,to:new Date(),tab:0},
    status: "idle",
    action: "VIE"
}
export const fetchAll:any=commonCreateAsyncThunk({type:'view/fetchAll',action:ViewService.fetchAll})

export const viewSlice = createSlice({
    name: 'view',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=ViewService.activeIfSelectAndDeactiveOthers(action.payload,state.filteredList);
        },
        setFilteredList: (state, action) => {
            state.filteredList=action.payload
        },
        setFilters: (state, action) => {
            state.filters=action.payload
        },
        setFiltersTab: (state, action) => {
            state.filters.tab=action.payload
        },
        setFiltersDates: (state, action) => {
            state.filters.from=action.payload.from
            state.filters.to=action.payload.to
        },
        changeAction:(state, action)=>{
            state.action=action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAll.fulfilled, (state, action) => {
            const list=ViewService.listFromJson(action.payload.data!==''?action.payload.data:[])
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

export const { 
    changeAction,setFilteredList,selectItem,setFilters,setFiltersDates,setFiltersTab
} = viewSlice.actions
export default viewSlice.reducer