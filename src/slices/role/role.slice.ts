import { createSlice } from '@reduxjs/toolkit'
import { RoleModel } from '../../model/Role.model'
import { ActionSliceState } from '../state'
import { RoleService } from '../../services/Role.service'
import { commonCreateAsyncThunk } from '../thunk'
import { errorMessage } from '../../utils/util'

interface RoleState extends ActionSliceState {
    roles: RoleModel[]
    filteredList: RoleModel[]
    item: RoleModel
}
const initialState: RoleState = {
    roles: [],
    filteredList:[],
    item: RoleModel.initial(),
    status: 'idle',
    statusAction: 'idle',
    action: 'INS'
}
export const funcsByRole:any=commonCreateAsyncThunk({type:'role/funcsByRole',action:RoleService.funcsByRole})
export const fetchAll:any=commonCreateAsyncThunk({type:'role/fetchAll',action:RoleService.fetchAll})
export const addItem:any=commonCreateAsyncThunk({type:'role/addItem',action:RoleService.addItem})
export const editItem:any=commonCreateAsyncThunk({type:'role/editItem',action:RoleService.editItem})
export const deleteItem:any=commonCreateAsyncThunk({type:'role/deleteItem',action:RoleService.deleteItem})
export const restoreItem:any=commonCreateAsyncThunk({type:'role/restoreItem',action:RoleService.restoreItem})

export const roleSlice = createSlice({
    name: 'role',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=RoleService.activeIfSelectAndDeactiveOthers(action.payload.id,state.filteredList);
            state.item = action.payload
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
        .addCase(funcsByRole.fulfilled, (state, action) => {
            const funcs=RoleService.funcsFromJson(action.payload.data)
            state.item.permissions=funcs
            state.status="completed"
        })
        .addCase(funcsByRole.pending, (state, _action) => {
            state.status="loading"
        })
        .addCase(funcsByRole.rejected, (state, action) => {
            const error=Object(action.payload)
            state.status="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(restoreItem.fulfilled, (state, _action) => {
            // const item=RoleService.itemFromJson(action.payload.data.role)
            // state.item=item
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
            // const item=RoleService.itemFromJson(action.payload.data.role)
            // state.item=item
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
            // const item=RoleService.itemFromJson(action.payload.data.role)
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
        .addCase(addItem.fulfilled, (state, _action) => {
            // const item=RoleService.itemFromJson(action.payload.data.role)
            // state.item=item
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
            state.roles=RoleService.listFromJson(action.payload.data.roles)
            state.filteredList=state.roles
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
export const findRole = (state: RoleState, roleId: string) => {
    return state.roles.find((role) => role.id === roleId)
}
export const { 
    selectItem,resetActionState, changeAction,setFilteredList
} = roleSlice.actions
export default roleSlice.reducer
