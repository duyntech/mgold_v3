
export type requestStatus = 'idle' | 'loading' | 'completed' | 'failed'
export interface RequestState {
    status: requestStatus
    error?: string
    code?: string
    data?: any
}
