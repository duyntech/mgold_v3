import { createSlice } from "@reduxjs/toolkit"
import { ActionSliceState } from "../state"
import { ConsultingModel } from "../../model"
import { ConsultingService } from "../../services/Consulting.service"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage } from "../../utils/util"
import { ProfileModel } from "../../model/Profile.model"

interface ConsultingState extends ActionSliceState{
    list:ConsultingModel[]
    filteredList:ConsultingModel[]
    item:ConsultingModel
    employees:ProfileModel[]
}
const initialState:ConsultingState={
    list: [],
    filteredList:[],
    item:ConsultingModel.initial(),
    employees:[],
    status: 'idle',
    statusAction: 'idle', 
    action: 'INS'
}
export const fetchAll:any=commonCreateAsyncThunk({type:'consulting/fetchAll',action:ConsultingService.fetchAll})
export const editItem:any=commonCreateAsyncThunk({type:'consulting/editItem',action:ConsultingService.editItem})
export const consultingSlice = createSlice({
    name: 'consulting',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=ConsultingService.activeIfSelectAndDeactiveOthers(action.payload.id,state.filteredList);
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
        
        .addCase(editItem.fulfilled, (state, _action) => {
            // const item=ConsultingService.itemFromJson(action.payload.data.goldGroup)
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
        
        .addCase(fetchAll.fulfilled, (state, action) => {
            const list=ConsultingService.listFromJson(action.payload.data!==''?action.payload.data.goldGroups:[])
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
} = consultingSlice.actions
export default consultingSlice.reducer