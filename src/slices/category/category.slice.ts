import { createSlice } from "@reduxjs/toolkit"
import { ActionSliceState } from "../state"
import { commonCreateAsyncThunk } from "../thunk"
import { CategoriesService } from "../../services/Category.service"
import { errorMessage } from "../../utils/util"

interface CategoriesState extends ActionSliceState{
    data:any
    fetched:boolean
}

const initialState:CategoriesState={
    data: null,
    fetched: false,
    status: 'idle',
    action: "VIE",
    statusAction: "idle"
}
export const fetchCategories:any=commonCreateAsyncThunk({type:'categories/fetchAll',action:CategoriesService.fetchAll})
export const updateCategories:any=commonCreateAsyncThunk({type:'categories/updateCategories',action:CategoriesService.updateCategories})
export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        setFetched:(state, action) => {
            state.fetched=action.payload
        },
        resetState: (state, _action) => {
            state.status='idle';
        },
        resetActionState: (state, _action) => {
            state.statusAction='idle';
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchCategories.fulfilled, (state, action) => {
            //console.log(action.payload)
            state.data=action.payload.data
            state.status="completed"
        })
        .addCase(fetchCategories.pending, (state, _action) => {
            state.status="loading"
        })
        .addCase(fetchCategories.rejected, (state, action) => {
            const error=Object(action.payload)
            state.status="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(updateCategories.fulfilled, (state) => {
            //console.log(action.payload)
            //state.data=action.payload.data
            state.statusAction="completed"
        })
        .addCase(updateCategories.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(updateCategories.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
    },
})
export const { 
    resetState,setFetched,resetActionState
} = categoriesSlice.actions
export default categoriesSlice.reducer