import { createSlice } from "@reduxjs/toolkit"
import { ActionSliceState } from "../state"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage } from "../../utils/util"
import { ProductExportService } from "../../services/ProductExport.servicce"
import { ProductExportModel } from "../../model/ProductExport.model"

interface ProductExportState extends ActionSliceState{
    list:ProductExportModel[]
    item:ProductExportModel
    pageFilters:{from:Date,to:Date}
}

const initialState:ProductExportState={
    list: [],
    item: ProductExportModel.initial(),
    pageFilters:{from: new Date(),
        to: new Date()
    },
    status: 'idle',
    statusAction: 'idle',
    action: "INS"
}
export const fetchAllExport:any=commonCreateAsyncThunk({type:'productexport/fetchAll',action:ProductExportService.fetchAll})
export const addExport:any=commonCreateAsyncThunk({type:'productexport/addExport',action:ProductExportService.addExport})
export const editExport:any=commonCreateAsyncThunk({type:'productexport/editExport',action:ProductExportService.editExport})
export const deleteExport:any=commonCreateAsyncThunk({type:'productexport/deleteExport',action:ProductExportService.deleteExport})
export const restoreExport:any=commonCreateAsyncThunk({type:'productexport/restoreExport',action:ProductExportService.restoreExport})
export const productexportSlice = createSlice({
    name: 'productexport',
    initialState,
    reducers: {
        selectItem: (state, action) => {
            state.item=action.payload;
        },
        setPageFilters:(state,action)=>{
            state.pageFilters=action.payload
        },
        resetExportActionState: (state, _action) => {
            state.statusAction='idle';
        },
        changeAction:(state, action)=>{
            state.action=action.payload;
        },
        addNewProductItem:(state,action)=>{
            const item={
                _id:action.payload._id,
                code:action.payload.code,
                name:action.payload.name,
                unit:action.payload.unit??'CHI',
                quantity:1,
                age:action.payload.age,
                weight:action.payload.weight,
                stone:action.payload.stone,
                gold_weight:action.payload.weight-action.payload.stone,
                q10:(action.payload.weight-action.payload.stone)*action.payload.age/100,
                wage:action.payload.root_wage,
            }
            state.item.products.push(item)
        },
        deleteProductItem:(state,action)=>{
            const index=state.item.products.findIndex(item=>item.code=action.payload)
            switch (index) {
                case 0:
                    state.item.products.shift()
                    break;
                case state.item.products.length-1:
                    state.item.products.pop()
                    break;
                default:
                    state.item.products.splice(index,1)
                    break;
            }
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(restoreExport.fulfilled, (state, _action) => {
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(restoreExport.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(restoreExport.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(deleteExport.fulfilled, (state, _action) => {
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(deleteExport.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(deleteExport.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(editExport.fulfilled, (state, _action) => {
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(editExport.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(editExport.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(addExport.fulfilled, (state, action) => {
            //console.log(action.payload.data)
            state.action="VIE"
            state.statusAction="completed"
            state.item._id=action.payload.data.data._id
            state.item.code=action.payload.data.data.code
            console.log(state.item)
        })
        .addCase(addExport.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(addExport.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(fetchAllExport.fulfilled, (state, action) => {
            //console.log(action.payload.data)
            state.list=ProductExportService.listFromJson(action.payload.data.data)
            state.status="completed"
        })
        .addCase(fetchAllExport.pending, (state, _action) => {
            state.status="loading"
        })
        .addCase(fetchAllExport.rejected, (state, action) => {
            const error=Object(action.payload)
            state.status="failed"
            state.error=errorMessage(error,false)
        })
    },
})
export const { 
    selectItem,resetExportActionState,changeAction,addNewProductItem,deleteProductItem,setPageFilters
} = productexportSlice.actions
export default productexportSlice.reducer