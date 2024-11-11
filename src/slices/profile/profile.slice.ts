import { createSlice } from '@reduxjs/toolkit'

import { ProfileService } from '../../services/Profile.service'
import { ProfileModel } from '../../model/Profile.model'
import { ActionSliceState } from '../state'
import { commonCreateAsyncThunk } from '../thunk'
import { errorMessage } from '../../utils/util'

interface ProfileState extends ActionSliceState {
    profiles: ProfileModel[]
    filteredList: ProfileModel[]
    item:ProfileModel
    roles: string[]
    statusChangePass:'idle' | 'loading' | 'completed' | 'failed'
    statusResetGA:'idle' | 'loading' | 'completed' | 'failed'
    statusForceResetGA:'idle' | 'loading' | 'completed' | 'failed'
}
const initialState: ProfileState = {
    profiles: [],
    filteredList:[],
    roles: [],
    status: 'idle',
    statusAction: 'idle',
    statusChangePass:"idle",
    statusResetGA:"idle",
    statusForceResetGA:"idle",
    item: ProfileModel.initial(),
    action: 'INS'
}
export const fetchAll:any=commonCreateAsyncThunk({type:'profile/fetchAll',action:ProfileService.fetchAll})
export const addItem:any=commonCreateAsyncThunk({type:'profile/addItem',action:ProfileService.addItem})
export const editItem:any=commonCreateAsyncThunk({type:'profile/editItem',action:ProfileService.editItem})
export const deleteItem:any=commonCreateAsyncThunk({type:'profile/deleteItem',action:ProfileService.deleteItem})
export const restoreItem:any=commonCreateAsyncThunk({type:'profile/restoreItem',action:ProfileService.restoreItem})
export const changePassword:any=commonCreateAsyncThunk({type:'profile/changePassword',action:ProfileService.changePassword})
export const resetGA:any=commonCreateAsyncThunk({type:'profile/resetGA',action:ProfileService.resetGA})
export const forceResetGA:any=commonCreateAsyncThunk({type:'profile/forceResetGA',action:ProfileService.resetGA})
export const resetPassword:any=commonCreateAsyncThunk({type:'profile/resetPassword',action:ProfileService.resetPassword})
export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        selectItem:(state, action)=>{
            state.filteredList=ProfileService.activeIfSelectAndDeactiveOthers(action.payload.id,state.filteredList);
            state.item = action.payload
        },
        setFilteredList: (state, action) => {
            state.filteredList=action.payload
        },
        resetActionState: (state, _action) => {
        state.statusAction='idle';
        }, 
        resetChangePassState: (state, _action) => {
            state.statusChangePass='idle';
            },
        resetGAState: (state, _action) => {
            state.statusResetGA='idle';
            },
        resetForceGAState: (state, _action) => {
            state.statusForceResetGA='idle';
            }, 
        changeAction:(state, action)=>{
        state.action=action.payload;
    }
    },
    extraReducers: (builder) => {
        builder
        .addCase(forceResetGA.fulfilled, (state, _action) => {
            state.action="VIE"
            state.statusForceResetGA="completed"
        })
        .addCase(forceResetGA.pending, (state, _action) => {
            state.statusForceResetGA="loading"
        })
        .addCase(forceResetGA.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusForceResetGA="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(resetGA.fulfilled, (state, _action) => {
            state.statusResetGA="completed"
        })
        .addCase(resetGA.pending, (state, _action) => {
            state.statusResetGA="loading"
        })
        .addCase(resetGA.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusResetGA="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(resetPassword.fulfilled, (state, _action) => {
            state.action="VIE"
            state.statusAction="completed"
        })
        .addCase(resetPassword.pending, (state, _action) => {
            state.statusAction="loading"
        })
        .addCase(resetPassword.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(changePassword.fulfilled, (state, _action) => {
            state.action="VIE"
            state.statusChangePass="completed"
        })
        .addCase(changePassword.pending, (state, _action) => {
            state.statusChangePass="loading"
        })
        .addCase(changePassword.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusChangePass="failed"
            state.error=errorMessage(error,false)
        })
        .addCase(restoreItem.fulfilled, (state, action) => {
            const item=ProfileService.itemFromJson(action.payload.data.account)
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
        .addCase(deleteItem.fulfilled, (state, action) => {
            const item=ProfileService.itemFromJson(action.payload.data.account)
            state.item=item
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
            const item=ProfileService.itemFromJson(action.payload.data.account)
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
        .addCase(addItem.fulfilled, (state, action) => {
            const item=ProfileService.itemFromJson(action.payload.data.account)
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
        .addCase(fetchAll.fulfilled, (state, action) => {
            const list=ProfileService.listFromJson(action.payload.data!==''?action.payload.data.accounts:[])
            state.profiles=list
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
export const { resetActionState,resetChangePassState, selectItem,changeAction,setFilteredList,resetGAState,resetForceGAState } = profileSlice.actions
export default profileSlice.reducer
