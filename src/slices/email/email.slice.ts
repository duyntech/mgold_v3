import { createSlice } from "@reduxjs/toolkit"
import { BasicSliceState } from "../state"
import { EmailModel } from "../../model"
import { EmailService } from "../../services/Email.service"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage } from "../../utils/util"

interface EmailState extends BasicSliceState{
    list:EmailModel[]
    filteredList:EmailModel[]
    item:EmailModel
}
const initialState:EmailState={
    list: [],
    filteredList:[],
    item:EmailModel.initial(),
    status: 'idle',
    action: 'VIE'
}
export const fetchAll:any=commonCreateAsyncThunk({type:'email/fetchAll',action:EmailService.fetchAll})
export const emailSlice = createSlice({
    name: 'email',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=EmailService.activeIfSelectAndDeactiveOthers(action.payload.id,state.filteredList);
            state.item = action.payload;
        },
        setFilteredList: (state, action) => {
            state.filteredList=action.payload
        },
        changeAction:(state, action)=>{
            state.action=action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAll.fulfilled, (state, action) => {
            const list=EmailService.listFromJson(action.payload.data!==''?action.payload.data:[])
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
    selectItem, changeAction,setFilteredList
} = emailSlice.actions
export default emailSlice.reducer