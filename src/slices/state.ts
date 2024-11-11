import { actions } from "../types"

export interface BasicSliceState {
    status: 'idle' | 'loading' | 'completed' | 'failed'
    error?: string
    action:actions
}
export interface ActionSliceState {
    status: 'idle' | 'loading' | 'completed' | 'failed'
    error?: string
    statusAction: 'idle' | 'loading' | 'completed' | 'failed'
    action:actions
}
