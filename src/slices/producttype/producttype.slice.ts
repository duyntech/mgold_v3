import { createSlice } from "@reduxjs/toolkit"
import { ProductTypeModel } from "../../model"
import { ActionSliceState } from "../state"
import { ProductTypeService } from "../../services/Producttype.service"
import { commonCreateAsyncThunk } from "../thunk"
import { TreeNodeModel } from "../../model/TreeNode.model"
import { errorMessage } from "../../utils/util"
import { dropdownItem } from "../../types"

interface ProductTypeState extends ActionSliceState{
    list:TreeNodeModel[]
    filteredList:TreeNodeModel[]
    rawList:any[]
    item:ProductTypeModel
    parents:dropdownItem[]
}

const initialState:ProductTypeState={
    list: [],
    filteredList:[],
    rawList:[],
    item: ProductTypeModel.initial(),
    parents:[],
    status: 'idle',
    statusAction: 'idle',
    action: "INS"
}
export const fetchAll:any=commonCreateAsyncThunk({type:'producttype/fetchAll',action:ProductTypeService.fetchAll})
export const addItem:any=commonCreateAsyncThunk({type:'producttype/addItem',action:ProductTypeService.addItem})
export const editItem:any=commonCreateAsyncThunk({type:'producttype/editItem',action:ProductTypeService.editItem})
export const deleteItem:any=commonCreateAsyncThunk({type:'producttype/deleteItem',action:ProductTypeService.deleteItem})
export const restoreItem:any=commonCreateAsyncThunk({type:'producttype/restoreItem',action:ProductTypeService.restoreItem})
export const producttypeSlice = createSlice({
    name: 'producttype',
    initialState,
    reducers: {
        selectItem: (state, action) => {
            state.item=action.payload;
        },
        setFilteredList: (state, action) => {
            state.filteredList=action.payload
        },
        doFilterList: (state, action) => {
            state.filteredList=ProductTypeService.listFromJson(state.rawList,action.payload);
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
            state.rawList=action.payload.data!==''?action.payload.data.productTypes:[]
            state.list=ProductTypeService.listFromJson(state.rawList,'ALL')
            state.filteredList=state.list
            state.parents=ProductTypeService.parentsFromJson(state.rawList)
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

export const findProductType = (state: ProductTypeState, id: string) => {
    return state.rawList.find((type) => type._id === id)
}
export const { 
    selectItem,resetActionState,changeAction,setFilteredList,doFilterList
} = producttypeSlice.actions
export default producttypeSlice.reducer