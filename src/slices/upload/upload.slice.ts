import { createSlice } from '@reduxjs/toolkit'
import { UploadService } from '../../services/Upload.service'
import { ActionSliceState } from '../state'
import { commonCreateAsyncThunk } from '../thunk'

interface UploadState extends ActionSliceState {
    data:any
}
const initialState: UploadState = {
    data: null,
    status: 'idle',
    statusAction: 'idle',
    action: 'INS'
}
export const uploadImage:any=commonCreateAsyncThunk({type:'upload/image',action:UploadService.uploadImage})
export const deleteImage:any=commonCreateAsyncThunk({type:'upload/delete',action:UploadService.deleteImage})
export const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        resetActionState: (state, _action) => {
            state.statusAction='idle';
        },
        resetState: (state, _action) => {
            state.status='idle';
        },
    },
    extraReducers: (builder) => {
    builder
        .addCase(uploadImage.fulfilled, (state, action) => {
            state.data=action.payload.data;
            state.status='completed';
        })
        .addCase(uploadImage.pending, (state, _action) => {
            state.data=null;
            state.status='loading';
        })
        .addCase(uploadImage.rejected, (state, action) => {
            const error=Object(action.payload)
            state.status="failed"
            state.error=error.message.content??error.message
        })
        .addCase(deleteImage.fulfilled, (state, _action) => {
            state.statusAction='completed';
        })
        .addCase(deleteImage.pending, (state, _action) => {
            state.statusAction='loading';
        })
        .addCase(deleteImage.rejected, (state, action) => {
            const error=Object(action.payload)
            state.statusAction="failed"
            state.error=error.message.content??error.message
        })
    }
})
export const { 
    resetActionState,
    resetState
} = uploadSlice.actions
export default uploadSlice.reducer
