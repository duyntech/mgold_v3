import { createSlice } from "@reduxjs/toolkit"
export interface AppState {
    logined: boolean
    user: any
    pawnProducts:string[]
    products:string[]
    module:string
}
const initialState: AppState = {
    logined: false,
    user: false,
    pawnProducts:[],
    products:[],
    module:''
}
export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setLogined(state, action) {
            state.logined = action.payload
        },
        setUser(state, action) {
            state.user = action.payload
        },
        setPawnProducts(state,action){
            state.pawnProducts=action.payload
        },
        setProducts(state,action){
            state.products=action.payload
        },
        setModule(state,action){
            state.module=action.payload
        }
    },
})
export const {
    setLogined, setUser,setPawnProducts,setProducts,setModule
} = appSlice.actions;

export default appSlice.reducer;