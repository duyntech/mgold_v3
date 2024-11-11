import { createSlice } from "@reduxjs/toolkit";
import { GoldtypeModel, ProductModel, ProductTypeModel, TagModel } from "../../model";
import { ActionSliceState } from "../state";
import { ProductStorageService } from "../../services/ProductStorage.service";
import { commonCreateAsyncThunk } from "../thunk";
import { errorMessage } from "../../utils/util";
import { GoldtypeService } from "../../services/Goldtype.service";
import { ProductTypeService } from "../../services/Producttype.service";
import { TagService } from "../../services/Tag.service";
import { ProductFilterProps } from "../../types";
import { SupplierModel } from "../../model/Supplier.model";
import { SupplierService } from "../../services/Supplier.service";
import { DescriptionModel } from "../../model/Description.model";
import { DescriptionService } from "../../services/Description.service";
import { CounterModel } from "../../model/Counter.model";
import { CounterService } from "../../services/Counter.service";

interface ProductStorageState extends ActionSliceState{
    list:ProductModel[]
    filters:ProductFilterProps,
    filteredList:ProductModel[]
    item:ProductModel
    goldTypes:GoldtypeModel[]
    productTypes:ProductTypeModel[]
    suppliers:SupplierModel[]
    tags:TagModel[]
    descriptions:DescriptionModel[]
    counters:CounterModel[]
    reload:boolean
    currentPage:number
    currentRows:number
    statusScan: 'idle' | 'loading' | 'completed' | 'failed'
    statusPrint: 'idle' | 'loading' | 'completed' | 'failed'
    statusExNewScan: 'idle' | 'loading' | 'completed' | 'failed'
    statusOldScan: 'idle' | 'loading' | 'completed' | 'failed'
    statusExOldScan: 'idle' | 'loading' | 'completed' | 'failed'
    secondStatus: 'idle' | 'loading' | 'completed' | 'failed'
}
const initialState:ProductStorageState={
    list: [],
    filters:{
        status: ["ACTIVE"],
        goldTypes: [],
        productTypes: [],
        secondProductTypes:[],
        thirdProductTypes:[],
        productTypeStatus: "ALL",
        secondProductTypeStatus: "ALL",
        thirdProductTypeStatus: "ALL",
        tags: [],
        counter:'',
        tagStatus: "ALL",
        weightFrom: 0,
        weightTo: 0,
        isNew: "ALL",
        isHot: "ALL",
        isImage: "ALL",
        isWebsite: "ALL",
        isDiscount: "ALL",
        tagQuantity:0,
        date:null
    },
    filteredList:[],
    goldTypes:[],
    productTypes:[],
    tags:[],
    counters:[],
    suppliers:[],
    descriptions:[],
    item:ProductModel.initial(),
    reload:true,
    currentPage:1,
    currentRows:10,
    status: "idle",
    secondStatus:"idle",
    statusScan: "idle",
    statusAction: "idle",
    statusExNewScan: 'idle',
    statusOldScan: 'idle',
    statusExOldScan: 'idle',
    statusPrint: "idle",
    action:"INS"
}
export const fetchAll:any=commonCreateAsyncThunk({type:'productstorage/fetchAll',action:ProductStorageService.fetchAll})
export const secondFetchAll:any=commonCreateAsyncThunk({type:'productstorage/secondFetchAll',action:ProductStorageService.fetchAll})
export const editItem:any=commonCreateAsyncThunk({type:'productstorage/editItem',action:ProductStorageService.editItem})
export const addItem:any=commonCreateAsyncThunk({type:'productstorage/addItem',action:ProductStorageService.addItem})
export const deleteItem:any=commonCreateAsyncThunk({type:'productstorage/deleteItem',action:ProductStorageService.deleteItem})
export const restoreItem:any=commonCreateAsyncThunk({type:'productstorage/restoreItem',action:ProductStorageService.restoreItem})
export const patchItem:any=commonCreateAsyncThunk({type:'productstorage/patchItem',action:ProductStorageService.patchItem})
export const patchExNewItem:any=commonCreateAsyncThunk({type:'productstorage/patchExNewItem',action:ProductStorageService.patchItem})
export const patchExOldItem:any=commonCreateAsyncThunk({type:'productstorage/patchExOldItem',action:ProductStorageService.patchItem})
export const patchOldItem:any=commonCreateAsyncThunk({type:'productstorage/patchOldItem',action:ProductStorageService.patchItem})
export const printItem:any=commonCreateAsyncThunk({type:'productstorage/printItem',action:ProductStorageService.printItem})
export const productStorageSlice = createSlice({
    name: 'productstorage',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=ProductStorageService.activeIfSelectAndDeactiveOthers(action.payload._id,state.filteredList);
            state.list=ProductStorageService.activeIfSelectAndDeactiveOthers(action.payload._id,state.list);
            state.item=action.payload
        },
        setFilters: (state, action) => {
            state.filters=action.payload
        },
        changeFilter: (state, action) => {
            state.filters=ProductStorageService.changeFilter(state.filters,action.payload)
            //console.log(state.filters)
        },
        setFilteredList: (state, action) => {
            state.filteredList=action.payload
        },
        setCurrentPage: (state, action) => {
            state.currentPage=action.payload
        },
        setCurrentRows: (state, action) => {
            state.currentRows=action.payload
        },
        setReload: (state, action) => {
            state.reload=action.payload
        },
        resetActionState: (state, _action) => {
            state.statusAction='idle';
        },
        resetExNewScanState: (state, _action) => {
            state.statusExNewScan='idle';
        },
        resetScanState: (state, _action) => {
            state.statusScan='idle';
        },
        resetOldScanState: (state, _action) => {
            state.statusOldScan='idle';
        },
        resetExOldScanState: (state, _action) => {
            state.statusExOldScan='idle';
        },
        changeAction:(state, action)=>{
            state.action=action.payload;
        },
        setGoldTypes:(state, action)=>{
            state.goldTypes=GoldtypeService.listFromJson(action.payload)
        },
        setProductTypes:(state, action)=>{
            state.productTypes=ProductTypeService.fromJson(action.payload)
        },
        setTags:(state, action)=>{
            state.tags=TagService.listFromJson(action.payload)
        },
        setDescriptions:(state, action)=>{
            state.descriptions=DescriptionService.listFromJson(action.payload)
        },
        setCounters:(state, action)=>{
            state.counters=CounterService.listFromJson(action.payload)
        },
        setSuppliers(state,action){
            //console.log(action.payload)
            state.suppliers=SupplierService.listFromJson(action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(patchOldItem.fulfilled, (state, action) => {
            const item=ProductStorageService.itemFromJson(action.payload.data.product)
            //console.log(item)
            state.item=item
            state.action="VIE"
            state.statusOldScan="completed"
        })
        .addCase(patchOldItem.pending, (state, _action) => {
            state.statusOldScan="loading"
        })
        .addCase(patchOldItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusOldScan="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(patchExOldItem.fulfilled, (state, action) => {
            const item=ProductStorageService.itemFromJson(action.payload.data.product)
            state.item=item
            state.action="VIE"
            state.statusExOldScan="completed"
        })
        .addCase(patchExOldItem.pending, (state, _action) => {
            state.statusExOldScan="loading"
        })
        .addCase(patchExOldItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusExOldScan="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(patchExNewItem.fulfilled, (state, action) => {
            const item=ProductStorageService.itemFromJson(action.payload.data.product)
            state.item=item
            state.action="VIE"
            state.statusExNewScan="completed"
        })
        .addCase(patchExNewItem.pending, (state, _action) => {
            state.statusExNewScan="loading"
        })
        .addCase(patchExNewItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusExNewScan="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(patchItem.fulfilled, (state, action) => {
            const item=ProductStorageService.itemFromJson(action.payload.data.product)
            state.item=item
            state.action="VIE"
            state.statusScan="completed"
        })
        .addCase(patchItem.pending, (state, _action) => {
            state.statusScan="loading"
        })
        .addCase(patchItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusScan="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(fetchAll.fulfilled, (state, action) => {
            const list=ProductStorageService.listFromJson(action.payload.data!==''?action.payload.data.products:[])
            state.list=list
            state.filteredList=list
            state.reload=false
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
        .addCase(secondFetchAll.fulfilled, (state, action) => {
            const list=ProductStorageService.listFromJson(action.payload.data!==''?action.payload.data.products:[])
            state.list=[...state.list,...list]
            state.filteredList=state.list
            state.reload=false
            state.secondStatus="completed"
        })
        .addCase(secondFetchAll.pending, (state, _action) => {
            state.secondStatus="loading"
        })
        .addCase(secondFetchAll.rejected, (state, action) => {
            const error=Object(action.payload)
            state.secondStatus="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(addItem.fulfilled, (state, action) => {
            const item=ProductStorageService.itemFromJson(action.payload.data.product)
            state.item=item
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
        .addCase(editItem.fulfilled, (state, action) => {
            //console.log(action.payload.data)
            const item=ProductStorageService.itemFromJson(action.payload.data.product)
            state.item=item
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
        .addCase(deleteItem.fulfilled, (state, _action) => {
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
        .addCase(restoreItem.fulfilled, (state, action) => {
            const item=ProductStorageService.itemFromJson(action.payload.data.product)
            state.item=item
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
        .addCase(printItem.fulfilled, (state) => {
            
            state.statusPrint="completed"
        })
        .addCase(printItem.pending, (state) => {
            state.statusPrint="loading"
        })
        .addCase(printItem.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusPrint="failed"
            state.error=errorMessage(error,false)
        })
    }
})
export const { 
    selectItem,
    setFilters,
    setFilteredList,
    setCurrentPage,
    setCurrentRows,
    setReload,
    resetActionState,
    resetExNewScanState,
    resetExOldScanState,
    resetOldScanState,
    resetScanState,
    changeAction,
    setGoldTypes,
    setProductTypes,
    setTags,
    changeFilter,
    setSuppliers,
    setDescriptions,
    setCounters
} = productStorageSlice.actions
export default productStorageSlice.reducer