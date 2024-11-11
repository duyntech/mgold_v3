import { createSlice } from "@reduxjs/toolkit"
import { BasicSliceState } from "../state"
import { commonCreateAsyncThunk } from "../thunk"
import { errorMessage } from "../../utils/util"
import { FingerService } from "../../services/FingerService.service"

interface FingerState extends BasicSliceState {
    registerState: BasicSliceState,
    fetchState: BasicSliceState,
    fingers: string[]
}

const initialState: FingerState = {
    registerState: { status: 'idle', action: 'VIE' },
    fetchState: { status: 'idle', action: 'VIE' },
    status: "idle",
    action: "VIE",
    fingers: [],
}
export const registerFinger: any = commonCreateAsyncThunk({ type: 'finger/register', action: FingerService.register })
export const fetchFingers: any = commonCreateAsyncThunk({ type: 'finger/fetch', action: FingerService.fetchFingers })

export const fingerSlice = createSlice({
    name: 'finger',
    initialState,
    reducers: {
        clearFingerState(state) {
            state.registerState = { status: "idle", action: 'VIE' }
            state.registerState = { status: "idle", action: 'VIE' }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerFinger.fulfilled, (state) => {
                state.registerState.status = "completed"
            })
            .addCase(registerFinger.pending, (state, _action) => {
                state.registerState.status = "loading"
            })
            .addCase(registerFinger.rejected, (state, action) => {
                const error = Object(action.payload)
                state.registerState.status = "failed"
                state.registerState.error = errorMessage(error, false)
            })
            .addCase(fetchFingers.fulfilled, (state, action) => {
                state.fetchState.status = "completed"
                let fingers = action.payload.data.data?.finger_prints;
                if (fingers)
                    state.fingers = fingers
            })
            .addCase(fetchFingers.pending, (state, _action) => {
                state.fetchState.status = "loading"
                state.fingers = []
            })
            .addCase(fetchFingers.rejected, (state, action) => {
                const error = Object(action.payload)
                state.fetchState.status = "failed"
                state.fetchState.error = errorMessage(error, false)
            })
    },
})

export const {
    clearFingerState
} = fingerSlice.actions
export default fingerSlice.reducer