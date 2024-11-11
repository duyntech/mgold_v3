import { createSlice } from "@reduxjs/toolkit"
import { ActionSliceState } from "../state"
import { TempPawnService } from "../../services/TempPawn.service"
import { commonCreateAsyncThunk } from "../thunk"
import { deepCloneObject, errorMessage } from "../../utils/util"
import { TempPawnModel } from "../../model/TempPawn.model"

interface TempPawnState extends ActionSliceState{
    list:TempPawnModel[]
    filteredList:TempPawnModel[]
    item:TempPawnModel
    filters:{from:Date|undefined,to:Date,tab:number,fromValue:number,toValue:number,tags:string[],warehouses:string[],tagStatus:string,warehouseStatus:string}
    statusPatch: 'idle' | 'loading' | 'completed' | 'failed'
}

const initialState:TempPawnState={
    list: [],
    filteredList:[],
    item: TempPawnModel.initial(),
    filters:{from:undefined,to:new Date(),tab:0,fromValue:0,toValue:0,tags:[],warehouses:[],tagStatus:'ALL',warehouseStatus:'ALL'},
    status: 'idle',
    statusAction: 'idle',
    statusPatch:'idle',
    action: "INS"
}
export const fetchAll:any=commonCreateAsyncThunk({type:'temppawn/fetchAll',action:TempPawnService.fetchAll})
export const addItem:any=commonCreateAsyncThunk({type:'temppawn/addItem',action:TempPawnService.addItem})
export const importItem:any=commonCreateAsyncThunk({type:'temppawn/importItem',action:TempPawnService.importItem})
export const editItem:any=commonCreateAsyncThunk({type:'temppawn/editItem',action:TempPawnService.editItem})
export const editPawnTag:any=commonCreateAsyncThunk({type:'temppawn/editPawnTag',action:TempPawnService.editPawnTag})
export const deleteItem:any=commonCreateAsyncThunk({type:'temppawn/deleteItem',action:TempPawnService.deleteItem})
export const restoreItem:any=commonCreateAsyncThunk({type:'temppawn/restoreItem',action:TempPawnService.restoreItem})
export const addExtendItem:any=commonCreateAsyncThunk({type:'temppawn/addExtendItem',action:TempPawnService.addExtendItem})
export const editExtendItem:any=commonCreateAsyncThunk({type:'temppawn/editExtendItem',action:TempPawnService.editExtendItem})
export const deleteExtendItem:any=commonCreateAsyncThunk({type:'temppawn/deleteExtendItem',action:TempPawnService.deleteExtendItem})
export const patchItemByCode:any=commonCreateAsyncThunk({type:'temppawn/patchItemByCode',action:TempPawnService.patchItem})
export const redeemItem:any=commonCreateAsyncThunk({type:'temppawn/redeemItem',action:TempPawnService.redeemItem})
export const verifyItem:any=commonCreateAsyncThunk({type:'temppawn/verifyItem',action:TempPawnService.verifyItem})
export const temppawnSlice = createSlice({
    name: 'temppawn',
    initialState,
    reducers: {
        selectItem: (state, action) => {
            state.item=action.payload
            state.filteredList=TempPawnService.activeIfSelectAndDeactiveOthers(action.payload.id,state.filteredList);
        },
        setFilteredList: (state, action) => {
            state.filteredList=action.payload
        },
        resetActionState: (state, _action) => {
            state.statusAction='idle';
        },
        clearPatchState: (state, _action) => {
            state.statusPatch='idle';
        },
        changeAction:(state, action)=>{
            state.action=action.payload;
        },
        setFilters: (state, action) => {
            state.filters=action.payload
        },
        setFiltersByKey: (state, action) => {
            const update=deepCloneObject(state.filters)
            update[action.payload.key]=action.payload.value
            state.filters=update
        },
        clearExtraFilters(state){
            state.filters.fromValue=0
            state.filters.toValue=0
            state.filters.tags=[]
            state.filters.warehouses=[]
            state.filters.tagStatus="ALL"
            state.filters.warehouseStatus="ALL"
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(deleteExtendItem.fulfilled, (state) => {
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(deleteExtendItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(deleteExtendItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(editExtendItem.fulfilled, (state) => {
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(editExtendItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(editExtendItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(addExtendItem.fulfilled, (state) => {
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(addExtendItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(addExtendItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(patchItemByCode.fulfilled, (state, action) => {
            const item=TempPawnService.itemFromJson(action.payload.data.data)
            state.item=item
            //state.item.extend_records=item.extend_records
            state.action="VIE"
            state.statusPatch="completed"
        })
        .addCase(patchItemByCode.pending, (state, _action) => {
            state.statusPatch="loading"
        })
        .addCase(patchItemByCode.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusPatch="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(redeemItem.fulfilled, (state, _action) => {
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(redeemItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(redeemItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(verifyItem.fulfilled, (state, _action) => {
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(verifyItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(verifyItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
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
        .addCase(editItem.fulfilled, (state, action) => {
            state.item=TempPawnService.itemFromJson(action.payload.data.data)
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
        .addCase(editPawnTag.fulfilled, (state, action) => {
            state.item=TempPawnService.itemFromJson(action.payload.data.data)
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(editPawnTag.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(editPawnTag.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(addItem.fulfilled, (state, action) => {
            state.item=TempPawnService.itemFromJson(action.payload.data.data)
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
        .addCase(importItem.fulfilled, (state) => {
            state.statusAction="completed"
        })
        .addCase(importItem.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(importItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(fetchAll.fulfilled, (state, action) => {
            state.list=TempPawnService.listFromJson(action.payload.data.data??[])
            state.filteredList=state.list
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
    selectItem,resetActionState,changeAction,setFilteredList,setFilters,clearPatchState,setFiltersByKey,clearExtraFilters
} = temppawnSlice.actions
export default temppawnSlice.reducer