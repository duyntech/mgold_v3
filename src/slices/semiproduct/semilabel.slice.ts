import { createSlice } from "@reduxjs/toolkit";
import { ActionSliceState } from "../state";
import { commonCreateAsyncThunk } from "../thunk";
import { errorMessage } from "../../utils/util";
import { SemiLabelService } from "../../services/SemiLabel.service";
import { SemiLabelModel } from "../../model/SemiLabel.model";
import { ProductModel } from "../../model";
import { actions } from "../../types";

interface SemiLabelState extends ActionSliceState{
    list:SemiLabelModel[]
    item:SemiLabelModel
    product:ProductModel
    label:ProductModel
    remain:any
    remains:any[]
    labelStatus: 'idle' | 'loading' | 'completed' | 'failed'
    labbelAction:actions
    needToFetch:boolean
    showAlert:boolean
}
const initialState:SemiLabelState={
    list: [],
    item: SemiLabelModel.initial(),
    product: ProductModel.initial(),
    label: ProductModel.initial(),
    remain: false,
    remains:[],
    needToFetch:false,
    showAlert:true,
    status: "idle",
    action: "INS",
    labelStatus: "idle",
    labbelAction: "INS",
    statusAction: "idle"
}
export const fetchAllByDate:any=commonCreateAsyncThunk({type:'semilabel/fetchAllByDate',action:SemiLabelService.fetchAll})
export const addSemiLabel:any=commonCreateAsyncThunk({type:'semilabel/addSemiLabel',action:SemiLabelService.addSemiLabel})
export const patchSemiLabel:any=commonCreateAsyncThunk({type:'semilabel/patchSemiLabel',action:SemiLabelService.patchSemiLabel})
export const addLabel:any=commonCreateAsyncThunk({type:'semilabel/addLabel',action:SemiLabelService.addLabel})
export const updateLabel:any=commonCreateAsyncThunk({type:'semilabel/updateLabel',action:SemiLabelService.updateLabel})
export const deleteLabel:any=commonCreateAsyncThunk({type:'semilabel/deleteLabel',action:SemiLabelService.deleteLabel})
export const semiLabelSlice = createSlice({
    name: 'semilabel',
    initialState,
    reducers: {
        selectItem(state,action){
            state.item=action.payload
        },
        selectItemById(state,action){
            state.item=state.list.find(i=>i._id===action.payload)??SemiLabelModel.initial()
        },
        selectProduct(state,action){
            state.product=action.payload
            state.label=action.payload
        },
        selectProductById(state,action){
            state.product=state.item.exports.find(i=>i._id===action.payload)
        },
        selectRemain(state,action){
            state.remain=action.payload
        },
        selectRemainById(state,action){
            state.remain=state.item.imports.find(i=>i._id===action.payload)
        },
        changeAction:(state, action)=>{
            state.action=action.payload;
        },
        changeLabelAction:(state, action)=>{
            state.labbelAction=action.payload;
        },
        clearActionState(state){
            state.statusAction="idle"
        },
        clearState(state){
            state.status="idle"
        },
        clearLabelActionState(state){
            state.labelStatus="idle"
        },
        setRemains(state,action){
            state.remains=action.payload
        },
        updateProductField(state,action){
            state.product=SemiLabelService.updateProductField(state.product,action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAllByDate.fulfilled, (state, action) => {
            state.list=SemiLabelService.listFromJson(action.payload.data.data??[])
            state.status="completed"
            state.needToFetch=false
        })
        .addCase(fetchAllByDate.pending, (state, _action) => {
            state.status="loading"
        })
        .addCase(fetchAllByDate.rejected, (state, action) => {
            const error=Object(action.payload)
            state.status="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(addSemiLabel.fulfilled, (state) => {
            //console.log(action.payload.data)
            state.statusAction="completed"
            state.needToFetch=true
        })
        .addCase(addSemiLabel.pending, (state, _action) => {
            state.statusAction="loading"
            state.showAlert=true
        })
        .addCase(addSemiLabel.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(patchSemiLabel.fulfilled, (state,action) => {
            state.item=SemiLabelService.itemFromJson(state.remains,state.item,action.payload.data.data)
            state.statusAction="completed"
        })
        .addCase(patchSemiLabel.pending, (state, _action) => {
            state.statusAction="loading"
            state.showAlert=false
        })
        .addCase(patchSemiLabel.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(addLabel.fulfilled, (state,action) => {
            //console.log(action.payload.data.data)
            state.product=action.payload.data.data
            state.label=action.payload.data.data
            state.labelStatus="completed"
            state.labbelAction="VIE"
        })
        .addCase(addLabel.pending, (state, _action) => {
            state.labelStatus="loading"
        })
        .addCase(addLabel.rejected, (state, action) => {
            const error=Object(action.payload)
            state.labelStatus="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(updateLabel.fulfilled, (state,action) => {
            state.product=action.payload.data.data
           
            state.labelStatus="completed"
            state.labbelAction="VIE"
        })
        .addCase(updateLabel.pending, (state, _action) => {
            state.labelStatus="loading"
        })
        .addCase(updateLabel.rejected, (state, action) => {
            const error=Object(action.payload)
            state.labelStatus="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(deleteLabel.fulfilled, (state) => {
            state.labelStatus="completed"
            state.labbelAction="INS"
            state.product=ProductModel.initial()
        })
        .addCase(deleteLabel.pending, (state, _action) => {
            state.labelStatus="loading"
        })
        .addCase(deleteLabel.rejected, (state, action) => {
            const error=Object(action.payload)
            state.labelStatus="failed"
            state.error=errorMessage(error,false)
        })
    }
})
export const { 
    selectItem,
    selectProduct,
    selectRemain,
    changeAction,
    changeLabelAction,
    clearActionState,
    clearLabelActionState,
    clearState,
    selectRemainById,
    selectItemById,
    selectProductById,
    setRemains,
    updateProductField
} = semiLabelSlice.actions
export default semiLabelSlice.reducer