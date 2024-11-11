import { createSlice } from "@reduxjs/toolkit"
import { ActionSliceState } from "../state"
import { InstallmentModel } from "../../model"
import { InstallmentService } from "../../services/Installment.service"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage } from "../../utils/util"

interface InstallmentState extends ActionSliceState{
    list:InstallmentModel[]
    filteredList:InstallmentModel[]
    item:InstallmentModel
}
const initialState:InstallmentState={
    list: [],
    filteredList:[],
    item:InstallmentModel.initial(),
    status: 'idle',
    statusAction:'idle',
    action: 'VIE'
}
export const updateItem:any=commonCreateAsyncThunk({type:'installment/updateItem',action:InstallmentService.updateItem})
export const patchItem:any=commonCreateAsyncThunk({type:'installment/patchItem',action:InstallmentService.patchItem})
export const installmentSlice = createSlice({
    name: 'installment',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=InstallmentService.activeIfSelectAndDeactiveOthers(action.payload.id,state.filteredList);
            state.item = action.payload;
        },
        setFilteredList: (state, action) => {
            state.filteredList=action.payload
        },
        changeAction:(state, action)=>{
            state.action=action.payload;
        },
        resetStatus:(state)=>{
            state.status="idle";
        },
        resetActionStatus:(state)=>{
            state.statusAction="idle";
        },
        addPeriodItem:(state,action)=>{
            state.item.periods.push(action.payload)
        },
        updatePeriodItem:(state,action)=>{
            const {index,data}=action.payload
            state.item.periods[index]=data
        },
        deletePeriodItem:(state,action)=>{
            switch (action.payload) {
                case 0:
                    state.item.periods.shift()
                    break;
                case state.item.periods.length-1:
                    state.item.periods.pop()
                    break;
                default:
                    state.item.periods.splice(action.payload,1)
                    break;
            }
        },

    },
    extraReducers: (builder) => {
        builder
        .addCase(updateItem.fulfilled, (state, _action) => {
            state.statusAction="completed"
            state.action='VIE'
        })
        .addCase(updateItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(updateItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(patchItem.fulfilled, (state, action) => {
            state.item=InstallmentService.itemFromJson(action.payload.data)
            state.action='VIE'
            state.status="completed"
        })
        .addCase(patchItem.pending, (state, _action) => {
            state.status="loading"
        })
        .addCase(patchItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.status="failed"
            state.error=errorMessage(error,false)
        })
    }
})
export const { 
    selectItem, changeAction,setFilteredList,resetStatus,addPeriodItem,updatePeriodItem,deletePeriodItem,resetActionStatus
} = installmentSlice.actions
export default installmentSlice.reducer